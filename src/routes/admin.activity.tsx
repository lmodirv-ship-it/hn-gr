import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Activity, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Log {
  id: string;
  user_id: string | null;
  actor_email: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export const Route = createFileRoute("/admin/activity")({
  component: ActivityPage,
});

function ActivityPage() {
  const [logs, setLogs] = useState<Log[] | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    void supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => setLogs((data as Log[]) ?? []));
  }, []);

  if (logs === null) {
    return (
      <div className="grid h-40 place-items-center rounded-2xl border border-border">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const filtered = logs.filter(
    (l) =>
      !filter ||
      l.action.toLowerCase().includes(filter.toLowerCase()) ||
      (l.actor_email ?? "").toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Master</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Activity Logs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Audit trail of admin and system actions across the platform.
        </p>
      </header>

      <div className="relative">
        <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by action or user…"
          className="w-full rounded-xl border border-border bg-surface/40 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/60"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-border py-16">
          <Activity className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-surface/30">
                  <td className="px-4 py-2.5 text-xs text-muted-foreground tabular-nums">
                    {new Date(l.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5">{l.actor_email ?? "system"}</td>
                  <td className="px-4 py-2.5">
                    <code className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] text-primary">
                      {l.action}
                    </code>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {l.target_type}
                    {l.target_id ? ` · ${l.target_id.slice(0, 8)}` : ""}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{l.ip_address ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
