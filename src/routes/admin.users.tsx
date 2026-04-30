import { createFileRoute } from "@tanstack/react-router";
import { UsersTab } from "@/components/admin/UsersTab";
import { OwnerOnly } from "@/components/admin/OwnerOnly";
import { useAdminT } from "@/lib/i18n/adminText";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

function UsersPage() {
  const tt = useAdminT();
  return (
    <OwnerOnly>
      <div className="space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{tt("section.owner")}</p>
          <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">{tt("users.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {tt("users.subtitle")}
          </p>
        </header>
        <UsersTab />
      </div>
    </OwnerOnly>
  );
}
