import { createFileRoute } from "@tanstack/react-router";
import { OwnerOnly } from "@/components/admin/OwnerOnly";
import { useEffect, useState, useCallback } from "react";
import { Shield, ShieldCheck, KeyRound, Loader2, Smartphone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin/security")({
  component: () => (<OwnerOnly><SecurityPage /></OwnerOnly>),
});

interface Factor {
  id: string;
  friendly_name?: string;
  factor_type: string;
  status: "verified" | "unverified";
}

function SecurityPage() {
  const { user, isSuperAdmin } = useAuth();
  const [factors, setFactors] = useState<Factor[] | null>(null);
  const [enrolling, setEnrolling] = useState<{
    id: string;
    qr: string;
    secret: string;
  } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) {
      toast.error(error.message);
      setFactors([]);
      return;
    }
    setFactors((data?.totp ?? []) as Factor[]);
  }, []);

  useEffect(() => {
    if (!user) return;
    void refresh();
  }, [user, refresh]);

  const startEnroll = async () => {
    setBusy(true);
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: `HN Admin ${new Date().toISOString().slice(0, 10)}`,
    });
    setBusy(false);
    if (error || !data) return toast.error(error?.message ?? "Failed");
    setEnrolling({
      id: data.id,
      qr: data.totp.qr_code,
      secret: data.totp.secret,
    });
  };

  const verifyEnroll = async () => {
    if (!enrolling) return;
    setBusy(true);
    const { data: chal, error: cErr } = await supabase.auth.mfa.challenge({
      factorId: enrolling.id,
    });
    if (cErr || !chal) {
      setBusy(false);
      return toast.error(cErr?.message ?? "Challenge failed");
    }
    const { error: vErr } = await supabase.auth.mfa.verify({
      factorId: enrolling.id,
      challengeId: chal.id,
      code: code.trim(),
    });
    setBusy(false);
    if (vErr) return toast.error(vErr.message);
    toast.success("MFA enabled");
    setEnrolling(null);
    setCode("");
    // mirror to mfa_settings for analytics/visibility
    if (user) {
      await supabase.from("mfa_settings").upsert({
        user_id: user.id,
        enabled: true,
        method: "totp",
        enrolled_at: new Date().toISOString(),
      });
    }
    void refresh();
  };

  const removeFactor = async (id: string) => {
    if (!confirm("Disable this MFA factor?")) return;
    setBusy(true);
    const { error } = await supabase.auth.mfa.unenroll({ factorId: id });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("MFA disabled");
    if (user) {
      await supabase
        .from("mfa_settings")
        .update({ enabled: false })
        .eq("user_id", user.id);
    }
    void refresh();
  };

  const verified = (factors ?? []).filter((f) => f.status === "verified");
  const hasMfa = verified.length > 0;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Master</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Security</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Two-factor authentication (TOTP), role hierarchy and access controls.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur">
        <div className="flex items-start gap-4">
          <span
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
            style={{
              background: hasMfa
                ? "var(--gradient-neon)"
                : "color-mix(in oklab, var(--muted) 60%, transparent)",
              boxShadow: hasMfa ? "var(--shadow-neon)" : "none",
            }}
          >
            <Smartphone className="h-6 w-6 text-primary-foreground" />
          </span>
          <div className="flex-1">
            <h2 className="font-medium">Two-factor authentication (TOTP)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Scan the QR code with Google Authenticator, 1Password or Authy, then enter the
              6-digit code to confirm. Required to keep the owner account secure.
            </p>

            {factors === null ? (
              <Loader2 className="mt-4 h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <div className="mt-4 space-y-3">
                {verified.length > 0 && (
                  <ul className="space-y-2">
                    {verified.map((f) => (
                      <li
                        key={f.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2 text-sm"
                      >
                        <span className="inline-flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-emerald-400" />
                          {f.friendly_name ?? "TOTP factor"}
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-300">
                            verified
                          </span>
                        </span>
                        <button
                          onClick={() => void removeFactor(f.id)}
                          disabled={busy}
                          className="rounded-md border border-border p-1.5 text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                          aria-label="Remove factor"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {enrolling ? (
                  <div className="rounded-xl border border-border bg-background/40 p-4">
                    <p className="text-xs text-muted-foreground">
                      Scan this QR with your authenticator app:
                    </p>
                    <img
                      src={enrolling.qr}
                      alt="TOTP QR"
                      className="mt-3 h-44 w-44 rounded-md border border-border bg-white p-2"
                    />
                    <p className="mt-3 text-xs text-muted-foreground">
                      Or enter this secret manually:{" "}
                      <code className="rounded bg-muted/40 px-1.5 py-0.5 text-[11px]">
                        {enrolling.secret}
                      </code>
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="123456"
                        className="w-32 rounded-md border border-border bg-background px-3 py-1.5 text-sm tabular-nums tracking-widest"
                      />
                      <button
                        onClick={() => void verifyEnroll()}
                        disabled={busy || code.length < 6}
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                      >
                        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                        Verify & enable
                      </button>
                      <button
                        onClick={() => {
                          void supabase.auth.mfa.unenroll({ factorId: enrolling.id });
                          setEnrolling(null);
                          setCode("");
                        }}
                        className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-destructive/40"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => void startEnroll()}
                    disabled={busy}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    {hasMfa ? "Add another factor" : "Enroll TOTP"}
                  </button>
                )}
              </div>
            )}
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
