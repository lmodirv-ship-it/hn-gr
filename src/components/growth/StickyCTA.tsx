import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";
import { trackEvent } from "@/hooks/use-track-event";

export function StickyCTA() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDismissed(sessionStorage.getItem("hn_sticky_dismissed") === "1");
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed || !show) return null;
  if (pathname === "/start-project" || pathname.startsWith("/auth")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-primary/30 bg-background/95 px-4 py-3 backdrop-blur-xl sm:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Free 15-min consultation</p>
          <p className="truncate text-xs text-muted-foreground">Get a quote in 24h · No commitment</p>
        </div>
        <Link
          to="/start-project"
          onClick={() => void trackEvent("cta_click", { cta: "sticky_mobile" })}
          className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[image:var(--gradient-gold)] px-3 py-2 text-xs font-semibold text-primary-foreground"
        >
          Start <ArrowRight className="h-3 w-3" />
        </Link>
        <button
          aria-label="Dismiss"
          onClick={() => {
            sessionStorage.setItem("hn_sticky_dismissed", "1");
            setDismissed(true);
          }}
          className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
