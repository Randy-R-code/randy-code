# Changelog

## [0.10.4] — 2026-08-12

### Corrections

- **Icônes PWA/mobile transparentes rendues blanches par l'OS, et R visuellement décentré** — signalé par toi : sur l'écran d'accueil du téléphone, la transparence des PNG (`app/icon.png`, `app/apple-icon.png`, `public/icon-192.png`, `public/icon-512.png`, `app/favicon.ico`) n'est pas gérée par l'OS et se rend en blanc. Fond opaque `#070b10` ajouté (déjà utilisé comme `background_color`/`theme_color` du manifest et `--background` du design system), et le glyphe recadré de quelques pixels vers la droite : la bounding box était déjà centrée mais le centre de masse réel du R (jambe diagonale plus fine que le fût gauche) était décalé d'environ 3,5% vers la gauche, d'où l'impression de décentrage. Le logo du site (`public/brand/logo-symbol.png`, header) n'est pas concerné et reste transparent — il repose déjà sur le fond sombre de la page.

## [0.10.3] — 2026-08-11

### Corrections

- **Badge de statut coupé net sur mobile** (`CheckResultCard`) — la ligne titre+badges était un `flex` sans `flex-wrap`, et `Card` a `overflow-hidden` : quand le titre + "+N pts" + badge de statut ne tenaient pas sur une largeur mobile, le badge se faisait couper net par le bord arrondi de la card au lieu de passer à la ligne. Signalé par toi via une capture d'écran. Ajout de `flex-wrap` : le badge descend proprement sous le titre quand ça ne tient pas.

## [0.10.2] — 2026-08-11

### Corrections

- **Messages d'erreur InfraLens redactés en production** — Next.js redacte le `.message` de tout `Error` jeté (`throw`) depuis un Server Action en build de prod, par sécurité. Les messages soignés d'InfraLens (blocage SSRF, rate limit) ne remontaient donc jamais jusqu'à l'utilisateur — un générique Next s'affichait à la place. Vu en dev pendant la migration mais jamais corrigé, ni côté InfraLens historique ni ici. `runInfraChecks` (`app/tools/infralens/actions/run-checks.ts`) retourne désormais `{ ok: false, message }` au lieu de `throw` pour ses trois rejets attendus (rate limit, cible SSRF, URL malformée) — Next ne redacte que les exceptions jetées, pas les données retournées normalement. Une vraie erreur inattendue continue de `throw` et garde le message générique de Next, ce qui reste le bon comportement pour un cas non prévu. Vérifié avec un vrai `pnpm build && pnpm start` (le bug ne se manifeste qu'en prod, jamais en dev) : le message SSRF exact et le message de rate limit s'affichent maintenant correctement.
- **"Please wait 1 seconds"** — accord manquant, corrigé au passage dans le même fichier.

## [0.10.1] — 2026-08-11

### Corrections

- **`logo-symbol.png` préchargé sur chaque page InfraLens sans jamais être utilisé** — signalé par toi via un warning console. Diagnostiqué en isolant la source par test empirique : Next.js précharge tout asset statique référencé dans `not-found.tsx` sur l'ensemble des pages du segment (pour un rendu instantané en cas de 404), même si la page 404 n'est presque jamais affichée. Retiré, remplacé par le seul texte "InfraLens" — plus de préchargement inutile sur aucune route.
- **`not-found.tsx` avait échappé à la retokenisation de la Phase 5** — seul fichier oublié du balayage (classes zinc brutes). Retokenisé au passage.
- **Accord grammatical dans "At a glance"** — `"1 check ... aren't counted"` (devrait être _isn't_ au singulier) corrigé en `priority-summary.tsx`, trouvé lors de la vérification visuelle de la Phase 4.

## [0.10.0] — 2026-08-11

### Contenu

- **InfraLens recoloré avec la vraie palette Randy Code** — `.infralens-scope` (`app/globals.css`) ne redéfinit plus tout un thème shadcn zinc en dur. Fond, surfaces, bordures et texte héritent désormais directement des tokens Randy Code (`--surface-1/2/3`, `--border-subtle`, `--text-primary/secondary`) via la cascade CSS normale — un seul bloc de 11 lignes ne fait plus qu'overrider ce qui doit rester distinct (le vert `--primary`/`--ring` d'InfraLens). Rendu possible par la Phase 5 : tous les composants lisant déjà les classes sémantiques au lieu du zinc brut, ce changement se propage automatiquement sans retoucher un seul fichier de composant. Couleurs de statut (Pass/Warning/Fail/Info/Unavailable/Error) inchangées — vérifié en vivant + 25/25 E2E dont accessibilité, aucune régression de contraste.

## [0.9.1] — 2026-08-11

### Nettoyage

- **Classes zinc brutes retokenisées vers les classes sémantiques Randy Code** — 210 occurrences dans 22 fichiers InfraLens (`bg-zinc-900`→`bg-background`, `text-zinc-400`→`text-muted-foreground`, `border-zinc-800`→`border-border`, etc.) ; changement de valeurs nul pour l'instant (`.infralens-scope` garde ses valeurs actuelles), seulement les noms de classes changent — prépare la recoloration réelle sans retoucher ces fichiers une seconde fois.
- **Card `/tools` d'InfraLens** — CTA redondant "Lancer l'outil" supprimé, "Ouvrir InfraLens" renommé "Ouvrir l'outil" (générique, réutilisable pour les futurs outils), logo ajouté, classes zinc remplacées par les tokens Randy Code natifs (ce fichier vit hors `.infralens-scope`).
- **Back-link tripliqué sur docs/privacy/compare** — chaque page avait son propre "← Back to home" identique, en plus du lien global "Retour aux outils". Remplacé par un composant `LocalNav` partagé ("Analyze · Compare · Documentation"), qui donne une vraie navigation latérale au lieu d'un retour dupliqué.

### Corrections

- **Contraste insuffisant sur le badge "Fail"** (`text-red-500` sur `bg-red-500/10`, 4.1:1 au lieu de 4.5:1 requis) — préexistant, jamais détecté car aucun exemple "Fail" n'était jusqu'ici scanné par les tests d'accessibilité (corrigé en trouvant l'exemple de rapport, v0.9.0). Aligné sur `-400` comme les statuts `info`/`error` déjà conformes.

## [0.9.0] — 2026-08-11

### Contenu

- **Exemple de rapport et carte OG d'InfraLens reconstruits pour refléter le vrai produit** — l'exemple sur la landing (`results-preview.tsx`) n'affichait qu'un badge de statut nu et 3 checks non repliables limités à 2 statuts sur 6, sans le bandeau hostname/URL/score ni le "At a glance" ("Worth fixing first" / "Working well") pourtant devenus le cœur visuel du vrai rapport depuis son redesign. Reconstruit en réutilisant directement les vrais composants `PrioritySummary` et `CheckResultCard` (au lieu d'une réimplémentation parallèle avec son propre badge de statut, qui avait déjà dérivé — vocabulaire "OK" et mapping icône/couleur incorrect trouvés en passant, corrigés en Phase 2). La carte OG partage désormais la même source de données (`src/infralens/lib/mock-report.ts`) au lieu d'une deuxième copie séparée qui pouvait diverger silencieusement.

## [0.8.3] — 2026-08-11

### Nettoyage

- **Primitives shadcn dupliquées entre InfraLens et Randy Code fusionnées** — `button.tsx`/`card.tsx` existaient en double (échelles différentes) ; supprimés côté InfraLens, les 23 fichiers consommateurs pointent désormais sur `src/components/ui/` (adoptent l'échelle Randy Code, plus compacte). `accordion.tsx`/`badge.tsx`/`collapsible.tsx`/`dialog.tsx`/`input.tsx`/`skeleton.tsx` (sans équivalent côté Randy Code) promus dans `src/components/ui/` pour être réutilisables par les futurs outils (MetaLens, JSON Studio, Cron Builder). `alert.tsx`/`separator.tsx`/`table.tsx`/`tooltip.tsx` supprimés (0 usage, code mort). `src/infralens/components/ui/` n'existe plus.

## [0.8.2] — 2026-08-11

### Nettoyage

- **Section "How results are presented" retirée de la landing InfraLens** — faisait doublon avec l'exemple de rapport juste au-dessus (`results-preview.tsx`), et affichait en plus un vocabulaire de statut obsolète ("OK" au lieu de "Pass", un badge "Error" utilisant l'icône/couleur de "Fail") jamais mis à jour depuis le renommage des statuts. Rien d'unique à en récupérer.

## [0.8.1] — 2026-08-11

### Corrections

- **Dernier lien actif vers `infralens.dev`** — `src/lib/projects.ts` (case study + `projectUrl`, alimente la home, `/projects`, `/projects/infralens` et le JSON-LD) pointait encore vers l'ancien domaine et décrivait InfraLens comme "installable en PWA avec support hors ligne", faux depuis la migration native. Repointé vers `/tools/infralens`, description mise à jour (statuts Pass/Warning/Fail/Info/Unavailable/Error, export Markdown, comparaison).
- **Canonical et sitemap manquants pour InfraLens** — aucune des 4 routes (`/tools/infralens`, `/compare`, `/docs`, `/privacy`) n'avait de `alternates.canonical` ni d'entrée dans `app/sitemap.ts`. Ajoutés.

### Nettoyage

- **`docs/roadmap.md`** — les entrées Phase 7/8 InfraLens décrivaient encore l'ancien proxy `rewrites()`/`INFRALENS_ORIGIN`, obsolète depuis la migration native de `v0.7.16`. Réécrites pour refléter l'état actuel.

## [0.8.0] — 2026-08-11

### Contenu

- **Clôture de l'ère "refonte 0.7.x"** — l'intégration native d'InfraLens (`v0.7.16`) était le dernier chantier de cette ligne ; cette version ouvre un nouveau chapitre pour le portfolio.

### Corrections

- **Double footer sur `/tools/infralens`** — InfraLens avait son propre footer (logo, watermark, bloc d'attribution) rendu en plus du footer global Randy Code. Retiré, remplacé par un lien "Retour aux outils" (`src/components/layout/tool-back-link.tsx`, même style que "Retour à la carte" de `PageShell` — réutilisable tel quel par les futurs outils), et les liens Documentation/Privacy/License/GitHub regroupés dans le hero au lieu d'un second bandeau.
- **3 liens morts vers `github.com/Randy-R-code/infralens`** — le repo source va être supprimé. `site-config.ts` (`repositoryUrl`/`licenseUrl`), le User-Agent envoyé par l'outil à chaque analyse (`constants.ts`), et les instructions de signalement de vulnérabilité (`docs/infralens/SECURITY.md`) repointés vers `randy-code` et l'email de contact.
- **Titre d'onglet "Développeur Fullstack Freelance"** — laissé de côté par la recoloration de l'image OG en v0.7.14, qui n'avait touché que le visuel. `app/layout.tsx`, `app/manifest.ts`, `src/lib/json-ld.ts` alignés sur "Fullstack TypeScript".

### Nettoyage

- **`INFRALENS_TO_RANDY_CODE_MIGRATION_MASTER_PLAN.md`** déplacé de la racine vers `docs/infralens/` — la migration étant terminée, le document n'avait plus sa place parmi les sources de vérité actives du portfolio.

## [0.7.16] — 2026-08-10

### Contenu

- **InfraLens migré nativement dans Randy Code** (`INFRALENS_TO_RANDY_CODE_MIGRATION_MASTER_PLAN.md`, Phase 1) — copie intégrale du moteur (18 checks, scoring, DNS, sécurité/SSRF, compare, history, recommendations) dans `src/infralens/`, namespacé avec des alias tsconfig/vitest dédiés (`@infralens-*`) pour éviter toute collision avec le `src/` existant. Routes natives sous `app/tools/infralens/` (page, `/compare`, `/docs`, `/privacy`, `opengraph-image`, catch-all `[...slug]` pour le 404 stylé — Next ne route pas ça automatiquement une fois le `basePath` retiré). Le proxy `rewrites()` et `INFRALENS_ORIGIN` de `next.config.mjs` (Phase 7, v0.7.15) sont supprimés : `/tools/infralens` répond désormais directement depuis ce dépôt.
- **Tokens InfraLens isolés** (`app/globals.css`, `.infralens-scope`) — la palette shadcn d'origine d'InfraLens (primaire vert) est réappliquée dans un scope dédié autour de `app/tools/infralens`, pour ne pas hériter silencieusement du bleu global de Randy Code sur ses composants migrés. Harmonisation profonde volontairement différée.
- **E2E InfraLens** (`e2e/infralens/`) — 4 specs migrées dans deux projets Playwright dédiés (`infralens-desktop`/`infralens-mobile`, 1 worker — le flux d'analyse est rate-limité à 1 requête/IP/30s), lancés via `pnpm e2e:infralens` et un nouveau job CI séparé.
- **Documentation d'origine conservée** sous `docs/infralens/` (README, CHANGELOG, SECURITY, CONTRIBUTING, LICENSE MIT, master/branding plans InfraLens) ; README principal mis à jour avec une section "Outils intégrés".

### Outillage

- `pnpm check` inclut désormais les tests unitaires (`pnpm test --run`), qui ne l'étaient pas avant.
- Dépendances ajoutées : `@radix-ui/react-{accordion,collapsible,dialog,separator,slot,tooltip}`, `ip-address`, `nanoid`, `undici`, `@axe-core/playwright` (dev) — uniquement celles réellement importées par le code migré.

### Connu — reste à faire

- Baseline complète (`docs/infralens/MIGRATION_BASELINE.md`) et suite de validation déjà vertes (282 tests unitaires, 25/25 E2E InfraLens, 15/15 E2E portfolio, build) mais `docs/infralens/MIGRATION_PARITY.md` (comparaison formelle source/cible, Phase 2 du plan) reste à rédiger.
- Ancien dépôt `infralens` et domaine `infralens.dev` pas encore traités (archivage, redirection) — prévu Phase 3 du plan de migration.
- Harmonisation de la palette (vert InfraLens vs bleu Randy Code) volontairement reportée.

## [0.7.15] — 2026-08-10

### Contenu

- **Article "Sécuriser un analyseur d'URL contre le SSRF"** (`content/posts/securiser-analyseur-url-contre-ssrf.ts`) — gelé depuis la Phase 10 en attendant que les protections décrites existent vraiment ; publié maintenant que le correctif est en place et testé côté InfraLens (Phase 2 InfraLens, 2026-08-09). Décrit le mécanisme de protection (classification IP, DNS rebinding, revalidation des redirections) sans détail exploitable.
- **Phase 7 (Espace Outils), partie randy-code** — proxy `next.config.mjs` (`rewrites()`) exposant `/tools/infralens/*` vers le déploiement InfraLens (`INFRALENS_ORIGIN`, `infralens.dev` par défaut) ; `/tools` mis à jour avec un lien interne vers l'outil et un lien vers l'étude de cas, à la place du lien externe et de la mention "intégration prévue".

### Nettoyage

- **`PORTFOLIO_REDESIGN_MASTER_PLAN.md` renommé `RANDY_CODE_MASTER_PLAN.md`** pour cohérence avec les deux autres documents de source de vérité (`RANDY_CODE_BRANDING_PLAN.md`, `RANDY_CODE_ECOSYSTEM_VISION.md`). Références mises à jour dans `docs/roadmap.md`, `RANDY_CODE_BRANDING_PLAN.md`, `docs/audits/baseline.md` ; les mentions historiques dans ce changelog restent inchangées.

### Connu — reste à faire

- **Côté InfraLens de la Phase 7 volontairement non traité depuis ce dépôt** (`basePath`, `serverActions.allowedOrigins`, `manifest.json` préfixé, redirection de `infralens.dev` vers le nouveau chemin, désactivation du service worker embarqué) — à appliquer depuis le dépôt InfraLens directement. `/tools/infralens` reste en 404 tant que ce n'est pas fait (vérifié en vivant : le proxy atteint bien InfraLens, qui répond 404 faute de route à ce chemin).
- `INFRALENS_ORIGIN` pointe sur `infralens.dev` — à rebasculer vers l'URL de déploiement Vercel sous-jacente avant que ce domaine ne soit retiré.

## [0.7.14] — 2026-08-08

### Contenu

- **Image Open Graph** (`app/opengraph-image.tsx`) — recolorée sur `brand.ts` (fin de l'ancienne palette isolée violet/cyan/vert) ; eyebrow "RANDY RIMBAULT" → "RANDY CODE" ; titre "Développeur Fullstack Freelance" → "Développeur Fullstack TypeScript" (le mot "Freelance" ne correspondait plus au positionnement construit depuis B1) ; nom personnel replacé dans le tagline. Pas de logo sur cette card — à cette échelle il n'apporte pas de reconnaissance et la card est déjà dense.

### Corrections

- **Contraste du footer** — `text-zinc-500` (4.08:1, sous le seuil AA) réintroduit sans y penser dans le nouveau footer (copyright + 3 labels de colonne), détecté par Lighthouse. Corrigé en `text-zinc-400`, même correctif que B1-B4, revérifié à 100/100.

### Nettoyage

- **`docs/roadmap.md`** — Phase B7 (QA finale branding) close : couleurs obsolètes (zéro trouvée), reduced-motion, flash de thème, responsive mobile (footer + menu) tous vérifiés. B5 documenté comme fonctionnellement complet (reste un alignement mineur du footer, explicitement repoussé par Randy).

## [0.7.13] — 2026-08-08

### Contenu

- **Logo Randy Code** (`public/brand/logo-symbol.png`, `logo-horizontal.png`, `logo-vertical.png`) — premier jeu d'assets définitif (monogramme R, dégradé bleu→vert), fourni par Randy après deux tentatives de dessin manuel non concluantes. Intégré dans le header (à côté du texte "Randy Code" existant), et régénéré en `app/icon.png`, `app/apple-icon.png`, `public/icon-192.png`, `public/icon-512.png` par simple redimensionnement (source déjà carrée et centrée).
- **`app/manifest.ts`** — `name`/`short_name` enfin resynchronisés avec la marque "Randy Code" (portaient encore le nom personnel et l'ancien "R-code"), `background_color`/`theme_color` alignés sur le token de fond de marque.
- **`app/layout.tsx`** — `appleWebApp.title` passé de "R-code" à "Randy Code".
- **Footer** (`src/components/layout/site-footer.tsx`, nouveau — le site n'en avait aucun) — 3 colonnes de liens (Explorer, Site, Liens), logo + description + copyright, wordmark en filigrane pleine largeur. Icône GitHub en SVG dédié (`src/components/github-icon.tsx`), réutilisée dans le hero à la place de l'icône générique précédente.
- **Navigation** (`src/lib/nav.ts`) — Lab Zone ajoutée, elle n'était accessible que via la carte interactive.
- **Homepage** (`app/page.tsx`) — grille "Accès alternatif" retirée (redondante avec le header et la carte) ; bouton "Voir le produit" des projets phares retravaillé (icône à gauche, style bouton).
- **Mentions "apps mobiles"** ajoutées aux meta descriptions et au headline du hero, cohérent avec le boilerplate mobile du Lab.

### Corrections

- **`public/sw.js`** — référençait encore `/apple-touch-icon.png`, supprimé plus tôt dans ce chantier, ce qui cassait l'installation du service worker (`cache.addAll` échoue sur une 404). Corrigé vers `/apple-icon.png`, `CACHE_NAME` passé à `v2` pour invalider le cache des visiteurs déjà passés.

### Nettoyage

- **`docs/roadmap.md`** — Phase B5 (logo) documentée en cours, avec le détail des tentatives de dessin/extraction manuelles abandonnées et un incident de session (serveur de production zombie ayant faussé une partie du diagnostic).

### Connu — reste à faire

- Léger écart d'alignement vertical dans le footer entre les liens avec icône et les liens texte simple, pas encore résolu (diagnostic brouillé par le serveur zombie mentionné ci-dessus, à reprendre avec un environnement propre).
- Variante "R-code" et image Open Graph statique toujours en attente pour clore B5.

## [0.7.12] — 2026-08-08

### Contenu

- **`src/lib/brand.ts`** — nouvelle source de vérité des tokens de marque (palette bleu/vert, neutres, couleurs fonctionnelles, valeurs exactes du plan de branding). Les 5 couleurs de zone historiques (violet/cyan/orange/rose/ambre) sont remplacées : bleu dominant partout, vert réservé à Tools Station/InfraLens et à des accents ponctuels (libellés "Résultat", succès du formulaire de contact).
- **`src/components/layout/app-background.tsx`** — nouveau fond décoratif global (grille technique, halo bleu, halo vert, vignette), monté une fois dans `app/layout.tsx`. Composition simplifiée en direct pendant l'implémentation (lignes topographiques et calque "réseau" retirés après retour visuel).
- **Surfaces et bordures harmonisées** — 3 fonds de carte historiques remplacés par des tokens `surface-1/2/3` ; 5 suffixes d'opacité de bordure incohérents ramenés à 3 rôles fixes ; bordures neutres migrées vers des tokens `--border-subtle/default`. Hover de la carte interactive retravaillé (légère remontée au lieu d'un zoom).
- **25 occurrences `text-zinc-500`/`text-zinc-600`** (11 fichiers, jamais testées par Lighthouse) corrigées en `text-zinc-400`, même correctif que la Phase 3 homepage.

### Corrections

- **Contraste `blue-500` sur fond teinté** — le texte des badges/chips (motif `${color}18` utilisé partout) tombait à 4.24:1, sous le seuil AA 4.5:1, avec la nouvelle couleur de marque. Détecté par Lighthouse, corrigé en déplaçant la teinte de texte/identité de `blue-500` vers `blue-400` (11 fichiers + `src/lib/data.ts`) ; `green-500` ne posait pas ce problème.

### Outillage

- **CSP assouplie en développement uniquement** (`next.config.mjs`) — `'unsafe-eval'` ajouté à `script-src` seulement quand `NODE_ENV === "development"`, pour supprimer un avertissement console React (eval() dev-only, jamais utilisé en production). La CSP de production reste inchangée, vérifiée par le test e2e dédié qui tourne contre `pnpm start`.
- **`docs/roadmap.md`** — Phases B0 à B4 du chantier branding marquées terminées (section 8).

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
