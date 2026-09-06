import type { PostData } from "@/lib/blog";

const post: PostData = {
  slug: "construire-moins-de-projets-vraiment-utiles",
  title: "Construire moins de projets, mais les rendre vraiment utiles",
  description:
    "Pourquoi j'ai choisi de construire quelques outils open source autonomes plutôt que de multiplier les projets de démonstration, de RepoCheckup à CookieCheckup.",
  date: "2026-09-06",
  tags: ["open source", "RepoCheckup", "CookieCheckup", "retour d'expérience"],
  coverImage: "/blog/construire-moins-de-projets-vraiment-utiles.jpg",
  content: `
<p>Un portfolio de développeur peut vite devenir une collection de projets créés pour montrer qu'on sait utiliser une technologie.</p>

<p>Ce n'est pas vraiment ce que je voulais pour Randy Code.</p>

<p>Au fil du temps, j'y ai ajouté des applications, des retours d'expérience et plusieurs outils destinés aux développeurs. Puis je me suis posé une autre question : <strong>qu'est-ce qui mérite réellement de devenir un projet open source autonome ?</strong></p>

<p>C'est cette réflexion qui m'a amené à créer RepoCheckup, puis CookieCheckup.</p>

<p>Pas pour remplir mon profil GitHub. Plutôt pour construire moins de projets, mais faire en sorte que chacun ait une vraie raison d'exister.</p>

<h2>Tout n'a pas besoin de devenir un projet</h2>

<p>J'ai déjà construit plusieurs <a href="/tools">outils directement dans Randy Code</a>.</p>

<p>InfraLens analyse une URL et remonte des informations sur les performances, la sécurité et la configuration technique d'un site. Cron Builder aide à composer et comprendre des expressions cron. JSON Studio permet de travailler rapidement avec du JSON. MetaLens se concentre sur les métadonnées d'une page, et API Studio permet de tester des requêtes HTTP depuis le navigateur.</p>

<p>Ils ne répondent pas tous au même besoin, mais ils partagent un point commun : <strong>ils ont du sens directement dans le portfolio</strong>.</p>

<p>Ils sont accessibles immédiatement, sans installation et sans compte. Ils enrichissent Randy Code au lieu de nécessiter chacun un nouveau produit, un domaine, une identité et toute l'infrastructure qui va avec.</p>

<p>C'est une distinction que je trouve de plus en plus importante.</p>

<p>Une idée n'a pas besoin de devenir un SaaS. Un petit outil n'a pas forcément besoin de son propre repository. Et un repository public n'a aucun intérêt simplement parce qu'il est public.</p>

<p>Le format doit venir du besoin, pas l'inverse.</p>

<h2>Sortir du portfolio quand le projet le mérite</h2>

<p>À un moment, continuer à ajouter tous mes outils dans Randy Code aurait aussi fini par créer l'effet inverse.</p>

<p>Certains projets peuvent être plus intéressants s'ils vivent indépendamment du portfolio : leur propre repository, une documentation dédiée, des releases et, lorsque c'est pertinent, leur propre mode de distribution.</p>

<p>C'est avec cette logique que j'ai créé <strong><a href="https://github.com/Randy-R-code/repo-checkup" target="_blank" rel="noopener noreferrer">RepoCheckup</a></strong>.</p>

<p>RepoCheckup est un CLI Node.js et TypeScript qui analyse rapidement un repository et signale différents points à vérifier dans sa configuration.</p>

<p>Le choix du CLI n'était pas seulement technique. C'était surtout le format naturel pour le problème.</p>

<p>Pas d'interface web à ouvrir. Pas de projet à uploader. Pas de compte à créer. L'outil s'exécute directement depuis le terminal, y compris avec <code>npx repo-checkup</code>.</p>

<p>Ça paraît assez simple une fois terminé. Mais publier un outil destiné à être utilisé par d'autres change beaucoup de choses.</p>

<p>Il faut penser à l'installation, aux messages d'erreur, à la sortie du terminal, à la documentation, aux versions, à la CI et au comportement de l'outil en dehors de son propre environnement de développement.</p>

<p>Le repository n'est plus seulement l'endroit où se trouve le code : <strong>il fait partie du produit</strong>. RepoCheckup est disponible sur <a href="https://github.com/Randy-R-code/repo-checkup" target="_blank" rel="noopener noreferrer">GitHub</a> et publié sur <a href="https://www.npmjs.com/package/repo-checkup" target="_blank" rel="noopener noreferrer">npm</a>.</p>

<h2>CookieCheckup : garder la logique, changer complètement le format</h2>

<p>Après RepoCheckup, la solution facile aurait été de créer un deuxième CLI.</p>

<p>Puis un troisième.</p>

<p>Ce n'était pas le but.</p>

<p>Je voulais que mes projets open source soient complémentaires, pas simplement des variations autour du même exercice technique.</p>

<p><strong><a href="https://cookie-checkup.vercel.app" target="_blank" rel="noopener noreferrer">CookieCheckup</a></strong> part donc dans une direction différente.</p>

<p>C'est un outil web open source construit avec Next.js, React et TypeScript pour aider à vérifier, visualiser et comprendre le comportement des cookies dans un navigateur.</p>

<p>L'objectif n'est pas de scanner un site ou de remplacer les DevTools. On part d'une configuration de cookie et d'un contexte de navigation, puis l'outil explique ce que le navigateur devrait en faire : acceptation, stockage, correspondance avec un domaine ou un chemin, envoi dans une requête, accessibilité depuis JavaScript ou encore influence des attributs comme <code>SameSite</code>, <code>Secure</code> et <code>HttpOnly</code>.</p>

<p>Cette fois, une interface graphique apporte quelque chose que le terminal apporterait difficilement : <strong>voir le comportement et comprendre pourquoi il se produit</strong>.</p>

<p>RepoCheckup et CookieCheckup restent donc deux developer tools, mais ils n'essaient ni de résoudre le même problème ni de démontrer la même chose.</p>

<p>Et c'est volontaire. Le code de CookieCheckup est public sur <a href="https://github.com/Randy-R-code/cookie-checkup" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>

<h2>Un GitHub public ne raconte pas forcément le travail réel</h2>

<p>Il y avait aussi une raison plus personnelle derrière cette démarche.</p>

<p>Une grande partie de mes projets est privée.</p>

<p>C'est normal pour des applications personnelles, des produits en développement ou des projets qui n'ont simplement aucune raison d'être publics. Mais cela signifie aussi qu'un profil GitHub public peut donner une vision très partielle du travail réellement effectué.</p>

<p>La tentation serait alors de compenser en créant beaucoup de petits repositories publics.</p>

<p>Une application de tâches. Un clone d'un produit connu. Une démonstration d'authentification. Un projet créé principalement pour afficher une technologie supplémentaire sur un profil.</p>

<p>Je préfère l'approche inverse.</p>

<p><strong>Quelques repositories publics, mais des projets que je peux réellement maintenir et assumer.</strong></p>

<p>Un projet open source me semble beaucoup plus intéressant lorsqu'une personne extérieure peut comprendre pourquoi il existe, l'installer ou l'utiliser, lire sa documentation et éventuellement contribuer ou signaler un problème.</p>

<p>Le nombre de repositories devient secondaire.</p>

<h2>L'open source impose une autre exigence</h2>

<p>Le changement le plus intéressant n'est finalement pas de rendre le code visible.</p>

<p>C'est de développer en sachant que quelqu'un qui ne connaît ni le projet ni les décisions prises pendant sa création peut arriver dessus demain.</p>

<p>Des choses faciles à ignorer sur un projet personnel deviennent alors importantes :</p>

<ul>
  <li>le README doit permettre de comprendre rapidement le projet ;</li>
  <li>l'installation doit fonctionner sans connaître mon environnement ;</li>
  <li>les erreurs doivent aider plutôt que simplement constater un échec ;</li>
  <li>les choix de configuration doivent être explicites ;</li>
  <li>les releases doivent être compréhensibles ;</li>
  <li>les contributions doivent pouvoir être accueillies proprement ;</li>
  <li>le repository doit rester lisible après plusieurs mois.</li>
</ul>

<p>Ça oblige à regarder le projet autrement.</p>

<p>Et c'est probablement ce que je trouve le plus intéressant dans cette démarche : <strong>construire pour quelqu'un qu'on ne connaît pas encore</strong>.</p>

<h2>Moins de projets, davantage de complémentarité</h2>

<p>Je n'ai donc pas pour objectif de transformer mon GitHub en catalogue.</p>

<p>RepoCheckup couvre le CLI et l'écosystème Node.js/npm.</p>

<p>CookieCheckup explore davantage l'interface, React et le comportement du navigateur.</p>

<p>Les outils intégrés à Randy Code continuent, eux, à remplir un autre rôle : répondre rapidement à des besoins ciblés sans transformer chaque idée en projet indépendant.</p>

<p>Cette séparation me convient beaucoup mieux qu'une règle du type « tout doit être open source » ou, à l'inverse, « tout doit être intégré au portfolio ».</p>

<p>Certains projets doivent rester privés.</p>

<p>Certains petits outils fonctionnent mieux directement dans Randy Code.</p>

<p>Et certains méritent de devenir des projets open source autonomes.</p>

<p>L'important est surtout de savoir pourquoi.</p>

<h2>Construire quelque chose qui mérite de rester</h2>

<p>J'avais déjà commencé à suivre cette logique avec <a href="/articles/infralens-outil-open-source-analyse-performance-web">InfraLens</a> : partir d'un besoin réel et construire l'outil que j'aurais aimé avoir sous la main.</p>

<p>RepoCheckup et CookieCheckup prolongent cette idée, mais en dehors du portfolio.</p>

<p>Je ne sais pas combien de projets open source viendront ensuite, et je préfère justement ne pas me fixer un nombre.</p>

<p>La contrainte que je veux garder est plus simple : <strong>un nouveau projet public doit apporter quelque chose que les précédents n'apportent pas déjà</strong>.</p>

<p>S'il n'y a pas de besoin, pas de différence intéressante ou pas l'envie de le maintenir, il n'a probablement pas besoin d'exister.</p>

<p>Construire moins laisse aussi plus de temps pour terminer, documenter, améliorer et maintenir ce qui existe déjà.</p>

<p>Et pour un projet open source, c'est peut-être finalement ce qui compte le plus.</p>
`,
};

export default post;
