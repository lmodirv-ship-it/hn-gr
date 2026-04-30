CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (key, value) VALUES
  ('contact', '{"email":"contact@groupe-hn.com","phone":"","whatsapp":"","calendly":""}'::jsonb),
  ('seo', '{"title":"HN-GROUPE","description":"Digital agency","ogImage":""}'::jsonb),
  ('social', '{"instagram":"","linkedin":"","twitter":"","facebook":""}'::jsonb)
ON CONFLICT (key) DO NOTHING;

CREATE TABLE public.services_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  price_from numeric,
  currency text DEFAULT 'EUR',
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.services_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read services" ON public.services_catalog FOR SELECT USING (true);
CREATE POLICY "Admins manage services" ON public.services_catalog FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_services_catalog_updated_at BEFORE UPDATE ON public.services_catalog FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  client text,
  category text,
  description text,
  image_url text,
  url text,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read portfolio" ON public.portfolio_items FOR SELECT USING (published OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage portfolio" ON public.portfolio_items FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_portfolio_items_updated_at BEFORE UPDATE ON public.portfolio_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();