export interface ToolEntry {
  slug: string;
  name: string;
  status: string;
  description: string;
  href: string;
  caseStudyHref?: string;
  logo?: { src: string; alt: string };
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
  },
  {
    slug: "json-studio",
    name: "JSON Studio",
    status: "Disponible",
    description:
      "Formatez, validez et explorez du JSON instantanément grâce à un éditeur, une vue arborescente et des statistiques utiles.",
    href: "/tools/json-studio",
  },
];
