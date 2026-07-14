import base64

from clients.supabase import get_supabase_client

BUCKET = "sariko-public"


def upload_image_base64(path: str, image_base64: str, content_type: str = "image/jpeg") -> str:
    """Upload a base64-encoded image to the public bucket and return its public URL.

    Runs under the service role (bypasses storage RLS) — the browser cannot upload
    directly because auth.uid() is not populated in the storage-api context under
    this project's asymmetric (ES256) JWTs.

    Accepts a raw base64 string or a data URL ("data:image/png;base64,...").
    """
    if image_base64.startswith("data:"):
        header, image_base64 = image_base64.split(",", 1)
        if ":" in header and ";" in header:
            content_type = header.split(":", 1)[1].split(";", 1)[0] or content_type

    content = base64.b64decode(image_base64)
    client = get_supabase_client()
    client.storage.from_(BUCKET).upload(
        path, content, {"content-type": content_type, "upsert": "true"}
    )
    return client.storage.from_(BUCKET).get_public_url(path).rstrip("?")
