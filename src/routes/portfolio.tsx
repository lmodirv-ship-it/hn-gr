import { createFileRoute } from "@tanstack/react-router";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — HN-groupe" },
      {
        name: "description",
        content:
          "A selection of websites, e-commerce stores, and custom platforms built by HN-groupe.",
      },
      { property: "og:title", content: "Portfolio — HN-groupe" },
      {
        property: "og:description",
        content: "Selected work from HN-groupe — websites, stores, and SaaS platforms.",
      },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <>
      <section className="border-b border-border/60" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Our portfolio</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A snapshot of products we've shipped — across websites, e-commerce, and custom
            platforms.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <PortfolioGrid />
      </section>
    </>
  );
}
