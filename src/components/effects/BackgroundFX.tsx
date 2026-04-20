/**
 * Global futuristic background: animated mesh gradients + grid + floating orbs.
 * Renders behind all content. Pointer-events disabled.
 */
export function BackgroundFX() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Mesh gradient base */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-mesh)" }}
      />
      {/* Animated grid */}
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-50" />

      {/* Floating orbs */}
      <div
        className="absolute -top-32 left-1/4 h-[28rem] w-[28rem] rounded-full opacity-30 blur-3xl animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 60%, transparent), transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/3 right-0 h-[32rem] w-[32rem] rounded-full opacity-25 blur-3xl animate-pulse-glow"
        style={{
          animationDelay: "2s",
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 50%, transparent), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 h-[26rem] w-[26rem] rounded-full opacity-20 blur-3xl animate-pulse-glow"
        style={{
          animationDelay: "4s",
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 40%, transparent), transparent 70%)",
        }}
      />

      {/* Subtle noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}
