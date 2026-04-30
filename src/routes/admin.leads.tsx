import { createFileRoute } from "@tanstack/react-router";
import { LeadsTab } from "@/components/admin/LeadsTab";

export const Route = createFileRoute("/admin/leads")({
  component: () => (
    <Section title="Leads" subtitle="All project requests submitted via the site.">
      <LeadsTab />
    </Section>
  ),
});

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </header>
      {children}
    </div>
  );
}
