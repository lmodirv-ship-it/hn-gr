import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
  MessageSquare,
  Wrench,
  Image as ImageIcon,
  Settings,
  Sparkles,
  Plug,
  Puzzle,
  Activity,
  ShieldCheck,
  Gauge,
  FileText,
  UserPlus,
  Languages,
  Crown,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useAdminT } from "@/lib/i18n/adminText";

interface NavItem {
  titleKey: string;
  url: string;
  icon: typeof Briefcase;
  exact?: boolean;
  badgeKey?: "leads" | "chat" | "applications";
  ownerOnly?: boolean;
}

const main: NavItem[] = [
  { titleKey: "admin.nav.overview", url: "/admin", icon: LayoutDashboard, exact: true },
  { titleKey: "admin.nav.leads", url: "/admin/leads", icon: Briefcase, badgeKey: "leads" },
  { titleKey: "admin.nav.users", url: "/admin/users", icon: Users, ownerOnly: true },
  { titleKey: "admin.nav.analytics", url: "/admin/analytics", icon: BarChart3 },
  { titleKey: "admin.nav.chat", url: "/admin/chat", icon: MessageSquare, badgeKey: "chat" },
];


const content: NavItem[] = [
  { titleKey: "admin.nav.services", url: "/admin/services", icon: Wrench },
  { titleKey: "admin.nav.portfolio", url: "/admin/portfolio", icon: ImageIcon },
  { titleKey: "admin.nav.blog", url: "/admin/blog", icon: FileText },
  { titleKey: "admin.nav.careers", url: "/admin/careers", icon: UserPlus, badgeKey: "applications" },
];

// All platform items are owner-only (API hub, plugins, audit, security).
const platform: NavItem[] = [
  { titleKey: "admin.nav.owner", url: "/admin/owner", icon: Crown, ownerOnly: true },
  { titleKey: "admin.nav.connectors", url: "/admin/connectors", icon: Plug, ownerOnly: true },
  { titleKey: "admin.nav.plugins", url: "/admin/plugins", icon: Puzzle, ownerOnly: true },
  { titleKey: "admin.nav.monitoring", url: "/admin/monitoring", icon: Gauge, ownerOnly: true },
  { titleKey: "admin.nav.activity", url: "/admin/activity", icon: Activity, ownerOnly: true },
  { titleKey: "admin.nav.security", url: "/admin/security", icon: ShieldCheck, ownerOnly: true },
];

const system: NavItem[] = [
  { titleKey: "admin.nav.translations", url: "/admin/translations", icon: Languages },
  { titleKey: "admin.nav.settings", url: "/admin/settings", icon: Settings, ownerOnly: true },
];

export function AdminSidebar() {
  const { t } = useTranslation();
  const tt = useAdminT();
  const { state } = useSidebar();
  const { isSuperAdmin } = useAuth();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [badges, setBadges] = useState<{ leads: number; chat: number; applications: number }>({
    leads: 0,
    chat: 0,
    applications: 0,
  });

  useEffect(() => {
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    void Promise.all([
      supabase
        .from("project_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("chat_logs")
        .select("id", { count: "exact", head: true })
        .gte("created_at", since),
      supabase
        .from("job_applications")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
    ]).then(([l, c, a]) =>
      setBadges({ leads: l.count ?? 0, chat: c.count ?? 0, applications: a.count ?? 0 }),
    );
  }, []);

  const isActive = (url: string, exact?: boolean) =>
    exact ? path === url : path === url || path.startsWith(url + "/");

  const renderGroup = (label: string, items: NavItem[]) => {
    const visible = items.filter((it) => !it.ownerOnly || isSuperAdmin);
    if (visible.length === 0) return null;
    return (
    <SidebarGroup>
      {!collapsed && (
        <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {visible.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.url, item.exact);
            const badge = item.badgeKey ? badges[item.badgeKey] : 0;
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  className="group relative h-9 overflow-hidden rounded-lg px-2.5 transition-all data-[active=true]:bg-transparent"
                >
                  <Link to={item.url} className="flex items-center gap-2.5">
                    {/* Active glow background */}
                    {active && (
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background:
                            "linear-gradient(90deg, color-mix(in oklab, var(--primary) 22%, transparent), color-mix(in oklab, var(--primary) 6%, transparent))",
                          boxShadow:
                            "inset 0 0 0 1px color-mix(in oklab, var(--primary) 35%, transparent), 0 6px 18px -10px color-mix(in oklab, var(--primary) 70%, transparent)",
                        }}
                      />
                    )}
                    {/* Active left bar */}
                    {active && (
                      <span
                        aria-hidden
                        className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full"
                        style={{
                          background: "var(--gradient-neon)",
                          boxShadow:
                            "0 0 12px color-mix(in oklab, var(--primary) 80%, transparent)",
                        }}
                      />
                    )}
                    <Icon
                      className={`relative h-4 w-4 shrink-0 transition-colors ${
                        active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    />
                    {!collapsed && (
                      <>
                        <span
                          className={`relative flex-1 truncate text-sm ${
                            active ? "font-medium text-foreground" : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        >
                          {t(item.titleKey)}
                        </span>
                        {badge > 0 && (
                          <span
                            className="relative grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-bold tabular-nums"
                            style={{
                              background:
                                "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 60%, var(--accent)))",
                              color: "var(--primary-foreground)",
                              boxShadow:
                                "0 0 10px color-mix(in oklab, var(--primary) 60%, transparent)",
                            }}
                          >
                            {badge > 99 ? "99+" : badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
    );
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border/60"
    >
      <SidebarHeader className="border-b border-sidebar-border/60 px-2 py-3">
        <Link to="/" className="flex items-center gap-2.5 px-2">
          <span
            className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl text-sm font-bold text-primary-foreground"
            style={{
              background: "var(--gradient-neon)",
              boxShadow: "var(--shadow-neon)",
            }}
          >
            <Sparkles className="absolute inset-0 m-auto h-3 w-3 opacity-30" />
            <span className="relative font-display">HN</span>
          </span>
          {!collapsed && (
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold tracking-tight shimmer-text">
                HN-GROUPE
              </p>
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {tt("sidebar.controlCenter")}
              </p>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-1.5 py-2">
        {renderGroup(t("admin.group.main"), main)}
        {renderGroup(t("admin.group.content"), content)}
        {renderGroup(t("admin.group.platform"), platform)}
        {renderGroup(t("admin.group.system"), system)}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60 p-2">
        {!collapsed ? (
          <div className="rounded-lg border border-border/60 bg-surface/40 p-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_oklch(0.7_0.18_150)]" />
                {tt("sidebar.systemsNormal")}
              </span>
              <span className="text-[10px] text-muted-foreground">v1.0</span>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {tt("sidebar.databaseRealtime")}
            </p>
          </div>
        ) : (
          <div className="grid place-items-center py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_oklch(0.7_0.18_150)]" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
