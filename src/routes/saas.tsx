import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Layers, Cpu, Lock } from "lucide-react";
import { trackEvent } from "@/hooks/use-track-event";

export const Route = createFileRoute("/saas")({
  head: () => ({
    meta: [
      { title: "SaaS Development — Custom Web Platforms & Dashboards | HN-GROUPE" },
      {
        name: "description",
        content:
          "We build custom SaaS platforms, dashboards, and internal tools. Auth, billing, AI, scalable cloud. From MVP to production. Book a free scoping call.",
      },
      { property: "og:title", content: "Custom SaaS Development — From MVP to Scale" },
      {
        property: "og:description",
        content:
          "Custom web platforms, SaaS apps, and dashboards with auth, billing, and AI built-in. From idea to production.",
      },
      { name: "keywords", content: "saas development, custom web platform, mvp development, dashboard, internal tools, ai integration" },
    ],
  }),
  component: SaasPage,
});

function SaasPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          SaaS & Platforms
        </span>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-6xl">
          Custom platforms that <span className="text-gradient-gold">scale with you</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          From MVP to enterprise — we build SaaS apps, dashboards, marketplaces, and internal
          tools with everything baked in: auth, billing, real-time, AI, and scalable cloud deploy.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/start-project"
            search={{ projectType: "Custom Platform" }}
            onClick={() => void trackEvent("cta_click", { cta: "saas_hero" })}
            className="inline-flex h-12 items-center gap-2 rounded-md bg-[image:var(--gradient-gold)] px-7 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)]"
          >
            Discuss my project <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/book-call" className="glass inline-flex h-12 items-center justify-center rounded-md px-7 text-sm font-semibold">
            Book technical call
          </Link>
        </div>
      </div>

      <div className="mt-20 grid gap-6 md:grid-cols-3">
        {[
          { icon: Layers, title: "Modern architecture", desc: "TypeScript, React, edge runtime, real-time DB. Built to scale to millions." },
          { icon: Cpu, title: "AI-native", desc: "Integrate GPT, Gemini, Claude. RAG, agents, vector search out of the box." },
          { icon: Lock, title: "Enterprise-ready", desc: "Auth, roles, SSO, audit logs, GDPR. Production security from day one." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-surface/40 p-7">
            <f.icon className="h-8 w-8 text-primary" />
            <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>

      <section className="mt-20 rounded-3xl border border-primary/30 bg-surface/40 p-10">
        <h2 className="font-display text-3xl font-bold">Built to your spec</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {[
            "Tailored architecture & DB design",
            "Authentication & role-based access",
            "Stripe billing & subscriptions",
            "Admin dashboards & analytics",
            "Third-party APIs & integrations",
            "AI features (chat, RAG, agents)",
            "Cloud deploy + CI/CD",
            "Dedicated team & post-launch support",
          ].map((f) => (
            <div key={f} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{f}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-between gap-4 border-t border-border/50 pt-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Starting at</div>
            <div className="font-display text-3xl font-bold">From $9,000</div>
          </div>
          <Link
            to="/start-project"
            search={{ projectType: "Custom Platform" }}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-[image:var(--gradient-gold)] px-6 text-sm font-semibold text-primary-foreground"
          >
            Get scoping & quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
