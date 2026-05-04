-- =========================
-- pricing_plans
-- =========================
CREATE TABLE public.pricing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text,
  monthly_price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  project_type text,
  learn_more_path text,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  popular boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active plans"
  ON public.pricing_plans FOR SELECT
  USING (active OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Staff manage plans"
  ON public.pricing_plans FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE TRIGGER set_updated_at_pricing_plans
  BEFORE UPDATE ON public.pricing_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- pricing_cycles
-- =========================
CREATE TABLE public.pricing_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label_en text NOT NULL,
  label_ar text NOT NULL,
  suffix_en text NOT NULL,
  suffix_ar text NOT NULL,
  months integer NOT NULL,
  discount numeric NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pricing_cycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active cycles"
  ON public.pricing_cycles FOR SELECT
  USING (active OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Staff manage cycles"
  ON public.pricing_cycles FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE TRIGGER set_updated_at_pricing_cycles
  BEFORE UPDATE ON public.pricing_cycles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- Seed: default plans
-- =========================
INSERT INTO public.pricing_plans (slug, name, tagline, monthly_price, project_type, learn_more_path, features, popular, sort_order)
VALUES
  ('starter', 'Starter', 'Landing page that converts', 20, 'Website', '/web-design',
    '["1-page custom design","Mobile-first + SEO basics","Contact form + WhatsApp","Delivery in 7 days"]'::jsonb,
    false, 1),
  ('business', 'Business', 'Full website or store', 49, 'E-commerce', '/ecommerce',
    '["Up to 8 pages or 50 products","CMS / admin dashboard","Analytics + conversion tracking","Stripe / payments integration","30-day post-launch support"]'::jsonb,
    true, 2),
  ('platform', 'Custom Platform', 'SaaS, marketplace or app', 99, 'Platform', '/saas',
    '["Tailored architecture & DB","Auth, roles, dashboards","Third-party APIs & AI","Scalable cloud deploy","Dedicated team"]'::jsonb,
    false, 3);

-- =========================
-- Seed: default cycles
-- =========================
INSERT INTO public.pricing_cycles (key, label_en, label_ar, suffix_en, suffix_ar, months, discount, sort_order)
VALUES
  ('monthly',    'Monthly',  'شهر',     'month', 'شهر',     1,  0.00, 1),
  ('quarterly',  '3 months', '3 أشهر',  '3 mo',  '3 أشهر',  3,  0.05, 2),
  ('semiannual', '6 months', '6 أشهر',  '6 mo',  '6 أشهر',  6,  0.10, 3),
  ('annual',     'Yearly',   'سنة',     'year',  'سنة',     12, 0.20, 4);