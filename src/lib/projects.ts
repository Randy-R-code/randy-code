export interface Project {
  slug: string;
  name: string;
  type: "product" | "tool" | "client" | "experiment";
  status: "active" | "maintained" | "completed" | "experimental";
  tagline: string;
  problem: string;
  solution: string;
  result: string;
  technologies: string[];
  projectUrl?: string;
  repositoryUrl?: string;
  image?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: "liflow",
    name: "Liflow",
    type: "product",
    status: "active",
    tagline:
      "Une timeline familiale privée pour capturer, organiser, partager et redécouvrir les souvenirs qui comptent.",
    problem:
      "Aucun outil simple pour capturer et retrouver les souvenirs familiaux sans friction, sans algorithme et sans réseau social.",
    solution:
      "Application mobile-first avec timeline chronologique privée, Daily Memory automatique et récits générés par IA via Mistral.",
    result:
      "Application live et disponible sur liflow.app, en phase de croissance post-lancement.",
    technologies: ["Next.js", "TypeScript", "Mistral AI", "Mux", "Upstash"],
    projectUrl: "https://liflow.app",
    featured: true,
  },
  {
    slug: "infralens",
    name: "InfraLens",
    type: "tool",
    status: "active",
    tagline:
      "Un outil open source qui rassemble les principaux signaux techniques d'un site dans un rapport lisible.",
    problem:
      "Les développeurs et DevOps doivent jongler entre plusieurs outils pour inspecter DNS, headers HTTP et TLS d'un site.",
    solution:
      "Application web qui centralise l'analyse complète d'une URL : DNS, headers HTTP et paramètres TLS en un seul endroit.",
    result: "Outil utilisé au quotidien, disponible sur infralens.dev.",
    technologies: ["Next.js", "TypeScript", "Node.js", "Vercel"],
    projectUrl: "https://infralens.dev",
    featured: true,
  },
  {
    slug: "specialiste-automobile",
    name: "Site vitrine — Spécialiste automobile",
    type: "client",
    status: "completed",
    tagline:
      "Site vitrine optimisé SEO local pour un artisan spécialisé en reprogrammation de clés et recharge de climatisation.",
    problem:
      "Artisan spécialisé en reprogrammation de clés, calculateurs ECU et recharge de climatisation, sans présence web pour capter des clients locaux.",
    solution:
      "Site vitrine optimisé SEO local avec pages de services dédiées, fiche Google Maps et structure pensée pour le référencement sur les requêtes métier.",
    result: "Site terminé, mise en ligne imminente.",
    technologies: ["Next.js", "TypeScript", "SEO local"],
    featured: false,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

const statusLabels: Record<Project["status"], string> = {
  active: "Disponible",
  maintained: "Maintenu",
  completed: "Projet client livré",
  experimental: "Expérimentation",
};

export function statusLabel(status: Project["status"]): string {
  return statusLabels[status];
}
