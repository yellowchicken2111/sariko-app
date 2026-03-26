-- USERS
create table users (
    id uuid primary key default gen_random_uuid(),
    email text unique not null,
    name text,
    phone text,
    role text check (role in ('customer','seller')) default 'customer',
    is_seller boolean,
    avatar_url text,
    created_at timestamp default now()
    updated_at timestamp default now()
);

-- SELLER PROFILE
create table seller_profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    name text not null,
    description text,
    avatar_url text,
    cover_url text,
    address text,
    lat numeric,
    lng numeric,
    is_open boolean default true,
    opening_time time,
    closing_time time,
    is_verified boolean default false,
    created_at timestamp default now()
);

-- MENU CATEGORY
create table menu_categories (
    id uuid primary key default gen_random_uuid(),
    seller_id uuid references seller_profiles(id) on delete cascade,
    name text not null,
    sort_order int default 0
);

-- FOOD ITEM
create table food_items (
    id uuid primary key default gen_random_uuid(),
    seller_id uuid references seller_profiles(id) on delete cascade,
    category_id uuid references menu_categories(id) on delete set null,
    name text not null,
    description text,
    price numeric not null,
    unit_label text,
    min_quantity int default 1,
    quantity_step int default 1,
    preorder_day int default 0,
    is_available boolean default true,
    image_url text,
    created_at timestamp default now()
);

-- CART
create table carts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    seller_id uuid references seller_profiles(id),
    created_at timestamp default now()
);

-- CART ITEM
create table cart_items (
    id uuid primary key default gen_random_uuid(),
    cart_id uuid references carts(id) on delete cascade,
    food_item_id uuid references food_items(id),
    quantity int not null check (quantity > 0)
);

-- ORDER
create table orders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id),
    seller_id uuid references seller_profiles(id),
    status text check (status in ('pending','confirmed','ready','done','cancelled')) default 'pending',
    total_amount numeric not null,
    delivery_fee numeric default 0,
    payment_status text check (payment_status in ('pending','paid','failed')) default 'pending',
    delivery_method text check (delivery_method in ('pickup','delivery')),
    delivery_address text,
    note text,
    created_at timestamp default now()
);

-- ORDER ITEM (SNAPSHOT)
create table order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid references orders(id) on delete cascade,
    food_item_id uuid references food_items(id),
    name_snapshot text,
    price_snapshot numeric,
    unit_label_snapshot text,
    quantity int not null
);

-- REVIEW
create table reviews (
    id uuid primary key default gen_random_uuid(),
    order_id uuid references orders(id) on delete cascade,
    seller_id uuid references seller_profiles(id),
    user_id uuid references users(id),
    rating int check (rating >= 1 and rating <= 5),
    comment text,
    created_at timestamp default now()
);

-- PAYMENT
create table payments (
    id uuid primary key default gen_random_uuid(),
    order_id uuid references orders(id) on delete cascade,
    method text,
    amount numeric,
    status text,
    transaction_ref text,
    created_at timestamp default now()
);

-- DELIVERY
create table public.orders (
    id uuid not null default gen_random_uuid (),
    user_id uuid null,
    seller_id uuid null,
    status text null default 'pending'::text,
    total_amount numeric not null,
    delivery_fee numeric null default 0,
    payment_status text null default 'pending'::text,
    delivery_method text null,
    delivery_address text null,
    note text null,
    created_at timestamp without time zone null default now(),
    delivery_lat double precision null,
    delivery_lon double precision null,
    constraint orders_pkey primary key (id),
    constraint orders_seller_id_fkey foreign KEY (seller_id) references seller_profiles (id),
    constraint orders_user_id_fkey foreign KEY (user_id) references users (id),
    constraint orders_delivery_method_check check (
        (
            delivery_method = any (array['pickup'::text, 'delivery'::text])
        )
    ),
    constraint orders_payment_status_check check (
        (
            payment_status = any (
                array['pending'::text, 'paid'::text, 'failed'::text]
            )
        )
    ),
    constraint orders_status_check check (
        (
            status = any (
                array[
                'pending'::text,
                'confirmed'::text,
                'ready'::text,
                'done'::text,
                'cancelled'::text
                ]
            )
        )
    )
) TABLESPACE pg_default;

-- USER ADRESSES
create table public.user_addresses (
    id bigint generated by default as identity not null,
    user_id uuid not null,
    label text null,
    address text not null,
    lat double precision null,
    lon double precision null,
    is_default boolean not null default false,
    created_at timestamp with time zone not null default now(),
    constraint user_addresses_pkey primary key (id),
    constraint user_addresses_user_id_fkey foreign KEY (user_id) references users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

create table public.deliveries (
  id uuid not null default gen_random_uuid (),
  order_id uuid null,
  provider text null,
  status text null,
  tracking_url text null,
  driver_name text null,
  driver_phone text null,
  created_at timestamp without time zone null default now(),
  estimated_pickup_time timestamp without time zone null,
  constraint deliveries_pkey primary key (id),
  constraint deliveries_order_id_fkey foreign KEY (order_id) references orders (id) on delete CASCADE
) TABLESPACE pg_default;

-- INDEXES
create index IF not exists idx_orders_user on public.orders using btree (user_id) TABLESPACE pg_default;
create index IF not exists idx_orders_seller on public.orders using btree (seller_id) TABLESPACE pg_default;
create index idx_food_items_seller on food_items(seller_id);
create index idx_orders_user on orders(user_id);
create index idx_orders_seller on orders(seller_id);
create index idx_seller_location on seller_profiles(lat, lng);