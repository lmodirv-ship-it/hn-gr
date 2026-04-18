import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, FolderKanban, Plus, LogOut, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — HN-GROUPE" },
      { name: "description", content: "Your HN-GROUPE projects and requests." },
    ],
  }),
  component: DashboardPage,
});

interface Request {
  id: string;
  project_type: string;
  status: string;
  description: string;
  created_at: string;
  budget: string | null;
}

const statusColor: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  in_review: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  completed: "bg-primary/15 text-primary border-primary/30",
  cancelled: "bg-muted text-muted-foreground border-border",
};

function DashboardPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin, signOut } = useAuth();
  const [requests, setRequests] = useState<Request[] | null>(null);

  useEffect(() => {
    if (!authLoading && !user) void navigate({ to: "/auth" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    void supabase
      .from("project_requests")
      .select("id, project_type, status, description, created_at, budget")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setRequests((data as Request[]) ?? []));
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Dashboard</p>
          <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
            Welcome, {user.email}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track your HN-GROUPE project requests in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 text-sm font-semibold text-primary"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
          <Link
            to="/start-project"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[image:var(--gradient-gold)] px-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)]"
          >
            <Plus className="h-4 w-4" />
            New project
          </Link>
          <button
            onClick={() => {
              void signOut().then(() => navigate({ to: "/" }));
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold">My projects</h2>
        {requests === null ? (
          <div className="mt-6 grid h-40 place-items-center rounded-2xl border border-border">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : requests.length === 0 ? (
          <div className="mt-6 grid place-items-center rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center">
            <FolderKanban className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-medium">No project requests yet</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Submit your first request and we'll get back to you within one business day.
            </p>
            <Link
              to="/start-project"
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-[image:var(--gradient-gold)] px-4 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              Start a project
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-3">
            {requests.map((r) => (
              <article
                key={r.id}
                className="rounded-xl border border-border bg-surface/40 p-5 transition-colors hover:border-primary/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold">{r.project_type}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString()} · {r.budget ?? "—"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${statusColor[r.status] ?? statusColor.pending}`}
                  >
                    {r.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
