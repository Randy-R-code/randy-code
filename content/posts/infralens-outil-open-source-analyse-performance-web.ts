import type { PostData } from "@/lib/blog";

const post: PostData = {
  slug: "infralens-outil-open-source-analyse-performance-web",
  title:
    "InfraLens : concevoir un outil open source d'analyse de performance web",
  description:
    "Retour sur la conception d'InfraLens, outil open source d'analyse web. Philosophie, choix techniques et usage quotidien d'un outil pensé pour les développeurs, sans friction.",
  date: "2026-01-08",
  tags: ["open source", "performance web", "outils développeur"],
  coverImage: "/blog/infralens-outil-open-source-analyse-performance-web.jpg",
  content: `
<p>Créer des outils pour moi, pour moi d'abord — c'est devenu une habitude. Avec InfraLens, je voulais un outil open source que j'utilise tous les jours pour améliorer mes apps, sans dépendre de sites externes que je ne maîtrise pas.</p>

<h2>Un outil utile, pensé par besoin réel</h2>
<p>J'avais envie d'un outil que je puisse utiliser tout de suite, sans friction : pas de clés API, pas de configuration compliquée, pas de compte à créer. Juste un outil clair, mesurable, simple à prendre en main.</p>
<p>Il existe déjà plein de services qui font des analyses plus complètes, plus exhaustives, plus "power user". Mais je voulais quelque chose de rapide, lisible, et intégrable facilement dans mon flux de travail quotidien. C'est dans cette logique qu'InfraLens est né.</p>

<h2>Pour les devs, pas pour la vitrine</h2>
<p>InfraLens n'a pas été pensé pour une audience vague ou pour impressionner. Il a été pensé pour les développeurs, ceux qui veulent voir des choses précises sans passer par une interface lourde ou un tunnel d'inscription.</p>
<p>Le setup est volontairement minimal :</p>
<ul>
  <li>pas de clé à générer</li>
  <li>pas d'authentification</li>
  <li>pas de quoi mémoriser</li>
</ul>
<p>Juste une URL, une analyse, et une lecture claire des points qui comptent.</p>

<h2>Le choix du simple plutôt que du parfait</h2>
<p>Je n'ai jamais cherché à faire quelque chose de parfait ou de complet à 100 %. Ce n'est ni un scanner universel, ni une plateforme complète d'audit. Ce qui n'existe pas dans InfraLens ne manque pas — parce qu'il n'a jamais été nécessaire pour mon usage quotidien.</p>
<p>Aller au plus simple : ça rend l'outil plus rapide, ça réduit les surfaces de bugs, ça rend les résultats faciles à lire et à comprendre.</p>

<h2>Un outil utilisé au quotidien</h2>
<p>Personnellement, j'utilise InfraLens souvent pour vérifier l'état des performances de mes sites, repérer rapidement des points d'optimisation, et avoir une lecture immédiate des métriques qui comptent.</p>
<p>Ce n'est pas une analyse complète, mais c'est une lecture fiable, rapide et accessible. Si InfraLens disparaissait demain, ce que je regretterais vraiment, ce serait la possibilité de voir les points essentiels sans naviguer dans des interfaces plus lourdes ou des dashboards complexes.</p>

<h2>Ce que ce projet dit de ma façon de travailler</h2>
<p>InfraLens est cohérent avec mon approche pragmatique, mon goût pour la simplicité utile, et ma volonté de maîtriser mes outils. Comme avec Liflow, l'idée n'est pas de faire "un produit pour tous", mais de créer quelque chose qui répond vraiment à un besoin concret que je vis quotidiennement.</p>
<p>C'est peut-être pour ça que je préfère des outils qui ne demandent pas de configuration lourde, produisent des résultats lisibles rapidement, et restent simples à maintenir.</p>

<h2>Conclusion</h2>
<p>InfraLens a été conçu pour me servir d'abord, et seulement ensuite pour être partagé et utilisé par d'autres développeurs. Il illustre une philosophie qui m'est chère : la simplicité utile plutôt que la sophistication inutile.</p>
<p>Pour moi, un bon outil est celui que l'on utilise sans friction, qui donne de la clarté sans bruit, et que l'on retrouve instinctivement dans sa boîte à outils.</p>
  `.trim(),
};

export default post;
