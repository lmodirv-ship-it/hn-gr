import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminBackground } from "@/components/admin/AdminBackground";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — HN-GROUPE" },
      { name: "description", content: "HN-GROUPE admin dashboard." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin, role } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) void navigate({ to: "/auth" });
    else if (role && !isAdmin) void navigate({ to: "/dashboard" });
  }, [user, authLoading, isAdmin, role, navigate]);

  if (authLoading || !isAdmin) {
    return (
      <>
        <AdminBackground />
        <div className="grid min-h-screen place-items-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Booting control center
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <SidebarProvider>
      <AdminBackground />
      <div className="relative flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
