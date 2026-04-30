import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Plus, FileText, Edit3, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Status = "draft" | "published" | "scheduled";
interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  status: Status;
  published_at: string | null;
  updated_at: string;
}

const STATUS_CLS: Record<Status, string> = {
  draft: "bg-muted/40 text-muted-foreground",
  published: "bg-emerald-500/15 text-emerald-300",
  scheduled: "bg-amber-500/15 text-amber-300",
};

export const Route = createFileRoute("/admin/blog")({
  component: BlogListPage,
});

function BlogListPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);

  const load = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id,slug,title,excerpt,category,status,published_at,updated_at")
      .order("updated_at", { ascending: false });
    if (error) toast.error(error.message);
    setPosts((data as Post[]) ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    void load();
  };

  if (posts === null)
    return (
      <div className="grid h-40 place-items-center rounded-2xl border border-border">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Content</p>
          <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Blog · Insights</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Publish technical articles, news and case studies.
          </p>
        </div>
        <Link
          to="/admin/blog/$id"
          params={{ id: "new" }}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New post
        </Link>
      </header>

      {posts.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-border py-16">
          <FileText className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No posts yet. Create your first one.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-surface/30">
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.title}</div>
                    {p.excerpt && (
                      <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {p.excerpt}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${STATUS_CLS[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">
                    {new Date(p.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      {p.status === "published" && (
                        <Link
                          to="/insights/$slug"
                          params={{ slug: p.slug }}
                          className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
                      <Link
                        to="/admin/blog/$id"
                        params={{ id: p.id }}
                        className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-primary"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => void remove(p.id)}
                        className="rounded-md border border-border p-1.5 text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
