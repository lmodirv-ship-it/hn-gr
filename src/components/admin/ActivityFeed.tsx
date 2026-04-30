import { Briefcase, MessageSquare, Activity, Radio } from "lucide-react";
import { useRealtimeFeed } from "@/hooks/use-realtime-feed";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const ICONS = {
  lead: Briefcase,
  chat: MessageSquare,
  event: Activity,
} as const;

export function ActivityFeed() {
  const items = useRealtimeFeed(20);

  return (
    <div className="neon-card flex h-full flex-col overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold tracking-wide">Live activity</h3>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Live
        </span>
      </div>

      <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <div className="grid h-full place-items-center py-8 text-center text-xs text-muted-foreground">
            <div>
              <Radio className="mx-auto h-6 w-6 opacity-40" />
              <p className="mt-2">Waiting for activity…</p>
            </div>
          </div>
        ) : (
          items.map((it, i) => {
            const Icon = ICONS[it.kind];
            const tint =
              it.kind === "lead"
                ? "text-amber-300 bg-amber-400/10 border-amber-400/30"
                : it.kind === "chat"
                  ? "text-sky-300 bg-sky-400/10 border-sky-400/30"
                  : "text-violet-300 bg-violet-400/10 border-violet-400/30";
            return (
              <div
                key={it.id}
                className="group flex items-start gap-3 rounded-lg border border-transparent px-2 py-2 transition-all hover:border-border hover:bg-surface/40 animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
              >
                <span
                  className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md border ${tint}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{it.title}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{it.subtitle}</p>
                </div>
                <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                  {timeAgo(it.at)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
