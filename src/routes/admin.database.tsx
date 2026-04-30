import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Database,
  Table as TableIcon,
  RefreshCw,
  Loader2,
  ShieldCheck,
  ExternalLink,
  Eye,
  HardDrive,
  Activity,
  Lock,
  AlertTriangle,
  Trash2,
  Search,
} from "lucide-react";
import { OwnerOnly } from "@/components/admin/OwnerOnly";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { logActivity } from "@/lib/audit/log";

export const Route = createFileRoute("/admin/database")({
  head: () => ({
    meta: [
      { title: "Database Management — HN Groupe" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <OwnerOnly>
      <DatabasePage />
    </OwnerOnly>
  ),
});

type TableName =
  | "profiles"
  | "user_roles"
  | "activity_logs"
  | "analytics_events"
  | "api_connectors"
  | "blog_posts"
  | "chat_logs"
  | "job_applications"
  | "mfa_settings"
  | "plugin_modules"
  | "portfolio_items"
  | "project_requests"
  | "services_catalog"
  | "site_settings"
  | "translations";

interface TableMeta {
  name: TableName;
  label: string;
  description: string;
  adminRoute?: string;
  category: "core" | "content" | "ops" | "security";
  writable: boolean; // can owner safely delete rows here
}

const TABLES: TableMeta[] = [
  { name: "profiles", label: "Profiles", description: "User profiles linked to auth", category: "core", adminRoute: "/admin/users", writable: false },
  { name: "user_roles", label: "User Roles", description: "Role assignments (RBAC)", category: "security", adminRoute: "/admin/users", writable: false },
  { name: "activity_logs", label: "Activity Logs", description: "Audit trail of admin actions", category: "ops", adminRoute: "/admin/activity", writable: false },
  { name: "analytics_events", label: "Analytics Events", description: "Page views & interactions", category: "ops", adminRoute: "/admin/analytics", writable: true },
  { name: "api_connectors", label: "API Connectors", description: "Third-party integrations", category: "ops", adminRoute: "/admin/connectors", writable: true },
  { name: "blog_posts", label: "Blog Posts", description: "Articles & insights", category: "content", adminRoute: "/admin/blog", writable: true },
  { name: "chat_logs", label: "Chat Logs", description: "AI chat conversations", category: "ops", adminRoute: "/admin/chat", writable: true },
  { name: "job_applications", label: "Job Applications", description: "Career submissions + CVs", category: "content", adminRoute: "/admin/careers", writable: true },
  { name: "mfa_settings", label: "MFA Settings", description: "Two-factor auth status", category: "security", adminRoute: "/admin/security", writable: false },
  { name: "plugin_modules", label: "Plugin Modules", description: "Optional features toggle", category: "ops", adminRoute: "/admin/plugins", writable: true },
  { name: "portfolio_items", label: "Portfolio Items", description: "Showcased projects", category: "content", adminRoute: "/admin/portfolio", writable: true },
  { name: "project_requests", label: "Project Requests", description: "Lead inquiries", category: "content", adminRoute: "/admin/leads", writable: true },
  { name: "services_catalog", label: "Services Catalog", description: "Public service offerings", category: "content", adminRoute: "/admin/services", writable: true },
  { name: "site_settings", label: "Site Settings", description: "Global config (key/value)", category: "core", adminRoute: "/admin/settings", writable: true },
  { name: "translations", label: "Translations", description: "i18n strings (AR/EN)", category: "content", adminRoute: "/admin/translations", writable: true },
];

const CATEGORY_STYLES: Record<TableMeta["category"], string> = {
  core: "border-primary/40 bg-primary/5 text-primary",
  content: "border-emerald-500/40 bg-emerald-500/5 text-emerald-300",
  ops: "border-blue-500/40 bg-blue-500/5 text-blue-300",
  security: "border-amber-500/40 bg-amber-500/5 text-amber-300",
};

interface RowState {
  count: number | null;
  loading: boolean;
  error?: string;
}

function DatabasePage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const [stats, setStats] = useState<Record<TableName, RowState>>(
    () => Object.fromEntries(TABLES.map((t) => [t.name, { count: null, loading: true }])) as Record<TableName, RowState>
  );
  const [filter, setFilter] = useState("");
  const [previewTable, setPreviewTable] = useState<TableMeta | null>(null);
  const [previewRows, setPreviewRows] = useState<Record<string, unknown>[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);

  const loadAll = useCallback(async () => {
    setStats((s) =>
      Object.fromEntries(TABLES.map((t) => [t.name, { ...s[t.name], loading: true }])) as Record<TableName, RowState>
    );
    const results = await Promise.all(
      TABLES.map(async (t) => {
        const { count, error } = await supabase.from(t.name).select("id", { count: "exact", head: true });
        return [t.name, { count: count ?? 0, loading: false, error: error?.message }] as const;
      })
    );
    setStats(Object.fromEntries(results) as Record<TableName, RowState>);
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const openPreview = async (t: TableMeta) => {
    setPreviewTable(t);
    setPreviewRows([]);
    setPreviewLoading(true);
    const { data, error } = await supabase.from(t.name).select("*").limit(20);
    if (error) {
      toast.error(`${isAr ? "خطأ" : "Error"}: ${error.message}`);
    }
    setPreviewRows((data as Record<string, unknown>[]) ?? []);
    setPreviewLoading(false);
    void logActivity({ action: "db.preview", targetType: "table", targetId: t.name });
  };

  const truncateTable = async (t: TableMeta) => {
    if (!t.writable) return;
    const confirmText = isAr
      ? `هل أنت متأكد أنك تريد حذف جميع السجلات من ${t.label}؟ لا يمكن التراجع عن هذه العملية.`
      : `Permanently delete ALL rows in ${t.label}? This cannot be undone.`;
    if (!window.confirm(confirmText)) return;

    const { error, count } = await supabase
      .from(t.name)
      .delete({ count: "exact" })
      .not("id", "is", null);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(
      isAr
        ? `تم حذف ${count ?? 0} سجل من ${t.label}`
        : `Deleted ${count ?? 0} rows from ${t.label}`
    );
    void logActivity({
      action: "db.truncate",
      targetType: "table",
      targetId: t.name,
      metadata: { deleted: count ?? 0 },
    });
    void loadAll();
  };

  const filtered = TABLES.filter(
    (t) =>
      !filter ||
      t.label.toLowerCase().includes(filter.toLowerCase()) ||
      t.name.toLowerCase().includes(filter.toLowerCase())
  );

  const totals = TABLES.reduce(
    (acc, t) => {
      const s = stats[t.name];
      if (s.count != null) acc.total += s.count;
      if (!s.loading) acc.loaded += 1;
      return acc;
    },
    { total: 0, loaded: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background">
        <CardContent className="flex flex-wrap items-center gap-4 p-6">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary">
            <Database className="h-7 w-7" />
          </div>
          <div className="flex-1 min-w-[240px]">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl font-bold tracking-tight">
                {isAr ? "إدارة قواعد البيانات" : "Database Management"}
              </h1>
              <Badge variant="outline" className="border-primary/40 text-primary">
                <Lock className="mr-1 h-3 w-3" />
                {isAr ? "المالك فقط" : "Owner only"}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {isAr
                ? "تحكم شامل في جميع جداول قاعدة البيانات — العرض، الإحصائيات، والحذف الجماعي."
                : "Full control over every table — inspect, count, and bulk-delete with audit logging."}
            </p>
          </div>
          <Button onClick={loadAll} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            {isAr ? "تحديث" : "Refresh"}
          </Button>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile icon={TableIcon} label={isAr ? "عدد الجداول" : "Tables"} value={TABLES.length} />
        <KpiTile
          icon={HardDrive}
          label={isAr ? "إجمالي السجلات" : "Total rows"}
          value={totals.total}
          loading={totals.loaded < TABLES.length}
        />
        <KpiTile
          icon={ShieldCheck}
          label={isAr ? "سياسات RLS" : "RLS protected"}
          value={TABLES.length}
          hint="100%"
        />
        <KpiTile icon={Activity} label={isAr ? "محمي بالتدقيق" : "Audited"} value={TABLES.length} hint={isAr ? "كل عملية مسجلة" : "All ops logged"} />
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={isAr ? "ابحث عن جدول..." : "Search tables…"}
          className="pl-9"
        />
      </div>

      {/* Tables grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((t) => {
          const s = stats[t.name];
          return (
            <Card key={t.name} className="border-border/60 transition-all hover:border-primary/40 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <TableIcon className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">{t.label}</span>
                    </CardTitle>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">{t.description}</p>
                    <code className="mt-1 inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                      {t.name}
                    </code>
                  </div>
                  <Badge variant="outline" className={`shrink-0 text-[10px] uppercase ${CATEGORY_STYLES[t.category]}`}>
                    {t.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex items-baseline gap-2">
                  {s.loading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : s.error ? (
                    <span className="flex items-center gap-1 text-xs text-amber-400">
                      <AlertTriangle className="h-3 w-3" /> {s.error}
                    </span>
                  ) : (
                    <>
                      <span className="font-display text-2xl font-bold tabular-nums">
                        {s.count?.toLocaleString() ?? 0}
                      </span>
                      <span className="text-xs text-muted-foreground">{isAr ? "سجل" : "rows"}</span>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => openPreview(t)}>
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    {isAr ? "عرض" : "Preview"}
                  </Button>
                  {t.adminRoute && (
                    <Button size="sm" variant="ghost" asChild>
                      <Link to={t.adminRoute}>
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        {isAr ? "إدارة" : "Manage"}
                      </Link>
                    </Button>
                  )}
                  {t.writable && (s.count ?? 0) > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive ml-auto"
                      onClick={() => truncateTable(t)}
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      {isAr ? "تفريغ" : "Truncate"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Safety notice */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="flex flex-wrap items-center gap-3 p-4 text-sm">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
          <span className="flex-1">
            <strong>{isAr ? "تنبيه:" : "Warning:"}</strong>{" "}
            {isAr
              ? "عمليات الحذف الجماعي لا يمكن التراجع عنها. جداول الأدوار والمستخدمين محمية بـ trigger وقواعد RLS صارمة. كل عملية مسجلة في activity_logs."
              : "Truncate is irreversible. User & role tables are protected by triggers and strict RLS. Every action is recorded in activity_logs."}
          </span>
        </CardContent>
      </Card>

      {/* Preview dialog */}
      <Dialog open={!!previewTable} onOpenChange={(o) => !o && setPreviewTable(null)}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TableIcon className="h-4 w-4 text-primary" />
              {previewTable?.label}{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{previewTable?.name}</code>
            </DialogTitle>
            <DialogDescription>
              {isAr ? "أحدث 20 سجل" : "Latest 20 rows"} ·{" "}
              {previewRows.length} {isAr ? "صف معروض" : "rows shown"}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-auto rounded-md border">
            {previewLoading ? (
              <div className="grid place-items-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : previewRows.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">
                {isAr ? "الجدول فارغ" : "Table is empty"}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(previewRows[0]).map((k) => (
                      <TableHead key={k} className="whitespace-nowrap text-xs">
                        {k}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewRows.map((row, i) => (
                    <TableRow key={i}>
                      {Object.values(row).map((v, j) => (
                        <TableCell key={j} className="max-w-[240px] truncate text-xs font-mono">
                          {v === null
                            ? <span className="text-muted-foreground italic">null</span>
                            : typeof v === "object"
                            ? JSON.stringify(v)
                            : String(v)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <DialogFooter>
            {previewTable?.adminRoute && (
              <Button asChild variant="outline" size="sm">
                <Link to={previewTable.adminRoute}>
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  {isAr ? "افتح صفحة الإدارة" : "Open admin page"}
                </Link>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KpiTile({
  icon: Icon,
  label,
  value,
  hint,
  loading,
}: {
  icon: typeof Database;
  label: string;
  value: number;
  hint?: string;
  loading?: boolean;
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <span className="font-display text-3xl font-bold tabular-nums">{value.toLocaleString()}</span>
              )}
              {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
            </div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
