import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Save, Eye, ImagePlus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

type Status = "draft" | "published" | "scheduled";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  category: string | null;
  tags: string[];
  status: Status;
  published_at: string | null;
}

const Schema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(3).max(120).regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, hyphens only"),
  excerpt: z.string().trim().max(300).optional().or(z.literal("")),
  content: z.string().min(1).max(50000),
  category: z.string().trim().max(60).optional().or(z.literal("")),
});

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 120);

export const Route = createFileRoute("/admin/blog/$id")({
  component: BlogEditor,
});

function BlogEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState<Post>({
    id: "",
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    cover_url: null,
    category: "",
    tags: [],
    status: "draft",
    published_at: null,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (isNew) return;
    void supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        if (data) {
          const p = data as unknown as Post;
          setPost(p);
          setTagsInput((p.tags ?? []).join(", "));
        }
        setLoading(false);
      });
  }, [id, isNew]);

  const uploadCover = async (file: File) => {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `covers/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("blog-media").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("blog-media").getPublicUrl(path);
    setPost((p) => ({ ...p, cover_url: data.publicUrl }));
    toast.success("Cover uploaded");
  };

  const insertImage = async (file: File) => {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `inline/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("blog-media").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("blog-media").getPublicUrl(path);
    setPost((p) => ({ ...p, content: p.content + `\n\n![image](${data.publicUrl})\n\n` }));
    toast.success("Image inserted");
  };

  const save = async (publish?: boolean) => {
    const parsed = Schema.safeParse(post);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setSaving(true);
    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const status: Status = publish ? "published" : post.status;
      const payload = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || null,
        content: post.content,
        cover_url: post.cover_url,
        category: post.category || null,
        tags,
        status,
        published_at:
          status === "published" && !post.published_at ? new Date().toISOString() : post.published_at,
        author_id: user?.id ?? null,
        author_name: user?.email ?? null,
      };
      if (isNew) {
        const { data, error } = await supabase.from("blog_posts").insert(payload).select("id").single();
        if (error) throw error;
        toast.success("Post created");
        void navigate({ to: "/admin/blog/$id", params: { id: data.id } });
      } else {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", id);
        if (error) throw error;
        toast.success(publish ? "Published" : "Saved");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="grid h-40 place-items-center rounded-2xl border border-border">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <button
            onClick={() => void navigate({ to: "/admin/blog" })}
            className="mb-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-3 w-3" /> Back to posts
          </button>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            {isNew ? "New post" : "Edit post"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview((p) => !p)}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:border-primary/40"
          >
            <Eye className="h-3.5 w-3.5" /> {preview ? "Edit" : "Preview"}
          </button>
          <button
            disabled={saving}
            onClick={() => void save(false)}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:border-primary/40 disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5" /> Save draft
          </button>
          <button
            disabled={saving}
            onClick={() => void save(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Publish"}
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <input
            value={post.title}
            onChange={(e) => {
              const t = e.target.value;
              setPost((p) => ({ ...p, title: t, slug: isNew && !p.slug ? slugify(t) : p.slug }));
            }}
            placeholder="Post title…"
            className="w-full rounded-xl border border-border bg-surface/40 px-4 py-3 font-display text-2xl font-bold outline-none focus:border-primary"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Slug (URL)"
              value={post.slug}
              onChange={(v) => setPost((p) => ({ ...p, slug: slugify(v) }))}
            />
            <Field
              label="Category"
              value={post.category ?? ""}
              onChange={(v) => setPost((p) => ({ ...p, category: v }))}
              placeholder="e.g. Engineering, News"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Excerpt</label>
            <textarea
              value={post.excerpt ?? ""}
              onChange={(e) => setPost((p) => ({ ...p, excerpt: e.target.value }))}
              rows={2}
              maxLength={300}
              className="w-full rounded-lg border border-border bg-surface/40 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          {preview ? (
            <article className="prose prose-invert min-h-[400px] max-w-none rounded-xl border border-border bg-surface/40 p-6">
              {post.cover_url && <img src={post.cover_url} alt="" className="rounded-lg" />}
              <h1>{post.title}</h1>
              <RichPreview content={post.content} />
            </article>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">
                  Content (Markdown supported: ## heading, **bold**, [link](url), ![alt](img))
                </label>
                <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-primary hover:underline">
                  <ImagePlus className="h-3.5 w-3.5" /> Insert image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void insertImage(f);
                    }}
                  />
                </label>
              </div>
              <textarea
                value={post.content}
                onChange={(e) => setPost((p) => ({ ...p, content: e.target.value }))}
                rows={20}
                className="w-full rounded-xl border border-border bg-surface/40 px-4 py-3 font-mono text-sm outline-none focus:border-primary"
                placeholder="Write your story…"
              />
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-border bg-surface/40 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cover image
            </h3>
            {post.cover_url ? (
              <div className="space-y-2">
                <img src={post.cover_url} alt="" className="aspect-video w-full rounded-lg object-cover" />
                <button
                  onClick={() => setPost((p) => ({ ...p, cover_url: null }))}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Remove cover
                </button>
              </div>
            ) : (
              <label className="grid aspect-video cursor-pointer place-items-center rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary/40 hover:text-primary">
                <span className="inline-flex items-center gap-2">
                  <ImagePlus className="h-4 w-4" /> Upload cover
                </span>
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
            )}
          </section>

          <section className="rounded-xl border border-border bg-surface/40 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tags
            </h3>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="comma, separated, tags"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </section>

          <section className="rounded-xl border border-border bg-surface/40 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </h3>
            <select
              value={post.status}
              onChange={(e) => setPost((p) => ({ ...p, status: e.target.value as Status }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
            {post.status === "scheduled" && (
              <input
                type="datetime-local"
                value={post.published_at?.slice(0, 16) ?? ""}
                onChange={(e) =>
                  setPost((p) => ({
                    ...p,
                    published_at: e.target.value ? new Date(e.target.value).toISOString() : null,
                  }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-surface/40 px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

// Lightweight markdown-ish preview (safe — no raw HTML injection)
function RichPreview({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/);
  return (
    <>
      {blocks.map((b, i) => {
        const img = b.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (img) return <img key={i} src={img[2]} alt={img[1]} className="rounded-lg" />;
        if (b.startsWith("## ")) return <h2 key={i}>{b.slice(3)}</h2>;
        if (b.startsWith("# ")) return <h1 key={i}>{b.slice(2)}</h1>;
        return (
          <p key={i}>
            {b.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j}>{part.slice(2, -2)}</strong>
              ) : (
                <span key={j}>{part}</span>
              ),
            )}
          </p>
        );
      })}
    </>
  );
}
