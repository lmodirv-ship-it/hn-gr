import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ServicesSection } from "@/components/services/ServicesSection";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — HN-groupe" },
      {
        name: "description",
        content:
          "Website development, e-commerce, custom platforms, UI/UX design, and ongoing maintenance — by HN-groupe.",
      },
      { property: "og:title", content: "Services — HN-groupe" },
      {
        property: "og:description",
        content: "All the services HN-groupe offers, from websites to custom SaaS platforms.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <section className="border-b border-border/60" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Our services</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            From a fast company website to a full custom platform — pick what fits your stage,
            or combine services for an end-to-end build.
          </p>
        </div>
      </section>

      <ServicesSection detailed />

      <section className="mx-auto max-w-4xl px-4 pb-24 text-center sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-primary/30 bg-surface/60 p-10">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Not sure which service fits?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Open the assistant in the corner and describe your idea — we'll suggest the right
            type of project, modules, and tech stack.
          </p>
          <Link
            to="/start-project"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[image:var(--gradient-gold)] px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)]"
          >
            Discuss your idea with the assistant
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
