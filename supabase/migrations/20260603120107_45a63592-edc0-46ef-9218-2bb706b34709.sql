
-- 1. Sanitize leaked internal note in services_catalog
UPDATE public.services_catalog
SET features = '[]'::jsonb
WHERE id = '1013d1e1-3bfc-473e-b469-e036af9e100c';

-- 2. Restrict activity_logs INSERT to admin/super_admin (prevent forged audit entries)
DROP POLICY IF EXISTS "Authenticated insert activity" ON public.activity_logs;
CREATE POLICY "Admins insert activity"
ON public.activity_logs
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid() IS NOT NULL)
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
);

-- 3. Add explicit admin-only UPDATE policy on cvs storage bucket
DROP POLICY IF EXISTS "Admins update cvs" ON storage.objects;
CREATE POLICY "Admins update cvs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'cvs' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)))
WITH CHECK (bucket_id = 'cvs' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)));
