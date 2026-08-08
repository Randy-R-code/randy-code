# Inventaire visuel — Phase B0 (branding)

> Généré le 2026-08-08. Source de vérité : `RANDY_CODE_BRANDING_PLAN.md`. Audit en lecture seule — aucun fichier source modifié pour produire ce document. État du code au commit `d3488a3` (après Phases 0-6, 9-12 du master plan de contenu).

---

## 1. Couleurs et variables existantes

### 1.1 Couleurs de zone (5, `src/lib/data.ts`)

| Couleur            | Zone                      | Icône        |
| ------------------ | ------------------------- | ------------ |
| `#8b5cf6` (violet) | Tools Station             | Wrench       |
| `#22d3ee` (cyan)   | Projects City             | Building2    |
| `#f97316` (orange) | Knowledge Base (Articles) | BookOpen     |
| `#ec4899` (rose)   | About Base                | User         |
| `#f59e0b` (ambre)  | Lab Zone                  | FlaskConical |

Chaque couleur est réutilisée telle quelle comme prop `color` de `PageShell` sur la page correspondante — confirmé par grep sur `app/*/page.tsx` :

- `app/tools/page.tsx:18` → `#8b5cf6`
- `app/projects/page.tsx:20` → `#22d3ee`
- `app/articles/page.tsx:21` → `#f97316`
- `app/about/page.tsx:127` → `#ec4899`
- `app/lab/page.tsx:44` → `#f59e0b`
- `app/contact/page.tsx:19` → `#ec4899` — **réutilise la couleur d'About** (Contact n'a pas de zone propre sur la carte, décision déjà actée en Phase 2)

`app/projects/[slug]/page.tsx` et `app/page.tsx` (homepage, section "Projets phares") redéfinissent localement `const color = "#22d3ee"` plutôt que d'importer depuis `data.ts` — duplication de la valeur, pas de la couleur en elle-même. **Vérification complémentaire** : en réalité 4 sources littérales distinctes pour cette même valeur (pas 3) : `data.ts`, `page.tsx`, `projects/[slug]/page.tsx`, et aussi `app/not-found.tsx:10` (lien "Retour à la carte" coloré en cyan) qui n'avait pas été relevé.

### 1.2 Couleurs additionnelles trouvées (hors zones)

| Couleur          | Fichier                                                                                                                   | Usage                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `#ffffff`        | `map-connections.tsx` (×3, fallback trait/hub), `articles/[slug]/page.tsx` (×2, boutons CTA "Découvrir Liflow/InfraLens") | trait par défaut, texte bouton        |
| `#10b981` (vert) | `app/lab/page.tsx:1` (statut "Disponible" d'OpenClaw), `app/opengraph-image.tsx` (tuile "SEO local")                      | statut positif, accent OG             |
| `#09090b`        | `app/manifest.ts` (background/theme_color), `app/layout.tsx` (`viewport.themeColor`)                                      | couleur de fond PWA/navigateur mobile |

### 1.3 `app/opengraph-image.tsx` — palette totalement séparée

L'image Open Graph (utilisée pour tous les partages sociaux du site) a sa **propre palette indépendante**, sans lien avec les 5 couleurs de zone :
`#3b82f6`/`#2563eb` (bleu, glow + barre latérale + eyebrow), `#22d3ee` (cyan, glow secondaire), `#8b5cf6` (violet, tuile "Applications SaaS"), `#10b981` (vert, tuile "SEO local"), fond `#0a0d16`, textes `#ffffff`/`#f1f5f9`/`#94a3b8`/`#64748b`/`#475569`.

Fait notable : c'est déjà la surface la plus "bleu dominant" du site actuel — coïncidence avec la direction bleu-vert du branding plan, mais non coordonné avec le reste (import de couleurs séparé, pas de token partagé).

### 1.4 Tokens CSS (`app/globals.css`, `:root`)

Système shadcn/Tailwind v4 standard, **non utilisé par les pages du site** (aucune des pages ne référence `bg-card`, `text-primary`, etc. — elles utilisent des couleurs hex/oklch inline à la place) :
`--background: oklch(0.085 0 0)`, `--foreground: oklch(0.97 0 0)`, `--card`/`--popover: oklch(0.13 0.012 252)` (même valeur que le fond de carte hardcodé partout ailleurs — coïncidence non reliée), `--primary: oklch(0.793 0.129 206)` (bleu cyan clair, seul endroit du fichier où un bleu apparaît), `--secondary`/`--muted`/`--accent: oklch(0.18 0.012 252)`, `--destructive: oklch(0.577 0.245 27.325)`, `--border: oklch(1 0 0 / 8%)`, `--radius: 0.625rem`. Bloc identique dupliqué en préfixe `--sidebar-*` (composant shadcn Sidebar, non utilisé sur le site public à ce jour — non vérifié si utilisé ailleurs).

### 1.5 Couleurs fonctionnelles Tailwind (texte)

`text-zinc-{300,400,500,600}` et `text-white` utilisés massivement pour le texte (pas de token dédié) — **25 occurrences de `text-zinc-500`/`text-zinc-600` réparties sur 11 fichiers**, en dehors de la homepage (déjà auditée et corrigée en Phase 3, Lighthouse homepage à 100/100 accessibilité). Ces 25 occurrences n'ont **jamais été testées par Lighthouse** (seule la homepage l'a été) — risque de contraste potentiel non vérifié, mêmes causes que le problème déjà corrigé (zinc-500 sur fond quasi noir). Fichiers concernés : `app/contact/page.tsx`, `app/not-found.tsx`, `app/tools/page.tsx`, `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`, `app/lab/page.tsx`, `app/articles/page.tsx`, `app/articles/[slug]/page.tsx`, `app/about/page.tsx`, `src/components/contact-form.tsx`, `src/components/layout/page-shell.tsx`.

---

## 2. Composants liés aux couleurs de zones

- **`src/lib/data.ts`** — source de vérité actuelle des 5 couleurs de zone (voir 1.1).
- **`src/components/layout/page-shell.tsx`** — composant partagé par toutes les pages sauf homepage/contact-form/404/articles-slug/projects-slug (ceux-ci ont leur propre layout). Prend `color: string` en prop, l'applique à l'icône, au badge, et à `${color}18` pour le fond de badge.
- **`src/components/map/map-node.tsx`** et **`world-map.tsx`** — rendent chaque zone avec sa couleur (bordure, fond d'icône, texte "Explorer", lien mobile) ; **`map-connections.tsx`** trace les traits de connexion avec la couleur de la zone survolée (`#ffffff` par défaut sinon).
- **6 pages** passent leur couleur en dur à `PageShell` ou à leurs propres éléments (voir 1.1) — **aucune ne référence `zones` depuis `data.ts`**, chaque page redéfinit sa couleur littéralement. Une migration de palette nécessiterait donc de toucher `data.ts` **et** chacune des 6 pages séparément (pas un seul point de vérité).

---

## 3. Fonds, gradients, bordures et ombres

- **Fond de carte quasi-universel** : `oklch(0.13 0.012 252)` — utilisé dans quasiment tous les fichiers de page (about ×6, contact-form, world-map, map-node, tools, projects, projects/[slug], not-found, lab, articles, articles/[slug], page.tsx ×3). C'est de facto le token de fond de carte non déclaré du site.
- **Fond de chip/tag secondaire** : `oklch(0.18 0.012 252)` — 6 fichiers.
- **Fond légèrement plus sombre** : `oklch(0.11 0.01 252)` — 3 fichiers (contact-form, lab, articles).
- **Bordures translucides blanches** : `oklch(1 0 0 / 8%)` (site-header, page.tsx ×2), `oklch(1 0 0 / 6%)` (page.tsx), `oklch(1 0 0 / 3%)` (articles/[slug], grille de fond hero), `oklch(1 0 0 / 14%)` (hero-text, bouton secondaire).
- **Opacités de couleur de zone incohérentes** — même rôle (bordure/accent), suffixes hex différents selon le fichier : `${color}18` (page-shell, page.tsx, projects/[slug], map-node), `${color}20` (page.tsx), `${color}25` (world-map, mobile), `${color}30` (map-node, projects/[slug]), `${color}90` (map-node, hover). **Pas de convention unique** — 5 valeurs d'opacité différentes pour un usage conceptuellement similaire.
- **Gradients** : un seul dans les pages (`bg-linear-to-t from-black/80 via-black/30 to-transparent`, hero d'article), plus plusieurs `radial-gradient`/`linear-gradient` inline dans `opengraph-image.tsx` (glows bleu/cyan, barre latérale bleue) — cf. section 1.3.
- **Ombres** : `drop-shadow-lg` (titre d'article), `boxShadow: 0 0 24px ${color}30` (hover carte map-node), `group-hover:shadow-xl` (cartes articles). Pas d'ombres portées systématiques ailleurs.

---

## 4. Assets logo, favicon, PWA et Open Graph

| Fichier                       | Dimensions        | Utilisé ?                                                                                           |
| ----------------------------- | ----------------- | --------------------------------------------------------------------------------------------------- |
| `app/icon.png`                | 32×32             | ✅ convention Next.js (favicon)                                                                     |
| `app/apple-icon.png`          | 180×180           | ✅ convention Next.js                                                                               |
| `public/icon-32.png`          | 32×32             | Non référencé directement dans le code — doublon probable de `app/icon.png`, non déterminé si servi |
| `public/apple-touch-icon.png` | 180×180           | Non référencé directement — doublon probable de `app/apple-icon.png`                                |
| `public/icon-192.png`         | 192×192           | ✅ référencé dans `app/manifest.ts`                                                                 |
| `public/icon-512.png`         | 512×512           | ✅ référencé dans `app/manifest.ts`                                                                 |
| `public/logo-r.png`           | 940×940           | ❌ **aucune référence trouvée dans `app/` ni `src/`** — asset mort, 568 Ko                          |
| `app/opengraph-image.tsx`     | 1200×630 (généré) | ✅ image OG dynamique, palette propre (section 1.3)                                                 |

**Logo graphique** : aucun. `src/components/layout/site-header.tsx:25` confirme que le header affiche le texte brut **"Randy Code"** (`<Link>` stylé, pas de SVG/image). C'est le wordmark provisoire posé en Phase 2 de la refonte de contenu, en attendant cette Phase B5.

**`app/manifest.ts`** — `short_name: "R-code"` (terme historique, alors que le branding plan section 1 dit qu'il ne doit plus être le nom principal affiché) et `name: "Randy Rimbault — Développeur Fullstack Freelance"` (nom personnel, pas "Randy Code") — ces deux champs sont visibles par l'utilisateur (nom sous l'icône PWA) et n'ont pas suivi le renommage de marque déjà fait ailleurs sur le site.

---

## 5. Problèmes de contraste ou de cohérence

- **Déjà réglé** (ne pas re-traiter) : eyebrow homepage + taglines de la carte (desktop et mobile) — corrigés en Phase 3, Lighthouse homepage 100/100 accessibilité, mobile et desktop.
- **Nouveau — non vérifié** : 25 occurrences `text-zinc-500`/`text-zinc-600` sur 11 fichiers hors homepage, jamais passées par Lighthouse (voir 1.5).
- **Incohérence de duplication de couleur** : `#22d3ee` (couleur Projects City) codée en dur séparément dans `data.ts`, `app/page.tsx` et `app/projects/[slug]/page.tsx` — 3 sources littérales pour la même valeur.
- **Incohérence d'opacité de bordure** : 5 suffixes hex différents (`18`/`20`/`25`/`30`/`90`) pour un rôle équivalent selon le fichier (section 3).
- **Palette de l'image OG déconnectée** du reste du site (section 1.3) — actuellement la seule surface bleu-dominant, mais isolée, pas de token partagé.
- **Couleurs de zone proches perceptuellement** : `#f59e0b` (ambre, Lab) et `#f97316` (orange, Articles) sont assez proches sur la roue chromatique — à surveiller si la nouvelle palette bleu-vert doit les distinguer plus nettement (aucun test de distinguabilité n'a été fait, remarque qualitative seulement).
- **Nom de marque non synchronisé** : `app/manifest.ts` (section 4) traîne encore l'ancien nom/short_name.

---

## 6. Stratégie de migration vers les tokens bleu-vert (recommandation, non implémentée)

Le branding plan (section 4-5) fixe : bleu = couleur principale (navigation, CTA, liens, focus, connexions majeures de la carte), vert = secondaire/technique (outils, InfraLens, validation, badges open source). Les 5 couleurs de zone actuelles n'ont aucune couleur bleue ni verte dans leur jeu actuel (violet/cyan/orange/rose/ambre) — migration complète nécessaire, pas un ajustement.

**Deux approches possibles, à trancher en Phase B1 :**

**Approche A — Toutes les zones passent sur le dégradé bleu-vert**, différenciées par la position/l'icône/le libellé plutôt que par la teinte (cohérent avec le principe du branding plan section 2 : "la carte interactive reste un élément distinctif, pas une excuse pour multiplier les couleurs"). Ex. : `--blue-500`/`--blue-400` dominant pour Projects/About/Articles (navigation générale), `--green-500`/`--green-400` pour Tools Station (cohérent avec "vert = outils, InfraLens" section 5 du branding plan). Lab garde une teinte à part si le plan veut préserver une touche d'exploration (section 4.7 du master plan la présente comme différente des autres).

**Approche B — Un seul bleu dominant partout**, le vert réservé exclusivement à Tools Station/InfraLens comme unique accent secondaire (lecture la plus stricte de "le rouge/orange/jaune restent réservés aux états fonctionnels" — section 2 branding plan, point 5 — qui implique implicitement que les autres teintes non bleu/vert doivent disparaître de l'usage décoratif).

Dans les deux cas : **remplacer les 3 sources littérales de couleur par un point unique** (`data.ts` exporte déjà `Zone.color` — les pages devraient importer depuis `zones` au lieu de redéfinir, ce qui réglerait aussi la duplication section 1.1/5 au passage). Normaliser les 5 suffixes d'opacité de bordure en un nombre restreint de tokens (ex. `border-subtle`/`border-default`/`border-strong` comme le fait déjà le branding plan section 4).

---

## 7. Risques de régression

- **Lien visuel zone↔couleur sur la carte** : `map-connections.tsx` colore les traits selon `zoneMap[fromId]?.color` — si toutes les zones convergent vers 1-2 teintes, l'effet "trait qui s'allume à la couleur de la zone survolée" perd de sa lisibilité differentielle. À vérifier visuellement pendant B4.
- **Captures déjà prises** (`docs/audits/screenshots/*-phase3.png`, `*.png` divers) refléteront l'ancienne palette — pas un risque technique, juste à re-générer après la migration si on veut des captures à jour dans les audits.
- **Aucun test automatisé ne couvre les couleurs** — les 18 tests e2e vérifient présence/texte/liens, jamais de couleur ni de contraste précis en dehors des scores Lighthouse globaux. Risque de régression de contraste faible à détecter automatiquement — la vérification manuelle/Lighthouse post-migration reste nécessaire (déjà la pratique de ce projet).
- **`logo-r.png`** (568 Ko, mort) — sans risque à supprimer, mais hors périmètre B0 (lecture seule) ; à faire en B1 ou plus tard.

---

## 8. Critères de validation de cette phase (repris du branding plan, section 13, Phase B0)

- Relever toutes les couleurs actuelles ✅ (section 1)
- Identifier les composants dépendants d'une couleur de zone ✅ (section 2)
- Inventorier les fonds, ombres, bordures et gradients ✅ (section 3)
- Inventorier les logos et favicons ✅ (section 4)
- Inventorier les assets Open Graph ✅ (section 4, sous-section 1.3)
- Documenter les contrastes problématiques ✅ (section 5)
- Livrable `docs/branding/VISUAL_BASELINE.md` ✅ (ce document)

---

## Commandes exécutées

```
grep -rEo '#[0-9a-fA-F]{6}\b' app src --include="*.tsx" --include="*.ts" | sort | uniq -c | sort -rn
grep -rEo 'oklch\([^)]*\)' app src --include="*.tsx" --include="*.ts" | sort | uniq -c | sort -rn
sed -n '1,80p' app/globals.css
cat src/lib/data.ts
grep -n "color\|iconMap" src/components/layout/page-shell.tsx
grep -n 'color="#' app/*/page.tsx
grep -rEo '\$\{color\}[0-9a-fA-F]{2}' app src --include="*.tsx" | sort | uniq -c | sort -rn
grep -rn "bg-linear-to\|bg-gradient\|box-shadow\|shadow-" app src --include="*.tsx"
grep -n "background\|color" src/components/map/*.tsx
ls -la public/ public/.well-known
sips -g pixelWidth -g pixelHeight <chaque icône>
cat app/manifest.ts
grep -n "Randy Code\|logo\|Logo" src/components/layout/site-header.tsx
grep -rn "logo-r" app src
grep -rn "apple-touch-icon\|icon-32" app src --include="*.ts" --include="*.tsx"
cat app/opengraph-image.tsx
grep -rn "text-zinc-500\|text-zinc-600" app src --include="*.tsx"
```

## Fichiers examinés

`app/globals.css`, `src/lib/data.ts`, `src/components/layout/page-shell.tsx`, `src/components/layout/site-header.tsx`, `src/components/map/{world-map,map-node,map-connections}.tsx`, `src/components/hero-text.tsx`, `src/components/contact-form.tsx`, `app/manifest.ts`, `app/opengraph-image.tsx`, `app/layout.tsx`, `app/not-found.tsx`, `app/page.tsx`, et les 8 pages sous `app/{about,articles,articles/[slug],contact,lab,projects,projects/[slug],tools}/page.tsx`, plus le contenu de `public/`.

## Décisions (tranchées le 2026-08-08)

1. **Approche B retenue** — un seul bleu dominant partout, vert réservé à Outils/InfraLens + accents ponctuels (résultats/preuves sur Projets, état de succès sur Contact), conformément à la répartition par page déjà donnée par le branding plan section 5. **Lab Zone n'est pas une exception** — bleu dominant comme les autres pages, pas de teinte "exploration" dédiée (la section 5 du branding plan ne couvrait pas Lab explicitement, tranché par Randy plutôt que de deviner).
2. **`logo-r.png` conservé pour l'instant** — pas de suppression tant que le nouveau logo (Phase B5) n'existe pas.
3. **`app/manifest.ts` non touché maintenant** — `name`/`short_name` attendent la Phase B5 (nouveau logo), pas de mise à jour anticipée.
4. **Les 25 `text-zinc-500`/`text-zinc-600`** — corrigées au fil de la migration de palette (Phases B1-B4), pas de passage Lighthouse dédié séparé.
