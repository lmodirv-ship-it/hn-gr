import { Star, Quote } from "lucide-react";
import { useTranslation } from "react-i18next";

const testimonials = [
  { name: "Sarah Mansouri", avatar: "SM" },
  { name: "Karim El Amrani", avatar: "KA" },
  { name: "Léa Dupont", avatar: "LD" },
];

export function TestimonialsSection() {
  const { t } = useTranslation();
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("testimonials.eyebrow")}</span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
          {t("testimonials.title.before")} <span className="text-gradient-gold">{t("testimonials.title.highlight")}</span>.
        </h2>
        <div className="mt-4 flex items-center justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
          <span className="ms-2 text-sm text-muted-foreground">{t("testimonials.rating")}</span>
        </div>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {testimonials.map((item, i) => (
          <article key={item.name} className="glass group relative rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:ring-glow" style={{ animationDelay: `${i * 80}ms` }}>
            <Quote className="h-6 w-6 text-primary/40" />
            <p className="mt-4 text-sm leading-relaxed text-foreground/90">“{t(`testimonials.${i}.quote`)}”</p>
            <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[image:var(--gradient-gold)] font-display text-sm font-bold text-primary-foreground">{item.avatar}</span>
              <div><p className="text-sm font-semibold">{item.name}</p><p className="text-xs text-muted-foreground">{t(`testimonials.${i}.role`)}</p></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
