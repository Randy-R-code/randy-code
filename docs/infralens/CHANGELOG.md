# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.4.1] - 2026-08-10

### Fixed

- **Infinite redirect loop on `infralens.dev` and `randy-code.dev/tools/infralens`**, live in production right after 2.4.0 shipped. The `infralens.dev` → `randy-code.dev/tools/infralens` redirect matched on `Host: infralens.dev` for every path with no exception — including `randy-code.dev`'s own server-to-server rewrite request to `infralens.dev/tools/infralens`, which carries that same `Host` header. That request got redirected straight back to `randy-code.dev/tools/infralens`, which triggered the same rewrite again, forever. The redirect's `source` pattern now excludes `/tools/infralens` itself, so the one path that's supposed to actually resolve there does.

## [2.4.0] - 2026-08-10

### Changed

- **InfraLens is now embeddable under `/tools/infralens`** — `basePath` set in `next.config.ts` for integration into the Randy Code portfolio (`randy-code.dev/tools/infralens`), alongside a `serverActions.allowedOrigins` allowance for `randy-code.dev` (Server Actions reject cross-origin requests by default, which a proxied origin would otherwise fail) and a redirect sending `infralens.dev` traffic to `https://randy-code.dev/tools/infralens` instead of 404ing at its own root once the basePath took effect. `public/manifest.json` and the root layout's manifest/favicon links are now prefixed to match — Next's `basePath` doesn't rewrite raw string paths in the Metadata API or in files served from `public/`. The service worker registration is skipped while running under the prefix, since it isn't scoped to safely coexist with the portfolio site's own service worker.
- **E2E suite and Playwright config** updated for the new basePath — every `page.goto()` call and the dev-server readiness check now target `/tools/infralens/...` instead of the old root-relative paths.
- **README** — local dev/self-hosting instructions now point at `http://localhost:3000/tools/infralens`, matching the new basePath.

## [2.3.0] - 2026-08-09

### Added

- **`/compare`** — the local report comparator (master plan §32 Phase 16): import two InfraLens JSON exports, see the score and category deltas and every check that improved, regressed, or otherwise changed, and export the diff as Markdown. Entirely client-side — no network request, no server persistence. A malformed or non-InfraLens file is rejected per slot with a clear message; reports exported by an incompatible major schema version are refused with an explanation instead of being silently compared.
- Linked from the report header (next to the existing export buttons) and documented on `/docs`.

### Changed

- The landing page's "example report" preview and the Open Graph card now reuse the real report's exact Pass/Warning badge styling for their sample checks, and no longer show a category progress bar — the real one is 6px tall and easy to miss entirely, so a wide colored bar there was overstating how prominent that element actually is.
- Removed the unused `xs:` custom breakpoint and a leftover literal `@custom-media` rule from `globals.css` that Turbopack couldn't parse (a harmless but noisy "Unknown at rule" warning on every request); usages switched to the arbitrary-value `min-[26.25rem]:` syntax, same effective breakpoint.

## [2.2.0] - 2026-08-09

### Added

- **End-to-end test suite** (Playwright, `e2e/`, `pnpm e2e`) — a real analysis journey against a live target, landing-page navigation, and automated accessibility scans (`@axe-core/playwright`) on `/`, `/docs`, and `/privacy`, each run against both a desktop and a mobile (iPhone) viewport. Wired into CI as its own job (non-blocking — it hits real network by design, so transient conditions on the runner shouldn't be able to block a merge the way a real regression should).

### Fixed

- **The "Try: example.com" quick-example chips, and typing a bare hostname directly, silently failed to submit** — the URL field's native `type="url"` browser validation requires a full URL with a scheme, but the chips filled in a bare hostname and `handleSubmit`'s own normalization (`example.com` → `https://example.com`) never got the chance to run, since the browser blocked the form submission before any JavaScript executed. No error was shown; clicking "Analyze website" simply did nothing. Fixed by having the chips fill a full URL and switching both URL inputs to `type="text" inputMode="url"`, which keeps the URL-optimized mobile keyboard without the conflicting native constraint — the app's own validation and error messaging now handle every case consistently.
- **Text contrast below WCAG AA** across the footer, report header, check detail cards, category sections, and several other places using `text-zinc-500`/`text-zinc-600` on the dark background (as low as 2.29:1 against a 4.5:1 requirement) — found by an automated accessibility scan, not previously caught. Raised to `text-zinc-400` throughout; icon-only uses of the same classes were left as-is (not subject to the text contrast rule).
- **55 known dependency vulnerabilities** (`pnpm audit`), the large majority from an outdated `next` (16.2.2 → 16.3.0, which also pulled several transitive tooling dependencies — `brace-expansion`, `minimatch`, `js-yaml`, `picomatch`, `postcss` — up to patched versions) plus `nanoid` and in-range updates to Radix UI, `lucide-react`, and Tailwind CSS. `pnpm audit` now reports zero known vulnerabilities.

## [2.1.1] - 2026-08-09

### Added

- **CONTRIBUTING.md** — setup, the project's non-negotiables (no SaaS drift, passive analysis only, SSRF protection never bypassable), and how to add a new check.
- **SECURITY.md** — supported versions, private vulnerability reporting via GitHub Security Advisories, and explicit in/out of scope.
- **GitHub issue and PR templates** (`.github/`) — structured bug report and feature request forms, a config pointing security reports to private reporting instead of a public issue, and a PR checklist matching what this project already enforces on itself.

### Changed

- **README.md rewritten** to match the app's current state — it still described the pre-rebrand product (Node 20+, old OK/Warning/Error status model, grade labels the project deliberately dropped, deleted/renamed files). Now includes real screenshots, a self-hosting section, and an architecture diagram.

### Fixed

- **"2 checksabove" spacing** in the results priority summary — a multi-line JSX text node was swallowing the space after an interpolated value; now renders correctly as "2 checks above."

## [2.1.0] - 2026-08-09

### Added

- **Privacy page** (`/privacy`) — explains exactly what's sent when you run an analysis and why, that your IP is used for per-IP rate limiting (with the current in-memory, unhashed, 30-second-TTL implementation stated plainly, including its known limitation), the one third-party service contacted (ipapi.co, only for the analyzed site's IP, never yours), what's cached locally and how to delete it, and that the analyzed site sees InfraLens's requests in its own logs. Linked from the footer.
- **Honest offline screen** (`public/offline.html`) — replaces a dead-code cache fallback that could never actually resolve (nothing ever wrote a navigation response to the cache) with a real, on-brand "you're offline" page that states nothing is analyzed or cached while offline, instead of falling through to the browser's generic network-error page.
- **Versioned local history format** (`src/lib/history/`) — history stored in `localStorage` now carries a schema version; a missing or mismatched version (including the pre-2.1.0 unversioned format) is treated as incompatible and reset cleanly rather than risking a half-parsed shape reaching the UI.

### Changed

- **Service worker** (`public/sw.js`, cache `v4`) — clarified, with a matching regression test (`src/lib/pwa/sw.test.ts` executes the real service worker in a sandbox), that Server Actions and any other non-GET request are never intercepted, so no analysis result can ever be written to the cache.

## [2.0.0] - 2026-08-09

### Changed

- **New visual identity** — replaced the placeholder logo and icon set with the final InfraLens brand assets (`public/brand/`): favicons, the 404 page, the Open Graph card, the hero, and the footer all now use the real logo instead of the hand-drawn magnifying-glass/circle placeholder.
- **Rebalanced accent color usage** — brand green (`--infralens-accent`) is now reserved for genuine pass/success signal, matching `INFRALENS_BRANDING_PLAN.md` §3's own rule; decorative and secondary UI (primary buttons, focus rings, links, category score bars, icon badges) moved to the blue secondary accent, applied as a restrained tint rather than a solid fill.
- **Landing page rewritten** (master plan §6) — new hero copy and layout, clickable quick-fill examples that populate the field without auto-submitting, a labeled "example report" preview section showing what a real report looks like without running one, and an open-source value section (MIT license, modular architecture, self-hostable, contributions welcome) with a GitHub link that isn't hidden only in the footer. The redundant "why InfraLens" bullet list was removed as fully covered by the new hero reassurance line and open-source section.
- **Footer rebuilt** (master plan §28) — full brand lockup and tagline, documentation/GitHub/license links, a faint full-width wordmark watermark that fades toward the bottom edge, and a subtle "an open-source tool by Randy Code" attribution link.
- **Open Graph card synced to the new report visual** — replaced the old flat pass/warn/fail check list with the same category-score-bar shape and the exact example data used by the new landing preview section, so the two surfaces never show a differently-shaped "example."
- **`src/config/site-config.ts`** — centralizes the product name, parent brand, canonical URL, and repository/license URLs instead of scattering them across components.

### Removed

- Unused screenshot assets (`public/screenshot-desktop.png`, `public/screenshot-mobile.png`) and dead favicon files (`favicon-16x16.png`, `favicon-32x32.png`).

## [1.9.0] - 2026-08-09

### Added

- **Redesigned results page** — new report header (favicon, hostname, final URL, real analysis timestamp, duration, score, copy/export actions), a priority summary showing up to 3 positives and 3 priorities at a glance without opening any card, checks grouped into per-category accordion sections (local score, pass/warning/fail counts, accessible progress bar), and a status filter bar (All/Needs attention/Passed/Informational/Unavailable) with per-category quick navigation.
- **Progressive disclosure on every check card** — a generic renderer (`src/components/results/render-value.tsx`) now shows evidence, raw data, limitations, and the nested recommendation for any check, not just `headers` (previously the only one with a hand-written detail view; the other 17 showed only a title/status/summary).
- **Markdown report export** alongside the existing JSON export, plus copy buttons for the hostname, the report summary, and each check's value — all client-side, no new heavy dependency.
- **Client-side cancel button** during analysis — stops waiting and resets the UI immediately; the in-flight server computation isn't interrupted, its result is just discarded when it resolves (documented limitation, not a real server-side abort).
- **`ChecksResponse.analyzedAt`** — a real ISO timestamp set when the analysis starts, used by the new header instead of a client-render-time guess.
- `@radix-ui/react-accordion` and `@radix-ui/react-collapsible` (same pattern as the existing Dialog/Popover/Tooltip primitives).

### Fixed

- **Category grouping dropping checks** — the new per-category accordion grouped checks strictly by `score.categories`, which is empty for the single-check error response (`parse-error.ts`); that check would have silently disappeared from the UI. Fixed by deriving the grouping from the checks actually present instead, with a regression test covering exactly this case.

## [1.8.0] - 2026-08-09

### Added

- **Graduated stack detection** — the Technology Stack check now labels every finding `confirmed` (an infrastructure header, not spoofable by page content), `likely` (a distinctive structural fingerprint), or `possible` (a single bare keyword match); the check is always informational and never affects the score.
- **robots.txt insight** — now detects a sitewide `Disallow: /` under `User-agent: *` (reported as an indexing signal, never as a vulnerability) and extracts declared `Sitemap:` URLs.
- **Sitemap discovery via robots.txt** — the Sitemap check now tries the URL declared in robots.txt before falling back to `/sitemap.xml` and `/sitemap_index.xml`, capped at 3 locations total and never recursing into a sitemap index's child sitemaps.
- **Reachability Snapshot** (`src/lib/checks/checks/reachability.ts`) — renamed from "Uptime Snapshot" to make explicit what it actually measures: a single point-in-time reachability check, not historical uptime monitoring.
- **Real DNS timing + Cache-Control in Performance Signals** — the DNS lookup duration from the shared collection step and the response's `Cache-Control` header are now reported; connection-time and TTFB are explicitly documented as not separately measurable through `fetch()` rather than estimated.
- **`src/lib/checks/cdn-fingerprints.ts`** — the CDN header-fingerprint table is now shared between the WAF/CDN check and the Technology Stack check instead of being defined twice.

### Changed

- **Accessibility Hints** — now always states explicitly that it's a lightweight static check, not a complete accessibility audit.

### Fixed

- **Server Headers false positive** — the `Server` header was in a generic "suspicious headers" list, so its mere presence (true for nearly every response) triggered a false information-leak warning regardless of value. Confirmed live: `example.com` (`Server: cloudflare`) and `github.com` (`Server: github.com`) were both incorrectly warned on; now only a value that actually discloses a version number (e.g. `nginx/1.18.0`) triggers the warning.

## [1.7.0] - 2026-08-09

### Added

- **CAA records** (`src/lib/dns/dns-client.ts`'s `resolveCAA`) — the DNS Records check now reports Certificate Authority Authorization records as evidence; absence is the common default and is never treated as a problem.
- **SPF/DMARC review** — the DNS Security check now flags multiple SPF TXT records as invalid (RFC 7208 allows only one) and extracts/reports the DMARC policy (`p=none`/`quarantine`/`reject`), with `p=none` surfaced as a weaker-enforcement recommendation without treating DMARC as missing.
- **ipapi.co response caching** (`IP_INFO_CACHE_TTL_MS`, 15 min) — hosting/ASN lookups for a given IP are now cached across analyses instead of re-querying the third-party API every time.

### Changed

- **DKIM interpretation** — the DNS Security check no longer concludes DKIM is "missing" when none of a handful of common selector names (default/google/selector1/selector2) resolve; DKIM selectors are chosen by whoever configured the domain's mail and aren't discoverable, so a miss is now reported as inconclusive ("not found at common selectors") with an `info`-severity recommendation, and never affects the check's pass/warning status on its own.
- **DNSSEC** — now explicitly reported as `"not-evaluated"` (Node's built-in DNS resolver has no DS/DNSKEY/RRSIG support) instead of being silently absent from the check's data despite being documented as checked.
- **WAF/CDN detection wording** — reworded from declarative ("WAF/CDN detected: X") to probabilistic ("response headers suggest X may be in front of this site"); the check's status is now always `info` and never contributes to the score, since header-fingerprint detection can't confirm presence or meaningfully penalize absence.

### Fixed

- **WAF false positive** — a bug in the header-fingerprint table treated the mere presence of any `Server` header (true for nearly every HTTP response, regardless of its value) as a Cloudflare detection. Confirmed live: a site with no actual CDN/WAF fingerprint (e.g. github.com) was previously misreported as "WAF/CDN detected: Cloudflare"; now correctly reported as no fingerprint found.

## [1.6.0] - 2026-08-09

### Added

- **TLS certificate inspection** (`src/lib/security/inspect-tls.ts`) — a raw TLS handshake now reports the negotiated protocol version, certificate issuer, expiration date, and whether the certificate actually validated; the HTTPS & TLS check surfaces an invalid certificate as a failure and an expiring one (within 30 days) as a warning, both with a dedicated recommendation.
- **Redirect chain enrichment** — each hop in the redirect chain now carries its own HTTP status (`PageSnapshot.redirectChain` is `{url, status}[]` instead of a plain URL list); the redirect check flags a chain that downgrades from HTTPS to HTTP as a failure and surfaces a hostname change between the first hop and the final URL as evidence (informational, not penalized).
- **security.txt expiry validation** — the `Expires` field (RFC 9116) is now parsed and checked: an expired file is a failure, a missing or unparseable one is a warning, with recommendations pointing back to RFC 9116.

### Changed

- **HTTP security headers** — the headers check now analyzes header _values_, not just presence: CSP is flagged as weak if it allows `unsafe-inline`, `unsafe-eval`, or a wildcard source; HSTS is flagged as weak below a 300s `max-age`; Referrer-Policy is flagged as weak on `unsafe-url`; framing protection now accepts a CSP `frame-ancestors` directive as an alternative to `X-Frame-Options`. Added `Permissions-Policy` as a newly-required header. A check now passes only when every finding is present with a safe value, not merely present.
- **`securityHeadersRecommendation`** — now distinguishes missing headers from present-but-weak ones and links to the relevant MDN reference alongside the existing OWASP one.
- All four checks touched in this phase now populate the `limitations` field on their result, documenting known blind spots (heuristic value parsing, best-effort TLS, lenient date parsing).

## [1.5.0] - 2026-08-09

### Added

- **Score explanation** — the "Why this score?" dialog now shows a live breakdown for the current analysis (how many checks counted toward the score vs. were excluded, the strongest category, and the category most worth improving), plus a link to the documentation and a note on what the score can't see.
- **`GlobalScore` summary fields** — `scoredCount`, `excludedCount`, `strongestCategory`, `topPriorityCategory`, computed alongside the existing per-category breakdown.

### Changed

- **Grade wording** — replaced absolute-sounding labels ("Excellent", "Critical") with more cautious ones (e.g. "Strong configuration signals", "Major public configuration issues detected") across the results page and the documentation page, so the A–E grade reads as a visual aid rather than a certification.
- **Documentation page** — the check-status legend now lists all six statuses (`pass`/`warning`/`fail`/`info`/`unavailable`/`error`) instead of the old three, matching what the results page actually shows.
- Documented the reasoning behind each category's scoring weight (`src/lib/checks/scoring-config.ts`) — left unchanged, no concrete reason found to move them.

## [1.4.0] - 2026-08-09

### Added

- **Richer check statuses** — replaced the 3-value status (`ok`/`warning`/`error`) with six (`pass`/`warning`/`fail`/`info`/`unavailable`/`error`): `fail` now means the target is genuinely misconfigured, while `error` is reserved for the check itself failing to run (a network/timeout problem) — the two were previously conflated. `unavailable` covers a result that couldn't be determined for a reason outside the target's control (e.g. the optional IP/ASN lookup's third-party API being down); none of `info`/`unavailable`/`error` affect the score anymore, only `pass`/`warning`/`fail` do.
- **Evidence** — check results can now carry structured, exportable evidence items (`src/lib/checks/types.ts`'s `EvidenceItem`), demonstrated on the headers and IP/hosting checks; items marked sensitive (e.g. the resolved IP) are stripped from JSON exports.
- **Export schema versioning** — bumped to `2.0.0` to reflect the status vocabulary and evidence changes above; added a structural export validator (`src/lib/checks/validate-export.ts`), used in tests today and reserved for the local comparator planned later.

### Fixed

- **`CheckResultCard`** — the status badge now falls back to a neutral, non-alarming style for any status it doesn't recognize (e.g. an older cached history entry), instead of crashing the results page outright.

## [1.3.1] - 2026-08-09

### Changed

- **Analysis pipeline** — the target's main page is now fetched once per analysis instead of once per check: a shared collection step (`src/lib/checks/collect.ts`) fetches the page (following redirects manually, reading the body once) and every check that used to fetch it independently — headers, HTTPS/HSTS, WAF, server headers, uptime, performance, metadata, social tags, tech stack, accessibility, redirect behavior — now reads from that shared result instead. `ip-hosting` and `dns-records` similarly reuse the shared DNS lookup rather than resolving it again.
- **Concurrency and timeouts** — the 18 checks now run through a bounded concurrency pool (`src/lib/concurrency.ts`) instead of an unbounded `Promise.all`, and each check's own timeout now shrinks to fit whatever remains of a new analysis-wide deadline as the analysis progresses.

## [1.3.0] - 2026-08-09

### Added

- **SSRF protections** — every outbound request to a user-supplied target now goes through a centralized validation pipeline (`src/lib/security/`): URL normalization with a strict protocol/credentials/port allowlist, DNS resolution with IP classification (private, loopback, link-local, cloud metadata, and other non-public ranges blocked for both IPv4 and IPv6, including alternate notations), and a pinned connection that closes the gap between DNS validation and the actual network connection. Redirects are followed manually, with every hop independently revalidated — a redirect can never reach a target the initial validation wouldn't have allowed on its own.
- **Response size limits** — response bodies are now capped while streaming instead of buffered without limit.
- Typed, safe-by-default error messages for rejected targets (`src/lib/security/errors.ts`) — a blocked or invalid target now fails fast with one clear message instead of running a full, misleading analysis against it.

### Changed

- Centralized additional network constants (`src/config/constants.ts`): allowed ports, redirect limits, max response size, and a User-Agent string that now includes a contact URL.
- **Dependencies**: added `ip-address` (IPv4/IPv6 classification) and `undici` (pinned outbound connections).

## [1.2.3] - 2026-08-08

### Added

- **`INFRALENS_MASTER_PLAN.md` and `INFRALENS_BRANDING_PLAN.md`** — the product/technical/security and visual-identity roadmap now driving development, worked phase by phase
- **`docs/audit/BASELINE.md`** — Phase 0 baseline audit: architecture inventory, the 18 checks, lint/typecheck/build/test status, and known risks and documentation/code gaps
- **Test suite** — Vitest (`vitest.config.mts`), first unit tests covering scoring, DNS cache TTL, the rate limiter, JSON export, environment validation, and the `headers` check as a mocked-fetch example (25 tests)
- **CI** — `.github/workflows/ci.yml` runs `pnpm check` (lint + typecheck + test + build) on every push/PR to `main`
- **Environment variable validation** — `src/config/env.ts` validates `NEXT_PUBLIC_SITE_URL`, `IPAPI_KEY`, and `VERCEL_URL` once at module load; consumers read the parsed `env` object instead of `process.env` directly
- **Minimal structured logging** — `src/lib/log.ts`, wired into the rate-limit-exceeded path
- **`README.md` Development section** — documents the available `pnpm` scripts and recommends `pnpm check` before opening a PR

### Changed

- **Centralized operational constants** — `src/config/constants.ts` now holds check/DNS timeouts, the DNS cache TTL, the rate-limit window, the redirect cap, the ipapi.co base URL, the analysis User-Agent, and the export schema version; replaces the same values previously hardcoded across `run-checks.ts`, `dns-client.ts`, `dns-cache.ts`, `rate-limit.ts`, `redirects.ts`, `ip-hosting.ts`, and `export.ts`
- **`package.json`** — added `typecheck`, `test`, `test:watch`, and `check` scripts; pinned `packageManager` (`pnpm@10.7.0`) and `engines.node` (`>=22`)

## [1.2.2] - 2026-04-06

### Changed

- **`manifest.json` orientation** — set `"orientation": "any"` to allow the PWA to be used in landscape mode on mobile devices
- **Dependency updates**:
  - `next` + `eslint-config-next` 16.2.1 → 16.2.2
  - `tailwindcss` + `@tailwindcss/postcss` 4.1.18 → 4.2.2
  - `@types/react` 19.2.7 → 19.2.14
  - `@types/node` 22.19.15 → 22.19.17
  - `eslint` 9.39.2 → 9.39.4

---

## [1.2.1] - 2026-04-01

### Added

- **`apple-touch-icon.png`** — added iOS home screen icon to `public/` and to the service worker static asset cache

### Fixed

- **Samsung WebAPK icon shrinkage** — restored `"purpose": "any maskable"` on both icon entries in `manifest.json` (192×192 and 512×512); with `"any"` only, Samsung applies its own squircle + adaptive scaling on every WebAPK remint, causing the logo to shrink progressively. The combined value tells Samsung the icon already has a proper background, stopping the reprocessing loop. The splash screen is unaffected: Chrome uses the `any` purpose for splash screens.

### Changed

- **Service Worker cache** — bumped to `v3` to invalidate stale icon/manifest caches and ensure Samsung re-reads the updated manifest on next visit

---

## [1.2.0] - 2026-03-29

### Added

- **Dynamic OG image** — replaced static `og-image-infralens.png` with a `next/og`-powered `opengraph-image.tsx` using local Geist fonts; shows a live-styled analysis card with score badge and check results
- **404 page** — `app/not-found.tsx` matching the dark zinc design system
- **PROJECT.md** — comprehensive project reference (architecture, check catalogue, scoring system, design tokens, dev guide); replaces `.cursorrules` as the canonical project context file

### Changed

- **Dependency updates**:
  - `next` 16.1.1 → 16.2.1
  - `react` / `react-dom` 19.2.3 → 19.2.4
  - `lucide-react` ^0.562.0 → ^1.7.0
  - `eslint-config-next` 16.1.1 → 16.2.1
  - `@types/node` ^20 → ^22
  - `nanoid` ^5.1.6 → ^5.1.7
  - `tailwind-merge` ^3.4.0 → ^3.5.0
- **Lucide icon renames** (lucide-react 1.x removed deprecated aliases):
  - `CheckCircle2` → `CircleCheckBig`
  - `AlertTriangle` → `TriangleAlert`
  - `XCircle` → `CircleX`
  - `AlertCircle` → `CircleAlert`
- **`manifest.json` cleanup** — removed duplicate `maskable` icon entries (same file used for both `any` and `maskable` without proper safe-zone padding)
- **Architecture: server/client split** — `app/page.tsx` is now a proper server component; interactive state extracted to `src/components/home-client.tsx`; static landing sections (`WhatItChecks`, `HowResults`, `WhyInfraLens`, `Footer`) are rendered as RSC and passed as props, reducing the client bundle
- **Error handling deduplication** — extracted duplicated catch logic (Hero + CTA) into `src/lib/checks/parse-error.ts`; both paths now use a single `parseAnalysisError()` function
- **Removed DOM manipulation** — replaced fragile `document.getElementById` query in the CTA handler with proper React state management via the shared `HomeClient`

### Removed

- **Unused boilerplate assets** — deleted 5 unused Next.js default files: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`

---

## [1.1.0] - 2026-01-12

### Added

#### Analysis History

- Persistent analysis history stored in localStorage
- "Recent analyses" section on landing page displaying up to 10 entries
- Each entry shows hostname, grade, and relative timestamp
- Click on entry to load saved results instantly (no re-fetch)
- Individual entry deletion with X button (visible on hover)
- "Clear all" button to remove entire history
- FIFO behavior: oldest entries removed when exceeding 10 analyses
- Re-analyzing same URL updates existing entry instead of creating duplicate

#### New Checks

- **Security.txt Check**: Detects presence of `/.well-known/security.txt` or `/security.txt`
- **Accessibility Check**: Validates HTML accessibility (lang attribute, skip links, ARIA landmarks, alt text, form labels)

#### PWA Enhancements

- Service Worker for offline caching with network-first strategy for HTML
- Stale-while-revalidate for Next.js assets (`/_next/`)
- Cache-first for static assets (images, icons, fonts)
- Screenshots for PWA install prompt
- Keyboard shortcuts in manifest

### Changed

#### UI/UX Improvements

- Responsive grid layout for history cards: 1 column (mobile), 2 columns (sm), 3 columns (lg)
- Added `id` and `name` attributes to form inputs for better accessibility
- Improved Service Worker cache invalidation (v2)

### Technical

- Added `nanoid` dependency for unique history entry IDs
- Used `useSyncExternalStore` for hydration-safe localStorage synchronization
- History validation on load to handle corrupted/invalid localStorage data

---

## [1.0.1] - 2026-01-08

### Added

#### PWA Support

- Progressive Web App (PWA) configuration with `manifest.json`
- App icons (192x192 and 512x512) for installable experience
- Apple touch icon and meta tags for iOS support
- Theme color configuration via Next.js viewport API

### Changed

#### Landing Page

- Updated "What it checks" section to reflect 6 categories with 16 checks total
- Display category counts (e.g., "3 checks") for better clarity
- Improved visual hierarchy with category icons and descriptions

#### Results Section

- Unified padding across all result cards to match landing page spacing
- Responsive padding: `px-6 sm:px-8 md:px-12` for consistent horizontal spacing
- Export JSON and New Analysis buttons show icons only below `sm` breakpoint
- Improved button accessibility with proper titles and responsive text display

#### CTA Section

- Fixed CTA form to trigger analysis directly without intermediate scroll
- Unified loading state between Hero and CTA components
- Consistent "Analyzing..." state across all analysis triggers

#### Error Handling

- Enhanced error messages with specific handling for:
  - Rate limit errors (with wait time display)
  - Invalid URL format errors
  - Network/timeout errors
  - Generic error messages with fallback handling
- Changed error label from "Error" to "Analysis Error" for clarity
- Improved error message extraction and display

#### UI/UX Improvements

- Unified loading state management between Hero and CTA
- Consistent hover states: `hover:bg-blue-500/90` for buttons, `hover:text-blue-400` for text links
- Improved footer link styling for R-code attribution
- Better visual feedback during analysis with disabled states

#### Technical Improvements

- Fixed Next.js 16 viewport API warning by moving `themeColor` to `viewport` export
- Improved async error handling in CTA component
- Better state synchronization between parent and child components

---

## [1.0.0] - 2026-01-08

### Added

#### Complete Check Implementation (16 Checks)

- **HTTP & Security** (3 checks):
  - HTTP Security Headers (CSP, HSTS, X-Frame-Options, etc.)
  - HTTPS & TLS (enforcement, redirects, certificate validation)
  - Redirect Behavior (chain analysis, loop detection)
- **Network & DNS** (3 checks):
  - DNS Records (A, AAAA, CNAME, MX, TXT, NS resolution)
  - DNS Security (SPF, DKIM, DMARC, DNSSEC detection)
  - IP & Hosting (IP address, ASN, provider via ipapi.co)
- **Infrastructure** (1 check):
  - Firewall / WAF Detection (Cloudflare, Fastly, Akamai, etc.)
- **Website Structure** (3 checks):
  - robots.txt (presence and validity)
  - Sitemap (availability and format)
  - Linked Pages (internal/external link analysis with broken link detection)
- **Metadata & Stack** (4 checks):
  - HTML Metadata (title, description, charset, viewport)
  - Social Tags (Open Graph, Twitter Cards)
  - Stack Detection (frameworks, CMS, analytics, CDN)
  - Server Headers (information leakage detection)
- **Performance** (2 checks):
  - Performance Signals (response time, size, compression)
  - Uptime Snapshot (reachability and status)

#### Scoring System

- Weighted category-based scoring system
- Category weights configuration (HTTP & Security: 25, Network & DNS: 20, etc.)
- Status multipliers (OK: 100%, Warning: 60%, Error: 0%)
- Global score calculation with letter grades (A–E)
- Category breakdown display with progress bars
- "Why this score?" dialog explaining the scoring methodology

#### Recommendation System

- Structured recommendation types with severity levels
- Recommendation factories for security and performance
- Contextual recommendations with step-by-step guidance
- Impact descriptions and external references
- Recommendation cards in results UI

#### DNS Infrastructure

- Native Node.js DNS resolution with `dns/promises`
- In-memory DNS cache with TTL (reduces redundant lookups)
- DNS client with timeout handling and error management
- Support for A, AAAA, CNAME, MX, TXT, NS record types
- Safe error handling for DNS failures

#### Export Functionality

- JSON export of complete analysis results
- Export includes: URL, timestamp, score, grade, categories, all checks
- Download functionality with proper file naming

#### Rate Limiting

- In-memory rate limiting (1 request per IP per 30 seconds)
- IP detection from various headers (x-forwarded-for, x-real-ip, cf-connecting-ip)
- Automatic cleanup of expired rate limit entries
- Clear error messages with wait time when limit exceeded

#### UI Components

- ScoreBadge component with grade display (A–E)
- CategoryBreakdown component with progress bars
- WhyScoreDialog component explaining scoring methodology
- RecommendationCard component for displaying recommendations
- Export button in results section

#### Documentation

- Comprehensive documentation page (`/docs`) with detailed explanations
- Documentation for all 16 checks across 6 categories
- Scoring system explanation
- Notes and limitations section
- Professional, portfolio-ready documentation

#### Configuration

- `.env.example` file for API key configuration
- Optional `IPAPI_KEY` for enhanced IP/ASN lookups
- `.gitignore` updated to allow `.env.example` while ignoring other `.env*` files

### Changed

#### README

- Complete professional rewrite for portfolio presentation
- Detailed architecture section with technology stack
- Comprehensive project structure documentation
- Enhanced features list (16 checks, export, rate limiting)
- Detailed scoring system explanation
- Technical details section (execution, error handling, performance)
- Clear limitations and notes section
- Open source mention in license section

#### Documentation Page

- Enhanced descriptions with implementation details
- More technical and precise language
- Detailed explanations for each check category
- Improved limitations section with 5 clear points
- Consistency with README content

#### Server Actions

- Fixed TypeScript error with `headers()` async in Next.js 16
- Rate limiting integration in `runInfraChecks` action
- Improved error handling with user-friendly messages

#### Footer

- Added GitHub repository link
- Open source badge and MIT License display
- Professional attribution

#### Project Configuration

- Updated `.cursorrules` with current project state (16 checks, scoring, architecture)
- Improved project context for AI assistance

### Technical Details

#### New Dependencies

- `cheerio` for HTML parsing and link extraction

#### Architecture Improvements

- Parallel check execution for optimal performance
- Modular check system with type-safe interfaces
- Centralized scoring calculation
- Recommendation factory pattern
- DNS caching layer for performance optimization

#### Production Readiness

- Fixed `metadataBase` warning for Open Graph images
- Added `NEXT_PUBLIC_SITE_URL` environment variable support
- Updated OG image to `og-image-infralens.png`
- Production-ready configuration for Vercel deployment

---

## [0.2.0] - 2026-01-07

### Added

#### SEO & Social Sharing

- Open Graph meta tags for social media sharing
- Twitter Card meta tags with large image support
- Dedicated metadata configuration file (`src/lib/metadata.ts`)
- OG image integration (`/og-image-infralens.png`)

### Changed

- Metadata configuration extracted to separate module for better maintainability

---

## [0.1.0] - 2026-01-06

### Added

#### Project Setup

- Initial Next.js 16.1.1 project setup with TypeScript
- Tailwind CSS v4 configuration with custom breakpoints (xs: 26.25rem)
- shadcn/ui component library integration
- ESLint configuration for Next.js
- PostCSS configuration
- TypeScript configuration with path aliases (`@/*`, `@lib/*`, `@components/*`)

#### Design System

- Custom dark theme with zinc color palette (zinc-900 background, zinc-100 foreground)
- Primary color scheme: blue-500 with hover states
- Status color indicators:
  - OK: emerald-500
  - Warning: amber-500
  - Error: red-500
  - Info: blue-400
- Local Geist font integration (SemiBold, Bold, Black weights)
- Responsive design with mobile-first approach

#### UI Components

- shadcn/ui components: Alert, Badge, Button, Card, Input, Separator, Skeleton, Table, Tooltip
- Custom Skeleton component with zinc-800 background
- All components styled with dark theme

#### Landing Page

- Hero section with gradient title "infralens.dev"
- Search form with URL input and Analyze button
- Responsive form layout (stacked on mobile, inline on xs+)
- "What it checks" section with 5 feature cards:
  - DNS Records
  - TLS & SSL
  - HTTP Headers
  - Tech Stack
  - Metadata
- "How results are presented" section with status indicators and feature cards
- "Why InfraLens" section highlighting key benefits
- Call-to-action section with search form
- Footer with documentation link and portfolio attribution

#### Documentation

- `/docs` page with comprehensive documentation
- Sections covering:
  - DNS Records (A/AAAA, MX, TXT, common misconfigurations)
  - HTTP Headers (security headers, cache headers, redirects)
  - TLS & SSL (supported versions, certificate issuer, expiration)
- Back to home navigation

#### Check System Architecture

- Modular check system with extensible architecture
- Type-safe check definitions with `CheckResult<T>` and `CheckRunner<T>`
- Check context with URL, hostname, and timeout configuration
- Check response structure with duration tracking
- Centralized check orchestration in `run-checks.ts`

#### HTTP Security Headers Check

- First implemented check: HTTP Security Headers
- Checks for 5 recommended security headers:
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
  - Strict-Transport-Security
- Status determination:
  - OK: All headers present
  - Warning: Some headers present
  - Error: No headers or fetch failure
- Returns present and missing headers arrays
- Performance tracking with duration in milliseconds

#### Results Display

- Results section component with loading states
- Skeleton loading animation during check execution
- Check result cards with:
  - Status badges (OK/Warning/Error) with icons
  - Summary message
  - Detailed data display (present/missing headers)
  - Duration information
- "New Analysis" button to reset and start over
- Automatic scroll to results after analysis
- Smooth scroll animations

#### Server Actions

- Server action `runInfraChecks` for executing checks
- URL normalization and validation
- Error handling with user-friendly messages

#### Responsive Design

- Mobile-first responsive breakpoints
- Custom xs breakpoint (26.25rem / 420px)
- Responsive spacing and padding adjustments
- Responsive typography scaling
- Responsive grid layouts (1 column → 2 columns → 3 columns)
- Responsive form layouts (stacked → inline)

### Changed

- Default dark mode enabled in root layout
- Global CSS updated to use Geist font family
- Body background set to zinc-900

### Technical Details

#### Dependencies

- Next.js 16.1.1
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- Radix UI primitives
- Lucide React icons
- class-variance-authority
- clsx & tailwind-merge

#### File Structure

- 40+ files created/modified
- Organized component structure (landing/, results/, ui/)
- Modular check system (checks/ directory)
- Server actions in app/actions/
- Documentation in app/docs/

---

[2.4.1]: https://github.com/Randy-R-code/infralens/compare/v2.4.0...v2.4.1
[2.4.0]: https://github.com/Randy-R-code/infralens/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/Randy-R-code/infralens/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/Randy-R-code/infralens/compare/v2.1.1...v2.2.0
[2.1.1]: https://github.com/Randy-R-code/infralens/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/Randy-R-code/infralens/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/Randy-R-code/infralens/compare/v1.9.0...v2.0.0
[1.9.0]: https://github.com/Randy-R-code/infralens/compare/v1.8.0...v1.9.0
[1.8.0]: https://github.com/Randy-R-code/infralens/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/Randy-R-code/infralens/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/Randy-R-code/infralens/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/Randy-R-code/infralens/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/Randy-R-code/infralens/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/Randy-R-code/infralens/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/Randy-R-code/infralens/compare/v1.2.3...v1.3.0
[1.2.3]: https://github.com/Randy-R-code/infralens/compare/v1.2.2...v1.2.3
[1.2.2]: https://github.com/Randy-R-code/infralens/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/Randy-R-code/infralens/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/Randy-R-code/infralens/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/Randy-R-code/infralens/releases/tag/v1.1.0
[1.0.1]: https://github.com/Randy-R-code/infralens/releases/tag/v1.0.1
[1.0.0]: https://github.com/Randy-R-code/infralens/releases/tag/v1.0.0
[0.2.0]: https://github.com/Randy-R-code/infralens/releases/tag/v0.2.0
[0.1.0]: https://github.com/Randy-R-code/infralens/releases/tag/v0.1.0
