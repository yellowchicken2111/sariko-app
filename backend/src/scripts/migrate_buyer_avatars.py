"""One-off migration: move buyer avatars to the new storage convention.

Old:  bucket `avatars`         path `{user_id}/{timestamp}.{ext}`
New:  bucket `sariko-public`   path `avatar-buyers/{user_id}/avatar.jpg`

For each row in public.users whose avatar_url points at the old `avatars`
bucket, this copies the file into sariko-public/avatar-buyers/{user_id}/avatar.jpg
(cross-bucket = download + re-upload), then rewrites users.avatar_url.

Requires SUPABASE_API_KEY to be the SERVICE ROLE key (needs storage write +
bypass RLS on public.users). Runs dry-run by default; pass --apply to write.

Usage (from backend/src):
    python -m scripts.migrate_buyer_avatars           # dry-run, prints plan
    python -m scripts.migrate_buyer_avatars --apply    # perform migration
"""

import argparse
import mimetypes
import os
import sys
import time
from urllib.parse import urlparse

from dotenv import load_dotenv

load_dotenv(dotenv_path=f"envs/.env.{os.environ.get('ENV', 'local')}")

from clients.supabase import get_supabase_client

OLD_BUCKET = "avatars"
NEW_BUCKET = "sariko-public"
NEW_PREFIX = "avatar-buyers"
OLD_MARKER = f"/storage/v1/object/public/{OLD_BUCKET}/"


def old_object_path(avatar_url: str):
    """Return the object path inside the `avatars` bucket, or None if not an
    old-bucket URL (external OAuth avatars, already-migrated URLs, etc.)."""
    if not avatar_url or OLD_MARKER not in avatar_url:
        return None
    tail = avatar_url.split(OLD_MARKER, 1)[1]
    tail = urlparse(tail).path if "://" in tail else tail.split("?", 1)[0]
    return tail or None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="perform the migration (default: dry-run)")
    parser.add_argument("--cleanup", action="store_true", help="delete the old file from the avatars bucket after a successful migration")
    args = parser.parse_args()

    client = get_supabase_client()

    rows = (
        client.table("users")
        .select("id, avatar_url")
        .like("avatar_url", f"%{OLD_MARKER}%")
        .execute()
        .data
        or []
    )

    print(f"Found {len(rows)} user(s) with an old-bucket avatar_url"
          f"{'' if args.apply else ' (dry-run)'}\n")

    migrated = skipped = failed = 0

    for row in rows:
        user_id = row["id"]
        src_path = old_object_path(row.get("avatar_url"))
        if not src_path:
            skipped += 1
            continue

        dest_path = f"{NEW_PREFIX}/{user_id}/avatar.jpg"
        content_type = mimetypes.guess_type(src_path)[0] or "image/jpeg"

        print(f"user {user_id}")
        print(f"  from: {OLD_BUCKET}/{src_path}")
        print(f"  to:   {NEW_BUCKET}/{dest_path}  ({content_type})")

        if not args.apply:
            migrated += 1
            continue

        try:
            blob = client.storage.from_(OLD_BUCKET).download(src_path)
            client.storage.from_(NEW_BUCKET).upload(
                dest_path,
                blob,
                {"content-type": content_type, "upsert": "true"},
            )
            public_url = client.storage.from_(NEW_BUCKET).get_public_url(dest_path).rstrip("?")
            new_url = f"{public_url}?v={int(time.time())}"
            client.table("users").update({"avatar_url": new_url}).eq("id", user_id).execute()
            print(f"  -> {new_url}")
            if args.cleanup:
                client.storage.from_(OLD_BUCKET).remove([src_path])
                print(f"  removed old: {OLD_BUCKET}/{src_path}")
            migrated += 1
        except Exception as e:
            print(f"  !! FAILED: {e}", file=sys.stderr)
            failed += 1

    verb = "migrated" if args.apply else "to migrate"
    print(f"\nDone. {migrated} {verb}, {skipped} skipped, {failed} failed.")
    if not args.apply and migrated:
        print("Re-run with --apply to perform the migration.")


if __name__ == "__main__":
    main()
