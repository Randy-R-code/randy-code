# InfraLens — Baseline (Phase 0)

> Audit complet de l'état réel du dépôt, réalisé conformément à la Phase 0 de `INFRALENS_MASTER_PLAN.md` (section 32). Aucune modification fonctionnelle n'a été apportée pendant cet audit — lecture, exécution de commandes de vérification, et une démonstration réseau non destructive (voir §4.2).

Date de l'audit : 2026-08-08
Branche : `main`
Version au moment de l'audit : `1.2.2` (`CHANGELOG.md`)

---

## 1. Architecture actuelle

### 1.1 Stack

- Next.js 16.2.2 (App Router, Turbopack), React 19.2.4, TypeScript strict, Tailwind CSS 4, shadcn/ui.
- Gestionnaire de paquets : **pnpm** (conforme au `CLAUDE.md` du repo).
- Aucune base de données, aucun backend persistant : tout est ephemeral côté serveur (Server Actions) ou dans `localStorage` côté client.

### 1.2 Routes réelles

Seulement 4 routes générées (confirmé par `pnpm build`, toutes statiques) :

| Route              | Fichier                   | Nature                         |
| ------------------ | ------------------------- | ------------------------------ |
| `/`                | `app/page.tsx`            | Landing + formulaire d'analyse |
| `/docs`            | `app/docs/page.tsx`       | Documentation intégrée         |
| `/_not-found`      | `app/not-found.tsx`       | 404                            |
| `/opengraph-image` | `app/opengraph-image.tsx` | Image OG dynamique (`next/og`) |

Il n'y a pas de route API dédiée : l'analyse passe par une **Server Action** (`app/actions/run-checks.ts` → `runInfraChecks`), appelée directement par les composants client (`Hero`, `CTA`).

### 1.3 Composants principaux

- `src/components/landing/*` — sections de la page d'accueil (hero, cta, what-it-checks, why-infralens, how-results, footer).
- `src/components/results/*` — affichage des résultats (score, catégories, cartes de check, recommandations, dialogue d'explication du score).
- `src/components/history/history-section.tsx` + `src/hooks/use-analysis-history.ts` — historique local (voir §1.6).
- `src/components/pwa/register-sw.tsx` — enregistrement du service worker.
- `src/components/ui/*` — primitives shadcn/ui.
- `src/components/home-client.tsx` — composant client englobant, isole l'état interactif du reste de `app/page.tsx` (server component).

### 1.4 Les 18 contrôles réels

Inventaire exact via `src/lib/checks/run-checks.ts` (liste `CHECKS`) — **le chiffre de 18 contrôles annoncé par le README est exact** :

| #   | id             | Catégorie         | Fichier                    |
| --- | -------------- | ----------------- | -------------------------- |
| 1   | headers        | http-security     | `checks/headers.ts`        |
| 2   | https          | http-security     | `checks/https.ts`          |
| 3   | security-txt   | http-security     | `checks/security-txt.ts`   |
| 4   | redirects      | http-security     | `checks/redirects.ts`      |
| 5   | dns-records    | network-dns       | `checks/dns-records.ts`    |
| 6   | dns-security   | network-dns       | `checks/dns-security.ts`   |
| 7   | ip-hosting     | network-dns       | `checks/ip-hosting.ts`     |
| 8   | robots         | website-structure | `checks/robots.ts`         |
| 9   | sitemap        | website-structure | `checks/sitemap.ts`        |
| 10  | links          | website-structure | `checks/links.ts`          |
| 11  | metadata       | metadata-stack    | `checks/metadata.ts`       |
| 12  | accessibility  | metadata-stack    | `checks/accessibility.ts`  |
| 13  | performance    | performance       | `checks/performance.ts`    |
| 14  | server-headers | metadata-stack    | `checks/server-headers.ts` |
| 15  | social         | metadata-stack    | `checks/social.ts`         |
| 16  | stack          | metadata-stack    | `checks/stack.ts`          |
| 17  | waf            | infrastructure    | `checks/waf.ts`            |
| 18  | uptime         | performance       | `checks/uptime.ts`         |

Répartition par catégorie (6 catégories, conforme au README) : http-security (4), network-dns (3), infrastructure (1), website-structure (3), metadata-stack (5), performance (2).

Exécution : `Promise.all` sur les 18 checks en parallèle (`run-checks.ts:48`), chaque check a son propre `AbortController` avec le `timeout` passé dans le `CheckContext` (8000 ms, fixé en dur dans `app/actions/run-checks.ts:44`).

### 1.5 Scoring, export, historique, PWA

- **Scoring** (`calculate-score.ts`, `scoring-config.ts`) : pondération par catégorie (http-security 25, network-dns 20, infrastructure 20, website-structure 15, metadata-stack 10, performance 10 = 100), multiplicateur par statut (ok=1, warning=0.6, error=0), moyenne par catégorie puis somme. Conforme au README. Simple et centralisé, aucun problème relevé.
- **Export** (`export.ts`) : `buildExport()` construit un objet JSON minimal (pas l'objet complet — `data` détaillé des checks n'est pas exporté, seulement `summary`/`status`/`durationMs`) puis déclenchement `Blob` + `<a download>` côté client. Fonctionne, aucune donnée envoyée à un serveur.
- **Historique** (`use-analysis-history.ts`, `history/types.ts`) : `localStorage`, clé `infralens-history`, plafond `MAX_HISTORY_ENTRIES = 10`, FIFO, dédoublonnage par URL, synchronisation multi-onglets via `StorageEvent` + `useSyncExternalStore`. Aucune persistance serveur — conforme à la contrainte non-SaaS (master plan §2.2).
- **PWA** : `manifest.json` correct (icônes 192/512, `orientation: any`, captures d'écran, raccourci `/docs`), service worker `public/sw.js` (125 lignes, stratégies network-first HTML / stale-while-revalidate assets Next / cache-first statiques — conforme aux changelogs 1.1.0/1.2.1). Rien d'anormal détecté au niveau du code, non testé en conditions d'installation réelle (hors périmètre Phase 0).

### 1.6 Variables d'environnement

Seulement deux variables lues dans tout le code :

- `IPAPI_KEY` (`src/lib/checks/checks/ip-hosting.ts:49`) — optionnelle, utilisée pour l'appel à `ipapi.co`. Absence de clé → fallback gracieux (quota gratuit).
- `NEXT_PUBLIC_SITE_URL` / `VERCEL_URL` (`src/lib/metadata.ts`) — pour construire l'URL canonique/OG.

`.env.example` présent, documente `IPAPI_KEY` (non lu ici, conformément à la consigne de ne jamais lire un fichier `.env*`). `.gitignore` ignore `.env*` sauf `.env.example` — correct. **Aucune validation** de ces variables au démarrage (pas de schema/zod) — mineur, à traiter en Phase 1 (§32, section 1.2.4).

---

## 2. Commandes exécutées et résultats

| Commande                               | Résultat                                                                                                                                                                             |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm lint` (`eslint`)                 | ✅ Aucune erreur                                                                                                                                                                     |
| `pnpm exec tsc --noEmit`               | ✅ Aucune erreur (aucun script `typecheck` dédié dans `package.json` — à ajouter en Phase 1)                                                                                         |
| `pnpm build` (`next build`, Turbopack) | ✅ Compilation + typecheck intégré réussis, 4 routes générées, toutes statiques                                                                                                      |
| `pnpm test`                            | ❌ **N'existe pas** — aucun script `test`, aucun framework de test installé (`package.json` ne liste ni vitest, ni jest, ni testing-library). Couverture de tests actuelle : **0%**. |

Le code passe donc lint/typecheck/build proprement, mais il n'existe **aucun test automatisé**, ce qui est le point bloquant explicite de la Phase 1 (« Rendre le projet vérifiable avant les changements importants »).

---

## 3. Mesure d'une analyse locale réelle

Serveur `pnpm dev` lancé localement, interaction réelle via navigateur headless (Chromium via `dev-browser`).

### 3.1 Analyse fonctionnelle — `https://example.com`

- Soumission d'une URL complète (`https://example.com`) → analyse exécutée normalement.
- **Temps mesuré côté serveur : 502 ms** (« Analysis completed in 502ms », affiché dans l'UI) — cohérent avec, et même meilleur que, le README (« Typical analysis completes in 2–5 seconds »).
- Résultat obtenu : score **B, 84/100**, répartition par catégorie cohérente avec la config de pondération.
- Aucune anomalie de calcul du score constatée.

### 3.2 Bug fonctionnel constaté — saisie d'un domaine nu

`src/components/landing/hero.tsx:36` contient une logique explicite pour accepter un domaine sans protocole :

```ts
const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
```

Mais l'`<Input type="url" ... />` (shadcn, `hero.tsx:83-92`) déclenche la **validation native du navigateur** sur `type="url"`, laquelle exige un schéma déjà présent dans la valeur. Testé concrètement : saisir `example.com` seul produit `validity.valid === false` avec le message natif _"Please enter a URL."_, et **le `onSubmit` React ne se déclenche jamais** — la logique de préfixage `https://` dans `hero.tsx` est donc du code mort pour ce cas d'usage précis, le formulaire bloque avant même d'atteindre le JS. Seule une saisie contenant déjà `http(s)://` fonctionne en pratique.

C'est un écart entre l'intention du code (accepter `example.com`) et le comportement réel (uniquement des URLs complètes). À corriger en Phase 3 (refactor du pipeline d'analyse) ou Phase 1 selon la priorité retenue — pas corrigé ici, changement hors périmètre de la Phase 0.

### 3.3 Démonstration SSRF (détail gardé hors du dépôt public)

Conformément à la consigne de la Phase 0 (« risques SSRF explicitement évalués », et §8.4 du master plan qui exige une preuve démontrable plutôt qu'une affirmation), un test non destructif a été effectué pour vérifier l'état réel des protections SSRF.

**Résultat : l'analyse s'exécute sans aucun blocage contre une cible en boucle locale.** Ce dépôt étant public, le détail technique de la démonstration (URL utilisée, données exactes retournées) n'est **volontairement pas reproduit ici** — cela reviendrait à publier un mode d'emploi d'exploitation avant que le correctif (Phase 2) n'existe. Détail complet conservé en suivi privé, communicable à toute personne travaillant activement sur la Phase 2.

---

## 4. Risques

### 4.1 Rate limiting — faiblesse structurelle

`src/lib/rate-limit.ts` : `Map` en mémoire de process, 1 requête / IP / 30s. Deux limites structurelles identifiées (mécanisme de contournement non détaillé ici, dépôt public — voir suivi privé) :

- L'identifiant client dérive d'en-têtes fournis par l'appelant, sans validation d'origine ni liste de proxys de confiance.
- La mémoire n'est pas partagée entre instances sur une plateforme serverless (Vercel, citée dans le README comme cible) — le master plan le note déjà explicitement (§16.1 « Limites du stockage mémoire ») et propose une solution externe (§16.2), confirmée nécessaire par cet audit.

Testé indirectement pendant cet audit : le rate limit s'est bien déclenché entre deux requêtes rapprochées dans le cas nominal.

### 4.2 SSRF — priorité #1 (master plan §8), confirmée par test réel (§3.3)

Aucune des protections listées en §8 du master plan n'est implémentée à ce jour (blocage des plages privées/loopback/link-local, endpoints de métadonnées cloud, protection DNS rebinding, allowlist de protocole, rejet des credentials dans l'URL, politique de port, re-validation des redirections par hop, limite de taille de réponse). L'état exact du code par mécanisme n'est **pas détaillé dans ce document public** — voir suivi privé pour la liste fichier par fichier utile à qui implémente la Phase 2.

C'est exactement le périmètre de la Phase 2 du master plan. Rien n'a été corrigé pendant cette Phase 0 (conformément à la règle « ne pas contourner ou corriger une protection SSRF en dehors de sa phase dédiée » — ici il n'y a rien à contourner, juste rien à corriger prématurément).

### 4.3 Fan-out réseau et téléchargements dupliqués

Chaque check refait sa propre requête HTTP vers la même origine, sans aucun partage de réponse entre checks pendant une même analyse :

- **5 requêtes GET distinctes récupèrent le même corps HTML** de la page cible : `links.ts`, `metadata.ts`, `social.ts`, `stack.ts`, `accessibility.ts`.
- **5 requêtes HEAD distinctes** vers la même URL : `headers.ts`, `waf.ts`, `server-headers.ts`, `uptime.ts`, plus le HEAD initial de `redirects.ts` (qui peut en émettre davantage selon la chaîne).
- `https.ts` émet lui-même jusqu'à 3 requêtes (disponibilité HTTPS, éventuel test HTTP→HTTPS, test HSTS séparé) alors que 2 des 3 se recoupent avec ce que d'autres checks font déjà.
- `robots.ts`, `sitemap.ts`, `security-txt.ts` (×2 emplacements testés) ajoutent 4 requêtes supplémentaires, plus légitimes car sur des chemins distincts.
- `links.ts` ajoute jusqu'à 10 requêtes HEAD supplémentaires pour valider les liens trouvés.

Au total, une analyse standard peut déclencher **~20-25 requêtes HTTP sortantes** vers la cible pour ce qui pourrait être ramené à 2-3 requêtes partagées (1 GET HTML, 1 HEAD headers, 1 résolution DNS) avec un contexte partagé entre checks. C'est exactement l'objet de la Phase 3 (« Refactor du pipeline d'analyse ») et de la section 9 du master plan (« Orchestration des contrôles », contexte partagé). Impact : latence cumulée inutile, charge inutile sur le site cible analysé (à contre-courant du positionnement « passif, non intrusif »), et — une fois la Phase 2 ajoutée — 20+ points de fetch à sécuriser au lieu de 2-3 si le refactor de mutualisation est fait en même temps ou avant.

---

## 5. Écarts documentation ↔ code

| Annoncé (README / `/docs`)                                                                                                                 | Réalité du code                                                                                                                                                                                                                                   | Fichier                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| « TLS version and certificate details », doc `/docs` : « Certificate issuer », « Certificate expiration status », « TLS protocol version » | **Aucune inspection TLS n'est implémentée.** `tlsVersion`, `certificateIssuer`, `certificateExpiry`, `daysUntilExpiry` sont déclarés dans le type de retour mais **jamais assignés** — toujours `undefined`.                                      | `src/lib/checks/checks/https.ts`              |
| « DNS Security (SPF, DKIM, DMARC, **DNSSEC**) », doc `/docs` : entrée dédiée « DNSSEC »                                                    | **Aucun code DNSSEC.** Un commentaire dans le fichier l'admet explicitement : `// DNSSEC check (simplified...) Note: Full DNSSEC validation requires more complex logic` — mais aucune logique, aucun champ `dnssec` dans les données retournées. | `src/lib/checks/checks/dns-security.ts:54-55` |
| Saisir un domaine sans `https://` (logique présente dans le code)                                                                          | **Bloqué par la validation HTML5 native** avant d'atteindre le JS — voir §3.2.                                                                                                                                                                    | `src/components/landing/hero.tsx`             |
| Hero affiche `infralens.dev` comme titre principal                                                                                         | Le master plan (§1.1) demande explicitement de ne plus afficher `infralens.dev` comme nom de produit — écart attendu, non corrigé ici (hors périmètre Phase 0, sujet de la Phase 11 / branding).                                                  | `src/components/landing/hero.tsx:63-65`       |
| `CHANGELOG.md` v1.2.0 mentionne `PROJECT.md` comme « fichier de référence canonique »                                                      | `PROJECT.md` a été supprimé (commit `644ea34`, « chore: ignore CLAUDE.md and remove PROJECT.md ») sans mise à jour du changelog historique — mineur, changelog non réécrit rétroactivement (comportement normal, mais à noter).                   | `CHANGELOG.md` vs racine du repo              |

---

## 6. Dette technique

- **Zéro test automatisé** — priorité Phase 1.
- **Aucun contexte partagé entre checks** — un `CheckContext` unique par check, pas de cache de réponse HTML/headers partagé au sein d'une même analyse (voir §4.3).
- **Extraction HTML par regex** dans `links.ts`, `metadata.ts`, `social.ts`, `accessibility.ts`, `stack.ts` — fragile face à du HTML mal formé ou à des variations d'attributs (ordre `href`/`class`, guillemets simples vs doubles imbriqués, contenu multilignes). Le README mentionne Cheerio comme dépendance (« HTML Parsing: Cheerio for link extraction ») mais **Cheerio n'est plus dans `package.json`** et le code actuel n'utilise que des regex — écart supplémentaire à ajouter à la table du §5.
- **Pas de validation des variables d'environnement** au démarrage.
- **Pas de script `typecheck` dédié** dans `package.json` (seul `tsc --noEmit` manuel a permis de vérifier ce point pendant cet audit).
- **Types de champs jamais remplis** (`tlsVersion`, etc., voir §5) — dette silencieuse : rien ne signale à un contributeur que ces champs sont des placeholders non implémentés.
- **Absence de CI** — aucun workflow GitHub Actions détecté dans le dépôt (pas de `.github/workflows`).

---

## 7. Priorités recommandées pour la suite

Confirmé par cet audit, dans l'ordre du master plan :

1. **Phase 1 — Fondations de qualité** : ajouter un framework de tests (aucun aujourd'hui), script `typecheck`, CI, validation des variables d'environnement. Nécessaire avant de toucher au pipeline de checks pour pouvoir vérifier les régressions.
2. **Phase 2 — SSRF** : confirmé priorité absolue par démonstration réelle (§3.3, §4.2) — actuellement aucune protection, testé et reproductible sur `localhost`.
3. **Phase 3 — Refactor du pipeline** : mutualiser les ~20 requêtes dupliquées par analyse (§4.3) — à faire idéalement en même temps ou juste après la Phase 2, pour ne sécuriser qu'un nombre réduit de points de fetch au lieu de vingt.
4. Corriger au passage (sans être une phase à part entière, à rattacher à la phase la plus proche) : le bug de validation native du domaine nu (§3.2), le rate limiter spoofable via `x-forwarded-for` (§4.1, à traiter avec la Phase 13 « Rate limiting production » mais le risque de spoofing doit être gardé en tête dès la Phase 2), et les champs TLS/DNSSEC documentés mais jamais implémentés (§5, Phase 6 « Fiabilisation des contrôles HTTP et sécurité »).

---

## 8. Critères de validation de la Phase 0

- [x] Aucune modification fonctionnelle majeure — seule une démonstration réseau non destructive et non persistée a été effectuée (§3.3), aucun fichier de code modifié.
- [x] Audit reproductible — toutes les commandes de ce document sont copiables telles quelles (`pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`).
- [x] Risques SSRF explicitement évalués — évalués **et démontrés** par un test réel (§3.3, §4.2), conformément à l'exigence du master plan §8.4 de ne pas se contenter d'une affirmation.
- [x] Liste exacte des contrôles — 18 checks listés et vérifiés un par un (§1.4).
- [x] Baseline de build connue — lint ✅, typecheck ✅, build ✅, tests : absents (0 test), documenté en §2.
