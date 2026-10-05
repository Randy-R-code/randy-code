import type { PostData } from "@/lib/blog";

const post: PostData = {
  slug: "ia-copilote-developpement-neuf-mois-plus-tard",
  title: "9 mois plus tard : l'IA est devenue mon copilote",
  description:
    "Neuf mois après mon premier article, l'IA écrit presque tout mon code et je n'ai pas perdu le contrôle : je l'ai déplacé vers les specs, le contexte et la validation. Retour d'expérience sur un workflow qui a changé de niveau d'abstraction.",
  date: "2026-10-04",
  tags: ["IA", "développement web", "workflow développeur"],
  coverImage: "/blog/ia-copilote-developpement-neuf-mois-plus-tard.jpg",
  content: `
<p>En janvier, j'écrivais <a href="/articles/ia-developpement-web-workflow-coder-sans-perdre-controle">un article</a> sur la place que l'IA avait prise dans ma manière de développer. Ma conclusion tenait en une phrase : <strong>« L'IA comme assistant, jamais comme pilote. »</strong></p>
<p>Neuf mois plus tard, je le formulerais différemment. <strong>L'IA est devenue mon copilote.</strong></p>
<p>Pas parce que je lui ai progressivement laissé prendre toutes les décisions. Au contraire. Je décide toujours de ce que je veux construire, de la stack que je vais utiliser, de l'expérience que je veux proposer et des compromis que je suis prêt à faire. Mais entre l'idée et le résultat final, ma façon de travailler a profondément changé.</p>
<p>Aujourd'hui, l'IA écrit pratiquement 100 % de mon code. Et paradoxalement, je n'ai pas l'impression d'avoir moins de contrôle sur mes projets. J'ai surtout déplacé ce contrôle ailleurs.</p>

<h2>Ce qui a changé depuis janvier</h2>
<p>Dans mon premier article, j'expliquais que j'utilisais principalement l'IA pour réfléchir, structurer une fonctionnalité, vérifier une approche ou identifier des cas limites. Elle pouvait générer du code, évidemment, mais je gardais une relation très directe avec celui-ci. J'avais notamment une règle simple :</p>
<blockquote>Si je ne comprends pas une ligne, elle ne reste pas.</blockquote>
<p>Cette phrase représentait assez bien ma manière de travailler à ce moment-là. Aujourd'hui, elle n'est plus tout à fait vraie. Je ne vérifie plus chaque ligne individuellement. Le contrôle est devenu beaucoup plus global : je vérifie que l'implémentation correspond à ce qui était demandé, que l'architecture reste cohérente, que l'UX est correcte, que rien n'a été cassé et que le résultat fonctionne réellement.</p>
<p>Ce n'est donc pas simplement la quantité de code généré par l'IA qui a changé. <strong>C'est mon rôle dans le développement.</strong></p>

<h2>Je code moins, mais je prépare beaucoup plus</h2>
<p>Aujourd'hui, lorsque je commence une fonctionnalité importante ou un nouveau projet, je ne commence généralement pas par écrire du code. Je commence par réfléchir :</p>
<ul>
  <li>quel problème est-ce que je cherche réellement à résoudre ?</li>
  <li>comment l'utilisateur va-t-il interagir avec cette fonctionnalité ?</li>
  <li>quelles sont les contraintes ?</li>
  <li>quelle architecture paraît la plus adaptée ?</li>
  <li>quels cas particuliers faut-il prévoir ?</li>
</ul>
<p>Je discute énormément de ces questions avec ChatGPT. Mais discuter ne signifie pas lui déléguer les décisions. Je peux demander plusieurs approches, remettre en question une solution, comparer des compromis ou approfondir un point technique. À la fin, les choix restent les miens. La stack, l'UX, les fonctionnalités, la direction du produit : <strong>je décide</strong>.</p>
<p>Une fois cette réflexion terminée, je transforme tout cela en spécifications beaucoup plus précises. Et c'est seulement ensuite que commence réellement l'implémentation.</p>

<h2>Une bonne spec vaut aujourd'hui énormément de code</h2>
<p>C'est probablement l'un des plus gros changements dans ma manière de développer. Avant, une spécification servait surtout à savoir ce que j'allais coder. Aujourd'hui, elle sert aussi à donner suffisamment de contexte à un agent pour qu'il puisse travailler correctement sans que j'aie besoin de lui expliquer chaque décision au fur et à mesure.</p>
<p>Une fonctionnalité bien préparée peut contenir son comportement attendu, les règles UX, les contraintes techniques, les fichiers concernés, les cas limites et parfois même ce qu'il ne faut surtout pas modifier. Je passe donc davantage de temps à définir précisément le résultat avant de lancer l'implémentation.</p>
<p>Ça peut sembler paradoxal : l'IA permet de produire du code extrêmement rapidement, mais elle m'a poussé à passer <strong>davantage de temps avant le code</strong>. Et plus cette préparation est bonne, moins j'ai besoin d'intervenir pendant l'exécution.</p>

<h2>Le contexte est devenu une partie de mon environnement de développement</h2>
<p>En janvier, j'insistais déjà beaucoup sur l'importance du contexte. Sur ce point, mon avis n'a pas changé. Il s'est plutôt renforcé.</p>
<p>Un agent sans contexte peut produire quelque chose de techniquement correct et pourtant complètement incohérent avec le reste du projet :</p>
<ul>
  <li>mauvaise abstraction ;</li>
  <li>composant inutile ;</li>
  <li>convention ignorée ;</li>
  <li>modification beaucoup trop large ;</li>
  <li>duplication d'une logique existante ;</li>
  <li>sur-engineering.</li>
</ul>
<p>Toutes ces erreurs deviennent beaucoup moins fréquentes lorsque l'environnement explique clairement comment le projet doit fonctionner. J'ai donc progressivement construit mes propres règles et mes propres skills. Aujourd'hui, mon environnement en contient énormément : presque une centaine de skills, auxquels viennent s'ajouter de nombreuses règles. Ils couvrent différentes situations, technologies, conventions et manières de travailler.</p>
<p>Le but n'est pas d'écrire une instruction gigantesque avant chaque demande. C'est exactement l'inverse. <strong>Le cadre existe déjà.</strong> L'agent peut donc travailler avec les mêmes attentes d'une session à l'autre sans que j'aie à réexpliquer constamment ma manière de structurer un projet, de modifier du code ou de vérifier son travail. Et c'est probablement l'une des raisons principales pour lesquelles je peux aujourd'hui déléguer autant d'implémentation.</p>

<h2>Les agents ne sont bons que dans le cadre qu'on leur donne</h2>
<p>Sans ce cadre, je retrouve encore beaucoup des problèmes classiques du code généré par IA : des modifications inutiles, une tendance à compliquer quelque chose qui pouvait rester simple, une instruction oubliée au milieu d'une tâche importante, une solution qui fonctionne isolément mais qui ne respecte pas suffisamment l'architecture existante. Ou simplement du code qui paraît convaincant au premier regard mais qui ne répond pas exactement au problème.</p>
<p>Je ne considère donc pas que les modèles soient devenus magiquement capables de construire n'importe quel projet seuls. Ce qui s'est amélioré, ce sont les modèles, évidemment. Mais <strong>ma manière de travailler avec eux s'est aussi énormément améliorée</strong>.</p>
<p>Au fil des projets, j'ai transformé les problèmes récurrents en règles. Les méthodes qui fonctionnent bien deviennent réutilisables. Les erreurs intéressantes deviennent des garde-fous. Petit à petit, l'environnement s'améliore. Et plus cet environnement devient fiable, plus je peux laisser l'agent travailler longtemps sans intervenir.</p>

<h2>Aujourd'hui, plusieurs IA ont des rôles différents</h2>
<p>Je n'utilise pas un seul outil pour tout faire. ChatGPT me sert principalement pour toute la partie élaboration. C'est là que je réfléchis à un projet, challenge une idée, travaille l'UX, compare des solutions, construis une architecture ou transforme une discussion en spécification suffisamment précise pour passer à l'implémentation.</p>
<p>Pour le code, j'utilise principalement <strong>Claude Code et Codex</strong>. À ce stade, ils peuvent prendre en charge pratiquement toute l'implémentation à partir du cadre défini en amont. Mon rôle consiste ensuite davantage à tester, observer le résultat, vérifier les changements et corriger la direction lorsque c'est nécessaire. J'utilise également <strong>OpenClaw avec Codex</strong> pour certaines petites corrections lorsque je ne suis pas devant mon Mac.</p>
<p>Ce qui m'intéresse finalement n'est pas tellement de savoir quel outil peut remplacer tous les autres. Je préfère avoir plusieurs outils avec des responsabilités différentes dans un même workflow.</p>

<h2>Le gain le plus important n'est pas la vitesse</h2>
<p>Évidemment, je développe beaucoup plus rapidement. Je serais incapable de donner un multiplicateur précis. Sur certains projets récents, j'ai parfois l'impression qu'il m'aurait fallu plusieurs fois plus de temps pour arriver au même résultat avec ma manière de travailler d'il y a un an. Mais ce chiffre serait impossible à mesurer sérieusement. Et surtout, je ne pense plus que ce soit le point le plus intéressant.</p>
<p>Le changement le plus important est ailleurs : <strong>je peux entreprendre des projets que j'aurais beaucoup plus hésité à commencer auparavant.</strong></p>
<p>Pas nécessairement parce qu'ils étaient techniquement impossibles, mais parce que le temps nécessaire pour explorer un nouveau domaine, comprendre ses contraintes, construire une première version puis maintenir tout le reste en parallèle aurait été beaucoup plus important.</p>
<p>Ces derniers mois, j'ai par exemple commencé à travailler sérieusement sur le développement mobile avec React Native et Expo. Cela implique de nouveaux concepts, de nouvelles APIs, des contraintes propres aux appareils, des builds natifs et tout un environnement que je connaissais beaucoup moins que le web. L'IA ne m'a pas empêché d'apprendre ces choses. Elle m'a permis de les aborder beaucoup plus rapidement.</p>

<h2>Je n'ai pas l'impression d'apprendre moins</h2>
<p>C'est probablement l'une des objections les plus évidentes lorsque presque tout le code est généré : si je n'écris plus chaque ligne moi-même, est-ce que j'apprends encore réellement ? Dans mon expérience, oui. Et même plus rapidement. La différence est surtout dans <strong>la manière d'apprendre</strong>.</p>
<p>Je passe moins de temps à chercher la syntaxe exacte d'une API ou à résoudre seul un problème déjà rencontré des milliers de fois. En revanche, je peux demander immédiatement pourquoi une approche fonctionne, quelles alternatives existent, ce que fait une abstraction ou pourquoi un bug apparaît. Et surtout, j'apprends en construisant des choses que je n'aurais peut-être pas abordées aussi rapidement auparavant.</p>
<p><a href="/projects/nativeprobe">NativeProbe</a> en est un bon exemple. En développant une application centrée sur les capacités réelles d'un téléphone, j'ai dû comprendre les capteurs, les permissions, la biométrie, les différences entre environnement de développement et véritable build, puis le fonctionnement de la distribution Android. L'IA pouvait écrire l'implémentation. Mais elle ne pouvait pas comprendre ces concepts <strong>à ma place</strong>. Pour décider si le résultat est correct, il faut toujours comprendre suffisamment ce que l'on construit.</p>

<h2>Écrire le code n'est plus forcément là où j'apporte le plus de valeur</h2>
<p>C'est probablement l'évolution la plus importante de ma réflexion depuis janvier. Pendant longtemps, développer un logiciel signifiait naturellement passer une grande partie de son temps à écrire son code. Aujourd'hui, ce n'est plus nécessairement là que je suis le plus utile :</p>
<ul>
  <li>choisir de construire ou non une fonctionnalité ;</li>
  <li>comprendre le problème ;</li>
  <li>décider comment l'utilisateur doit interagir avec elle ;</li>
  <li>choisir la bonne architecture ;</li>
  <li>définir les contraintes ;</li>
  <li>éviter de complexifier inutilement le produit ;</li>
  <li>reconnaître qu'une implémentation techniquement correcte produit une mauvaise expérience.</li>
</ul>
<p>Ce sont ces décisions qui déterminent énormément la qualité finale d'un projet. L'IA peut participer à chacune de ces réflexions, et je l'utilise d'ailleurs énormément pour ça. Mais il faut toujours quelqu'un pour décider dans quelle direction avancer.</p>

<h2>Le développeur ne disparaît pas, son niveau d'abstraction change</h2>
<p>Il y a neuf mois, je gardais le contrôle en restant très proche du code. Aujourd'hui, je le garde davantage au niveau du système :</p>
<ul>
  <li>je définis ce qui doit être construit ;</li>
  <li>je pose les règles ;</li>
  <li>je choisis les contraintes ;</li>
  <li>je fournis le contexte ;</li>
  <li>je valide le résultat.</li>
</ul>
<p>Et entre les deux, je peux laisser une part beaucoup plus importante de l'exécution à des agents.</p>
<p>Cela ne signifie pas que le code n'a plus d'importance. Au contraire : lorsqu'un problème apparaît, il faut toujours être capable de descendre d'un niveau, comprendre ce qui se passe et remettre en question l'implémentation. Mais je n'ai plus besoin de rester constamment à ce niveau.</p>
<p><strong>Mon travail s'est déplacé de l'écriture systématique du code vers la conception et le contrôle du système qui le produit.</strong></p>

<h2>D'assistant à copilote</h2>
<p>En janvier, je terminais mon article avec une idée simple : <strong>l'IA comme assistant, jamais comme pilote.</strong> Je comprends toujours ce que je voulais dire. Et sur le fond, je suis encore assez proche de cette position. Je ne veux pas donner une idée vague à une IA et accepter aveuglément ce qui en sort. Je ne veux pas qu'elle choisisse à ma place ce que doit devenir un produit. Je ne veux pas non plus confondre vitesse de génération et qualité du résultat.</p>
<p>Mais je ne peux plus vraiment parler d'un simple assistant. L'IA participe aujourd'hui à pratiquement toutes les étapes de mon développement : réflexion, architecture, spécifications, implémentation, vérification et corrections. Elle écrit même la quasi-totalité du code. Le terme qui correspond le mieux à cette relation est donc probablement <strong>copilote</strong>.</p>
<p>Un copilote avec lequel je peux discuter. À qui je peux déléguer énormément. Qui peut parfois me proposer une meilleure direction que celle que j'avais imaginée. Mais qui travaille dans un cadre que j'ai défini et vers une destination que j'ai choisie.</p>
<p>Neuf mois plus tard, je n'ai donc pas abandonné l'idée de garder le contrôle. <strong>J'ai simplement appris à ne plus confondre contrôle et écriture du code.</strong></p>
  `.trim(),
};

export default post;
