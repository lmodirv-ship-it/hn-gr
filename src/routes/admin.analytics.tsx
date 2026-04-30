import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsTab } from "@/components/admin/AnalyticsTab";
import { useAdminT } from "@/lib/i18n/adminText";

export const Route = createFileRoute("/admin/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const tt = useAdminT();
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{tt("section.admin")}</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">{tt("analytics.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {tt("analytics.subtitle")}
        </p>
      </header>
      <AnalyticsTab />
    </div>
  );
}
