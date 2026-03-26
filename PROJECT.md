# Randy World — Interactive Portfolio

## Vision

Portfolio thématique avec navigation par carte du monde. Chaque zone correspond à un domaine de compétence, toutes reliées à un hub central.

> Mémorable visuellement, professionnel dans le fond.

**Objectifs :** différenciation · lisibilité · SEO · génération d'opportunités

---

## Positionnement

> Randy World présente un développeur fullstack freelance avec un parcours technique terrain — des produits concrets, utiles et durables.

---

## Structure des zones

7 zones en ellipse autour d'un hub central (`*`), toutes reliées par des tirets animés.

```
                   [ Apps Station ]
                          |
      [ Lab Zone ] -------*------- [ SEO District ]
                       /     \
               [ About ]     [ Projects City ]
                   |                 |
            [ Background ]   [ Knowledge Base ]
```

### Routes

| Route          | Zone                    | Couleur           |
| -------------- | ----------------------- | ----------------- |
| `/`            | Hub central (world map) | —                 |
| `/apps`        | Apps Station            | `#8b5cf6` purple  |
| `/seo`         | SEO District            | `#10b981` emerald |
| `/projects`    | Projects City           | `#22d3ee` cyan    |
| `/lab`         | Lab Zone                | `#f59e0b` amber   |
| `/about`       | About Base              | `#ec4899` pink    |
| `/blog`        | Knowledge Base          | `#f97316` orange  |
| `/background`  | Background              | `#94a3b8` slate   |
| `/blog/[slug]` | Article de blog         | —                 |

---

## Hero text — rotation au refresh

Tirage aléatoire côté serveur (`React.cache()` + `force-dynamic`), fixe pendant le rendu. Pas de sessionStorage, pas de JS client.

**Variant 1 — Équilibrée (SEO)**

- Headline : _Développeur web — SaaS, SEO local & applications sur mesure_
- SEO title : _Ce que je construis_

**Variant 2 — Produit**

- Headline : _Je conçois des applications web utiles et des sites qui génèrent des résultats_
- SEO title : _Ce que je fais_

**Variant 3 — Client**

- Headline : _Création de sites web et d'applications sur mesure_
- SEO title : _Ce que je peux faire pour vous_

---

## Direction artistique

**Ambiance :** sombre · moderne · futuriste · UI jeu + dashboard

**Palette :**

- Background : `#09090b`
- Surface : `#111827`
- Accent 1 : `#22d3ee` (cyan)
- Accent 2 : `#8b5cf6` (purple)
- Texte : blanc cassé

**Typographie :** Geist Sans (intégré Next.js)

---

## Stack technique

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion 12
- shadcn/ui
- Resend (formulaire de contact → `CONTACT_EMAIL`)

---

## Règles SEO

- Contenu visible sans JS (Server Components)
- H1 unique par page
- H2 structurés
- URLs propres
- Sitemap auto-généré (`app/sitemap.ts`)

---

## Pages à créer (roadmap)

- `/seo/[city]` — pages SEO locales par ville
- `/creation-site-artisan`
- `/developpeur-freelance-nextjs`

---

## Features à venir

- Pages SEO locales dynamiques (`/seo/[city]`)
- Assistant IA intégré (Claude API)
- Stats dynamiques (nb projets, articles)

---

## À éviter

- Canvas-only (mauvais SEO)
- Contenu caché ou JS-only
- Surcharge visuelle
- Navigation confuse

---

## Guidelines IA

- Toujours privilégier lisibilité + SEO
- Garder une structure simple
- Ajouter du style via animations (pas l'inverse)
- Ne jamais sacrifier le contenu pour l'effet visuel
- Passer les icônes Lucide comme strings (`icon="building2"`) dans PageShell — pas comme composants React (contrainte Server/Client boundary)
- Les connexions SVG utilisent uniquement une animation `opacity` (pas `pathLength`) — Framer Motion `pathLength` entre en conflit avec `strokeDasharray` et rend les traits invisibles
