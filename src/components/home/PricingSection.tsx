import { Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { trackEvent } from "@/hooks/use-track-event";

const tiers = [
  { price: "$1,490", features: ["1-page custom design", "Mobile-first + SEO basics", "Contact form + WhatsApp", "Delivery in 7 days"], type: "Website", learnMore: "/web-design", popular: false },
  { price: "$3,900", features: ["Up to 8 pages or 50 products", "CMS / admin dashboard", "Analytics + conversion tracking", "Stripe / payments integration", "30-day post-launch support"], type: "E-commerce", learnMore: "/ecommerce", popular: true },
  { priceKey: "pricing.tier.2.price", features: ["Tailored architecture & DB", "Auth, roles, dashboards", "Third-party APIs & AI", "Scalable cloud deploy", "Dedicated team"], type: "Platform", learnMore: "/saas", popular: false },
] as const;

export function PricingSection() {
  const { t } = useTranslation();
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("pricing.eyebrow")}</span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">{t("pricing.title.before")} <span className="text-gradient-gold">{t("pricing.title.highlight")}</span></h2>
        <p className="mt-4 text-muted-foreground">{t("pricing.description")}</p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {tiers.map((tier, i) => {
          const name = t(`pricing.tier.${i}.name`);
          return (
            <div key={name} className={`relative flex flex-col rounded-2xl border p-7 transition-all ${tier.popular ? "border-primary/60 bg-surface/80 shadow-[var(--shadow-gold)]" : "border-border bg-surface/40 hover:border-primary/30"}`}>
              {tier.popular && <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-[image:var(--gradient-gold)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground"><Sparkles className="h-3 w-3" /> {t("pricing.popular")}</span>}
              <h3 className="font-display text-xl font-bold">{name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t(`pricing.tier.${i}.tagline`)}</p>
              <div className="mt-5 flex items-baseline gap-1"><span className="font-display text-4xl font-bold">{"priceKey" in tier ? t(tier.priceKey) : tier.price}</span></div>
              <ul className="mt-6 grid gap-3 text-sm">
                {tier.features.map((f) => <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{f}</span></li>)}
              </ul>
              <Link to="/start-project" search={{ projectType: tier.type }} onClick={() => void trackEvent("cta_click", { cta: "pricing_tier", tier: name })} className={`mt-8 inline-flex h-11 items-center justify-center rounded-md text-sm font-semibold transition-transform hover:scale-[1.02] ${tier.popular ? "bg-[image:var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-gold)]" : "border border-border bg-background hover:border-primary/40"}`}>{t("pricing.startWith", { name })}</Link>
              <Link to={tier.learnMore} className="mt-2 text-center text-xs text-muted-foreground hover:text-primary">{t("cta.learnMore")} →</Link>
            </div>
          );
        })}
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">{t("pricing.terms")}</p>
    </section>
  );
}
