import {
  annotateScoring,
  calculateGlobalScore,
} from "./checks/calculate-score";
import { CheckResult, GlobalScore } from "./checks/types";

// A real InfraLens report of this very site — not a fictional domain, not
// hand-tuned numbers. Shared by the landing "example report" preview
// (results-preview.tsx) and the OG card image (opengraph-image.tsx) so both
// surfaces always show the exact same example instead of two separately
// hand-rolled copies that can (and did) drift apart from each other and
// from the real report's anatomy.
//
// Captured from a live scan of randy-code.dev (94/100, grade A) — every id,
// status, and summary below is real. EXAMPLE_SCORE/EXAMPLE_CHECKS are
// derived from it by the real scoring engine, not hardcoded, so the global
// score, grade, and every category total stay honest and reproducible. This
// is the full 20-check report, not a curated subset — a partial list would
// make the per-category scores (and PrioritySummary's "worth fixing
// first"/"working well" split) diverge from what a visitor actually sees
// when they run this analysis themselves.
//
// Static snapshot, refreshed manually if randy-code.dev's own score changes
// significantly — never rescanned at build or render time.
export const EXAMPLE_HOSTNAME = "randy-code.dev";
export const EXAMPLE_URL = "https://randy-code.dev/";

const RAW_EXAMPLE_CHECKS: CheckResult[] = [
  {
    id: "headers",
    label: "HTTP Security Headers",
    category: "http-security",
    status: "warning",
    summary: "1 present but weak recommended security header(s).",
    durationMs: 1,
  },
  {
    id: "https",
    label: "HTTPS & TLS",
    category: "http-security",
    status: "pass",
    summary: "HTTPS is properly configured.",
    durationMs: 60,
  },
  {
    id: "security-txt",
    label: "security.txt",
    category: "http-security",
    status: "pass",
    summary: "security.txt found with 3 fields.",
    durationMs: 356,
  },
  {
    id: "redirects",
    label: "Redirect Behavior",
    category: "http-security",
    status: "pass",
    summary: "No redirects detected.",
    durationMs: 0,
  },
  {
    id: "dns-records",
    label: "DNS Records",
    category: "network-dns",
    status: "pass",
    summary: "Found: 2 A, 2 NS, 2 TXT, 3 CAA.",
    durationMs: 15,
  },
  {
    id: "dns-security",
    label: "DNS Security",
    category: "network-dns",
    status: "pass",
    summary: "SPF and DMARC records are present.",
    durationMs: 26,
  },
  {
    id: "dkim",
    label: "DKIM",
    category: "network-dns",
    status: "inconclusive",
    summary:
      "DKIM not found at common selectors — this doesn't confirm it's absent, only that it isn't using one of a handful of guessable default names.",
    durationMs: 52,
  },
  {
    id: "dnssec",
    label: "DNSSEC",
    category: "network-dns",
    status: "inconclusive",
    summary:
      "DNSSEC is not evaluated — this scanner has no DNSSEC-aware resolver.",
    durationMs: 0,
  },
  {
    id: "ip-hosting",
    label: "IP & Hosting Information",
    category: "network-dns",
    status: "unavailable",
    summary: "IP: 64.29.17.1 (hosting details unavailable)",
    durationMs: 242,
  },
  {
    id: "waf",
    label: "Firewall / WAF Detection",
    category: "infrastructure",
    status: "info",
    summary:
      "Response headers suggest Vercel may be in front of this site (not a confirmed detection).",
    durationMs: 0,
  },
  {
    id: "robots",
    label: "robots.txt",
    category: "website-structure",
    status: "pass",
    summary: "robots.txt is present and appears valid.",
    durationMs: 211,
  },
  {
    id: "sitemap",
    label: "Sitemap",
    category: "website-structure",
    status: "pass",
    summary: "Sitemap found (xml format, ~25 URLs).",
    durationMs: 404,
  },
  {
    id: "links",
    label: "Linked Pages",
    category: "website-structure",
    status: "pass",
    summary: "Found 32 internal and 4 external links.",
    durationMs: 381,
  },
  {
    id: "metadata",
    label: "HTML Metadata",
    category: "metadata-stack",
    status: "pass",
    summary: "All essential metadata is present.",
    durationMs: 0,
  },
  {
    id: "accessibility",
    label: "Accessibility Hints",
    category: "metadata-stack",
    status: "pass",
    summary: "Good accessibility practices detected.",
    durationMs: 1,
  },
  {
    id: "server-headers",
    label: "Server Headers",
    category: "metadata-stack",
    status: "pass",
    summary: "Server: Vercel (no version disclosed).",
    durationMs: 0,
  },
  {
    id: "social",
    label: "Social Tags",
    category: "metadata-stack",
    status: "pass",
    summary: "Open Graph and Twitter Card tags are present.",
    durationMs: 0,
  },
  {
    id: "stack",
    label: "Technology Stack",
    category: "metadata-stack",
    status: "info",
    summary: "Detected: 2 framework(s), 1 CDN.",
    durationMs: 2,
  },
  {
    id: "performance",
    label: "Performance Signals",
    category: "performance",
    status: "pass",
    summary:
      "Response time: 260ms. Compression: br. Cache-Control: public, max-age=0, must-revalidate.",
    durationMs: 0,
  },
  {
    id: "reachability",
    label: "Reachability Snapshot",
    category: "performance",
    status: "pass",
    summary: "Site is reachable (HTTP 200, 260ms).",
    durationMs: 0,
  },
];

export const EXAMPLE_SCORE: GlobalScore =
  calculateGlobalScore(RAW_EXAMPLE_CHECKS);
export const EXAMPLE_CHECKS: CheckResult[] =
  annotateScoring(RAW_EXAMPLE_CHECKS);
