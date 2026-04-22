import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "hn_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export async function trackEvent(
  eventName: string,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const { data: userData } = await supabase.auth.getUser();
    await supabase.from("analytics_events").insert({
      event_name: eventName,
      user_id: userData?.user?.id ?? null,
      session_id: getSessionId(),
      path: window.location.pathname,
      metadata: metadata as never,
    });
  } catch (err) {
    console.warn("trackEvent failed", err);
  }
}

/** Auto page_view tracker — mount once near the root. */
export function PageViewTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (last.current === pathname) return;
    last.current = pathname;
    void trackEvent("page_view", { path: pathname });
  }, [pathname]);

  return null;
}
