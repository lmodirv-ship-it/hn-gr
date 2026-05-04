import { Target, Zap, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import workspace from "@/assets/about-workspace.jpg";

const pillars = [
  { icon: Target, titleKey: "about.pillar.0.title", textKey: "about.pillar.0.text" },
  { icon: Zap, titleKey: "about.pillar.1.title", textKey: "about.pillar.1.text" },
  { icon: ShieldCheck, titleKey: "about.pillar.2.title", textKey: "about.pillar.2.text" },
];

export function AboutSection() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="relative overflow-hidden rounded-2xl border border-border">
          <img src={workspace} alt={t("about.imageAlt")} width={1280} height={960} loading="lazy" className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/60 via-transparent to-primary/10" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("about.eyebrow")}</span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{t("about.title")}</h2>
          <p className="mt-4 text-muted-foreground">{t("about.description")}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.titleKey} className="glass rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-[image:var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-gold)]">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold">{t(p.titleKey)}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{t(p.textKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
