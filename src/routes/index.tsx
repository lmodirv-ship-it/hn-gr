import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustedBySection } from "@/components/home/TrustedBySection";
import { MissionSection } from "@/components/home/MissionSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/services/ServicesSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { TechStackSection } from "@/components/home/TechStackSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HN-GROUPE — Smart software & web solutions for your business" },
      {
        name: "description",
        content:
          "We design and build websites, e-commerce stores, and custom web platforms. Get an AI-powered project plan in minutes.",
      },
      { property: "og:title", content: "HN-GROUPE — Smart software & web solutions" },
      {
        property: "og:description",
        content:
          "Modern websites, online stores, and SaaS platforms — built by a senior team.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <HeroSection />
      <TrustedBySection />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Selected work
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
              Recent projects we're <span className="text-gradient-gold">proud of</span>.
            </h2>
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10">
          <PortfolioGrid limit={6} showFilters={false} />
        </div>
      </section>

      <TechStackSection />
      <TestimonialsSection />
      <HowItWorks />
      <FAQSection />
      <CTASection />
    </>
  );
}
