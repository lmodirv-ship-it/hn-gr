import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/portfolio")({
  component: PortfolioAdmin,
});

interface Item {
  id: string;
  slug: string;
  title: string;
  client: string | null;
  category: string | null;
  description: string | null;
  image_url: string | null;
  url: string | null;
  tags: string[];
  published: boolean;
  sort_order: number;
}

function PortfolioAdmin() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const load = () => {
    setItems(null);
    void supabase
      .from("portfolio_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        const rows = (data ?? []).map((r: Record<string, unknown>) => ({
          ...(r as unknown as Item),
          tags: Array.isArray(r.tags) ? (r.tags as string[]) : [],
        }));
        setItems(rows);
      });
  };
  useEffect(load, []);

  const update = (id: string, patch: Partial<Item>) =>
    setItems((p) => p?.map((x) => (x.id === id ? { ...x, ...patch } : x)) ?? p);

  const save = async (it: Item) => {
    setSaving(it.id);
    const { error } = await supabase
      .from("portfolio_items")
      .update({
        slug: it.slug,
        title: it.title,
        client: it.client,
        category: it.category,
        description: it.description,
        image_url: it.image_url,
        url: it.url,
        tags: it.tags,
        published: it.published,
        sort_order: it.sort_order,
      })
      .eq("id", it.id);
    setSaving(null);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
    if (error) toast.error(error.message);
    else setItems((p) => p?.filter((x) => x.id !== id) ?? p);
  };

  const create = async () => {
    const { data, error } = await supabase
      .from("portfolio_items")
      .insert({ slug: `case-${Date.now()}`, title: "New case study", sort_order: (items?.length ?? 0) + 1 })
      .select()
      .single();
    if (error) toast.error(error.message);
    else if (data) setItems((p) => [...(p ?? []), { ...(data as unknown as Item), tags: [] }]);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Portfolio</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage projects displayed in the portfolio section.
          </p>
        </div>
        <button
          onClick={() => void create()}
          className="inline-flex items-center gap-2 rounded-md bg-[image:var(--gradient-gold)] px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> New case
        </button>
      </header>

      {items === null ? (
        <div className="grid h-40 place-items-center rounded-2xl border border-border">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center text-sm text-muted-foreground">
          No portfolio items yet.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((it) => (
            <div key={it.id} className="rounded-2xl border border-border bg-surface/40 p-5">
              {it.image_url && (
                <img
                  src={it.image_url}
                  alt={it.title}
                  className="mb-3 h-40 w-full rounded-md object-cover"
                />
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <F label="Title">
                  <input value={it.title} onChange={(e) => update(it.id, { title: e.target.value })} className="inp" />
                </F>
                <F label="Slug">
                  <input value={it.slug} onChange={(e) => update(it.id, { slug: e.target.value })} className="inp" />
                </F>
                <F label="Client">
                  <input value={it.client ?? ""} onChange={(e) => update(it.id, { client: e.target.value })} className="inp" />
                </F>
                <F label="Category">
                  <input value={it.category ?? ""} onChange={(e) => update(it.id, { category: e.target.value })} className="inp" />
                </F>
                <F label="Image URL" className="sm:col-span-2">
                  <input value={it.image_url ?? ""} onChange={(e) => update(it.id, { image_url: e.target.value })} className="inp" />
                </F>
                <F label="Project URL" className="sm:col-span-2">
                  <input value={it.url ?? ""} onChange={(e) => update(it.id, { url: e.target.value })} className="inp" />
                </F>
                <F label="Description" className="sm:col-span-2">
                  <textarea value={it.description ?? ""} rows={2} onChange={(e) => update(it.id, { description: e.target.value })} className="inp" />
                </F>
                <F label="Tags (comma-separated)" className="sm:col-span-2">
                  <input
                    value={it.tags.join(", ")}
                    onChange={(e) => update(it.id, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                    className="inp"
                  />
                </F>
                <F label="Sort order">
                  <input type="number" value={it.sort_order} onChange={(e) => update(it.id, { sort_order: Number(e.target.value) })} className="inp" />
                </F>
                <F label="Published">
                  <label className="flex h-9 items-center gap-2 text-sm">
                    <input type="checkbox" checked={it.published} onChange={(e) => update(it.id, { published: e.target.checked })} />
                    Visible
                  </label>
                </F>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button onClick={() => void remove(it.id)} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
                <button onClick={() => void save(it)} disabled={saving === it.id} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60">
                  {saving === it.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`.inp{width:100%;border-radius:0.5rem;border:1px solid oklch(var(--border));background:oklch(var(--background));padding:0.5rem 0.75rem;font-size:0.875rem;outline:none}.inp:focus{border-color:oklch(var(--primary))}`}</style>
    </div>
  );
}

function F({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
