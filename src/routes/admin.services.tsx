import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/services")({
  component: ServicesAdmin,
});

interface Service {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price_from: number | null;
  currency: string;
  features: string[];
  active: boolean;
  sort_order: number;
}

function ServicesAdmin() {
  const [items, setItems] = useState<Service[] | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const load = () => {
    setItems(null);
    void supabase
      .from("services_catalog")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        const rows = (data ?? []).map((r: Record<string, unknown>) => ({
          ...(r as unknown as Service),
          features: Array.isArray(r.features) ? (r.features as string[]) : [],
        }));
        setItems(rows);
      });
  };
  useEffect(load, []);

  const update = (id: string, patch: Partial<Service>) =>
    setItems((prev) => prev?.map((s) => (s.id === id ? { ...s, ...patch } : s)) ?? prev);

  const save = async (s: Service) => {
    setSaving(s.id);
    const { error } = await supabase
      .from("services_catalog")
      .update({
        slug: s.slug,
        title: s.title,
        description: s.description,
        price_from: s.price_from,
        currency: s.currency,
        features: s.features,
        active: s.active,
        sort_order: s.sort_order,
      })
      .eq("id", s.id);
    setSaving(null);
    if (error) toast.error(error.message);
    else toast.success("Service saved");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services_catalog").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      setItems((prev) => prev?.filter((x) => x.id !== id) ?? prev);
    }
  };

  const create = async () => {
    const slug = `service-${Date.now()}`;
    const { data, error } = await supabase
      .from("services_catalog")
      .insert({ slug, title: "New service", sort_order: (items?.length ?? 0) + 1 })
      .select()
      .single();
    if (error) toast.error(error.message);
    else if (data) setItems((prev) => [...(prev ?? []), { ...(data as unknown as Service), features: [] }]);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Services</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage the catalog of services displayed across the site.
          </p>
        </div>
        <button
          onClick={() => void create()}
          className="inline-flex items-center gap-2 rounded-md bg-[image:var(--gradient-gold)] px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> New service
        </button>
      </header>

      {items === null ? (
        <div className="grid h-40 place-items-center rounded-2xl border border-border">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center text-sm text-muted-foreground">
          No services yet. Click “New service” to add one.
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((s) => (
            <div key={s.id} className="rounded-2xl border border-border bg-surface/40 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Title">
                  <input
                    value={s.title}
                    onChange={(e) => update(s.id, { title: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label="Slug">
                  <input
                    value={s.slug}
                    onChange={(e) => update(s.id, { slug: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label="Price from">
                  <input
                    type="number"
                    value={s.price_from ?? ""}
                    onChange={(e) =>
                      update(s.id, { price_from: e.target.value ? Number(e.target.value) : null })
                    }
                    className="input"
                  />
                </Field>
                <Field label="Currency">
                  <input
                    value={s.currency}
                    onChange={(e) => update(s.id, { currency: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label="Sort order">
                  <input
                    type="number"
                    value={s.sort_order}
                    onChange={(e) => update(s.id, { sort_order: Number(e.target.value) })}
                    className="input"
                  />
                </Field>
                <Field label="Active">
                  <label className="flex h-9 items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={s.active}
                      onChange={(e) => update(s.id, { active: e.target.checked })}
                    />
                    Visible on site
                  </label>
                </Field>
                <Field label="Description" className="sm:col-span-2">
                  <textarea
                    value={s.description ?? ""}
                    onChange={(e) => update(s.id, { description: e.target.value })}
                    rows={3}
                    className="input"
                  />
                </Field>
                <Field label="Features (one per line)" className="sm:col-span-2">
                  <textarea
                    value={s.features.join("\n")}
                    onChange={(e) =>
                      update(s.id, { features: e.target.value.split("\n").filter(Boolean) })
                    }
                    rows={3}
                    className="input"
                  />
                </Field>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => void remove(s.id)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
                <button
                  onClick={() => void save(s)}
                  disabled={saving === s.id}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {saving === s.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`.input{width:100%;border-radius:0.5rem;border:1px solid oklch(var(--border));background:oklch(var(--background));padding:0.5rem 0.75rem;font-size:0.875rem;outline:none}.input:focus{border-color:oklch(var(--primary))}`}</style>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
