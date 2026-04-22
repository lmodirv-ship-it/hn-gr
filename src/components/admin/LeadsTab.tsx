import { useEffect, useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const STATUSES = ["pending", "in_review", "active", "completed", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  project_type: string;
  budget: string | null;
  status: Status;
  description: string;
  created_at: string;
}

export function LeadsTab() {
  const [items, setItems] = useState<Lead[] | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Status | "all">("all");
  const [type, setType] = useState<string>("all");
  const [open, setOpen] = useState<Lead | null>(null);

  const load = () => {
    setItems(null);
    void supabase
      .from("project_requests")
      .select("id, full_name, email, phone, project_type, budget, status, description, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setItems((data as Lead[]) ?? []));
  };

  useEffect(load, []);

  const updateStatus = async (id: string, s: Status) => {
    await supabase.from("project_requests").update({ status: s }).eq("id", id);
    setItems((prev) => prev?.map((l) => (l.id === id ? { ...l, status: s } : l)) ?? prev);
  };

  const types = useMemo(
    () => Array.from(new Set((items ?? []).map((l) => l.project_type))),
    [items],
  );

  const filtered = (items ?? []).filter((l) => {
    if (status !== "all" && l.status !== status) return false;
    if (type !== "all" && l.project_type !== type) return false;
    if (q) {
      const s = q.toLowerCase();
      if (
        !l.full_name.toLowerCase().includes(s) &&
        !l.email.toLowerCase().includes(s) &&
        !l.description.toLowerCase().includes(s)
      )
        return false;
    }
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, description…"
            className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status | "all")}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="all">All types</option>
          {types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      {items === null ? (
        <div className="mt-6 grid h-40 place-items-center rounded-2xl border border-border">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center text-sm text-muted-foreground">
          No matching leads.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Budget</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setOpen(r)}
                  className="cursor-pointer hover:bg-surface/30"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.full_name}</div>
                    <div className="text-xs text-muted-foreground">{r.email}</div>
                  </td>
                  <td className="px-4 py-3">{r.project_type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.budget ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={r.status}
                      onChange={(e) => void updateStatus(r.id, e.target.value as Status)}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs outline-none focus:border-primary"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur"
          onClick={() => setOpen(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6"
          >
            <p className="text-xs uppercase tracking-wider text-primary">Lead detail</p>
            <h3 className="mt-1 font-display text-xl font-bold">{open.full_name}</h3>
            <div className="mt-3 grid gap-2 text-sm">
              <Row label="Email" value={open.email} />
              <Row label="Phone" value={open.phone ?? "—"} />
              <Row label="Type" value={open.project_type} />
              <Row label="Budget" value={open.budget ?? "—"} />
              <Row label="Date" value={new Date(open.created_at).toLocaleString()} />
            </div>
            <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
              Description
            </p>
            <p className="mt-1 whitespace-pre-wrap rounded-md border border-border bg-background/40 p-3 text-sm">
              {open.description}
            </p>
            <div className="mt-5 text-right">
              <button
                onClick={() => setOpen(null)}
                className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-background/40"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
