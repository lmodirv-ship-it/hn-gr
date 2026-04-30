import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FeedItem {
  id: string;
  kind: "lead" | "chat" | "event";
  title: string;
  subtitle: string;
  at: string;
}

export function useRealtimeFeed(maxItems = 25) {
  const [items, setItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    let mounted = true;

    // Initial backfill
    void Promise.all([
      supabase
        .from("project_requests")
        .select("id, full_name, project_type, created_at")
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("chat_logs")
        .select("id, session_id, role, content, created_at")
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("analytics_events")
        .select("id, event_name, path, created_at")
        .order("created_at", { ascending: false })
        .limit(8),
    ]).then(([leads, chats, events]) => {
      if (!mounted) return;
      const seed: FeedItem[] = [];
      (leads.data ?? []).forEach((l) =>
        seed.push({
          id: `l-${l.id}`,
          kind: "lead",
          title: `New lead — ${l.full_name}`,
          subtitle: l.project_type ?? "Project request",
          at: l.created_at,
        }),
      );
      (chats.data ?? []).forEach((c) =>
        seed.push({
          id: `c-${c.id}`,
          kind: "chat",
          title: c.role === "user" ? "Visitor message" : "Assistant reply",
          subtitle: (c.content ?? "").slice(0, 80),
          at: c.created_at,
        }),
      );
      (events.data ?? []).forEach((e) =>
        seed.push({
          id: `e-${e.id}`,
          kind: "event",
          title: e.event_name,
          subtitle: e.path ?? "—",
          at: e.created_at,
        }),
      );
      seed.sort((a, b) => (a.at < b.at ? 1 : -1));
      setItems(seed.slice(0, maxItems));
    });

    const ch = supabase
      .channel("admin-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "project_requests" },
        (payload) => {
          const r = payload.new as Record<string, unknown>;
          setItems((prev) =>
            [
              {
                id: `l-${String(r.id)}`,
                kind: "lead" as const,
                title: `New lead — ${String(r.full_name ?? "—")}`,
                subtitle: String(r.project_type ?? "Project request"),
                at: String(r.created_at),
              },
              ...prev,
            ].slice(0, maxItems),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_logs" },
        (payload) => {
          const r = payload.new as Record<string, unknown>;
          setItems((prev) =>
            [
              {
                id: `c-${String(r.id)}`,
                kind: "chat" as const,
                title: r.role === "user" ? "Visitor message" : "Assistant reply",
                subtitle: String(r.content ?? "").slice(0, 80),
                at: String(r.created_at),
              },
              ...prev,
            ].slice(0, maxItems),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "analytics_events" },
        (payload) => {
          const r = payload.new as Record<string, unknown>;
          setItems((prev) =>
            [
              {
                id: `e-${String(r.id)}`,
                kind: "event" as const,
                title: String(r.event_name ?? "event"),
                subtitle: String(r.path ?? "—"),
                at: String(r.created_at),
              },
              ...prev,
            ].slice(0, maxItems),
          );
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      void supabase.removeChannel(ch);
    };
  }, [maxItems]);

  return items;
}
