import { Search, PenTool, Code2, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    n: "01",
    title: "Discover",
    text: "We map your goals, audience, and constraints. Output: a clear project brief and success metrics.",
  },
  {
    icon: PenTool,
    n: "02",
    title: "Design",
    text: "Wireframes, brand-aligned UI, and prototypes you can click before a single line of code is written.",
  },
  {
    icon: Code2,
    n: "03",
    title: "Build",
    text: "Senior engineers ship in weekly increments. You see live progress, not status reports.",
  },
  {
    icon: Rocket,
    n: "04",
    title: "Launch & grow",
    text: "We ship to production, monitor performance, and iterate based on real user data.",
  },
];

export function ProcessSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Our process
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
          A proven path from <span className="text-gradient-gold">idea to impact</span>.
        </h2>
      </div>

      <div className="relative mt-16 grid gap-6 md:grid-cols-4">
        {/* Connecting line on desktop */}
        <div
          aria-hidden
          className="absolute left-[12%] right-[12%] top-12 hidden h-px md:block"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in oklab, var(--primary) 40%, transparent), transparent)",
          }}
        />

        {steps.map((s, i) => (
          <div
            key={s.n}
            className="glass relative rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:ring-glow"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="relative grid h-12 w-12 place-items-center rounded-xl bg-[image:var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-gold)]">
              <s.icon className="h-5 w-5" />
            </div>
            <span className="mt-5 block font-display text-xs font-bold tracking-widest text-primary">
              {s.n}
            </span>
            <h3 className="mt-1 font-display text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {s.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
