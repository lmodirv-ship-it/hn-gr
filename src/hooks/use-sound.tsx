import { useCallback, useEffect, useRef } from "react";

/**
 * Lightweight Web Audio hook — generates UI sounds on the fly.
 * No external audio files needed. All sounds are synthesized.
 */

type SoundType =
  | "click"
  | "hover"
  | "success"
  | "open"
  | "close"
  | "tick"
  | "soft"
  | "chime"
  | "whoosh"
  | "type";

let sharedCtx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sharedCtx) {
    const Ctor =
      (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
        .AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    sharedCtx = new Ctor();
  }
  if (sharedCtx.state === "suspended") {
    void sharedCtx.resume();
  }
  return sharedCtx;
}

export function setSoundMuted(value: boolean) {
  muted = value;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("hn-sound-muted", value ? "1" : "0");
    } catch {
      /* ignore */
    }
  }
}

export function isSoundMuted() {
  if (typeof window === "undefined") return muted;
  try {
    const stored = localStorage.getItem("hn-sound-muted");
    if (stored !== null) muted = stored === "1";
  } catch {
    /* ignore */
  }
  return muted;
}

function tone(opts: {
  freq: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
  sweepTo?: number;
}) {
  const ctx = getCtx();
  if (!ctx || muted) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(opts.freq, ctx.currentTime);
  if (opts.sweepTo) {
    osc.frequency.exponentialRampToValueAtTime(
      opts.sweepTo,
      ctx.currentTime + opts.duration
    );
  }
  const peak = opts.gain ?? 0.08;
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(peak, ctx.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + opts.duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + opts.duration + 0.02);
}

export function playSound(kind: SoundType) {
  if (typeof window === "undefined") return;
  isSoundMuted();
  if (muted) return;
  switch (kind) {
    case "click":
      // Premium glassy click — short metallic ping
      tone({ freq: 1200, duration: 0.06, type: "triangle", gain: 0.05, sweepTo: 1800 });
      setTimeout(() => tone({ freq: 2400, duration: 0.04, type: "sine", gain: 0.03 }), 15);
      break;
    case "hover":
      // Soft airy tick
      tone({ freq: 1800, duration: 0.04, type: "sine", gain: 0.018 });
      break;
    case "soft":
      tone({ freq: 700, duration: 0.05, type: "sine", gain: 0.025 });
      break;
    case "success":
      // Pleasant rising chord
      tone({ freq: 660, duration: 0.12, type: "triangle", gain: 0.06 });
      setTimeout(() => tone({ freq: 880, duration: 0.14, type: "triangle", gain: 0.06 }), 90);
      setTimeout(() => tone({ freq: 1320, duration: 0.18, type: "sine", gain: 0.05 }), 200);
      break;
    case "chime":
      tone({ freq: 1320, duration: 0.18, type: "sine", gain: 0.05 });
      setTimeout(() => tone({ freq: 1760, duration: 0.22, type: "sine", gain: 0.04 }), 80);
      break;
    case "open":
      // Whoosh up
      tone({ freq: 380, duration: 0.18, type: "sine", gain: 0.05, sweepTo: 1100 });
      break;
    case "close":
      tone({ freq: 1100, duration: 0.16, type: "sine", gain: 0.05, sweepTo: 380 });
      break;
    case "whoosh":
      tone({ freq: 220, duration: 0.22, type: "sawtooth", gain: 0.03, sweepTo: 880 });
      break;
    case "type":
      tone({ freq: 1600 + Math.random() * 400, duration: 0.025, type: "square", gain: 0.015 });
      break;
    case "tick":
      tone({ freq: 2200, duration: 0.03, type: "square", gain: 0.02 });
      break;
  }
}

/**
 * Hook that auto-binds click + hover sounds to all buttons / links / [data-sound]
 * elements at the document level. Mount once (in __root.tsx).
 */
export function useGlobalUiSounds() {
  const lastHover = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    isSoundMuted();

    const isInteractive = (el: Element | null): HTMLElement | null => {
      if (!el) return null;
      const node = (el as HTMLElement).closest(
        "button, a, [role=button], [data-sound]"
      ) as HTMLElement | null;
      if (!node) return null;
      if (node.hasAttribute("data-sound-off")) return null;
      if ((node as HTMLButtonElement).disabled) return null;
      return node;
    };

    const onClick = (e: MouseEvent) => {
      const node = isInteractive(e.target as Element);
      if (!node) return;
      const kind = (node.getAttribute("data-sound") as SoundType | null) ?? "click";
      playSound(kind);
    };

    const onOver = (e: MouseEvent) => {
      const node = isInteractive(e.target as Element);
      if (!node) return;
      const now = performance.now();
      if (now - lastHover.current < 80) return;
      lastHover.current = now;
      playSound("hover");
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("mouseover", onOver, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("mouseover", onOver, true);
    };
  }, []);

  const toggleMute = useCallback(() => {
    setSoundMuted(!isSoundMuted());
  }, []);

  return { playSound, toggleMute, isMuted: isSoundMuted };
}
