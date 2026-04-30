import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  delta?: number; // percentage change vs previous period
  spark?: { v: number }[];
  tone?: "primary" | "accent";
  delay?: number;
}

export function KpiCard({
  icon,
  label,
  value,
  suffix,
  delta,
  spark,
  tone = "primary",
  delay = 0,
}: KpiCardProps) {
  const display = useCountUp(value);
  const isUp = (delta ?? 0) >= 0;
  const accent = tone === "accent" ? "var(--accent)" : "var(--primary)";

  return (
    <div
      className="neon-card group relative overflow-hidden p-5 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* corner glow */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-3xl transition-opacity group-hover:opacity-70"
        style={{ background: accent }}
      />

      <div className="relative flex items-start justify-between">
        <span
          className={tone === "accent" ? "neon-icon neon-icon-gold" : "neon-icon"}
        >
          {icon}
        </span>
        {delta !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
              isUp
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                : "border-rose-400/30 bg-rose-400/10 text-rose-300"
            }`}
          >
            {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>

      <p className="relative mt-4 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p
        className="relative mt-1 font-display text-4xl font-bold leading-none tracking-tight"
        style={{
          background: `linear-gradient(135deg, var(--foreground), ${accent})`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {display}
        {suffix && <span className="text-2xl text-muted-foreground">{suffix}</span>}
      </p>

      {spark && spark.length > 1 && (
        <div className="relative mt-3 h-10 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spark} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`sp-${tone}-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accent} stopOpacity={0.6} />
                  <stop offset="95%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={accent}
                strokeWidth={2}
                fill={`url(#sp-${tone}-${label})`}
                isAnimationActive
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
