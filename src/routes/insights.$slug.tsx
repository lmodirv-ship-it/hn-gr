import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { Calendar, ArrowLeft, Clock, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ArticleSocial } from "@/components/blog/ArticleSocial";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  video_url: string | null;
  category: string | null;
  tags: string[];
  published_at: string | null;
  author_name: string | null;
  reading_time: number | null;
  views_count: number;
  likes_count: number;
  seo_title: string | null;
  seo_description: string | null;
}

interface Related {
  id: string;
  slug: string;
  title: string;
  cover_url: string | null;
  excerpt: string | null;
}

export const Route = createFileRoute("/insights/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("blog_posts")
      .select(
        "id,slug,title,excerpt,content,cover_url,video_url,category,tags,published_at,author_name,reading_time,views_count,likes_count,seo_title,seo_description",
      )
      .eq("slug", params.slug)
      .eq("status", "published")
      .maybeSingle();
    if (!data) throw notFound();
    const post = data as Post;
    const { data: related } = await supabase
      .from("blog_posts")
      .select("id,slug,title,cover_url,excerpt")
      .eq("status", "published")
      .neq("id", post.id)
      .or(post.category ? `category.eq.${post.category}` : "id.neq." + post.id)
      .order("published_at", { ascending: false })
      .limit(3);
    return { post, related: (related as Related[]) ?? [] };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return {
        meta: [
          { title: "Post not found — HN-GROUPE" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${post.seo_title || post.title} — HN-GROUPE`;
    const description =
      (post.seo_description && post.seo_description.trim()) ||
      (post.excerpt && post.excerpt.trim()) ||
      post.content.replace(/<[^>]*>/g, "").trim().slice(0, 160);
    const url = `https://www.groupe-hn.com/insights/${post.slug}`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description,
      image: post.cover_url ? [post.cover_url] : undefined,
      datePublished: post.published_at ?? undefined,
      author: post.author_name
        ? { "@type": "Person", name: post.author_name }
        : { "@type": "Organization", name: "HN-GROUPE" },
      publisher: { "@type": "Organization", name: "HN-GROUPE" },
      keywords: (post.tags ?? []).join(", "),
      articleSection: post.category ?? undefined,
      mainEntityOfPage: url,
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: (post.tags ?? []).join(", ") },
        { name: "author", content: post.author_name ?? "HN-GROUPE" },
        { property: "article:published_time", content: post.published_at ?? "" },
        ...((post.tags ?? []).map((t: string) => ({ property: "article:tag", content: t }))),
        ...(post.category ? [{ property: "article:section", content: post.category }] : []),
        { property: "og:type", content: "article" },
        { property: "og:title", content: post.title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        ...(post.cover_url ? [{ property: "og:image", content: post.cover_url }] : []),
        { name: "twitter:card", content: post.cover_url ? "summary_large_image" : "summary" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: description },
        ...(post.cover_url ? [{ name: "twitter:image", content: post.cover_url }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
    };
  },
  component: PostPage,
  notFoundComponent: () => (
    <main className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-4 text-center">
      <div>
        <h1 className="font-display text-4xl font-bold">Post not found</h1>
        <Link to="/insights" className="mt-4 inline-block text-primary hover:underline">
          Back to all insights
        </Link>
      </div>
    </main>
  ),
});

function PostPage() {
  const { post, related } = Route.useLoaderData();
  const isHtml = /<[a-z][\s\S]*>/i.test(post.content);

  useEffect(() => {
    void supabase.rpc("increment_post_views", { _slug: post.slug });
  }, [post.slug]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        to="/insights"
        className="mb-6 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-3 w-3" /> All insights
      </Link>

      {post.category && (
        <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
          {post.category}
        </span>
      )}
      <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
        {post.title}
      </h1>
      {post.excerpt && (
        <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        {post.author_name && <span className="font-medium text-foreground">by {post.author_name}</span>}
        {post.published_at && (
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3 w-3" /> {new Date(post.published_at).toLocaleDateString()}
          </span>
        )}
        {post.reading_time && (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3 w-3" /> {post.reading_time} min read
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <Eye className="h-3 w-3" /> {post.views_count}
        </span>
      </div>

      {post.cover_url && (
        <img
          src={post.cover_url}
          alt={post.title}
          className="mt-8 aspect-video w-full rounded-2xl border border-border object-cover"
        />
      )}

      {post.video_url && (
        <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-border">
          {/youtu/.test(post.video_url) ? (
            <iframe
              src={post.video_url.replace("watch?v=", "embed/")}
              className="h-full w-full"
              allowFullScreen
            />
          ) : (
            <video src={post.video_url} controls className="h-full w-full" />
          )}
        </div>
      )}

      {isHtml ? (
        <article
          className="prose prose-invert mt-10 max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      ) : (
        <article className="prose prose-invert mt-10 max-w-none">
          <Markdown content={post.content} />
        </article>
      )}

      {post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
          {post.tags.map((t: string) => (
            <span key={t} className="rounded-full bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
              #{t}
            </span>
          ))}
        </div>
      )}

      <ArticleSocial postId={post.id} initialLikes={post.likes_count} initialViews={post.views_count} />

      {related.length > 0 && (
        <section className="mt-14 border-t border-border pt-8">
          <h3 className="font-display text-xl font-semibold">Related articles</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {related.map((r: Related) => (
              <Link
                key={r.id}
                to="/insights/$slug"
                params={{ slug: r.slug }}
                className="group overflow-hidden rounded-xl border border-border bg-surface/30 transition hover:border-primary/40"
              >
                {r.cover_url ? (
                  <img src={r.cover_url} alt="" className="aspect-video w-full object-cover" loading="lazy" />
                ) : (
                  <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-accent/10" />
                )}
                <div className="p-3">
                  <h4 className="line-clamp-2 text-sm font-semibold group-hover:text-primary">{r.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function Markdown({ content }: { content: string }) {
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
            {b.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**"))
                return <strong key={j}>{part.slice(2, -2)}</strong>;
              const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
              if (link)
                return (
                  <a key={j} href={link[2]} target="_blank" rel="noopener noreferrer">
                    {link[1]}
                  </a>
                );
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      })}
    </>
  );
}
