const steps = [
  {
    n: "01",
    title: "Describe your idea",
    text: "Open the AI assistant in the corner and tell us what you want to build, in plain language.",
  },
  {
    n: "02",
    title: "Get a structured proposal",
    text: "The assistant returns a project type, suggested pages, and a recommended tech stack.",
  },
  {
    n: "03",
    title: "Confirm & launch",
    text: "Send your request, and a HN-groupe expert gets back to you within one business day.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          How it works
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          From idea to project plan in minutes.
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div
            key={s.n}
            className="glass relative rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:ring-glow"
          >
            <span className="font-display text-5xl font-bold text-gradient-gold opacity-70">
              {s.n}
            </span>
            <h3 className="mt-2 font-display text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
