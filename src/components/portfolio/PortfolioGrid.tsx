import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

interface DbItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  url: string | null;
  tags: string[];
}

interface Props { limit?: number; showFilters?: boolean; }

export function PortfolioGrid({ limit, showFilters = true }: Props) {
  const { t } = useTranslation();
  const [items, setItems] = useState<DbItem[] | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    void supabase
      .from("portfolio_items")
      .select("id,slug,title,description,category,image_url,url,tags")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        const rows = (data ?? []).map((r) => ({
          ...(r as unknown as DbItem),
          tags: Array.isArray((r as { tags?: unknown }).tags) ? ((r as { tags: string[] }).tags) : [],
        }));
        setItems(rows);
      });
  }, []);

  const categories = useMemo(() => {
    if (!items) return [];
    const set = new Set<string>();
    items.forEach((i) => i.category && set.add(i.category));
    return Array.from(set).sort();
  }, [items]);

  const visible = useMemo(() => {
    if (!items) return [];
    const list = filter === "all" ? items : items.filter((p) => p.category === filter);
    return limit ? list.slice(0, limit) : list;
  }, [items, filter, limit]);

  if (items === null) {
    return (
      <div className="grid h-40 place-items-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      {showFilters && categories.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>
            {t("portfolio.filter.all", "All")}
          </FilterBtn>
          {categories.map((c) => (
            <FilterBtn key={c} active={filter === c} onClick={() => setFilter(c)}>
              {c}
            </FilterBtn>
          ))}
        </div>
      )}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => {
          const Inner = (
            <>
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20">
                    <span className="font-display text-2xl font-bold text-foreground/70">{p.title.slice(0, 2).toUpperCase()}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                  {p.url && <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />}
                </div>
                {p.description && <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>}
                {p.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                      <span key={tag} className="rounded-md border border-border bg-background/40 px-2 py-0.5 text-xs text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </>
          );
          const className = "glass group block overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:ring-glow";
          return p.url ? (
            <a key={p.id} href={p.url} target="_blank" rel="noreferrer" aria-label={`Open ${p.title}`} className={className}>{Inner}</a>
          ) : (
            <article key={p.id} className={className}>{Inner}</article>
          );
        })}
      </div>
    </div>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={"rounded-full border px-4 py-1.5 text-sm transition-colors " + (active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface/60 text-muted-foreground hover:text-foreground")}
    >
      {children}
    </button>
  );
}
