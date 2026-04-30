/**
 * Animated aurora-mesh background for the admin shell.
 * Uses only design tokens defined in styles.css.
 */
export function AdminBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Animated gradient mesh */}
      <div
        className="absolute inset-0 animate-pulse-glow"
        style={{ background: "var(--gradient-mesh)" }}
      />

      {/* Faint dotted/grid wash */}
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-60" />

      {/* Floating orbs */}
      <div
        className="absolute -left-32 top-1/4 h-[420px] w-[420px] animate-float-slow rounded-full opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 70%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -right-32 bottom-0 h-[480px] w-[480px] animate-float-slow rounded-full opacity-30 blur-[140px]"
        style={{
          animationDelay: "2s",
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 70%, transparent) 0%, transparent 70%)",
        }}
      />

      {/* Subtle vignette to anchor content */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 50%, transparent 40%, color-mix(in oklab, var(--background) 80%, transparent) 100%)",
        }}
      />
    </div>
  );
}
