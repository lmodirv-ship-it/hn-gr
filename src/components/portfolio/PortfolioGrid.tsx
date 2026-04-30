import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { projects, type ProjectCategory } from "@/data/projects";

type Filter = "all" | ProjectCategory;
const filters: { value: Filter; key: string }[] = [
  { value: "all", key: "portfolio.filter.all" },
  { value: "website", key: "portfolio.filter.website" },
  { value: "ecommerce", key: "portfolio.filter.ecommerce" },
  { value: "platform", key: "portfolio.filter.platform" },
];

interface Props { limit?: number; showFilters?: boolean; }

export function PortfolioGrid({ limit, showFilters = true }: Props) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>("all");
  const visible = useMemo(() => {
    const list = filter === "all" ? projects : projects.filter((p) => p.category === filter);
    return limit ? list.slice(0, limit) : list;
  }, [filter, limit]);

  return (
    <div>
      {showFilters && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {filters.map((f) => {
            const active = filter === f.value;
            return (
              <button key={f.value} onClick={() => setFilter(f.value)} className={"rounded-full border px-4 py-1.5 text-sm transition-colors " + (active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface/60 text-muted-foreground hover:text-foreground")}>
                {t(f.key)}
              </button>
            );
          })}
        </div>
      )}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <article key={p.id} className="glass group overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:ring-glow">
            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
              <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                {p.link && <a href={p.link} target="_blank" rel="noreferrer" aria-label={`Open ${p.title}`} className="text-muted-foreground hover:text-primary"><ExternalLink className="h-4 w-4" /></a>}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{t(`portfolio.project.${p.id}.description`, p.description)}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.techStack.map((tech) => <span key={tech} className="rounded-md border border-border bg-background/40 px-2 py-0.5 text-xs text-muted-foreground">{tech}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
