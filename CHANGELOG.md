# Changelog

## [0.2.0] — 2026-03-25

### Ajouts

- **OG image dynamique** (`app/opengraph-image.tsx`) — carte 1200×630 dans le style du site : fond sombre, glow bleu, logo, titre, tags, URL `randy-code.dev`. Fonts Inter chargées localement (`assets/`)
- **Blog — Knowledge Base** — listing d'articles avec couvertures 16:9, tags, temps de lecture ; template d'article avec hero image, prose et CTAs projets
- **4 articles réels** avec titres SEO optimisés, descriptions enrichies et temps de lecture calculé automatiquement (~200 mots/min)
  - _Créer une application SaaS de A à Z : retour d'expérience sur Liflow_
  - _Next.js 16 : pourquoi j'ai recommencé mon application SaaS de zéro_
  - _IA et développement web : mon workflow pour coder sans perdre le contrôle_
  - _InfraLens : concevoir un outil open source d'analyse de performance web_
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
- Formulaire de contact avec Resend (`randy.rcode@gmail.com`)
- Connexions hub-centriques (SVG, tirets animés)
- `PageShell` générique pour les pages de zone
