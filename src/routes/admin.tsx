import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Briefcase, Users, BarChart3, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { LeadsTab } from "@/components/admin/LeadsTab";
import { UsersTab } from "@/components/admin/UsersTab";
import { AnalyticsTab } from "@/components/admin/AnalyticsTab";
import { ChatLogsTab } from "@/components/admin/ChatLogsTab";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — HN-GROUPE" },
      { name: "description", content: "HN-GROUPE admin dashboard." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Tab = "leads" | "users" | "analytics" | "chat";

const TABS: { id: Tab; label: string; icon: typeof Briefcase }[] = [
  { id: "leads", label: "Leads", icon: Briefcase },
  { id: "users", label: "Users", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "chat", label: "Chat logs", icon: MessageSquare },
];

function AdminPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin, role } = useAuth();
  const [tab, setTab] = useState<Tab>("leads");

  useEffect(() => {
    if (authLoading) return;
    if (!user) void navigate({ to: "/auth" });
    else if (role && !isAdmin) void navigate({ to: "/dashboard" });
  }, [user, authLoading, isAdmin, role, navigate]);

  if (authLoading || !isAdmin) {
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
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Control center</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage leads, users, and monitor traffic in one place.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm text-muted-foreground hover:text-foreground"
        >
          ← My dashboard
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-1 rounded-md border border-border bg-surface/40 p-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-[image:var(--gradient-gold)] text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {tab === "leads" && <LeadsTab />}
        {tab === "users" && <UsersTab />}
        {tab === "analytics" && <AnalyticsTab />}
        {tab === "chat" && <ChatLogsTab />}
      </div>
    </section>
  );
}
