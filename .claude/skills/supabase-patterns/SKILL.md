# Supabase Patterns

## Client Setup
- Backend uses `supabase-py` client, initialized once in `dao/dao_base.py`
- All DAOs extend `DaoBase` which exposes `self.client` (Supabase client)
- Backend env: `SUPABASE_URL`, `SUPABASE_API_KEY` (service role key — bypasses RLS)

## Query Pattern (PostgREST)

```python
# Select with filter
res = self.client.table("orders").select("*").eq("user_id", user_id).execute()
rows = res.data  # list of dicts, empty list if no results

# Insert
res = self.client.table("orders").insert({...}).execute()
new_row = res.data[0]

# Update
res = self.client.table("orders").update({...}).eq("id", order_id).execute()

# Upsert (insert or update on conflict)
res = self.client.table("user_addresses").upsert({...}, on_conflict="user_id").execute()

# Join (PostgREST embed syntax)
res = self.client.table("orders").select("*, order_items(*, food_items(*))").eq("id", order_id).execute()
```

## Auth (Frontend)
- `lib/supabase.js` — Supabase JS client
- `authStore.js` — manages session, calls `supabase.auth.getSession()` on bootstrap
- `axiosPolicy.js` — intercepts every Axios request, injects `session.access_token` as Bearer token
- On 401: attempts `supabase.auth.refreshSession()`, retries original request

## Auth (Backend)
- `core/auth.py` — verifies JWT via Supabase JWKS endpoint (ES256 algorithm)
- `Depends(verify_token)` → injects `user_id` (UUID string) into route handler
- Public endpoints (no auth): VNPay IPN, VNPay return URL

## Row-Level Security (RLS)
- RLS policies defined in `backend/src/sql/rls.sql`
- Backend uses **service role key** → bypasses RLS (backend enforces auth via JWT check instead)
- Frontend Supabase client uses **anon key** → subject to RLS (but frontend doesn't query DB directly)

## Common Gotchas
- `res.data` is always a list, even for single-row queries — use `res.data[0]` or check `if res.data`
- PostgREST returns `[]` (not null) when no rows match — safe to iterate directly
- Upsert requires specifying `on_conflict` column name (not auto-detected)
- `preferred_language` column was added to `users` table via ALTER TABLE on Apr 9, 2026 (not in original schema migration)

## Files
- Backend client init: `backend/src/dao/dao_base.py`
- Frontend client: `frontend/src/lib/supabase.js`
- RLS policies: `backend/src/sql/rls.sql`
- Schema: `backend/src/sql/create_tables.sql`
