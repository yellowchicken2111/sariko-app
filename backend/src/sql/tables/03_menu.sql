-- ============================================================
-- Menu: categories + food items (both scoped to a seller_profile)
-- ============================================================

create table public.menu_categories (
  id uuid not null default gen_random_uuid (),
  seller_id uuid null,
  name text not null,
  sort_order integer null default 0,
  is_active boolean null default true,
  created_at timestamp without time zone null default now(),
  updated_at timestamp without time zone null default now(),
  constraint menu_categories_pkey primary key (id),
  constraint menu_categories_seller_id_fkey foreign KEY (seller_id) references seller_profiles (id) on delete CASCADE
) TABLESPACE pg_default;


create table public.food_items (
  id uuid not null default gen_random_uuid (),
  seller_id uuid null,
  category_id uuid null,
  name text not null,
  description text null,
  price numeric not null,
  unit_label text null,
  min_quantity integer null default 1,
  quantity_step integer null default 1,
  preorder_day integer null default 0,
  is_available boolean null default true,
  image_url text null,
  created_at timestamp without time zone null default now(),
  price_text text null,
  is_featured boolean not null default false,
  constraint food_items_pkey primary key (id),
  constraint food_items_category_id_fkey foreign KEY (category_id) references menu_categories (id) on delete set null,
  constraint food_items_seller_id_fkey foreign KEY (seller_id) references seller_profiles (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_food_items_seller on public.food_items using btree (seller_id) TABLESPACE pg_default;
