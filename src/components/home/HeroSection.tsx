import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import heroBg from "@/assets/hero-bg.jpg";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import { trackEvent } from "@/hooks/use-track-event";

export function HeroSection() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden">
      {/* Cinematic background video with image fallback */}
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
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 sm:pt-32 lg:px-8 lg:pt-40">
        <div className="mx-auto max-w-3xl animate-fade-up rounded-3xl border border-primary/20 bg-surface/40 p-6 text-center shadow-[var(--shadow-gold)] backdrop-blur-xl sm:p-10 lg:p-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-surface/40 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {t("hero.badge")}
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl xl:text-8xl">
            {t("hero.headline1")}{" "}
            <span className="bg-[image:var(--gradient-gold)] bg-clip-text text-transparent">
              {t("hero.headline2")}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {t("hero.description")}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
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

          {/* Trust signals row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">{t("hero.trust.rating")}</span>
            <span className="inline-flex items-center gap-1.5">{t("hero.trust.delivery")}</span>
            <span className="inline-flex items-center gap-1.5">{t("hero.trust.refund")}</span>
          </div>

          {/* Social proof stats */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-4 border-t border-border/50 pt-8">
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
    </section>
  );
}
