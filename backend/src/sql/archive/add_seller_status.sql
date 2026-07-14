-- Migration: add `status` to seller_profiles (coming_soon | active)
-- Run once against the live Supabase database.

alter table public.seller_profiles
  add column if not exists status text not null default 'coming_soon'::text;

alter table public.seller_profiles
  drop constraint if exists seller_profiles_status_check;

alter table public.seller_profiles
  add constraint seller_profiles_status_check
  check (status = any (array['coming_soon'::text, 'active'::text]));

-- Existing sellers already have menus / are live → mark them active.
-- (New rows default to 'coming_soon'.)
update public.seller_profiles set status = 'active';
