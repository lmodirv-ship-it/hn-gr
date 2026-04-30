import { createFileRoute } from "@tanstack/react-router";
import { OwnerOnly } from "@/components/admin/OwnerOnly";
import { useEffect, useState } from "react";
import { Plug, Plus, Trash2, Power, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface Connector {
  id: string;
  name: string;
  provider: string;
  base_url: string | null;
  description: string | null;
  secret_name: string | null;
  status: string;
  enabled: boolean;
  config: Record<string, unknown>;
}

export const Route = createFileRoute("/admin/connectors")({
  component: () => (<OwnerOnly><ConnectorsPage /></OwnerOnly>),
});

function ConnectorsPage() {
  const { isSuperAdmin } = useAuth();
  const [items, setItems] = useState<Connector[] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: "",
    provider: "",
    base_url: "",
    description: "",
    secret_name: "",
  });

  const load = async () => {
    const { data, error } = await supabase
      .from("api_connectors")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data as Connector[]) ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async () => {
    if (!form.name || !form.provider) {
      toast.error("Name and provider are required");
      return;
    }
    const { error } = await supabase.from("api_connectors").insert({
      name: form.name,
      provider: form.provider,
      base_url: form.base_url || null,
      description: form.description || null,
      secret_name: form.secret_name || null,
      status: "configured",
    });
    if (error) return toast.error(error.message);
    toast.success("Connector created");
    setShowAdd(false);
    setForm({ name: "", provider: "", base_url: "", description: "", secret_name: "" });
    void load();
  };

  const toggle = async (c: Connector) => {
    const { error } = await supabase
      .from("api_connectors")
      .update({ enabled: !c.enabled })
      .eq("id", c.id);
    if (error) return toast.error(error.message);
    void load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("api_connectors").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Connector deleted");
    void load();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Master</p>
          <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">API Connectors</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Centralized hub for external APIs, keys and endpoints. Modular by design.
          </p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setShowAdd((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/15 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/25"
          >
            <Plus className="h-4 w-4" /> New connector
          </button>
        )}
      </header>

      {showAdd && (
        <div className="rounded-2xl border border-border bg-surface/40 p-5 backdrop-blur">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field
              label="Provider"
              value={form.provider}
              onChange={(v) => setForm({ ...form, provider: v })}
              placeholder="e.g. stripe, openai"
            />
            <Field
              label="Base URL"
              value={form.base_url}
              onChange={(v) => setForm({ ...form, base_url: v })}
              placeholder="https://api.example.com"
            />
            <Field
              label="Secret name"
              value={form.secret_name}
              onChange={(v) => setForm({ ...form, secret_name: v })}
              placeholder="STRIPE_SECRET_KEY"
            />
            <div className="sm:col-span-2">
              <Field
                label="Description"
                value={form.description}
                onChange={(v) => setForm({ ...form, description: v })}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setShowAdd(false)}
              className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted/30"
            >
              Cancel
            </button>
            <button
              onClick={() => void create()}
              className="rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {items === null ? (
        <div className="grid h-40 place-items-center rounded-2xl border border-border">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((c) => (
            <article
              key={c.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-5 backdrop-blur transition hover:border-primary/40"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-xl"
                    style={{
                      background: c.enabled
                        ? "var(--gradient-neon)"
                        : "color-mix(in oklab, var(--muted) 60%, transparent)",
                      boxShadow: c.enabled ? "var(--shadow-neon)" : "none",
                    }}
                  >
                    <Plug className="h-5 w-5 text-primary-foreground" />
                  </span>
                  <div>
                    <h3 className="font-medium">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.provider}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    c.enabled
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-muted/30 text-muted-foreground"
                  }`}
                >
                  {c.enabled ? "Active" : "Off"}
                </span>
              </div>
              {c.description && (
                <p className="mt-3 text-xs text-muted-foreground">{c.description}</p>
              )}
              {c.base_url && (
                <p className="mt-2 truncate text-[11px] text-muted-foreground/80">
                  → {c.base_url}
                </p>
              )}
              {c.secret_name && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background/40 px-2 py-1 text-[11px] font-mono">
                  <KeyRound className="h-3 w-3" /> {c.secret_name}
                </div>
              )}
              {isSuperAdmin && (
                <div className="mt-4 flex gap-2 border-t border-border/50 pt-3">
                  <button
                    onClick={() => void toggle(c)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-xs hover:border-primary/40"
                  >
                    <Power className="h-3.5 w-3.5" />
                    {c.enabled ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => void remove(c.id)}
                    className="rounded-md border border-border px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60"
      />
    </label>
  );
}

function EmptyState() {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border py-16 text-center">
      <Plug className="mb-3 h-8 w-8 text-muted-foreground" />
      <p className="text-sm font-medium">No connectors yet</p>
      <p className="mt-1 max-w-md text-xs text-muted-foreground">
        Add an external API to start integrating. Store secret values securely via your
        backend secret manager and reference them by name here.
      </p>
    </div>
  );
}
