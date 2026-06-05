
-- 1) Restrict public reads of site_settings: hide rows whose key ends with "_private"
DROP POLICY IF EXISTS "Anyone can read settings" ON public.site_settings;
CREATE POLICY "Public can read non-private settings"
  ON public.site_settings
  FOR SELECT
  USING (key NOT LIKE '%\_private' ESCAPE '\');

-- 2) Move owner's personal email/phone/whatsapp into a private row.
-- Keep public "contact" row but strip personal data (admin can later replace with business contact).
INSERT INTO public.site_settings (key, value)
SELECT 'contact_private', value
FROM public.site_settings
WHERE key = 'contact'
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

UPDATE public.site_settings
SET value = jsonb_build_object(
  'email', '',
  'phone', '',
  'whatsapp', '',
  'calendly', COALESCE(value->>'calendly', '')
)
WHERE key = 'contact';

-- 3) Tighten CV uploads: drop the wide-open policy, replace with one that
-- requires the application/ path prefix and a pdf/doc/docx extension.
DROP POLICY IF EXISTS "Anyone can upload CV" ON storage.objects;

CREATE POLICY "Anyone can upload CV to applications prefix"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'cvs'
    AND (storage.foldername(name))[1] = 'applications'
    AND lower(storage.extension(name)) IN ('pdf', 'doc', 'docx')
  );
