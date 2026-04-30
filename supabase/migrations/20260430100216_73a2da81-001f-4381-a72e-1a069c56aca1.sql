-- ============ JOB APPLICATIONS ============
CREATE TYPE public.application_status AS ENUM ('new', 'in_review', 'shortlisted', 'interviewed', 'hired', 'rejected');

CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  specialty text NOT NULL,
  message text,
  cv_path text,
  status public.application_status NOT NULL DEFAULT 'new',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit application"
  ON public.job_applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins read applications"
  ON public.job_applications FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins update applications"
  ON public.job_applications FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins delete applications"
  ON public.job_applications FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE TRIGGER trg_apps_updated BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.job_applications;

-- ============ BLOG POSTS ============
CREATE TYPE public.post_status AS ENUM ('draft', 'published', 'scheduled');

CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL DEFAULT '',
  cover_url text,
  category text,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  status public.post_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  author_id uuid,
  author_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads published posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'published' OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins manage posts"
  ON public.blog_posts FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE TRIGGER trg_posts_updated BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_posts_status_published ON public.blog_posts (status, published_at DESC);

-- ============ STORAGE BUCKETS ============
INSERT INTO storage.buckets (id, name, public) VALUES ('cvs', 'cvs', false)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-media', 'blog-media', true)
  ON CONFLICT (id) DO NOTHING;

-- CV bucket policies (private)
CREATE POLICY "Anyone can upload CV"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'cvs');

CREATE POLICY "Admins read CVs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cvs' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)));

CREATE POLICY "Admins delete CVs"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'cvs' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)));

-- Blog media (public read, admin write)
CREATE POLICY "Public reads blog media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-media');

CREATE POLICY "Admins upload blog media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-media' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)));

CREATE POLICY "Admins delete blog media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'blog-media' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)));