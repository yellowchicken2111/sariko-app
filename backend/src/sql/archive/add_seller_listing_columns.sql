-- Migration: is_listed on seller_profiles — admin curation for the public seller list.
-- display_order already exists in the live DB; it is only being added to
-- tables/02_seller_profiles.sql so the canonical schema matches reality.
-- Run once against the live Supabase database.

alter table public.seller_profiles
  add column if not exists is_listed boolean not null default true;

-- No backfill needed: default true keeps every existing seller visible.

comment on column public.seller_profiles.is_listed is
  'Admin curation: false = hidden from the public seller list and from featured dishes.
   Distinct from status (lifecycle: coming_soon | active) and is_open (opening hours) —
   a seller can be active + open and still be unlisted. The storefront stays reachable
   by direct slug URL; this only controls discovery.';
