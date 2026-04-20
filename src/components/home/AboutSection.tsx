import { Target, Zap, ShieldCheck } from "lucide-react";
import workspace from "@/assets/about-workspace.jpg";

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
        <div className="relative overflow-hidden rounded-2xl border border-border">
          <img
            src={workspace}
            alt="HN-GROUPE engineering workspace"
            width={1280}
            height={960}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/60 via-transparent to-primary/10" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            About HN-GROUPE
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            A studio that turns ambitious ideas into shipped products.
          </h2>
          <p className="mt-4 text-muted-foreground">
            We are a senior team of designers and engineers. Our mission is simple: help
            businesses launch web products that look sharp, perform fast, and actually move
            metrics. From a one-page landing to a full SaaS platform — we handle strategy,
            design, code, and growth.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="glass rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="grid h-10 w-10 place-items-center rounded-md bg-[image:var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-gold)]">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold">{p.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
