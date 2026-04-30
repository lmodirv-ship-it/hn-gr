import { useEffect, useMemo, useState } from "react";
import { Loader2, Eye, MousePointerClick, MessageCircle, Send } from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";

interface EventRow {
  event_name: string;
  session_id: string | null;
  path: string | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
}
interface LeadRow {
  project_type: string;
  created_at: string;
}

export function AnalyticsTab() {
  const [events, setEvents] = useState<EventRow[] | null>(null);
  const [leads, setLeads] = useState<LeadRow[]>([]);

  useEffect(() => {
    const since = new Date(Date.now() - 30 * 86_400_000).toISOString();
    void Promise.all([
      supabase
        .from("analytics_events")
        .select("event_name, session_id, path, created_at, metadata")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(5000),
      supabase
        .from("project_requests")
        .select("project_type, created_at")
        .gte("created_at", since),
    ]).then(([e, l]) => {
      setEvents((e.data as EventRow[]) ?? []);
      setLeads((l.data as LeadRow[]) ?? []);
    });
  }, []);

  const stats = useMemo(() => {
    if (!events) return null;
    const sessions = new Set(events.filter((e) => e.session_id).map((e) => e.session_id!)).size;
    const pageViews = events.filter((e) => e.event_name === "page_view").length;
    const ctaClicks = events.filter((e) => e.event_name === "cta_click").length;
    const chatOpens = events.filter((e) => e.event_name === "chat_open").length;
    const leadCount = leads.length;
    const conv = sessions > 0 ? ((leadCount / sessions) * 100).toFixed(1) : "0.0";

    // Time series (last 14 days)
    const days: Record<string, { date: string; views: number; leads: number }> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86_400_000);
      const key = d.toISOString().slice(0, 10);
      days[key] = { date: key.slice(5), views: 0, leads: 0 };
    }
    events
      .filter((e) => e.event_name === "page_view")
      .forEach((e) => {
        const k = e.created_at.slice(0, 10);
        if (days[k]) days[k].views += 1;
      });
    leads.forEach((l) => {
      const k = l.created_at.slice(0, 10);
      if (days[k]) days[k].leads += 1;
    });

    // Top pages
    const pageCounts: Record<string, number> = {};
    events
      .filter((e) => e.event_name === "page_view" && e.path)
      .forEach((e) => {
        pageCounts[e.path!] = (pageCounts[e.path!] ?? 0) + 1;
      });
    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Service demand
    const serviceCounts: Record<string, number> = {};
    leads.forEach((l) => {
      serviceCounts[l.project_type] = (serviceCounts[l.project_type] ?? 0) + 1;
    });
    const services = Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      sessions,
      pageViews,
      ctaClicks,
      chatOpens,
      leadCount,
      conv,
      timeline: Object.values(days),
      topPages,
      services,
    };
  }, [events, leads]);

  if (!stats) {
    return (
      <div className="grid h-40 place-items-center rounded-2xl border border-border">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={<Eye className="h-5 w-5" />} label="Sessions (30d)" value={stats.sessions} />
        <Kpi
          icon={<MousePointerClick className="h-5 w-5" />}
          label="Page views"
          value={stats.pageViews}
        />
        <Kpi
          icon={<MessageCircle className="h-5 w-5" />}
          label="Chat opens"
          value={stats.chatOpens}
        />
        <Kpi
          icon={<Send className="h-5 w-5" />}
          label={`Conversion (${stats.leadCount} leads)`}
          value={`${stats.conv}%`}
        />
      </div>

      <Card title="Last 14 days — page views & leads">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.timeline}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="var(--primary)"
                fill="url(#g1)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="var(--accent)"
                fillOpacity={0}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Top pages">
          {stats.topPages.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <ul className="space-y-2">
              {stats.topPages.map((p) => (
                <li key={p.path} className="flex items-center justify-between text-sm">
                  <span className="truncate text-muted-foreground">{p.path}</span>
                  <span className="font-mono text-primary">{p.count}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Most requested services">
          {stats.services.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No leads yet.</p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.services}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        Internal tracking — ready to plug into Google Analytics later by sending the same events to{" "}
        <code className="rounded bg-background/40 px-1">gtag()</code>.
      </p>
    </div>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
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

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-5">
      <h3 className="font-display text-sm font-semibold">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}
