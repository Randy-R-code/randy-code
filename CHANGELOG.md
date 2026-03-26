# Changelog

## [0.3.0] — 2026-03-26

### Ajouts

- **Zone Background** — nouvelle carte sur la world map (`/background`) avec icône HardHat, couleur slate, position bas-centre dans l'ellipse
- **Page `/background`** — intro narrative, 4 blocs domaines (Mécanique, Électricité, Logistique, Dev) avec texte contextuel par bloc, section "Ce que mon parcours m'a appris"
- **`app/sitemap.ts`** — génération automatique du sitemap XML : toutes les routes statiques + articles de blog avec `lastModified` et priorités
- **`app/not-found.tsx`** — page 404 custom dans le style du site : "Zone introuvable", lien retour à la map

### Améliorations

- **World map** — refonte complète du layout : 7 zones en ellipse régulière, toutes reliées au hub central. Suppression des connexions inter-zones au profit d'un hub-centrique pur
- **SEO District** — couverture étendue à toute la France (suppression du focus Perpignan) ; stats chiffrées remplacées par 3 blocs qualitatifs (Technique, Contenu, Durabilité) ; liens villes cassés supprimés
- **About** — reformulation du bio : "Reconverti" → "Autodidacte en développement web, appris en parallèle de mon activité professionnelle"
- **Projects City** — placeholder "à venir" remplacé par le client Perpignan (reprogrammation clés/ECU/clim) ; "Portfolio multilingue" remplacé par Liflow ; site vitrine placé en premier
- **Lab Zone** — OpenClaw ajouté en expérience #01 "En cours" ; backlog renommé "Sur le radar" et allégé
- **`PageShell`** — icône `hardHat` ajoutée à l'iconMap

### Corrections

- Metadata `layout.tsx` : titre et description globale harmonisés avec le positionnement pro
- Metadata `blog/page.tsx` : titre corrigé "Knowledge Base — Randy World"
- Metadata `projects/page.tsx` : suppression de la référence à l'ancien portfolio multilingue

---

## [0.2.0] — 2026-03-25

### Ajouts

- **OG image dynamique** (`app/opengraph-image.tsx`) — carte 1200×630 dans le style du site : fond sombre, glow bleu, logo, titre, tags, URL `randy-code.dev`. Fonts Inter chargées localement (`assets/`)
- **Blog — Knowledge Base** — listing d'articles avec couvertures 16:9, tags, temps de lecture ; template d'article avec hero image, prose et CTAs projets
- **6 articles réels** avec titres SEO optimisés, descriptions enrichies et temps de lecture calculé automatiquement (~200 mots/min)
  - _Créer une application SaaS de A à Z : retour d'expérience sur Liflow_
  - _Next.js 16 : pourquoi j'ai recommencé mon application SaaS de zéro_
  - _IA et développement web : mon workflow pour coder sans perdre le contrôle_
  - _InfraLens : concevoir un outil open source d'analyse de performance web_
  - _Création de site web : pourquoi un beau design ne suffit pas pour être visible sur Google_
  - _Combien coûte un site web en 2026 ? Les vrais prix selon le projet_
- **Posts en fichiers séparés** — chaque article dans `content/posts/[slug].ts` ; `src/lib/blog.ts` réduit à un registre + utilitaires

### Améliorations

- **Connexions SVG** — correction majeure : remplacement de `preserveAspectRatio="none"` par un `ResizeObserver` qui calcule les positions en pixels réels. Les tirets (`strokeDasharray`) sont maintenant uniformes horizontalement et verticalement
- **Zone Blog → Knowledge Base** — label renommé dans `data.ts` et pages associées
- **README** — remplacé le README par défaut Next.js par une documentation du projet
- **PROJECT.md** — diagramme ASCII réécrit sans emojis pour un affichage aligné dans tous les éditeurs
- **AGENTS.md / CLAUDE.md** — instructions conservées

### Corrections

- Suppression des 5 SVGs par défaut Vercel (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) — aucun n'était référencé dans le code
- Suppression des 3 articles placeholder (SEO local, InfraLens v1, multi-tenant) remplacés par les vrais articles

---

## [0.1.0] — 2026-03-24

- World map interactive avec 6 zones cliquables
- 5 pages de zones (`/projects`, `/apps`, `/seo`, `/lab`, `/about`)
- Hero text rotatif (3 variants, tirage serveur via `React.cache()`)
- SEO block sous la carte (H2 + bullet points)
- Formulaire de contact avec Resend
- Connexions hub-centriques (SVG, tirets animés)
- `PageShell` générique pour les pages de zone
