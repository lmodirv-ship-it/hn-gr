import { useEffect, useMemo, useState } from "react";
import { Loader2, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ChatRow {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export function ChatLogsTab() {
  const [items, setItems] = useState<ChatRow[] | null>(null);
  const [openSession, setOpenSession] = useState<string | null>(null);

  useEffect(() => {
    void supabase
      .from("chat_logs")
      .select("id, session_id, role, content, created_at")
      .order("created_at", { ascending: false })
      .limit(2000)
      .then(({ data }) => setItems((data as ChatRow[]) ?? []));
  }, []);

  const sessions = useMemo(() => {
    if (!items) return [];
    const map = new Map<
      string,
      { session_id: string; lastAt: string; count: number; preview: string }
    >();
    for (const m of items) {
      const cur = map.get(m.session_id);
      if (!cur) {
        map.set(m.session_id, {
          session_id: m.session_id,
          lastAt: m.created_at,
          count: 1,
          preview: m.content.slice(0, 100),
        });
      } else {
        cur.count += 1;
        if (m.created_at > cur.lastAt) {
          cur.lastAt = m.created_at;
          cur.preview = m.content.slice(0, 100);
        }
      }
    }
    return [...map.values()].sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1));
  }, [items]);

  const sessionMessages = openSession
    ? (items ?? [])
        .filter((m) => m.session_id === openSession)
        .sort((a, b) => (a.created_at < b.created_at ? -1 : 1))
    : [];

  if (items === null) {
    return (
      <div className="grid h-40 place-items-center rounded-2xl border border-border">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center text-sm text-muted-foreground">
        No chat conversations yet.
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sessions.map((s) => (
          <button
            key={s.session_id}
            onClick={() => setOpenSession(s.session_id)}
            className="rounded-2xl border border-border bg-surface/40 p-4 text-left transition-colors hover:border-primary/40"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs text-primary">
                <MessageSquare className="h-3.5 w-3.5" />
                {s.count} msg
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(s.lastAt).toLocaleString()}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-foreground">{s.preview}</p>
            <p className="mt-2 truncate font-mono text-[10px] text-muted-foreground">
              {s.session_id}
            </p>
          </button>
        ))}
      </div>

      {openSession && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur"
          onClick={() => setOpenSession(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-[80vh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-surface"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <p className="font-display text-sm font-semibold">Conversation</p>
              <button
                onClick={() => setOpenSession(null)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {sessionMessages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                      : "mr-auto max-w-[90%] rounded-2xl rounded-bl-sm border border-border bg-background/60 px-3 py-2 text-sm"
                  }
                >
                  {m.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
