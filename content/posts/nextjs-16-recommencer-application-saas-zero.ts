import type { PostData } from "@/lib/blog";

const post: PostData = {
  slug: "nextjs-16-recommencer-application-saas-zero",
  title: "Next.js 16 : pourquoi j'ai recommencé mon application SaaS de zéro",
  description:
    "La v1 de Liflow fonctionnait, mais elle était trop complexe à maintenir. Retour sur la décision de tout recommencer avec Next.js 16 et les gains concrets d'un vrai reset.",
  date: "2025-12-10",
  tags: ["Next.js 16", "refactoring", "SaaS"],
  coverImage: "/blog/nextjs-16-recommencer-application-saas-zero.jpg",
  content: `
<p>La première version de Liflow fonctionnait. Mais elle était trop ambitieuse.</p>
<p>J'avais ajouté beaucoup de fonctionnalités, parfois par envie, parfois par curiosité, parfois parce que "ça pouvait être utile". Résultat : une application plus difficile à comprendre, plus lourde à maintenir, et moins intuitive que ce que j'avais en tête au départ.</p>

<h2>Le déclic : Next.js 16</h2>
<p>Le vrai déclic est venu quand Next.js 16 est sorti. Plutôt que de faire un énième refactoring partiel, je me suis posé une question simple : est-ce que j'aurais envie de maintenir cette application pendant des années dans cet état ?</p>
<p>La réponse était non. J'ai donc décidé de repartir de zéro. Pas un refactor, pas une migration progressive : un vrai reset.</p>

<h2>Simplifier plutôt qu'ajouter</h2>
<p>L'objectif n'était pas d'ajouter de nouvelles fonctionnalités, mais de simplifier l'existant. Réduire le nombre de concepts, clarifier l'architecture, rendre le code plus lisible et plus évident à parcourir.</p>
<p>Sur la première version, certaines fonctionnalités allaient trop loin — la gestion des événements ou certaines idées autour de l'IA. Aujourd'hui, j'ai volontairement recentré Liflow sur l'essentiel : ce qui sert vraiment au quotidien.</p>
<p><em>Une fonctionnalité utile est une fonctionnalité qu'on utilise tous les jours, ou presque.</em></p>

<h2>Le résultat</h2>
<p>Le résultat est une application plus fluide, plus simple à comprendre, et surtout beaucoup plus agréable à maintenir. À l'heure actuelle, je serais parfaitement à l'aise à ne faire que des mises à jour de dépendances et de sécurité pendant longtemps. Liflow est stable, cohérente et utile telle qu'elle est.</p>

<h2>Ce que ce refactoring a changé</h2>
<p>Ce refactoring a aussi changé ma façon de travailler. Je prends plus de temps avant de coder. Je réfléchis davantage à l'architecture, à l'utilité réelle d'une fonctionnalité, et j'accepte beaucoup plus facilement de supprimer plutôt que d'ajouter.</p>

<h2>Conclusion</h2>
<p>Refaire Liflow de zéro m'a appris que la simplicité n'est pas un manque d'ambition, mais souvent un signe de maturité.</p>
  `.trim(),
};

export default post;
