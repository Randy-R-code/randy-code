# Randy World — Interactive Portfolio

## Vision

Portfolio interactif façon jeu exploratoire, combiné à un site optimisé SEO.

> Lisible comme un site classique, vécu comme une expérience.

**Objectifs :** expérience mémorable · professionnel · indexable · générateur d'opportunités

---

## Positionnement

> Randy World ne présente pas un développeur — il montre un créateur de produits capable de construire des applications concrètes, utiles et performantes.

---

## Structure des zones

```
              +-------------------+
              |    Apps Station   |
              |   SaaS / Produits |
              +---------+---------+
                        |
  +------------+        |        +------------------+
  |  Lab Zone  +--------+--------+   SEO District   |
  | Experiments|        *        |   SEO/Vitrines   |
  +------------+        |        +------------------+
                        |
              +---------+---------+
              |   Projects City   |
              | Projets concrets  |
              +----+---------+----+
                   |         |
   +---------------+         +-------------------+
   |   About Base  |         |   Knowledge Base  |
   | Profil/Contact|         |  Articles/Guides  |
   +---------------+         +-------------------+
```

### Routes

| Route         | Zone                    | Couleur           |
| ------------- | ----------------------- | ----------------- |
| `/`           | Hub central (world map) | —                 |
| `/projects`   | Projects City           | `#22d3ee` cyan    |
| `/apps`       | Apps Station            | `#8b5cf6` purple  |
| `/seo`        | SEO District            | `#10b981` emerald |
| `/lab`        | Lab Zone                | `#f59e0b` amber   |
| `/about`      | About Base              | `#ec4899` pink    |
| `/blog`       | Blog                    | `#f97316` orange  |
| `/seo/[city]` | Pages SEO locales       | —                 |

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
- Resend (formulaire de contact → randy.rcode@gmail.com)

---

## Règles SEO

- Contenu visible sans JS (Server Components)
- H1 unique par page
- H2 structurés
- URLs propres
- Pages SEO locales : `/seo/perpignan`, `/seo/montpellier`…

---

## Pages SEO à créer

- `/seo/perpignan` — SEO local Perpignan
- `/seo/montpellier` — SEO local Montpellier
- `/creation-site-artisan`
- `/developpeur-freelance-nextjs`

---

## Features à venir

- Assistant IA intégré (Claude API) — navigation vocale / textuelle
- Bouton "Zone aléatoire"
- Easter eggs
- Stats dynamiques (nb projets, stack)

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
