import { Target, Rocket, HeartHandshake } from "lucide-react";
import { useTranslation } from "react-i18next";

const PILLARS = [
  { icon: Target, titleKey: "mission.pillar.0.title", textKey: "mission.pillar.0.text" },
  { icon: Rocket, titleKey: "mission.pillar.1.title", textKey: "mission.pillar.1.text" },
  { icon: HeartHandshake, titleKey: "mission.pillar.2.title", textKey: "mission.pillar.2.text" },
];

export function MissionSection() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          {t("mission.eyebrow")}
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          {t("mission.title.before")} <span className="text-gradient-gold">{t("mission.title.highlight")}</span>.
        </h2>
        <p className="mt-4 text-muted-foreground">{t("mission.description")}</p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {PILLARS.map(({ icon: Icon, titleKey, textKey }) => (
          <div key={titleKey} className="group rounded-2xl border border-border bg-surface/40 p-6 transition-colors hover:border-primary/40">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/15 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold">{t(titleKey)}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t(textKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
