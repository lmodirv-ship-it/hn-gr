import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Calendar, Clock, MessageSquare } from "lucide-react";
import { trackEvent } from "@/hooks/use-track-event";

// TODO: replace with your real Calendly link
const CALENDLY_URL = "https://calendly.com/hngroupe/new-meeting-2";

export const Route = createFileRoute("/book-call")({
  head: () => ({
    meta: [
      { title: "Book a Free 15-min Strategy Call | HN-GROUPE" },
      {
        name: "description",
        content:
          "Book a free 15-minute consultation. We'll review your project, give honest feedback, and a fixed-price quote within 24 hours. No pressure, no spam.",
      },
      { property: "og:title", content: "Book a Free Strategy Call — HN-GROUPE" },
      { property: "og:description", content: "15 minutes. Honest advice. Fixed quote in 24h." },
    ],
  }),
  component: BookCallPage,
});

function BookCallPage() {
  useEffect(() => {
    void trackEvent("book_call_view");
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Free consultation
        </span>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
          Book a <span className="text-gradient-gold">free 15-min call</span>
        </h1>
        <p className="mt-5 text-muted-foreground">
          Pick a time that works. We'll review your project, give honest feedback, and send a
          fixed-price quote within 24 hours of our chat.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Clock, title: "15 minutes", desc: "Quick, focused, valuable" },
          { icon: MessageSquare, title: "Honest advice", desc: "Even if you don't hire us" },
          { icon: Calendar, title: "Free quote in 24h", desc: "Fixed price, no surprises" },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-border bg-surface/40 p-5 text-center">
            <f.icon className="mx-auto h-6 w-6 text-primary" />
            <div className="mt-2 font-semibold">{f.title}</div>
            <div className="mt-1 text-xs text-muted-foreground">{f.desc}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-primary/30 bg-surface/40">
        <iframe
          src={CALENDLY_URL}
          width="100%"
          height="780"
          frameBorder="0"
          title="Book a call"
          className="block w-full"
          onLoad={() => void trackEvent("calendly_loaded")}
        />
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Can't find a time? <a href="mailto:lmodirv@gmail.com" className="text-primary underline">Email us</a> directly.
      </p>
    </div>
  );
}
