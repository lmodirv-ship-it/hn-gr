-- Extend blog_posts with new columns
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS lang text NOT NULL DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS reading_time int,
  ADD COLUMN IF NOT EXISTS views_count int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS likes_count int NOT NULL DEFAULT 0;

-- Allow authors to manage their own posts in addition to admins
DROP POLICY IF EXISTS "Authors manage own posts" ON public.blog_posts;
CREATE POLICY "Authors manage own posts" ON public.blog_posts
  FOR ALL TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Public can read published posts (already exists; keep as-is)

-- LIKES
CREATE TABLE IF NOT EXISTS public.blog_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone reads likes" ON public.blog_likes;
CREATE POLICY "Anyone reads likes" ON public.blog_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users like" ON public.blog_likes;
CREATE POLICY "Users like" ON public.blog_likes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users unlike" ON public.blog_likes;
CREATE POLICY "Users unlike" ON public.blog_likes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- COMMENTS
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  author_name text,
  content text NOT NULL CHECK (length(content) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone reads comments" ON public.blog_comments;
CREATE POLICY "Anyone reads comments" ON public.blog_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users post comments" ON public.blog_comments;
CREATE POLICY "Users post comments" ON public.blog_comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own comments" ON public.blog_comments;
CREATE POLICY "Users delete own comments" ON public.blog_comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));

-- LIKE COUNT TRIGGERS
CREATE OR REPLACE FUNCTION public.bump_post_likes()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.blog_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.blog_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END $$;

DROP TRIGGER IF EXISTS trg_blog_likes_count ON public.blog_likes;
CREATE TRIGGER trg_blog_likes_count
AFTER INSERT OR DELETE ON public.blog_likes
FOR EACH ROW EXECUTE FUNCTION public.bump_post_likes();

-- VIEWS RPC (anyone can call)
CREATE OR REPLACE FUNCTION public.increment_post_views(_slug text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path=public AS $$
  UPDATE public.blog_posts SET views_count = views_count + 1
  WHERE slug = _slug AND status = 'published';
$$;

GRANT EXECUTE ON FUNCTION public.increment_post_views(text) TO anon, authenticated;