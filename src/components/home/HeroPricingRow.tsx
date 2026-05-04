import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import heroBg from "@/assets/hero-bg.jpg";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import { trackEvent } from "@/hooks/use-track-event";

type BillingCycle = "monthly" | "quarterly" | "semiannual" | "annual";

// Monthly base prices in USD (no separators)
const tiers = [
  {
    monthly: 20,
    features: [
      "1-page custom design",
      "Mobile-first + SEO basics",
      "Contact form + WhatsApp",
      "Delivery in 7 days",
    ],
    type: "Website",
    learnMore: "/web-design",
    popular: false,
  },
  {
    monthly: 49,
    features: [
      "Up to 8 pages or 50 products",
      "CMS / admin dashboard",
      "Analytics + conversion tracking",
      "Stripe / payments integration",
      "30-day post-launch support",
    ],
    type: "E-commerce",
    learnMore: "/ecommerce",
    popular: true,
  },
  {
    monthly: 99,
    features: [
      "Tailored architecture & DB",
      "Auth, roles, dashboards",
      "Third-party APIs & AI",
      "Scalable cloud deploy",
      "Dedicated team",
    ],
    type: "Platform",
    learnMore: "/saas",
    popular: false,
  },
] as const;

// months × discount factor (longer = bigger discount)
const CYCLE_CONFIG: Record<BillingCycle, { months: number; discount: number; labelKey: string; suffixKey: string }> = {
  monthly:    { months: 1,  discount: 0,    labelKey: "pricing.cycle.monthly",    suffixKey: "pricing.suffix.month" },
  quarterly:  { months: 3,  discount: 0.05, labelKey: "pricing.cycle.quarterly",  suffixKey: "pricing.suffix.quarter" },
  semiannual: { months: 6,  discount: 0.10, labelKey: "pricing.cycle.semiannual", suffixKey: "pricing.suffix.semiannual" },
  annual:     { months: 12, discount: 0.20, labelKey: "pricing.cycle.annual",     suffixKey: "pricing.suffix.year" },
};

export function HeroPricingRow() {
  const { t } = useTranslation();
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const cfg = CYCLE_CONFIG[cycle];

  const cycles: BillingCycle[] = ["monthly", "quarterly", "semiannual", "annual"];

  return (
    <section className="relative overflow-hidden">
      {/* Cinematic background */}
      <div className="absolute inset-0">
        <video
          src={heroVideo.url}
          poster={heroBg}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pt-32 lg:px-8 lg:pt-32">
        {/* Two-column row: Pricing left, Hero right */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
          {/* LEFT — Pricing box */}
          <div className="order-2 animate-fade-up rounded-3xl border border-primary/20 bg-surface/40 p-6 shadow-[var(--shadow-gold)] backdrop-blur-xl sm:p-8 lg:order-1">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                {t("pricing.eyebrow")}
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                {t("pricing.title.before")}{" "}
                <span className="text-gradient-gold">{t("pricing.title.highlight")}</span>
              </h2>
            </div>

            {/* Billing cycle switcher */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-border bg-surface/60 p-1.5">
              {cycles.map((c) => {
                const active = c === cycle;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCycle(c)}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${
                      active
                        ? "bg-[image:var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-gold)]"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t(CYCLE_CONFIG[c].labelKey)}
                    {CYCLE_CONFIG[c].discount > 0 && (
                      <span className={`ms-1 text-[9px] ${active ? "opacity-90" : "text-primary"}`}>
                        −{Math.round(CYCLE_CONFIG[c].discount * 100)}%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid gap-4">
              {tiers.map((tier, i) => {
                const name = t(`pricing.tier.${i}.name`);
                const totalPrice = Math.round(tier.monthly * cfg.months * (1 - cfg.discount));
                return (
                  <div
                    key={name}
                    className={`relative flex flex-col rounded-2xl border p-5 transition-all ${
                      tier.popular
                        ? "border-primary/60 bg-surface/80 shadow-[var(--shadow-gold)]"
                        : "border-border bg-surface/40 hover:border-primary/30"
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-[image:var(--gradient-gold)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                        <Sparkles className="h-3 w-3" /> {t("pricing.popular")}
                      </span>
                    )}
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-base font-bold">{name}</h3>
                      <div className="text-end">
                        <span className="font-display text-xl font-bold">${totalPrice}</span>
                        <span className="ms-1 text-[10px] text-muted-foreground">
                          /{t(cfg.suffixKey)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t(`pricing.tier.${i}.tagline`)}
                    </p>
                    <ul className="mt-3 grid gap-1.5 text-xs">
                      {tier.features.slice(0, 3).map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/start-project"
                      search={{ projectType: tier.type }}
                      onClick={() =>
                        void trackEvent("cta_click", { cta: "pricing_tier", tier: name })
                      }
                      className={`mt-4 inline-flex h-9 items-center justify-center rounded-md text-xs font-semibold transition-transform hover:scale-[1.02] ${
                        tier.popular
                          ? "bg-[image:var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-gold)]"
                          : "border border-border bg-background hover:border-primary/40"
                      }`}
                    >
                      {t("pricing.startWith", { name })}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Hero box */}
          <div className="order-1 animate-fade-up rounded-3xl border border-primary/20 bg-surface/40 p-6 text-center shadow-[var(--shadow-gold)] backdrop-blur-xl sm:p-10 lg:order-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-surface/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {t("hero.badge")}
            </span>

            <h1 className="mt-6 font-display text-3xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              {t("hero.headline1")}{" "}
              <span className="bg-[image:var(--gradient-gold)] bg-clip-text text-transparent">
                {t("hero.headline2")}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground">
              {t("hero.description")}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/start-project"
                onClick={() => void trackEvent("cta_click", { cta: "hero_start_project" })}
                className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-md bg-[image:var(--gradient-gold)] px-7 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.03]"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  {t("hero.ctaQuote")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
                </span>
                <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
              <Link
                to="/portfolio"
                onClick={() => void trackEvent("cta_click", { cta: "hero_portfolio" })}
                className="glass inline-flex h-12 items-center justify-center rounded-md px-7 text-sm font-semibold hover:border-primary/40"
              >
                {t("hero.ctaWork")}
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span>{t("hero.trust.rating")}</span>
              <span>{t("hero.trust.delivery")}</span>
              <span>{t("hero.trust.refund")}</span>
            </div>

            <div className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-4 border-t border-border/50 pt-6">
              {[
                { value: "120+", label: t("hero.stats.shipped") },
                { value: "60+", label: t("hero.stats.clients") },
                { value: t("hero.stats.years"), label: t("hero.stats.experience") },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-display text-2xl font-bold text-primary sm:text-3xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
