# Randy Code

Randy Rimbault's personal portfolio — an interactive, map-based site presenting
his projects, articles, and integrated developer tools.

**Site:** [randy-code.dev](https://randy-code.dev)

---

## Overview

The homepage is an interactive world map: each zone is a real, accessible
route (Projects, Tools, Articles, About, Lab), not just a visual gimmick.
Beyond the map, the site is a standard content/portfolio app — project case
studies, a blog, a contact form, and a growing space for developer tools
built and open-sourced under the Randy Code brand.

## Highlights

- **Interactive homepage** — a hub-and-zone world map, fully keyboard- and
  screen-reader-accessible, with a static fallback for `prefers-reduced-motion`.
- **Project case studies** (`/projects`) — Liflow (SaaS product), InfraLens
  (open-source tool), and client work, each with problem/solution/architecture
  write-ups sourced from the real product, not marketing copy.
- **Articles** (`/articles`) — technical write-ups grounded in what was
  actually built (e.g. securing a URL analyzer against SSRF), with an RSS feed.
- **Developer tools** (`/tools`) — open-source tools built by Randy Code,
  usable directly from the site.

## Developer Tools — InfraLens

[InfraLens](https://randy-code.dev/tools/infralens) is an open-source website
inspection tool — DNS, TLS, HTTP security headers, infrastructure, and other
public technical signals, summarized into one scored, readable report.

It's the first tool integrated natively into Randy Code (migrated from its
own standalone repository into `app/tools/infralens/` and `src/infralens/`).
Its original documentation, changelog, and MIT license are preserved under
[`docs/infralens/`](docs/infralens/README.md).

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **UI:** shadcn/ui, Radix UI primitives
- **Email:** Resend (contact form)
- **Testing:** Vitest (unit), Playwright (E2E)
- **Deployment:** Vercel

See [`package.json`](package.json) for exact versions and scripts.

## Project Structure

```
app/
  page.tsx                    # Home — interactive world map
  about/                      # About
  articles/                   # Articles (listing + [slug])
  contact/                    # Contact page + form (Resend server action)
  lab/                        # Lab — experiments and internal tooling
  projects/                   # Project case studies (listing + [slug])
  tools/                      # Developer tools
    infralens/                # InfraLens — native routes (analyze, compare, docs, privacy)
    cron-builder/             # Cron Builder — visual cron expression editor
    json-studio/              # JSON Studio — format, validate and explore JSON
  rss.xml/                    # RSS feed
  sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx

content/posts/                # Articles, one file per post
src/
  components/                 # Shared UI (map, layout, shadcn/ui primitives)
  lib/                        # Content registries, brand tokens, navigation, JSON-LD
  infralens/                  # InfraLens engine — checks, security/SSRF, DNS, scoring, history
  cron-builder/               # Cron Builder engine — parsing, validation, next-run calculation
  json-studio/                # JSON Studio engine — parsing, formatting, stats, storage

docs/
  infralens/                  # InfraLens developer docs, changelog, security policy, MIT license
```

## Development

Requires [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality Checks

```bash
pnpm lint        # ESLint
pnpm typecheck   # tsc --noEmit
pnpm test        # Vitest
pnpm build       # Production build
pnpm check       # lint + typecheck + test + build — the required local/CI gate

pnpm e2e             # Playwright — portfolio routes
pnpm e2e:infralens   # Playwright — InfraLens (rate-limited, single worker)
```

`e2e`/`e2e:infralens` run against a real server and aren't part of `pnpm check`;
they run as separate CI jobs.

## Content / Articles

1. Create `content/posts/[slug].ts` following an existing post's shape.
2. Register it in `src/lib/blog.ts`.
3. Reading time is computed automatically.

## Licensing

Randy Code as a whole is public but does **not** carry an open-source
license — public visibility doesn't grant reuse rights.

**InfraLens is the exception**: it remains MIT licensed, scoped to
[`docs/infralens/LICENSE`](docs/infralens/LICENSE). See
[`docs/infralens/README.md`](docs/infralens/README.md) for its documentation.
