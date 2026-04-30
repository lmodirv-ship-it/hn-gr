import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Calendar, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  category: string | null;
  published_at: string | null;
  author_name: string | null;
}

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights — HN-GROUPE" },
      { name: "description", content: "Engineering, product and business insights from the HN-GROUPE team." },
      { property: "og:title", content: "Insights — HN-GROUPE" },
      { property: "og:description", content: "Articles, case studies and news from HN-GROUPE." },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    void supabase
      .from("blog_posts")
      .select("id,slug,title,excerpt,cover_url,category,published_at,author_name")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(50)
      .then(({ data }) => setPosts((data as Post[]) ?? []));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Insights</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Ideas worth sharing</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Engineering deep-dives, product thinking and stories from the HN-GROUPE team.
        </p>
      </header>

      {posts === null ? (
        <div className="grid h-40 place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : posts.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-border py-20 text-sm text-muted-foreground">
          No published posts yet — check back soon.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.id}
              to="/insights/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-2xl border border-border bg-surface/40 backdrop-blur transition hover:border-primary/40 hover:shadow-[0_8px_40px_-12px_color-mix(in_oklab,var(--primary)_30%,transparent)]"
            >
              {p.cover_url ? (
                <img
                  src={p.cover_url}
                  alt=""
                  loading="lazy"
                  className="aspect-video w-full object-cover transition group-hover:scale-[1.02]"
                />
              ) : (
                <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-accent/10" />
              )}
              <div className="p-5">
                {p.category && (
                  <span className="inline-block rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {p.category}
                  </span>
                )}
                <h2 className="mt-3 font-display text-lg font-semibold leading-snug group-hover:text-primary">
                  {p.title}
                </h2>
                {p.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
                )}
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    {p.published_at ? new Date(p.published_at).toLocaleDateString() : "—"}
                  </span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
