import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Crown,
  ShieldCheck,
  Plug,
  Puzzle,
  Activity,
  Users,
  Database,
  Lock,
  Loader2,
  AlertTriangle,
  UserPlus,
  FileText,
  Mail,
  Clock,
  ShieldAlert,
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
  newApplications: number;
  publishedPosts: number;
  draftPosts: number;
  pendingLeads: number;
  admins: number;
  connectors: number;
  plugins: number;
  events24h: number;
  failedLogins24h: number;
}

interface ActivityRow {
  id: string;
  action: string;
  actor_email: string | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

function OwnerCenter() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isSuperAdmin, loading, user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    newApplications: 0,
    publishedPosts: 0,
    draftPosts: 0,
    pendingLeads: 0,
    admins: 0,
    connectors: 0,
    plugins: 0,
    events24h: 0,
    failedLogins24h: 0,
  });
  const [recent, setRecent] = useState<ActivityRow[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!isSuperAdmin) void navigate({ to: "/admin" });
  }, [isSuperAdmin, loading, navigate]);

  useEffect(() => {
    if (!isSuperAdmin) return;
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    void Promise.all([
      supabase.from("job_applications").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("project_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "admin"),
      supabase.from("api_connectors").select("id", { count: "exact", head: true }),
      supabase.from("plugin_modules").select("id", { count: "exact", head: true }),
      supabase.from("activity_logs").select("id", { count: "exact", head: true }).gte("created_at", since),
      supabase
        .from("activity_logs")
        .select("id", { count: "exact", head: true })
        .eq("action", "auth.signin_failed")
        .gte("created_at", since),
      supabase
        .from("activity_logs")
        .select("id, action, actor_email, created_at, metadata")
        .order("created_at", { ascending: false })
        .limit(8),
    ]).then(([app, pub, drf, ld, adm, con, pl, ev, fl, rec]) => {
      setStats({
        newApplications: app.count ?? 0,
        publishedPosts: pub.count ?? 0,
        draftPosts: drf.count ?? 0,
        pendingLeads: ld.count ?? 0,
        admins: adm.count ?? 0,
        connectors: con.count ?? 0,
        plugins: pl.count ?? 0,
        events24h: ev.count ?? 0,
        failedLogins24h: fl.count ?? 0,
      });
      setRecent((rec.data as ActivityRow[]) ?? []);
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

  const kpis = [
    {
      label: t("owner.kpi.newApplications", "New CV submissions"),
      value: stats.newApplications,
      icon: UserPlus,
      to: "/admin/careers",
      tone: "primary",
    },
    {
      label: t("owner.kpi.publishedPosts", "Published articles"),
      value: stats.publishedPosts,
      hint: `${stats.draftPosts} ${t("owner.kpi.drafts", "drafts")}`,
      icon: FileText,
      to: "/admin/blog",
      tone: "emerald",
    },
    {
      label: t("owner.kpi.pendingLeads", "Open leads"),
      value: stats.pendingLeads,
      icon: Mail,
      to: "/admin/leads",
      tone: "blue",
    },
    {
      label: t("owner.kpi.failedLogins", "Failed logins (24h)"),
      value: stats.failedLogins24h,
      icon: ShieldAlert,
      to: "/admin/activity",
      tone: stats.failedLogins24h > 0 ? "amber" : "muted",
    },
  ] as const;

  const sovereign = [
    { title: t("admin.nav.users"), desc: t("owner.tile.users.desc"), icon: Users, to: "/admin/users", stat: stats.admins, label: t("owner.tile.users.label") },
    { title: t("admin.nav.connectors"), desc: t("owner.tile.connectors.desc"), icon: Plug, to: "/admin/connectors", stat: stats.connectors, label: t("owner.tile.connectors.label") },
    { title: t("admin.nav.plugins"), desc: t("owner.tile.plugins.desc"), icon: Puzzle, to: "/admin/plugins", stat: stats.plugins, label: t("owner.tile.plugins.label") },
    { title: t("admin.nav.activity"), desc: t("owner.tile.activity.desc"), icon: Activity, to: "/admin/activity", stat: stats.events24h, label: t("owner.tile.activity.label") },
    { title: t("admin.nav.security"), desc: t("owner.tile.security.desc"), icon: ShieldCheck, to: "/admin/security", stat: null, label: t("owner.tile.security.label") },
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
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl font-bold tracking-tight">
                {t("owner.title", "Owner Command Center")}
              </h1>
              <Badge variant="outline" className="border-primary/40 text-primary">
                <Lock className="mr-1 h-3 w-3" /> {t("owner.badge.sovereign")}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("owner.subtitle", "Restricted to the verified owner of")}{" "}
              <strong>www.groupe-hn.com</strong> · <span className="font-mono text-xs">{user?.email}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-200">
            <AlertTriangle className="h-4 w-4" />
            {t("owner.actionsLogged", "All actions on this page are logged.")}
          </div>
        </CardContent>
      </Card>

      {/* Security alert if failed logins detected */}
      {stats.failedLogins24h > 0 && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <ShieldAlert className="h-5 w-5 text-amber-400" />
            <div className="flex-1 text-sm">
              <strong>{stats.failedLogins24h}</strong>{" "}
              {t("owner.alert.failedLogins", "failed sign-in attempts in the last 24 hours.")}
            </div>
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/activity">{t("owner.viewLogs", "View logs")}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* KPI grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Link key={k.label} to={k.to}>
              <Card className="group h-full cursor-pointer border-border/60 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {k.label}
                      </p>
                      <div className="mt-2 flex items-baseline gap-2">
                        {statsLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        ) : (
                          <span className="font-display text-3xl font-bold tabular-nums">
                            {k.value}
                          </span>
                        )}
                        {"hint" in k && k.hint && (
                          <span className="text-xs text-muted-foreground">· {k.hint}</span>
                        )}
                      </div>
                    </div>
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Sovereign tiles */}
        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
          {sovereign.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.to} to={s.to}>
                <Card className="group h-full cursor-pointer border-border/60 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
                  <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
                    <div>
                      <CardTitle className="text-base font-semibold">{s.title}</CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {statsLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : s.stat !== null ? (
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-2xl font-bold tabular-nums">{s.stat}</span>
                        <span className="text-xs text-muted-foreground">{s.label}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">{s.label}</span>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Recent activity */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4 text-primary" />
              {t("owner.recentActivity", "Recent activity")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {statsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : recent.length === 0 ? (
              <p className="text-xs text-muted-foreground">{t("owner.noActivity", "No activity yet.")}</p>
            ) : (
              recent.map((r) => {
                const failed = r.action === "auth.signin_failed";
                return (
                  <div key={r.id} className="flex items-start gap-2 rounded-lg border border-border/40 p-2 text-xs">
                    <div
                      className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                        failed ? "bg-amber-400" : "bg-emerald-400"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{r.action}</p>
                      <p className="truncate text-muted-foreground">
                        {r.actor_email ?? "system"} ·{" "}
                        {new Date(r.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <Button asChild size="sm" variant="ghost" className="w-full">
              <Link to="/admin/activity">{t("owner.viewAll", "View all")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Owner protection notice */}
      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="flex flex-wrap items-center gap-3 p-4 text-sm">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <span className="flex-1">
            <strong>{t("owner.protection.title", "Hardcoded protection active.")}</strong>{" "}
            {t("owner.protection.body", "The owner account")}{" "}
            <code className="rounded bg-background/60 px-1.5 py-0.5 text-xs">lmdorv@gmail.com</code>{" "}
            {t(
              "owner.protection.tail",
              "cannot be deleted, modified, or demoted by any other user — enforced at the database trigger level.",
            )}
          </span>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/security">{t("owner.manage2fa", "Manage 2FA")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
