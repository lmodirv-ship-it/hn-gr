import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Briefcase,
  Users,
  TrendingUp,
  Eye,
  ArrowUpRight,
  Sparkles,
  Wrench,
  Image as ImageIcon,
  Settings,
  Globe,
  Target,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { KpiCard } from "@/components/admin/KpiCard";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin/")({
  component: OverviewPage,
});

type Range = 7 | 30 | 90;

interface Lead {
  id: string;
  full_name: string;
  email: string;
  project_type: string;
  status: string;
  created_at: string;
}

interface EventRow {
  event_name: string;
  session_id: string | null;
  path: string | null;
  created_at: string;
}

interface Stats {
  leadsTotal: number;
  leadsPending: number;
  usersTotal: number;
  sessions: number;
  pageViews: number;
  conversion: number;
  // KPI deltas vs previous equivalent window
  leadsDelta: number;
  usersDelta: number;
  sessionsDelta: number;
  conversionDelta: number;
  // Sparklines
  sparkLeads: { v: number }[];
  sparkUsers: { v: number }[];
  sparkSessions: { v: number }[];
  sparkConv: { v: number }[];
  // Charts
  timeline: { date: string; views: number; sessions: number; leads: number }[];
  topPages: { path: string; count: number }[];
  funnel: { name: string; value: number; fill: string }[];
  recentLeads: Lead[];
}

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function OverviewPage() {
  const { user } = useAuth();
  const [range, setRange] = useState<Range>(30);
  const [s, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    setStats(null);
    const days = range;
    const sinceCur = new Date(Date.now() - days * 86_400_000).toISOString();
    const sincePrev = new Date(Date.now() - 2 * days * 86_400_000).toISOString();

    void Promise.all([
      supabase
        .from("project_requests")
        .select("id, full_name, email, project_type, status, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, created_at"),
      supabase
        .from("analytics_events")
        .select("event_name, session_id, path, created_at")
        .gte("created_at", sincePrev)
        .limit(10000),
    ]).then(([leadsRes, profilesRes, eventsRes]) => {
      const leads = (leadsRes.data ?? []) as Lead[];
      const profiles = (profilesRes.data ?? []) as { id: string; created_at: string }[];
      const events = (eventsRes.data ?? []) as EventRow[];

      const curEvents = events.filter((e) => e.created_at >= sinceCur);
      const prevEvents = events.filter(
        (e) => e.created_at >= sincePrev && e.created_at < sinceCur,
      );
      const curLeads = leads.filter((l) => l.created_at >= sinceCur);
      const prevLeads = leads.filter(
        (l) => l.created_at >= sincePrev && l.created_at < sinceCur,
      );
      const curUsers = profiles.filter((p) => p.created_at >= sinceCur);
      const prevUsers = profiles.filter(
        (p) => p.created_at >= sincePrev && p.created_at < sinceCur,
      );

      const sessionsCur = new Set(curEvents.filter((e) => e.session_id).map((e) => e.session_id!)).size;
      const sessionsPrev = new Set(prevEvents.filter((e) => e.session_id).map((e) => e.session_id!)).size;
      const pageViews = curEvents.filter((e) => e.event_name === "page_view").length;

      const convCur = sessionsCur > 0 ? (curLeads.length / sessionsCur) * 100 : 0;
      const convPrev = sessionsPrev > 0 ? (prevLeads.length / sessionsPrev) * 100 : 0;

      const pct = (cur: number, prev: number) => {
        if (prev === 0) return cur > 0 ? 100 : 0;
        return ((cur - prev) / prev) * 100;
      };

      // Daily buckets for sparklines & timeline
      const buckets: Record<string, { date: string; views: number; sessions: Set<string>; leads: number }> = {};
      const labelDays = Math.min(days, 30);
      for (let i = labelDays - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86_400_000);
        const k = d.toISOString().slice(0, 10);
        buckets[k] = { date: k.slice(5), views: 0, sessions: new Set(), leads: 0 };
      }
      curEvents.forEach((e) => {
        const k = e.created_at.slice(0, 10);
        if (!buckets[k]) return;
        if (e.event_name === "page_view") buckets[k].views += 1;
        if (e.session_id) buckets[k].sessions.add(e.session_id);
      });
      curLeads.forEach((l) => {
        const k = l.created_at.slice(0, 10);
        if (buckets[k]) buckets[k].leads += 1;
      });

      const timeline = Object.values(buckets).map((b) => ({
        date: b.date,
        views: b.views,
        sessions: b.sessions.size,
        leads: b.leads,
      }));

      const sparkLeads = timeline.map((t) => ({ v: t.leads }));
      const sparkSessions = timeline.map((t) => ({ v: t.sessions }));
      const sparkConv = timeline.map((t) => ({
        v: t.sessions > 0 ? (t.leads / t.sessions) * 100 : 0,
      }));

      // Users sparkline by day
      const userBuckets: Record<string, number> = {};
      Object.keys(buckets).forEach((k) => (userBuckets[k] = 0));
      profiles.forEach((p) => {
        const k = p.created_at.slice(0, 10);
        if (k in userBuckets) userBuckets[k] += 1;
      });
      const sparkUsers = Object.values(userBuckets).map((v) => ({ v }));

      // Top pages
      const pageCounts: Record<string, number> = {};
      curEvents
        .filter((e) => e.event_name === "page_view" && e.path)
        .forEach((e) => {
          pageCounts[e.path!] = (pageCounts[e.path!] ?? 0) + 1;
        });
      const topPages = Object.entries(pageCounts)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      // Funnel: status distribution
      const statuses: Record<string, number> = { pending: 0, in_review: 0, active: 0, completed: 0 };
      leads.forEach((l) => {
        if (l.status in statuses) statuses[l.status] += 1;
      });
      const funnelTotal = Object.values(statuses).reduce((a, b) => a + b, 0) || 1;
      const funnel = [
        { name: "Pending", value: Math.round((statuses.pending / funnelTotal) * 100), fill: "var(--accent)" },
        { name: "In review", value: Math.round((statuses.in_review / funnelTotal) * 100), fill: "var(--primary)" },
        { name: "Active", value: Math.round((statuses.active / funnelTotal) * 100), fill: "oklch(0.72 0.18 150)" },
        { name: "Completed", value: Math.round((statuses.completed / funnelTotal) * 100), fill: "oklch(0.7 0.18 250)" },
      ];

      setStats({
        leadsTotal: leads.length,
        leadsPending: leads.filter((l) => l.status === "pending").length,
        usersTotal: profiles.length,
        sessions: sessionsCur,
        pageViews,
        conversion: convCur,
        leadsDelta: pct(curLeads.length, prevLeads.length),
        usersDelta: pct(curUsers.length, prevUsers.length),
        sessionsDelta: pct(sessionsCur, sessionsPrev),
        conversionDelta: pct(convCur, convPrev),
        sparkLeads,
        sparkUsers,
        sparkSessions,
        sparkConv,
        timeline,
        topPages,
        funnel,
        recentLeads: leads.slice(0, 5),
      });
    });
  }, [range]);

  const name = useMemo(() => {
    const e = user?.email ?? "admin";
    return e.split("@")[0].split(".")[0];
  }, [user]);

  if (!s) {
    return (
      <div className="grid h-[60vh] place-items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Syncing live data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            <Sparkles className="h-3 w-3" />
            Mission control
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {greeting()},{" "}
            <span className="capitalize shimmer-text">{name}</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {s.leadsPending > 0
              ? `You have ${s.leadsPending} pending lead${s.leadsPending === 1 ? "" : "s"} to review.`
              : "You're all caught up. Everything looks great."}
          </p>
        </div>

        {/* Range tabs */}
        <div
          className="inline-flex items-center gap-0.5 rounded-full border border-border/60 p-1 text-xs"
          style={{ background: "color-mix(in oklab, var(--surface) 60%, transparent)" }}
        >
          {([7, 30, 90] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-full px-3 py-1.5 font-medium transition-all ${
                r === range
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={
                r === range
                  ? {
                      background: "var(--gradient-neon)",
                      boxShadow:
                        "0 4px 14px -4px color-mix(in oklab, var(--primary) 70%, transparent)",
                    }
                  : undefined
              }
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={<Briefcase className="h-5 w-5" />}
          label={`New leads (${range}d)`}
          value={s.sparkLeads.reduce((a, b) => a + b.v, 0)}
          delta={s.leadsDelta}
          spark={s.sparkLeads}
          delay={0}
        />
        <KpiCard
          icon={<Users className="h-5 w-5" />}
          label="Registered users"
          value={s.usersTotal}
          delta={s.usersDelta}
          spark={s.sparkUsers}
          tone="accent"
          delay={60}
        />
        <KpiCard
          icon={<Eye className="h-5 w-5" />}
          label={`Sessions (${range}d)`}
          value={s.sessions}
          delta={s.sessionsDelta}
          spark={s.sparkSessions}
          delay={120}
        />
        <KpiCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Conversion rate"
          value={Math.round(s.conversion * 10) / 10}
          suffix="%"
          delta={s.conversionDelta}
          spark={s.sparkConv}
          tone="accent"
          delay={180}
        />
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Chart */}
        <div
          className="neon-card animate-fade-up p-5 lg:col-span-2"
          style={{ animationDelay: "240ms" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-sm font-semibold">Traffic & conversion</h3>
              <p className="text-[11px] text-muted-foreground">
                Sessions, page views, and leads — last {range} days
              </p>
            </div>
            <Link
              to="/admin/analytics"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Full analytics <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={s.timeline} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="ovV" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ovS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="color-mix(in oklab, var(--border) 60%, transparent)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ stroke: "var(--primary)", strokeOpacity: 0.3, strokeWidth: 1 }}
                  contentStyle={{
                    background: "color-mix(in oklab, var(--surface) 90%, transparent)",
                    border: "1px solid color-mix(in oklab, var(--primary) 30%, transparent)",
                    borderRadius: 12,
                    fontSize: 12,
                    backdropFilter: "blur(12px)",
                    boxShadow: "var(--shadow-card)",
                  }}
                  labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Page views"
                  stroke="var(--primary)"
                  fill="url(#ovV)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  name="Sessions"
                  stroke="var(--accent)"
                  fill="url(#ovS)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  name="Leads"
                  stroke="oklch(0.72 0.18 150)"
                  fillOpacity={0}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
            <Legend color="var(--primary)" label="Page views" />
            <Legend color="var(--accent)" label="Sessions" />
            <Legend color="oklch(0.72 0.18 150)" label="Leads" dashed />
          </div>
        </div>

        {/* Activity feed */}
        <div className="animate-fade-up h-[420px]" style={{ animationDelay: "300ms" }}>
          <ActivityFeed />
        </div>
      </div>

      {/* Secondary grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Top pages */}
        <div className="neon-card animate-fade-up p-5" style={{ animationDelay: "360ms" }}>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Top pages
            </h3>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {range}d
            </span>
          </div>
          {s.topPages.length === 0 ? (
            <p className="py-12 text-center text-xs text-muted-foreground">No traffic yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {s.topPages.map((p, i) => {
                const max = s.topPages[0].count;
                const pct = (p.count / max) * 100;
                return (
                  <li key={p.path} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="truncate text-muted-foreground">
                        <span className="mr-2 font-mono text-[10px] text-primary/70">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {p.path}
                      </span>
                      <span className="font-mono tabular-nums text-foreground">{p.count}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: "var(--gradient-neon)",
                          boxShadow:
                            "0 0 8px color-mix(in oklab, var(--primary) 60%, transparent)",
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Funnel radial */}
        <div className="neon-card animate-fade-up p-5" style={{ animationDelay: "420ms" }}>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-accent" />
              Lead pipeline
            </h3>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              All time
            </span>
          </div>
          <div className="relative mt-2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="35%"
                outerRadius="100%"
                data={s.funnel}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background={{ fill: "color-mix(in oklab, var(--surface) 80%, transparent)" }} dataKey="value" cornerRadius={8} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="font-display text-3xl font-bold">{s.leadsTotal}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Total leads
                </p>
              </div>
            </div>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
            {s.funnel.map((f) => (
              <li key={f.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: f.fill }} />
                <span className="text-muted-foreground">{f.name}</span>
                <span className="ml-auto font-mono text-foreground">{f.value}%</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent leads */}
        <div className="neon-card animate-fade-up p-5" style={{ animationDelay: "480ms" }}>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Recent leads
            </h3>
            <Link to="/admin/leads" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              All <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {s.recentLeads.length === 0 ? (
            <p className="py-12 text-center text-xs text-muted-foreground">No leads yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border/50">
              {s.recentLeads.map((l) => (
                <li key={l.id} className="flex items-center gap-3 py-2.5">
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold uppercase"
                    style={{
                      background: "var(--gradient-neon)",
                      color: "var(--primary-foreground)",
                    }}
                  >
                    {l.full_name.slice(0, 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{l.full_name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{l.project_type}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                      l.status === "pending"
                        ? "bg-amber-400/15 text-amber-300"
                        : "bg-primary/15 text-primary"
                    }`}
                  >
                    {l.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick actions dock */}
      <div
        className="animate-fade-up grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        style={{ animationDelay: "540ms" }}
      >
        <QuickAction to="/admin/leads" icon={<Briefcase className="h-4 w-4" />} label="Manage leads" />
        <QuickAction to="/admin/services" icon={<Wrench className="h-4 w-4" />} label="Edit services" />
        <QuickAction to="/admin/portfolio" icon={<ImageIcon className="h-4 w-4" />} label="Update portfolio" />
        <QuickAction to="/admin/settings" icon={<Settings className="h-4 w-4" />} label="Site settings" />
      </div>

      <p className="text-center text-[10px] text-muted-foreground">
        Press{" "}
        <kbd className="rounded border border-border bg-surface/40 px-1.5 py-0.5 font-mono">⌘K</kbd>{" "}
        anywhere to open the command palette
      </p>
    </div>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="block h-0.5 w-4 rounded-full"
        style={{
          background: color,
          ...(dashed
            ? { backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 8px)` }
            : {}),
        }}
      />
      {label}
    </span>
  );
}

function QuickAction({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="group neon-card flex items-center justify-between px-4 py-3 text-sm transition-transform hover:-translate-y-0.5"
    >
      <span className="flex items-center gap-2.5 text-foreground">
        <span className="neon-icon" style={{ width: "2rem", height: "2rem" }}>
          {icon}
        </span>
        {label}
      </span>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

