-- Storage RLS policies for bucket 'sariko-public'
-- Run in Supabase SQL Editor.
--
-- Path conventions (2nd path segment identifies the owner):
--   avatar-sellers/{seller_id}/avatar.jpg   -- seller avatar   (seller_id = seller_profiles.id)
--   avatar-buyers/{user_id}/avatar.jpg      -- buyer avatar    (user_id  = auth.uid())
--   food-items/{seller_id}/{item_id}        -- food image      (seller_id = seller_profiles.id)
--
-- Reads are public (bucket is public) → no SELECT policy needed.

-- ── Owner check for seller-scoped paths ───────────────────────────────────
-- SECURITY DEFINER so the seller_profiles lookup bypasses that table's own RLS.
-- Plain subqueries in a storage policy run as `authenticated`; seller_profiles
-- has RLS with no SELECT policy, so such a subquery returns zero rows and every
-- seller upload fails with "violates row-level security policy". auth.uid()
-- still reflects the caller inside a SECURITY DEFINER function.
create or replace function public.is_my_seller(seller_id_text text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.seller_profiles
    where id::text = seller_id_text
      and user_id = auth.uid()
  );
$$;

grant execute on function public.is_my_seller(text) to authenticated;

-- ── Seller avatar ─────────────────────────────────────────────────────────
drop policy if exists "Seller insert own avatar" on storage.objects;
create policy "Seller insert own avatar"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'sariko-public'
    and (storage.foldername(name))[1] = 'avatar-sellers'
    and public.is_my_seller((storage.foldername(name))[2])
);

drop policy if exists "Seller update own avatar" on storage.objects;
create policy "Seller update own avatar"
on storage.objects for update
to authenticated
using (
    bucket_id = 'sariko-public'
    and (storage.foldername(name))[1] = 'avatar-sellers'
    and public.is_my_seller((storage.foldername(name))[2])
)
with check (
    bucket_id = 'sariko-public'
    and (storage.foldername(name))[1] = 'avatar-sellers'
    and public.is_my_seller((storage.foldername(name))[2])
);

-- ── Buyer avatar ──────────────────────────────────────────────────────────
-- Path segment is user_id = auth.uid() → no bridge needed.
drop policy if exists "Buyer insert own avatar" on storage.objects;
create policy "Buyer insert own avatar"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'sariko-public'
    and (storage.foldername(name))[1] = 'avatar-buyers'
    and (storage.foldername(name))[2] = auth.uid()::text
);

drop policy if exists "Buyer update own avatar" on storage.objects;
create policy "Buyer update own avatar"
on storage.objects for update
to authenticated
using (
    bucket_id = 'sariko-public'
    and (storage.foldername(name))[1] = 'avatar-buyers'
    and (storage.foldername(name))[2] = auth.uid()::text
)
with check (
    bucket_id = 'sariko-public'
    and (storage.foldername(name))[1] = 'avatar-buyers'
    and (storage.foldername(name))[2] = auth.uid()::text
);

-- ── Food item images ──────────────────────────────────────────────────────
drop policy if exists "Seller insert own food image" on storage.objects;
create policy "Seller insert own food image"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'sariko-public'
    and (storage.foldername(name))[1] = 'food-items'
    and public.is_my_seller((storage.foldername(name))[2])
);

drop policy if exists "Seller update own food image" on storage.objects;
create policy "Seller update own food image"
on storage.objects for update
to authenticated
using (
    bucket_id = 'sariko-public'
    and (storage.foldername(name))[1] = 'food-items'
    and public.is_my_seller((storage.foldername(name))[2])
)
with check (
    bucket_id = 'sariko-public'
    and (storage.foldername(name))[1] = 'food-items'
    and public.is_my_seller((storage.foldername(name))[2])
);
