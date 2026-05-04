import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
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
import { PricingSection } from "@/components/home/PricingSection";
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
  const { t } = useTranslation();
  return (
    <>
      <HeroSection />
      <PricingSection />
      <TrustedBySection />
      <MissionSection />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              {t("portfolio.eyebrow")}
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
              {t("portfolio.title.before")} <span className="text-gradient-gold">{t("portfolio.title.highlight")}</span>.
            </h2>
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            {t("portfolio.viewAll")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
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
