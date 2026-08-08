# Changelog

## [0.7.11] — 2026-08-08

### Contenu

- **`openGraph` et `alternates.canonical`** — champ `openGraph` explicite ajouté à `app/layout.tsx` (seul `twitter` l'était) ; `alternates.canonical` ajouté sur les 11 pages du site (aucune n'en avait avant).
- **JSON-LD `SoftwareApplication`** (`src/lib/json-ld.ts`) — nouveau schéma, appliqué uniquement à `/projects/liflow` et `/projects/infralens` (les 2 produits nommés par le plan de refonte, pas le site client).

### Outillage

- **Content-Security-Policy** (`next.config.mjs`) — nouveau header, vérifié sans violation sur 11 routes + interactions (menu mobile), y compris avec throttling CPU. Un écart Lighthouse `best-practices` (100→92) causé par la CSP est documenté et expliqué dans `docs/roadmap.md` (section 7) — artefact de l'environnement de mesure, pas un problème reproductible pour un visiteur réel ; pas d'affaiblissement de la CSP pour ce score.
- **`docs/roadmap.md`** — Phases 11 et 12 marquées terminées, Phase 13 notée sans tâche de code concrète pour l'instant.

## [0.7.10] — 2026-08-08

### Contenu

- **Flux RSS** (`app/rss.xml/route.ts`) — génère un flux RSS 2.0 depuis les articles existants (`src/lib/blog.ts`), rendu statique, découvrable via `alternates.types` dans `app/layout.tsx`.

### Outillage

- **`docs/roadmap.md`** — Phase 10 marquée terminée côté randy-code. Note de sécurité ajoutée sur un point à corriger côté InfraLens avant de publier l'article SSRF prévu par le plan — volontairement sans détail technique dans ce fichier public, suivi détaillé conservé en privé.

## [0.7.9] — 2026-08-08

### Contenu

- **Liens articles → études de cas** (`app/articles/[slug]/page.tsx`) — le bloc "Mes projets" en pied de chaque article pointait directement vers `liflow.app`/`infralens.dev` en externe ; pointe maintenant vers `/projects/liflow` et `/projects/infralens` en interne. Les études de cas gardent déjà les liens produit externes, rien n'est perdu.

## [0.7.8] — 2026-08-08

### Contenu

- **Stack technique** (`app/about/page.tsx`) — passe d'une liste plate de 21 technologies à 4 niveaux hiérarchisés (Principal, Backend et données, Produit et infrastructure, Expérimentations), conformément au master plan (section 10.2). Mêmes 21 technologies, aucune ajoutée ni retirée — pure réorganisation.

## [0.7.7] — 2026-08-08

### Contenu

- **Étude de cas InfraLens** (`src/lib/projects.ts`) — `/projects/infralens` passe de 3 sections génériques à 8 (contexte, objectifs, rôle, solution, architecture, choix techniques, sécurité, enseignements ; "Difficultés" volontairement omise, aucun contenu narratif source pour cette section). Sourcé sur le dépôt InfraLens réel (18 checks/6 catégories, scoring pondéré, architecture Server Actions) et son propre plan maître pour les formulations de positionnement à éviter.

## [0.7.6] — 2026-08-08

### Contenu

- **Étude de cas — site client automobile** (`src/lib/projects.ts`) — courte extension (Contexte/Rôle/Architecture) sourcée sur le dépôt réel du projet. Le client reste anonymisé sur le portfolio tant que le site n'est pas en ligne, comme aujourd'hui.

### Outillage

- **`ProjectCaseStudy`** (`src/lib/projects.ts`) — tous les champs passent en optionnels pour permettre des études de cas partielles quand le contenu source ne couvre pas toutes les sections. `app/projects/[slug]/page.tsx` ne rend plus que les sections réellement renseignées (repli sur `project.solution` si `caseStudy.solution` est absent).

## [0.7.5] — 2026-08-08

### Contenu

- **Étude de cas Liflow** (`src/lib/projects.ts`, `app/projects/[slug]/page.tsx`) — `/projects/liflow` passe de 3 sections génériques (Problème/Solution/Résultat) à 11 (contexte, problème, objectifs, rôle, solution, architecture, choix techniques, difficultés, sécurité et confidentialité, résultat, enseignements), via un nouveau champ optionnel `caseStudy` sur `Project`. Sourcé sur l'article de blog à jour (mai 2026, post-refonte) et sur le dépôt Liflow réel en local pour confirmer l'architecture — multi-tenant par organisation, Better Auth, Prisma/PostgreSQL, stockage S3 présigné, Mux, Inngest, Stripe présent dans le code mais non activé publiquement. Les projets sans `caseStudy` (InfraLens, site client) gardent l'affichage léger existant.

## [0.7.4] — 2026-08-08

### Contenu

- **`src/lib/projects.ts`** — source unique pour les 3 projets (Liflow, InfraLens, site client automobile), remplace les deux tableaux littéraux divergents qui vivaient jusqu'ici dans `app/projects/page.tsx` et le `featuredProjects` de la homepage (Phase 3). Type `Project`, `getProject`, `getFeaturedProjects`, `statusLabel`.
- **`app/projects/[slug]/page.tsx`** — template générique d'étude de cas (3 pages statiques : `/projects/liflow`, `/projects/infralens`, `/projects/specialiste-automobile`). Volontairement léger (fil d'Ariane, statut, Problème/Solution/Résultat, stack, lien produit) — la structure complète à 17 sections du plan de refonte est réservée aux Phases 5/6, une fois le contenu narratif réel écrit.
- **`app/projects/page.tsx`** et **homepage** — consomment maintenant `src/lib/projects.ts` ; badge de statut ajouté sur `/projects` (absent avant) ; les liens "Étude de cas" pointent vers `/projects/${slug}` au lieu du placeholder `/projects`.

### Nettoyage

- Le tag "Perpignan" (mélangé avec la stack technique sur l'ancienne fiche du site client automobile) n'apparaît plus — le nouveau champ `technologies: string[]` ne mélange plus techno et localisation. Pas une perte de contenu, juste un tag décoratif qui n'a pas sa place dans le nouveau modèle de données.

### Outillage

- **`src/lib/__tests__/projects.test.ts`** — slugs uniques, champs requis, `getProject`/`getFeaturedProjects`.
- **`app/sitemap.ts`** — entrées `/projects/${slug}` ajoutées.
- **`e2e/smoke.spec.ts`** — test "a project case study page renders" ajouté (13 tests).

## [0.7.3] — 2026-08-08

### Contenu

- **Homepage** (`app/page.tsx`, `src/components/hero-text.tsx`) — structure complétée selon le plan de refonte (section 5) : CTA sous le hero ("Voir mes projets", "Me contacter", lien GitHub), grille d'accès alternatif sous la carte (Projets/Outils/Articles/À propos), section "Projets phares" (Liflow + InfraLens — statut, phrase de valeur, stack, liens produit/étude de cas ; pas de capture, aucune n'existe encore), profil synthétique avec lien vers `/about`, CTA final. Le bloc "Ce que je construis" (ajouté en Phase 1) est retiré, redondant avec la nouvelle section Projets phares.

### Corrections

- **Contraste** (Lighthouse, relevé en Phase 0) — eyebrow du hero, tagline des zones sur la carte (desktop `map-node.tsx` et liste mobile `world-map.tsx`, deux endroits distincts), lien GitHub du hero : `text-zinc-500` → `text-zinc-400`. Accessibilité Lighthouse 95→100 (mobile et desktop).

### Outillage

- **`prefers-reduced-motion`** (`app/layout.tsx`) — `<MotionConfig reducedMotion="user">` autour de `{children}` : respecte le réglage système pour toutes les animations Framer Motion du site en un seul point, aucune garde n'existait jusqu'ici malgré un usage important de Framer Motion.
- **`e2e/smoke.spec.ts`** — assertions sur la présence des CTA du hero ajoutées au test homepage existant.
- **`docs/audits/lighthouse/`** et **`docs/audits/screenshots/`** — nouveaux rapports/captures homepage (suffixe `-phase3`), anciens fichiers Phase 0 conservés pour comparaison avant/après.

## [0.7.2] — 2026-08-08

### Contenu

- **Navigation principale** (`src/lib/nav.ts`, `src/components/layout/site-header.tsx`) — le site n'avait aucune navigation globale, seulement la carte interactive et un lien "retour à la carte" par page. Ajout d'un header desktop/mobile explicite (Accueil, Projets, Outils, Articles, À propos, Contact), navigable au clavier avec focus visible.
- **`app/contact/page.tsx`** — nouvelle route dédiée ; le formulaire de contact n'était monté que sur `/about`, sans page `/contact` routable malgré l'existence de la server action.
- **`app/tools/page.tsx`** — nouvelle route listant InfraLens, prépare l'espace Outils avant l'intégration profonde (phase ultérieure).
- **`/apps` et `/seo` supprimées** — contenu déjà couvert par `/projects` ; `/seo` retiré sans activité commerciale active derrière (décision actée dans `docs/roadmap.md`).
- **`/background` fusionné dans `/about`** — nouvelle section "Parcours & expérience terrain" (mécanique, électricité, logistique, développement web), au lieu d'une zone à part.
- **`/blog` renommé `/articles`** — fil d'Ariane ajouté sur les pages d'article ; contenu inchangé.
- **`src/lib/data.ts`** — la carte passe de 7 à 5 zones (Tools/Projects/Articles/About/Lab), repositionnées ; type `ZoneId` ajouté pour que `pnpm typecheck` détecte une désynchronisation entre `zones` et `connections`.

### Corrections

- **`app/projects/page.tsx`** — le CTA "Me contacter" pointait vers `/about` ; repointé vers `/contact` maintenant que le formulaire y vit.
- **`src/components/layout/site-header.tsx`** — classes Tailwind `focus-visible:outline-2` dupliquées sur les 3 liens de nav, corrigées.

### Outillage

- **Redirections permanentes** (`next.config.mjs`) — `/apps`, `/seo`, `/background`, `/blog` et les 7 slugs d'articles vers leurs nouvelles destinations (HTTP 308). Liste énumérée plutôt qu'un wildcard `/blog/:slug*`, qui serait entré en collision avec les images statiques `public/blog/*.jpg`.
- **`src/lib/__tests__/data.test.ts`** — nouveau test vérifiant que `connections` et `zones` restent dans le même ordre (invariant requis par l'animation d'entrée de la carte, non gardé jusqu'ici).
- **`e2e/smoke.spec.ts`** — routes mises à jour (`/tools`, `/contact`, `/articles`), test du formulaire déplacé sur `/contact`, 2 tests de redirection ajoutés (9 → 12 tests).
- **`min-h-screen` → `flex-1`** sur 4 fichiers (`app/page.tsx`, `page-shell.tsx`, `app/not-found.tsx`, `app/articles/[slug]/page.tsx`) — nécessaire suite à l'ajout du header pour éviter un espace vide en bas de chaque page.

## [0.7.1] — 2026-08-07

### Contenu

- **Homepage** (`app/page.tsx`, `src/components/hero-text.tsx`) — le H1, la tagline et le bloc "Ce que je construis" étaient tirés aléatoirement côté serveur parmi 3 variantes à chaque requête (`force-dynamic`). Fixés sur une seule version stable, alignée sur la proposition de valeur du plan de refonte (développeur TypeScript, applications web et outils métier, mention des apps mobiles Expo/React Native) ; `force-dynamic` retiré, `/` repasse en rendu statique.
- **Lab Zone** (`app/lab/page.tsx`) — 5 → 3 expériences : "Génération de pages SEO locales" (en pause, sans preuve exploitable) retirée ; "Assistant portfolio IA" déplacé de carte Expérience vers la liste "Sur le radar" (simple idée, pas de prototype). OpenClaw et les 2 boilerplates internes étoffés (fonctionnement réel d'OpenClaw détaillé ; stack réutilisée sur plusieurs projets clients/produits mentionnée), sans exposer repo ni chiffres internes.
- **`content/posts/creer-application-saas-retour-experience-liflow.ts`** — note éditoriale ajoutée : l'article (nov. 2025) décrit une version antérieure de Liflow (partage par capsules), périmée depuis le pivot de mai 2026 vers la timeline de souvenirs familiaux ; lien ajouté vers l'article à jour.

### Corrections

- **`app/blog/[slug]/page.tsx`** — "Mes projets en cours" contredisait le statut "Disponible" affiché partout ailleurs pour Liflow/InfraLens ; corrigé en "Mes projets".

### Outillage

- **`docs/roadmap.md`** — Phase 1 (correction du contenu et cohérence produit) du plan de refonte marquée terminée ; les 4 décisions humaines bloquantes tranchées (SEO District → intégré, InfraLens → rewrite sous `randy-code.dev/tools/infralens`, retrait `infralens.dev` à court terme, séquencement conservé tel quel côté master plan).

## [0.7.0] — 2026-08-07

### Outillage

- **Documents de source de vérité pour la refonte** (`PORTFOLIO_REDESIGN_MASTER_PLAN.md`, `RANDY_CODE_BRANDING_PLAN.md`, `RANDY_CODE_ECOSYSTEM_VISION.md`) — plan de refonte progressive du portfolio (architecture de l'information, phases 0-13), système visuel bleu-vert (phases B0-B7) et vision long terme de l'écosystème Randy Code.
- **`docs/audits/baseline.md`** — audit Phase 0 (inventaire routes/composants/contenus, occurrences Liflow/InfraLens, `pnpm lint`/`typecheck`/`test`/`build`/`e2e`, `pnpm audit`, Lighthouse, sitemap/robots, liens internes), avec rapports Lighthouse (`docs/audits/lighthouse/`) et captures desktop/mobile (`docs/audits/screenshots/`).
- **`docs/roadmap.md`** — synthèse consolidée des 3 documents ci-dessus recoupée avec les écarts réels constatés par l'audit, séquencement des phases master plan × branding et liste des décisions humaines bloquantes.

## [0.6.3] — 2026-08-06

### Corrections

- **Injection CRLF dans le formulaire de contact** — `app/contact/actions.ts` interpolait `name` tel quel dans le sujet de l'email sortant (`resend.emails.send`) sans filtrer les caractères de contrôle ; un `name` contenant `\r\n` pouvait injecter des en-têtes email arbitraires. Ajout d'un filtre `noControlChars`, même faille déjà corrigée dans `r-code`/`r-code-marketing`.

### Outillage

- **Tests unitaires (Vitest)** — 0 → 10 tests : `src/lib/__tests__/blog.test.ts` (tri par date, champs requis, slugs uniques, `getPost`/`formatDate`), `src/lib/__tests__/json-ld.test.ts`. Le JSON-LD, jusqu'ici inline dans `app/layout.tsx` et `app/blog/[slug]/page.tsx`, est extrait vers `src/lib/json-ld.ts` (`buildPersonSchema()`, `buildArticleSchema()`) pour être testable.
- **Tests e2e (Playwright)** — `e2e/smoke.spec.ts` (9 tests) : accueil, navigation vers les 5 zones (projects/apps/lab/about/blog), formulaire de contact, page de blog, 404 brandée.
- **CI GitHub Actions** (`.github/workflows/ci.yml`) — jobs `lint`/`typecheck`/`test`/`build` en parallèle puis `e2e`, `pnpm/action-setup` épinglé à `10.7.0` (jamais `latest`), `permissions: contents: read` et `concurrency`, patron `cleperformance`/`r-code-marketing`.
- **`package.json`** — scripts `typecheck`, `test`, `e2e`, `check` ajoutés ; `packageManager: pnpm@10.7.0` épinglé pour que Corepack matche la CI.
- **5 skills de maintenance** ajoutées sous `.claude/skills/` (non trackées, `.claude/` reste dans `.gitignore`) — `doctor`, `check-launch`, `ship-release`, `verify`, `dependabot-sync`, portées et adaptées depuis `r-code-marketing`.

---

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
