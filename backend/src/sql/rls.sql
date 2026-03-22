alter table users enable row level security;
alter table seller_profiles enable row level security;
alter table menu_categories enable row level security;
alter table food_items enable row level security;
alter table carts enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table reviews enable row level security;
alter table payments enable row level security;
alter table deliveries enable row level security;

-- USERS
create policy "users can read own profile"
on users for select
using (id = auth.uid());

-- SELLER PROFILES
create policy "users can update own profile"
on users for update
using (id = auth.uid());

-- MENU CATEGORIES
create policy "public read categories"
on menu_categories for select
using (true);

create policy "seller manage categories"
on menu_categories for all
using (
    seller_id in (
        select id from seller_profiles where user_id = auth.uid()
    )
)
with check (
    seller_id in (
        select id from seller_profiles where user_id = auth.uid()
    )
);

-- FOOD ITEMS
create policy "public read food"
on food_items for select
using (is_available = true);

create policy "seller manage food"
on food_items for all
using (
    seller_id in (
        select id from seller_profiles where user_id = auth.uid()
    )
)
with check (
    seller_id in (
        select id from seller_profiles where user_id = auth.uid()
    )
);

-- CARTS
create policy "user manage own cart"
on carts for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- CART ITEMS
create policy "user manage own cart items"
on cart_items for all
using (
    cart_id in (
        select id from carts where user_id = auth.uid()
    )
)
with check (
    cart_id in (
        select id from carts where user_id = auth.uid()
    )
);


-- ORDERS
create policy "user read own orders"
on orders for select
using (
    user_id = auth.uid()
    or seller_id in (
        select id from seller_profiles where user_id = auth.uid()
    )
);

create policy "user create order"
on orders for insert
with check (user_id = auth.uid());

create policy "seller update order status"
on orders for update
using (
    seller_id in (
        select id from seller_profiles where user_id = auth.uid()
    )
);

-- ORDER ITEMS
create policy "read order items of accessible orders"
on order_items for select
using (
    order_id in (
        select id from orders
        where user_id = auth.uid()
        or seller_id in (
            select id from seller_profiles where user_id = auth.uid()
        )
    )
);

-- REVIEWS
create policy "public read reviews"
on reviews for select
using (true);

create policy "user write own review"
on reviews for insert
with check (user_id = auth.uid());

-- PAYMENTS
create policy "user read own payments"
on payments for select
using (
    order_id in (
        select id from orders where user_id = auth.uid()
    )
);

-- DELIVERIES
create policy "read delivery of accessible orders"
on deliveries for select
using (
    order_id in (
        select id from orders
        where user_id = auth.uid()
        or seller_id in (
            select id from seller_profiles where user_id = auth.uid()
        )
    )
);