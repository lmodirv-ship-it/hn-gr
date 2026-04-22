import { Target, Rocket, HeartHandshake } from "lucide-react";

const PILLARS = [
  {
    icon: Target,
    title: "Our Mission",
    text: "Turn ambitious business ideas into shipped, revenue-generating digital products.",
  },
  {
    icon: Rocket,
    title: "What We Do",
    text: "Design and build modern websites, online stores, and custom platforms — end-to-end.",
  },
  {
    icon: HeartHandshake,
    title: "Why Clients Choose Us",
    text: "Senior team, transparent process, and AI-assisted planning that gets you live faster.",
  },
];

export function MissionSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Our purpose
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Helping businesses <span className="text-gradient-gold">grow online</span>.
        </h2>
        <p className="mt-4 text-muted-foreground">
          HN-GROUPE exists to bridge the gap between a business idea and a working product
          that customers love and pay for.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {PILLARS.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="group rounded-2xl border border-border bg-surface/40 p-6 transition-colors hover:border-primary/40"
          >
            <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/15 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
