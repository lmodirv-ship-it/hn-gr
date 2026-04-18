import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pt-28 lg:px-8 lg:pt-36">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" />
            AI-assisted project planning
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Smart software & web solutions{" "}
            <span className="bg-[image:var(--gradient-gold)] bg-clip-text text-transparent">
              for your business
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            HN-groupe builds modern websites, online stores, and custom software platforms.
            Describe your idea — our AI assistant turns it into a clear, actionable project
            plan in seconds.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/start-project"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[image:var(--gradient-gold)] px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.02]"
            >
              Start your project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-surface/60 px-6 text-sm font-semibold backdrop-blur hover:bg-surface"
            >
              View portfolio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
