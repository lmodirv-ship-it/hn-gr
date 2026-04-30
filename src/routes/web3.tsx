import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Boxes,
  ShieldCheck,
  Sparkles,
  Zap,
  Layers,
  Network,
  Coins,
  Wallet,
  Lock,
  Cpu,
  Globe,
  Code2,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/web3")({
  head: () => ({
    meta: [
      { title: "HN-GROUPE — Web3 Studio · Onchain experiences for the next era" },
      {
        name: "description",
        content:
          "We design and ship Web3 products: dApps, smart contracts, NFT platforms and tokenized experiences — engineered with senior craft.",
      },
      { property: "og:title", content: "HN-GROUPE — Web3 Studio" },
      {
        property: "og:description",
        content:
          "Onchain experiences for the next era. dApps, smart contracts, NFT platforms.",
      },
    ],
  }),
  component: Web3Landing,
});

function Web3Landing() {
  return (
    <div className="relative isolate overflow-hidden">
      <BackgroundFx />
      <Hero />
      <ChainsMarquee />
      <Stats />
      <Capabilities />
      <ProtocolStack />
      <Process />
      <CTA />
    </div>
  );
}

/* ============================================================ */
/* Background — animated mesh + grid + floating orbit rings     */
/* ============================================================ */
function BackgroundFx() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Mesh gradient */}
      <div
        className="absolute inset-0 opacity-90"
        style={{ background: "var(--gradient-mesh)" }}
      />
      {/* Animated grid */}
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-40" />
      {/* Floating orbs */}
      <div
        className="animate-float-slow absolute -left-32 top-40 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 60%, transparent), transparent 70%)",
        }}
      />
      <div
        className="animate-float-slow absolute -right-32 top-[60vh] h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
        style={{
          animationDelay: "2s",
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 50%, transparent), transparent 70%)",
        }}
      />
      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}

/* ============================================================ */
/* Hero                                                          */
/* ============================================================ */
function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8 lg:pt-40">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        {/* LEFT */}
        <div className="animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary backdrop-blur">
            <span className="relative grid h-1.5 w-1.5 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Web3 Studio · v3
          </div>

          {/* Heading */}
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Onchain{" "}
            <span className="shimmer-text">experiences</span>
            <br />
            for the next{" "}
            <span className="text-gradient-gold">era</span>.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            We design and ship Web3 products with senior craft — dApps, smart contracts, NFT
            platforms and tokenized experiences. Built to scale, audited to last.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/start-project" className="neon-btn">
              <Wallet className="h-4 w-4" />
              Start a project
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/portfolio" className="neon-btn neon-btn-gold">
              <Boxes className="h-4 w-4" />
              View dApps
            </Link>
          </div>

          {/* Trust row */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs">
            {[
              { icon: ShieldCheck, label: "Audit-ready code" },
              { icon: Lock, label: "Non-custodial by default" },
              { icon: Zap, label: "Gas-optimized" },
            ].map((it) => (
              <div key={it.label} className="flex items-center gap-2 text-muted-foreground">
                <it.icon className="h-3.5 w-3.5 text-primary" />
                {it.label}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — orbit visualization */}
        <OrbitVisual />
      </div>
    </section>
  );
}

function OrbitVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      {/* Concentric rings */}
      <div className="absolute inset-0 grid place-items-center">
        {[0.45, 0.65, 0.85, 1].map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: `${s * 100}%`,
              height: `${s * 100}%`,
              borderColor: `color-mix(in oklab, var(--primary) ${10 + i * 4}%, transparent)`,
              boxShadow: `inset 0 0 60px -10px color-mix(in oklab, var(--primary) ${
                8 + i * 3
              }%, transparent)`,
            }}
          />
        ))}
      </div>

      {/* Orbiting chips */}
      {[
        { Icon: Coins, color: "primary", delay: 0, ring: 0.85 },
        { Icon: Layers, color: "accent", delay: -10, ring: 0.65 },
        { Icon: Cpu, color: "primary", delay: -20, ring: 1 },
        { Icon: Globe, color: "accent", delay: -5, ring: 0.45 },
      ].map(({ Icon, color, delay, ring }, i) => (
        <div
          key={i}
          className="animate-orbit absolute inset-0"
          style={{ animationDelay: `${delay}s`, animationDuration: `${30 + i * 8}s` }}
        >
          <div
            className="absolute left-1/2 top-1/2"
            style={{ transform: `translate(-50%, -50%) translateY(-${(ring * 100) / 2}%)` }}
          >
            <span
              className={`grid h-11 w-11 place-items-center rounded-xl ${
                color === "primary" ? "neon-icon" : "neon-icon-gold"
              }`}
              style={{ animation: "orbit 30s linear infinite reverse" }}
            >
              <Icon className="h-5 w-5" />
            </span>
          </div>
        </div>
      ))}

      {/* Center logo / token */}
      <div className="absolute inset-0 grid place-items-center">
        <div
          className="animate-pulse-glow grid h-28 w-28 place-items-center rounded-full"
          style={{
            background: "var(--gradient-neon)",
            boxShadow: "var(--shadow-neon), 0 0 80px -10px color-mix(in oklab, var(--primary) 80%, transparent)",
          }}
        >
          <span className="font-display text-2xl font-bold text-primary-foreground">HN</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ */
/* Marquee — supported chains                                   */
/* ============================================================ */
function ChainsMarquee() {
  const chains = [
    "Ethereum", "Solana", "Polygon", "Base", "Arbitrum", "Optimism",
    "Avalanche", "BNB Chain", "Sui", "Aptos", "Starknet", "zkSync",
  ];
  return (
    <section className="relative border-y border-border/50 bg-surface/20 py-6 backdrop-blur">
      <p className="mb-4 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
        Multi-chain expertise
      </p>
      <div className="overflow-hidden">
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
          {[...chains, ...chains].map((c, i) => (
            <div
              key={`${c}-${i}`}
              className="flex items-center gap-2 font-display text-base font-medium text-muted-foreground transition hover:text-primary"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: "var(--gradient-neon)" }}
              />
              {c}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* Stats                                                         */
/* ============================================================ */
function Stats() {
  const stats = [
    { value: 12, suffix: "+", label: "Chains supported" },
    { value: 48, suffix: "M", label: "Volume processed", prefix: "$" },
    { value: 240, suffix: "+", label: "Smart contracts shipped" },
    { value: 99.9, suffix: "%", label: "Uptime SLA" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>
    </section>
  );
}

function StatCard({
  value,
  suffix,
  prefix,
  label,
  index,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  index: number;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const display = value % 1 !== 0 ? n.toFixed(1) : Math.round(n).toLocaleString();

  return (
    <div
      className="neon-card animate-fade-up p-6"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <p className="font-display text-4xl font-bold tabular-nums">
        {prefix}
        {display}
        <span className="text-primary">{suffix}</span>
      </p>
      <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

/* ============================================================ */
/* Capabilities                                                  */
/* ============================================================ */
function Capabilities() {
  const items = [
    {
      icon: Code2,
      tag: "Smart Contracts",
      title: "Solidity & Move",
      desc: "Audit-ready, gas-optimized contracts. ERC-20/721/1155, custom protocols, upgradeable patterns.",
      color: "primary",
    },
    {
      icon: Layers,
      tag: "dApps",
      title: "Full-stack Web3",
      desc: "React + viem/wagmi/ethers. Wallet connect, signing flows, indexers, subgraphs.",
      color: "primary",
    },
    {
      icon: Sparkles,
      tag: "NFT & Tokens",
      title: "Launchpads & drops",
      desc: "Mint engines, allowlists, royalties, marketplace integration, on-chain metadata.",
      color: "accent",
    },
    {
      icon: Network,
      tag: "Infrastructure",
      title: "Indexing & RPC",
      desc: "The Graph subgraphs, Alchemy/QuickNode setup, custom indexers, event pipelines.",
      color: "primary",
    },
    {
      icon: ShieldCheck,
      tag: "Security",
      title: "Pre-audit reviews",
      desc: "Static analysis, fuzzing, formal review prep. We ship code that auditors love.",
      color: "accent",
    },
    {
      icon: Wallet,
      tag: "Onboarding",
      title: "Account abstraction",
      desc: "ERC-4337 smart wallets, gasless UX, social login, passkeys — Web2 feel for Web3.",
      color: "primary",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Capabilities
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
          End-to-end <span className="text-gradient-gold">Web3 craft</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          From contract architecture to wallet UX — one senior team, one shipped product.
        </p>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <article
            key={it.title}
            className="neon-card animate-fade-up group p-6"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div
              className={`${
                it.color === "primary" ? "neon-icon" : "neon-icon-gold"
              }`}
            >
              <it.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {it.tag}
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>

            <div className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">
              Learn more <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ============================================================ */
/* Protocol stack — visual timeline                              */
/* ============================================================ */
function ProtocolStack() {
  const layers = [
    { tag: "L1", name: "Settlement", items: ["Ethereum", "Solana", "Bitcoin"] },
    { tag: "L2", name: "Execution", items: ["Base", "Arbitrum", "Optimism", "zkSync"] },
    { tag: "L3", name: "App-specific", items: ["AppChains", "Subnets", "Rollups"] },
    { tag: "UX", name: "Account abstraction", items: ["ERC-4337", "Passkeys", "Paymasters"] },
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Stack
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
            We work across <br />the <span className="shimmer-text">full stack</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            From base-layer settlement to seamless wallet UX. We pick the right primitives for
            your product, not the trendy ones.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/40 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_oklch(0.7_0.18_150)]" />
            All layers production-tested
          </div>
        </div>

        <div className="relative space-y-3">
          {/* Vertical line */}
          <div
            className="absolute left-[1.25rem] top-2 bottom-2 w-px"
            style={{
              background:
                "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--primary) 50%, transparent), transparent)",
            }}
          />
          {layers.map((l, i) => (
            <div
              key={l.tag}
              className="animate-fade-up neon-card flex items-center gap-4 p-4 pl-5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg font-mono text-xs font-bold"
                style={{
                  background: "var(--gradient-neon)",
                  boxShadow: "var(--shadow-neon)",
                  color: "var(--primary-foreground)",
                }}
              >
                {l.tag}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold">{l.name}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {l.items.map((it) => (
                    <span
                      key={it}
                      className="rounded-md border border-border/60 bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* Process                                                       */
/* ============================================================ */
function Process() {
  const steps = [
    { n: "01", title: "Discovery", desc: "Token economics, threat model, scope." },
    { n: "02", title: "Architecture", desc: "Contracts, indexers, infra blueprint." },
    { n: "03", title: "Build & test", desc: "Foundry/Hardhat, fuzzing, coverage." },
    { n: "04", title: "Audit & ship", desc: "Pre-audit fixes, deploy, monitoring." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Process
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
          From whitepaper to{" "}
          <span className="text-gradient-gold">mainnet</span>
        </h2>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className="neon-card animate-fade-up p-6"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <p
              className="font-mono text-3xl font-bold"
              style={{
                background: "var(--gradient-neon)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {s.n}
            </p>
            <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================ */
/* CTA                                                           */
/* ============================================================ */
function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
      <div
        className="relative overflow-hidden rounded-3xl border border-primary/30 p-10 text-center sm:p-16"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 50% 0%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%), color-mix(in oklab, var(--surface) 70%, transparent)",
          boxShadow: "var(--shadow-neon)",
        }}
      >
        {/* Glow blobs */}
        <div
          className="animate-pulse-glow pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--primary) 60%, transparent), transparent 70%)",
          }}
        />
        <div
          className="animate-pulse-glow pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full blur-3xl"
          style={{
            animationDelay: "2s",
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--accent) 50%, transparent), transparent 70%)",
          }}
        />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-3 w-3" />
            Ready to deploy
          </span>
          <h2 className="mt-6 font-display text-4xl font-bold sm:text-6xl">
            Let's build your{" "}
            <span className="shimmer-text">onchain</span> product.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Tell us about your protocol, NFT drop or dApp idea. We'll send back a scoped plan
            within 48h.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/start-project" className="neon-btn">
              <Wallet className="h-4 w-4" /> Connect with us
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/portfolio" className="neon-btn neon-btn-gold">
              View portfolio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
