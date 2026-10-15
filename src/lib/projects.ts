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
  status: "active" | "maintained" | "completed" | "experimental" | "beta";
  tagline: string;
  problem: string;
  solution: string;
  result: string;
  technologies: string[];
  projectUrl?: string;
  repositoryUrl?: string;
  image?: string;
  logo?: { src: string; alt: string };
  openSource?: boolean;
  featured: boolean;
  caseStudy?: ProjectCaseStudy;
  relatedArticleSlug?: string;
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
    logo: { src: "/projects/logos/liflow.png", alt: "" },
    featured: true,
    relatedArticleSlug: "liflow-refonte-souvenirs-familiaux",
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
    logo: { src: "/infralens/brand/logo-symbol.png", alt: "" },
    openSource: true,
    featured: true,
    relatedArticleSlug: "securiser-analyseur-url-contre-ssrf",
    caseStudy: {
      context:
        "InfraLens est né du besoin de vérifier rapidement la configuration technique d'un site (DNS, sécurité, headers) sans jongler entre plusieurs outils différents. Conçu et maintenu en solo, en parallèle de projets clients, comme outil gratuit et open source plutôt que comme produit commercial.",
      objectives:
        "Donner une vue lisible et rapide de la configuration technique publique d'un site, sans devenir un scanner de sécurité certifié, un outil de pentest ou une plateforme de monitoring commerciale. Rester gratuit, sans compte, open source.",
      role: "Je conçois, développe et maintiens InfraLens seul, du moteur d'analyse à l'interface.",
      solution:
        "InfraLens exécute 20 checks indépendants répartis en 6 catégories (HTTP & Sécurité, Réseau & DNS, Infrastructure, Structure du site, Métadonnées & Stack, Signaux de performance), via un pool à concurrence bornée côté serveur (jusqu'à 6 checks simultanés). Chaque check a un statut (Pass/Warning/Fail/Info/Inconclusive/Unavailable/Error), un score pondéré par check et une note globale de A à E. Résultats exportables en JSON ou Markdown, comparaison entre deux analyses, historique des 10 dernières analyses conservé localement dans le navigateur.",
      architecture:
        "Next.js 16 (App Router), TypeScript strict. Chaque check est un module indépendant et testable implémentant une interface commune, exécuté via Server Action avec un timeout de 8 secondes — l'échec d'un check n'interrompt pas les autres. Résolution DNS native (Node.js dns/promises) avec cache en mémoire, extraction de liens via Cheerio, lookup IP/ASN optionnel via ipapi.co. Interface en Tailwind CSS et shadcn/ui.",
      technicalChoices:
        "Scoring pondéré par catégorie (45 points HTTP & Sécurité, 14 Réseau & DNS, 17 Métadonnées & Stack, 13 Signaux de performance, 11 Structure du site ; Infrastructure est informationnelle, poids 0), avec des multiplicateurs de statut (100% du poids si OK, 60% si Warning, 0% si Error) — transparent plutôt que boîte noire. Rate limiting par IP via Upstash (5 requêtes/minute, 30/heure) pour protéger le service et les résolveurs DNS.",
      security:
        "Analyse passive uniquement, aucune exploitation ni scan intrusif. Pas de compte utilisateur ; l'IP n'est utilisée que comme clé de rate limiting (Upstash), jamais comme donnée de suivi. Historique stocké uniquement en local, pas de backend de stockage.",
      learnings:
        "Garder InfraLens simple, gratuit et transparent demande de la discipline : résister à la tentation d'ajouter des fonctionnalités qui le feraient glisser vers un SaaS ou un outil de pentest commercial, alors que ce n'est ni son objectif ni son positionnement.",
    },
  },
  {
    slug: "flonexa",
    name: "Flonexa",
    type: "product",
    status: "beta",
    tagline:
      "Un briefing sportif personnalisé qui réunit calendrier, classements et actus résumées par IA, pour le tennis et la Formule 1.",
    problem:
      "Suivre le tennis et la Formule 1 oblige à jongler entre plusieurs sites et applications, sans jamais avoir une vue synthétique de ce qui compte vraiment chaque jour.",
    solution:
      "Application qui centralise calendrier en direct, classements ATP/WTA et F1, et actus résumées par IA toujours reliées à leur source originale, personnalisées selon les favoris (joueurs, écuries).",
    result:
      "Application web disponible sur flonexa.app, gratuite ; application Android en test fermé sur Google Play avant sa publication.",
    technologies: [
      "TanStack Start",
      "React",
      "TypeScript",
      "Convex",
      "Mistral AI",
    ],
    projectUrl: "https://flonexa.app",
    logo: { src: "/projects/logos/flonexa.png", alt: "" },
    featured: true,
    caseStudy: {
      context:
        "Suivre le tennis et la Formule 1 oblige à ouvrir plusieurs sites et applications, chacun noyé dans un flux d'informations qui ne concerne pas vraiment ce qu'on suit. Flonexa part d'un besoin simple : savoir en deux minutes, chaque matin, ce qui compte pour les joueurs et les écuries qu'on suit déjà.",
      objectives:
        "Un briefing, pas un flux. Pas de score en direct point par point, pas de forum, pas de notification insistante : une page Today construite autour des favoris de chacun, rapide à lire, qu'on rouvre le lendemain parce qu'elle valait le coup.",
      role: "Je conçois, développe et maintiens Flonexa seul : pipeline de données, backend, application web et application mobile.",
      solution:
        "Flonexa croise des données structurées (calendrier, résultats, classements ATP/WTA et F1) et des actus résumées par IA, regroupées en Stories toujours reliées à leur source d'origine. L'utilisateur choisit ses joueurs et ses écuries ; la page Today ne montre que ce qui les concerne. Le tout est gratuit, en français, sur le web et sur Android.",
      architecture:
        "Un backend Convex partagé entre une application web TanStack Start et une application mobile Expo, avec Better Auth pour la connexion par code email. Les données sont récupérées par des tâches planifiées dont la fréquence suit la volatilité de chaque source (calendrier F1 toutes les 12 h, résultats toutes les 3 h, actus toutes les 30 min). Chaque fournisseur reste derrière un adaptateur : aucun format externe n'atteint l'interface.",
      technicalChoices:
        "Le pipeline va de la source brute à la Story : normalisation, classification par sport et par entité, déduplication, résumé par Mistral, puis personnalisation. La Story, et non l'article d'éditeur, est l'objet affiché. Les quotas gratuits des fournisseurs ont dicté les cadences de synchronisation plutôt que l'inverse.",
      difficulties:
        "Les offres gratuites de données sportives sont limitées : couverture partielle, quotas serrés, résultats parfois incomplets. J'ai dû accepter un périmètre volontairement réduit (un briefing, pas un Flashscore) et concevoir l'application pour dégrader proprement quand une donnée manque.",
      security:
        "Résumés toujours attribués : l'IA synthétise, elle n'invente ni faits ni scores, et la source d'origine reste visible sur chaque Story. Authentification par code email, données utilisateur limitées aux favoris et au compte.",
      learnings:
        "Un produit de briefing se juge à ce qu'il retire. Chaque fois que j'ai résisté à l'envie d'ajouter un flux ou une statistique, l'application est devenue plus claire. Et traiter la source comme une partie du produit, pas comme une note de bas de page, change la confiance qu'on peut lui accorder.",
    },
  },
  {
    slug: "kidarys",
    name: "Kidarys",
    type: "product",
    status: "beta",
    tagline:
      "Le lien quotidien entre parents et personnes qui gardent leur enfant : une vue calme de la journée, sur mobile et sur le web.",
    problem:
      "Les informations importantes de la journée d'un enfant (repas, sommeil, activités, consignes, changements d'organisation) se perdent entre messages, échanges oraux et habitudes difficiles à suivre, ce qui casse la continuité entre les parents et la personne qui le garde.",
    solution:
      "Une expérience centrée sur l'enfant, avec une interface pour les parents et une pour la personne en charge de la garde : un fil du jour où le prévu et le réel vivent ensemble, un calendrier des jours de garde, des messages et des photos. Mobile et web sont synchronisés, sur une architecture qui gère les familles et leurs membres.",
    result:
      "Application web disponible sur kidarys.com ; application Android en test fermé sur Google Play avant sa publication.",
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "TanStack Start",
      "Convex",
    ],
    projectUrl: "https://kidarys.com",
    logo: { src: "/projects/logos/kidarys.png", alt: "" },
    featured: true,
    caseStudy: {
      context:
        "Quand on confie un enfant, la journée se raconte par morceaux : un message le midi, un mot sur un papier, un récit oral le soir. Les parents veulent savoir comment s'est passée la journée sans avoir à demander ; la personne qui garde n'a pas le temps de tout rédiger. Kidarys est né de cet écart.",
      objectives:
        "Remplacer le mélange de SMS, de papiers et de récits oraux par une seule vue partagée. Règle produit : chaque fonctionnalité doit apporter plus de valeur au parent qu'elle ne coûte d'effort à la personne qui garde. Kidarys n'est ni un outil de paie, ni un baby tracker obsédé par les statistiques, ni un logiciel de crèche.",
      role: "Je conçois, développe et maintiens Kidarys seul : produit, design, backend, application web et application mobile.",
      solution:
        "Trois surfaces autour de l'enfant : Today (le prévu et le réel d'une même journée), un calendrier (jours de garde, historique) et des messages, plus un historique privé de moments et de photos. La personne qui garde note un repas ou une sieste en quelques secondes, souvent d'une main ; le parent ouvre l'application et comprend la journée d'un coup d'œil. Les invitations passent par un lien, et l'application Android les ouvre directement.",
      architecture:
        "Un backend Convex unique, partagé entre une application Expo (mobile) et une application TanStack Start (landing, espace connecté, administration). Un fichier de configuration commun alimente les deux applications. Authentification Better Auth par code email, notifications push, stockage des photos sur un stockage compatible S3.",
      technicalChoices:
        "La famille est la frontière de sécurité, l'enfant la frontière d'expérience : le modèle de données isole strictement chaque famille et distingue deux rôles (parent, personne qui garde) avec leurs droits propres, mais l'interface ne parle jamais de \"famille\" ou d'\"organisation\", seulement de l'enfant par son prénom. Les couleurs fonctionnelles des événements portent toujours une icône ou un libellé, jamais la couleur seule.",
      difficulties:
        "Faire tenir deux usages très différents dans un même produit : la personne qui garde, pressée et souvent les mains prises, et le parent, qui veut une lecture rassurante. Chaque écran a dû être arbitré au profit de la rapidité de saisie, et plusieurs fonctionnalités ont été simplifiées ou retirées parce qu'elles demandaient trop de temps à celui qui note.",
      security:
        "Données d'enfants : accès strictement limité aux membres de la famille, rôles contrôlés côté serveur, suppression de compte intégrée, en-têtes de sécurité sur le web et permissions Android réduites au strict nécessaire (pas d'accès global aux photos ni aux vidéos).",
      learnings:
        "Un produit pour les parents se juge au calme qu'il apporte, pas aux fonctionnalités qu'il liste. Dire non (pas de paie, pas de courbes de croissance, pas de marketplace) est ce qui a permis de garder une application assez simple pour être utilisée une main occupée.",
    },
  },
  {
    slug: "nativeprobe",
    name: "NativeProbe",
    type: "product",
    status: "beta",
    tagline:
      "Un playground mobile open source pour explorer, tester et comprendre les capacités réelles d'un appareil.",
    problem:
      "Les développeurs React Native n'ont pas de terrain de jeu pour tester en direct les capacités réelles d'un appareil — capteurs, permissions, réseau, biométrie — sans écrire un projet de test à chaque fois.",
    solution:
      "Playground mobile open source avec des probes interactifs qui déclenchent chaque capacité en direct (capteurs, réseau, localisation, biométrie, haptique...) et montrent l'API Expo derrière chaque test.",
    result: "Application en beta, en approche de la phase de test Google Play.",
    technologies: ["React Native", "Expo", "TypeScript", "iOS", "Android"],
    repositoryUrl: "https://github.com/Randy-R-code/nativeprobe",
    logo: { src: "/projects/logos/nativeprobe.png", alt: "" },
    openSource: true,
    featured: false,
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
  beta: "Beta",
};

export function statusLabel(status: Project["status"]): string {
  return statusLabels[status];
}
