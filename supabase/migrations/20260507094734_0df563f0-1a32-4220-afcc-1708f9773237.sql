DROP POLICY IF EXISTS "Authors upload own blog media" ON storage.objects;
CREATE POLICY "Authors upload own blog media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-media' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Authors delete own blog media" ON storage.objects;
CREATE POLICY "Authors delete own blog media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'blog-media' AND auth.uid()::text = (storage.foldername(name))[1]);