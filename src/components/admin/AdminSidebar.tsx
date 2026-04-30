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
  ExternalLink,
} from "lucide-react";
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

const main = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard, exact: true },
  { title: "Leads", url: "/admin/leads", icon: Briefcase },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Chat logs", url: "/admin/chat", icon: MessageSquare },
];

const content = [
  { title: "Services", url: "/admin/services", icon: Wrench },
  { title: "Portfolio", url: "/admin/portfolio", icon: ImageIcon },
];

const system = [{ title: "Settings", url: "/admin/settings", icon: Settings }];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });

  const isActive = (url: string, exact?: boolean) =>
    exact ? path === url : path === url || path.startsWith(url + "/");

  const renderGroup = (
    label: string,
    items: { title: string; url: string; icon: typeof Briefcase; exact?: boolean }[],
  ) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.url, item.exact);
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild isActive={active}>
                  <Link to={item.url} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[image:var(--gradient-gold)] font-display text-sm font-bold text-primary-foreground">
            HN
          </span>
          {!collapsed && (
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold">HN-GROUPE</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Admin
              </p>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {renderGroup("Main", main)}
        {renderGroup("Content", content)}
        {renderGroup("System", system)}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-muted-foreground"
              >
                <ExternalLink className="h-4 w-4" />
                {!collapsed && <span>View site</span>}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
