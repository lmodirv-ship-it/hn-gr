import { createFileRoute } from "@tanstack/react-router";
import { UsersTab } from "@/components/admin/UsersTab";

export const Route = createFileRoute("/admin/users")({
  component: () => (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Users</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage registered users and assign admin access.
        </p>
      </header>
      <UsersTab />
    </div>
  ),
});
