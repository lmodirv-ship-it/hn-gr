import { useEffect, useState, type FormEvent } from "react";
import { X, Gift, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/hooks/use-track-event";

export function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("hn_exit_seen") === "1") return;

    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !sessionStorage.getItem("hn_exit_seen")) {
        sessionStorage.setItem("hn_exit_seen", "1");
        setOpen(true);
        void trackEvent("exit_intent_shown");
      }
    };
    // also trigger after 45s for mobile users (no mouseleave)
    const timer = window.setTimeout(() => {
      if (!sessionStorage.getItem("hn_exit_seen")) {
        sessionStorage.setItem("hn_exit_seen", "1");
        setOpen(true);
        void trackEvent("exit_intent_shown", { trigger: "timer" });
      }
    }, 45000);

    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mouseleave", onLeave);
      window.clearTimeout(timer);
    };
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    if (!email) return;
    setSubmitting(true);
    try {
      await supabase.from("project_requests").insert({
        full_name: "Lead Magnet",
        email,
        project_type: "Free audit",
        description: "Requested free site audit via exit-intent popup.",
      });
      void trackEvent("lead_magnet_submitted", { source: "exit_intent" });
      toast.success("Done! We'll send your free audit within 24h.");
      setOpen(false);
    } catch {
      toast.error("Could not save. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-background/80 p-4 backdrop-blur"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-primary/30 bg-surface p-8 shadow-2xl"
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary">
          <Gift className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-center font-display text-2xl font-bold">
          Wait — get a <span className="text-gradient-gold">free site audit</span>
        </h3>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          We'll review your current site (or idea) and send 5 actionable improvements within 24h. Free, no strings.
        </p>
        <form onSubmit={onSubmit} className="mt-5 grid gap-3">
          <input
            type="email"
            name="email"
            required
            placeholder="your@email.com"
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[image:var(--gradient-gold)] px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Send my free audit
          </button>
          <p className="text-center text-[11px] text-muted-foreground">
            We respect your inbox. No spam, ever.
          </p>
        </form>
      </div>
    </div>
  );
}
