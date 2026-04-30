import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { changeLanguage, LANG_META, SUPPORTED_LANGS, type Lang } from "@/lib/i18n";

interface Props {
  variant?: "header" | "compact";
}

export function LanguageSwitcher({ variant = "header" }: Props) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = (i18n.language as Lang) in LANG_META ? (i18n.language as Lang) : "en";

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const triggerCls =
    variant === "compact"
      ? "inline-flex h-8 items-center gap-1.5 rounded-md border border-border/60 bg-surface/40 px-2.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
      : "inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-2.5 text-sm text-muted-foreground hover:text-foreground";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={triggerCls}
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="font-medium uppercase tabular-nums">{current}</span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute end-0 z-50 mt-2 min-w-[160px] overflow-hidden rounded-lg border border-border bg-background/95 p-1 shadow-xl backdrop-blur"
        >
          {SUPPORTED_LANGS.map((l) => {
            const meta = LANG_META[l];
            const active = current === l;
            return (
              <button
                key={l}
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  void changeLanguage(l);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-sm transition ${
                  active
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden className="text-base leading-none">
                    {meta.flag}
                  </span>
                  <span>{meta.native}</span>
                </span>
                {active && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
