-- admin tier config
INSERT INTO public.admin_tier_config (tier, commission_rate, monthly_fee_usd, max_items, max_categories)
VALUES
  ('community',  0.19, 0,  3,    1),
  ('tindahan',   0.17, 29, 30,   5),
  ('negosyo',    0.15, 49, 90,   10),
  ('enterprise', 0.13, 89, NULL, NULL),
  ('bodega',     0,    0,  NULL, NULL)  -- negotiated: rate set via commission_rate_override
ON CONFLICT (tier) DO NOTHING;

