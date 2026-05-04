import { useTranslation } from "react-i18next";
import { services } from "@/data/services";
import servicesVisual from "@/assets/services-visual.jpg";

interface Props { detailed?: boolean; }

export function ServicesSection({ detailed = false }: Props) {
  const { t } = useTranslation();

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {!detailed && (
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1fr_auto_1fr]">
          <div className="text-center md:text-right rtl:md:text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("services.eyebrow")}</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{t("services.title")}</h2>
          </div>
          <div className="hidden h-32 w-32 overflow-hidden rounded-full border border-primary/30 shadow-[var(--shadow-gold)] md:block">
            <img src={servicesVisual} alt="HN-GROUPE services visual" width={256} height={256} loading="lazy" className="h-full w-full object-cover" />
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left rtl:md:text-right">{t("services.description")}</p>
        </div>
      )}

      <div className={detailed ? "mt-12 grid gap-6 lg:grid-cols-2" : "mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"}>
        {services.map((s) => {
          const title = t(`services.items.${s.id}.title`, s.title);
          return (
            <article key={s.id} className="glass group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:ring-glow">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-[image:var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-gold)] transition-transform duration-500 group-hover:scale-110">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(`services.items.${s.id}.${detailed ? "description" : "short"}`, detailed ? s.description : s.short)}</p>
              {detailed && (
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">{t("services.included")}</h4>
                    <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">{s.includes.map((i) => <li key={i} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />{i}</li>)}</ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">{t("services.benefits")}</h4>
                    <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">{s.benefits.map((b) => <li key={b} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />{b}</li>)}</ul>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
