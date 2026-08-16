import { Braces, Clock, type LucideIcon, ScanSearch } from "lucide-react";

export interface ToolEntry {
  slug: string;
  name: string;
  status: string;
  description: string;
  href: string;
  caseStudyHref?: string;
  logo?: { src: string; alt: string };
  icon?: LucideIcon;
}

export const tools: ToolEntry[] = [
  {
    slug: "infralens",
    name: "InfraLens",
    status: "Disponible",
    description:
      "Outil open source d'inspection technique de sites web : DNS, TLS, headers HTTP et sécurité, infrastructure, robots.txt et sitemap, en un seul rapport lisible.",
    href: "/tools/infralens",
    caseStudyHref: "/projects/infralens",
    logo: { src: "/infralens/brand/logo-symbol.png", alt: "" },
  },
  {
    slug: "cron-builder",
    name: "Cron Builder",
    status: "Disponible",
    description:
      "Construisez, validez et comprenez des expressions cron grâce à un éditeur visuel et un aperçu des prochaines exécutions.",
    href: "/tools/cron-builder",
    icon: Clock,
  },
  {
    slug: "json-studio",
    name: "JSON Studio",
    status: "Disponible",
    description:
      "Formatez, validez et explorez du JSON instantanément grâce à un éditeur, une vue arborescente et des statistiques utiles.",
    href: "/tools/json-studio",
    icon: Braces,
  },
  {
    slug: "metalens",
    name: "MetaLens",
    status: "Disponible",
    description:
      "Inspectez rapidement les métadonnées SEO et sociales d'une page web : titre, Open Graph, Twitter Cards, canonical et robots.",
    href: "/tools/metalens",
    icon: ScanSearch,
  },
];
