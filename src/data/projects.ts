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
    id: "atlas-realty",
    title: "Atlas Realty",
    description: "Modern real-estate marketing website with map search and lead capture.",
    category: "website",
    techStack: ["Next.js", "Tailwind CSS", "Mapbox"],
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "noor-store",
    title: "Noor Store",
    description: "Premium fashion e-commerce with multi-currency checkout and wishlists.",
    category: "ecommerce",
    techStack: ["React", "Stripe", "PostgreSQL"],
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "medix-platform",
    title: "Medix Platform",
    description: "Doctor–patient SaaS for booking, telemedicine, and electronic records.",
    category: "platform",
    techStack: ["TypeScript", "Node.js", "WebRTC"],
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "voltride",
    title: "VoltRide",
    description: "Direct-to-consumer storefront for an e-bike brand with product configurator.",
    category: "ecommerce",
    techStack: ["Next.js", "Shopify", "Three.js"],
    image:
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "edulink",
    title: "EduLink",
    description: "Online learning platform with live classes, assignments, and progress tracking.",
    category: "platform",
    techStack: ["React", "Supabase", "Stripe"],
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "harbor-studio",
    title: "Harbor Studio",
    description: "Portfolio site for an architecture studio with editorial case studies.",
    category: "website",
    techStack: ["Astro", "Tailwind CSS", "Sanity"],
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "freshly",
    title: "Freshly Market",
    description: "Online grocery with same-day delivery slots and live order tracking.",
    category: "ecommerce",
    techStack: ["Next.js", "Node.js", "Redis"],
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "fleetops",
    title: "FleetOps",
    description: "Logistics platform for fleet tracking, dispatch, and driver mobile app.",
    category: "platform",
    techStack: ["React", "Go", "PostGIS"],
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=70",
  },
];
