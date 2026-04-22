import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { BackgroundFX } from "@/components/effects/BackgroundFX";
import { SoundController } from "@/components/effects/SoundController";
import { Toaster } from "@/components/ui/sonner";
import { PageViewTracker } from "@/hooks/use-track-event";
import { WhatsAppButton } from "@/components/growth/WhatsAppButton";
import { StickyCTA } from "@/components/growth/StickyCTA";
import { ExitIntentModal } from "@/components/growth/ExitIntentModal";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-[image:var(--gradient-gold)] px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HN-groupe — Smart software & web solutions" },
      {
        name: "description",
        content:
          "HN-groupe builds modern websites, e-commerce stores, and custom web platforms. Describe your idea to our AI assistant and get a project plan in seconds.",
      },
      { name: "author", content: "HN-groupe" },
      { property: "og:title", content: "HN-groupe — Smart software & web solutions" },
      {
        property: "og:description",
        content:
          "Websites, e-commerce, and custom platforms — designed and built by HN-groupe.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "HN-groupe — Smart software & web solutions" },
      { name: "twitter:description", content: "HN-groupe is a software and web solutions studio website showcasing services and projects." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/g9dYUUMiwpd1WQjB2jpPGmqKT172/social-images/social-1776539517041-hn-groupe.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/g9dYUUMiwpd1WQjB2jpPGmqKT172/social-images/social-1776539517041-hn-groupe.webp" },
      { name: "description", content: "HN-groupe is a software and web solutions studio website showcasing services and projects." },
      { property: "og:description", content: "HN-groupe is a software and web solutions studio website showcasing services and projects." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "HN-GROUPE",
          url: "https://hn-gr.lovable.app",
          logo: "https://hn-gr.lovable.app/favicon.ico",
          description:
            "Digital studio building websites, e-commerce stores, and custom SaaS platforms.",
          sameAs: [],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <BackgroundFX />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
      <WhatsAppButton />
      <StickyCTA />
      <ExitIntentModal />
      <SoundController />
      <Toaster richColors position="top-center" />
      <PageViewTracker />
    </div>
  );
}
