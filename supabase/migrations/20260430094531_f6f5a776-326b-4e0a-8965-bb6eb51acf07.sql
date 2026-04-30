-- 1) Add super_admin to enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';

-- Commit enum change before using value
COMMIT;
BEGIN;

-- 2) Update handle_new_user to grant super_admin to owner
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));

  if new.email = 'lmodirv@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'super_admin');
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'client');
  end if;

  return new;
end;
$$;

-- 3) Promote existing owner if exists
DO $$
DECLARE owner_id uuid;
BEGIN
  SELECT id INTO owner_id FROM auth.users WHERE email = 'lmodirv@gmail.com' LIMIT 1;
  IF owner_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (owner_id, 'super_admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END$$;

-- 4) Protection trigger: prevent removing super_admin from owner
CREATE OR REPLACE FUNCTION public.protect_super_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE owner_id uuid;
BEGIN
  SELECT id INTO owner_id FROM auth.users WHERE email = 'lmodirv@gmail.com' LIMIT 1;
  IF TG_OP = 'DELETE' THEN
    IF OLD.role = 'super_admin' AND OLD.user_id = owner_id THEN
      RAISE EXCEPTION 'Super admin role of the site owner cannot be removed';
    END IF;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.role = 'super_admin' AND OLD.user_id = owner_id AND NEW.role <> 'super_admin' THEN
      RAISE EXCEPTION 'Super admin role of the site owner cannot be modified';
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END$$;

DROP TRIGGER IF EXISTS protect_super_admin_trg ON public.user_roles;
CREATE TRIGGER protect_super_admin_trg
BEFORE UPDATE OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.protect_super_admin();

-- 5) API Connectors
CREATE TABLE IF NOT EXISTS public.api_connectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  provider text NOT NULL,
  base_url text,
  description text,
  secret_name text,
  status text NOT NULL DEFAULT 'inactive',
  enabled boolean NOT NULL DEFAULT true,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.api_connectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read connectors" ON public.api_connectors FOR SELECT
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "Super admins manage connectors" ON public.api_connectors FOR ALL
USING (public.has_role(auth.uid(),'super_admin'))
WITH CHECK (public.has_role(auth.uid(),'super_admin'));

CREATE TRIGGER trg_api_connectors_updated
BEFORE UPDATE ON public.api_connectors
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6) Plugin / module manager
CREATE TABLE IF NOT EXISTS public.plugin_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  category text DEFAULT 'general',
  enabled boolean NOT NULL DEFAULT false,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.plugin_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read plugins" ON public.plugin_modules FOR SELECT
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "Super admins manage plugins" ON public.plugin_modules FOR ALL
USING (public.has_role(auth.uid(),'super_admin'))
WITH CHECK (public.has_role(auth.uid(),'super_admin'));

CREATE TRIGGER trg_plugin_modules_updated
BEFORE UPDATE ON public.plugin_modules
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default plugins
INSERT INTO public.plugin_modules (key, name, description, category, enabled) VALUES
  ('chat_assistant','AI Chat Assistant','Public site chatbot powered by Lovable AI','ai', true),
  ('analytics_tracking','Analytics Tracking','Capture page views and events','analytics', true),
  ('lead_capture','Lead Capture Forms','Project request forms on public site','marketing', true),
  ('portfolio_showcase','Portfolio Showcase','Display portfolio items publicly','content', true),
  ('newsletter','Newsletter','Email subscription module','marketing', false),
  ('billing','Billing & Invoices','Customer invoicing module','commerce', false)
ON CONFLICT (key) DO NOTHING;

-- 7) Activity logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  actor_email text,
  action text NOT NULL,
  target_type text,
  target_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read activity" ON public.activity_logs FOR SELECT
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "Authenticated insert activity" ON public.activity_logs FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL OR true);

-- 8) MFA settings (placeholder)
CREATE TABLE IF NOT EXISTS public.mfa_settings (
  user_id uuid PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT false,
  method text DEFAULT 'totp',
  enrolled_at timestamptz,
  last_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.mfa_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own MFA" ON public.mfa_settings FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read MFA" ON public.mfa_settings FOR SELECT
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));

CREATE TRIGGER trg_mfa_settings_updated
BEFORE UPDATE ON public.mfa_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMIT;