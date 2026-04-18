import {
  Globe,
  ShoppingBag,
  LayoutDashboard,
  Palette,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface Service {
  id: string;
  title: string;
  short: string;
  description: string;
  includes: string[];
  benefits: string[];
  icon: LucideIcon;
}

export const services: Service[] = [
  {
    id: "websites",
    title: "Website development",
    short: "Fast, SEO-ready marketing & corporate sites.",
    description:
      "Conversion-focused websites built on modern stacks, optimized for performance and search.",
    includes: [
      "Up to 10 custom pages",
      "Responsive design (mobile-first)",
      "SEO setup & sitemap",
      "Analytics integration",
    ],
    benefits: ["Better Google ranking", "Higher conversion rates", "Easy to update"],
    icon: Globe,
  },
  {
    id: "ecommerce",
    title: "E-commerce stores",
    short: "Online stores that turn visitors into customers.",
    description:
      "Custom e-commerce experiences with secure payments, inventory, and a smooth checkout.",
    includes: [
      "Product catalog & search",
      "Cart, checkout & payments",
      "Order & inventory dashboard",
      "Coupons & promotions",
    ],
    benefits: ["Sell 24/7", "Lower cart abandonment", "Scale from 10 to 10k SKUs"],
    icon: ShoppingBag,
  },
  {
    id: "platforms",
    title: "Custom platforms & web apps",
    short: "Tailor-made SaaS, dashboards, and internal tools.",
    description:
      "We design and build complex platforms — from MVP to scaled product — with clean architecture.",
    includes: [
      "Auth, roles & permissions",
      "Real-time features",
      "API & integrations",
      "Admin dashboards",
    ],
    benefits: ["Replace messy spreadsheets", "Automate operations", "Own your tech"],
    icon: LayoutDashboard,
  },
  {
    id: "design",
    title: "UI / UX design",
    short: "Interfaces that feel as good as they look.",
    description:
      "Research-led product design, design systems, and high-fidelity prototypes ready for dev.",
    includes: [
      "User research & flows",
      "Wireframes & prototypes",
      "Design system in Figma",
      "Handoff to developers",
    ],
    benefits: ["Clear user journeys", "Consistent brand", "Faster development"],
    icon: Palette,
  },
  {
    id: "maintenance",
    title: "Maintenance & upgrades",
    short: "Keep your product fast, secure, and evolving.",
    description:
      "Ongoing support, performance tuning, and feature upgrades for existing websites and apps.",
    includes: [
      "Bug fixes & monitoring",
      "Security patches",
      "Performance optimization",
      "New feature rollout",
    ],
    benefits: ["Less downtime", "Stay secure", "Grow without rebuilding"],
    icon: Wrench,
  },
];
