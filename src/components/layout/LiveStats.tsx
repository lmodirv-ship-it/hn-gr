import { useEffect, useState } from "react";
import { Users, Eye, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  online: number;
  visitors: number;
  registered: number;
}

export function LiveStats({ compact = false }: { compact?: boolean }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error } = await supabase.rpc("get_public_site_stats" as never);
      if (!active || error || !data) return;
      const d = data as unknown as Stats;
      setStats({
        online: Number(d.online ?? 0),
        visitors: Number(d.visitors ?? 0),
        registered: Number(d.registered ?? 0),
      });
    };
    void load();
    const id = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  if (!stats) return null;

  const fmt = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <div
      className={`hidden items-center gap-2 rounded-full border border-border/60 bg-surface/40 px-2.5 py-1 text-[11px] tabular-nums text-muted-foreground ${
        compact ? "lg:inline-flex" : "md:inline-flex"
      }`}
      title={`Online: ${stats.online} · Visitors: ${stats.visitors} · Registered: ${stats.registered}`}
    >
      <span className="inline-flex items-center gap-1">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        <Users className="h-3 w-3" />
        {fmt(stats.online)}
      </span>
      <span className="h-3 w-px bg-border/60" />
      <span className="inline-flex items-center gap-1">
        <Eye className="h-3 w-3" />
        {fmt(stats.visitors)}
      </span>
      <span className="h-3 w-px bg-border/60" />
      <span className="inline-flex items-center gap-1">
        <UserCheck className="h-3 w-3" />
        {fmt(stats.registered)}
      </span>
    </div>
  );
}
