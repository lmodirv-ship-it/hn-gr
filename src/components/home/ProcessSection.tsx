import { Search, PenTool, Code2, Rocket } from "lucide-react";
import { useTranslation } from "react-i18next";

const steps = [Search, PenTool, Code2, Rocket];

export function ProcessSection() {
  const { t } = useTranslation();
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("process.eyebrow")}</span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
          {t("process.title.before")} <span className="text-gradient-gold">{t("process.title.highlight")}</span>.
        </h2>
      </div>
      <div className="relative mt-16 grid gap-6 md:grid-cols-4">
        <div aria-hidden className="absolute left-[12%] right-[12%] top-12 hidden h-px md:block" style={{ background: "linear-gradient(90deg, transparent, color-mix(in oklab, var(--primary) 40%, transparent), transparent)" }} />
        {steps.map((Icon, i) => (
          <div key={i} className="glass relative rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:ring-glow" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="relative grid h-12 w-12 place-items-center rounded-xl bg-[image:var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-gold)]"><Icon className="h-5 w-5" /></div>
            <span className="mt-5 block font-display text-xs font-bold tracking-widest text-primary">0{i + 1}</span>
            <h3 className="mt-1 font-display text-xl font-semibold">{t(`process.step.${i}.title`)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`process.step.${i}.text`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
