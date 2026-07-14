-- ============================================================
-- Reviews (buyer rates a completed order / seller)
-- ============================================================

create table public.reviews (
  id uuid not null default gen_random_uuid (),
  order_id uuid null,
  seller_id uuid null,
  user_id uuid null,
  rating integer null,
  comment text null,
  created_at timestamp without time zone null default now(),
  constraint reviews_pkey primary key (id),
  constraint reviews_order_id_fkey foreign KEY (order_id) references orders (id) on delete CASCADE,
  constraint reviews_seller_id_fkey foreign KEY (seller_id) references seller_profiles (id),
  constraint reviews_user_id_fkey foreign KEY (user_id) references users (id),
  constraint reviews_rating_check check (((rating >= 1) and (rating <= 5)))
) TABLESPACE pg_default;
