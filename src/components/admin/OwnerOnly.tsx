import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

/**
 * Wrap a route's content to restrict it to the verified owner (super_admin).
 * Non-owners are redirected to /admin and shown a brief lock screen.
 */
export function OwnerOnly({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { isSuperAdmin, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!isSuperAdmin) void navigate({ to: "/admin" });
  }, [isSuperAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <Lock className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">Owner-only area</p>
          <p className="text-xs text-muted-foreground">Redirecting…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
