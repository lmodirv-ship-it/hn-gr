import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MessageCircle, X, Send, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { sendChatMessage, type ChatSuggestion } from "@/server/chat";
import { trackEvent } from "@/hooks/use-track-event";
import { supabase } from "@/integrations/supabase/client";

function chatSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = sessionStorage.getItem("hn_chat_session");
  if (!id) {
    id = `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem("hn_chat_session", id);
  }
  return id;
}

type Msg =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; suggestion?: ChatSuggestion };

const QUICK = [
  "I want a company website",
  "I want an online store",
  "I want a custom web platform",
];

const typeToParam: Record<string, string> = {
  Website: "Website",
  "E-commerce": "E-commerce",
  "Platform / Web App": "Platform",
  "Custom software": "Custom software",
  Other: "Other",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm the HN-groupe Assistant. Tell me about your project idea, and I'll suggest a plan you can turn into a real request.",
    },
  ]);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy, open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setBusy(true);

    const sid = chatSessionId();
    void trackEvent("chat_message_sent", { length: trimmed.length });
    void supabase.from("chat_logs").insert({ session_id: sid, role: "user", content: trimmed });

    try {
      const history = next
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      const suggestion = await sendChatMessage({ data: { messages: history } });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: suggestion.shortSummary, suggestion },
      ]);
      void supabase
        .from("chat_logs")
        .insert({ session_id: sid, role: "assistant", content: suggestion.shortSummary });
      void trackEvent("idea_generated", { projectType: suggestion.projectType });
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, the assistant is unavailable right now. You can still start a project from the contact page.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const useSuggestion = (s: ChatSuggestion) => {
    void navigate({
      to: "/start-project",
      search: {
        projectType: typeToParam[s.projectType] ?? "Website",
        summary: s.shortSummary,
      },
    });
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[image:var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[34rem] w-[min(92vw,24rem)] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
          <div className="flex items-center gap-3 border-b border-border bg-background/40 px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-[image:var(--gradient-gold)] text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold">HN-groupe Assistant</p>
              <p className="truncate text-xs text-muted-foreground">
                Describe your idea and get a project plan.
              </p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <MessageBubble key={i} msg={m} onUse={useSuggestion} />
            ))}
            {busy && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-1.5 border-t border-border px-3 py-2">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-background/40 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your project…"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              disabled={busy}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="grid h-9 w-9 place-items-center rounded-md bg-[image:var(--gradient-gold)] text-primary-foreground disabled:opacity-50"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function MessageBubble({
  msg,
  onUse,
}: {
  msg: Msg;
  onUse: (s: ChatSuggestion) => void;
}) {
  if (msg.role === "user") {
    return (
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
        {msg.content}
      </div>
    );
  }
  return (
    <div className="mr-auto max-w-[90%] rounded-2xl rounded-bl-sm border border-border bg-background/60 px-3 py-2 text-sm">
      <p className="text-foreground">{msg.content}</p>

      {msg.suggestion && (
        <div className="mt-3 space-y-3 text-xs">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Project type
            </span>
            <p className="mt-0.5 text-foreground">{msg.suggestion.projectType}</p>
          </div>

          {msg.suggestion.suggestedPages.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Pages / Modules
              </span>
              <ul className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-muted-foreground">
                {msg.suggestion.suggestedPages.map((p) => (
                  <li key={p} className="flex gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {msg.suggestion.suggestedTechStack.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Tech stack
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {msg.suggestion.suggestedTechStack.map((t) => (
                  <span
                    key={t}
                    className="rounded border border-border bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => onUse(msg.suggestion!)}
            className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-[image:var(--gradient-gold)] px-3 py-1.5 text-xs font-semibold text-primary-foreground"
          >
            Use this to start a project
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
