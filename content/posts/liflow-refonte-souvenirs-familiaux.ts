import type { PostData } from "@/lib/blog";

const post: PostData = {
  slug: "liflow-refonte-souvenirs-familiaux",
  title: "J'ai complètement repensé Liflow",
  description:
    "Comment devenir père m'a amené à jeter la moitié de mon SaaS et à recentrer Liflow sur une seule idée : garder les moments qui comptent.",
  date: "2026-05-16",
  tags: ["Liflow", "SaaS", "design produit", "retour d'expérience"],
  coverImage: "/blog/liflow-refonte-souvenirs-familiaux.jpg",
  content: `
<p>Ces derniers mois, ma vie personnelle a beaucoup changé. Et sans vraiment m'en rendre compte, ça a complètement changé ma façon de voir Liflow.</p>

<h2>Au départ, un SaaS comme les autres</h2>
<p>Quand j'ai commencé Liflow, je construisais surtout un outil. Il y avait beaucoup d'idées, beaucoup de fonctionnalités, beaucoup de possibilités. Des capsules, de l'organisation, du partage, des espaces, de l'IA un peu partout…</p>
<p>Sur le papier, tout ça avait du sens. Mais plus le projet avançait, plus j'avais l'impression de construire quelque chose de complet… sans construire quelque chose d'émotionnel. Liflow devenait une plateforme. Ce n'est pas ce que j'avais envie de créer.</p>

<h2>Le vrai déclic</h2>
<p>Le tournant est venu avec ma vie perso. Devenir père a changé ma façon de voir certaines choses de façon assez radicale.</p>
<p>Je me suis retrouvé avec des centaines de photos, des souvenirs éparpillés partout, des petits moments importants qui finissent perdus dans une galerie, dans des messages, ou simplement oubliés avec le temps.</p>

<h2>On capture beaucoup. On revit peu.</h2>
<p>C'est le constat le plus simple, et probablement le plus vrai : aujourd'hui on photographie tout, mais on ne revit presque rien. Les souvenirs s'accumulent quelque part dans un cloud, et on n'y retourne jamais vraiment.</p>
<p>À partir de là, j'ai compris que Liflow ne devait pas être un outil de productivité. Ni un réseau social. Ni une plateforme ultra-complète. Il devait devenir quelque chose de beaucoup plus simple : un endroit pour garder les moments importants de sa vie.</p>

<h2>Un recentrage radical</h2>
<p>J'ai retiré énormément de choses. Le scope est devenu beaucoup plus petit, mais beaucoup plus clair. Aujourd'hui, Liflow tourne autour d'une idée unique : le moment.</p>
<p>Un moment peut être une photo, quelques mots, une date, un souvenir. Avec le temps, tous ces moments forment une timeline de vie. C'est tout. Pas de dashboard, pas de modules, pas d'options cachées.</p>

<h2>Le souvenir du jour</h2>
<p>L'une des fonctionnalités que je préfère maintenant est probablement la plus simple : chaque jour, Liflow affiche un ancien moment aléatoire. Un sourire. Une balade. Une photo oubliée. Un instant tout simple.</p>
<p>Honnêtement, c'est là que j'ai commencé à ressentir ce que je voulais vraiment construire avec ce projet. Pas quand une feature technique marchait — quand un souvenir remontait à la surface.</p>

<h2>Moins, mais mieux</h2>
<p>J'ai aussi beaucoup simplifié la partie technique. Pas de Stripe pour le moment. Pas de dizaines de fonctionnalités. Juste des moments, une timeline, et une expérience calme et rapide.</p>
<p>Je veux que l'application donne envie d'être ouverte. Pas qu'elle ressemble à un dashboard de SaaS classique.</p>

<h2>Ce que ça m'a rappelé</h2>
<p>Cette refonte m'a confirmé quelque chose d'important : ajouter des fonctionnalités est facile. Construire une expérience simple et cohérente est beaucoup plus difficile. On a tendance à confondre les deux.</p>
<p>Pour la première fois depuis le début du projet, j'ai l'impression de construire le bon Liflow. Et surtout, un produit qui me ressemble vraiment.</p>
  `.trim(),
};

export default post;
