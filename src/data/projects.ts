import hnchatImg from "@/assets/projects/hnchat.png";
import soukHnImg from "@/assets/projects/souk-hn.png";
import hnVideoAiImg from "@/assets/projects/hn-videoai.png";
import tangierPrintImg from "@/assets/projects/tangier-print.png";
import hnImmoImg from "@/assets/projects/hn-immo.png";
import hnDriverImg from "@/assets/projects/hn-driver.png";
import hnDevImg from "@/assets/projects/hn-dev.png";

export type ProjectCategory = "website" | "ecommerce" | "platform";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  techStack: string[];
  image: string;
  link?: string;
}

export const projects: Project[] = [
  {
    id: "hn-dev",
    title: "HN-Dev",
    description:
      "Glass control center that unites all HN Groupe digital projects — services, AI, commerce, real estate, transport — in one futuristic dashboard.",
    category: "platform",
    techStack: ["React", "TypeScript", "Tailwind", "Supabase"],
    image: hnDevImg,
    link: "https://future-hub-nexus.lovable.app",
  },
  {
    id: "hnchat",
    title: "hnChat — Super App",
    description:
      "All-in-one super app: AI chat, social networking, shopping, crypto trading and short videos in a single mobile-first experience.",
    category: "platform",
    techStack: ["React", "Realtime", "AI", "Supabase"],
    image: hnchatImg,
    link: "https://hnchat.lovable.app",
  },
  {
    id: "souk-hn",
    title: "Souk-HN Express",
    description:
      "Multi-vendor e-commerce marketplace with same-day delivery, multi-currency checkout and full seller dashboard.",
    category: "ecommerce",
    techStack: ["React", "Node.js", "Stripe", "PostgreSQL"],
    image: soukHnImg,
    link: "https://souk-hn.lovable.app",
  },
  {
    id: "hn-immo",
    title: "HN Immo",
    description:
      "Next-gen real-estate platform for Morocco with AI search, interactive maps, mortgage simulator and 5,000+ verified listings.",
    category: "platform",
    techStack: ["React", "Mapbox", "AI", "Supabase"],
    image: hnImmoImg,
    link: "https://hn-immobiler.lovable.app",
  },
  {
    id: "hn-driver",
    title: "HN Driver",
    description:
      "Ride-hailing & delivery platform for Tangier — private rides, express deliveries and restaurant orders in one app.",
    category: "platform",
    techStack: ["React Native", "Maps", "Realtime", "Node.js"],
    image: hnDriverImg,
    link: "https://smooth-route-guide.lovable.app",
  },
  {
    id: "tangier-print",
    title: "Imprimerie Tanger HN",
    description:
      "Premium website for a Tangier print shop with online quote requests, product catalog and full e-commerce store.",
    category: "website",
    techStack: ["React", "Tailwind", "Supabase", "i18n"],
    image: tangierPrintImg,
    link: "https://tangier-print-hub.lovable.app",
  },
  {
    id: "hn-videoai",
    title: "HN Video AI",
    description:
      "AI studio that turns text into professional videos and images — a futuristic creative platform for content creators.",
    category: "platform",
    techStack: ["React", "AI Gateway", "Edge Functions"],
    image: hnVideoAiImg,
    link: "https://hn-videoai.lovable.app",
  },
];
