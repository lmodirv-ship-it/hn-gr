import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Zap, TrendingUp, Award } from "lucide-react";
import { trackEvent } from "@/hooks/use-track-event";

export const Route = createFileRoute("/web-design")({
  head: () => ({
    meta: [
      { title: "Web Design Services — Custom Websites that Convert | HN-GROUPE" },
      {
        name: "description",
        content:
          "Award-winning web design that turns visitors into customers. Custom-coded, mobile-first, SEO-ready. Fixed price, delivered in 7-21 days. Free quote in 24h.",
      },
      { property: "og:title", content: "Web Design Services that Actually Make Money" },
      {
        property: "og:description",
        content:
          "Custom websites built to convert. Mobile-first, SEO-optimized, delivered in weeks not months.",
      },
      { name: "keywords", content: "web design, custom website, website development, landing page design, conversion optimization" },
    ],
  }),
  component: WebDesignPage,
});

function WebDesignPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Web Design
        </span>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-6xl">
          Websites that <span className="text-gradient-gold">turn clicks into clients</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          We design and build custom websites engineered for conversion — not just pretty pages.
          Fixed price, delivered in 7-21 days, with everything you need to start making money online.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/start-project"
            search={{ projectType: "Website" }}
            onClick={() => void trackEvent("cta_click", { cta: "webdesign_hero" })}
            className="inline-flex h-12 items-center gap-2 rounded-md bg-[image:var(--gradient-gold)] px-7 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)]"
          >
            Get my free quote <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/portfolio" className="glass inline-flex h-12 items-center justify-center rounded-md px-7 text-sm font-semibold">
            See past projects
          </Link>
        </div>
      </div>

      <div className="mt-20 grid gap-6 md:grid-cols-3">
        {[
          { icon: Zap, title: "Built for speed", desc: "Lightning-fast load times. Google-friendly. Better rankings, more traffic." },
          { icon: TrendingUp, title: "Built to convert", desc: "Every section is engineered to guide visitors to take action and become customers." },
          { icon: Award, title: "Built to last", desc: "Clean code, modern stack, easy to update. Owned by you, not locked into a platform." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-surface/40 p-7">
            <f.icon className="h-8 w-8 text-primary" />
            <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>

      <section className="mt-20 rounded-3xl border border-primary/30 bg-surface/40 p-10">
        <h2 className="font-display text-3xl font-bold">What you get</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {[
            "Custom design (no templates)",
            "Mobile-first responsive layout",
            "SEO foundation (meta, sitemap, schema)",
            "Lightning-fast performance (90+ score)",
            "Contact form + WhatsApp integration",
            "Analytics & conversion tracking",
            "Hosting setup + SSL",
            "30-day post-launch support",
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
            <div className="font-display text-3xl font-bold">$1,490</div>
          </div>
          <Link
            to="/start-project"
            search={{ projectType: "Website" }}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-[image:var(--gradient-gold)] px-6 text-sm font-semibold text-primary-foreground"
          >
            Start your project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
