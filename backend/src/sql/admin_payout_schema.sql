-- ============================================================
-- Sariko Admin: Seller Payout System
-- File: admin_payout_schema.sql
-- Note: Designed to be separable into its own admin database
--       in future. All FK references to main schema are noted.
-- ============================================================


-- ============================================================
-- STEP 1: Tier subscription config (must create first — referenced by FK)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_tier_config (
  tier              text    NOT NULL,
  commission_rate   numeric NOT NULL,
  monthly_fee_usd   numeric NOT NULL DEFAULT 0,
  max_items         integer,      -- NULL = unlimited
  max_categories    integer,      -- NULL = unlimited

  CONSTRAINT admin_tier_config_pkey PRIMARY KEY (tier)
);

INSERT INTO public.admin_tier_config (tier, commission_rate, monthly_fee_usd, max_items, max_categories)
VALUES
  ('founding',   0,    0,  NULL, NULL),  -- 0% commission, early adopter sellers
  ('community',  0.19, 0,  3,    1),
  ('tindahan',   0.17, 29, 30,   5),
  ('negosyo',    0.15, 49, 90,   10),
  ('enterprise', 0.13, 89, NULL, NULL),
  ('bodega',     0,    0,  NULL, NULL)  -- negotiated: rate set via commission_rate_override
ON CONFLICT (tier) DO NOTHING;

COMMENT ON TABLE public.admin_tier_config IS
  'Source of truth for tier definitions. Changing commission_rate here does NOT affect past orders.';
COMMENT ON COLUMN public.admin_tier_config.commission_rate IS
  'Default rate for this tier. Bodega = 0 because rate is negotiated per seller.';


-- ============================================================
-- STEP 2: Extend seller_profiles (main schema)
-- tier FK → admin_tier_config, plus bank info and Bodega override
-- ============================================================

ALTER TABLE public.seller_profiles
  ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'founding',
  ADD COLUMN IF NOT EXISTS commission_rate_override numeric,  -- Bodega only
  ADD COLUMN IF NOT EXISTS tax_category text NOT NULL DEFAULT 'services'
    CONSTRAINT seller_profiles_tax_category_check CHECK (
      tax_category = ANY (ARRAY['goods', 'services'])
    ),
  ADD COLUMN IF NOT EXISTS bank_account_number text,
  ADD COLUMN IF NOT EXISTS bank_name text,
  ADD COLUMN IF NOT EXISTS bank_account_holder text;

ALTER TABLE public.seller_profiles
  ADD CONSTRAINT seller_profiles_tier_fkey
    FOREIGN KEY (tier) REFERENCES public.admin_tier_config (tier);

COMMENT ON COLUMN public.seller_profiles.commission_rate_override IS
  'Only set for bodega tier. NULL = use admin_tier_config.commission_rate.';


-- ============================================================
-- STEP 3: Admin tax config (must exist before orders snapshot)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_tax_config (
  key         text        NOT NULL,
  rate        numeric     NOT NULL,
  description text,
  updated_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT admin_tax_config_pkey PRIMARY KEY (key)
);

INSERT INTO public.admin_tax_config (key, rate, description)
VALUES
  ('vat_rate',                   0.10,        'VAT on Sariko commission (platform service fee to sellers)'),
  ('withholding_rate_goods',     0.01,        'Withholding tax for goods sellers (imported products, dry goods)'),
  ('withholding_rate_services',  0.02,        'Withholding tax for service sellers (food, tutoring, tailoring)'),
  ('annual_revenue_threshold',   100000000,   'Annual VND threshold above which withholding tax applies')
ON CONFLICT (key) DO NOTHING;

COMMENT ON TABLE public.admin_tax_config IS
  'Platform-wide tax settings. Adjustable by admin. Changes apply to new orders only.';


-- ============================================================
-- STEP 4: Extend orders (main schema)
-- Snapshot commission + VAT at order creation — immutable after insert
-- ============================================================

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS subtotal numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS commission_rate numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS commission_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vat_rate numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vat_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payout_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payout_status text NOT NULL DEFAULT 'pending'
    CONSTRAINT orders_payout_status_check CHECK (
      payout_status = ANY (ARRAY['pending', 'processing', 'paid_out'])
    ),
  ADD COLUMN IF NOT EXISTS payout_id uuid;

COMMENT ON COLUMN public.orders.commission_rate IS
  'Snapshotted from seller tier at order creation. Never changes after insert.';
COMMENT ON COLUMN public.orders.vat_rate IS
  'Snapshotted from admin_tax_config at order creation. Never changes after insert.';
COMMENT ON COLUMN public.orders.payout_amount IS
  'subtotal - commission_amount - vat_amount. Delivery fee excluded (belongs to Lalamove).';


-- ============================================================
-- STEP 5: Admin payout batches table
-- One row per weekly payout run per seller
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_payouts (
  id                  uuid        NOT NULL DEFAULT gen_random_uuid(),
  seller_id           uuid        NOT NULL,  -- FK → seller_profiles.id
  period_start        date        NOT NULL,
  period_end          date        NOT NULL,
  order_count         integer     NOT NULL DEFAULT 0,
  total_subtotal      numeric     NOT NULL DEFAULT 0,
  total_commission    numeric     NOT NULL DEFAULT 0,
  total_vat           numeric     NOT NULL DEFAULT 0,
  gross_payout        numeric     NOT NULL DEFAULT 0,  -- subtotal - commission - vat
  withholding_rate    numeric     NOT NULL DEFAULT 0,  -- snapshot at payout time
  withholding_amount  numeric     NOT NULL DEFAULT 0,
  net_payout          numeric     NOT NULL DEFAULT 0,  -- gross_payout - withholding
  status              text        NOT NULL DEFAULT 'pending'
    CONSTRAINT admin_payouts_status_check CHECK (
      status = ANY (ARRAY['pending', 'processing', 'completed', 'failed'])
    ),
  note                text,
  paid_at             timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT admin_payouts_pkey PRIMARY KEY (id),
  CONSTRAINT admin_payouts_seller_id_fkey
    FOREIGN KEY (seller_id) REFERENCES public.seller_profiles (id)
);

CREATE INDEX IF NOT EXISTS idx_admin_payouts_seller_id ON public.admin_payouts (seller_id);
CREATE INDEX IF NOT EXISTS idx_admin_payouts_status ON public.admin_payouts (status);

COMMENT ON TABLE public.admin_payouts IS
  'Weekly payout batch per seller. One row = one bank transfer to seller.';


-- ============================================================
-- STEP 6: Link orders → payout batch (FK added after table exists)
-- ============================================================

ALTER TABLE public.orders
  ADD CONSTRAINT orders_payout_id_fkey
    FOREIGN KEY (payout_id) REFERENCES public.admin_payouts (id)
    ON DELETE SET NULL;
