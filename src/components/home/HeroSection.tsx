import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Cinematic background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="HN-GROUPE — luxury tech background"
          width={1920}
          height={1080}
          className="h-full w-full object-cover opacity-60"
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 sm:pt-32 lg:px-8 lg:pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-surface/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" />
            AI-assisted project planning
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            We Build{" "}
            <span className="bg-[image:var(--gradient-gold)] bg-clip-text text-transparent">
              Digital Powerhouses
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            HN-GROUPE crafts modern websites, online stores, and custom software platforms.
            Describe your idea — our AI assistant turns it into a clear, actionable project
            plan in seconds.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/start-project"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[image:var(--gradient-gold)] px-7 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.02]"
            >
              Start your project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-surface/60 px-7 text-sm font-semibold backdrop-blur hover:bg-surface"
            >
              Explore our work
            </Link>
          </div>

          {/* Social proof stats */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-4 border-t border-border/50 pt-8">
            {[
              { value: "120+", label: "Projects shipped" },
              { value: "60+", label: "Happy clients" },
              { value: "8 yrs", label: "Senior experience" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-2xl font-bold text-primary sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
