import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export function CTASection() {
  const { t } = useTranslation();
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="glass-strong relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12 sm:py-20">
        <div aria-hidden className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30" style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--primary) 30%, transparent), transparent 60%)" }} />
        <div aria-hidden className="absolute -top-20 -right-20 h-64 w-64 rounded-full border border-primary/20 animate-orbit" />
        <div aria-hidden className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-accent/20 animate-orbit" style={{ animationDirection: "reverse", animationDuration: "45s" }} />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/40 px-3 py-1 text-xs text-primary backdrop-blur"><Sparkles className="h-3 w-3" />{t("finalCta.eyebrow")}</span>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-6xl">{t("finalCta.title.before")} <span className="text-gradient-gold">{t("finalCta.title.highlight")}</span>.</h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">{t("finalCta.description")}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/start-project" className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[image:var(--gradient-gold)] px-8 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.03]">
              {t("finalCta.primary")}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link to="/idea-generator" className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-surface/60 px-8 text-sm font-semibold backdrop-blur hover:border-primary/40">{t("finalCta.secondary")}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
