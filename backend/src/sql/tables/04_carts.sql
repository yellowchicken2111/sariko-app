-- ============================================================
-- Carts + cart items (one active cart per user, single-seller)
-- ============================================================

create table public.carts (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  seller_id uuid null,
  created_at timestamp without time zone null default now(),
  constraint carts_pkey primary key (id),
  constraint carts_seller_id_fkey foreign KEY (seller_id) references seller_profiles (id),
  constraint carts_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;


create table public.cart_items (
  id uuid not null default gen_random_uuid (),
  cart_id uuid null,
  food_item_id uuid null,
  quantity integer not null,
  constraint cart_items_pkey primary key (id),
  constraint cart_items_cart_id_fkey foreign KEY (cart_id) references carts (id) on delete CASCADE,
  constraint cart_items_food_item_id_fkey foreign KEY (food_item_id) references food_items (id),
  constraint cart_items_quantity_check check ((quantity > 0))
) TABLESPACE pg_default;
