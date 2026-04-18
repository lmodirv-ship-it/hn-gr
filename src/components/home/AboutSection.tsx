import { Target, Zap, ShieldCheck } from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "Outcome-driven",
    text: "We measure success by your business results, not just lines of code.",
  },
  {
    icon: Zap,
    title: "Modern stack",
    text: "TypeScript, React, edge hosting — fast, secure, and built to scale.",
  },
  {
    icon: ShieldCheck,
    title: "Long-term partner",
    text: "Beyond launch — we maintain, optimize, and evolve your product with you.",
  },
];

export function AboutSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            About HN-groupe
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            A studio that turns ambitious ideas into shipped products.
          </h2>
          <p className="mt-4 text-muted-foreground">
            We are a small senior team of designers and engineers. Our mission is simple: help
            businesses launch web products that look sharp, perform fast, and actually move
            metrics. From a one-page landing to a full SaaS platform — we handle strategy,
            design, code, and growth.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border border-border bg-surface/60 p-5 backdrop-blur"
            >
              <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
