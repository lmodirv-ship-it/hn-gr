import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mansouri",
    role: "Founder, Atelier Nord",
    quote:
      "HN-GROUPE rebuilt our store from scratch. Conversions jumped 47% in the first quarter. They feel like an in-house team.",
    avatar: "SM",
  },
  {
    name: "Karim El Amrani",
    role: "CEO, LogiTrack",
    quote:
      "We needed a custom logistics platform fast. They shipped a polished MVP in 6 weeks and have iterated with us since.",
    avatar: "KA",
  },
  {
    name: "Léa Dupont",
    role: "Head of Marketing, Verdant",
    quote:
      "Our new site finally matches our brand ambition. The AI project planner alone made the kickoff effortless.",
    avatar: "LD",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Loved by founders
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
          Trusted by teams who <span className="text-gradient-gold">ship fast</span>.
        </h2>
        <div className="mt-4 flex items-center justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            4.9 / 5 from 60+ projects
          </span>
        </div>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <article
            key={t.name}
            className="glass group relative rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:ring-glow"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <Quote className="h-6 w-6 text-primary/40" />
            <p className="mt-4 text-sm leading-relaxed text-foreground/90">
              "{t.quote}"
            </p>
            <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[image:var(--gradient-gold)] font-display text-sm font-bold text-primary-foreground">
                {t.avatar}
              </span>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
