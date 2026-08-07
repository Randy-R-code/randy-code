# Randy Code — Refonte stratégique du portfolio et intégration d’InfraLens

> Document maître destiné à guider une IA de développement dans la refonte progressive de `randy-code.dev`, l’intégration d’InfraLens dans l’écosystème Randy Code et la mise en valeur correcte de Liflow.

---

## 0. Rôle de ce document

Ce fichier est la source de vérité du projet.

L’IA doit l’utiliser pour :

- comprendre la vision produit du portfolio ;
- éviter les modifications incohérentes ou trop larges ;
- travailler phase par phase ;
- préserver l’identité visuelle existante ;
- réorganiser le contenu sans transformer le site en portfolio générique ;
- intégrer InfraLens proprement sans coupler inutilement les dépôts ;
- présenter Liflow comme un produit actif et stratégique ;
- améliorer l’UX, le SEO, l’accessibilité, les performances et la crédibilité professionnelle ;
- fournir des résultats vérifiables à la fin de chaque phase.

L’IA ne doit pas appliquer toutes les phases en une seule fois. Chaque phase doit faire l’objet d’une branche, d’une revue et d’une validation avant de commencer la suivante.

---

# 1. Contexte

## 1.1 Propriétaire du portfolio

Randy est développeur logiciel, principalement sur :

- TypeScript ;
- React ;
- Next.js ;
- Tailwind CSS ;
- architectures SaaS ;
- applications web ;
- outils métier ;
- produits multi-tenant ;
- intégrations backend et services tiers.

Son expérience terrain comprend également des domaines non purement numériques, notamment la logistique, la gestion de stock, l’électricité et la mécanique. Cette expérience doit être présentée comme un avantage produit : compréhension des usages réels, des contraintes opérationnelles et des outils métier imparfaits.

## 1.2 État actuel du portfolio

Le portfolio utilise un univers visuel cartographique avec plusieurs zones :

- About Base ;
- Apps Station ;
- Background ;
- Knowledge Base ;
- Lab Zone ;
- Projects City ;
- SEO District.

Le concept est original et différenciant. Il doit être conservé.

Le problème principal n’est pas le design, mais l’architecture de l’information : plusieurs zones se chevauchent, certains libellés demandent un effort d’interprétation et les projets manquent de pages détaillées.

## 1.3 Produits principaux

### Liflow

Liflow est un produit actif.

Positionnement actuel :

- timeline privée de souvenirs familiaux ;
- capture de photos, dates et notes ;
- organisation chronologique ;
- partage dans un espace famille privé ;
- Daily Memory ;
- recherche et tags ;
- réactions et commentaires ;
- récits générés avec l’IA ;
- documentation et application complètes.

Liflow ne doit jamais être présenté comme abandonné, archivé ou ancien.

Dans le portfolio, Liflow doit être décrit comme :

- le produit SaaS principal de Randy ;
- une réalisation complète ;
- une preuve de compétences produit, UX, architecture, stockage privé, multi-tenant, médias, notifications et IA ;
- un produit réellement utilisé.

### InfraLens

InfraLens est un outil open source d’analyse technique de sites web.

Il inspecte notamment :

- DNS ;
- TLS ;
- headers HTTP et sécurité ;
- infrastructure ;
- hébergement et stack ;
- robots.txt et sitemap ;
- métadonnées ;
- signaux de performance ;
- recommandations et score global.

InfraLens doit devenir le premier outil phare de l’espace `Outils` de Randy Code.

La marque affichée doit être `InfraLens`, sans `.dev` dans le nom du produit.

Le dépôt GitHub InfraLens doit rester séparé du dépôt du portfolio.

---

# 2. Vision cible

## 2.1 Positionnement principal

Le portfolio doit présenter Randy comme un développeur TypeScript orienté produit, capable de construire :

- des applications SaaS complètes ;
- des outils web utiles ;
- des produits multi-tenant ;
- des interfaces soignées ;
- des solutions métier fondées sur des besoins concrets.

Le positionnement ne doit pas être fragmenté entre trop de rôles concurrents.

### Proposition de valeur recommandée

> Développeur TypeScript, je construis des applications web et des outils métier pensés pour des usages réels.

### Sous-titre recommandé

> React, Next.js et TypeScript — du prototype au produit déployé.

Ces textes peuvent être ajustés, mais le sens doit rester stable.

## 2.2 Hiérarchie cible

Le site doit répondre immédiatement à quatre questions :

1. Qui est Randy ?
2. Que construit-il ?
3. Qu’a-t-il déjà réalisé ?
4. Comment le contacter ?

## 2.3 Navigation cible

Navigation principale explicite :

- Accueil ;
- Projets ;
- Outils ;
- Articles ;
- À propos ;
- Contact.

Les noms de l’univers cartographique peuvent rester visibles en complément :

- Projets — Projects City ;
- Outils — Tools Station ;
- Articles — Knowledge Base ;
- À propos — About Base.

Un libellé imaginaire ne doit jamais être le seul indice permettant de comprendre une destination.

## 2.4 Architecture cible

```text
/
├── /projects
│   ├── /projects/liflow
│   ├── /projects/infralens
│   └── /projects/[autres-projets]
├── /tools
│   └── /tools/infralens
├── /articles
│   └── /articles/[slug]
├── /about
├── /contact
├── /legal si nécessaire
└── routes techniques Next.js
```

Compatibilité temporaire :

- `/blog` peut rediriger vers `/articles` ;
- les anciennes routes peuvent être redirigées si elles sont indexées ;
- `/apps` doit être supprimée ou redirigée vers `/projects` ou `/tools` ;
- `/background` doit être fusionnée dans `/about` ;
- `/seo` doit être repensée selon la décision produit ;
- `/lab` peut rester uniquement si son contenu est suffisamment démonstratif.

---

# 3. Principes non négociables

## 3.1 Préserver l’identité

Ne pas transformer le portfolio en :

- landing page SaaS générique ;
- template de portfolio avec photo, logos et cartes uniformes ;
- CV en ligne sans personnalité ;
- site rempli d’effets au détriment du contenu.

Conserver :

- la carte ;
- la notion d’univers ;
- les zones ;
- la personnalité visuelle ;
- les animations utiles ;
- l’aspect exploration.

## 3.2 Lisibilité avant créativité

Chaque élément créatif doit avoir une alternative explicite.

Exemple :

- `Projects City` peut exister ;
- le mot `Projets` doit également être visible.

## 3.3 Contenu factuel

Ne jamais inventer :

- utilisateurs ;
- chiffre d’affaires ;
- trafic ;
- scores Lighthouse ;
- temps de développement ;
- taux de conversion ;
- témoignages ;
- métriques produit ;
- technologies non utilisées.

Toute métrique affichée doit être :

- mesurée ;
- sourcée ;
- datée si elle peut varier.

## 3.4 Liflow est actif

Ne jamais employer pour Liflow :

- abandonné ;
- archivé ;
- ancien projet ;
- projet arrêté ;
- prototype inactif.

## 3.5 InfraLens n’est pas une marque dépendante du domaine

Toujours écrire :

- `InfraLens` pour le produit ;
- `infralens.dev` uniquement pour parler du domaine ou d’une URL.

## 3.6 Dépôts séparés

Ne pas fusionner le dépôt InfraLens dans le dépôt du portfolio sans raison architecturale forte et validation explicite.

Approche recommandée :

- portfolio et pages éditoriales dans `randy-code` ;
- application InfraLens dans `infralens` ;
- intégration par lien, sous-domaine ou rewrite.

## 3.7 Changements progressifs

Chaque phase doit :

- être autonome ;
- conserver un site fonctionnel ;
- éviter les refactorings sans rapport ;
- inclure tests et vérifications ;
- être documentée dans le changelog.

---

# 4. Décisions d’architecture de l’information

## 4.1 Apps Station

### Décision

Supprimer `Apps Station` comme catégorie autonome.

### Raison

Elle fait doublon avec :

- Projets pour les études de cas ;
- Outils pour les applications directement utilisables.

### Migration

- Liflow va dans `Projets` ;
- InfraLens va dans `Projets` et `Outils` ;
- les autres applications sont classées selon leur usage.

## 4.2 Projects City

### Nouveau rôle

Projects City devient l’espace des études de cas.

Une carte projet doit répondre à :

- quel problème ?
- quelle solution ?
- quel rôle pour Randy ?
- quelles technologies ?
- quel statut ?
- où voir le produit ?

Chaque projet majeur doit avoir sa propre page.

## 4.3 Tools Station

### Nouveau rôle

Tools Station devient l’espace des outils utilisables immédiatement.

Premier outil : InfraLens.

À terme, il peut accueillir :

- outils réseau ;
- outils web ;
- utilitaires développeur ;
- petits calculateurs métier ;
- démonstrateurs techniques.

Un outil doit avoir une fonction réelle. Ne pas remplir la page avec des outils factices.

## 4.4 Knowledge Base

Renommer publiquement en `Articles`, tout en conservant `Knowledge Base` comme nom d’univers.

Les articles doivent être basés en priorité sur des expériences réelles :

- architecture d’InfraLens ;
- SSRF et analyse d’URL ;
- construction de Liflow ;
- stockage privé de médias ;
- multi-tenant ;
- Daily Memory ;
- comparaison de stacks ;
- outils métier et gestion de stock.

## 4.5 Background

Fusionner dans la page À propos.

Présenter l’expérience terrain comme un avantage :

- compréhension des opérations ;
- sens des contraintes ;
- proximité avec les utilisateurs non techniques ;
- capacité à traduire un processus métier en produit logiciel.

## 4.6 SEO District

Deux options possibles. L’IA ne doit pas choisir seule :

### Option A — véritable service commercial

Conserver une page dédiée avec :

- cible ;
- problème ;
- livrables ;
- méthode ;
- exemples ;
- résultats mesurés ;
- FAQ ;
- CTA.

### Option B — compétence intégrée

Supprimer la zone autonome et intégrer le SEO :

- dans À propos ;
- dans les études de cas ;
- dans les articles ;
- éventuellement dans une section Services.

### Recommandation par défaut

Choisir l’option B tant qu’il n’existe pas d’offre commerciale structurée et active.

## 4.7 Lab Zone

Conserver uniquement des éléments démontrables :

- prototype fonctionnel ;
- dépôt ;
- capture ;
- note technique ;
- architecture ;
- résultat concret.

Éviter une simple liste de projets `en cours`, `en pause` ou `usage quotidien` sans contenu exploitable.

---

# 5. Page d’accueil cible

## 5.1 Objectif

En moins de dix secondes, le visiteur doit comprendre :

- Randy est développeur TypeScript ;
- il construit des produits web complets ;
- Liflow et InfraLens sont ses réalisations principales ;
- il est possible d’explorer les projets ou de le contacter.

## 5.2 Structure recommandée

### Section 1 — Hero stable

Contenu :

- eyebrow éventuel : `Développeur TypeScript` ;
- H1 stable ;
- sous-titre stable ;
- CTA principal : `Voir mes projets` ;
- CTA secondaire : `Me contacter` ;
- lien tertiaire : `GitHub`.

Ne pas générer aléatoirement le H1 ou la proposition de valeur côté serveur.

### Section 2 — Carte interactive

La carte reste le cœur différenciant de l’expérience.

Chaque destination doit afficher :

- nom explicite ;
- nom d’univers ;
- description courte ;
- état focus/hover ;
- destination clavier ;
- lien HTML accessible.

### Section 3 — Accès alternatif

Sous la carte, afficher une grille accessible :

- Projets ;
- Outils ;
- Articles ;
- À propos.

Elle doit fonctionner :

- sans animation ;
- au clavier ;
- sur mobile ;
- avec réduction des mouvements.

### Section 4 — Projets phares

Afficher au minimum :

1. Liflow ;
2. InfraLens.

Pour chaque carte :

- nom ;
- statut ;
- phrase de valeur ;
- capture ;
- stack courte ;
- lien étude de cas ;
- lien produit si pertinent.

### Section 5 — Profil synthétique

Inclure :

- spécialisation ;
- expérience terrain ;
- approche produit ;
- lien À propos.

### Section 6 — CTA final

Exemple :

> Un produit, un outil métier ou une idée à concrétiser ?

Bouton : `Discuter du projet`.

## 5.3 Contraintes techniques

- Hero rendu statiquement si possible ;
- éviter `force-dynamic` sans nécessité ;
- contenu essentiel présent dans le HTML initial ;
- animations non bloquantes ;
- images avec dimensions ;
- aucune animation indispensable à la compréhension ;
- respecter `prefers-reduced-motion`.

---

# 6. Page Projets

## 6.1 Objectif

Démontrer la capacité de Randy à résoudre des problèmes, pas uniquement afficher des technologies.

## 6.2 Structure de la liste

Filtres facultatifs :

- Produit ;
- Outil ;
- Client ;
- Expérimentation.

Ne pas ajouter de filtres si le nombre de projets est trop faible.

## 6.3 Carte projet

Champs recommandés :

```ts
interface ProjectSummary {
  slug: string;
  name: string;
  type: "product" | "tool" | "client" | "experiment";
  status: "active" | "maintained" | "completed" | "experimental";
  tagline: string;
  problem: string;
  outcome: string;
  technologies: string[];
  image: string;
  projectUrl?: string;
  repositoryUrl?: string;
  featured: boolean;
}
```

Éviter de stocker des textes éditoriaux longs directement dans les composants.

## 6.4 Étude de cas standard

Chaque page `/projects/[slug]` doit contenir :

1. Hero du projet ;
2. résumé ;
3. contexte ;
4. problème ;
5. objectifs ;
6. contraintes ;
7. rôle de Randy ;
8. solution ;
9. architecture ;
10. choix techniques ;
11. difficultés ;
12. sécurité et confidentialité si pertinentes ;
13. résultats ;
14. captures ;
15. enseignements ;
16. prochaines étapes ;
17. liens.

## 6.5 Statuts

Statuts visibles et honnêtes :

- Produit actif ;
- Maintenu ;
- Projet client livré ;
- Expérimentation ;
- Prototype ;
- Archivé uniquement si réellement archivé.

---

# 7. Étude de cas Liflow

## 7.1 Positionnement

Liflow est le projet phare du portfolio.

Résumé recommandé :

> Une timeline familiale privée pour capturer, organiser, partager et redécouvrir les souvenirs qui comptent.

## 7.2 Éléments à présenter

- problème des souvenirs dispersés ;
- volonté de confidentialité ;
- ajout rapide depuis mobile ;
- timeline ;
- tags et recherche ;
- espace famille multi-membres ;
- isolation des données ;
- photos et vidéos privées ;
- Daily Memory ;
- réactions et commentaires ;
- notifications ;
- récits IA opt-in ;
- documentation ;
- expérience PWA/mobile si applicable.

## 7.3 Angles techniques à valoriser

Uniquement s’ils sont confirmés dans le code :

- multi-tenant ;
- authentification ;
- rôles ;
- autorisations ;
- stockage objet ;
- URLs signées ;
- traitement média ;
- tâches différées ;
- notifications push ;
- génération IA ;
- recherche ;
- stratégie de confidentialité ;
- isolation par organisation.

## 7.4 Captures recommandées

- landing ;
- dashboard ;
- création d’un moment ;
- timeline ;
- Daily Memory ;
- vue d’un moment ;
- partage familial ;
- mobile.

Les données personnelles doivent être masquées ou remplacées par des données de démonstration.

## 7.5 Résultats

Afficher uniquement des résultats confirmés :

- témoignages réels ;
- nombre de fonctions livrées ;
- état actif ;
- usage réel ;
- métriques anonymisées si disponibles et pertinentes.

Ne pas transformer la page portfolio en copie de la landing Liflow.

La landing vend le produit. L’étude de cas explique comment Randy l’a conçu.

---

# 8. Étude de cas InfraLens

## 8.1 Positionnement

Résumé recommandé :

> Un outil open source qui rassemble les principaux signaux techniques d’un site dans un rapport lisible.

## 8.2 Éléments à présenter

- origine du besoin ;
- fragmentation des informations techniques ;
- catégories analysées ;
- exécution serveur ;
- score ;
- recommandations ;
- rapport ;
- historique local ;
- export ;
- PWA si toujours disponible ;
- licence open source ;
- architecture modulaire.

## 8.3 Architecture

Documenter :

- formulaire ;
- validation URL ;
- orchestration ;
- checks parallèles ;
- timeouts ;
- agrégation ;
- scoring ;
- rendu des résultats ;
- gestion des erreurs ;
- rate limiting.

## 8.4 Sécurité prioritaire

Toute application qui récupère une URL fournie par un utilisateur doit traiter le SSRF comme une menace principale.

Vérifications attendues :

- protocoles HTTP/HTTPS uniquement ;
- blocage localhost ;
- blocage IPv4 privées ;
- blocage IPv6 privées/locales ;
- blocage link-local ;
- blocage des endpoints de métadonnées cloud ;
- résolution DNS contrôlée ;
- validation avant requête ;
- validation après résolution ;
- revalidation à chaque redirection ;
- nombre maximum de redirections ;
- timeout global ;
- timeout par check ;
- limite de taille de réponse ;
- limite de décompression ;
- user-agent explicite ;
- gestion des ports ;
- prévention DNS rebinding autant que possible ;
- journalisation sans données sensibles.

## 8.5 Rate limiting

Éviter un stockage uniquement en mémoire en production serverless.

Approche cible :

- stockage persistant distribué ;
- clé basée sur un hash de l’IP ;
- fenêtre glissante ou token bucket ;
- réponse 429 documentée ;
- headers de limite ;
- stratégie de développement locale séparée.

## 8.6 Tests attendus

- domaines valides ;
- domaines inexistants ;
- redirections ;
- boucle de redirection ;
- certificat expiré ;
- réponse lente ;
- réponse énorme ;
- HTML invalide ;
- contenu non HTML ;
- URL locale ;
- IP privée ;
- IPv6 ;
- ports non standards ;
- scoring déterministe ;
- erreurs partielles ;
- timeout d’un seul check ;
- rapport partiel.

---

# 9. Espace Outils et intégration d’InfraLens

## 9.1 Expérience cible

`/tools` présente les outils disponibles.

`/tools/infralens` doit permettre :

- de comprendre l’outil ;
- de voir un exemple ;
- de lancer l’outil ;
- d’accéder au code ;
- d’accéder à l’étude de cas.

## 9.2 Options d’intégration

### Option recommandée — landing intégrée + application séparée

- `randy-code.dev/tools/infralens` : page éditoriale ;
- `infralens.randy-code.dev` : application ;
- dépôt InfraLens inchangé ;
- CTA clair vers l’application.

Avantages :

- faible couplage ;
- déploiement indépendant ;
- maintenance simple ;
- cohérence de marque ;
- migration réversible.

### Option avancée — rewrite

Exposer l’application sous :

- `randy-code.dev/tools/infralens/*`.

Avant cette option, vérifier :

- basePath ;
- assets ;
- manifest PWA ;
- service worker ;
- canonical ;
- metadata ;
- Open Graph ;
- routing client ;
- API routes ;
- cookies ;
- CSP ;
- CORS.

### Option non recommandée actuellement — monorepo

Ne choisir un monorepo que si plusieurs éléments sont réellement partagés :

- design system ;
- composants ;
- tokens ;
- auth ;
- types ;
- logique métier.

## 9.3 Domaine infralens.dev

Plan recommandé :

1. renommer le produit affiché en `InfraLens` ;
2. mesurer le trafic et les backlinks ;
3. créer la destination Randy Code ;
4. mettre en place une redirection 301 ;
5. conserver le domaine pendant la transition si le coût est acceptable ;
6. décider du non-renouvellement avec des données réelles.

Ne pas laisser expirer le domaine avant la migration si des liens externes significatifs existent.

---

# 10. Page À propos

## 10.1 Structure

1. introduction personnelle ;
2. approche produit ;
3. parcours ;
4. expérience terrain ;
5. compétences principales ;
6. stack hiérarchisée ;
7. produits actuels ;
8. méthode de travail ;
9. CTA contact.

## 10.2 Stack

Présenter par niveau d’usage.

Exemple :

### Principal

- TypeScript ;
- React ;
- Next.js ;
- Tailwind CSS.

### Backend et données

- Node.js ;
- Prisma ;
- PostgreSQL ;
- Convex si utilisé activement.

### Produit et infrastructure

- authentification ;
- paiements ;
- emails ;
- stockage ;
- jobs ;
- déploiement.

### Expérimentations

- fournisseurs IA ;
- outils récents ;
- technologies secondaires.

Ne pas afficher une technologie simplement parce qu’elle a été testée une fois.

## 10.3 Expérience terrain

Texte directeur :

> Mon expérience dans des environnements opérationnels m’aide à concevoir des produits adaptés aux contraintes réelles, aux flux de travail et aux utilisateurs qui n’ont pas envie de s’adapter à un logiciel compliqué.

Ne pas surjouer cette expérience ni la présenter comme une expertise logicielle spécifique sans preuve.

---

# 11. Articles

## 11.1 Objectifs

- renforcer la crédibilité ;
- documenter les choix ;
- améliorer le référencement ;
- transmettre des apprentissages réels ;
- relier les contenus aux projets.

## 11.2 Sujets prioritaires

1. Architecture d’InfraLens ;
2. Sécuriser un analyseur d’URL contre le SSRF ;
3. Construire une timeline familiale privée ;
4. Concevoir le Daily Memory ;
5. Isolation multi-tenant et permissions ;
6. Stockage privé de médias ;
7. Ce que la construction de Liflow a appris à Randy ;
8. Construire un outil métier autour d’un ERP existant ;
9. Comparaison Prisma/PostgreSQL et Convex ;
10. Construire un portfolio qui reste lisible malgré un concept créatif.

## 11.3 Qualité éditoriale

Chaque article doit contenir :

- contexte ;
- problème ;
- choix ;
- compromis ;
- code seulement si utile ;
- résultat ;
- enseignements ;
- liens vers les projets concernés.

Éviter les articles génériques réécrivant la documentation officielle.

---

# 12. SEO

## 12.1 Métadonnées globales

Vérifier :

- title template ;
- description ;
- metadataBase ;
- canonical ;
- Open Graph ;
- Twitter cards ;
- favicon ;
- manifest ;
- robots ;
- sitemap.

## 12.2 Métadonnées par page

Chaque page projet doit avoir :

- titre unique ;
- description spécifique ;
- image OG ;
- canonical ;
- type article ou website adapté ;
- date de mise à jour si pertinente.

## 12.3 Données structurées

Envisager :

- `Person` ;
- `WebSite` ;
- `SoftwareApplication` pour Liflow et InfraLens ;
- `Article` pour les articles ;
- `BreadcrumbList` ;
- `CreativeWork` ou `SoftwareSourceCode` selon les pages.

Ne pas ajouter de données structurées contenant des informations absentes de la page visible.

## 12.4 Redirections

Préparer des redirections permanentes pour :

- anciennes routes ;
- `/apps` ;
- `/background` ;
- `/blog` si renommé ;
- `/seo` si supprimé ;
- domaine InfraLens si migration.

## 12.5 Contenu

Éviter :

- répétition exacte entre landing produit et étude de cas ;
- titres vagues ;
- pages minces ;
- descriptions identiques ;
- pages artificielles créées uniquement pour le SEO.

---

# 13. Accessibilité

## 13.1 Minimum attendu

- navigation clavier complète ;
- focus visible ;
- ordre de tabulation logique ;
- landmarks ;
- un H1 par page ;
- hiérarchie de titres correcte ;
- labels de formulaire ;
- erreurs compréhensibles ;
- contrastes suffisants ;
- alternatives textuelles ;
- états non indiqués uniquement par couleur ;
- respect de `prefers-reduced-motion` ;
- modales correctement gérées ;
- cibles tactiles suffisantes.

## 13.2 Carte interactive

La carte doit :

- utiliser de vrais liens ou boutons ;
- être utilisable au clavier ;
- exposer un nom accessible ;
- ne pas piéger le focus ;
- disposer d’une navigation alternative ;
- conserver la compréhension sans survol.

## 13.3 Tests

Tester au minimum :

- axe ;
- Lighthouse accessibility ;
- clavier manuel ;
- mobile ;
- mode réduction des animations ;
- lecteur d’écran sur les parcours principaux si possible.

---

# 14. Performance

## 14.1 Objectifs

- rendu initial rapide ;
- JavaScript limité ;
- animations ciblées ;
- images optimisées ;
- polices maîtrisées ;
- absence de layout shifts importants.

## 14.2 Actions

- supprimer le rendu dynamique injustifié ;
- préférer les Server Components ;
- limiter les composants client ;
- charger Framer Motion seulement où nécessaire ;
- utiliser `next/image` ;
- dimensionner les images ;
- réduire les images OG non nécessaires au runtime ;
- analyser le bundle ;
- éviter les dépendances redondantes ;
- précharger uniquement les ressources critiques.

## 14.3 Mesure

Mesurer avant et après :

- Lighthouse mobile ;
- Lighthouse desktop ;
- Core Web Vitals ;
- bundle client ;
- taille des images ;
- nombre de requêtes ;
- pages principales.

Conserver les rapports dans `docs/audits/` ou une autre structure claire.

---

# 15. Sécurité et confidentialité

## 15.1 Portfolio

Vérifier :

- validation du formulaire de contact ;
- anti-spam ;
- rate limiting ;
- gestion des erreurs ;
- absence de secrets côté client ;
- CSP ;
- headers de sécurité ;
- dépendances ;
- sanitization des articles si contenu dynamique ;
- protection des routes serveur.

## 15.2 InfraLens

La sécurité SSRF est prioritaire. Voir section dédiée.

## 15.3 Liflow dans le portfolio

Ne jamais exposer :

- données privées ;
- médias réels sans consentement ;
- URLs signées ;
- identifiants ;
- captures contenant des informations personnelles ;
- détails internes permettant un contournement de sécurité.

---

# 16. Architecture du contenu

## 16.1 Source de données

Créer une source unique pour les projets.

Options :

- fichiers TypeScript typés ;
- MDX ;
- contenu Markdown avec frontmatter.

Recommandation : MDX ou contenu typé centralisé, selon les outils déjà en place.

## 16.2 Éviter

- duplications entre homepage, liste et étude de cas ;
- textes longs dans plusieurs composants ;
- URLs codées à plusieurs endroits ;
- statuts divergents ;
- stacks divergentes.

## 16.3 Modèle possible

```ts
export interface ProjectCaseStudy {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  status: "active" | "maintained" | "completed" | "experimental";
  category: "product" | "tool" | "client" | "experiment";
  featured: boolean;
  launchedAt?: string;
  updatedAt: string;
  links: {
    website?: string;
    repository?: string;
    documentation?: string;
  };
  technologies: string[];
  highlights: string[];
  cover: {
    src: string;
    alt: string;
  };
  seo: {
    title: string;
    description: string;
    image?: string;
  };
}
```

---

# 17. Design system

## 17.1 Objectif

Préserver l’univers tout en améliorant la cohérence.

## 17.2 Tokens

Centraliser :

- couleurs ;
- typographie ;
- espacements ;
- rayons ;
- ombres ;
- durées d’animation ;
- easing ;
- largeurs de contenu ;
- breakpoints utiles.

## 17.3 Composants à factoriser

- PageShell ;
- PageHeader ;
- SectionHeader ;
- ProjectCard ;
- ToolCard ;
- StatusBadge ;
- TechnologyList ;
- CTAGroup ;
- CaseStudySection ;
- ScreenshotGallery ;
- ExternalLink ;
- Breadcrumbs ;
- EmptyState ;
- ErrorState.

Ne pas factoriser prématurément les composants utilisés une seule fois.

## 17.4 Animations

Principes :

- fonctionnelles ;
- courtes ;
- cohérentes ;
- annulables via reduced motion ;
- pas de délai excessif ;
- pas d’animation bloquant un CTA ;
- pas de mouvement permanent distrayant.

---

# 18. Qualité du code

## 18.1 Standards

- TypeScript strict ;
- pas de `any` sans justification ;
- composants petits et lisibles ;
- données séparées de la présentation ;
- gestion d’erreur explicite ;
- imports cohérents ;
- aucun warning ;
- pas de code mort ;
- pas de commentaire obsolète.

## 18.2 Validation avant commit

Exécuter selon les scripts disponibles :

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Si un script n’existe pas, le documenter. Ne pas prétendre qu’il a été exécuté.

## 18.3 Tests recommandés

- unitaires pour les utilitaires ;
- composants critiques ;
- navigation ;
- génération de metadata ;
- formulaires ;
- redirections ;
- e2e sur parcours principaux.

Parcours e2e minimum :

1. homepage vers Liflow ;
2. homepage vers InfraLens ;
3. navigation mobile ;
4. formulaire contact ;
5. liste projets vers étude de cas ;
6. page outil vers application InfraLens.

---

# 19. Plan phase par phase

## Phase 0 — Audit local et baseline

### Objectif

Établir l’état réel avant toute modification.

### Tâches

- lire README, CHANGELOG et structure ;
- inventorier toutes les routes ;
- inventorier les composants ;
- inventorier les contenus ;
- rechercher toutes les occurrences de Liflow et InfraLens ;
- identifier les routes dynamiques ;
- identifier les composants client ;
- lancer lint, typecheck, tests et build ;
- prendre des captures desktop/mobile ;
- enregistrer Lighthouse ;
- vérifier sitemap, robots et metadata ;
- vérifier les liens cassés ;
- relever les redirections nécessaires.

### Livrables

- `docs/audits/baseline.md` ;
- rapports Lighthouse ;
- inventaire des routes ;
- liste des problèmes classés P0/P1/P2/P3.

### Critères de sortie

- état initial documenté ;
- aucune modification fonctionnelle majeure ;
- métriques de comparaison disponibles.

---

## Phase 1 — Correction du contenu et cohérence produit

### Objectif

Corriger immédiatement les informations fausses, ambiguës ou obsolètes.

### Tâches

- présenter Liflow comme actif ;
- mettre à jour sa description ;
- renommer `infralens.dev` en `InfraLens` dans les textes ;
- conserver les URLs réelles ;
- stabiliser le H1 de la homepage ;
- corriger les statuts des projets ;
- vérifier les technologies affichées ;
- retirer les promesses non mesurées ;
- revoir les CTA ;
- corriger les fautes et incohérences.

### Livrables

- contenu exact sur toutes les pages ;
- copie cohérente ;
- changelog.

### Critères de sortie

- Liflow n’est jamais présenté comme archivé ;
- InfraLens est la marque affichée ;
- aucune métrique inventée ;
- aucun lien cassé.

---

## Phase 2 — Nouvelle navigation et architecture d’information

### Objectif

Simplifier les destinations sans perdre l’univers.

### Tâches

- créer navigation principale explicite ;
- conserver les noms cartographiques en secondaire ;
- créer `/tools` ;
- renommer `/blog` en `/articles` ou préparer la redirection ;
- préparer la suppression de `/apps` ;
- fusionner Background dans About ;
- décider du traitement de SEO District ;
- mettre à jour la carte ;
- créer navigation mobile ;
- ajouter breadcrumbs sur pages profondes.

### Livrables

- navigation desktop ;
- navigation mobile ;
- plan de redirections ;
- nouvelle carte des routes.

### Critères de sortie

- toute destination est compréhensible sans connaître l’univers ;
- aucune perte d’accès ;
- navigation clavier fonctionnelle ;
- anciennes URLs importantes redirigées.

---

## Phase 3 — Refonte de la homepage

### Objectif

Clarifier la proposition de valeur et présenter les projets phares.

### Tâches

- hero stable ;
- CTA Projets et Contact ;
- lien GitHub ;
- carte améliorée ;
- grille alternative ;
- section projets phares ;
- section profil ;
- CTA final ;
- responsive ;
- reduced motion.

### Livrables

- nouvelle homepage complète ;
- captures desktop/mobile ;
- comparaison Lighthouse.

### Critères de sortie

- positionnement compris immédiatement ;
- Liflow et InfraLens visibles ;
- aucun contenu essentiel dépend d’une animation ;
- HTML initial contient le message principal.

---

## Phase 4 — Système de contenu projets

### Objectif

Centraliser les données et préparer les études de cas.

### Tâches

- définir les types ;
- créer source de données unique ;
- migrer les cartes existantes ;
- créer template `/projects/[slug]` ;
- générer metadata ;
- ajouter statut, stack, liens ;
- créer galerie ;
- créer composants de cas d’étude.

### Livrables

- système réutilisable ;
- liste projets ;
- page générique ;
- tests de données.

### Critères de sortie

- aucune duplication majeure ;
- ajout d’un projet simple et documenté ;
- metadata unique par projet ;
- build statique ou dynamique maîtrisé.

---

## Phase 5 — Étude de cas Liflow

### Objectif

Créer la meilleure preuve de capacité produit du portfolio.

### Tâches

- rédiger contenu ;
- préparer captures anonymisées ;
- expliquer le problème ;
- documenter les fonctions ;
- expliquer les choix techniques confirmés ;
- présenter confidentialité et multi-tenant ;
- présenter Daily Memory ;
- ajouter liens produit/docs ;
- ajouter CTA.

### Livrables

- `/projects/liflow` ;
- image OG ;
- captures optimisées ;
- metadata ;
- liens croisés.

### Critères de sortie

- produit présenté comme actif ;
- différence claire entre landing produit et étude de cas ;
- aucune donnée privée exposée ;
- contenu factuel.

---

## Phase 6 — Étude de cas InfraLens

### Objectif

Montrer la profondeur technique d’InfraLens.

### Tâches

- rédiger le cas d’étude ;
- illustrer le pipeline d’analyse ;
- documenter les catégories ;
- expliquer scoring ;
- documenter limites ;
- mettre en valeur open source ;
- ajouter CTA outil et GitHub ;
- créer image OG.

### Livrables

- `/projects/infralens` ;
- diagramme architecture ;
- captures ;
- metadata.

### Critères de sortie

- valeur et architecture compréhensibles ;
- liens corrects ;
- aucune affirmation sécurité non vérifiée.

---

## Phase 7 — Espace Outils

### Objectif

Faire d’InfraLens le premier outil utilisable de l’écosystème Randy Code.

### Tâches

- créer `/tools` ;
- créer `/tools/infralens` ;
- présenter aperçu de rapport ;
- ajouter exemple ;
- CTA lancement ;
- lien étude de cas ;
- lien GitHub ;
- décider sous-domaine ou rewrite ;
- harmoniser la marque.

### Livrables

- liste outils ;
- page InfraLens ;
- intégration fonctionnelle ;
- analytics respectueux de la confidentialité si utilisés.

### Critères de sortie

- utilisateur comprend la différence Projet/Outil ;
- application accessible ;
- identité cohérente ;
- dépôt séparé.

---

## Phase 8 — Amélioration propre d’InfraLens

### Objectif

Renforcer le produit avant ou pendant sa migration.

### Sous-phase 8A — Branding et landing

- afficher `InfraLens` ;
- clarifier la proposition de valeur ;
- ajouter aperçu de rapport ;
- ajouter exemples ;
- remonter GitHub ;
- expliquer no account/no tracking si exact.

### Sous-phase 8B — Sécurité

- audit SSRF ;
- blocage IP privées ;
- validation redirections ;
- timeouts ;
- limites ;
- tests ;
- journalisation.

### Sous-phase 8C — Infrastructure

- rate limiting distribué ;
- observabilité ;
- erreurs structurées ;
- suivi des temps par check ;
- configuration par environnement.

### Sous-phase 8D — Produit

- rapports partageables ;
- comparaison avant/après ;
- export amélioré ;
- historique ;
- détails méthodologiques ;
- version du moteur d’analyse.

### Critères de sortie

- menaces SSRF traitées et testées ;
- rate limiting adapté au déploiement ;
- landing montre la valeur réelle ;
- analyse reste utile en cas d’échec partiel.

---

## Phase 9 — À propos, Background et stack

### Objectif

Présenter un profil cohérent et crédible.

### Tâches

- fusionner Background ;
- rédiger parcours ;
- relier expérience terrain et produit ;
- hiérarchiser stack ;
- présenter produits actifs ;
- ajouter méthode ;
- ajouter CTA.

### Critères de sortie

- profil clair ;
- pas de liste de technologies gonflée ;
- expérience terrain utile au récit ;
- contenu actuel.

---

## Phase 10 — Articles et contenu technique

### Objectif

Transformer Knowledge Base en preuve d’expertise.

### Tâches

- migrer route ;
- créer modèle article ;
- ajouter catégories/tags si utiles ;
- rédiger deux articles prioritaires ;
- ajouter liens projets ;
- RSS si pertinent ;
- metadata Article ;
- table des matières.

### Première publication recommandée

1. Architecture d’InfraLens ;
2. Sécuriser un analyseur d’URL.

### Critères de sortie

- au moins deux articles de fond ;
- contenu original ;
- code accessible ;
- liens internes cohérents.

---

## Phase 11 — SEO technique et migrations

### Objectif

Finaliser l’indexation et éviter les pertes.

### Tâches

- sitemap ;
- robots ;
- canonical ;
- metadata ;
- JSON-LD ;
- redirections ;
- liens internes ;
- 404 ;
- Open Graph ;
- Search Console ;
- migration InfraLens ;
- 301 du domaine si décidé.

### Critères de sortie

- aucune ancienne URL importante en 404 ;
- canonical correcte ;
- sitemap sans routes obsolètes ;
- pages principales indexables.

---

## Phase 12 — Accessibilité, performance et QA finale

### Objectif

Valider la qualité de production.

### Tâches

- audit clavier ;
- audit axe ;
- Lighthouse ;
- mobile réel ;
- navigateurs ;
- reduced motion ;
- liens ;
- formulaires ;
- erreurs ;
- responsive ;
- build ;
- tests e2e ;
- bundle ;
- sécurité headers.

### Critères de sortie

- aucun défaut bloquant ;
- pas de régression majeure par rapport à la baseline ;
- parcours principaux validés ;
- documentation à jour.

---

## Phase 13 — Mise en ligne et suivi

### Objectif

Déployer avec une stratégie mesurable.

### Tâches

- sauvegarde état précédent ;
- preview ;
- validation ;
- déploiement ;
- smoke tests ;
- surveillance erreurs ;
- vérification redirections ;
- vérification analytics ;
- suivi trafic InfraLens ;
- décision renouvellement domaine.

### Critères de sortie

- production stable ;
- erreurs surveillées ;
- redirections confirmées ;
- données disponibles pour décision du domaine.

---

# 20. Priorisation

## P0 — Bloquant / exactitude

- corriger le statut de Liflow ;
- supprimer toute information factuellement fausse ;
- vérifier liens ;
- traiter les risques SSRF critiques d’InfraLens ;
- ne pas casser les routes existantes.

## P1 — Forte valeur

- nouvelle navigation ;
- homepage stable ;
- pages Liflow et InfraLens ;
- espace Outils ;
- contenu centralisé ;
- accessibilité carte ;
- rate limiting InfraLens.

## P2 — Amélioration

- articles ;
- rapports partageables ;
- comparaison InfraLens ;
- données structurées ;
- galerie avancée ;
- timeline About.

## P3 — Optionnel

- monorepo ;
- CMS ;
- filtres complexes ;
- animations avancées ;
- plusieurs outils additionnels ;
- internationalisation complète.

---

# 21. Méthode de travail imposée à l’IA

Pour chaque phase, l’IA doit suivre ce processus.

## Étape 1 — Lire

- lire ce document ;
- lire les fichiers concernés ;
- lire les conventions du projet ;
- vérifier les changements précédents.

## Étape 2 — Auditer

Avant de modifier :

- expliquer brièvement l’état actuel ;
- lister les fichiers concernés ;
- identifier les risques ;
- confirmer que la phase ne dépend pas d’une autre non terminée.

## Étape 3 — Planifier

Fournir :

- objectif ;
- fichiers à créer ;
- fichiers à modifier ;
- migrations ;
- tests ;
- risques.

## Étape 4 — Implémenter

Règles :

- modifications minimales ;
- pas de refactor hors périmètre ;
- types stricts ;
- composants accessibles ;
- contenu centralisé ;
- aucune dépendance sans justification.

## Étape 5 — Vérifier

- lint ;
- typecheck ;
- tests ;
- build ;
- inspection des routes ;
- inspection responsive ;
- vérification clavier.

## Étape 6 — Rendre compte

À la fin, fournir :

- résumé ;
- fichiers modifiés ;
- décisions ;
- tests exécutés ;
- résultats ;
- éléments non vérifiés ;
- prochaine phase recommandée.

---

# 22. Format de compte-rendu attendu

```md
## Phase terminée

### Résultat

...

### Fichiers créés

- ...

### Fichiers modifiés

- ...

### Décisions

- ...

### Vérifications

- `pnpm lint`: succès/échec/non disponible
- `pnpm typecheck`: succès/échec/non disponible
- `pnpm test`: succès/échec/non disponible
- `pnpm build`: succès/échec/non exécuté

### Vérifications manuelles

- Desktop : ...
- Mobile : ...
- Clavier : ...
- Reduced motion : ...

### Points restant ouverts

- ...

### Prochaine phase

...
```

---

# 23. Prompt de démarrage recommandé pour l’IA

```text
Lis intégralement PORTFOLIO_REDESIGN_MASTER_PLAN.md et considère-le comme la source de vérité.

Travaille uniquement sur la phase indiquée. Ne commence aucune phase suivante. Commence par auditer le code réellement présent et compare-le aux objectifs de la phase. Présente ensuite un plan précis des fichiers à modifier, puis implémente les changements de manière minimale et cohérente.

Contraintes permanentes :
- préserver l’identité cartographique du portfolio ;
- rendre les libellés explicites ;
- Liflow est un produit actif ;
- afficher la marque InfraLens sans `.dev` ;
- conserver le dépôt InfraLens séparé ;
- ne jamais inventer de métriques ou de fonctionnalités ;
- ne pas effectuer de refactor hors périmètre ;
- respecter TypeScript strict, accessibilité, SEO et reduced motion ;
- exécuter les vérifications disponibles et rapporter exactement les résultats.

Phase à réaliser : [NUMÉRO ET NOM DE LA PHASE]
```

---

# 24. Prompt pour audit d’une phase

```text
Audite la phase [NUMÉRO] du document PORTFOLIO_REDESIGN_MASTER_PLAN.md sans modifier le code.

Retourne :
1. l’état actuel ;
2. les écarts avec le document ;
3. les fichiers concernés ;
4. les dépendances ;
5. les risques ;
6. le plan d’implémentation ;
7. les tests à prévoir ;
8. les questions réellement bloquantes uniquement.

N’invente aucune information absente du dépôt.
```

---

# 25. Prompt pour revue de fin de phase

```text
Effectue une revue complète de la phase [NUMÉRO] par rapport à PORTFOLIO_REDESIGN_MASTER_PLAN.md.

Vérifie :
- conformité fonctionnelle ;
- contenu ;
- TypeScript ;
- accessibilité ;
- responsive ;
- SEO ;
- performance ;
- sécurité ;
- tests ;
- absence de régression ;
- absence de travail prématuré sur les phases suivantes.

Classe les problèmes en P0, P1, P2 et P3. Corrige uniquement P0 et P1 si la demande inclut explicitement une correction.
```

---

# 26. Définition globale de terminé

Le projet est considéré terminé lorsque :

- le positionnement est immédiatement compréhensible ;
- Liflow est correctement présenté comme le produit principal actif ;
- InfraLens est correctement présenté comme outil open source ;
- l’espace Projets contient des études de cas ;
- l’espace Outils permet d’utiliser InfraLens ;
- les anciennes zones redondantes sont supprimées ou réorganisées ;
- la navigation est explicite et accessible ;
- la carte conserve son rôle différenciant ;
- le contenu est centralisé et maintenable ;
- les routes obsolètes sont redirigées ;
- les pages disposent de metadata propres ;
- les parcours principaux fonctionnent sur mobile et desktop ;
- les animations respectent reduced motion ;
- les tests et le build passent ;
- InfraLens possède des protections SSRF solides et testées ;
- la stratégie de domaine InfraLens est décidée à partir de données ;
- la documentation reflète l’état réel du produit.

---

# 27. Résumé de la direction finale

Randy Code doit devenir l’écosystème principal.

- **Liflow** : produit phare et étude de cas principale ;
- **InfraLens** : outil open source phare, utilisable depuis l’écosystème ;
- **Projets** : preuves détaillées ;
- **Outils** : produits immédiatement utilisables ;
- **Articles** : approfondissement technique ;
- **À propos** : profil, expérience terrain et approche produit ;
- **Carte** : identité visuelle et navigation enrichie.

La priorité n’est pas de créer davantage de pages. La priorité est de rendre chaque page plus claire, plus utile, plus crédible et mieux reliée au reste de l’écosystème.
