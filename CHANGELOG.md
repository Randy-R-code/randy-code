# Changelog

All notable changes to Randy Code are documented here. The format follows a
simplified [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) (Added,
Changed, Fixed, Removed, Security) and the project uses semantic versioning
intentionally rather than mechanically.

InfraLens's history as a standalone product (2026-01-06 to 2026-08-10) is
frozen in [`docs/infralens/CHANGELOG.md`](docs/infralens/CHANGELOG.md).
InfraLens changes since its native migration are recorded here.

## [1.8.0] — 2026-09-05

### Added

- **Open Source section on Projects City** (`/projects`) — new subsection
  listing public repositories and packages, positioned after the main
  projects grid without a new nav entry or competing with the primary
  showcase. First entry: RepoCheckup, a zero-config CLI (`npx repo-checkup`)
  that checks a JS/TypeScript repository's configuration, tooling, testing
  and CI, linking out to GitHub and npm.

## [1.7.4] — 2026-09-02

### Added

- **Vercel Speed Insights** — enabled site-wide via `@vercel/speed-insights`,
  mounted in the root layout next to Web Analytics. Previously reverted in
  v1.7.0 because the Hobby plan only allowed it free on one project;
  Vercel removed that per-project cap, so it now ships alongside Web
  Analytics. `/privacy` updated to disclose the new data collected.

## [1.7.3] — 2026-08-26

### Added

- **Organization JSON-LD** — mounted site-wide alongside the existing Person
  schema, linked via `founder`, with `sameAs` pointing to GitHub.
- **`/llms.txt`** — machine-readable index of tools, projects and articles,
  generated from the same data sources as the sitemap so it never goes
  stale.

Prompted by a third-party AI-agent readiness scan of randy-code.dev — most
of its checklist (OpenAPI spec, public API, CLI, developer portal) doesn't
apply to a portfolio site, but these two structured-data/discoverability
gaps were genuine.

## [1.7.2] — 2026-08-20

### Fixed

- **InfraLens's remaining blue accents repainted green** — the
  `brand-secondary` token (hero kicker text, category icon badges, history
  hover states, recommendation links, compare drag-over highlight) was
  still aliased to InfraLens's original blue; repointed to a lighter green
  tier so every decorative accent matches its actual green identity. The
  semantic blue used for "Info" status badges and the compare page's
  "Added" diff category is unchanged.
- **Compare reports wasn't discoverable before running a scan** — added
  next to GitHub/Docs/Privacy/License in InfraLens's hero; previously only
  reachable from the report header after an analysis.
- **About page's two non-tool icons no longer share the tools collection's
  wrench** — "Produit-first" and "Mécanique" now use distinct icons
  (`Target`, `Gauge`).
- **Tool pages showed a generic "Developer Tool" label instead of their
  real category** — Cron Builder, JSON Studio, API Studio and MetaLens's
  page header and social-share image now read their actual category
  ("Web & API" or "Developer Utilities") from the same source already
  used on `/tools`.

## [1.7.1] — 2026-08-20

### Changed

- **"Mon parcours" section repositioned and restyled** — moved from the
  page bottom (plain paragraph) to right under the hero, styled as a card
  matching the "Outils développeur" section. Border and button switched to
  a neutral treatment instead of a zone color, since it's a personal
  statement rather than zone-coded content — mirrors the final CTA.
- Lab Zone boilerplates status updated from "En cours" to "Réutilisé
  activement" (badge color aligned with "Usage quotidien") — reflects
  their actual stable, actively-reused state rather than an in-progress
  one.

### Fixed

- Sitemap missing `/privacy` (added in v1.7.0) — now indexed.
- Homepage secondary buttons ("Mon parcours en détail", "Explorer les
  outils") stretched full-width on mobile, a latent default
  `align-items: stretch` behavior in their column layout; now sized to
  content at every breakpoint.

## [1.7.0] — 2026-08-19

### Added

- **Vercel Web Analytics** — enabled site-wide via the official
  `@vercel/analytics` package, mounted once in the root layout.
- **Privacy page** (`/privacy`) — non-professional publisher notice,
  hosting disclosure, and RGPD data-processing coverage for the contact
  form (Resend), anti-abuse rate limiting (Upstash, IP used only as an
  ephemeral key), and Web Analytics. Linked from the footer.

## [1.6.7] — 2026-08-19

### Added

- **Tools collection visible from Home** — a compact "Outils développeur"
  section links to all 5 tools (InfraLens, API Studio, MetaLens, JSON
  Studio, Cron Builder) without competing with the existing Projects
  showcase.

### Changed

- **InfraLens styled consistently as a dual project/tool** — its cards on
  Home and `/projects`, and its case study page, now use its
  tools-collection green identity (with a wrench badge) instead of the
  generic Projects blue.
- Home hero title harmonized to "Développeur fullstack TypeScript"
  everywhere.

### Fixed

- **Stale product copy corrected across About, InfraLens's case study,
  InfraLens's contributor docs, and API Studio** — outdated project
  lists, the old (pre-redesign) InfraLens scoring weights, the
  pre-Upstash rate-limiting description, a stale SSRF file path, and an
  absolute "safe" security claim on API Studio.

## [1.6.6] — 2026-08-18

### Fixed

- **InfraLens 404 page and privacy disclosure accuracy** — the 404 page
  no longer shows a redundant "back to tools" link above its own CTA,
  and that CTA now renders in InfraLens's actual green identity color
  instead of blue. The privacy page's rate-limiting section now reflects
  the real Upstash-backed policy (5 requests/minute, 30/hour, an external
  store) instead of the pre-migration in-memory description, and
  discloses Upstash as a second third-party service that receives the
  visitor's IP.

## [1.6.5] — 2026-08-18

### Added

- **API Studio first-use and history polish** — a "Load example" request
  populates the builder without sending anything; a Clear action resets
  the response panel; Params/Headers/History now have clearer, distinct
  empty states; and an empty URL no longer produces an invalid `fetch("")`
  snippet in the generated code.

### Changed

- Wording no longer implies API Studio runs without a backend — it now
  credits the secured outbound proxy it actually goes through.

## [1.6.4] — 2026-08-18

### Fixed

- **MetaLens finding severity accuracy** — malformed canonical URLs now get
  their own "Invalid" severity instead of sharing "Check" with `noindex`.
  Missing `twitter:site`/`twitter:creator` and an absent robots meta tag
  are now informational rather than unflagged, and `nofollow` is now
  detected as a targeted check. Preview copy no longer claims to show
  exactly how a page will render in search results or social shares.

## [1.6.3] — 2026-08-18

### Added

- **Cron Builder trust clarifications** — a note next to "Next runs" now
  states that cron expressions carry no timezone information of their own.
  A contextual warning appears when Day of month and Day of week are both
  restricted at once, since their combined (OR) semantics can differ
  between cron implementations.

## [1.6.2] — 2026-08-18

### Changed

- **JSON Studio toolbar cleanup** — removed the `Validate` button: it only
  pulsed the status indicator that's already shown at all times, with no
  additional information of its own. Hero tagline reordered to "Format,
  validate and explore JSON instantly." to match the tool's actual workflow.

## [1.6.1] — 2026-08-18

### Fixed

- **"Retour à la carte" back-link was misleading on mobile** — the
  homepage's `WorldMap` only renders at `md:` and up; below that it falls
  back to a plain zone list, so the label referenced something that
  wasn't there. Now reads "Retour à l'accueil" on mobile, on both
  `PageShell` (`/tools`, `/about`, `/projects`, `/lab`, `/contact`) and
  the standalone 404 page. Desktop keeps "Retour à la carte" — the map is
  real there.
- **404 page content crowded against the header and footer on mobile** —
  used `flex-1` to center within whatever space was left after the site
  header/footer, which on a page with this many footer nav columns left
  almost no room. Switched to `min-h-screen`, matching the same fix
  already used by InfraLens's own 404 page.

## [1.6.0] — 2026-08-18

### Added

- **API Studio Webhooks** — a second mode alongside Request: generate a
  temporary, high-entropy endpoint (24h lifetime, up to 50 retained events)
  and inspect real inbound traffic sent to it — method, query, headers and
  body, captured as-sent. A lightweight ~2.5s poll drives the live event
  list rather than a persistent connection — this deployment has no
  `maxDuration` configured, so SSE would be at the mercy of the default
  serverless function timeout. Ingestion is rate-limited per endpoint token
  rather than by client IP (inbound traffic is intentionally public and
  bursty), and endpoint creation is separately rate-limited per IP. Replay
  seeds a captured event straight into the existing Request builder and
  sends it through the same secured outbound proxy — no second, weaker
  request path.

### Fixed

- **Focus ring/primary color inconsistent across the tool family** —
  MetaLens, JSON Studio, Cron Builder and API Studio rendered the
  portfolio's default blue on shared inputs/buttons instead of InfraLens's
  green identity, because the scoping that provided it lived only in
  InfraLens's own layout. Moved into the shared `ToolPageShell` so every
  tool under `/tools` gets it consistently.

## [1.5.0] — 2026-08-17

### Added

- **API Studio** (`/tools/api-studio`) — a new developer tool for building,
  sending, and inspecting HTTP requests directly from the browser: method,
  URL, query params, headers, Bearer/Basic auth, and a JSON/text/URL-encoded
  body, sent through a secured backend proxy (`POST /api/api-studio/request`)
  that reuses InfraLens's SSRF/DNS/redirect validation stack untouched
  rather than duplicating it. Responses show status, timing, size, headers,
  and a formatted/raw body; requests are saved to a local IndexedDB history
  (reopen/resend/delete/clear, capped at 100 entries) and can be exported as
  ready-to-use `fetch` or `curl` code. Gated by its own rate-limit policy
  and a per-client concurrency cap, both enforced before any outbound
  attempt. `/tools` is now grouped into Web & API / Developer Utilities
  categories to make room for it; the footer's tool list follows the same
  order.

### Changed

- **Rate limiting moved off the in-memory limiter** — InfraLens and MetaLens
  now share a distributed, Upstash-backed rate-limit module
  (`src/lib/rate-limit`) instead of a process-local `Map`, which gave every
  serverless instance its own independent counter and reset on cold start.
  Each tool keeps its own quota bucket; InfraLens's policy relaxes from 1
  request/30s to 5/min + 30/h. The shared client-identifier helper also
  drops `cf-connecting-ip` from the trusted header chain — this deployment
  has no Cloudflare in front of it, so that header was accepted without
  ever being sanitized.

### Security

- **Contact form** had no abuse protection at all — now rate-limited
  (3 submissions/15min + 10/24h before the email is sent), plus a
  honeypot field, a minimum form-fill-time check, and server-side max
  field lengths.

## [1.4.4] — 2026-08-16

### Fixed

- **MetaLens mobile overflow** — long, unbreakable text (a raw malformed
  canonical URL surfaced in a finding, plus default grid-item sizing on the
  Search and Social preview cards) could force the whole page to scroll
  horizontally on mobile instead of staying contained within the result
  cards.
- **Social preview images blocked by CSP** — `img-src` only allowed
  `'self'` and `data:`, so no analyzed page's Open Graph image could ever
  load; widened to `https:`, consistent with the http(s)-only gate already
  enforced before an image URL is rendered.
- **Service worker blocked cross-origin fetches** — `public/sw.js`
  intercepted every GET request regardless of origin and re-issued it via
  `fetch()`, which is subject to `connect-src 'self'`; now scoped to
  same-origin requests only, so cross-origin resources bypass the service
  worker and follow normal browser/CSP rules.
- **Footer logo** — the R symbol's bounding-box center sat measurably
  (~32px on the 1000px source) right of the "RANDY CODE" wordmark's, an
  artifact of the letter's diagonal leg; recentered so both align on the
  same axis.

### Changed

- **"Fullstack" capitalization unified to lowercase** across metadata,
  Open Graph images and structured data, matching the About page and
  footer.

## [1.4.3] — 2026-08-16

### Fixed

- **Tool card icons** — Cron Builder, JSON Studio and MetaLens now show
  their existing Lucide icon in the same slot, size and alignment
  InfraLens's logo occupies, instead of no visual identifier at all.
- **`Résultat` label on the Projects page** recolored to the same blue
  accent used by the page's other structural labels, replacing an
  inconsistent green.
- **Project card title alignment on desktop** — a variable number of tech
  tags per project pushed each card's title down by a different amount at
  the 3-column breakpoint. The tag row now reserves consistent height so
  titles line up across a row.

## [1.4.2] — 2026-08-16

### Added

- **Footer "Outils" column**, linking to all four tools (InfraLens, Cron
  Builder, JSON Studio, MetaLens), sourced from the same list `/tools`
  itself renders from.

### Changed

- **Card-grid spacing on mobile** — every portfolio section with a card
  grid or list (home, tools, projects, articles, about ×2, lab, a project
  case study) used the same gap at every viewport; each now starts tighter
  on mobile and opens back up to its original spacing once the layout
  switches to multiple columns.

### Fixed

- **Footer nav columns collapsed to the left at the `sm` breakpoint**,
  leaving roughly half the footer empty — the columns switched to a flex
  row before the section around them did, and flex items don't stretch to
  fill unclaimed space. Replaced with a grid (2 columns on mobile, pairing
  Explorer+Site and Outils+Liens; 4 across from `sm` up), which spreads
  across the full width by construction.

## [1.4.1] — 2026-08-16

### Added

- **Cron Builder, JSON Studio and MetaLens OG cards** now show a
  representative preview of the tool's actual output — a real cron
  schedule with its next runs, a syntax-colored JSON snippet matching the
  tree viewer's real type colors, and a search-preview mockup — instead of
  a generic title/tagline card, via a new optional `preview` slot on the
  shared tool OG renderer. InfraLens keeps its own standalone report-style
  OG card.
- **About sections** on Cron Builder, JSON Studio and MetaLens — a compact
  what/how/why explainer below each tool, reusing the "Ma méthode" card
  pattern from `app/about` rather than inventing new documentation chrome.
  InfraLens keeps its own larger editorial content.

### Changed

- **InfraLens's landing "Example report" and OG card** now show a real
  snapshot of `randy-code.dev` (94/100, grade A, full 20-check breakdown)
  instead of a synthetic `example.com` mock — captured from a live scan, so
  the score and every category total are derived by the real scoring
  engine rather than hand-picked.
- **Cron Builder, JSON Studio and MetaLens's cards** (including the new
  About sections) now use InfraLens's own `border-border bg-card/50`
  treatment instead of a solid `surface-2` background — same base color,
  but InfraLens blends it at 50% opacity; the newer tools had drifted into
  a visibly bluer, more saturated look.
- **InfraLens and MetaLens's URL inputs** now share the same treatment: a
  permanent green-tinted border, a green focus ring, a search icon inside
  the field, and matching "Analyze"/"Analyze website" buttons. InfraLens's
  input previously focused blue, inconsistent with its own green accent
  everywhere else on the page.
- **`/tools` listing** now shows two tools per row on desktop (single
  column preserved on mobile) — the four cards had room to spare at their
  current description length.

### Fixed

- **Tool pages were narrower than the rest of the portfolio** (`max-w-4xl`
  vs `max-w-5xl`) and their "Retour aux outils" link didn't align with the
  portfolio's "Retour à la carte" link. Both now match `PageShell`'s width
  and back-link position exactly.

## [1.4.0] — 2026-08-15

### Added

- **MetaLens** (`/tools/metalens`) — a new developer tool for inspecting a
  public page's metadata: title, meta description, canonical, robots
  directives, viewport, document language, hreflang, Open Graph, Twitter/X
  cards, favicons/manifest, plus indicative search and social previews and
  targeted findings (missing/duplicate tags, `noindex`, length guidance,
  URL inconsistencies — no global SEO score). Metadata is fetched
  server-side through InfraLens's existing SSRF-hardened stack (DNS
  resolution + IP-range blocking, redirect revalidation on every hop,
  response size and timeout limits, no cookies/auth forwarding) reused
  as-is rather than duplicated, with its own rate-limit bucket and
  User-Agent. HTML is parsed once with `node-html-parser` — the only new
  dependency — and metadata URLs only become clickable links after a
  safe-scheme check (`http`/`https` only). Nothing is stored: no account,
  no scan history, no crawling beyond the requested page and its
  redirects.

## [1.3.0] — 2026-08-15

### Added

- **JSON Studio** (`/tools/json-studio`) — a new developer tool for
  formatting, validating, minifying, and exploring JSON directly in
  the browser. A large editor stays in sync with a live-computed
  validity status, a compact stats line (root type, key count, depth,
  byte size), and a collapsible tree viewer with Expand/Collapse all.
  Also supports loading a local `.json` file (drag-and-drop or file
  picker), downloading the formatted result, a bundled example, and
  content persisted to `localStorage` across visits. Parsing,
  formatting, and statistics are built entirely on native `JSON.parse`/
  `JSON.stringify` — no editor or JSON dependency was added. Everything
  runs client-side; JSON content never leaves the browser.

## [1.2.1] — 2026-08-15

### Fixed

- Cron Builder's "Next runs" dates rendered in the visitor's browser
  locale (e.g. French on a French system) instead of the tool's
  English-only UI — the formatter now forces `en-US` regardless of the
  visitor's locale.
- Cron Builder's back link pointed at the homepage map instead of
  `/tools`, and its decorative background let the homepage's grid/glow
  show through instead of the flat, opaque background every other tool
  uses.
- InfraLens's card backgrounds (`bg-background/50`) used the page's own
  background color instead of the elevated `--card` token, making them
  blend into the page instead of standing out — fixed across the
  landing sections, the entire scan-results display (report header,
  category/check cards, priority summary, recommendations, the score
  dialog), and the compare/docs/privacy pages. Only the "example
  report" preview card used the correct token before this.
- A resulting color-contrast regression (`text-zinc-500` on Cron
  Builder's now-lighter card backgrounds fell under the WCAG AA 4.5:1
  minimum) caught by the axe accessibility check and fixed to
  `text-zinc-400`.

### Changed

- Extracted `ToolPageShell`/`ToolHeader` (`src/components/layout/`) as
  the shared chrome for every tool under `/tools` — opaque background,
  "back to tools" link, and a common `max-w-4xl` content width — and
  moved both InfraLens's layout and Cron Builder onto it, so their back
  links and content now line up pixel-for-pixel instead of each tool
  drifting on its own width.
- Cron Builder's Range-mode picker for labeled fields (Day of week,
  Month) replaced native `<select>` elements with the same pill-button
  style used everywhere else in the tool, for visual consistency and
  more uniform touch targets.

## [1.2.0] — 2026-08-15

### Added

- **Cron Builder** (`/tools/cron-builder`) — a new developer tool for
  building, validating, and understanding standard Unix 5-field cron
  expressions. A visual per-field editor (Every/Specific/Range/Interval
  modes) stays in sync with a raw expression input, backed by a
  deterministic human-readable description, the next 5 execution times
  previewed in the browser's detected timezone, and 8 common presets.
  Parsing, validation, and next-run calculation are hand-rolled rather
  than pulled from a cron library — every version of `cron-parser`
  mandates `luxon` as a dependency, and hand-rolling keeps the tool's
  supported syntax (wildcards, lists, ranges, steps — no seconds/year/
  Quartz extensions) strictly under our own control instead of a
  general-purpose parser's.

### Changed

- `/tools` now renders its cards from a small typed registry
  (`src/lib/tools.ts`) instead of one hard-coded card, so the next
  lightweight tool (JSON Studio, MetaLens) is a registry entry, not
  copy-pasted markup.

## [1.1.0] — 2026-08-15

### Added

- InfraLens: DKIM and DNSSEC are now their own checks, separate from
  DNS Security (SPF/DMARC) — neither can reach a confirmed pass/warning/
  fail the way SPF/DMARC can, so they're scored as genuinely
  `inconclusive` rather than folded into one opaque status. 20 checks
  total, up from 18.

### Changed

- InfraLens's scoring engine rebuilt around per-check point weights
  summing to 100, instead of fixed category budgets — a category's
  score is now the sum of its checks' weights.
- InfraLens's landing page example and Open Graph card now derive their
  numbers from the real scoring engine instead of independently
  hand-typed values that had drifted apart.

### Fixed

- InfraLens's Infrastructure category always showed a hardcoded `0/20`
  (its only check, WAF detection, is informational) — now correctly
  shows as "Info".
- A DMARC policy set to monitor-only (`p=none`) used to score a plain
  pass alongside a present SPF record — now correctly scores as a
  warning.
- The InfraLens Open Graph card's preview image pointed at a
  per-deployment Vercel URL instead of `randy-code.dev`, breaking link
  previews after new deployments.

### Security

- `randy-code.dev` now publishes `v=spf1 -all` at the domain root —
  mail is sent only from a delegated subdomain, never the root
  directly, so this closes a spoofing gap InfraLens's scanner had
  flagged (as a false "SPF missing" finding, since it only checks the
  root domain).

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
