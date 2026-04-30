import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, ShieldCheck, KeyRound, Loader2, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin/security")({
  component: SecurityPage,
});

interface MfaRow {
  user_id: string;
  enabled: boolean;
  method: string | null;
  enrolled_at: string | null;
  last_verified_at: string | null;
}

function SecurityPage() {
  const { user, isSuperAdmin } = useAuth();
  const [mfa, setMfa] = useState<MfaRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    void supabase
      .from("mfa_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setMfa((data as MfaRow) ?? null);
        setLoading(false);
      });
  }, [user]);

  const enrollMfa = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("mfa_settings")
      .upsert({
        user_id: user.id,
        enabled: true,
        method: "totp",
        enrolled_at: new Date().toISOString(),
      });
    if (error) return toast.error(error.message);
    toast.success("MFA enrollment recorded (placeholder)");
    setMfa({
      user_id: user.id,
      enabled: true,
      method: "totp",
      enrolled_at: new Date().toISOString(),
      last_verified_at: null,
    });
  };

  const disableMfa = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("mfa_settings")
      .update({ enabled: false })
      .eq("user_id", user.id);
    if (error) return toast.error(error.message);
    setMfa((prev) => (prev ? { ...prev, enabled: false } : prev));
    toast.success("MFA disabled");
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Master</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Security</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Multi-factor authentication, role hierarchy and access controls.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur">
        <div className="flex items-start gap-4">
          <span
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
            style={{
              background: mfa?.enabled
                ? "var(--gradient-neon)"
                : "color-mix(in oklab, var(--muted) 60%, transparent)",
              boxShadow: mfa?.enabled ? "var(--shadow-neon)" : "none",
            }}
          >
            <Smartphone className="h-6 w-6 text-primary-foreground" />
          </span>
          <div className="flex-1">
            <h2 className="font-medium">Multi-factor authentication</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add an extra verification step at sign-in using a TOTP app (Google Authenticator,
              1Password, Authy). This is a placeholder hook ready to wire to a real TOTP flow.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : mfa?.enabled ? (
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    <ShieldCheck className="h-3.5 w-3.5" /> Enabled · {mfa.method?.toUpperCase()}
                  </span>
                  <button
                    onClick={() => void disableMfa()}
                    className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-destructive/40 hover:text-destructive"
                  >
                    Disable
                  </button>
                </>
              ) : (
                <button
                  onClick={() => void enrollMfa()}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
                >
                  <KeyRound className="h-3.5 w-3.5" /> Enroll MFA
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
            <Shield className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-medium">Role hierarchy</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Three-tier access model. The Super Admin role is hardcoded to the site owner and
              protected by a database trigger — it cannot be removed or modified by anyone.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-300">
                  super_admin
                </span>
                <span className="text-muted-foreground">
                  Full root access. Manages connectors, plugins, all admins. Undeletable.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                  admin
                </span>
                <span className="text-muted-foreground">
                  Manages content, leads, users. Read-only on connectors and plugins.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full bg-muted/30 px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                  client
                </span>
                <span className="text-muted-foreground">Default user role.</span>
              </li>
            </ul>
            {isSuperAdmin && (
              <p className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs text-amber-300">
                <ShieldCheck className="h-3.5 w-3.5" /> You are signed in as Super Admin (root).
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
