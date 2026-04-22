import { Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { trackEvent } from "@/hooks/use-track-event";

const tiers = [
  {
    name: "Starter",
    price: "$1,490",
    tagline: "Landing page that converts",
    features: [
      "1-page custom design",
      "Mobile-first + SEO basics",
      "Contact form + WhatsApp",
      "Delivery in 7 days",
    ],
    type: "Website",
    popular: false,
  },
  {
    name: "Business",
    price: "$3,900",
    tagline: "Full website or store",
    features: [
      "Up to 8 pages or 50 products",
      "CMS / admin dashboard",
      "Analytics + conversion tracking",
      "Stripe / payments integration",
      "30-day post-launch support",
    ],
    type: "E-commerce",
    popular: true,
  },
  {
    name: "Custom Platform",
    price: "From $9,000",
    tagline: "SaaS, marketplace or app",
    features: [
      "Tailored architecture & DB",
      "Auth, roles, dashboards",
      "Third-party APIs & AI",
      "Scalable cloud deploy",
      "Dedicated team",
    ],
    type: "Platform",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Transparent pricing
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
          Pick the package, <span className="text-gradient-gold">get a fixed quote</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          No hourly games. We scope it, price it, ship it. Need something different? Talk to us.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`relative flex flex-col rounded-2xl border p-7 transition-all ${
              t.popular
                ? "border-primary/60 bg-surface/80 shadow-[var(--shadow-gold)]"
                : "border-border bg-surface/40 hover:border-primary/30"
            }`}
          >
            {t.popular && (
              <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-[image:var(--gradient-gold)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
                <Sparkles className="h-3 w-3" /> Most popular
              </span>
            )}
            <h3 className="font-display text-xl font-bold">{t.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.tagline}</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold">{t.price}</span>
            </div>
            <ul className="mt-6 grid gap-3 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/start-project"
              search={{ projectType: t.type }}
              onClick={() =>
                void trackEvent("cta_click", { cta: "pricing_tier", tier: t.name })
              }
              className={`mt-8 inline-flex h-11 items-center justify-center rounded-md text-sm font-semibold transition-transform hover:scale-[1.02] ${
                t.popular
                  ? "bg-[image:var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-gold)]"
                  : "border border-border bg-background hover:border-primary/40"
              }`}
            >
              Start with {t.name}
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        💳 50% to start, 50% on delivery · Refund if we don't ship · Worldwide
      </p>
    </section>
  );
}
