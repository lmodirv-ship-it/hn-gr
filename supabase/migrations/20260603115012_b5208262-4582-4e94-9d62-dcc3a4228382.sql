
-- 1. Remove sensitive tables from realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.project_requests;
ALTER PUBLICATION supabase_realtime DROP TABLE public.job_applications;
ALTER PUBLICATION supabase_realtime DROP TABLE public.chat_logs;
ALTER PUBLICATION supabase_realtime DROP TABLE public.analytics_events;

-- 2. Fix activity_logs insert policy
DROP POLICY IF EXISTS "Authenticated insert activity" ON public.activity_logs;
CREATE POLICY "Authenticated insert activity"
ON public.activity_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Revoke EXECUTE on internal SECURITY DEFINER functions from anon/authenticated.
-- These are trigger functions or only used within RLS policies (where they run as definer).
REVOKE EXECUTE ON FUNCTION public.bump_post_likes() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.protect_super_admin() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, PUBLIC;
-- get_public_site_stats and increment_post_views remain callable (intentionally public).

-- 4. Drop overly-broad blog-media SELECT policy (public bucket serves via direct URL anyway)
DROP POLICY IF EXISTS "Public reads blog media" ON storage.objects;
