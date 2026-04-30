import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, ShoppingCart, CreditCard, Truck } from "lucide-react";
import { trackEvent } from "@/hooks/use-track-event";

export const Route = createFileRoute("/ecommerce")({
  head: () => ({
    meta: [
      { title: "E-commerce Development — Online Stores that Sell | HN-GROUPE" },
      {
        name: "description",
        content:
          "Custom online stores built to maximize sales. Stripe & PayPal ready, mobile-optimized, SEO-friendly. Launch your shop in weeks. Free consultation.",
      },
      { property: "og:title", content: "E-commerce Development — Online Stores that Sell" },
      {
        property: "og:description",
        content:
          "Custom online stores with Stripe payments, inventory, and conversion-optimized checkout. Launch in weeks.",
      },
      { name: "keywords", content: "ecommerce development, online store, shopify alternative, stripe checkout, custom shop" },
    ],
  }),
  component: EcommercePage,
});

function EcommercePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          E-commerce
        </span>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-6xl">
          Online stores that <span className="text-gradient-gold">actually sell</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          From single-product launches to full catalogs — we build conversion-optimized e-commerce
          stores with payments, shipping, and analytics out of the box.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/start-project"
            search={{ projectType: "E-commerce" }}
            onClick={() => void trackEvent("cta_click", { cta: "ecommerce_hero" })}
            className="inline-flex h-12 items-center gap-2 rounded-md bg-[image:var(--gradient-gold)] px-7 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)]"
          >
            Launch my store <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/book-call" className="glass inline-flex h-12 items-center justify-center rounded-md px-7 text-sm font-semibold">
            Book free strategy call
          </Link>
        </div>
      </div>

      <div className="mt-20 grid gap-6 md:grid-cols-3">
        {[
          { icon: ShoppingCart, title: "Optimized checkout", desc: "One-page checkout, abandoned-cart recovery, upsells. Built to maximize AOV." },
          { icon: CreditCard, title: "Payments ready", desc: "Stripe, PayPal, local methods. Multi-currency, tax handling, subscriptions." },
          { icon: Truck, title: "Logistics built-in", desc: "Inventory tracking, shipping rules, order management dashboard." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-surface/40 p-7">
            <f.icon className="h-8 w-8 text-primary" />
            <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>

      <section className="mt-20 rounded-3xl border border-primary/30 bg-surface/40 p-10">
        <h2 className="font-display text-3xl font-bold">Everything included</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {[
            "Custom storefront design",
            "Up to 50 products at launch",
            "Stripe / PayPal integration",
            "Admin dashboard for orders & inventory",
            "Email receipts + abandoned cart",
            "SEO product pages + sitemap",
            "Mobile-first checkout flow",
            "Analytics + Facebook/Google pixel",
          ].map((f) => (
            <div key={f} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{f}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-between gap-4 border-t border-border/50 pt-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Starting at</div>
            <div className="font-display text-3xl font-bold">$3,900</div>
          </div>
          <Link
            to="/start-project"
            search={{ projectType: "E-commerce" }}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-[image:var(--gradient-gold)] px-6 text-sm font-semibold text-primary-foreground"
          >
            Get a custom quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
