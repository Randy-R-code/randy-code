import type { PostData } from "@/lib/blog";

const post: PostData = {
  slug: "securiser-analyseur-url-contre-ssrf",
  title: "Sécuriser un analyseur d'URL contre le SSRF",
  description:
    "InfraLens va chercher, côté serveur, n'importe quelle URL qu'un visiteur lui donne. C'est exactement la surface d'attaque SSRF. Retour sur les protections mises en place : classification IP, DNS rebinding, revalidation des redirections.",
  date: "2026-08-10",
  tags: ["sécurité", "SSRF", "InfraLens"],
  coverImage: "/blog/securiser-analyseur-url-contre-ssrf.jpg",
  content: `
<p>InfraLens fait une chose simple en apparence : on lui donne une URL, il va la chercher côté serveur et l'analyse. C'est exactement la définition d'une surface SSRF (Server-Side Request Forgery) — le serveur exécute une requête réseau vers une destination entièrement choisie par le visiteur.</p>

<h2>La menace qu'on oublie facilement</h2>
<p>Un analyseur d'URL qui se contente d'appeler <code>fetch(url)</code> ira aussi bien chercher <code>https://exemple.com</code> qu'<code>http://localhost</code>, une adresse du réseau interne, ou un endpoint de métadonnées cloud. Le check a l'air neutre — "j'analyse ce que tu me donnes" — mais sans filtrage, c'est une sonde qui permet de faire parler le serveur sur son propre réseau, à la place de l'attaquant.</p>

<h2>Le piège du DNS rebinding</h2>
<p>Valider une IP une seule fois ne suffit pas. Un domaine peut répondre par une IP publique au moment de la validation, puis pointer vers une IP privée au moment de la connexion réelle — ou proposer plusieurs enregistrements A dont un seul est bloqué. La vraie protection, c'est que la connexion se fasse exactement sur l'IP qui a été validée, sans laisser de fenêtre entre la vérification et la requête.</p>

<h2>Ce que j'ai mis en place</h2>
<p>La validation d'une cible passe maintenant par un pipeline en plusieurs étapes :</p>
<ul>
  <li>normalisation stricte de l'URL (protocole http/https uniquement, pas d'identifiants dans l'URL, ports autorisés) ;</li>
  <li>résolution DNS suivie d'une classification de l'IP obtenue, qui bloque loopback, plages privées, link-local et endpoints de métadonnées cloud, en IPv4 comme en IPv6, y compris leurs notations alternatives ;</li>
  <li>une connexion épinglée sur l'IP exactement validée, pour fermer la fenêtre de DNS rebinding entre la résolution et la requête réelle ;</li>
  <li>un suivi manuel des redirections, avec revalidation complète à chaque saut, plafonné à quelques sauts.</li>
</ul>
<p>La taille de la réponse est aussi plafonnée pendant le streaming plutôt que bufferisée sans limite, pour éviter qu'une cible malveillante ne serve une réponse volontairement énorme.</p>

<h2>Un compromis assumé</h2>
<p>Suivre les redirections à la main plutôt que de laisser <code>fetch</code> les gérer automatiquement ajoute de la complexité réelle : il faut reconstruire soi-même la marche à suivre, plafonner le nombre de sauts, revalider chaque étape. C'est plus de code à maintenir. Mais faire confiance à la gestion native des redirections aurait rouvert exactement la faille qu'on vient de fermer — une redirection ne doit jamais pouvoir atteindre une cible que la validation initiale aurait refusée.</p>

<h2>Une leçon qui dépasse le sujet SSRF</h2>
<p>La partie la plus intéressante n'a pas été d'écrire le filtre, mais de le prouver. Un test dédié vérifie que le blocage se déclenche avant qu'aucun appel réseau ne parte réellement — pas seulement que la réponse finale semble correcte. C'est la différence entre "ça a l'air protégé" et "c'est démontré".</p>
<p>Techniquement, j'ai aussi buté sur un détail Node peu documenté : on ne peut pas passer un <em>dispatcher</em> construit avec le paquet <code>undici</code> standalone au <code>fetch</code> global de Node — les deux s'appuient sur des copies internes distinctes d'undici, incompatibles entre elles. Il faut utiliser le <code>fetch</code> exporté par <code>undici</code> lui-même, dispatcher et appel réseau sur la même instance du début à la fin. Le genre de piège qu'on ne découvre qu'en vérifiant le comportement réel, pas en relisant le code.</p>

<h2>Résultat</h2>
<p>Vérifié en conditions réelles : une cible légitime continue de s'analyser normalement, tandis qu'une tentative sur une adresse interne est désormais rejetée proprement, avec un message clair, avant même qu'un seul des dix-huit checks ne démarre — plus d'analyse partielle silencieusement trompeuse.</p>

<h2>Conclusion</h2>
<p>Toute application qui va chercher une URL fournie par un utilisateur doit traiter le SSRF comme une menace principale, dès la conception — pas comme un correctif qu'on ajoute une fois le produit déjà en ligne. C'est un des chantiers de sécurité les plus formateurs que j'ai menés sur <a href="/projects/infralens">InfraLens</a> : la logique est simple à énoncer, mais chaque raccourci qu'on se permet en cours de route rouvre la porte qu'on venait de fermer.</p>
  `.trim(),
};

export default post;
