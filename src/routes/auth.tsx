import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Sparkles, Mail, KeyRound, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — HN-GROUPE" },
      { name: "description", content: "Access your HN-GROUPE client dashboard." },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "magic";

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);
  const [rememberedEmail, setRememberedEmail] = useState("");
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("hn_remember_email");
      if (saved) setRememberedEmail(saved);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) void navigate({ to: "/dashboard" });
  }, [user, authLoading, navigate]);


  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const fullName = String(fd.get("full_name") ?? "").trim();

    try {
      if (typeof window !== "undefined") {
        if (remember && email) {
          window.localStorage.setItem("hn_remember_email", email);
        } else if (!remember) {
          window.localStorage.removeItem("hn_remember_email");
        }
      }
      if (mode === "magic") {
        const { error: err } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (err) throw err;
        setMagicSent(true);
        return;
      }
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: fullName },
          },
        });
        if (err) throw err;
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
      void navigate({ to: "/dashboard" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setError(msg);
      // Log failed sign-in attempts to the activity log (security audit trail).
      if (mode === "signin" && email) {
        void supabase.from("activity_logs").insert({
          actor_email: email,
          action: "auth.signin_failed",
          target_type: "auth",
          metadata: { reason: msg, mode },
        });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md neon-card p-8">
        <Link to="/" className="mb-6 flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[image:var(--gradient-gold)] text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          HN-<span className="text-primary">GROUPE</span>
        </Link>

        {/* Mode tabs */}
        <div className="mb-6 grid grid-cols-3 gap-1 rounded-full border border-border bg-background/40 p-1 text-xs">
          <TabBtn active={mode === "signin"} onClick={() => { setMode("signin"); setError(null); setMagicSent(false); }}>
            <KeyRound className="h-3.5 w-3.5" /> Sign in
          </TabBtn>
          <TabBtn active={mode === "signup"} onClick={() => { setMode("signup"); setError(null); setMagicSent(false); }}>
            Sign up
          </TabBtn>
          <TabBtn active={mode === "magic"} onClick={() => { setMode("magic"); setError(null); setMagicSent(false); }}>
            <Mail className="h-3.5 w-3.5" /> Magic link
          </TabBtn>
        </div>

        <h1 className="font-display text-2xl font-bold">
          {mode === "signin" && "Welcome back"}
          {mode === "signup" && "Create your account"}
          {mode === "magic" && "Passwordless sign-in"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin" && "Sign in to access your dashboard."}
          {mode === "signup" && "Start tracking your projects with us."}
          {mode === "magic" && "Enter your email — we'll send you a secure sign-in link. No password needed."}
        </p>

        {/* Google sign-in */}
        {!magicSent && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setError(null);
                setBusy(true);
                try {
                  const result = await lovable.auth.signInWithOAuth("google", {
                    redirect_uri: window.location.origin,
                  });
                  if (result.error) throw result.error;
                  if (result.redirected) return;
                  void navigate({ to: "/dashboard" });
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Google sign-in failed");
                } finally {
                  setBusy(false);
                }
              }}
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-background/40 px-3 text-sm font-medium transition-colors hover:bg-background/60 disabled:opacity-60"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
              </svg>
              Continue with Google
            </button>
            <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        {magicSent ? (
          <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-5 text-center">
            <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary">
              <Check className="h-5 w-5" />
            </div>
            <p className="font-semibold">Check your inbox</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We sent you a sign-in link. Click it to access your dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <Field label="Full name">
                <input name="full_name" required className={inputCls} />
              </Field>
            )}
            <Field label="Email">
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                defaultValue={rememberedEmail}
                key={rememberedEmail}
                className={inputCls}
              />
            </Field>
            {mode !== "magic" && (
              <Field label="Password">
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  className={inputCls}
                />
              </Field>
            )}

            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => {
                  setRemember(e.target.checked);
                  if (!e.target.checked && typeof window !== "undefined") {
                    window.localStorage.removeItem("hn_remember_email");
                    setRememberedEmail("");
                  }
                }}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              Remember my email on this device
            </label>

            {error && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 p-2.5 text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="neon-btn neon-btn-gold h-11 w-full text-sm disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" && "Sign in"}
              {mode === "signup" && "Create account"}
              {mode === "magic" && "Send magic link"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-md border border-border bg-background/40 px-3 py-2 text-sm outline-none transition-colors focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-2 py-2 font-medium transition-colors ${
        active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
