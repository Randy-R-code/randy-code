# Changelog

## [0.6.2] — 2026-08-02

### Corrections

- **`metadataBase` manquant** — `app/layout.tsx` exportait `metadata` sans `metadataBase` : Next.js retombait sur `http://localhost:3000` pour résoudre l'image OG et la Twitter card en production, cassant les aperçus de lien sur les réseaux sociaux. Ajout de `metadataBase: new URL("https://randy-code.dev")`.

### Contenu

- **OG card** (`app/opengraph-image.tsx`) — 4ème tuile "Applications mobiles" (Expo & React Native, backend temps réel) ajoutée aux 3 tuiles existantes ; taille réduite pour garder les 4 lisibles ; tagline mise à jour ("SaaS · Mobile · SEO local") ; `randy-code.dev` en bas de carte éclairci et passé en gras (`#1e293b` → `#94a3b8`), quasi invisible avant

---

## [0.6.1] — 2026-08-02

### Dépendances

- `next` 16.2.4 → 16.2.12, `eslint-config-next` idem
- `react` / `react-dom` 19.2.5 → 19.2.8
- `framer-motion` 12.38.0 → 12.43.0, `lucide-react` 1.8.0 → 1.28.0, `radix-ui` 1.4.3 → 1.6.7, `resend` 6.12.0 → 6.18.1, `shadcn` 4.3.1 → 4.16.1, `tailwind-merge` 3.5.0 → 3.6.0
- `tailwindcss` / `@tailwindcss/postcss` 4.2.2 → 4.3.3
- `@types/react` 19.2.14 → 19.2.18, `@types/react-dom` 19.2.3 → 19.2.4, `@types/node` 25.6.0 → 26.1.2
- **Volontairement non bumpées** : `typescript` (reste `^6.0.3`) — `typescript-eslint@8.65.0` (dernière version) ne supporte que `typescript >=4.8.4 <6.1.0`, TS 7 casserait le lint ; `eslint` (reste `^9.39.5`) — `eslint-plugin-react` (via `eslint-config-next`) plante sous ESLint 10 (`context.getFilename` supprimé, `TypeError` confirmée)

---

## [0.6.0] — 2026-08-02

### Contenu

- **Lab Zone** — OpenClaw passe de "En cours" à "Usage quotidien" (automatisation mails, rendez-vous et rappels partagés, listes, assistant IA au quotidien) ; génération de pages SEO locales mise en pause (reprise avec le site vitrine auto) ; deux nouvelles expériences "Boilerplate SaaS — Convex" et "Boilerplate mobile — Expo & Convex" ; liste triée par maturité de statut (quotidien → en cours → en pause → en réflexion) au lieu de l'ordre de création
- **Apps Station — Liflow** — statut "Projet en cours" → "Disponible" (application en accès libre, phase post-lancement) ; stack complétée (`Inngest`, `Resend`)
- **Projects City — Liflow** — résultat mis à jour pour refléter le lancement public
- **About** — `Inngest` ajouté à la stack technique

### Outillage

- **Skill `portfolio-audit`** ajouté sous `.claude/skills/` — audit read-only des statuts périmés, liens morts, cadence blog, metadata/SEO et sanité PWA/build
- **`.claude/` ajouté au `.gitignore`** — même logique que `CLAUDE.md`, non pertinent pour un repo public

---

## [0.5.7] — 2026-05-16

### Corrections

- **PWA icons** — `icon-192.png`, `icon-512.png` et `apple-touch-icon.png` remplacés pour corriger le rognage de l'icône sur le launcher Samsung

---

## [0.5.6] — 2026-05-16

### Contenu

- **Liflow — Apps Station** — description, features cards et metadata entièrement reécrits pour refléter la vraie nature de l'app (souvenirs familiaux, Daily Memory, récits IA)
- **Liflow — Projects City** — problème, solution et tags mis à jour en cohérence
- **Nouvel article** — "J'ai complètement repensé Liflow" (`liflow-refonte-souvenirs-familiaux`)
- **Image de couverture** — `ilja-tulit-CoREQIuk1qM-unsplash.jpg` intégrée sous le bon slug

### Corrections

- **LCP warning** — `priority={i === 0}` sur le premier post de la liste blog : supprime l'avertissement Next.js sur l'image LCP sans eager-loader inutile sur les suivantes

### Stack

- **About & Apps Station** — `Redis` → `Upstash`, `Mux` ajouté

---

## [0.5.5] — 2026-04-20

### Nettoyage

- **`AGENTS.md` supprimé** — contenu fusionné dans `CLAUDE.md`
- **`PROJECT.md` supprimé** — doc de planification interne non référencée
- **`package-lock.json` supprimé** — doublon npm ; projet sur pnpm ; ajouté au `.gitignore`
- **`CLAUDE.md` ajouté au `.gitignore`** — instructions IA non pertinentes pour un repo public

### Dépendances

- `next` 16.2.2 → 16.2.4
- `eslint-config-next` 16.2.2 → 16.2.4
- `react` / `react-dom` 19.2.4 → 19.2.5
- `typescript` 5.9.3 → 6.0.3
- `@types/node` 20.19.37 → 25.6.0
- `lucide-react` 1.7.0 → 1.8.0
- `resend` 6.10.0 → 6.12.0
- `shadcn` 4.1.2 → 4.3.1

---

## [0.5.4] — 2026-04-06

### Corrections

- **PWA orientation** — `orientation: "portrait-primary"` → `"any"` dans `app/manifest.ts` : supprime le verrouillage portrait qui empêchait la rotation en paysage

---

## [0.5.3] — 2026-04-03

### Corrections

- **Formulaire de contact** — l'email n'était jamais envoyé : l'erreur Resend était silencieuse (le SDK retourne `{ error }` au lieu de lever une exception). Ajout de la vérification du retour `resend.emails.send()`.
- **Formulaire de contact** — adresse `from` corrigée : `onboarding@resend.dev` → `noreply@randy-code.dev` (domaine vérifié requis pour envoyer à des destinataires externes)

### Dépendances

- `next` 16.2.1 → 16.2.2
- `eslint-config-next` 16.2.1 → 16.2.2
- `lucide-react` 1.5.0 → 1.7.0
- `resend` 6.9.4 → 6.10.0
- `shadcn` 4.1.0 → 4.1.2

---

## [0.5.2] — 2026-04-01

### Améliorations

- **Service worker** — ajout de `sw.js` (cache-first) et `ServiceWorkerRegistration` dans le layout : active l'installation en WebAPK standalone sur Android
- **PWA icons** — `icon-192.png` passe de `purpose: "maskable"` à `"any"` : supprime le masque circulaire appliqué par Android
- **iOS** — `appleWebApp` (`capable`, `statusBarStyle: "black-translucent"`) et export `viewport` avec `themeColor` (convention Next.js 14+)

---

## [0.5.1] — 2026-03-29

### Améliorations

- **Bouton retour** — "Randy World" → "Retour à la carte" sur toutes les pages (PageShell + 404)
- **Badge InfraLens** (Apps Station) — couleur cyan remplacée par violet clair (`#a78bfa`), dans le ton de la page
- **Boutons blog** — Liflow et InfraLens en blanc discret au lieu des couleurs de zone
- **Cohérence UI** — actions en français partout ("Explorer →", "Retour à la carte") ; noms de zones restent anglais (noms propres)
- **Renommage** — repo `randy-world` → `randy-code`, toutes les métadonnées mises à jour ("Randy World" → "Randy Code")

### Sécurité

- **HTTP security headers** — ajout de `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` et `Permissions-Policy` sur toutes les routes via `next.config.mjs`
- **`X-Powered-By` supprimé** — `poweredByHeader: false` pour ne plus exposer la stack serveur
- **`security.txt`** — ajout de `public/.well-known/security.txt` (contact email, expiration)

### Nettoyage

- **`next.config.ts` supprimé** — doublon non utilisé (Next.js chargeait `next.config.mjs` en priorité)

---

## [0.5.0] — 2026-03-27

### Ajouts

- **`app/robots.ts`** — directives de crawl explicites pour tous les robots + référence au sitemap
- **Schema JSON-LD `Person`** dans `app/layout.tsx` — entité Google : nom, métier, compétences (TypeScript, Next.js, SEO local, SaaS, React, Prisma)
- **Schema JSON-LD `Article`** dans `app/blog/[slug]/page.tsx` — chaque article est éligible aux résultats enrichis Google (titre, description, date, auteur, URL canonique)
- **Twitter Cards** dans `app/layout.tsx` — partage optimisé sur X et LinkedIn avec `summary_large_image`

### Améliorations

- **Connexions world map** — refonte complète : tirets animés → éclairs statiques (zigzag 4% d'amplitude, blanc 15% d'opacité). Apparition synchronisée avec le stagger des cards. Au hover d'une card : trait plus épais + couleur de la zone avec transition 0.2s
- **Hub central** — point cyan remplacé par un dot blanc discret avec halo
- **OG image** — suppression du logo/monogramme, ajout de 3 blocs de services (Sites vitrines / cyan, Applications SaaS / violet, SEO local / vert) avec accents colorés

### Corrections

- Hydration mismatch sur `MapConnections` — `dims` initialisé à `null`, paths rendus uniquement côté client après `ResizeObserver`
- Branches des éclairs déplacées vers les cards (15% depuis la zone) au lieu du hub — supprime l'artefact étoile au centre
- `MapNode` — ajout de `onHoverStart`/`onHoverEnd` pour remonter l'état hover au `WorldMap`

---

## [0.4.0] — 2026-03-26

### Ajouts

- **PWA** — site installable sur mobile et desktop : manifest (`app/manifest.ts`), icônes générées depuis `logo-r.png` (32×32, 180×180, 192×192, 512×512), `app/icon.png` et `app/apple-icon.png` pour Next.js
- **Manifest** — `name` : "Randy Rimbault — Développeur Fullstack Freelance", `short_name` : "R-code", thème et background `#09090b`

### Corrections

- `next.config.js` renommé en `next.config.mjs` — supprime le warning Node.js sur les modules ES sans `"type": "module"` dans `package.json`

---

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
