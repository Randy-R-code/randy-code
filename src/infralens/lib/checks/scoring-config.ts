import { CheckCategory, CheckStatus } from "./types";

/**
 * Each check's category, mirroring the `category` field each check file
 * returns in its own `CheckResult` — kept here too (rather than only
 * inferring it live from a real analysis) so display-only surfaces
 * (`why-score-dialog.tsx`, `docs/page.tsx`) can show category totals
 * without needing to run every check first. `run-checks.test.ts` asserts
 * this stays in sync with what the real checks actually return.
 */
export const CHECK_CATEGORIES: Record<string, CheckCategory> = {
  https: "http-security",
  headers: "http-security",
  "security-txt": "http-security",
  redirects: "http-security",
  "dns-security": "network-dns",
  "dns-records": "network-dns",
  dkim: "network-dns",
  dnssec: "network-dns",
  "ip-hosting": "network-dns",
  waf: "infrastructure",
  robots: "website-structure",
  sitemap: "website-structure",
  links: "website-structure",
  accessibility: "metadata-stack",
  metadata: "metadata-stack",
  "server-headers": "metadata-stack",
  social: "metadata-stack",
  stack: "metadata-stack",
  reachability: "performance",
  performance: "performance",
};

/**
 * Check-weight-first model: every genuinely scoreable check has an explicit
 * weight; every informational-only check has weight 0. Sums to exactly 100
 * across the nonzero entries — a category no longer owns a fixed budget of
 * its own, its max is simply the sum of its own checks' weights (see
 * `calculate-score.ts`).
 *
 * Weights come from a per-check audit (importance / reliability /
 * actionability / applicability / independence / severity), not from the
 * old category budgets — see the InfraLens scoring-redesign plan for the
 * full per-check rationale. Notable decisions:
 * - `waf`/`stack` are weight 0 — already always return `status: "info"` in
 *   their own code, this just makes that formal in the scoring model too.
 * - `ip-hosting` is weight 0 (reclassified) — ASN/hosting/geo info is
 *   inventory, not a quality judgment, same reasoning as `waf`/`stack`.
 * - HSTS is scored once, by `https` (transport security), not duplicated in
 *   `headers` (which still surfaces it as evidence).
 * - `dns-security` (SPF/DMARC only) was split out of what used to be one
 *   check bundling SPF/DMARC/DKIM/DNSSEC into a single opaque status. DKIM
 *   and DNSSEC are now their own checks (`dkim`, `dnssec`) since neither can
 *   ever reach a confirmed pass/warning/fail the way SPF/DMARC can — the
 *   original 12-point weight is split 8/2/2 rather than changing the
 *   overall 100-point total.
 */
export const CHECK_WEIGHTS: Record<string, number> = {
  https: 18,
  headers: 16,
  "dns-security": 8,
  redirects: 7,
  reachability: 7,
  accessibility: 6,
  performance: 6,
  metadata: 5,
  "security-txt": 4,
  robots: 4,
  sitemap: 4,
  "server-headers": 4,
  links: 3,
  social: 2,
  "dns-records": 2,
  dkim: 2,
  dnssec: 2,
  "ip-hosting": 0,
  waf: 0,
  stack: 0,
};

/**
 * Category totals when every normally-scoreable check lands on pass/
 * warning/fail — the common case, not a fixed budget. A report where a
 * check is excluded (not-applicable/inconclusive/unavailable/error) will
 * show a smaller per-category `maxScore` than this for display purposes
 * only (`why-score-dialog.tsx`, `docs/page.tsx`); `calculate-score.ts`
 * computes the real per-report totals directly from `CHECK_WEIGHTS`.
 */
export const CATEGORY_MAX_WEIGHTS: Record<CheckCategory, number> = (() => {
  const totals = {
    "http-security": 0,
    "network-dns": 0,
    infrastructure: 0,
    "website-structure": 0,
    "metadata-stack": 0,
    performance: 0,
  } as Record<CheckCategory, number>;
  for (const [id, weight] of Object.entries(CHECK_WEIGHTS)) {
    totals[CHECK_CATEGORIES[id]] += weight;
  }
  return totals;
})();

export const STATUS_MULTIPLIER: Record<CheckStatus, number> = {
  pass: 1,
  warning: 0.6,
  fail: 0,
  info: 0,
  "not-applicable": 0,
  inconclusive: 0,
  unavailable: 0,
  error: 0,
} as const;

/** `pass`/`warning`/`fail` are real assessments and always count toward the score (given a nonzero check weight); every other status never does — a technical failure, a neutral note, or a genuinely inconclusive/not-applicable result must not move the score. */
export function isScoredStatus(status: CheckStatus): boolean {
  return status === "pass" || status === "warning" || status === "fail";
}
