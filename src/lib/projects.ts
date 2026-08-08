export interface ProjectCaseStudy {
  context: string;
  objectives: string;
  role: string;
  solution: string;
  architecture: string;
  technicalChoices: string;
  difficulties: string;
  security: string;
  learnings: string;
}

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
  caseStudy?: ProjectCaseStudy;
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
    caseStudy: {
      context:
        'Liflow a démarré comme un SaaS de partage classique, pensé autour de "capsules" (notes, fichiers, événements partagés par groupe). En devenant père, je me suis retrouvé avec des centaines de photos et de souvenirs dispersés, jamais revisités — ce changement personnel a déclenché une refonte complète du produit, avec la sortie de Next.js 16 comme fenêtre technique pour tout reconstruire.',
      objectives:
        "Recentrer Liflow sur une idée unique : garder les moments qui comptent. Pas de dashboard, pas de modules, pas d'options cachées — une application qu'on a envie d'ouvrir, pensée pour l'émotion plutôt que pour la fonctionnalité.",
      role: "Je conçois, développe et maintiens Liflow seul, de l'architecture à l'interface, y compris la refonte complète du produit.",
      solution:
        "Liflow organise la vie de famille autour du Moment (date, titre, texte, photos ou vidéos), regroupés dans une timeline privée par mois. Chaque jour, un Daily Memory fait remonter un souvenir passé au hasard. Un récit mensuel est généré automatiquement par IA (Mistral) à partir des moments du mois, diffusé en streaming. Les moments peuvent être partagés via un lien public révocable, retrouvés par recherche floue (Cmd+K) ou par tags, et commentés/réagis en famille. Notifications push et préférences email tiennent chacun informé sans être intrusif.",
      architecture:
        "Next.js (App Router) et TypeScript, Prisma et PostgreSQL pour les données. Photos et fichiers sur un stockage compatible S3, servis via des URLs présignées. Vidéos via Mux (HLS, tokens signés). Authentification par Better Auth, en mode multi-tenant. Tâches différées (email de bienvenue, diffusion des notifications push) sur Inngest, emails transactionnels via Resend. Le paiement (Stripe) est prêt dans le code, mais Liflow reste gratuit pour l'instant.",
      technicalChoices:
        "Modèle multi-tenant par organisation : chaque organisation représente une famille, avec des rôles (propriétaire, admin, contributeur, membre) et un cloisonnement strict des données. Plusieurs membres d'une même famille collaborent sur la même timeline sans qu'aucune donnée ne fuite vers une autre famille.",
      difficulties:
        'La première version était trop ambitieuse (capsules, partage multi-usage, IA un peu partout) — le produit devenait une plateforme complète, pas une expérience. J\'ai dû "jeter la moitié" du SaaS existant pour recentrer sur une idée forte : ajouter des fonctionnalités est facile, construire une expérience simple et cohérente est bien plus difficile.',
      security:
        "Privé par défaut : aucun contenu public, aucun algorithme de recommandation, aucun réseau social. Données isolées par organisation. Seul mécanisme de partage externe : un lien public révocable par moment, désactivable à tout moment par son créateur.",
      learnings:
        "Cette refonte m'a appris à ralentir : prendre le temps de réfléchir à l'architecture et à l'utilité réelle d'une fonctionnalité avant de coder. Elle a confirmé mon goût pour la construction de projets de A à Z, seul, en soignant les détails plutôt qu'en livrant quelque chose de bancal.",
    },
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
