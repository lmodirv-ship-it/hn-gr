import { services } from "@/data/services";

interface Props {
  detailed?: boolean;
}

export function ServicesSection({ detailed = false }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {!detailed && (
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Services
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Everything you need to launch and grow.
          </h2>
        </div>
      )}

      <div
        className={
          detailed
            ? "mt-12 grid gap-6 lg:grid-cols-2"
            : "mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        }
      >
        {services.map((s) => (
          <article
            key={s.id}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur transition-colors hover:border-primary/50"
          >
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {detailed ? s.description : s.short}
            </p>

            {detailed && (
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
                    What's included
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {s.includes.map((i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Benefits
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {s.benefits.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
