import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Users, Briefcase, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — HN-GROUPE" },
      { name: "description", content: "HN-GROUPE admin dashboard." },
    ],
  }),
  component: AdminPage,
});

interface AdminRequest {
  id: string;
  full_name: string;
  email: string;
  project_type: string;
  budget: string | null;
  status: string;
  description: string;
  created_at: string;
}

const STATUSES = ["pending", "in_review", "active", "completed", "cancelled"] as const;

function AdminPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin, role } = useAuth();
  const [items, setItems] = useState<AdminRequest[] | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) void navigate({ to: "/auth" });
    else if (role && !isAdmin) void navigate({ to: "/dashboard" });
  }, [user, authLoading, isAdmin, role, navigate]);

  const load = () => {
    void supabase
      .from("project_requests")
      .select("id, full_name, email, project_type, budget, status, description, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setItems((data as AdminRequest[]) ?? []));
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const updateStatus = async (id: string, status: (typeof STATUSES)[number]) => {
    await supabase.from("project_requests").update({ status }).eq("id", id);
    load();
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const stats = {
    total: items?.length ?? 0,
    pending: items?.filter((i) => i.status === "pending").length ?? 0,
    active: items?.filter((i) => i.status === "active").length ?? 0,
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Control center</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage all incoming project requests and update their status.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm text-muted-foreground hover:text-foreground"
        >
          ← My dashboard
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat icon={<Briefcase className="h-5 w-5" />} label="Total requests" value={stats.total} />
        <Stat icon={<Activity className="h-5 w-5" />} label="Pending" value={stats.pending} />
        <Stat icon={<Users className="h-5 w-5" />} label="Active projects" value={stats.active} />
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold">All project requests</h2>
        {items === null ? (
          <div className="mt-6 grid h-40 place-items-center rounded-2xl border border-border">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center text-sm text-muted-foreground">
            No requests yet.
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
                {items.map((r) => (
                  <tr key={r.id} className="hover:bg-surface/30">
                    <td className="px-4 py-3">
                      <div className="font-medium">{r.full_name}</div>
                      <div className="text-xs text-muted-foreground">{r.email}</div>
                    </td>
                    <td className="px-4 py-3">{r.project_type}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.budget ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={r.status}
                        onChange={(e) => void updateStatus(r.id, e.target.value as (typeof STATUSES)[number])}
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
      </div>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/15 text-primary">
          {icon}
        </span>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
