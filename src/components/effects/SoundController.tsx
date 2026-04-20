import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useGlobalUiSounds, isSoundMuted, setSoundMuted, playSound } from "@/hooks/use-sound";

export function SoundController() {
  useGlobalUiSounds();
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(isSoundMuted());
  }, []);

  const toggle = () => {
    const next = !muted;
    setSoundMuted(next);
    setMuted(next);
    if (!next) playSound("success");
  };

  return (
    <button
      onClick={toggle}
      data-sound-off
      aria-label={muted ? "Enable sounds" : "Mute sounds"}
      className="fixed bottom-6 left-6 z-40 grid h-11 w-11 place-items-center rounded-full border border-primary/30 bg-background/70 text-primary backdrop-blur-md shadow-[var(--shadow-neon)] transition-transform hover:scale-110"
    >
      {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
    </button>
  );
}
