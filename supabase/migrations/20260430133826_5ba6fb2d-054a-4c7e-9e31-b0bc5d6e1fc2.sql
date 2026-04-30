-- =========================================
-- 1) USER_ROLES: only super_admin manages roles
-- =========================================
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users view own roles" ON public.user_roles;

CREATE POLICY "Super admins manage roles"
ON public.user_roles FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users and admins view roles"
ON public.user_roles FOR SELECT
USING (
  auth.uid() = user_id
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'super_admin'::app_role)
);

-- =========================================
-- 2) PROFILES: clean update policies; protect owner profile from non-super admins
-- =========================================
DROP POLICY IF EXISTS "Admins update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles viewable by self or admin" ON public.profiles;

CREATE POLICY "Profiles viewable by self or staff"
ON public.profiles FOR SELECT
USING (
  auth.uid() = id
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Users update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admins can update non-owner profiles; super_admin can update any
CREATE POLICY "Staff update other profiles"
ON public.profiles FOR UPDATE
USING (
  has_role(auth.uid(), 'super_admin'::app_role)
  OR (
    has_role(auth.uid(), 'admin'::app_role)
    AND lower(coalesce(email, '')) NOT IN ('lmodirv@gmail.com', 'lmdorv@gmail.com')
  )
)
WITH CHECK (
  has_role(auth.uid(), 'super_admin'::app_role)
  OR (
    has_role(auth.uid(), 'admin'::app_role)
    AND lower(coalesce(email, '')) NOT IN ('lmodirv@gmail.com', 'lmdorv@gmail.com')
  )
);

-- =========================================
-- 3) Include super_admin in all "admin" policies for content/data tables
-- =========================================

-- analytics_events
DROP POLICY IF EXISTS "Admins can read events" ON public.analytics_events;
CREATE POLICY "Staff can read events"
ON public.analytics_events FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- chat_logs
DROP POLICY IF EXISTS "Admins can read chat logs" ON public.chat_logs;
CREATE POLICY "Staff can read chat logs"
ON public.chat_logs FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- portfolio_items
DROP POLICY IF EXISTS "Admins manage portfolio" ON public.portfolio_items;
DROP POLICY IF EXISTS "Anyone can read portfolio" ON public.portfolio_items;
CREATE POLICY "Staff manage portfolio"
ON public.portfolio_items FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));
CREATE POLICY "Anyone can read portfolio"
ON public.portfolio_items FOR SELECT
USING (
  published
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'super_admin'::app_role)
);

-- services_catalog
DROP POLICY IF EXISTS "Admins manage services" ON public.services_catalog;
CREATE POLICY "Staff manage services"
ON public.services_catalog FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- site_settings
DROP POLICY IF EXISTS "Admins manage settings" ON public.site_settings;
CREATE POLICY "Staff manage settings"
ON public.site_settings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- project_requests
DROP POLICY IF EXISTS "Admins delete requests" ON public.project_requests;
DROP POLICY IF EXISTS "Admins update requests" ON public.project_requests;
DROP POLICY IF EXISTS "Users see own requests" ON public.project_requests;
CREATE POLICY "Staff delete requests"
ON public.project_requests FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));
CREATE POLICY "Staff update requests"
ON public.project_requests FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));
CREATE POLICY "Users see own requests"
ON public.project_requests FOR SELECT
USING (
  auth.uid() = user_id
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'super_admin'::app_role)
);

-- =========================================
-- 4) Ensure trigger exists to protect super_admin role on user_roles
-- =========================================
DROP TRIGGER IF EXISTS protect_super_admin_trg ON public.user_roles;
CREATE TRIGGER protect_super_admin_trg
BEFORE UPDATE OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.protect_super_admin();

-- =========================================
-- 5) Ensure handle_new_user trigger exists on auth.users
-- =========================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();