import { useEffect, useState } from "react";
import { X, Trophy, CheckCircle2 } from "lucide-react";

// نهاية استقبال التوقعات (وقت نهاية المباراة تقريبًا)
const MATCH_END = new Date("2026-06-29T23:30:00Z").getTime();

const OPTIONS = [
  "🇲🇦 المغرب 1 - 0 هولندا 🇳🇱",
  "🇲🇦 المغرب 2 - 1 هولندا 🇳🇱",
  "🤝 تعادل 1 - 1",
  "🤝 تعادل 0 - 0",
  "🇳🇱 هولندا 2 - 1 المغرب 🇲🇦",
];

const STORAGE_KEY = "hn_match_pred_mar_ned";

function formatRemaining(ms: number) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

export function MatchPredictionModal() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [remaining, setRemaining] = useState(MATCH_END - Date.now());

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (Date.now() >= MATCH_END) return; // المباراة انتهت — لا تظهر
    if (sessionStorage.getItem("hn_match_pred_closed") === "1") return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSelected(Number(saved));
      setSubmitted(true);
    }

    const t = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => {
      const r = MATCH_END - Date.now();
      setRemaining(r);
      if (r <= 0) setOpen(false);
    }, 1000);
    return () => window.clearInterval(id);
  }, [open]);

  const close = () => {
    sessionStorage.setItem("hn_match_pred_closed", "1");
    setOpen(false);
  };

  const submit = () => {
    if (selected === null) return;
    localStorage.setItem(STORAGE_KEY, String(selected));
    setSubmitted(true);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={close}
      dir="rtl"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-primary/30 bg-surface p-6 shadow-2xl"
      >
        <button
          onClick={close}
          aria-label="إغلاق"
          className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary">
          <Trophy className="h-7 w-7" />
        </div>

        <h3 className="mt-4 text-center font-display text-xl font-bold sm:text-2xl">
          🇲🇦 توقع نتيجة مباراة المغرب × هولندا 🇳🇱
        </h3>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          شارك في تخمين نتيجة المباراة مجانًا للتسلية والترفيه فقط.
        </p>

        <div className="mt-3 rounded-md border border-border bg-background/60 p-2 text-center text-[11px] text-muted-foreground">
          ملاحظة: هذه الميزة مجانية بالكامل، ولا ترتبط بأي جوائز مالية أو مراهنات أو مقامرة.
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>ينتهي استقبال التوقعات خلال:</span>
          <span className="rounded bg-primary/15 px-2 py-0.5 font-mono font-semibold text-primary">
            {formatRemaining(remaining)}
          </span>
        </div>

        {!submitted ? (
          <>
            <div className="mt-5 grid gap-2">
              {OPTIONS.map((opt, i) => {
                const active = selected === i;
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`flex items-center justify-between rounded-md border px-3 py-2.5 text-right text-sm transition ${
                      active
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    <span>{opt}</span>
                    {active && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={submit}
              disabled={selected === null}
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-md bg-[image:var(--gradient-gold)] px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] disabled:opacity-50"
            >
              إرسال التوقع
            </button>
          </>
        ) : (
          <div className="mt-6 rounded-md border border-primary/30 bg-primary/10 p-4 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-2 font-semibold text-foreground">شكراً، تم تسجيل توقعك.</p>
            {selected !== null && (
              <p className="mt-1 text-xs text-muted-foreground">{OPTIONS[selected]}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
