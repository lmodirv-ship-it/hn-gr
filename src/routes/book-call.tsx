import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, Clock, MessageSquare, Sparkles, Target, Crown } from "lucide-react";
import { trackEvent } from "@/hooks/use-track-event";

type MeetingType = {
  id: string;
  name: string;
  duration: string;
  price: string;
  description: string;
  url: string;
  icon: typeof Sparkles;
  popular?: boolean;
};

const MEETINGS: MeetingType[] = [
  {
    id: "discovery",
    name: "Discovery Call",
    duration: "15 min",
    price: "Free",
    description: "Quick intro to understand your project & see if we're a good fit.",
    url: "https://calendly.com/hngroupe/new-meeting",
    icon: Sparkles,
  },
  {
    id: "strategy",
    name: "Strategy Session",
    duration: "30 min",
    price: "Free",
    description: "Deeper review of your goals + a tailored action plan.",
    url: "https://calendly.com/hngroupe/new-meeting-1",
    icon: Target,
    popular: true,
  },
  {
    id: "consultation",
    name: "Paid Consultation",
    duration: "60 min",
    price: "$97",
    description: "In-depth audit, architecture review & a written roadmap.",
    url: "https://calendly.com/hngroupe/new-meeting-2",
    icon: Crown,
  },
];

export const Route = createFileRoute("/book-call")({
  head: () => ({
    meta: [
      { title: "Book a Strategy Call | HN-GROUPE" },
      {
        name: "description",
        content:
          "Pick the call that fits: free 15-min discovery, free 30-min strategy session, or a paid 60-min deep consultation. Honest advice, fixed-price quote in 24h.",
      },
      { property: "og:title", content: "Book a Call — HN-GROUPE" },
      { property: "og:description", content: "Free 15min · Free 30min · Paid 60min deep dive." },
    ],
  }),
  component: BookCallPage,
});

function BookCallPage() {
  const [selected, setSelected] = useState<MeetingType>(MEETINGS[1]);

  useEffect(() => {
    void trackEvent("book_call_view");
  }, []);

  const handleSelect = (m: MeetingType) => {
    setSelected(m);
    void trackEvent("book_call_select", { meeting: m.id });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Free or paid — your call
        </span>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
          Book a <span className="text-gradient-gold">strategy call</span>
        </h1>
        <p className="mt-5 text-muted-foreground">
          Pick the format that fits. We'll review your project, give honest feedback, and
          send a fixed-price quote within 24 hours.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {MEETINGS.map((m) => {
          const isActive = selected.id === m.id;
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => handleSelect(m)}
              className={`relative flex flex-col rounded-2xl border p-6 text-left transition-all ${
                isActive
                  ? "border-primary bg-surface/80 shadow-[var(--shadow-gold)]"
                  : "border-border bg-surface/40 hover:border-primary/40"
              }`}
            >
              {m.popular && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-[image:var(--gradient-gold)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
                  Recommended
                </span>
              )}
              <div className="flex items-center gap-3">
                <span
                  className={`grid h-10 w-10 place-items-center rounded-lg ${
                    isActive
                      ? "bg-[image:var(--gradient-gold)] text-primary-foreground"
                      : "bg-secondary text-primary"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-display text-lg font-bold">{m.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {m.duration} · {m.price}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{m.description}</p>
              <span
                className={`mt-5 inline-flex h-9 items-center justify-center rounded-md text-xs font-semibold ${
                  isActive
                    ? "bg-[image:var(--gradient-gold)] text-primary-foreground"
                    : "border border-border text-foreground"
                }`}
              >
                {isActive ? "Selected ✓" : "Choose this"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Clock, title: selected.duration, desc: "Focused & on time" },
          { icon: MessageSquare, title: "Honest advice", desc: "Even if you don't hire us" },
          { icon: Calendar, title: "Quote in 24h", desc: "Fixed price, no surprises" },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-border bg-surface/40 p-5 text-center">
            <f.icon className="mx-auto h-6 w-6 text-primary" />
            <div className="mt-2 font-semibold">{f.title}</div>
            <div className="mt-1 text-xs text-muted-foreground">{f.desc}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-primary/30 bg-surface/40">
        <div className="flex items-center justify-between border-b border-border/60 bg-background/40 px-5 py-3">
          <div>
            <div className="text-sm font-semibold">{selected.name}</div>
            <div className="text-xs text-muted-foreground">
              {selected.duration} · {selected.price}
            </div>
          </div>
          <a
            href={selected.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => void trackEvent("calendly_open_new_tab", { meeting: selected.id })}
            className="text-xs text-primary underline"
          >
            Open in new tab ↗
          </a>
        </div>
        <iframe
          key={selected.id}
          src={selected.url}
          width="100%"
          height="780"
          frameBorder="0"
          title={`Book ${selected.name}`}
          className="block w-full"
          onLoad={() => void trackEvent("calendly_loaded", { meeting: selected.id })}
        />
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Can't find a time?{" "}
        <a href="mailto:lmodirv@gmail.com" className="text-primary underline">
          Email us
        </a>{" "}
        directly.
      </p>
    </div>
  );
}
