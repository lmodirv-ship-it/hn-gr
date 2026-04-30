import { createFileRoute } from "@tanstack/react-router";
import { OwnerOnly } from "@/components/admin/OwnerOnly";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdminT, type AdminTextKey } from "@/lib/i18n/adminText";

export const Route = createFileRoute("/admin/settings")({
  component: () => (<OwnerOnly><SettingsAdmin /></OwnerOnly>),
});

type SettingsMap = Record<string, Record<string, string>>;

const SCHEMA: { key: string; labelKey: AdminTextKey; fields: { name: string; labelKey: AdminTextKey; type?: string }[] }[] = [
  {
    key: "contact",
    labelKey: "settings.contact",
    fields: [
      { name: "email", labelKey: "settings.email", type: "email" },
      { name: "phone", labelKey: "settings.phone" },
      { name: "whatsapp", labelKey: "settings.whatsapp" },
      { name: "calendly", labelKey: "settings.calendly" },
    ],
  },
  {
    key: "seo",
    labelKey: "settings.seo",
    fields: [
      { name: "title", labelKey: "settings.defaultTitle" },
      { name: "description", labelKey: "settings.metaDescription" },
      { name: "ogImage", labelKey: "settings.ogImage" },
    ],
  },
  {
    key: "social",
    labelKey: "settings.social",
    fields: [
      { name: "instagram", labelKey: "settings.instagram" as AdminTextKey },
      { name: "linkedin", labelKey: "settings.linkedin" as AdminTextKey },
      { name: "twitter", labelKey: "settings.twitter" as AdminTextKey },
      { name: "facebook", labelKey: "settings.facebook" as AdminTextKey },
    ],
  },
];

function SettingsAdmin() {
  const [data, setData] = useState<SettingsMap | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    void supabase
      .from("site_settings")
      .select("key, value")
      .then(({ data: rows }) => {
        const map: SettingsMap = {};
        SCHEMA.forEach((s) => (map[s.key] = {}));
        (rows ?? []).forEach((r) => {
          map[r.key as string] = {
            ...(map[r.key as string] ?? {}),
            ...(r.value as Record<string, string>),
          };
        });
        setData(map);
      });
  }, []);

  const update = (groupKey: string, field: string, value: string) =>
    setData((prev) => (prev ? { ...prev, [groupKey]: { ...prev[groupKey], [field]: value } } : prev));

  const save = async (groupKey: string) => {
    if (!data) return;
    setSaving(groupKey);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: groupKey, value: data[groupKey] });
    setSaving(null);
    if (error) toast.error(error.message);
    else toast.success(`${groupKey} settings saved`);
  };

  if (!data) {
    return (
      <div className="grid h-40 place-items-center rounded-2xl border border-border">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Site settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          General configuration used across the site (contact, SEO, social).
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {SCHEMA.map((group) => (
          <div key={group.key} className="rounded-2xl border border-border bg-surface/40 p-5">
            <h3 className="font-display text-sm font-semibold">{group.label}</h3>
            <div className="mt-4 space-y-3">
              {group.fields.map((f) => (
                <label key={f.name} className="block">
                  <span className="mb-1 block text-[11px] uppercase tracking-wider text-muted-foreground">
                    {f.label}
                  </span>
                  <input
                    type={f.type ?? "text"}
                    value={data[group.key]?.[f.name] ?? ""}
                    onChange={(e) => update(group.key, f.name, e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </label>
              ))}
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => void save(group.key)}
                disabled={saving === group.key}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60"
              >
                {saving === group.key ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Save {group.label.toLowerCase()}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
