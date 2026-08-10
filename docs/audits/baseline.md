# Baseline — Phase 0 : Audit local et baseline

> Généré le 2026-08-07. Source de vérité : `RANDY_CODE_MASTER_PLAN.md` (section 19, Phase 0).
> Ce document est un audit **read-only** : aucun fichier source (`app/`, `src/`, `content/`, `public/`, config) n'a été modifié pour le produire.
> Version du repo au moment de l'audit : `package.json` → `0.6.3`, dernier commit `ae49c8f` (branche `main`).

---

## 1. README et CHANGELOG

- `README.md` : à jour. Décrit correctement la stack (Next.js 16 App Router, TypeScript, Tailwind v4, Framer Motion 12, shadcn/ui, Resend, Vercel) et la structure réelle du repo (`app/`, `content/posts/`, `src/components/`, `src/lib/`).
- `CHANGELOG.md` : à jour, dernière entrée `[0.6.3] — 2026-08-06` (fix CRLF injection sur le formulaire de contact + ajout tests/CI/skills de maintenance). Format cohérent sur tout l'historique (`[version] — date`, sections Corrections/Contenu/Dépendances/Outillage).

## 2. Inventaire des routes (App Router)

Pages (`page.tsx`) :

| Route          | Fichier                    | Type de rendu (build)                                    |
| -------------- | -------------------------- | -------------------------------------------------------- |
| `/`            | `app/page.tsx`             | **ƒ Dynamic** (`export const dynamic = "force-dynamic"`) |
| `/about`       | `app/about/page.tsx`       | ○ Static                                                 |
| `/apps`        | `app/apps/page.tsx`        | ○ Static                                                 |
| `/background`  | `app/background/page.tsx`  | ○ Static                                                 |
| `/blog`        | `app/blog/page.tsx`        | ○ Static                                                 |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | ● SSG (`generateStaticParams`, 7 pages générées)         |
| `/lab`         | `app/lab/page.tsx`         | ○ Static                                                 |
| `/projects`    | `app/projects/page.tsx`    | ○ Static                                                 |
| `/seo`         | `app/seo/page.tsx`         | ○ Static                                                 |

Fichiers spéciaux : `app/layout.tsx` (layout racine, unique), `app/not-found.tsx`, `app/manifest.ts`, `app/robots.ts`, `app/sitemap.ts`, `app/opengraph-image.tsx`, `app/apple-icon.png`, `app/icon.png`, `app/favicon.ico`.

**Aucun `route.ts`** (pas de route handler API) dans le projet.

**Constat notable** : `app/contact/` existe mais ne contient **que** `actions.ts` (une server action `"use server"`), pas de `page.tsx`. Il n'y a donc **aucune route `/contact`** dans l'application — confirmé par `curl` (`/contact` → `404`, testé serveur `pnpm start` local). Le formulaire de contact (`src/components/contact-form.tsx`) est monté directement dans la page `/about`, pas sur une page dédiée. Ceci contraste avec l'architecture cible du master plan (section 2.4) qui prévoit un `/contact` explicite.

## 3. Inventaire des composants

`src/components/` :

- `layout/page-shell.tsx` — wrapper de page (client)
- `map/world-map.tsx`, `map/map-connections.tsx`, `map/map-node.tsx` — carte interactive (client)
- `ui/button.tsx`, `ui/card.tsx` — primitives shadcn/ui
- `contact-form.tsx` — formulaire (client)
- `hero-text.tsx` — texte hero homepage

`app/components/` :

- `service-worker-registration.tsx` — enregistrement du service worker PWA (client)

Total : 9 fichiers composants (hors pages/layouts), répartis en 3 catégories claires (layout, map, ui) + 3 composants non catégorisés à la racine de `src/components/`.

`src/lib/` (logique/données, pas des composants) :

- `data.ts` — définition des 7 zones de la carte + connexions
- `blog.ts` — registre des articles + `getPost`/`formatDate`
- `json-ld.ts` — `buildPersonSchema()`, `buildArticleSchema()`
- `utils.ts` — utilitaires génériques
- `__tests__/blog.test.ts`, `__tests__/json-ld.test.ts` — tests Vitest

## 4. Inventaire des contenus

`content/posts/` — 7 fichiers TypeScript typés (`PostData`), un fichier = un article, importés manuellement dans `src/lib/blog.ts` (pas de MDX, pas de frontmatter Markdown — contenu HTML en template string dans chaque fichier `.ts`) :

1. `beau-site-web-seo-google.ts`
2. `creer-application-saas-retour-experience-liflow.ts`
3. `ia-developpement-web-workflow-coder-sans-perdre-controle.ts`
4. `infralens-outil-open-source-analyse-performance-web.ts`
5. `liflow-refonte-souvenirs-familiaux.ts`
6. `nextjs-16-recommencer-application-saas-zero.ts`
7. `prix-site-web-2026.ts`

Chaque fichier exporte un objet `PostData` (slug, title, description, date ISO, tags, coverImage optionnelle, content HTML). Le temps de lecture (`readingTime`) est calculé dynamiquement dans `blog.ts` (comptage de mots / 200).

Pas d'autre source de contenu structuré (pas de fichier data pour les projets — les projets de `/projects` et `/apps` sont des tableaux littéraux inline dans chaque `page.tsx`, non centralisés — écart déjà identifié par le master plan section 16.1/16.2).

## 5. Occurrences "Liflow" et "InfraLens"

**Liflow** — 35 occurrences (`grep -rn "Liflow" app src content`) dans : `app/projects/page.tsx`, `app/lab/page.tsx`, `app/about/page.tsx`, `app/blog/[slug]/page.tsx`, `app/apps/page.tsx`, et les fichiers `content/posts/creer-application-saas-retour-experience-liflow.ts`, `content/posts/liflow-refonte-souvenirs-familiaux.ts`, `content/posts/nextjs-16-recommencer-application-saas-zero.ts`, `content/posts/infralens-outil-open-source-analyse-performance-web.ts`.

Statut affiché actuellement : `app/apps/page.tsx` → badge **"Disponible"** ; `app/projects/page.tsx` → _"Application live et disponible sur liflow.app, en phase de croissance post-lancement."_ Recherche explicite des formulations interdites (« abandonné », « archivé », « ancien projet », « projet arrêté », « prototype inactif ») sur `app/`, `src/`, `content/` : **aucune occurrence trouvée**. Liflow est donc déjà présenté comme actif — conforme à la règle non négociable du master plan (section 3.4), pas de correction nécessaire sur ce point en Phase 1.

**InfraLens** — 17 occurrences (`grep -rn "InfraLens" app src content`), orthographe systématiquement correcte (`InfraLens`, jamais `Infralens`/`INFRALENS`). Le domaine `infralens.dev` n'apparaît que 5 fois, toujours comme URL/lien (`href="https://infralens.dev"`, texte de lien `infralens.dev`), jamais comme nom de marque affiché à la place de « InfraLens » — conforme à la règle du branding plan (section 1 : le nom de marque n'inclut pas `.dev`, le domaine reste utilisable pour les liens).

## 6. Routes dynamiques

- `app/page.tsx:5` — `export const dynamic = "force-dynamic";` → confirmé au build (`Route (app)` liste `/` en `ƒ Dynamic`, seule route non statique du site).
- `app/blog/[slug]/page.tsx` — seul segment dynamique de route (`[slug]`), mais **prérendu en SSG** via `generateStaticParams` (marqué `● SSG` au build, 7 chemins générés : `liflow-refonte-souvenirs-familiaux`, `prix-site-web-2026`, `beau-site-web-seo-google`, `infralens-outil-open-source-analyse-performance-web`, `ia-developpement-web-workflow-coder-sans-perdre-controle`, `nextjs-16-recommencer-application-saas-zero`, `creer-application-saas-retour-experience-liflow`).
- Aucun autre `export const dynamic`/`export const revalidate` dans le projet (`grep -rn` sur `app` et `src` : 1 seul résultat, celui de la homepage).

Le `force-dynamic` de la homepage contredit l'objectif du master plan section 5.3 (« Hero rendu statiquement si possible », « éviter `force-dynamic` sans nécessité ») — retenu comme problème (voir section 13).

## 7. Composants client (`"use client"`)

6 fichiers sur 29 fichiers `.ts`/`.tsx` dans `app/` + `src/` (hors tests) portent la directive `"use client"` :

- `app/components/service-worker-registration.tsx`
- `src/components/contact-form.tsx`
- `src/components/layout/page-shell.tsx`
- `src/components/map/map-connections.tsx`
- `src/components/map/map-node.tsx`
- `src/components/map/world-map.tsx`

Soit environ 6 composants client / 23 fichiers serveur ou neutres. Tous les composants client concernent une justification claire (interactivité de la carte, formulaire, service worker, wrapper de layout avec état) — pas de "use client" superflu détecté.

## 8. Vérifications automatisées

Toutes les commandes ont été exécutées à la racine du repo avec `pnpm` (conforme au `CLAUDE.md` du projet).

| Commande         | Résultat                     | Détail                                                                                                                                                                                           |
| ---------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm lint`      | ✅ succès (exit 0)           | `eslint` — aucune erreur, aucun warning affiché                                                                                                                                                  |
| `pnpm typecheck` | ✅ succès (exit 0)           | `tsc --noEmit` — aucune erreur                                                                                                                                                                   |
| `pnpm test`      | ✅ succès (exit 0)           | Vitest — **2 fichiers, 10 tests, 10 passed** (`blog.test.ts`, `json-ld.test.ts`), durée 116 ms                                                                                                   |
| `pnpm build`     | ✅ succès (exit 0)           | `next build` (Turbopack, Next.js 16.2.12) — compilation 1.2 s, TypeScript 1.4 s, 23 pages statiques générées, aucune erreur                                                                      |
| `pnpm e2e`       | ✅ succès (exit 0)           | Playwright, Chromium déjà installé localement — **9/9 tests passés** (`e2e/smoke.spec.ts` : accueil, navigation vers les 5 zones, formulaire de contact, page de blog, 404 brandée), durée 2.6 s |
| `pnpm audit`     | ⚠️ 6 vulnérabilités (exit 1) | Voir détail section 9                                                                                                                                                                            |

Sortie brute du build (table des routes) :

```
Route (app)
┌ ƒ /
├ ○ /_not-found
├ ○ /about
├ ○ /apple-icon.png
├ ○ /apps
├ ○ /background
├ ○ /blog
├ ● /blog/[slug]
│ ├ /blog/liflow-refonte-souvenirs-familiaux
│ ├ /blog/prix-site-web-2026
│ ├ /blog/beau-site-web-seo-google
│ └ [+4 more paths]
├ ○ /icon.png
├ ○ /lab
├ ○ /manifest.webmanifest
├ ○ /opengraph-image
├ ○ /projects
├ ○ /robots.txt
├ ○ /seo
└ ○ /sitemap.xml
```

Note : cette version de Next.js (Turbopack) n'affiche pas de tableau de taille de bundle par route dans la sortie standard de `next build` — l'analyse de bundle (section 14 du master plan) n'a pas été effectuée dans cette phase, elle n'était pas listée dans les tâches de la Phase 0.

CI GitHub Actions (`gh run list --limit 5`) : dernier run sur `main` = **success** (commit `ae49c8f`, "fix: close CRLF injection...", durée 1m45s).

## 9. Dépendances — `pnpm audit`

6 vulnérabilités remontées par `pnpm audit` (exécuté réellement, sortie non tronquée) :

| Sévérité | Package           | Problème                                                         | Chemin                                    |
| -------- | ----------------- | ---------------------------------------------------------------- | ----------------------------------------- |
| High     | `sharp` (libvips) | CVE-2026-33327, CVE-2026-33328, CVE-2026-35590, CVE-2026-35591   | `.>next>sharp`                            |
| High     | `postcss`         | Arbitrary file read via `sourceMappingURL` (GHSA-6g55-p6wh-862q) | `.>next>postcss`                          |
| High     | `postcss`         | Path Traversal via source map auto-loading (GHSA-r28c-9q8g-f849) | `.>next>postcss`                          |
| Moderate | `postcss`         | XSS via `</style>` non échappé (GHSA-qx2v-qp2m-jg93)             | `.>next>postcss`                          |
| Moderate | `postcss`         | Fix incomplet de GHSA-6g55-p6wh-862q (GHSA-fxqj-rqcc-2cmp)       | `.>next>postcss`                          |
| Moderate | `hono`            | ReDoS dans le middleware CORS (GHSA-8j4g-w8fx-2239)              | `.>shadcn>@modelcontextprotocol/sdk>hono` |

Toutes transitives (via `next` et `shadcn`), aucune dépendance directe vulnérable. `sharp`/`postcss` remontent de `next@16.2.12` lui-même — pas actionnable sans bump de Next.js. `hono` remonte de `shadcn` (CLI, dépendance de dev, pas de runtime en production).

## 10. Captures d'écran (desktop / mobile)

Prises via Playwright (déjà une dépendance du projet — `@playwright/test`, Chromium 1234 déjà installé localement) contre `pnpm start` (build de production) sur `localhost:3000`, viewport desktop `1440×900` et mobile `390×844`, `fullPage: true`. Sauvegardées dans `docs/audits/screenshots/` :

- `home-desktop.png` / `home-mobile.png`
- `projects-desktop.png` / `projects-mobile.png`
- `apps-desktop.png` / `apps-mobile.png`
- `about-desktop.png` / `about-mobile.png`

## 11. Lighthouse

Exécuté réellement via `pnpm dlx lighthouse` (résolution réseau vérifiée au préalable) contre `pnpm start` sur `localhost:3000/`, Chrome headless. Rapports complets (HTML + JSON) sauvegardés dans `docs/audits/lighthouse/`.

**Mobile** (`home-mobile.report.html`/`.json`) :

| Catégorie        | Score |
| ---------------- | ----- |
| Performance      | 95    |
| Accessibility    | 95    |
| Best Practices   | 100   |
| SEO              | 100   |
| Agentic-browsing | 100   |

LCP 2.9 s · CLS 0 · TBT 20 ms · FCP 0.8 s · Speed Index 0.8 s

**Desktop** (`home-desktop.report.html`/`.json`, `--preset=desktop`) :

| Catégorie        | Score |
| ---------------- | ----- |
| Performance      | 100   |
| Accessibility    | 95    |
| Best Practices   | 100   |
| SEO              | 100   |
| Agentic-browsing | 100   |

LCP 0.5 s · CLS 0 · TBT 0 ms

**Détail de l'échec accessibilité** (identique mobile/desktop, audit `color-contrast`, score 0 sur cet audit) : contraste insuffisant sur plusieurs éléments de la homepage, dont l'eyebrow `"DÉVELOPPEUR FULLSTACK FREELANCE"` (`main > div > header > p`, classe `text-zinc-500` sur fond `#020202`) — contraste mesuré **4.29:1**, seuil requis **4.5:1** — et au moins un autre élément de texte (label de carte, `text-[11px]`). Détail complet dans le JSON exporté.

## 12. Sitemap, robots, metadata

- `app/sitemap.ts` : génère `/`, `/apps`, `/lab`, `/seo`, `/projects`, `/about`, `/blog`, `/background` + une entrée par article de blog (7 slugs). Vérifié en conditions réelles via `curl http://localhost:3000/sitemap.xml` sur le serveur `pnpm start` local — sortie XML valide, 15 URLs au total, cohérente avec le fichier source.
- `app/robots.ts` : `Allow: /` pour tous les user-agents, référence le sitemap. Vérifié via `curl http://localhost:3000/robots.txt` — sortie conforme.
- `app/layout.tsx` : `metadata.metadataBase = new URL("https://randy-code.dev")` présent (corrigé en v0.6.2 selon le CHANGELOG), `title`, `description`, `twitter.card = "summary_large_image"` présents. **Pas de champ `openGraph` explicite** dans l'objet `metadata` (seul `app/opengraph-image.tsx` génère l'image OG dynamiquement, Next.js déduit le reste par défaut — pas vérifié si suffisant, à valider en Phase 11 SEO).
- `app/manifest.ts` : PWA manifest présent, `name`/`short_name`/icônes 192/512 référencées (confirmé présentes dans `public/`).

## 13. Liens internes / liens cassés

Méthode : extraction de tous les `href="/...")` et `href={...}` internes dans `app/` et `src/`, comparaison à l'inventaire de routes réel (section 2), puis vérification HTTP réelle via `curl` sur chaque route contre le serveur `pnpm start` local.

Liens internes trouvés :

- Littéraux : `app/not-found.tsx` → `/`, `app/projects/page.tsx` → `/about`, `app/blog/[slug]/page.tsx` → `/blog`, `app/seo/page.tsx` → `/about`, `app/apps/page.tsx` → `/about`, `src/components/layout/page-shell.tsx` → `/`
- Dynamiques : `src/components/map/map-node.tsx` (`href={route}`, alimenté par `zones` de `data.ts`), `src/components/map/world-map.tsx` (`href={zone.route}`), `app/blog/page.tsx` (`href={\`/blog/${post.slug}\`}`), `app/projects/page.tsx` (`href={project.link}`, liens externes uniquement — `liflow.app`, `infralens.dev`, ou `null`)

Vérification HTTP réelle (`curl -o /dev/null -w "%{http_code}"`) :

| Route         | Code HTTP                                       |
| ------------- | ----------------------------------------------- |
| `/`           | 200                                             |
| `/about`      | 200                                             |
| `/apps`       | 200                                             |
| `/background` | 200                                             |
| `/blog`       | 200                                             |
| `/contact`    | **404** (attendu — pas de page, voir section 2) |
| `/lab`        | 200                                             |
| `/projects`   | 200                                             |
| `/seo`        | 200                                             |

**Aucun lien interne cassé trouvé** — toutes les routes référencées dans le code (map, nav, liens littéraux, slugs de blog) existent réellement et répondent 200. Le seul 404 constaté (`/contact`) n'est référencé nulle part comme lien interne — ce n'est donc pas un lien cassé, mais l'absence d'une route que l'architecture cible attend.

## 14. Redirections nécessaires (analyse d'écart, non implémentées)

Comparaison entre l'arborescence réelle (section 2) et l'architecture cible du master plan (section 2.4 : `/projects`, `/tools`, `/articles`, `/about`, `/contact`) :

| Route actuelle | Devenir cible (master plan)                                                                                | Action Phase 2+                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `/apps`        | Supprimée, contenu réparti dans `/projects` (Liflow, InfraLens) et futur `/tools`                          | Redirection à prévoir (`/apps` → `/projects` ou `/tools`)                          |
| `/background`  | Fusionnée dans `/about`                                                                                    | Redirection à prévoir (`/background` → `/about`)                                   |
| `/blog`        | Renommée `/articles` (Knowledge Base conservé comme nom d'univers)                                         | Redirection à prévoir (`/blog` → `/articles`, `/blog/[slug]` → `/articles/[slug]`) |
| `/seo`         | Option A (page dédiée) ou B (intégré ailleurs) — décision produit non tranchée par le master plan lui-même | Pas de redirection déterminable avant décision                                     |
| `/lab`         | Conservée si contenu démonstratif suffisant                                                                | Aucune action déterminée à ce stade                                                |
| _(aucune)_     | `/contact` doit exister                                                                                    | Pas une redirection — création de route manquante                                  |
| _(aucune)_     | `/tools`, `/tools/infralens`, `/projects/[slug]` doivent être créés                                        | Pas des redirections — nouvelles routes                                            |

Ceci est une analyse d'écart uniquement ; aucune redirection n'a été implémentée dans cette phase.

## 15. Nettoyage effectué

- Serveur `pnpm start` lancé en arrière-plan pour les vérifications (curl, screenshots, Lighthouse) : arrêté proprement en fin d'audit (`kill`), port 3000 libéré (confirmé par `lsof -i :3000` vide après arrêt).
- Fichiers temporaires de travail (rapports Lighthouse bruts, script de capture) générés sous `/tmp`, hors du repo ; seules les copies finales ont été placées dans `docs/audits/`.

---

## 16. Liste des problèmes (P0 / P1 / P2 / P3)

Classification selon la section 20 du master plan, strictement basée sur les faits observés ci-dessus.

### P0 — Bloquant / exactitude

_Aucun problème P0 trouvé._ Le statut de Liflow est déjà correct (actif, "Disponible"), aucune information factuellement fausse détectée dans les zones auditées, aucun lien interne cassé, aucune route existante cassée par le code actuel, lint/typecheck/tests/build/e2e tous verts.

### P1 — Forte valeur

- **Vulnérabilités de dépendances (high)** — `sharp`/`postcss` (via `next@16.2.12`) : 3 CVE high, remontées par `pnpm audit`. Non actionnable sans mise à jour de Next.js ; à surveiller/re-vérifier à chaque bump de `next` (cf. mémoire projet sur le blocage TS7/ESLint10, un bump de `next` pourrait aussi débloquer ces CVE).
- **Contraste insuffisant (accessibilité)** — audit Lighthouse `color-contrast` en échec sur la homepage (eyebrow 4.29:1 vs 4.5:1 requis, et au moins un autre élément) — impacte directement les critères d'accessibilité du master plan (section 13.1).
- **Absence de route `/contact`** — le dossier `app/contact/` ne contient qu'une server action, pas de page ; `/contact` répond 404. L'architecture cible (section 2.4) et la Phase 2/9 du plan supposent une page contact dédiée.
- **`force-dynamic` non justifié sur la homepage** — contredit directement l'objectif de performance du master plan (section 5.3 : "éviter `force-dynamic` sans nécessité", "Hero rendu statiquement si possible"). À investiguer en Phase 3 (pourquoi ce choix a été fait avant de le retirer).
- **Contenu projet non centralisé** — les données de `/projects` et `/apps` sont des tableaux littéraux inline dans chaque `page.tsx`, dupliqués entre les deux pages pour Liflow/InfraLens (chevauchement déjà diagnostiqué par le master plan section 1.2/4.1, confirmé ici dans le code réel).

### P2 — Amélioration

- **Pas d'analyse de taille de bundle disponible** — le build Turbopack de Next 16 n'affiche pas de tableau de poids par route ; une analyse dédiée (`@next/bundle-analyzer` ou équivalent) sera nécessaire en Phase 12 pour la section Performance du plan.
- **`hono` (moderate, via `shadcn` CLI)** — dépendance de dev uniquement, faible priorité mais à nettoyer si un futur bump de `shadcn` la résout naturellement.
- **Pas de champ `openGraph` explicite** dans `app/layout.tsx` (metadata) — à vérifier/expliciter en Phase 11 (SEO technique).
- **Décision SEO District non tranchée** — le master plan lui-même liste deux options (A/B, section 4.6) sans trancher ; à documenter comme décision humaine en attente avant Phase 2.

### P3 — Optionnel

- **`/lab` — contenu à re-valider** — non audité en détail dans cette phase (hors périmètre Phase 0), mais le master plan (section 4.7) demande d'éviter les entrées "en cours"/"en pause" sans preuve concrète ; à vérifier lors de l'audit de contenu (Phase 1).

---

## 17. Ce qui n'a pas pu être vérifié / hors périmètre de cette phase

- Analyse de bundle JS par route (pas d'outil dédié lancé, non listé dans les tâches Phase 0).
- Audit clavier manuel et lecteur d'écran (nécessite un opérateur humain, hors capacité de cet audit automatisé — seul l'audit Lighthouse accessibility a été exécuté).
- Test de `prefers-reduced-motion` en conditions réelles (non testé par Lighthouse ni Playwright ici).
- Recherche exhaustive de fautes d'orthographe/incohérences éditoriales sur l'ensemble des pages (hors périmètre Phase 0, prévu Phase 1).
