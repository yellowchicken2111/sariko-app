-- ============================================================
-- Admin config: tier subscription + tax settings
-- Created FIRST — seller_profiles.tier and order snapshots FK / read from here.
-- ============================================================

create table public.admin_tier_config (
  tier            text    not null,
  commission_rate numeric not null,
  monthly_fee_usd numeric not null default 0,
  max_items       integer,      -- null = unlimited
  max_categories  integer,      -- null = unlimited
  constraint admin_tier_config_pkey primary key (tier)
);

insert into public.admin_tier_config (tier, commission_rate, monthly_fee_usd, max_items, max_categories)
values
  ('founding',   0,    0,  null, null),  -- 0% commission, early adopter sellers
  ('community',  0.19, 0,  3,    1),
  ('tindahan',   0.17, 29, 30,   5),
  ('negosyo',    0.15, 49, 90,   10),
  ('enterprise', 0.13, 89, null, null),
  ('bodega',     0,    0,  null, null)   -- negotiated: rate set via seller_profiles.commission_rate_override
on conflict (tier) do nothing;

comment on table public.admin_tier_config is
  'Source of truth for tier definitions. Changing commission_rate here does NOT affect past orders.';
comment on column public.admin_tier_config.commission_rate is
  'Default rate for this tier. Bodega = 0 because rate is negotiated per seller.';


create table public.admin_tax_config (
  key         text        not null,
  rate        numeric     not null,
  description text,
  updated_at  timestamptz not null default now(),
  constraint admin_tax_config_pkey primary key (key)
);

insert into public.admin_tax_config (key, rate, description)
values
  ('vat_rate',                   0.10,        'VAT on Sariko commission (platform service fee to sellers)'),
  ('withholding_rate_goods',     0.01,        'Withholding tax for goods sellers (imported products, dry goods)'),
  ('withholding_rate_services',  0.02,        'Withholding tax for service sellers (food, tutoring, tailoring)'),
  ('annual_revenue_threshold',   100000000,   'Annual VND threshold above which withholding tax applies')
on conflict (key) do nothing;

comment on table public.admin_tax_config is
  'Platform-wide tax settings. Adjustable by admin. Changes apply to new orders only.';
