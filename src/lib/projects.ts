export interface ProjectCaseStudy {
  context?: string;
  objectives?: string;
  role?: string;
  solution?: string;
  architecture?: string;
  technicalChoices?: string;
  difficulties?: string;
  security?: string;
  learnings?: string;
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
    result: "Outil utilisé au quotidien, intégré nativement à Randy Code.",
    technologies: ["Next.js", "TypeScript", "Node.js", "Vercel"],
    projectUrl: "https://randy-code.dev/tools/infralens",
    featured: true,
    caseStudy: {
      context:
        "InfraLens est né du besoin de vérifier rapidement la configuration technique d'un site (DNS, sécurité, headers) sans jongler entre plusieurs outils différents. Conçu et maintenu en solo, en parallèle de projets clients, comme outil gratuit et open source plutôt que comme produit commercial.",
      objectives:
        "Donner une vue lisible et rapide de la configuration technique publique d'un site, sans devenir un scanner de sécurité certifié, un outil de pentest ou une plateforme de monitoring commerciale. Rester gratuit, sans compte, open source.",
      role: "Je conçois, développe et maintiens InfraLens seul, du moteur d'analyse à l'interface.",
      solution:
        "InfraLens exécute 20 checks indépendants répartis en 6 catégories (HTTP & Sécurité, Réseau & DNS, Infrastructure, Structure du site, Métadonnées & Stack, Signaux de performance), tous en parallèle côté serveur. Chaque check a un statut (Pass/Warning/Fail/Info/Inconclusive/Unavailable/Error), un score pondéré par check et une note globale de A à E. Résultats exportables en JSON ou Markdown, comparaison entre deux analyses, historique des 10 dernières analyses conservé localement dans le navigateur.",
      architecture:
        "Next.js 16 (App Router), TypeScript strict. Chaque check est un module indépendant et testable implémentant une interface commune, exécuté via Server Action avec un timeout de 8 secondes — l'échec d'un check n'interrompt pas les autres. Résolution DNS native (Node.js dns/promises) avec cache en mémoire, extraction de liens via Cheerio, lookup IP/ASN optionnel via ipapi.co. Interface en Tailwind CSS et shadcn/ui.",
      technicalChoices:
        "Scoring pondéré par catégorie (25 points HTTP & Sécurité, 20 Réseau & DNS, 20 Infrastructure, 15 Structure, 10 Métadonnées, 10 Performance), avec des multiplicateurs de statut (100% du poids si OK, 60% si Warning, 0% si Error) — transparent plutôt que boîte noire. Rate limiting (1 analyse par IP toutes les 30 secondes) pour protéger le service et les résolveurs DNS.",
      security:
        "Analyse passive uniquement, aucune exploitation ni scan intrusif. Pas de compte utilisateur, aucune donnée personnelle collectée. Historique stocké uniquement en local, pas de backend de stockage.",
      learnings:
        "Garder InfraLens simple, gratuit et transparent demande de la discipline : résister à la tentation d'ajouter des fonctionnalités qui le feraient glisser vers un SaaS ou un outil de pentest commercial, alors que ce n'est ni son objectif ni son positionnement.",
    },
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
    caseStudy: {
      context:
        "Un artisan itinérant, sans présence web, alors que ses clients potentiels cherchent d'abord sur Google avant d'appeler — une grande partie de la demande locale lui échappait faute d'être trouvable en ligne.",
      role: "Conception et développement du site de A à Z, en autonomie complète, du cahier des charges à la mise en production.",
      architecture:
        "Next.js avec rendu statique (SSG) pour la vitesse de chargement et le référencement, Prisma et PostgreSQL pour le contenu des pages de service, déploiement sur Vercel, formulaire de contact via Resend.",
    },
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
