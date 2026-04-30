import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Crown,
  ShieldCheck,
  Plug,
  Puzzle,
  Activity,
  Users,
  Lock,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/owner")({
  head: () => ({
    meta: [
      { title: "Owner Command Center — HN Groupe" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OwnerCenter,
});

interface Stats {
  admins: number;
  connectors: number;
  plugins: number;
  events24h: number;
}

function OwnerCenter() {
  const navigate = useNavigate();
  const { isSuperAdmin, loading, user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    admins: 0,
    connectors: 0,
    plugins: 0,
    events24h: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Hard guard: only the owner may see this page.
  useEffect(() => {
    if (loading) return;
    if (!isSuperAdmin) void navigate({ to: "/admin" });
  }, [isSuperAdmin, loading, navigate]);

  useEffect(() => {
    if (!isSuperAdmin) return;
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    void Promise.all([
      supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "admin"),
      supabase.from("api_connectors").select("id", { count: "exact", head: true }),
      supabase.from("plugin_modules").select("id", { count: "exact", head: true }),
      supabase
        .from("activity_logs")
        .select("id", { count: "exact", head: true })
        .gte("created_at", since),
    ]).then(([a, c, p, e]) => {
      setStats({
        admins: a.count ?? 0,
        connectors: c.count ?? 0,
        plugins: p.count ?? 0,
        events24h: e.count ?? 0,
      });
      setStatsLoading(false);
    });
  }, [isSuperAdmin]);

  if (loading || !isSuperAdmin) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const tiles = [
    {
      title: "Manage Administrators",
      desc: "Add, remove, or audit sub-admins. Owner role is locked.",
      icon: Users,
      to: "/admin/users",
      stat: stats.admins,
      label: "active admins",
    },
    {
      title: "API Hub",
      desc: "Configure third-party API keys and connectors.",
      icon: Plug,
      to: "/admin/connectors",
      stat: stats.connectors,
      label: "connectors",
    },
    {
      title: "Plugins",
      desc: "Toggle modular features across the platform.",
      icon: Puzzle,
      to: "/admin/plugins",
      stat: stats.plugins,
      label: "modules",
    },
    {
      title: "Activity Logs",
      desc: "Forensic trail of every administrative action.",
      icon: Activity,
      to: "/admin/activity",
      stat: stats.events24h,
      label: "events / 24h",
    },
    {
      title: "Security & 2FA",
      desc: "Manage MFA factors and authentication policies.",
      icon: ShieldCheck,
      to: "/admin/security",
      stat: null,
      label: "TOTP enrolled",
    },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background">
        <CardContent className="flex flex-wrap items-center gap-4 p-6">
          <div
            className="grid h-14 w-14 place-items-center rounded-2xl"
            style={{
              background: "var(--gradient-neon, linear-gradient(135deg, var(--primary), var(--accent)))",
              boxShadow: "0 10px 40px -10px color-mix(in oklab, var(--primary) 60%, transparent)",
            }}
          >
            <Crown className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-[240px]">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold tracking-tight">
                Owner Command Center
              </h1>
              <Badge variant="outline" className="border-primary/40 text-primary">
                <Lock className="mr-1 h-3 w-3" /> Sovereign
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Restricted to the verified owner of <strong>www.hn-groupe.com</strong> ·{" "}
              <span className="font-mono text-xs">{user?.email}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-200">
            <AlertTriangle className="h-4 w-4" />
            All actions on this page are logged.
          </div>
        </CardContent>
      </Card>

      {/* Tiles */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.to} to={t.to}>
              <Card className="group h-full cursor-pointer border-border/60 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
                <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
                  <div>
                    <CardTitle className="text-base font-semibold">{t.title}</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-baseline gap-2">
                    {statsLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : t.stat !== null ? (
                      <>
                        <span className="font-display text-2xl font-bold tabular-nums">
                          {t.stat}
                        </span>
                        <span className="text-xs text-muted-foreground">{t.label}</span>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">{t.label}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Owner protection notice */}
      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="flex flex-wrap items-center gap-3 p-4 text-sm">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <span className="flex-1">
            <strong>Hardcoded protection active.</strong> The owner account{" "}
            <code className="rounded bg-background/60 px-1.5 py-0.5 text-xs">lmodirv@gmail.com</code>{" "}
            cannot be deleted, modified, or demoted by any other user — enforced at the database
            trigger level.
          </span>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/security">Manage 2FA</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
