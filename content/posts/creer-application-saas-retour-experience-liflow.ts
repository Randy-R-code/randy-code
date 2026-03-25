import type { PostData } from "@/lib/blog";

const post: PostData = {
  slug: "creer-application-saas-retour-experience-liflow",
  title: "Créer une application SaaS de A à Z : retour d'expérience sur Liflow",
  description:
    "Comment j'ai conçu Liflow, une app SaaS de partage en capsules — architecture, refactoring complet et leçons concrètes après un projet développé de A à Z.",
  date: "2025-11-26",
  tags: ["SaaS", "développement web", "retour d'expérience"],
  coverImage: "/blog/creer-application-saas-retour-experience-liflow.jpg",
  content: `
<p>Liflow est né d'un besoin très concret : j'avais envie d'un outil de partage simple, clair, et réellement utile au quotidien.</p>
<p>Pour collaborer avec mes proches ou quelques personnes, je me retrouvais sans cesse à jongler avec plusieurs outils : WhatsApp pour discuter, Discord pour certains groupes, Google Drive pour les fichiers, parfois un calendrier à côté… Tout était dispersé, difficile à retrouver, et rarement pensé comme un ensemble cohérent.</p>
<p>J'avais envie de tout regrouper au même endroit, sans bruit inutile.</p>

<h2>Une application de partage, mais pas comme les autres</h2>
<p>Liflow est une application de partage basée sur des capsules. Chaque capsule est indépendante et contient uniquement les personnes concernées.</p>
<p>Dans une capsule, on peut :</p>
<ul>
  <li>partager des notes</li>
  <li>stocker des fichiers et des photos</li>
  <li>gérer une todo-list</li>
  <li>partager des événements</li>
</ul>
<p>Toujours avec une règle simple : on partage uniquement avec qui on veut.</p>
<p>Dans la pratique, ça donne des usages très concrets : une capsule pour une liste de naissance, partagée avec les proches concernés ; une capsule privée pour préparer l'accouchement à deux ; une capsule plus légère pour discuter F1 avec quelques amis. Ce sont ces usages réels qui ont guidé le développement, pas l'inverse.</p>

<h2>Le cœur du problème que je voulais résoudre</h2>
<p>Ce que je voulais éviter à tout prix, c'était le switch permanent entre les outils. Sur WhatsApp ou Discord, l'information se perd vite dans les discussions. Sur Drive, les fichiers sont là, mais sans contexte. Et retrouver une information précise devient souvent pénible.</p>
<p>Avec Liflow, tout le contenu est structuré par capsule et surtout recherchable : notes, fichiers, événements. Pour moi, c'est là que se trouve la vraie valeur de l'application.</p>

<h2>Inspirations UI, mais pas de modèle imposé</h2>
<p>Je me suis inspiré de certaines interfaces que j'utilise au quotidien, par petites touches. Par exemple, le menu utilisateur reprend volontairement des codes similaires à Discord.</p>
<p>En revanche, sur le fond de l'application, je n'ai pas suivi de modèle existant. Liflow n'essaie pas d'être un Notion, un Slack ou un gestionnaire de projet classique. C'est probablement ce qui fait que l'app peut sembler "pour tout le monde"… et en même temps très personnelle.</p>

<h2>Trop de fonctionnalités, puis un retour en arrière</h2>
<p>La première version de Liflow était beaucoup trop ambitieuse. J'avais multiplié les fonctionnalités :</p>
<ul>
  <li>différents types d'événements</li>
  <li>des niveaux de partage complexes</li>
  <li>des usages IA parfois gadgets, comme des suggestions automatiques de rappels</li>
</ul>
<p>Résultat : une application plus difficile à comprendre et à utiliser. Avec la sortie de Next.js 16, j'ai pris une décision radicale : tout recommencer de zéro. Moins de fonctionnalités, une architecture plus claire, un code plus propre. Ce refactoring a nettement amélioré la fluidité, les performances, et surtout la lisibilité du produit.</p>

<h2>L'IA, mais seulement quand elle a du sens</h2>
<p>Aujourd'hui, l'IA dans Liflow a un rôle volontairement limité : résumer des notes et faire de la transcription vocale. Pas plus. L'objectif n'est pas d'impressionner, mais d'aider concrètement, sans voler la place de l'utilisateur.</p>

<h2>Ce que Liflow m'a appris en tant que développeur</h2>
<p>Ce projet m'a appris à ralentir. Avant de coder, je prends désormais plus de temps pour réfléchir à l'architecture, à l'utilité réelle d'une fonctionnalité, et aux compromis acceptables.</p>
<p>Liflow m'a aussi confirmé une chose : j'aime construire des projets de A à Z, même seul, et soigner les détails. Je suis exigeant, parfois trop, mais je préfère prendre ce temps plutôt que livrer quelque chose de bancal.</p>

<h2>Et la suite</h2>
<p>Liflow continue d'évoluer, mais sans précipitation. L'idée n'est pas d'ajouter toujours plus, mais de garder une application claire, cohérente et agréable à utiliser sur la durée. C'est à la fois un produit que j'utilise au quotidien, et un terrain d'expérimentation qui me correspond.</p>

<h2>Conclusion</h2>
<p>Liflow n'est pas un projet parfait, mais c'est un projet abouti. Chaque fonctionnalité a une utilité réelle, chaque choix a été réfléchi, et l'application pourrait très bien rester en l'état pendant des années sans perdre son sens.</p>
<p>Ce projet résume assez bien ma manière de travailler aujourd'hui : prendre le temps de réfléchir, faire des choix clairs, et construire des applications propres, utiles et cohérentes de bout en bout.</p>
  `.trim(),
};

export default post;
