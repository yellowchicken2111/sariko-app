# SQL

Schema, functions, and RLS for the Sariko database (Supabase / Postgres).

## Layout

```
master.sql          ← run ONCE on a fresh DB (paste into Supabase SQL Editor)
build_master.sh     ← regenerates master.sql from the sources below
tables/             ← schema, one file per table group, numbered in dependency order
functions/          ← functions + triggers
policies/           ← all RLS policies + grants + realtime, organized by table
archive/            ← superseded migrations & the pre-refactor files (history only)
```

`master.sql` is **generated** — do not edit it directly. It is the concatenation of
`tables/*.sql` → `functions/functions.sql` → `policies/rls.sql`, which is also the
order in which they must run (tables before the functions/policies that reference them).

## Provision a new database

Paste the whole of `master.sql` into the Supabase SQL Editor and run it once.
(Supabase SQL Editor does not support `\i` includes, so a single self-contained
file is the only thing that runs there.)

## Change the schema

1. Edit the relevant file under `tables/`, `functions/`, or `policies/`.
2. Regenerate the master: `./build_master.sh`
3. Apply the change to the live DB with a small `ALTER`/`CREATE` in the SQL Editor
   (master.sql is for fresh provisioning, not for migrating an existing DB).

## Notes / known issues

- **Dependency order** matters: `admin_config` (tier/tax) → `users` → `seller_profiles`
  → … → `admin_payouts` (before `orders`, which FKs it) → `orders` → … → `refunds`
  (before `payments`, which FKs it) → `chat`.
- **`handle_user_create` is defined twice** in `functions/functions.sql` with the same
  name — the second overwrites the first (see the ⚠️ comment there). Preserved as-is;
  likely wants two distinct functions/triggers. Review before relying on signup insert.
- **Image uploads do not use storage RLS.** They go through backend endpoints
  (service role) because `auth.uid()` is null in the storage-api context under this
  project's ES256 JWTs. The retired `storage.objects` policies are in
  `archive/storage_policies.sql`. Storage reads stay public via the bucket setting.
- The `auth.users` → `public.users` trigger that calls `handle_user_create` is
  configured in the Supabase dashboard, not in these files.
