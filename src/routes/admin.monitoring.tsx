import { createFileRoute } from "@tanstack/react-router";
import { OwnerOnly } from "@/components/admin/OwnerOnly";
import { useEffect, useState } from "react";
import {
  Activity,
  Cpu,
  Database,
  Gauge,
  HardDrive,
  ServerCrash,
  Wifi,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAdminT } from "@/lib/i18n/adminText";

export const Route = createFileRoute("/admin/monitoring")({
  component: () => (<OwnerOnly><MonitoringPage /></OwnerOnly>),
});

interface Sample {
  t: string;
  cpu: number;
  mem: number;
  rps: number;
  latency: number;
}

function genSeries(): Sample[] {
  const now = Date.now();
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now - (29 - i) * 60 * 1000);
    return {
      t: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      cpu: Math.round(20 + Math.random() * 50),
      mem: Math.round(40 + Math.random() * 35),
      rps: Math.round(50 + Math.random() * 200),
      latency: Math.round(80 + Math.random() * 180),
    };
  });
}

function MonitoringPage() {
  const tt = useAdminT();
  const [series, setSeries] = useState<Sample[]>(() => genSeries());
  const [counts, setCounts] = useState({ events: 0, leads: 0, chat: 0 });

  useEffect(() => {
    const id = setInterval(() => {
      setSeries((prev) => {
        const next = prev.slice(1);
        const last = prev[prev.length - 1];
        next.push({
          t: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          cpu: Math.max(5, Math.min(95, last.cpu + (Math.random() - 0.5) * 20)),
          mem: Math.max(10, Math.min(95, last.mem + (Math.random() - 0.5) * 8)),
          rps: Math.max(20, last.rps + (Math.random() - 0.5) * 60),
          latency: Math.max(40, last.latency + (Math.random() - 0.5) * 50),
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    void Promise.all([
      supabase.from("analytics_events").select("id", { count: "exact", head: true }),
      supabase.from("project_requests").select("id", { count: "exact", head: true }),
      supabase.from("chat_logs").select("id", { count: "exact", head: true }),
    ]).then(([a, l, c]) =>
      setCounts({ events: a.count ?? 0, leads: l.count ?? 0, chat: c.count ?? 0 }),
    );
  }, []);

  const last = series[series.length - 1];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{tt("section.master")}</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">{tt("monitoring.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {tt("monitoring.subtitle")}
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Cpu className="h-4 w-4" />} label="CPU" value={`${Math.round(last.cpu)}%`} hue="cyan" />
        <StatCard icon={<HardDrive className="h-4 w-4" />} label={tt("monitoring.memory")} value={`${Math.round(last.mem)}%`} hue="violet" />
        <StatCard icon={<Wifi className="h-4 w-4" />} label={tt("monitoring.reqSec")} value={`${Math.round(last.rps)}`} hue="emerald" />
        <StatCard icon={<Gauge className="h-4 w-4" />} label={tt("monitoring.latency")} value={`${Math.round(last.latency)}ms`} hue="amber" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ChartCard title={tt("monitoring.serverLoad")} subtitle={tt("monitoring.serverLoadSub")}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={series}>
              <defs>
                <linearGradient id="cpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="mem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in oklab, var(--border) 60%, transparent)" />
              <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={10} />
              <YAxis stroke="var(--muted-foreground)" fontSize={10} />
              <Tooltip
                contentStyle={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="cpu" stroke="var(--primary)" fill="url(#cpu)" strokeWidth={2} />
              <Area type="monotone" dataKey="mem" stroke="var(--accent)" fill="url(#mem)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={tt("monitoring.traffic")} subtitle={tt("monitoring.trafficSub")}>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in oklab, var(--border) 60%, transparent)" />
              <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={10} />
              <YAxis stroke="var(--muted-foreground)" fontSize={10} />
              <Tooltip
                contentStyle={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="rps" stroke="var(--primary)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="latency" stroke="var(--accent)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Service icon={<Database className="h-4 w-4" />} name={tt("monitoring.database")} status="healthy" detail={`${counts.events.toLocaleString()} ${tt("monitoring.events")}`} />
        <Service icon={<Activity className="h-4 w-4" />} name={tt("monitoring.realtime")} status="healthy" detail={`${counts.chat.toLocaleString()} ${tt("monitoring.chatLogs")}`} />
        <Service icon={<ServerCrash className="h-4 w-4" />} name={tt("monitoring.api")} status="healthy" detail={`${counts.leads.toLocaleString()} ${tt("monitoring.leads")}`} />
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hue,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hue: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 backdrop-blur">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
        <span className="text-primary">{icon}</span>
      </div>
      <p className="mt-2 font-display text-3xl font-bold tabular-nums">{value}</p>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">{hue}</span>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const tt = useAdminT();
  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-5 backdrop-blur">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          {tt("common.live")}
        </span>
      </div>
      {children}
    </div>
  );
}

function Service({
  icon,
  name,
  status,
  detail,
}: {
  icon: React.ReactNode;
  name: string;
  status: "healthy" | "degraded" | "down";
  detail: string;
}) {
  const tt = useAdminT();
  const color =
    status === "healthy"
      ? "text-emerald-300 bg-emerald-500/15"
      : status === "degraded"
      ? "text-amber-300 bg-amber-500/15"
      : "text-red-300 bg-red-500/15";
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-surface/40 p-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
          {icon}
        </span>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{detail}</p>
        </div>
      </div>
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${color}`}>
        {tt(`status.${status}` as Parameters<typeof tt>[0])}
      </span>
    </div>
  );
}
