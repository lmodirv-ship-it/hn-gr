import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Calendar, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  category: string | null;
  tags: string[];
  published_at: string | null;
  author_name: string | null;
}

export const Route = createFileRoute("/insights/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("blog_posts")
      .select(
        "id,slug,title,excerpt,content,cover_url,category,tags,published_at,author_name",
      )
      .eq("slug", params.slug)
      .eq("status", "published")
      .maybeSingle();
    if (!data) throw notFound();
    return { post: data as Post };
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
    const title = `${post.title} — HN-GROUPE`;
    const description =
      (post.excerpt && post.excerpt.trim()) ||
      post.content.replace(/[#*>`_\-!\[\]()]/g, "").trim().slice(0, 160);
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
      publisher: {
        "@type": "Organization",
        name: "HN-GROUPE",
      },
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
        ...((post.tags ?? []).map((t) => ({ property: "article:tag", content: t }))),
        ...(post.category ? [{ property: "article:section", content: post.category }] : []),
        // Open Graph
        { property: "og:type", content: "article" },
        { property: "og:title", content: post.title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        ...(post.cover_url ? [{ property: "og:image", content: post.cover_url }] : []),
        // Twitter
        { name: "twitter:card", content: post.cover_url ? "summary_large_image" : "summary" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: description },
        ...(post.cover_url ? [{ name: "twitter:image", content: post.cover_url }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd),
        },
      ],
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
  const { post } = Route.useLoaderData();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
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
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        {post.published_at && (
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />{" "}
            {new Date(post.published_at).toLocaleDateString()}
          </span>
        )}
        {post.author_name && <span>by {post.author_name}</span>}
      </div>

      {post.cover_url && (
        <img
          src={post.cover_url}
          alt={post.title}
          className="mt-8 aspect-video w-full rounded-2xl border border-border object-cover"
        />
      )}

      <article className="prose prose-invert mt-10 max-w-none">
        <Markdown content={post.content} />
      </article>

      {post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
          {post.tags.map((t: string) => (
            <span
              key={t}
              className="rounded-full bg-muted/40 px-3 py-1 text-xs text-muted-foreground"
            >
              #{t}
            </span>
          ))}
        </div>
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
