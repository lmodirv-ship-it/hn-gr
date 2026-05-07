import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Save, Send, Upload, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { RichEditor } from "@/components/blog/RichEditor";

export const Route = createFileRoute("/blog-editor/$id")({
  head: () => ({
    meta: [
      { title: "Article editor — HN-GROUPE" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EditorPage,
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0600-\u06FF-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function readingTime(html: string) {
  const words = html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

interface FormState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string;
  video_url: string;
  category: string;
  tags: string;
  lang: string;
  seo_title: string;
  seo_description: string;
}

const empty: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_url: "",
  video_url: "",
  category: "",
  tags: "",
  lang: "en",
  seo_title: "",
  seo_description: "",
};

function EditorPage() {
  const { id } = Route.useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(empty);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [loading, setLoading] = useState(id !== "new");
  const [saving, setSaving] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) void navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (id === "new" || !user) return;
    void supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setForm({
            title: data.title ?? "",
            slug: data.slug ?? "",
            excerpt: data.excerpt ?? "",
            content: data.content ?? "",
            cover_url: data.cover_url ?? "",
            video_url: data.video_url ?? "",
            category: data.category ?? "",
            tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
            lang: data.lang ?? "en",
            seo_title: data.seo_title ?? "",
            seo_description: data.seo_description ?? "",
          });
          setStatus(data.status as "draft" | "published");
        }
        setLoading(false);
      });
  }, [id, user]);

  const update = (k: keyof FormState, v: string) =>
    setForm((p) => ({ ...p, [k]: v, ...(k === "title" && !p.slug ? { slug: slugify(v) } : {}) }));

  const uploadCover = async (file: File) => {
    if (!user) return;
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/cover-${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("blog-media").upload(path, file);
    if (error) {
      alert(error.message);
      return;
    }
    const { data } = supabase.storage.from("blog-media").getPublicUrl(path);
    update("cover_url", data.publicUrl);
  };

  const save = async (publish: boolean) => {
    if (!user) return;
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }
    setSaving(true);
    const newStatus: "draft" | "published" = publish ? "published" : status;
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = {
      title: form.title.trim(),
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt || null,
      content: form.content,
      cover_url: form.cover_url || null,
      video_url: form.video_url || null,
      category: form.category || null,
      tags,
      lang: form.lang,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      status: newStatus,
      reading_time: readingTime(form.content),
      author_id: user.id,
      author_name: user.email?.split("@")[0] ?? null,
      published_at: newStatus === "published" ? new Date().toISOString() : null,
    };

    const res =
      id === "new"
        ? await supabase.from("blog_posts").insert(payload).select("id,slug").single()
        : await supabase.from("blog_posts").update(payload).eq("id", id).select("id,slug").single();

    setSaving(false);
    if (res.error) {
      alert(res.error.message);
      return;
    }
    setStatus(newStatus);
    setSavedSlug(res.data.slug);
    if (id === "new" && res.data.id) {
      void navigate({ to: "/blog-editor/$id", params: { id: res.data.id }, replace: true });
    }
  };

  if (authLoading || loading || !user) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/blog-dashboard" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-3 w-3" /> Back to my articles
        </Link>
        <div className="flex items-center gap-2">
          {savedSlug && status === "published" && (
            <Link
              to="/insights/$slug"
              params={{ slug: savedSlug }}
              className="inline-flex h-9 items-center rounded-md border border-border px-3 text-xs hover:border-primary/40"
            >
              Preview
            </Link>
          )}
          <button
            disabled={saving}
            onClick={() => void save(false)}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm hover:border-primary/40"
          >
            <Save className="h-4 w-4" /> Save draft
          </button>
          <button
            disabled={saving}
            onClick={() => void save(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[image:var(--gradient-gold)] px-3 text-sm font-semibold text-primary-foreground"
          >
            <Send className="h-4 w-4" /> Publish
          </button>
        </div>
      </div>

      <input
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
        placeholder="Article title"
        className="w-full bg-transparent font-display text-4xl font-bold leading-tight outline-none placeholder:text-muted-foreground/40 sm:text-5xl"
      />
      <input
        value={form.slug}
        onChange={(e) => update("slug", slugify(e.target.value))}
        placeholder="article-slug"
        className="mt-2 w-full bg-transparent text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/40"
      />
      <textarea
        value={form.excerpt}
        onChange={(e) => update("excerpt", e.target.value)}
        placeholder="Short description / hook"
        rows={2}
        className="mt-3 w-full resize-none bg-transparent text-base text-muted-foreground outline-none placeholder:text-muted-foreground/40"
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          placeholder="Category"
          className="h-9 rounded-md border border-border bg-surface/30 px-3 text-sm"
        />
        <input
          value={form.tags}
          onChange={(e) => update("tags", e.target.value)}
          placeholder="tag1, tag2, tag3"
          className="h-9 rounded-md border border-border bg-surface/30 px-3 text-sm"
        />
        <select
          value={form.lang}
          onChange={(e) => update("lang", e.target.value)}
          className="h-9 rounded-md border border-border bg-surface/30 px-3 text-sm"
        >
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
        <input
          value={form.video_url}
          onChange={(e) => update("video_url", e.target.value)}
          placeholder="Video URL (optional)"
          className="h-9 rounded-md border border-border bg-surface/30 px-3 text-sm"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-border px-3 text-sm hover:border-primary/40">
          <Upload className="h-4 w-4" />
          {form.cover_url ? "Replace cover" : "Upload cover image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void uploadCover(f);
            }}
          />
        </label>
        {form.cover_url && (
          <img src={form.cover_url} alt="" className="h-12 w-20 rounded-md object-cover" />
        )}
      </div>

      <div className="mt-6">
        <RichEditor value={form.content} onChange={(html) => update("content", html)} userId={user.id} />
      </div>

      <details className="mt-8 rounded-xl border border-border bg-surface/30 p-4">
        <summary className="cursor-pointer text-sm font-semibold">SEO settings</summary>
        <div className="mt-4 grid gap-3">
          <input
            value={form.seo_title}
            onChange={(e) => update("seo_title", e.target.value)}
            placeholder="SEO title (defaults to article title)"
            className="h-9 rounded-md border border-border bg-background px-3 text-sm"
          />
          <textarea
            value={form.seo_description}
            onChange={(e) => update("seo_description", e.target.value)}
            placeholder="SEO description (defaults to excerpt)"
            rows={2}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </details>
    </main>
  );
}
