import { CheckCategory, CheckStatus } from "./types";

/**
 * Weights kept as-is on review — the existing split already follows an
 * explicit, defensible principle:
 * categories closer to actual attack surface or delivery integrity are
 * weighted higher than ones that are mostly informational.
 *
 * - `http-security` (25, highest) — headers, HTTPS/TLS, security.txt,
 *   redirects: directly affects whether traffic and users are protected.
 * - `network-dns` / `infrastructure` (20 each) — DNS hygiene (SPF/DMARC/
 *   DKIM), hosting, WAF/CDN presence: foundational, but usually one layer
 *   removed from a direct exploit path compared to `http-security`.
 * - `website-structure` (15) — robots/sitemap/links: correctness and
 *   crawlability, lower security relevance.
 * - `metadata-stack` / `performance` (10 each, lowest) — largely
 *   informational or UX-oriented signals (metadata completeness, detected
 *   stack, response time) with no direct security implication on their
 *   own.
 *
 * Sums to 100. Values weren't changed without a concrete, target-specific
 * reason to — see individual check reviews in Phases 6-9 for that.
 */
export const CATEGORY_WEIGHTS: Record<CheckCategory, number> = {
  "http-security": 25,
  "network-dns": 20,
  infrastructure: 20,
  "website-structure": 15,
  "metadata-stack": 10,
  performance: 10,
};

export const STATUS_MULTIPLIER: Record<CheckStatus, number> = {
  pass: 1,
  warning: 0.6,
  fail: 0,
  info: 0,
  unavailable: 0,
  error: 0,
} as const;

/** `pass`/`warning`/`fail` are real assessments and always count toward the score; `info`/`unavailable`/`error` never do — a technical failure or a neutral note must not move the score. */
export function isScoredStatus(status: CheckStatus): boolean {
  return status === "pass" || status === "warning" || status === "fail";
}
