import { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "How long does a typical project take?",
    a: "A landing page ships in 1-2 weeks. A full website or e-commerce store takes 4-6 weeks. Custom platforms and SaaS MVPs typically run 6-12 weeks depending on scope.",
  },
  {
    q: "How much does it cost?",
    a: "Starter websites begin around €2,500. E-commerce stores from €6,000. Custom platforms are scoped per project. We always provide a fixed quote before starting.",
  },
  {
    q: "Do you work with non-technical founders?",
    a: "Absolutely. Most of our clients are non-technical. We translate business goals into technical decisions and explain trade-offs in plain language.",
  },
  {
    q: "What happens after launch?",
    a: "We offer monthly maintenance plans covering hosting, security patches, performance monitoring, and feature additions. You stay in control — we handle the heavy lifting.",
  },
  {
    q: "Do I own the code and design?",
    a: "100%. Everything we build belongs to you — code, design files, content, hosting accounts. No vendor lock-in, ever.",
  },
  {
    q: "Can you redesign my existing site or app?",
    a: "Yes — we audit, redesign, and rebuild legacy products regularly. We preserve SEO, migrate data carefully, and ship the new version with zero downtime.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          FAQ
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
          Questions, <span className="text-gradient-gold">answered</span>.
        </h2>
      </div>

      <div className="mt-12 space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.q}
              className={
                "glass overflow-hidden rounded-xl transition-all duration-300 " +
                (isOpen ? "border-primary/40" : "")
              }
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-display text-base font-semibold sm:text-lg">
                  {f.q}
                </span>
                <Plus
                  className={
                    "h-5 w-5 shrink-0 text-primary transition-transform duration-300 " +
                    (isOpen ? "rotate-45" : "")
                  }
                />
              </button>
              <div
                className={
                  "grid transition-all duration-300 " +
                  (isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")
                }
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
