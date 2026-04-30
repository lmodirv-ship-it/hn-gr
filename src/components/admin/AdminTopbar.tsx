import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut, ChevronRight, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CommandPalette } from "./CommandPalette";
import { NotificationsBell } from "./NotificationsBell";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useAuth } from "@/hooks/use-auth";

const LABELS: Record<string, string> = {
  admin: "Dashboard",
  leads: "Leads",
  users: "Users",
  analytics: "Analytics",
  chat: "Chat logs",
  services: "Services",
  portfolio: "Portfolio",
  settings: "Settings",
};

export function AdminTopbar() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const segments = path.split("/").filter(Boolean);

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border/60 px-3 sm:px-5"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in oklab, var(--background) 75%, transparent) 0%, color-mix(in oklab, var(--background) 55%, transparent) 100%)",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
      }}
    >
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

        {/* Breadcrumb */}
        <nav className="hidden min-w-0 items-center gap-1 text-xs sm:flex">
          {segments.map((seg, i) => {
            const last = i === segments.length - 1;
            return (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/60" />}
                <span
                  className={
                    last
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {LABELS[seg] ?? seg}
                </span>
              </span>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <CommandPalette />
        <LanguageSwitcher variant="compact" />

        <span className="hidden items-center gap-2 rounded-full border border-border/60 bg-surface/40 px-3 py-1 text-[11px] tabular-nums text-muted-foreground md:inline-flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </span>

        <NotificationsBell />

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden h-8 items-center gap-1.5 rounded-md border border-border/60 bg-surface/40 px-2.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground md:inline-flex"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {t("admin.topbar.viewSite")}
        </a>

        <Link
          to="/dashboard"
          className="hidden h-8 items-center rounded-md border border-border/60 bg-surface/40 px-2.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground lg:inline-flex"
        >
          {t("admin.topbar.myDashboard")}
        </Link>

        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-surface/40 py-1 pl-1 pr-2">
          <span
            className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold text-primary-foreground"
            style={{ background: "var(--gradient-neon)" }}
          >
            {(user?.email ?? "A").slice(0, 1).toUpperCase()}
          </span>
          <span className="hidden max-w-[120px] truncate text-xs text-muted-foreground sm:inline">
            {user?.email}
          </span>
          <button
            aria-label="Sign out"
            onClick={() => void signOut()}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
