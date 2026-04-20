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
      tone({ freq: 880, duration: 0.08, type: "triangle", gain: 0.06, sweepTo: 1320 });
      break;
    case "hover":
      tone({ freq: 1400, duration: 0.05, type: "sine", gain: 0.025 });
      break;
    case "success":
      tone({ freq: 660, duration: 0.1, type: "triangle", gain: 0.07 });
      setTimeout(() => tone({ freq: 990, duration: 0.14, type: "triangle", gain: 0.07 }), 90);
      break;
    case "open":
      tone({ freq: 520, duration: 0.12, type: "sine", gain: 0.06, sweepTo: 880 });
      break;
    case "close":
      tone({ freq: 880, duration: 0.12, type: "sine", gain: 0.06, sweepTo: 440 });
      break;
    case "tick":
      tone({ freq: 2000, duration: 0.03, type: "square", gain: 0.02 });
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
