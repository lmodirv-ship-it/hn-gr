import { useEffect, useState, useRef } from "react";
import { Bell, FileText, Briefcase, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

interface Notif {
  id: string;
  kind: "lead" | "cv" | "project";
  title: string;
  subtitle: string;
  href: string;
  created_at: string;
}

const STORAGE_KEY = "admin-notifs-seen-at";

export function NotificationsBell() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);
  const [seenAt, setSeenAt] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return Number(localStorage.getItem(STORAGE_KEY) ?? 0);
  });
  const ref = useRef<HTMLDivElement>(null);

  // Initial load: latest 20 across the 3 sources
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [leads, cvs, projects] = await Promise.all([
        supabase.from("project_requests").select("id,full_name,project_type,created_at").order("created_at", { ascending: false }).limit(10),
        supabase.from("job_applications").select("id,full_name,specialty,created_at").order("created_at", { ascending: false }).limit(10),
        supabase.from("project_requests").select("id,email,project_type,created_at").order("created_at", { ascending: false }).limit(10),
      ]);
      if (cancelled) return;
      const merged: Notif[] = [
        ...((leads.data ?? []).map((r: any) => ({
          id: `lead-${r.id}`,
          kind: "lead" as const,
          title: r.full_name ?? "New lead",
          subtitle: r.project_type ?? "Project request",
          href: "/admin/leads",
          created_at: r.created_at,
        }))),
        ...((cvs.data ?? []).map((r: any) => ({
          id: `cv-${r.id}`,
          kind: "cv" as const,
          title: r.full_name ?? "New CV",
          subtitle: r.specialty ?? "Job application",
          href: "/admin/careers",
          created_at: r.created_at,
        }))),
      ];
      // Deduplicate (project_requests appears twice in our query plan)
      const unique = Array.from(new Map(merged.map((m) => [m.id, m])).values())
        .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
        .slice(0, 20);
      setItems(unique);
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  // Realtime listeners
  useEffect(() => {
    const channel = supabase
      .channel("admin-notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "project_requests" }, (payload) => {
        const r = payload.new as any;
        setItems((prev) => [{
          id: `lead-${r.id}`,
          kind: "lead",
          title: r.full_name ?? "New lead",
          subtitle: r.project_type ?? "Project request",
          href: "/admin/leads",
          created_at: r.created_at,
        }, ...prev].slice(0, 20));
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "job_applications" }, (payload) => {
        const r = payload.new as any;
        setItems((prev) => [{
          id: `cv-${r.id}`,
          kind: "cv",
          title: r.full_name ?? "New CV",
          subtitle: r.specialty ?? "Job application",
          href: "/admin/careers",
          created_at: r.created_at,
        }, ...prev].slice(0, 20));
      })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, []);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const unread = items.filter((i) => +new Date(i.created_at) > seenAt).length;

  const markRead = () => {
    const now = Date.now();
    setSeenAt(now);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, String(now));
  };

  const Icon = ({ kind }: { kind: Notif["kind"] }) =>
    kind === "cv" ? <FileText className="h-3.5 w-3.5" /> :
    kind === "project" ? <Briefcase className="h-3.5 w-3.5" /> :
    <Mail className="h-3.5 w-3.5" />;

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="Notifications"
        onClick={() => { setOpen((v) => !v); if (!open) markRead(); }}
        className="relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-surface/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-border/60 bg-background/95 shadow-lg backdrop-blur-md rtl:right-auto rtl:left-0"
          role="menu"
        >
          <div className="border-b border-border/60 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("admin.notifications.title", "Notifications")}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                {t("admin.notifications.empty", "No new notifications")}
              </div>
            ) : items.map((n) => (
              <Link
                key={n.id}
                to={n.href}
                onClick={() => setOpen(false)}
                className="flex items-start gap-2 border-b border-border/40 px-3 py-2 text-xs transition-colors last:border-b-0 hover:bg-surface/50"
              >
                <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon kind={n.kind} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-foreground">{n.title}</span>
                  <span className="block truncate text-muted-foreground">{n.subtitle}</span>
                  <span className="block text-[10px] text-muted-foreground/70">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
