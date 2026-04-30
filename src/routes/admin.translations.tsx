import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Languages, Loader2, Save, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { i18n, LANG_META, SUPPORTED_LANGS, seedResources, type Lang } from "@/lib/i18n";

interface Row {
  key: string;
  values: Record<Lang, string>;
  dirty?: boolean;
}

export const Route = createFileRoute("/admin/translations")({
  component: TranslationsPage,
});

function TranslationsPage() {
  const { t } = useTranslation();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");

  useEffect(() => {
    void load();
  }, []);

  const load = async () => {
    const seedKeys = new Set<string>();
    for (const lng of SUPPORTED_LANGS) {
      Object.keys(seedResources[lng].translation).forEach((k) => seedKeys.add(k));
    }
    const { data } = await supabase.from("translations").select("key, lang, value");
    const dbKeys = new Set<string>();
    const dbMap: Record<string, Record<string, string>> = {};
    (data ?? []).forEach((r: { key: string; lang: string; value: string }) => {
      dbKeys.add(r.key);
      dbMap[r.key] = dbMap[r.key] ?? {};
      dbMap[r.key][r.lang] = r.value;
    });
    const allKeys = Array.from(new Set([...seedKeys, ...dbKeys])).sort();
    setRows(
      allKeys.map((k) => {
        const values = {} as Record<Lang, string>;
        for (const lng of SUPPORTED_LANGS) {
          values[lng] =
            dbMap[k]?.[lng] ??
            (seedResources[lng].translation as Record<string, string>)[k] ??
            "";
        }
        return { key: k, values };
      }),
    );
  };

  const filtered = useMemo(() => {
    if (!rows) return [];
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(
      (r) =>
        r.key.toLowerCase().includes(term) ||
        SUPPORTED_LANGS.some((l) => r.values[l].toLowerCase().includes(term)),
    );
  }, [rows, q]);

  const update = (key: string, lang: Lang, value: string) => {
    setRows((prev) =>
      (prev ?? []).map((r) =>
        r.key === key ? { ...r, values: { ...r.values, [lang]: value }, dirty: true } : r,
      ),
    );
  };

  const save = async (row: Row) => {
    setSavingKey(row.key);
    const payload = SUPPORTED_LANGS.map((lang) => ({
      key: row.key,
      lang,
      value: row.values[lang] ?? "",
    }));
    const { error } = await supabase
      .from("translations")
      .upsert(payload, { onConflict: "key,lang" });
    setSavingKey(null);
    if (error) return toast.error(error.message);
    // hot-reload into runtime so the admin sees their change immediately
    for (const lang of SUPPORTED_LANGS) {
      i18n.addResource(lang, "translation", row.key, row.values[lang]);
    }
    setRows((prev) => (prev ?? []).map((r) => (r.key === row.key ? { ...r, dirty: false } : r)));
    toast.success("Saved");
  };

  const addKey = () => {
    const k = newKey.trim();
    if (!k) return;
    if ((rows ?? []).some((r) => r.key === k)) return toast.error("Key already exists");
    const values = {} as Record<Lang, string>;
    SUPPORTED_LANGS.forEach((l) => (values[l] = ""));
    setRows((prev) => [{ key: k, values, dirty: true }, ...(prev ?? [])]);
    setNewKey("");
  };

  if (rows === null) {
    return (
      <div className="grid h-40 place-items-center rounded-2xl border border-border">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">System</p>
        <h1 className="mt-1 inline-flex items-center gap-2 font-display text-3xl font-bold sm:text-4xl">
          <Languages className="h-7 w-7 text-primary" /> {t("admin.nav.translations")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Edit any UI string in {SUPPORTED_LANGS.length} languages. Saved values override the
          built-in defaults instantly across the site.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search keys or values…"
            className="w-full rounded-md border border-border bg-background py-2 ps-9 pe-3 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="new.key.name"
            className="rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            onClick={addKey}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" /> Add key
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-start font-semibold">Key</th>
              {SUPPORTED_LANGS.map((l) => (
                <th key={l} className="px-3 py-2 text-start font-semibold">
                  {LANG_META[l].flag} {LANG_META[l].native}
                </th>
              ))}
              <th className="px-3 py-2 text-end font-semibold w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.key} className="border-t border-border align-top">
                <td className="px-3 py-2">
                  <code className="text-[11px] text-muted-foreground">{row.key}</code>
                </td>
                {SUPPORTED_LANGS.map((l) => (
                  <td key={l} className="px-3 py-2">
                    <textarea
                      dir={LANG_META[l].dir}
                      value={row.values[l]}
                      onChange={(e) => update(row.key, l, e.target.value)}
                      rows={1}
                      className="min-h-[36px] w-full resize-y rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                    />
                  </td>
                ))}
                <td className="px-3 py-2 text-end">
                  <button
                    onClick={() => void save(row)}
                    disabled={!row.dirty || savingKey === row.key}
                    className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1.5 text-xs text-primary hover:bg-primary/20 disabled:opacity-40"
                  >
                    {savingKey === row.key ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Save className="h-3 w-3" />
                    )}
                    Save
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={SUPPORTED_LANGS.length + 2} className="px-3 py-12 text-center text-sm text-muted-foreground">
                  No keys match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
