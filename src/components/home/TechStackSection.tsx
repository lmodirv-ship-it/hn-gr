import { useTranslation } from "react-i18next";

const stack = [
  { name: "React", category: "Frontend" }, { name: "TypeScript", category: "Language" }, { name: "TanStack", category: "Routing" }, { name: "Tailwind", category: "Styling" }, { name: "Supabase", category: "Backend" }, { name: "PostgreSQL", category: "Database" }, { name: "Stripe", category: "Payments" }, { name: "Vercel", category: "Hosting" }, { name: "OpenAI", category: "AI" }, { name: "Cloudflare", category: "Edge" }, { name: "Figma", category: "Design" }, { name: "Framer Motion", category: "Motion" },
];

export function TechStackSection() {
  const { t } = useTranslation();
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("tech.eyebrow")}</span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
          {t("tech.title.before")} <span className="text-gradient-gold">{t("tech.title.highlight")}</span> {t("tech.title.after")}
        </h2>
        <p className="mt-4 text-muted-foreground">{t("tech.description")}</p>
      </div>
      <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {stack.map((s, i) => (
          <div key={s.name} className="glass group flex flex-col items-center justify-center rounded-xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40" style={{ animationDelay: `${i * 40}ms` }}>
            <span className="font-display text-base font-bold text-foreground transition-colors group-hover:text-primary">{s.name}</span>
            <span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{s.category}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
