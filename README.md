# Randy World

Portfolio interactif de Randy Rimbault — développeur fullstack freelance.

> Lisible comme un site classique, vécu comme une expérience.

**Site :** [randy-code.dev](https://randy-code.dev)

---

## Stack

- **Framework :** Next.js 16 (App Router)
- **Langage :** TypeScript
- **Style :** Tailwind CSS v4
- **Animations :** Framer Motion 12
- **UI :** shadcn/ui
- **Email :** Resend
- **Déploiement :** Vercel

## Structure

```
app/
  page.tsx              # Home — world map interactive
  about/                # About Base
  apps/                 # Apps Station
  blog/                 # Knowledge Base (listing + articles)
  contact/              # Formulaire de contact (Resend)
  lab/                  # Lab Zone
  projects/             # Projects City
  seo/                  # SEO District
  opengraph-image.tsx   # OG card dynamique

content/posts/          # Articles de blog (un fichier par article)
src/
  components/
    map/                # WorldMap, MapConnections, MapNode
    layout/             # PageShell
  lib/
    blog.ts             # Registry des articles + utilitaires
    data.ts             # Zones, connexions, HUB
```

## Développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Ajouter un article

1. Créer `content/posts/[slug].ts` en suivant le modèle existant
2. L'importer dans `src/lib/blog.ts`
3. Le temps de lecture est calculé automatiquement
