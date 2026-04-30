import { useTranslation } from "react-i18next";

export function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("how.eyebrow")}</span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{t("how.title")}</h2>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="glass relative rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:ring-glow">
            <span className="font-display text-5xl font-bold text-gradient-gold opacity-70">0{i + 1}</span>
            <h3 className="mt-2 font-display text-xl font-semibold">{t(`how.step.${i}.title`)}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t(`how.step.${i}.text`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
