import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, Eye, Heart, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/blog-dashboard")({
  head: () => ({
    meta: [
      { title: "My Articles — HN-GROUPE" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: BlogDashboard,
});

interface Row {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  status: "draft" | "published";
  views_count: number;
  likes_count: number;
  category: string | null;
  updated_at: string;
}

function BlogDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  const load = () => {
    if (!user) return;
    void supabase
      .from("blog_posts")
      .select("id,slug,title,excerpt,cover_url,status,views_count,likes_count,category,updated_at")
      .eq("author_id", user.id)
      .order("updated_at", { ascending: false })
      .then(({ data }) => setRows((data as Row[]) ?? []));
  };

  useEffect(load, [user]);

  const remove = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    load();
  };

  if (loading || !user) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Author Studio</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">My articles</h1>
          <p className="mt-1 text-sm text-muted-foreground">Write, edit and publish your stories.</p>
        </div>
        <Link
          to="/blog-editor/$id"
          params={{ id: "new" }}
          className="inline-flex h-10 items-center gap-1.5 rounded-md bg-[image:var(--gradient-gold)] px-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)]"
        >
          <Plus className="h-4 w-4" /> New article
        </Link>
      </div>

      {rows === null ? (
        <div className="mt-10 grid h-40 place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-border py-20 text-center">
          <p className="font-medium">No articles yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Click "New article" to start writing.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {rows.map((r) => (
            <article
              key={r.id}
              className="group flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-surface/40 p-4 transition hover:border-primary/40 sm:flex-row"
            >
              <div className="aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-56">
                {r.cover_url ? (
                  <img src={r.cover_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/20 to-accent/10 text-xs text-muted-foreground">
                    No cover
                  </div>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      r.status === "published"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-amber-500/15 text-amber-400"
                    }`}
                  >
                    {r.status}
                  </span>
                  {r.category && (
                    <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {r.category}
                    </span>
                  )}
                </div>
                <h2 className="mt-2 font-display text-xl font-semibold leading-tight">{r.title}</h2>
                {r.excerpt && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.excerpt}</p>
                )}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" />{r.views_count}</span>
                    <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" />{r.likes_count}</span>
                    <span>updated {new Date(r.updated_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.status === "published" && (
                      <Link
                        to="/insights/$slug"
                        params={{ slug: r.slug }}
                        className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2.5 text-xs hover:border-primary/40"
                      >
                        <ExternalLink className="h-3 w-3" /> Open
                      </Link>
                    )}
                    <Link
                      to="/blog-editor/$id"
                      params={{ id: r.id }}
                      className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2.5 text-xs hover:border-primary/40"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </Link>
                    <button
                      onClick={() => void remove(r.id)}
                      className="inline-flex h-8 items-center gap-1 rounded-md border border-destructive/40 px-2.5 text-xs text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
