import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Download, Trash2, Mail, Phone, UserPlus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generateCvSummary } from "@/server/cvSummary";
import { useAdminT } from "@/lib/i18n/adminText";

type Status = "new" | "in_review" | "shortlisted" | "interviewed" | "hired" | "rejected";

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  specialty: string;
  message: string | null;
  cv_path: string | null;
  status: Status;
  notes: string | null;
  cv_summary: string | null;
  created_at: string;
}

const STATUS_META: Record<Status, { labelKey: `status.${Status}`; cls: string }> = {
  new: { labelKey: "status.new", cls: "bg-primary/15 text-primary" },
  in_review: { labelKey: "status.in_review", cls: "bg-amber-500/15 text-amber-300" },
  shortlisted: { labelKey: "status.shortlisted", cls: "bg-violet-500/15 text-violet-300" },
  interviewed: { labelKey: "status.interviewed", cls: "bg-cyan-500/15 text-cyan-300" },
  hired: { labelKey: "status.hired", cls: "bg-emerald-500/15 text-emerald-300" },
  rejected: { labelKey: "status.rejected", cls: "bg-destructive/15 text-destructive" },
};

export const Route = createFileRoute("/admin/careers")({
  component: AdminCareersPage,
});

function AdminCareersPage() {
  const tt = useAdminT();
  const [items, setItems] = useState<Application[] | null>(null);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [summarizing, setSummarizing] = useState<string | null>(null);

  const summarize = async (id: string) => {
    setSummarizing(id);
    try {
      const { summary } = await generateCvSummary({ data: { applicationId: id } });
      setItems((prev) =>
        (prev ?? []).map((a) => (a.id === id ? { ...a, cv_summary: summary } : a)),
      );
      toast.success(tt("careers.toast.summary"));
    } catch (e) {
      const msg = e instanceof Error ? e.message : tt("careers.toast.summaryFail");
      toast.error(msg);
    } finally {
      setSummarizing(null);
    }
  };

  const load = async () => {
    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data as Application[]) ?? []);
  };

  useEffect(() => {
    void load();
    const ch = supabase
      .channel("careers")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "job_applications" },
        () => void load(),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, []);

  const updateStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from("job_applications").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(tt("careers.toast.status"));
  };

  const remove = async (id: string, cv_path: string | null) => {
    if (!confirm(tt("careers.confirm.delete"))) return;
    if (cv_path) await supabase.storage.from("cvs").remove([cv_path]);
    const { error } = await supabase.from("job_applications").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(tt("careers.toast.deleted"));
  };

  const downloadCv = async (cv_path: string) => {
    const { data, error } = await supabase.storage.from("cvs").createSignedUrl(cv_path, 60);
    if (error || !data) return toast.error(error?.message ?? tt("careers.downloadFail"));
    window.open(data.signedUrl, "_blank");
  };

  if (items === null) {
    return (
      <div className="grid h-40 place-items-center rounded-2xl border border-border">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);
  const counts = items.reduce<Record<string, number>>((acc, i) => {
    acc[i.status] = (acc[i.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Content</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Careers · ATS</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage incoming job applications. {items.length} total ·{" "}
          <span className="text-primary">{counts.new ?? 0} new</span>
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          All ({items.length})
        </FilterChip>
        {(Object.keys(STATUS_META) as Status[]).map((s) => (
          <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>
            {STATUS_META[s].label} ({counts[s] ?? 0})
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-border py-16">
          <UserPlus className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No applications in this view.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((a) => (
            <article
              key={a.id}
              className="rounded-2xl border border-border bg-surface/40 p-5 backdrop-blur"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">{a.full_name}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${STATUS_META[a.status].cls}`}
                    >
                      {STATUS_META[a.status].label}
                    </span>
                    <span className="rounded-full bg-muted/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {a.specialty}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <a href={`mailto:${a.email}`} className="flex items-center gap-1.5 hover:text-primary">
                      <Mail className="h-3 w-3" /> {a.email}
                    </a>
                    {a.phone && (
                      <a href={`tel:${a.phone}`} className="flex items-center gap-1.5 hover:text-primary">
                        <Phone className="h-3 w-3" /> {a.phone}
                      </a>
                    )}
                    <span className="tabular-nums">
                      {new Date(a.created_at).toLocaleString()}
                    </span>
                  </div>
                  {a.message && (
                    <p className="mt-3 line-clamp-3 rounded-lg bg-background/40 p-3 text-xs text-muted-foreground">
                      {a.message}
                    </p>
                  )}
                  {a.cv_summary ? (
                    <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs">
                      <div className="mb-1 inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider text-primary">
                        <Sparkles className="h-3 w-3" /> AI summary
                      </div>
                      <p className="text-foreground/90">{a.cv_summary}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => void summarize(a.id)}
                      disabled={summarizing === a.id}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary/20 disabled:opacity-60"
                    >
                      {summarizing === a.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Sparkles className="h-3 w-3" />
                      )}
                      AI summary
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={a.status}
                    onChange={(e) => void updateStatus(a.id, e.target.value as Status)}
                    className="rounded-md border border-border bg-background px-2 py-1.5 text-xs"
                  >
                    {(Object.keys(STATUS_META) as Status[]).map((s) => (
                      <option key={s} value={s}>
                        {STATUS_META[s].label}
                      </option>
                    ))}
                  </select>
                  {a.cv_path && (
                    <button
                      onClick={() => void downloadCv(a.cv_path!)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs hover:border-primary/40 hover:text-primary"
                    >
                      <Download className="h-3 w-3" /> CV
                    </button>
                  )}
                  <button
                    onClick={() => void remove(a.id, a.cv_path)}
                    className="rounded-md border border-border p-1.5 text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition ${
        active
          ? "border-primary/50 bg-primary/15 text-primary"
          : "border-border bg-surface/40 text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
