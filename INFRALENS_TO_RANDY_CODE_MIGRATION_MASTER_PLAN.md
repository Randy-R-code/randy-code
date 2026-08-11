# INFRALENS_TO_RANDY_CODE_MIGRATION_MASTER_PLAN.md

> **But unique :** migrer InfraLens du repo `Randy-R-code/infralens` vers `Randy-R-code/randy-code` en conservant absolument toutes les fonctionnalités utiles, tous les contrôles, toute la sécurité, tous les tests unitaires, tous les tests E2E, la comparaison, l’historique local, les exports, la documentation et les assets de marque.
>
> **Approche :** ce n’est PAS une réécriture. C’est une migration quasi intégrale par copier-coller, avec adaptation minimale de l’enveloppe Next.js et de l’architecture.
>
> **Nombre de phases : 3 maximum.**
>
> **État audité : 10 août 2026**
>
> Repo source : `Randy-R-code/infralens`
>
> Repo cible : `Randy-R-code/randy-code`

---

# 0. RÈGLE ABSOLUE

L’objectif est de récupérer **100 % de la valeur fonctionnelle d’InfraLens** dans Randy Code.

L’IA ne doit pas profiter de la migration pour :

- réécrire le moteur ;
- simplifier les checks ;
- refactorer arbitrairement les contrôles réseau ;
- modifier le scoring sans nécessité ;
- changer les comportements de sécurité ;
- changer l’UX métier ;
- supprimer des tests pour faire passer la CI ;
- modifier les résultats attendus ;
- remplacer les bibliothèques sans nécessité ;
- fusionner agressivement les composants UI InfraLens avec ceux de Randy Code ;
- supprimer des fichiers sous prétexte qu’ils semblent redondants sans avoir vérifié leur rôle.

Le principe est :

> **Copier d’abord, faire fonctionner à l’identique, harmoniser plus tard.**

---

# 1. ÉTAT ACTUEL AUDITÉ

## 1.1 InfraLens

InfraLens est actuellement une application Next.js autonome avec :

- Next.js 16.3.0 ;
- React 19.2.4 ;
- React DOM 19.2.4 ;
- TypeScript 5.9.3 ;
- Tailwind CSS v4 ;
- shadcn/ui ;
- Vitest ;
- Playwright ;
- Node.js 22+ ;
- pnpm 10.7.0.

Fonctionnellement, le repo contient :

- 18 checks passifs ;
- orchestration concurrente ;
- système de scoring ;
- recommandations ;
- export JSON ;
- export Markdown ;
- historique local ;
- comparaison de rapports ;
- DNS ;
- TLS ;
- SSRF guard ;
- DNS pinning / résolution sûre ;
- rate limiting ;
- metadata ;
- Open Graph ;
- pages docs ;
- page privacy ;
- tests unitaires nombreux ;
- tests E2E desktop/mobile/accessibilité/analyse réelle ;
- CI dédiée.

InfraLens est actuellement servi sous :

```text
/tools/infralens
```

grâce à :

```ts
basePath: "/tools/infralens";
```

dans son propre `next.config.ts`.

---

## 1.2 Randy Code

Randy Code est actuellement une app Next.js autonome avec :

- Next.js 16.2.12 ;
- React 19.2.8 ;
- React DOM 19.2.8 ;
- TypeScript 6.0.3 ;
- Tailwind CSS v4 ;
- Vitest ;
- Playwright ;
- Node 22 en CI ;
- pnpm 10.7.0.

Il possède déjà :

```text
app/tools/page.tsx
```

mais pas encore de vraie route locale InfraLens.

Il possède également :

- sa propre PWA ;
- son propre manifest ;
- son propre service worker ;
- sa CI ;
- sa CSP ;
- son design system en cours de refonte.

---

# 2. DÉCISION D’ARCHITECTURE

InfraLens devient une feature native de Randy Code.

Architecture cible :

```text
randy-code/
├── app/
│   └── tools/
│       └── infralens/
│           ├── page.tsx
│           ├── compare/
│           │   └── page.tsx
│           ├── docs/
│           │   └── page.tsx
│           ├── privacy/
│           │   └── page.tsx
│           ├── opengraph-image.tsx
│           └── not-found.tsx   # uniquement si réellement utile localement
│
├── src/
│   └── infralens/
│       ├── components/
│       ├── config/
│       ├── hooks/
│       └── lib/
│
├── app/
│   └── actions/
│       └── infralens/
│           └── run-checks.ts
│
├── public/
│   └── infralens/
│       ├── brand/
│       └── fonts/              # seulement si toujours réellement nécessaires
│
└── e2e/
    └── infralens/
        ├── accessibility.spec.ts
        ├── analysis.spec.ts
        ├── compare.spec.ts
        └── landing.spec.ts
```

Alternative acceptable pour le Server Action :

```text
app/tools/infralens/actions/run-checks.ts
```

Choisir l’emplacement qui minimise les imports cassés.

---

# 3. CE QUI DOIT ÊTRE COPIÉ À 100 %

## 3.1 Tout `src/lib` sauf la PWA

Copier intégralement les dossiers suivants :

```text
src/lib/checks
src/lib/compare
src/lib/dns
src/lib/history
src/lib/recommendations
src/lib/security
```

Copier aussi les fichiers racine pertinents :

```text
src/lib/clipboard.ts
src/lib/concurrency.ts
src/lib/concurrency.test.ts
src/lib/log.ts
```

Et tout autre fichier racine présent dans `src/lib` au moment de la migration.

### Important

Ne pas sélectionner à la main les tests.

**Copier les `.test.ts` avec leur fichier source.**

---

## 3.2 Dossier checks

Le dossier actuel contient notamment :

```text
calculate-score.ts
calculate-score.test.ts
category-labels.ts
category-sections.ts
category-sections.test.ts
cdn-fingerprints.ts
collect.ts
collect.test.ts
export.ts
export.test.ts
export-markdown.ts
index.ts
parse-error.ts
priority-summary.ts
priority-summary.test.ts
results-filter.ts
results-filter.test.ts
run-checks.ts
run-checks.test.ts
scoring-config.ts
types.ts
validate-export.ts
validate-export.test.ts
checks/
```

Tout doit être copié.

Le sous-dossier :

```text
src/lib/checks/checks/
```

contient les 18 checks individuels.

**Copier ce dossier en entier sans réécriture.**

Après migration, compter les check modules et vérifier qu’aucun n’a disparu.

---

# 4. SÉCURITÉ — À PRÉSERVER STRICTEMENT

Copier intégralement :

```text
src/lib/security/
```

Le dossier contient notamment :

```text
errors.ts
inspect-tls.ts
inspect-tls.test.ts
ip-policy.ts
ip-policy.test.ts
resolve-target.ts
resolve-target.test.ts
safe-fetch.ts
safe-fetch.test.ts
...
```

Ne pas remplacer cette couche par un simple `fetch()`.

Ne pas retirer :

- validation IP ;
- filtrage réseau privé ;
- protections IPv4 ;
- protections IPv6 ;
- résolution cible ;
- DNS pinning ;
- validation des redirects ;
- timeouts ;
- erreurs typées ;
- inspection TLS.

Ces tests sont considérés comme **bloquants**.

Si un test de sécurité échoue après migration, corriger l’intégration, pas le test.

---

# 5. DNS — À COPIER INTÉGRALEMENT

Copier :

```text
src/lib/dns/
```

Le dossier contient notamment :

```text
dns-cache.ts
dns-cache.test.ts
dns-client.ts
dns-client.test.ts
dns-types.ts
index.ts
```

Conserver :

- cache ;
- resolver ;
- types ;
- comportement d’erreurs ;
- tests.

Ne pas fusionner ce code avec un éventuel utilitaire DNS futur de Randy Code pendant cette migration.

---

# 6. COMPARAISON — À CONSERVER

Copier :

```text
src/lib/compare/
```

dont :

```text
diff.ts
diff.test.ts
export-markdown.ts
export-markdown.test.ts
```

Copier aussi :

```text
src/components/compare/
app/compare/
e2e/compare.spec.ts
```

La route finale devient :

```text
/tools/infralens/compare
```

La feature de comparaison ne doit pas être supprimée sous prétexte qu’InfraLens devient un outil du portfolio.

---

# 7. HISTORIQUE LOCAL — À CONSERVER

Copier :

```text
src/lib/history/
src/hooks/use-analysis-history.ts
src/components/history/
```

L’historique reste :

- localStorage uniquement ;
- sans compte ;
- sans backend ;
- sans synchronisation serveur.

### Risque de migration

Si les clés localStorage actuelles sont déjà namespacées InfraLens, les conserver.

Ne pas renommer les clés sans raison, car cela ferait perdre l’historique des utilisateurs existants.

Si une clé doit changer, prévoir une migration locale backward-compatible.

---

# 8. RECOMMANDATIONS — À COPIER

Copier :

```text
src/lib/recommendations/
```

dont notamment :

```text
index.ts
performance.ts
security.ts
```

Ne pas réécrire les textes de recommandations pendant la migration.

---

# 9. CONFIG — À COPIER PUIS ADAPTER

Copier :

```text
src/config/constants.ts
src/config/env.ts
src/config/env.test.ts
src/config/site-config.ts
```

dans :

```text
src/infralens/config/
```

ou autre namespace cohérent.

### Adaptations nécessaires

InfraLens n’est plus un site autonome.

L’URL publique doit devenir :

```text
https://randy-code.dev/tools/infralens
```

Toute logique :

- `infralens.dev`
- Vercel app dédiée
- basePath externe
- canonical autonome

doit être retirée ou adaptée.

### IPAPI_KEY

Conserver le support :

```env
IPAPI_KEY=
```

Ajouter cette variable à la documentation/env de Randy Code.

InfraLens doit continuer à fonctionner sans cette clé.

---

# 10. COMPOSANTS — COPIER PRESQUE TOUT

Copier les dossiers :

```text
src/components/compare
src/components/history
src/components/landing
src/components/results
src/components/ui
```

Copier :

```text
src/components/github-icon.tsx
src/components/home-client.tsx
```

### PWA

Ne PAS copier :

```text
src/components/pwa/
```

sauf si un fichier non-PWA s’y trouve réellement.

La PWA InfraLens est abandonnée.

---

# 11. LANDING — À COPIER

Le dossier contient notamment :

```text
cta.tsx
footer.tsx
hero.tsx
how-results.tsx
open-source.tsx
results-preview.tsx
what-it-checks.tsx
```

Tout doit être copié.

L’harmonisation profonde avec Randy Code viendra plus tard.

Pendant la migration, seule adaptation autorisée :

- liens ;
- paths ;
- header/footer si conflit avec le layout global ;
- variables CSS ;
- fonts ;
- imports.

---

# 12. RÉSULTATS — À COPIER INTÉGRALEMENT

Copier notamment :

```text
category-section.tsx
check-result-card.tsx
copy-button.tsx
priority-summary.tsx
recommendation-card.tsx
render-value.tsx
report-header.tsx
results-filter-bar.tsx
results-section.tsx
score-badge.tsx
why-score-dialog.tsx
```

Ne pas simplifier le rendu.

Conserver :

- score ;
- grade ;
- priorité ;
- filtres ;
- détails ;
- recommandations ;
- valeurs brutes ;
- explication du score.

---

# 13. UI SHADCN — STRATÉGIE

InfraLens possède ses propres primitives :

```text
accordion.tsx
alert.tsx
badge.tsx
button.tsx
card.tsx
collapsible.tsx
dialog.tsx
input.tsx
separator.tsx
skeleton.tsx
...
```

Randy Code utilise également Radix/shadcn.

### Règle

Pour minimiser les risques, pendant la migration :

**copier les primitives InfraLens dans un namespace InfraLens.**

Exemple :

```text
src/infralens/components/ui/
```

Ne pas remplacer immédiatement chaque composant InfraLens par le composant équivalent Randy Code.

Pourquoi :

- variantes différentes ;
- classes différentes ;
- dépendances Radix différentes ;
- snapshots visuels implicites ;
- risques de régression responsive.

L’unification UI peut venir après que tout fonctionne.

---

# 14. ROUTES APP ROUTER

Mapper :

```text
infralens/app/page.tsx
→ randy-code/app/tools/infralens/page.tsx
```

```text
infralens/app/compare/page.tsx
→ randy-code/app/tools/infralens/compare/page.tsx
```

```text
infralens/app/docs/page.tsx
→ randy-code/app/tools/infralens/docs/page.tsx
```

```text
infralens/app/privacy/page.tsx
→ randy-code/app/tools/infralens/privacy/page.tsx
```

```text
infralens/app/opengraph-image.tsx
→ randy-code/app/tools/infralens/opengraph-image.tsx
```

### Layout

Ne pas copier aveuglément :

```text
infralens/app/layout.tsx
```

Randy Code possède déjà le root layout.

Extraire de l’ancien layout uniquement ce qui est spécifique à InfraLens :

- providers éventuels ;
- classes ;
- wrappers ;
- metadata spécifiques ;
- fonts spécifiques ;
- manifest PWA à EXCLURE.

Créer si besoin :

```text
app/tools/infralens/layout.tsx
```

Ce layout local doit encapsuler InfraLens sans recréer `<html>` ni `<body>`.

---

# 15. GLOBAL CSS

Ne pas remplacer :

```text
randy-code/app/globals.css
```

par celui d’InfraLens.

Inspecter :

```text
infralens/app/globals.css
```

et extraire uniquement :

- variables propres InfraLens ;
- keyframes ;
- classes utilitaires ;
- styles réellement nécessaires.

Les ajouter dans :

- un CSS local InfraLens importé depuis son layout ;
- ou dans les tokens Randy Code si déjà compatibles.

Recommandation :

```text
app/tools/infralens/infralens.css
```

pour limiter les collisions pendant la migration.

---

# 16. SERVER ACTION

Migrer :

```text
infralens/app/actions/run-checks.ts
```

vers un emplacement Randy Code stable.

Recommandé :

```text
app/tools/infralens/actions/run-checks.ts
```

ou :

```text
app/actions/infralens/run-checks.ts
```

Conserver exactement :

- rate limit ;
- parsing IP ;
- validation cible ;
- appel orchestration ;
- erreurs ;
- résultat.

Ne pas transformer en API route juste parce que l’app est déplacée.

---

# 17. RATE LIMITING

Conserver le rate limiter actuel.

Le README source indique qu’il est en mémoire.

La migration ne doit pas modifier cette architecture tant qu’une amélioration séparée n’est pas décidée.

### Important E2E

Les E2E InfraLens ont volontairement :

```text
workers: 1
```

parce qu’un rate limit d’environ 30 secondes peut faire entrer les tests en collision.

Il faut préserver cette contrainte dans la suite E2E Randy Code.

Ne jamais remettre ces tests en parallèle sans adapter le rate limiting.

---

# 18. PUBLIC ASSETS

Copier :

```text
public/brand/
```

vers :

```text
randy-code/public/infralens/brand/
```

Les assets actuels incluent notamment :

```text
logo-horizontal.png
logo-rcode-horizontal.png
logo-symbol.png
wordmark-horizontal.png
```

### Important

Adapter tous les chemins :

```text
/brand/logo-symbol.png
```

vers :

```text
/infralens/brand/logo-symbol.png
```

si nécessaire.

---

# 19. FONTS

InfraLens possède actuellement :

```text
public/fonts/Geist-Black.otf
public/fonts/Geist-Bold.otf
public/fonts/Geist-SemiBold.otf
```

Avant de copier :

1. vérifier si Randy Code a déjà Geist ;
2. vérifier si ces fichiers sont réellement référencés ;
3. si oui, migrer proprement ;
4. si non utilisés, ne pas les ajouter.

### Règle

Ne pas partager ni redistribuer ces fichiers en dehors du projet.

Ils restent uniquement des assets internes du repo si leur licence/usage le permet déjà.

---

# 20. PWA INFRALENS — À SUPPRIMER

Ne pas migrer :

```text
public/manifest.json
public/offline.html
public/sw.js
src/lib/pwa/
src/components/pwa/
```

Supprimer également dans le code migré :

- registration du SW ;
- `beforeinstallprompt` ;
- install CTA ;
- manifest metadata ;
- offline fallback spécifique ;
- tests PWA InfraLens.

### MAIS

Ne pas supprimer la PWA de Randy Code.

InfraLens fonctionne désormais sous la PWA globale de Randy Code.

---

# 21. FAVICONS ET APP ICONS

Ne pas remplacer le favicon global Randy Code.

Les fichiers InfraLens :

```text
apple-touch-icon.png
favicon.ico
icon-192.png
icon-512.png
```

ne doivent pas écraser ceux de Randy Code.

Conserver seulement ceux qui ont encore un usage local/documentaire.

Le logo InfraLens reste utilisé dans l’interface.

---

# 22. NEXT.CONFIG

Ne pas copier :

```text
infralens/next.config.ts
```

Il contient aujourd’hui :

- `basePath`;
- `allowedOrigins`;
- redirect historique.

Tout cela devient inutile après intégration native.

### Randy Code

Supprimer de `next.config.mjs` :

- rewrite/proxy InfraLens ;
- `INFRALENS_ORIGIN` ;
- toute logique de multi-zone.

Conserver les redirects existants sans rapport avec InfraLens.

---

# 23. CSP RANDY CODE

Randy Code possède une CSP.

Après migration, les requêtes InfraLens doivent continuer à fonctionner.

Vérifier particulièrement :

- `connect-src`;
- images ;
- appels ipapi.co côté serveur ;
- aucun besoin client cross-origin inattendu.

Les appels serveur Node ne sont pas régis comme les requêtes navigateur par la CSP, mais toute ressource client externe doit être vérifiée.

Ne pas relâcher `default-src` globalement sans raison.

---

# 24. DEPENDENCIES — FUSION PRÉCISE

InfraLens dépend de :

```text
@radix-ui/react-accordion
@radix-ui/react-collapsible
@radix-ui/react-dialog
@radix-ui/react-popover
@radix-ui/react-separator
@radix-ui/react-slot
@radix-ui/react-tooltip
class-variance-authority
clsx
ip-address
lucide-react
nanoid
next
react
react-dom
tailwind-merge
undici
```

Randy Code possède déjà :

- class-variance-authority ;
- clsx ;
- lucide-react ;
- next ;
- radix-ui meta package ;
- react ;
- react-dom ;
- tailwind-merge ;
- shadcn.

### À ajouter avec certitude si utilisés après copie

```text
ip-address
nanoid
undici
@axe-core/playwright
```

### Radix

Ne pas installer aveuglément tous les packages individuels.

D’abord :

1. copier le code ;
2. lancer TypeScript/build ;
3. identifier les imports Radix réellement non résolus ;
4. choisir soit les packages individuels source, soit adapter vers le package `radix-ui` déjà utilisé par Randy Code uniquement si API identique.

Priorité : fiabilité, pas réduction du package.json.

---

# 25. VERSIONS — NE PAS DOWNGRADER RANDY CODE

Ne pas remplacer les versions Randy Code par celles d’InfraLens.

Versions actuelles divergentes :

```text
InfraLens   Next 16.3.0
Randy Code  Next 16.2.12

InfraLens   React 19.2.4
Randy Code  React 19.2.8

InfraLens   TypeScript 5.9.3
Randy Code  TypeScript 6.0.3
```

### Stratégie

Le repo cible est Randy Code.

Donc :

- conserver React/React DOM Randy Code ;
- conserver TypeScript Randy Code ;
- décider consciemment si Next doit passer à 16.3.0 ou rester en 16.2.12.

Recommandation :
**tester d’abord InfraLens sur le Next actuel Randy Code.**

Si incompatibilité réelle :

- upgrader Randy Code vers 16.3.0 ;
- lancer tous les tests portfolio.

Ne jamais downgrader React ou TypeScript juste pour reproduire le repo InfraLens.

---

# 26. TSCONFIG ALIASES

InfraLens utilise :

```text
@/*          → ./src/*
@lib/*       → ./src/lib/*
@components/*→ ./src/components/*
```

Randy Code utilise :

```text
@/*    → ./src/*
@app/* → ./app/*
```

### Problème

Les imports InfraLens du type :

```ts
@/lib/...
@/components/...
```

pointeraient vers les mauvaises zones dans Randy Code.

### Solution recommandée

Créer des alias InfraLens dédiés :

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@app/*": ["./app/*"],
    "@infralens/*": ["./src/infralens/*"],
    "@infralens-lib/*": ["./src/infralens/lib/*"],
    "@infralens-components/*": ["./src/infralens/components/*"]
  }
}
```

Puis faire un remplacement mécanique des imports migrés.

### Interdit

Ne pas déplacer tous les fichiers InfraLens directement dans `src/lib` et `src/components` si cela crée des collisions ou mélange les domaines.

---

# 27. VITEST — MIGRATION COMPLÈTE

InfraLens possède :

```text
vitest.config.mts
```

avec :

- environnement Node ;
- alias `@`;
- exclusion `e2e/**`.

Randy Code n’a pas le même fichier/config.

### Objectif

Tous les tests unitaires InfraLens doivent être exécutés par :

```bash
pnpm test
```

dans Randy Code.

### À faire

Adapter la config Vitest Randy Code pour :

- inclure `src/infralens/**/*.test.ts`;
- environnement Node par défaut pour le moteur ;
- exclure E2E Playwright ;
- conserver les éventuels tests Randy Code existants ;
- ajouter les alias InfraLens.

Si Randy Code a des tests DOM nécessitant jsdom, utiliser :

- `environmentMatchGlobs`;
- ou fichiers de config distincts ;
- ou annotations par test.

Ne jamais forcer tout InfraLens en jsdom si les tests réseau sont conçus pour Node.

---

# 28. E2E — MIGRATION INTÉGRALE

Copier :

```text
e2e/accessibility.spec.ts
e2e/analysis.spec.ts
e2e/compare.spec.ts
e2e/landing.spec.ts
```

vers :

```text
e2e/infralens/
```

### Adapter les URLs

Les tests source utilisent déjà `/tools/infralens`, ce qui est avantageux.

Le `baseURL` final reste :

```text
http://localhost:3000
```

### Concurrence

Les E2E InfraLens doivent rester :

- non parallèles ;
- worker = 1 pour le groupe InfraLens.

Randy Code a aujourd’hui `fullyParallel: true`.

Il faut donc éviter qu’InfraLens hérite aveuglément de ce comportement.

Options valides :

1. créer un projet Playwright InfraLens avec dépendances/serial ;
2. ajouter `test.describe.configure({ mode: "serial" })`;
3. configurer un projet spécifique ;
4. créer un second fichier Playwright appelé par un script dédié.

### Recommandation

Créer deux scripts :

```json
"e2e": "playwright test",
"e2e:infralens": "playwright test e2e/infralens --workers=1"
```

Puis CI :

- suite Randy Code standard ;
- suite InfraLens serialisée.

---

# 29. E2E ACCESSIBILITÉ

InfraLens utilise :

```text
@axe-core/playwright
```

Ajouter la dependency dans Randy Code et conserver le test.

Ne pas supprimer le test accessibility sous prétexte qu’il n’existait pas dans Randy Code.

---

# 30. E2E ANALYSE RÉELLE

`analysis.spec.ts` effectue volontairement une vraie analyse de :

```text
example.com
```

Le repo InfraLens considère ce test comme un smoke test réseau réel.

Conserver cette philosophie.

### CI

Il peut rester non-bloquant ou séparé, comme actuellement, pour éviter les faux négatifs liés au réseau GitHub Actions.

Mais il doit continuer à exister et à être exécuté.

---

# 31. CI — FUSION

La CI Randy Code possède déjà des jobs séparés :

- lint ;
- typecheck ;
- tests ;
- build ;
- E2E.

La CI InfraLens possède :

- `pnpm check`;
- E2E distinct.

### Cible

La CI Randy Code doit couvrir **tout InfraLens**.

Modifier le script :

```json
"check": "pnpm lint && pnpm typecheck && pnpm test --run && pnpm build"
```

ou équivalent cohérent.

### Important

Actuellement le `check` Randy Code ne lance pas ses tests unitaires.

Après migration, il est recommandé de les inclure.

### E2E

Créer dans la CI :

- E2E portfolio ;
- E2E InfraLens serialisé ;
- éventuellement analysis real-network séparé/non required.

---

# 32. APP/GLOBAL NOT-FOUND

InfraLens possède :

```text
app/not-found.tsx
```

Randy Code possède aussi son propre not-found global.

Ne pas écraser celui de Randy Code.

Créer un not-found InfraLens local uniquement si Next.js route correctement ce comportement sous :

```text
app/tools/infralens/not-found.tsx
```

Sinon laisser le global Randy Code.

---

# 33. OPENGRAPH IMAGE

Migrer :

```text
app/opengraph-image.tsx
```

vers :

```text
app/tools/infralens/opengraph-image.tsx
```

Vérifier :

- fonts ;
- logo path ;
- branding ;
- URL canonique ;
- runtime support.

---

# 34. DOCS ET PRIVACY

Conserver :

- `/tools/infralens/docs`;
- `/tools/infralens/privacy`.

Adapter tous les liens.

Les pages doivent continuer à documenter :

- les checks ;
- les limitations ;
- les données envoyées ;
- le localStorage ;
- ipapi ;
- sécurité ;
- absence de compte ;
- absence de tracking.

Retirer uniquement les mentions PWA devenues fausses.

---

# 35. README / DOCUMENTATION

Le README principal Randy Code doit référencer InfraLens comme outil intégré.

L’ancien README InfraLens ne doit pas être perdu.

Recommandation :

```text
docs/infralens/README.md
```

ou :

```text
docs/tools/infralens/README.md
```

Copier également, si toujours pertinents :

```text
CHANGELOG.md
CONTRIBUTING.md
SECURITY.md
LICENSE
INFRALENS_MASTER_PLAN.md
INFRALENS_BRANDING_PLAN.md
docs/
```

### LICENCE

InfraLens est MIT.

Si le repo Randy Code possède une autre politique de licence, ne pas ignorer ce point.

Conserver clairement l’origine/licence du code InfraLens dans la documentation.

---

# 36. CHANGELOG

Ne pas jeter l’historique des versions InfraLens.

Copier le `CHANGELOG.md` source dans :

```text
docs/infralens/CHANGELOG.md
```

Puis continuer les évolutions futures InfraLens dans ce changelog ou documenter une date de fusion.

---

# 37. SECURITY.md

Les instructions de vulnérabilité InfraLens sont importantes.

Fusionner intelligemment :

- soit une section InfraLens dans le SECURITY.md Randy Code ;
- soit conserver `docs/infralens/SECURITY.md`.

Ne pas supprimer les règles de signalement.

---

# 38. CONTRIBUTING

Même principe.

Les conventions techniques InfraLens peuvent rester documentées dans :

```text
docs/infralens/CONTRIBUTING.md
```

Adapter les commandes au repo Randy Code.

---

# 39. COMPONENTS.JSON

InfraLens possède son propre :

```text
components.json
```

Ne pas écraser celui de Randy Code s’il existe.

Comparer :

- aliases ;
- style ;
- baseColor ;
- css path.

Conserver les composants déjà copiés comme code normal.
Le fichier components.json source n’est pas forcément nécessaire après migration.

---

# 40. ESLINT

Ne pas écraser `eslint.config.mjs` Randy Code.

Faire passer le code InfraLens sous la config cible.

Si la config source contient des règles importantes manquantes :

- les merger explicitement ;
- documenter le changement.

---

# 41. POSTCSS / TAILWIND

Ne pas écraser la config Randy Code.

Les deux utilisent Tailwind v4 et `@tailwindcss/postcss`, donc la fusion doit être faible risque.

Porter uniquement :

- classes ;
- variables ;
- animations ;
- plugins réellement nécessaires.

---

# 42. ENVIRONNEMENT

Ajouter au `.env.example` Randy Code :

```env
# InfraLens — optionnel
IPAPI_KEY=
```

Ne plus utiliser :

- `INFRALENS_ORIGIN`;
- URL Vercel InfraLens ;
- config multi-zone.

`NEXT_PUBLIC_SITE_URL` global Randy Code peut rester :

```text
https://randy-code.dev
```

Le code InfraLens doit construire son canonical avec :

```text
/tools/infralens
```

---

# 43. LIENS ABSOLUS

Rechercher après copie :

```bash
rg "infralens.dev"
rg "INFRALENS_ORIGIN"
rg "basePath"
rg 'href="/'
rg 'src="/'
rg 'fetch\("/'
rg "manifest"
rg "serviceWorker"
rg "beforeinstallprompt"
```

Chaque occurrence doit être triée.

### Résultat attendu

`infralens.dev` :

- uniquement historique/documentation de migration si nécessaire.

`INFRALENS_ORIGIN` :

- zéro occurrence active.

`basePath` InfraLens :

- zéro occurrence active.

PWA InfraLens :

- zéro occurrence active.

---

# 44. ROUTES ATTENDUES

Après migration :

```text
/tools
/tools/infralens
/tools/infralens/compare
/tools/infralens/docs
/tools/infralens/privacy
```

Doivent toutes répondre directement depuis Randy Code.

---

# 45. PWA RANDY CODE

Conserver :

- `app/manifest.ts`;
- `public/sw.js`;
- icônes Randy Code.

### Vérifier

Le service worker Randy Code doit fonctionner avec `/tools/infralens`.

Il ne doit pas :

- cacher des réponses d’analyse sensibles ;
- casser les Server Actions ;
- transformer l’outil en offline app faussement fonctionnelle.

InfraLens nécessite le réseau pour analyser un site.

Le cache Randy Code doit respecter cette réalité.

---

# 46. DONNÉES D’ANALYSE ET SW

Ne jamais cacher :

- résultat Server Action sensible ;
- POST ;
- analyse ;
- données de rapport dynamiques.

La PWA Randy Code peut cacher :

- shell ;
- assets ;
- pages statiques.

Pas les analyses InfraLens.

---

# 47. PHASE 1 — COPIE INTÉGRALE ET ADAPTATION STRUCTURELLE

> **Objectif :** InfraLens existe dans Randy Code avec quasiment tout son code original.

### Étapes

1. Créer branche :

   ```text
   feat/migrate-infralens
   ```

2. Faire baseline du repo source :

   ```bash
   pnpm install
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm build
   pnpm e2e
   ```

3. Enregistrer :
   - nombre de tests ;
   - résultat ;
   - routes ;
   - check count ;
   - screenshots.

4. Créer namespace :

   ```text
   src/infralens/
   ```

5. Copier :

   ```text
   src/components
   src/config
   src/hooks
   src/lib
   ```

   sauf PWA.

6. Copier les routes App Router vers `/tools/infralens`.

7. Copier Server Action.

8. Copier brand assets.

9. Copier fonts seulement si utilisées.

10. Copier E2E.

11. Copier docs projet :
    - README ;
    - CHANGELOG ;
    - SECURITY ;
    - CONTRIBUTING ;
    - master plans.

12. Ajouter les dependencies manquantes.

13. Ajouter aliases InfraLens.

14. Corriger imports mécaniquement.

15. Supprimer toute dépendance `basePath`.

16. Supprimer proxy/rewrite Randy Code.

17. Supprimer PWA InfraLens.

### Critère de sortie Phase 1

```text
pnpm typecheck
```

doit passer ou ne contenir que des erreurs explicitement inventoriées liées aux configs/tests encore à fusionner.

Aucun fichier fonctionnel essentiel InfraLens ne doit manquer.

---

# 48. PHASE 2 — TESTS, CI, ROUTES ET PARITÉ FONCTIONNELLE

> **Objectif :** prouver que l’InfraLens intégré fait tout ce que faisait l’original.

### Unit tests

Tous les tests source non-PWA doivent être présents.

Comparer :

- nombre de fichiers `.test.ts`;
- nombre de tests ;
- aucun skip ajouté.

### E2E

Les quatre specs doivent exister :

```text
accessibility.spec.ts
analysis.spec.ts
compare.spec.ts
landing.spec.ts
```

### Tests manuels obligatoires

Analyser :

- `https://example.com`;
- un domaine HTTPS réel ;
- une URL invalide ;
- localhost ;
- IP privée ;
- URL avec redirect ;
- domaine inexistant.

### Fonctionnalités à valider

- landing ;
- URL input ;
- loading ;
- analyze ;
- score ;
- category scoring ;
- checks ;
- filters ;
- priority summary ;
- why score ;
- recommendations ;
- export JSON ;
- export Markdown ;
- history local ;
- delete history ;
- compare ;
- compare export ;
- docs ;
- privacy ;
- responsive ;
- accessibility ;
- copy ;
- errors ;
- rate limit ;
- SSRF ;
- TLS ;
- DNS ;
- IP lookup ;
- metadata ;
- stack detection ;
- link extraction ;
- performance signals.

### CI

La PR n’est pas mergée tant que :

- lint ✅
- typecheck ✅
- unit tests ✅
- build ✅
- E2E Randy Code ✅
- E2E InfraLens ✅
- real network smoke test ✅ ou documenté comme transient-only

---

# 49. PHASE 3 — PRODUCTION, NETTOYAGE ET ARCHIVAGE

> **Objectif :** passer définitivement à Randy Code sans perte.

### Production

Déployer `randy-code`.

Tester :

```text
https://randy-code.dev/tools/infralens
https://randy-code.dev/tools/infralens/compare
https://randy-code.dev/tools/infralens/docs
https://randy-code.dev/tools/infralens/privacy
```

### DevTools

Vérifier :

- pas de 404 CSS ;
- pas de 404 JS ;
- pas de chunks InfraLens externes ;
- pas de requête vers infralens.dev ;
- aucune console error ;
- Server Action fonctionnelle ;
- CSP OK ;
- favicon Randy Code cohérent ;
- logo InfraLens visible.

### Mobile

Tester téléphone réel si possible.

### Historique local

Valider qu’il fonctionne sous le nouveau domaine.

Important :
l’ancien localStorage de `infralens.dev` ne peut pas être automatiquement lu depuis `randy-code.dev`, car les origins sont différentes.

Accepter cette limite ou prévoir avant expiration une migration export/import manuelle.

Ne pas prétendre que l’historique ancien est transféré automatiquement.

### Ancien domaine

Tant qu’il existe :

```text
infralens.dev
→ 301 vers
https://randy-code.dev/tools/infralens
```

### Repo InfraLens

Ne pas supprimer immédiatement.

Faire :

1. tag final ;
2. README archived/moved ;
3. archive GitHub ;
4. garder quelques semaines/mois.

Suppression définitive facultative plus tard.

---

# 50. COMPTAGE DE PARITÉ OBLIGATOIRE

Avant migration :

Créer :

```text
docs/infralens/MIGRATION_BASELINE.md
```

Il doit contenir :

```text
Nombre de modules src
Nombre de tests unitaires
Nombre de tests E2E
Nombre de checks
Nombre de routes
Nombre d’assets brand
Nombre de docs
Scripts package.json
Dependencies spécifiques
```

Après migration :

Créer :

```text
docs/infralens/MIGRATION_PARITY.md
```

Comparer source/cible.

Toute différence doit être justifiée.

---

# 51. LISTE DE CE QUI EST VOLONTAIREMENT ABANDONNÉ

Uniquement :

```text
PWA InfraLens autonome
basePath
service worker InfraLens
manifest InfraLens
offline page InfraLens
install prompt InfraLens
proxy multi-zone
INFRALENS_ORIGIN
redirects techniques inter-app
deployment InfraLens autonome
```

Rien d’autre ne doit disparaître sans décision explicite.

---

# 52. LISTE DE CE QUI DOIT ABSOLUMENT SURVIVRE

- 18 checks ;
- sécurité SSRF ;
- IP policy ;
- safe fetch ;
- DNS resolution ;
- TLS ;
- scoring ;
- grade ;
- category scores ;
- recommendations ;
- priority summary ;
- result filters ;
- raw data ;
- JSON export ;
- Markdown export ;
- comparison ;
- comparison export ;
- local history ;
- rate limit ;
- env IPAPI_KEY ;
- docs ;
- privacy ;
- branding ;
- accessibility ;
- desktop ;
- mobile ;
- all unit tests ;
- all E2E tests sauf tests exclusivement PWA ;
- CI coverage.

---

# 53. PROMPT PRINCIPAL À DONNER À L’IA

```text
Lis intégralement INFRALENS_TO_RANDY_CODE_MIGRATION_MASTER_PLAN.md.

Tu dois migrer InfraLens du repo source vers Randy Code en 3 phases maximum.

Ce n’est PAS une réécriture.

Principe obligatoire :
COPIER D’ABORD, ADAPTER ENSUITE.

Avant toute modification :
1. inspecte intégralement le repo InfraLens local ;
2. génère la baseline demandée ;
3. lance lint, typecheck, tests, build et E2E dans le repo source ;
4. compte les modules, tests, checks, routes et assets ;
5. inspecte le repo Randy Code cible.

Ensuite exécute Phase 1.

Tu dois copier intégralement :
- moteur de checks ;
- 18 check modules ;
- scoring ;
- exports ;
- compare ;
- history ;
- DNS ;
- security ;
- recommendations ;
- components ;
- UI primitives ;
- server action ;
- docs ;
- tests unitaires ;
- E2E ;
- brand assets.

Tu ne dois PAS migrer :
- la PWA InfraLens ;
- son service worker ;
- son manifest ;
- son offline page ;
- son basePath ;
- les redirects techniques de l’ancien domaine ;
- la config multi-zone.

Tu dois préserver la logique existante et ne refactorer que ce qui est nécessaire pour intégrer le code dans Randy Code.

Ne supprime jamais un test pour faire passer la suite.
Ne remplace jamais un test failing par un skip.
Corrige la migration.

Utilise un namespace src/infralens afin d’éviter les collisions.

Les routes publiques doivent être :
- /tools/infralens
- /tools/infralens/compare
- /tools/infralens/docs
- /tools/infralens/privacy

Conserve la PWA Randy Code globale.

À la fin de chaque phase :
- liste tous les fichiers copiés ;
- liste tous les fichiers volontairement exclus ;
- liste tous les fichiers modifiés ;
- donne le résultat de chaque commande ;
- indique les différences fonctionnelles avec la source ;
- ne passe pas à la phase suivante s’il existe une perte fonctionnelle non justifiée.
```

---

# 54. PROMPT DE VALIDATION FINALE

```text
Effectue maintenant une revue de parité exhaustive entre le repo InfraLens source et l’InfraLens intégré dans Randy Code.

Ne te base pas uniquement sur la documentation : inspecte le code.

Compare :
1. routes ;
2. server action ;
3. checks individuels ;
4. scoring ;
5. exports ;
6. compare ;
7. history ;
8. DNS ;
9. TLS ;
10. SSRF ;
11. safe-fetch ;
12. rate limiting ;
13. recommendations ;
14. UI landing ;
15. UI results ;
16. docs ;
17. privacy ;
18. assets ;
19. env ;
20. tests unitaires ;
21. E2E ;
22. accessibility ;
23. responsive ;
24. CI.

La seule fonctionnalité volontairement absente doit être la PWA InfraLens autonome.

Crée docs/infralens/MIGRATION_PARITY.md.

Pour chaque élément indique :
- SOURCE ;
- CIBLE ;
- IDENTIQUE / ADAPTÉ / ABSENT ;
- justification ;
- tests associés.

Puis lance :
- pnpm lint
- pnpm typecheck
- pnpm test --run
- pnpm build
- pnpm e2e ou les scripts E2E dédiés
- pnpm e2e:infralens si créé

Ne déclare la migration terminée que si :
- aucun test source non-PWA n’a disparu ;
- aucun check n’a disparu ;
- toutes les routes fonctionnent ;
- analyse example.com fonctionne ;
- SSRF tests passent ;
- exports passent ;
- compare passe ;
- history passe ;
- mobile passe ;
- accessibility passe ;
- build production passe.
```

---

# 55. DÉFINITION DE TERMINÉ

La migration est terminée uniquement si :

```text
randy-code.dev/tools/infralens
```

fonctionne comme une route native Randy Code, et qu’un utilisateur d’InfraLens ne perd aucune capacité fonctionnelle à l’exception de l’installation PWA InfraLens autonome.

À ce moment-là seulement :

- retirer le déploiement autonome ;
- rediriger l’ancien domaine ;
- archiver l’ancien repo.

**Ne jamais supprimer le repo source avant validation complète en production.**
