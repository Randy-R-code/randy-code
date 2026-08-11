# InfraLens → Randy Code — Migration Baseline

État audité du repo source avant migration, conformément à
`INFRALENS_TO_RANDY_CODE_MIGRATION_MASTER_PLAN.md` §50.

- **Date :** 2026-08-10
- **Repo source :** `~/Dev/Projects/InfraLens/infralens` (`Randy-R-code/infralens`), branche `main`, propre
- **Repo cible :** `~/Dev/Projects/Randy-Code/randy-code` (`Randy-R-code/randy-code`)

## Résultat `pnpm check` (source)

```
lint       ✅ (eslint, 0 erreur)
typecheck  ✅ (tsc --noEmit, 0 erreur)
test       ✅ 269 tests passés / 37 fichiers .test.ts
build      ✅ next build (Turbopack) — 6 routes statiques
```

Routes générées par `next build` :

```
○ /
○ /_not-found
○ /compare
○ /docs
○ /opengraph-image
○ /privacy
```

## Résultat `pnpm e2e` (source)

```
25 passed (17.0s) — 1 worker, projets desktop + mobile
```

Répartition : `accessibility.spec.ts` (6), `analysis.spec.ts` (1, desktop only —
smoke réseau réel sur exemple), `compare.spec.ts` (8), `landing.spec.ts` (10).

## Comptages

| Élément                                                            | Nombre                                                                                       |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Checks individuels (`src/lib/checks/checks/*.ts`, hors `.test.ts`) | 18                                                                                           |
| Fichiers `.test.ts` sous `src/`                                    | 37                                                                                           |
| Tests unitaires (vitest)                                           | 269                                                                                          |
| Specs E2E (Playwright)                                             | 4 fichiers / 25 tests                                                                        |
| Routes App Router (source)                                         | `/`, `/compare`, `/docs`, `/privacy`, `+ opengraph-image, layout, not-found`                 |
| Assets brand (`public/brand/`)                                     | 4 (logo-horizontal.png, logo-rcode-horizontal.png, logo-symbol.png, wordmark-horizontal.png) |
| Fonts locales (`public/fonts/`)                                    | 3 (Geist-Black.otf, Geist-Bold.otf, Geist-SemiBold.otf)                                      |

## Modules `src/lib` (racine)

```
checks/  compare/  dns/  history/  pwa/(exclu)  recommendations/  security/
clipboard.ts  concurrency.ts(+test)  log.ts  metadata.ts  rate-limit.ts(+test)  utils.ts
```

## `src/lib/checks/checks/` — les 18 checks

```
accessibility  dns-records  dns-security  headers  https  ip-hosting  links
metadata  performance  reachability  redirects  robots  security-txt
server-headers  sitemap  social  stack  waf
```

(15 des 18 ont un `.test.ts` dédié — `links`, `metadata`, `social` n'en ont pas.)

## `src/components`

```
compare/  history/  landing/  pwa/(exclu)  results/  ui/
github-icon.tsx  home-client.tsx
```

## `src/hooks` / `src/config`

```
hooks: use-analysis-history.ts
config: constants.ts  env.ts(+test)  site-config.ts
```

## Dépendances — usage réel vérifié dans `src/`

Radix packages réellement importés (sur les 7 listés dans `package.json`,
`@radix-ui/react-popover` n'apparaît dans aucun import direct — à revérifier
au typecheck avant de le considérer inutile, peut être utilisé via un wrapper) :

```
@radix-ui/react-accordion, -collapsible, -dialog, -separator, -slot, -tooltip
```

`ip-address`, `nanoid`, `undici` : tous les trois activement importés
(`security/ip-policy.ts`, `hooks/use-analysis-history.ts`, `checks/collect.ts`,
`security/safe-fetch.ts`).

## Fonts — décision

Randy Code définit déjà `--font-geist-sans` / `--font-geist-mono` au root
layout via `next/font/google` (police variable, tous poids couverts). Le
layout racine d'InfraLens ne sera **pas** copié tel quel (§14 du plan) donc son
`localFont` (Geist-Black/Bold/SemiBold en poids fixes 900/700/600) devient
redondant pour l'UI — les composants InfraLens hériteront des variables déjà
posées par Randy Code.

Seul `app/opengraph-image.tsx` d'InfraLens a besoin des bytes bruts (pattern
identique à celui déjà utilisé par `randy-code/app/opengraph-image.tsx` avec
Inter) :

- **À copier :** `Geist-Bold.otf`, `Geist-SemiBold.otf` (utilisés par l'OG image)
- **À ne pas copier :** `Geist-Black.otf` (utilisé uniquement par le layout root
  InfraLens abandonné, aucun autre usage trouvé)

## CSP / next.config cible actuel

`next.config.mjs` de Randy Code contient aujourd'hui un `rewrite` proxy
`/tools/infralens/:path*` → `INFRALENS_ORIGIN` (mis en place au commit
`a49ac4f`, phase 7 de `RANDY_CODE_MASTER_PLAN.md`) — à retirer une fois la
route native en place (tâche #9).

CSP actuelle : `connect-src 'self'` — les appels ipapi.co d'InfraLens sont
faits côté serveur (Server Action / Node), donc hors du champ de la CSP
navigateur ; à confirmer pendant la Phase 1 qu'aucun appel client direct n'y
est fait.
