import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsTab } from "@/components/admin/AnalyticsTab";

export const Route = createFileRoute("/admin/analytics")({
  component: () => (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Analytics</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Site traffic, top pages and lead conversion over the last 30 days.
        </p>
      </header>
      <AnalyticsTab />
    </div>
  ),
});
