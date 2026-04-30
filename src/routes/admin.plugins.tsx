import { createFileRoute } from "@tanstack/react-router";
import { OwnerOnly } from "@/components/admin/OwnerOnly";
import { useEffect, useState } from "react";
import { Loader2, Puzzle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useAdminT } from "@/lib/i18n/adminText";

interface PluginModule {
  id: string;
  key: string;
  name: string;
  description: string | null;
  category: string | null;
  enabled: boolean;
}

export const Route = createFileRoute("/admin/plugins")({
  component: () => (<OwnerOnly><PluginsPage /></OwnerOnly>),
});

function PluginsPage() {
  const tt = useAdminT();
  const { isSuperAdmin } = useAuth();
  const [items, setItems] = useState<PluginModule[] | null>(null);

  const load = async () => {
    const { data, error } = await supabase
      .from("plugin_modules")
      .select("*")
      .order("category")
      .order("name");
    if (error) toast.error(error.message);
    setItems((data as PluginModule[]) ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const toggle = async (p: PluginModule) => {
    const { error } = await supabase
      .from("plugin_modules")
      .update({ enabled: !p.enabled })
      .eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success(`${p.name} ${!p.enabled ? tt("common.enabled") : tt("common.disabled")}`);
    void load();
  };

  if (items === null) {
    return (
      <div className="grid h-40 place-items-center rounded-2xl border border-border">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const groups = items.reduce<Record<string, PluginModule[]>>((acc, p) => {
    const k = p.category ?? "general";
    (acc[k] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{tt("section.master")}</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">{tt("plugins.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {tt("plugins.subtitle")}
        </p>
      </header>

      {Object.entries(groups).map(([cat, list]) => (
        <section key={cat} className="space-y-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {cat}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {list.map((p) => (
              <article
                key={p.id}
                className="flex items-start gap-4 rounded-2xl border border-border bg-surface/40 p-5 backdrop-blur"
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                  style={{
                    background: p.enabled
                      ? "var(--gradient-neon)"
                      : "color-mix(in oklab, var(--muted) 60%, transparent)",
                    boxShadow: p.enabled ? "var(--shadow-neon)" : "none",
                  }}
                >
                  <Puzzle className="h-5 w-5 text-primary-foreground" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-medium">{p.name}</h3>
                    <ToggleSwitch
                      checked={p.enabled}
                      disabled={!isSuperAdmin}
                      onChange={() => void toggle(p)}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                  <code className="mt-2 inline-block text-[10px] text-muted-foreground/70">
                    {p.key}
                  </code>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      aria-pressed={checked}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "" : "bg-muted/40"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      style={
        checked
          ? {
              background: "var(--gradient-neon)",
              boxShadow: "var(--shadow-neon)",
            }
          : undefined
      }
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}
