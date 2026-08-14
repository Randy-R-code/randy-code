# Changelog

All notable changes to Randy Code are documented here. The format follows a
simplified [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) (Added,
Changed, Fixed, Removed, Security) and the project uses semantic versioning
intentionally rather than mechanically.

InfraLens's history as a standalone product (2026-01-06 to 2026-08-10) is
frozen in [`docs/infralens/CHANGELOG.md`](docs/infralens/CHANGELOG.md).
InfraLens changes since its native migration are recorded here.

## [1.0.2] — 2026-08-14

### Security

- **Hardened Content-Security-Policy** — added `object-src 'none'`;
  `'unsafe-inline'` on `script-src` stays, documented as a deliberate
  tradeoff (removing it requires either per-request nonces, which force
  the ~fully static site into dynamic rendering sitewide, or Next.js's
  experimental SRI feature, which doesn't cover React/Next's own inline
  hydration scripts). `upgrade-insecure-requests` was tried and dropped —
  it's a no-op on this all-HTTPS site but made WebKit try to upgrade
  navigation on the plain-HTTP `localhost` server used by the InfraLens
  e2e suite, breaking it in CI.
- **DMARC tightened** from `p=none` to `p=quarantine` on `randy-code.dev`
  (DNS record, not in this repo).
- **Removed a stale Google Workspace MX record** left over after
  cancelling the subscription — mail to `@randy-code.dev` root was
  silently bouncing (DNS record, not in this repo).

## [1.0.1] — 2026-08-13

### Fixed

- **InfraLens's "What it checks" section overflowed the page's content
  width** — used `max-w-6xl` while every other section/page on InfraLens
  (hero, example report, open-source, CTA, `/compare`, `/docs`, `/privacy`)
  uses `max-w-4xl`; aligned to match.
- **Footer column alignment** — bare `<li>` elements picked up an inherited
  line-height "strut", which text-only links and icon+text links resolved
  against differently (baseline alignment), offsetting the "Liens" column
  ~2.5px closer to its heading than "Site"/"Explorer". A previously known,
  never-fixed regression from the branding pass — `<li>` elements now use
  `display: flex`, removing the dependency on inherited line-height entirely
  (verified: 0px offset between columns).
- **Homepage hero's GitHub link** looked mismatched next to the two CTA
  buttons on mobile, especially when it wrapped. Moved to its own line below
  the buttons, matching InfraLens's hero secondary-actions treatment
  (`text-sm`, larger icon); label simplified to "GitHub" — it links to a
  profile, not a specific repository, so a more descriptive label would
  have overclaimed.

## [1.0.0] — 2026-08-13

Closes the 0.x "building it" era (portfolio redesign, InfraLens native
migration, branding system). The site is now a coherent, accurately
documented product rather than a work in progress — this release is that
milestone, not a new feature.

### Changed

- **Positioning fully aligned** — remaining "freelance" wording removed from
  live metadata (`README.md`, `src/lib/json-ld.ts`, `app/manifest.ts`,
  `app/layout.tsx`, About and Contact pages); the site now consistently
  reads "Développeur fullstack TypeScript" everywhere it describes current
  positioning.
- **`README.md` and both `CHANGELOG.md`s rewritten in English** — the root
  history consolidated from 44 releases into 25 coherent milestones (every
  true date preserved, no version numbers invented); InfraLens's
  standalone-era changelog trimmed to the same heading discipline.
- **`docs/infralens/README.md` rewritten** as developer/maintainer
  documentation (architecture, security model, scoring, env vars) instead of
  the old standalone-repo marketing README; `CONTRIBUTING.md` updated for
  the monorepo (no more separate `infralens` clone).
- GitHub repository description and topics updated to match the current
  product (`nextjs typescript react tailwindcss portfolio developer-tools
open-source web-development`).
- `CLAUDE.md` now permanently documents the CHANGELOG policy this release
  itself follows.

### Fixed

- **InfraLens landing page accessibility regression** — the "Fail" status
  badge in the example report (`text-red-400` on a nested translucent card
  background, introduced by the 0.10.0 recolor) fell to 3.77:1 contrast,
  below the 4.5:1 AA threshold; corrected to `text-red-300`.

### Removed

- Completed planning/migration documents (`RANDY_CODE_MASTER_PLAN.md`,
  `RANDY_CODE_BRANDING_PLAN.md`, `RANDY_CODE_ECOSYSTEM_VISION.md`,
  `docs/roadmap.md`, `docs/branding/VISUAL_BASELINE.md`, and InfraLens's own
  6 migration/branding plans plus `source-docs/`) and the `docs/audits/`
  snapshot archive (~18MB of Lighthouse reports/screenshots from now-closed
  phases) — all fully superseded by the real code and this changelog.
  Dangling comment references to those deleted plans cleaned up across
  InfraLens's engine.
- 3 unused brand asset variants (`logo-horizontal.png` and 2 copies of
  `logo-rcode-horizontal.png`) never wired up in any component.

## [0.10.4] — 2026-08-12

### Fixed

- **PWA/mobile icons rendered with a white background and an optically
  off-center "R"** — transparent PNG icons (`app/icon.png`,
  `app/apple-icon.png`, `public/icon-192.png`, `public/icon-512.png`,
  `app/favicon.ico`) aren't handled consistently by OS home-screen renderers,
  which filled the transparency with white. Given an opaque background
  (`#070b10`, matching the manifest/theme color) and recropped the glyph a
  few pixels right — its bounding box was centered, but the visual center of
  mass (a thinner diagonal leg vs. the left stem) was off by ~3.5%. The
  site's header logo (`public/brand/logo-symbol.png`) is unaffected — it
  already sits on the page's dark background.

## [0.10.3] — 2026-08-11

### Fixed

- **InfraLens status badge clipped instead of wrapping on mobile** — the
  title/badges row lacked `flex-wrap` inside an `overflow-hidden` card.
  Badges now wrap under the title instead of being cut off by the rounded
  corner.
- **InfraLens error messages redacted in production** — Next.js redacts
  thrown `Error` messages from Server Actions in production builds. The
  three expected rejections (SSRF block, rate limit, malformed URL) now
  return `{ ok: false, message }` instead of throwing, so the intended
  message reaches the user; a genuinely unexpected error still throws and
  keeps Next's generic message, which remains correct for that case.
- Unused image preload on every InfraLens page (`not-found.tsx` referenced
  an asset Next.js preloads site-wide for the segment) and a missed
  retokenization pass on the same file; minor copy fixes.

## [0.10.0] — 2026-08-11

### Changed

- **InfraLens recolored to the real Randy Code palette** — `.infralens-scope`
  no longer redefines a full shadcn zinc theme; surfaces, borders, and text
  inherit Randy Code's design tokens directly through normal CSS cascade,
  with only InfraLens's distinct green primary/ring still overridden.
  Verified against the full E2E suite (including accessibility) with no
  contrast regressions.

## [0.9.1] — 2026-08-11

### Changed

- **InfraLens's landing example report and Open Graph card rebuilt** to
  reuse the real report components and a shared mock-data source, replacing
  a parallel implementation that had drifted (wrong status vocabulary,
  incorrect icon/color mapping).
- **210 raw Tailwind zinc classes retokenized** to Randy Code's semantic
  classes across 22 InfraLens files — a rename only, no value changes yet,
  preparing the real recolor above without touching these files twice.

## [0.8.3] — 2026-08-11

### Changed

- **"0.7.x redesign" era closed** — native InfraLens integration (0.7.16)
  was its last major undertaking.
- **Duplicate shadcn primitives merged** — `button`/`card` existed twice
  (Randy Code and InfraLens) at different scales; InfraLens's copies removed
  in favor of `src/components/ui/`. Primitives with no Randy Code equivalent
  promoted there for reuse by future tools; unused ones deleted.
- Redundant "How results are presented" landing section removed (duplicated
  the report preview just above it, with stale status vocabulary).

### Fixed

- **Duplicate footer on `/tools/infralens`** — InfraLens rendered its own
  footer in addition to Randy Code's global one. Replaced with a shared
  "Back to tools" link component, reusable by future tools.
- Three dead links to the InfraLens standalone GitHub repository (site
  config, analysis User-Agent, `SECURITY.md`) repointed to `randy-code`.
- The browser tab title still read the old "Freelance" positioning on
  InfraLens pages; aligned with the rest of the site.
- Last remaining `infralens.dev` link (project case study) repointed to
  `/tools/infralens`; missing canonical/sitemap entries added for all four
  InfraLens routes.

## [0.7.16] — 2026-08-10

### Added

- **InfraLens migrated natively into Randy Code.** The full engine (18
  checks, scoring, DNS, security/SSRF, compare, history, recommendations)
  was copied into `src/infralens/`, namespaced with dedicated tsconfig/vitest
  aliases (`@infralens-*`) to avoid collisions with the existing `src/`.
  Native routes live under `app/tools/infralens/` (analysis, `/compare`,
  `/docs`, `/privacy`, a dynamic Open Graph card, and a catch-all route for a
  styled 404). The previous `next.config.mjs` proxy/rewrite and
  `INFRALENS_ORIGIN` are gone — `/tools/infralens` is served directly by this
  repository.
- InfraLens's original documentation (README, CHANGELOG, SECURITY,
  CONTRIBUTING, MIT LICENSE, its own master/branding plans) preserved under
  `docs/infralens/`.
- Dedicated E2E projects (`infralens-desktop`/`infralens-mobile`, single
  worker — the analysis flow is rate-limited to 1 request/IP/30s) and a
  separate CI job.
- Article "Securing a URL Analyzer Against SSRF" published, once the
  protection it describes was verified in place on the migrated engine.

### Changed

- `pnpm check` now includes unit tests (`pnpm test --run`), which it
  previously didn't.

## [0.7.14] — 2026-08-08

### Added

- **Design tokens** (`src/lib/brand.ts`) — blue/green brand palette,
  neutrals, and functional colors as the single source of truth, replacing
  5 hardcoded per-zone colors (blue now dominant everywhere, green reserved
  for Tools Station/InfraLens and small positive accents).
- **Global background component** (`src/components/layout/app-background.tsx`)
  — technical grid, blue/green halos, vignette, mounted once in the root
  layout.
- **Site footer** (didn't exist before) — three link columns, logo,
  full-width watermark; dedicated GitHub icon SVG (`lucide-react` dropped
  brand icons in the version used here).
- **Randy Code logo** — first final asset set (R monogram, blue→green
  gradient) integrated into the header, and regenerated into all app/PWA
  icon sizes.

### Changed

- Three historical card surfaces replaced by `surface-1/2/3` tokens; border
  opacity suffixes normalized from 5 inconsistent values to 3 fixed roles;
  map hover motion reworked (subtle lift instead of scale).
- Open Graph image recolored onto `brand.ts`; positioning copy
  "Fullstack Freelance" → "Fullstack TypeScript" site-wide, consistent with
  the brand direction established this release.
- CSP relaxed with `'unsafe-eval'` in development only (removes a React
  console warning; production CSP unchanged and covered by its E2E test).

### Fixed

- A brand-blue text/badge pattern used everywhere fell to 4.24:1 contrast
  against its own tinted background, below the 4.5:1 AA threshold (caught by
  Lighthouse, verified by direct WCAG calculation). Corrected across 11
  files by shifting identity text from `blue-500` to `blue-400`; footer
  copyright/column-label contrast regression fixed the same way.

## [0.7.11] — 2026-08-08

### Added

- RSS feed (`app/rss.xml`), discoverable via `alternates.types`.
- Explicit `openGraph` metadata and `alternates.canonical` on all 11 pages
  (none had canonical URLs before).
- JSON-LD `SoftwareApplication` schema for Liflow and InfraLens.

### Security

- Content-Security-Policy header added (`next.config.mjs`), verified across
  all routes and interactions with no violations.

## [0.7.8] — 2026-08-08

### Added

- **Full case studies for the three showcased projects** — Liflow (11
  sections: context, problem, objectives, role, solution, architecture,
  technical choices, challenges, privacy/security, outcome, learnings),
  InfraLens (8 sections, sourced from its real README and architecture), and
  the automotive client project (a shorter Context/Role/Architecture
  extension; the client stays anonymized until its site is live).

### Changed

- `ProjectCaseStudy` fields made optional so a project can have a partial
  case study instead of requiring every section.
- About page's tech stack reorganized from a flat 21-item list into 4 tiers
  (Core, Backend & data, Product & infrastructure, Experiments) — same
  technologies, no additions or removals.

## [0.7.4] — 2026-08-08

### Added

- **Centralized project data source** (`src/lib/projects.ts`) — replaces two
  diverging inline arrays that previously lived in the projects listing and
  the homepage.
- Generic case-study template (`app/projects/[slug]/page.tsx`), statically
  generated for all three projects.

### Changed

- Homepage rebuilt: hero CTAs (View projects / Contact me / GitHub), an
  accessible alternative-access grid under the map, a "Featured projects"
  section (Liflow, InfraLens), and a synthesized profile section.
- `prefers-reduced-motion` now respected site-wide via a single
  `MotionConfig` wrapper.

## [0.7.2] — 2026-08-08

### Added

- **Explicit primary navigation** (desktop + mobile header) — the site
  previously had none beyond the interactive map and a per-page "back"
  link.
- Dedicated `/contact` route (the contact form previously only lived inside
  `/about`) and `/tools` route.

### Changed

- `/apps` and `/seo` removed (redirected); `/background` merged into
  `/about`; `/blog` renamed to `/articles`. The interactive map reduced from
  7 to 5 zones to match.
- Permanent redirects added for every removed/renamed route.

## [0.7.1] — 2026-08-07

### Added

- Source-of-truth planning documents for the portfolio redesign and visual
  system, and a Phase 0 baseline audit (routes, components, content,
  Lighthouse, broken-link check) establishing the starting point for the
  redesign that follows in this changelog.

### Changed

- Homepage H1/tagline stabilized to one version instead of being randomly
  selected per request server-side; `force-dynamic` removed (`/` is static
  again).
- Lab Zone reduced from 5 to 3 entries, keeping only demonstrable work.

## [0.6.3] — 2026-08-06

### Security

- **CRLF injection in the contact form** — `name` was interpolated
  unfiltered into the outgoing email subject, allowing arbitrary header
  injection via `\r\n`. Fixed with a control-character filter.

### Added

- Unit tests (Vitest) and E2E tests (Playwright) introduced for the first
  time (10 + 9 tests), wired into a new CI workflow (lint/typecheck/test/
  build in parallel, then e2e).

## [0.6.2] — 2026-08-02

### Added

- Two new Lab entries ("SaaS boilerplate — Convex", "Mobile boilerplate —
  Expo & Convex"); a fourth Open Graph tile ("Mobile apps").
- `portfolio-audit` maintenance skill.

### Changed

- Liflow status updated to "Available" (public launch); Lab entries sorted
  by maturity instead of creation order.

### Fixed

- `metadataBase` missing from root metadata — Next.js fell back to
  `localhost:3000` for OG/Twitter image resolution in production, breaking
  social link previews.

## [0.5.6] — 2026-05-16

### Changed

- Liflow's description, feature cards, and metadata rewritten across the
  site to reflect its real product (family memories, Daily Memory, AI
  narratives) instead of an earlier positioning.

### Fixed

- LCP warning on the blog listing's first image; a cropping bug in the PWA
  icons on the Samsung launcher.

## [0.5.5] — 2026-04-20

### Removed

- Unreferenced `AGENTS.md` and `PROJECT.md`; duplicate `package-lock.json`
  (project is pnpm-only).

## [0.5.4] — 2026-04-06

### Fixed

- PWA orientation lock removed (`portrait-primary` → `any`), which had
  prevented landscape use.

## [0.5.3] — 2026-04-03

### Fixed

- **Contact form silently failed to send email** — the Resend SDK returns
  `{ error }` instead of throwing, and the return value wasn't checked. Also
  corrected the `from` address to a verified domain, required to send to
  external recipients.

## [0.5.2] — 2026-04-01

### Added

- Service worker (cache-first) enabling standalone WebAPK installation on
  Android; iOS `appleWebApp` support and `viewport.themeColor`.

### Fixed

- PWA icon mask forcing an unwanted circular crop on Android.

## [0.5.1] — 2026-03-29

### Security

- HTTP security headers added site-wide (`X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`);
  `X-Powered-By` removed; `security.txt` added.

### Changed

- Repo renamed `randy-world` → `randy-code` across all metadata.

## [0.5.0] — 2026-03-27

### Added

- `robots.ts`; JSON-LD `Person` and `Article` schemas; Twitter Cards.

### Changed

- World map connections rebuilt: animated dashes replaced with static
  lightning-bolt paths, synchronized with card entrance animation.

### Fixed

- Hydration mismatch on the map's connection paths (client-only dimensions
  now resolved via `ResizeObserver` before rendering).

## [0.4.0] — 2026-03-26

### Added

- PWA support: manifest, generated icon set, `app/icon.png`/
  `app/apple-icon.png`.

## [0.3.0] — 2026-03-26

### Added

- Background zone/page (professional background as a product advantage);
  `app/sitemap.ts`; branded 404 page.

### Changed

- World map redesigned: 7 zones in a regular ellipse, all hub-connected,
  inter-zone connections removed in favor of a pure hub model.

## [0.2.0] — 2026-03-25

### Added

- Dynamic Open Graph image; blog listing + article template; 6 real articles
  with SEO-optimized titles and computed reading time, one file per post
  under `content/posts/`.

### Changed

- World map connection rendering rebuilt with `ResizeObserver`-based pixel
  positioning, replacing an `preserveAspectRatio="none"` approach that
  produced uneven dashes.

### Removed

- Default Vercel boilerplate SVGs and placeholder blog articles.

## [0.1.0] — 2026-03-24

### Added

- Initial release: interactive world map with 6 zones, 5 zone pages,
  rotating hero text, contact form (Resend), hub-centric SVG connections,
  generic `PageShell` for zone pages.
