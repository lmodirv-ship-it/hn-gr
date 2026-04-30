import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle2, Calendar, MessageCircle } from "lucide-react";
import { trackEvent } from "@/hooks/use-track-event";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Thank you — Your request was received | HN-GROUPE" },
      { name: "description", content: "We received your request and will reply within 24 hours." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  useEffect(() => {
    void trackEvent("thank_you_view");
  }, []);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-primary">
        <CheckCircle2 className="h-9 w-9" />
      </div>
      <h1 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
        You're <span className="text-gradient-gold">in good hands</span>
      </h1>
      <p className="mt-4 text-muted-foreground">
        Your request was received. We'll review it and reply within 24 hours with a fixed-price
        quote and next steps.
      </p>

      <div className="mt-10 grid w-full gap-3 sm:grid-cols-2">
        <Link
          to="/book-call"
          onClick={() => void trackEvent("cta_click", { cta: "thankyou_book" })}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-surface/40 p-5 text-sm font-semibold hover:border-primary"
        >
          <Calendar className="h-5 w-5 text-primary" />
          Skip the wait — book a call now
        </Link>
        <Link
          to="/portfolio"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface/40 p-5 text-sm font-semibold hover:border-primary/40"
        >
          <MessageCircle className="h-5 w-5 text-primary" />
          See our past work
        </Link>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        Tip: add <span className="text-foreground">lmodirv@gmail.com</span> to your contacts so our reply doesn't land in spam.
      </p>
    </div>
  );
}
