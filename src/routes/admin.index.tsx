import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Loader2,
  Briefcase,
  Users,
  BarChart3,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: OverviewPage,
});

interface Stats {
  leadsTotal: number;
  leadsPending: number;
  leadsWeek: number;
  usersTotal: number;
  sessions30: number;
  pageViews30: number;
  chatSessions30: number;
  conversion: string;
  timeline: { date: string; views: number; leads: number }[];
  recentLeads: {
    id: string;
    full_name: string;
    email: string;
    project_type: string;
    status: string;
    created_at: string;
  }[];
}

function OverviewPage() {
  const [s, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const since30 = new Date(Date.now() - 30 * 86_400_000).toISOString();
    const since7 = new Date(Date.now() - 7 * 86_400_000).toISOString();

    void Promise.all([
      supabase.from("project_requests").select("id, full_name, email, project_type, status, created_at").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("analytics_events").select("event_name, session_id, created_at").gte("created_at", since30).limit(5000),
      supabase.from("chat_logs").select("session_id, created_at").gte("created_at", since30).limit(5000),
    ]).then(([leadsRes, profilesRes, eventsRes, chatRes]) => {
      const leads = (leadsRes.data ?? []) as Stats["recentLeads"][number][];
      const events = (eventsRes.data ?? []) as { event_name: string; session_id: string | null; created_at: string }[];
      const chat = (chatRes.data ?? []) as { session_id: string }[];

      const sessions = new Set(events.filter((e) => e.session_id).map((e) => e.session_id!)).size;
      const pageViews = events.filter((e) => e.event_name === "page_view").length;
      const chatSessions = new Set(chat.map((c) => c.session_id)).size;
      const leads30 = leads.filter((l) => l.created_at >= since30).length;
      const conv = sessions > 0 ? ((leads30 / sessions) * 100).toFixed(1) : "0.0";

      const days: Record<string, { date: string; views: number; leads: number }> = {};
      for (let i = 13; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86_400_000);
        const k = d.toISOString().slice(0, 10);
        days[k] = { date: k.slice(5), views: 0, leads: 0 };
      }
      events.filter((e) => e.event_name === "page_view").forEach((e) => {
        const k = e.created_at.slice(0, 10);
        if (days[k]) days[k].views += 1;
      });
      leads.forEach((l) => {
        const k = l.created_at.slice(0, 10);
        if (days[k]) days[k].leads += 1;
      });

      setStats({
        leadsTotal: leads.length,
        leadsPending: leads.filter((l) => l.status === "pending").length,
        leadsWeek: leads.filter((l) => l.created_at >= since7).length,
        usersTotal: profilesRes.count ?? 0,
        sessions30: sessions,
        pageViews30: pageViews,
        chatSessions30: chatSessions,
        conversion: conv,
        timeline: Object.values(days),
        recentLeads: leads.slice(0, 6),
      });
    });
  }, []);

  if (!s) {
    return (
      <div className="grid h-64 place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Overview</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A snapshot of activity across your site over the last 30 days.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          icon={<Briefcase className="h-5 w-5" />}
          label="New leads (7d)"
          value={s.leadsWeek}
          sub={`${s.leadsPending} pending • ${s.leadsTotal} total`}
        />
        <Kpi
          icon={<Users className="h-5 w-5" />}
          label="Registered users"
          value={s.usersTotal}
        />
        <Kpi
          icon={<BarChart3 className="h-5 w-5" />}
          label="Sessions (30d)"
          value={s.sessions30}
          sub={`${s.pageViews30} page views`}
        />
        <Kpi
          icon={<TrendingUp className="h-5 w-5" />}
          label="Conversion (30d)"
          value={`${s.conversion}%`}
          sub={`${s.chatSessions30} chat sessions`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface/40 p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold">Traffic & leads — 14 days</h3>
            <Link
              to="/admin/analytics"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Full analytics <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={s.timeline}>
                <defs>
                  <linearGradient id="ovG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(var(--primary))" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="oklch(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                <XAxis dataKey="date" stroke="oklch(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="oklch(var(--muted-foreground))" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(var(--surface))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="views" stroke="oklch(var(--primary))" fill="url(#ovG)" strokeWidth={2} />
                <Area type="monotone" dataKey="leads" stroke="oklch(var(--accent, var(--primary)))" fillOpacity={0} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold">Recent leads</h3>
            <Link to="/admin/leads" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              All leads <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {s.recentLeads.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No leads yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {s.recentLeads.map((l) => (
                <li key={l.id} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{l.full_name}</p>
                      <p className="truncate text-xs text-muted-foreground">{l.project_type}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary">
                      {l.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction to="/admin/leads" icon={<Briefcase className="h-4 w-4" />} label="Manage leads" />
        <QuickAction to="/admin/services" icon={<MessageSquare className="h-4 w-4" />} label="Edit services" />
        <QuickAction to="/admin/portfolio" icon={<BarChart3 className="h-4 w-4" />} label="Update portfolio" />
        <QuickAction to="/admin/settings" icon={<Users className="h-4 w-4" />} label="Site settings" />
      </div>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/15 text-primary">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-bold">{value}</p>
          {sub && <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-2xl border border-border bg-surface/40 px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-surface/60"
    >
      <span className="flex items-center gap-2 text-foreground">
        {icon}
        {label}
      </span>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}
