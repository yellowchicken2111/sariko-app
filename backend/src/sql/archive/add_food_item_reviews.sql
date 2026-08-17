-- Migration: per-dish reviews + denormalised rating columns.
-- Run once against the live Supabase database (paste into the SQL Editor).
-- Sources of truth: tables/02_seller_profiles.sql, tables/03_menu.sql,
-- tables/07_reviews.sql, functions/functions.sql.

-- ── reviews: add the per-dish dimension ────────────────────────────────────
alter table public.reviews
  add column if not exists food_item_id uuid null;

alter table public.reviews
  drop constraint if exists reviews_food_item_id_fkey;

alter table public.reviews
  add constraint reviews_food_item_id_fkey
  foreign key (food_item_id) references public.food_items (id) on delete cascade;

-- Split uniqueness: Postgres treats every NULL as distinct, so a plain
-- unique (order_id, food_item_id) would accept two overall rows per order.
create unique index if not exists uniq_review_order_item
  on public.reviews (order_id, food_item_id)
  where food_item_id is not null;

create unique index if not exists uniq_review_order_overall
  on public.reviews (order_id)
  where food_item_id is null;

-- order_id is the hottest lookup and Postgres does not index FK columns automatically.
-- Measured on a 5k-order / 7k-review dataset: the orders-list query drops from 61 ms
-- to 2.3 ms with this index. The partial unique indexes above cannot substitute —
-- each covers only half the table, so a bare order_id = ? lookup seq-scans.
create index if not exists idx_reviews_order on public.reviews (order_id);
create index if not exists idx_reviews_food_item on public.reviews (food_item_id);
create index if not exists idx_reviews_seller on public.reviews (seller_id);

-- Pre-existing gap, not introduced here: order detail embeds order_items and polls
-- every 10 seconds.
create index if not exists idx_order_items_order on public.order_items (order_id);

-- ── denormalised rating columns ────────────────────────────────────────────
alter table public.food_items
  add column if not exists rating_avg numeric null,
  add column if not exists rating_count integer not null default 0;

alter table public.seller_profiles
  add column if not exists rating_avg numeric null,
  add column if not exists rating_count integer not null default 0;

comment on column public.food_items.rating_avg is
  'Denormalised from reviews (per-dish rows only). Maintained by the on_review_change
   trigger — never write it by hand. NULL until the first review.';
comment on column public.seller_profiles.rating_avg is
  'Denormalised from reviews (overall rows only, food_item_id is null). Maintained by
   the on_review_change trigger — never write it by hand. NULL until the first review.';

-- ── trigger that maintains them ────────────────────────────────────────────
create or replace function public.recalc_review_ratings () returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
declare
  v_food_item_id uuid;
  v_seller_id    uuid;
begin
  -- NEW is unassigned on DELETE, so pick the source row explicitly.
  if tg_op = 'DELETE' then
    v_food_item_id := old.food_item_id;
    v_seller_id    := old.seller_id;
  else
    v_food_item_id := new.food_item_id;
    v_seller_id    := new.seller_id;
  end if;

  if v_food_item_id is not null then
    update public.food_items f
       set rating_avg   = sub.avg_rating,
           rating_count = sub.cnt
      from (
        select round(avg(rating)::numeric, 1) as avg_rating,
               count(*)                       as cnt
          from public.reviews
         where food_item_id = v_food_item_id
      ) sub
     where f.id = v_food_item_id;

  elsif v_seller_id is not null then
    update public.seller_profiles s
       set rating_avg   = sub.avg_rating,
           rating_count = sub.cnt
      from (
        select round(avg(rating)::numeric, 1) as avg_rating,
               count(*)                       as cnt
          from public.reviews
         where seller_id = v_seller_id
           and food_item_id is null
      ) sub
     where s.id = v_seller_id;
  end if;

  return null;
end;
$$;

drop trigger if exists on_review_change on public.reviews;
create trigger on_review_change
  after insert or update or delete on public.reviews
  for each row
  execute function public.recalc_review_ratings ();

-- ── backfill any reviews that already exist ────────────────────────────────
-- No-op on a database that has never had a review row.
update public.seller_profiles s
   set rating_avg   = sub.avg_rating,
       rating_count = sub.cnt
  from (
    select seller_id,
           round(avg(rating)::numeric, 1) as avg_rating,
           count(*)                       as cnt
      from public.reviews
     where food_item_id is null
       and seller_id is not null
     group by seller_id
  ) sub
 where s.id = sub.seller_id;
