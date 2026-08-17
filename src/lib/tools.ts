import { Braces, Clock, type LucideIcon, ScanSearch, Send } from "lucide-react";

export type ToolCategory = "web-api" | "developer-utilities";

export interface ToolEntry {
  slug: string;
  name: string;
  status: string;
  description: string;
  href: string;
  category: ToolCategory;
  caseStudyHref?: string;
  logo?: { src: string; alt: string };
  icon?: LucideIcon;
}

export const TOOL_CATEGORY_LABELS: Record<ToolCategory, string> = {
  "web-api": "Web & API",
  "developer-utilities": "Developer Utilities",
};

// Order doubles as the footer's flat tool list (site-footer.tsx maps this
// array as-is) — keep it InfraLens, API Studio, MetaLens, JSON Studio, Cron
// Builder so both places stay in sync without separate ordering config.
export const tools: ToolEntry[] = [
  {
    slug: "infralens",
    name: "InfraLens",
    status: "Disponible",
    description:
      "Outil open source d'inspection technique de sites web : DNS, TLS, headers HTTP et sécurité, infrastructure, robots.txt et sitemap, en un seul rapport lisible.",
    href: "/tools/infralens",
    category: "web-api",
    caseStudyHref: "/projects/infralens",
    logo: { src: "/infralens/brand/logo-symbol.png", alt: "" },
  },
  {
    slug: "api-studio",
    name: "API Studio",
    status: "Disponible",
    description:
      "Construisez, envoyez et inspectez des requêtes HTTP directement depuis le navigateur, avec historique local et génération de code fetch/curl.",
    href: "/tools/api-studio",
    category: "web-api",
    icon: Send,
  },
  {
    slug: "metalens",
    name: "MetaLens",
    status: "Disponible",
    description:
      "Inspectez rapidement les métadonnées SEO et sociales d'une page web : titre, Open Graph, Twitter Cards, canonical et robots.",
    href: "/tools/metalens",
    category: "web-api",
    icon: ScanSearch,
  },
  {
    slug: "json-studio",
    name: "JSON Studio",
    status: "Disponible",
    description:
      "Formatez, validez et explorez du JSON instantanément grâce à un éditeur, une vue arborescente et des statistiques utiles.",
    href: "/tools/json-studio",
    category: "developer-utilities",
    icon: Braces,
  },
  {
    slug: "cron-builder",
    name: "Cron Builder",
    status: "Disponible",
    description:
      "Construisez, validez et comprenez des expressions cron grâce à un éditeur visuel et un aperçu des prochaines exécutions.",
    href: "/tools/cron-builder",
    category: "developer-utilities",
    icon: Clock,
  },
];
