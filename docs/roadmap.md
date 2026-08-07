# Randy Code — Roadmap consolidée

> Généré le 2026-08-07. Synthèse de `PORTFOLIO_REDESIGN_MASTER_PLAN.md`, `RANDY_CODE_BRANDING_PLAN.md`, `RANDY_CODE_ECOSYSTEM_VISION.md`, recoupée avec les faits établis par `docs/audits/baseline.md` (Phase 0).
>
> Ce document est une carte de navigation, pas un feu vert pour tout exécuter d'un coup. Règle non négociable du master plan (section 21) : une seule phase à la fois, avec audit → plan → implémentation minimale → vérification → compte-rendu, revue humaine avant de passer à la suivante.

---

## 0. Comment lire ce document

Trois sources de vérité, trois numérotations de phases, un seul projet :

- **Master plan** (`PORTFOLIO_REDESIGN_MASTER_PLAN.md`) — fait autorité sur la structure, le contenu et les priorités. Pilote les phases **0 à 13**, la colonne vertébrale de ce document.
- **Branding plan** (`RANDY_CODE_BRANDING_PLAN.md`) — fait autorité sur l'identité visuelle (palette, background, logo, tokens). Ses phases **B0 à B7** ont leur propre numérotation mais doivent s'intercaler avec les phases de contenu ci-dessous (mapping section 2).
- **Vision écosystème** (`RANDY_CODE_ECOSYSTEM_VISION.md`) — vision long terme. Sa "Phase 1 — Refonte portfolio" correspond à l'intégralité des phases 0-13 + B0-B7 de ce document. Ses phases 2-8 (refonte InfraLens, design system partagé, bibliothèque d'icônes, etc.) sont **hors périmètre actuel**, listées en section 4 pour mémoire seulement.

---

## 1. État actuel (Phase 0, terminée le 2026-08-07)

Référence complète : `docs/audits/baseline.md`.

- **0 P0**, 5 P1, 4 P2, 1 P3. `pnpm lint`/`typecheck`/`test`/`build`/`e2e` tous verts. Lighthouse homepage : Perf 95-100, A11y 95, BP 100, SEO 100.
- Liflow déjà présenté comme actif partout, InfraLens déjà correctement nommé (sans `.dev` dans le libellé) — les deux règles non négociables du master plan (3.4, 3.5) sont déjà respectées. Aucun lien interne cassé.
- Écarts réels identifiés : pas de route `/contact` dédiée (seulement une server action), `force-dynamic` non justifié sur `app/page.tsx:5`, données projets dupliquées entre `/apps` et `/projects` (tableaux inline non centralisés), contraste insuffisant sur l'eyebrow homepage (4.29:1 vs 4.5:1), décision produit non tranchée sur `/seo` (SEO District), 3 CVE high transitives (`sharp`/`postcss` via `next@16.2.12`).

Ces écarts réels remplacent les hypothèses génériques du master plan pour prioriser le travail phase par phase ci-dessous.

---

## 2. Séquence recommandée (master plan 0-13 × branding B0-B7)

| #   | Phase (master plan)                     | Objectif                                            | Écart réel constaté en Phase 0                                                                                                                                                                                                            | Branding en parallèle                                                                                                    | Dépend de   |
| --- | --------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------- |
| 0   | Audit local et baseline                 | État initial documenté                              | ✅ Terminé                                                                                                                                                                                                                                | **B0 — Inventaire visuel** (`docs/branding/VISUAL_BASELINE.md`, pas encore fait) — recommandé de le lancer avant Phase 3 | —           |
| 1   | Correction contenu et cohérence produit | Corriger infos fausses/obsolètes                    | Peu de travail : Liflow/InfraLens déjà conformes. Reste : vérifier `/lab` (formulations "en cours"/"en pause" sans preuve, section 4.7)                                                                                                   | —                                                                                                                        | Phase 0     |
| 2   | Nouvelle navigation et IA               | Simplifier les destinations sans perdre l'univers   | Créer `/tools`, `/contact` (actuellement absent), traiter `/apps` (supprimer/rediriger), fusionner `/background` dans `/about`, décider `/seo` (**décision humaine bloquante**, master plan ne tranche pas), renommer `/blog`→`/articles` | **B4 — Navigation et carte** (palette bleu-vert sur la carte)                                                            | Phase 1     |
| 3   | Refonte homepage                        | Clarifier la proposition de valeur                  | Investiguer puis retirer le `force-dynamic` de `app/page.tsx:5` (contraire à l'objectif 5.3), corriger le contraste eyebrow (4.29:1)                                                                                                      | **B1 — Tokens** + **B2 — Background global** (homepage = page la plus expressive, doit poser les fondations visuelles)   | Phase 2     |
| 4   | Système de contenu projets              | Centraliser les données, préparer les études de cas | Cible directement le doublon `/apps`/`/projects` constaté (tableaux littéraux dupliqués)                                                                                                                                                  | **B3 — Surfaces** (harmoniser cartes projet)                                                                             | Phase 2     |
| 5   | Étude de cas Liflow                     | Meilleure preuve de capacité produit                | Contenu source déjà riche (`content/posts/liflow-refonte-souvenirs-familiaux.ts`, `creer-application-saas-retour-experience-liflow.ts`) à réorganiser en étude de cas, pas à écrire de zéro                                               | —                                                                                                                        | Phase 4     |
| 6   | Étude de cas InfraLens                  | Profondeur technique InfraLens                      | Contenu source existant (`content/posts/infralens-outil-open-source-analyse-performance-web.ts`) à structurer                                                                                                                             | —                                                                                                                        | Phase 4     |
| 7   | Espace Outils                           | InfraLens = 1er outil utilisable                    | Créer `/tools`, `/tools/infralens`, décider sous-domaine vs rewrite (**décision humaine**, section 9.2)                                                                                                                                   | **B6 — Intégration InfraLens** (signature "by Randy Code")                                                               | Phase 2, 6  |
| 8   | Amélioration propre InfraLens           | Renforcer avant/pendant migration                   | Hors dépôt `randy-code` (dépôt InfraLens séparé, règle 3.6) — SSRF, rate limiting distribué, etc. à traiter côté InfraLens                                                                                                                | —                                                                                                                        | Phase 7     |
| 9   | À propos, Background, stack             | Profil cohérent et crédible                         | Fusion `/background` déjà identifiée en Phase 2 ; contenu à rédiger                                                                                                                                                                       | —                                                                                                                        | Phase 2     |
| 10  | Articles et contenu technique           | Knowledge Base = preuve d'expertise                 | 7 articles déjà présents dans `content/posts/` — travail de structuration/mise en avant, pas de création ex nihilo                                                                                                                        | —                                                                                                                        | Phase 2     |
| 11  | SEO technique et migrations             | Finaliser indexation                                | Ajouter le champ `openGraph` explicite (absent de `app/layout.tsx`), redirections `/apps`, `/background`, `/blog`                                                                                                                         | **B5 — Logo Randy Code** (favicon, OG)                                                                                   | Phases 1-10 |
| 12  | Accessibilité, performance, QA finale   | Valider la qualité production                       | Corriger le `color-contrast` Lighthouse, ajouter une analyse de bundle (absente sous Turbopack Next 16), re-vérifier les CVE `sharp`/`postcss`                                                                                            | **B7 — QA branding**                                                                                                     | Phases 1-11 |
| 13  | Mise en ligne et suivi                  | Déployer avec stratégie mesurable                   | Décision domaine `infralens.dev` à prendre avec données réelles (section 9.3)                                                                                                                                                             | —                                                                                                                        | Phase 12    |

---

## 3. Décisions humaines bloquantes (l'IA ne doit pas trancher seule)

Ces points sont explicitement signalés comme non tranchables par l'IA dans les documents source :

1. **SEO District (`/seo`)** — Option A (page commerciale dédiée) vs Option B (intégrer ailleurs, recommandé par défaut). Bloque une partie de la Phase 2.
2. **Intégration InfraLens** — sous-domaine (`infralens.randy-code.dev`, recommandé) vs rewrite (`randy-code.dev/tools/infralens/*`, plus complexe) vs monorepo (non recommandé actuellement). Bloque la Phase 7.
3. **Domaine `infralens.dev`** — calendrier de dépréciation/redirection 301, décidé avec des données de trafic réelles, pas avant migration. Concerne la Phase 13.
4. **`/lab`** — conserver seulement si contenu réellement démonstratif (section 4.7) ; à valider au cas par cas en Phase 1.

## 4. Hors périmètre actuel (vision écosystème, phases 2-8)

Rappelées pour mémoire, à ne pas anticiper : refonte InfraLens (dépôt séparé), package `design-system` partagé (`packages/design-system/`), bibliothèque d'icônes, templates d'études de cas réutilisables, galerie open source, documentation développeur, nouveaux outils.

---

## 5. Prochaine étape

**Phase 1 — Correction du contenu et cohérence produit.** Périmètre réel limité vu l'audit (Liflow/InfraLens déjà conformes) : essentiellement la revalidation du contenu `/lab`. Confirmation à demander avant de démarrer.
