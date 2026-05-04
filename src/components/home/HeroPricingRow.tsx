import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import heroBg from "@/assets/hero-bg.jpg";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import { trackEvent } from "@/hooks/use-track-event";
import { supabase } from "@/integrations/supabase/client";

type Plan = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  monthly_price: number;
  currency: string;
  project_type: string | null;
  learn_more_path: string | null;
  features: string[];
  popular: boolean;
};

type Cycle = {
  id: string;
  key: string;
  label_en: string;
  label_ar: string;
  suffix_en: string;
  suffix_ar: string;
  months: number;
  discount: number;
};

export function HeroPricingRow() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith("ar");

  const [plans, setPlans] = useState<Plan[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycle, setActiveCycle] = useState<string>("monthly");

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const [{ data: planRows }, { data: cycleRows }] = await Promise.all([
        supabase
          .from("pricing_plans")
          .select("*")
          .eq("active", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("pricing_cycles")
          .select("*")
          .eq("active", true)
          .order("sort_order", { ascending: true }),
      ]);
      if (!mounted) return;
      if (planRows) {
        setPlans(
          planRows.map((p: any) => ({
            ...p,
            features: Array.isArray(p.features) ? p.features : [],
          })),
        );
      }
      if (cycleRows && cycleRows.length > 0) {
        setCycles(cycleRows as Cycle[]);
        setActiveCycle((cycleRows[0] as Cycle).key);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const cfg = cycles.find((c) => c.key === activeCycle);

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
            {cycles.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-border bg-surface/60 p-1.5">
                {cycles.map((c) => {
                  const active = c.key === activeCycle;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveCycle(c.key)}
                      className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${
                        active
                          ? "bg-[image:var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-gold)]"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {isAr ? c.label_ar : c.label_en}
                      {Number(c.discount) > 0 && (
                        <span className={`ms-1 text-[9px] ${active ? "opacity-90" : "text-primary"}`}>
                          −{Math.round(Number(c.discount) * 100)}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-6 grid gap-4">
              {plans.map((plan) => {
                const months = cfg?.months ?? 1;
                const discount = Number(cfg?.discount ?? 0);
                const totalPrice = Math.round(Number(plan.monthly_price) * months * (1 - discount));
                const suffix = cfg ? (isAr ? cfg.suffix_ar : cfg.suffix_en) : "";
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-2xl border p-5 transition-all ${
                      plan.popular
                        ? "border-primary/60 bg-surface/80 shadow-[var(--shadow-gold)]"
                        : "border-border bg-surface/40 hover:border-primary/30"
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-[image:var(--gradient-gold)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                        <Sparkles className="h-3 w-3" /> {t("pricing.popular")}
                      </span>
                    )}
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-base font-bold">{plan.name}</h3>
                      <div className="text-end">
                        <span className="font-display text-xl font-bold">${totalPrice}</span>
                        {suffix && (
                          <span className="ms-1 text-[10px] text-muted-foreground">/{suffix}</span>
                        )}
                      </div>
                    </div>
                    {plan.tagline && (
                      <p className="mt-1 text-xs text-muted-foreground">{plan.tagline}</p>
                    )}
                    <ul className="mt-3 grid gap-1.5 text-xs">
                      {plan.features.slice(0, 3).map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/start-project"
                      search={{ projectType: plan.project_type ?? plan.name }}
                      onClick={() =>
                        void trackEvent("cta_click", { cta: "pricing_tier", tier: plan.name })
                      }
                      className={`mt-4 inline-flex h-9 items-center justify-center rounded-md text-xs font-semibold transition-transform hover:scale-[1.02] ${
                        plan.popular
                          ? "bg-[image:var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-gold)]"
                          : "border border-border bg-background hover:border-primary/40"
                      }`}
                    >
                      {t("pricing.startWith", { name: plan.name })}
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
