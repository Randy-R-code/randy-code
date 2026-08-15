import {
  annotateScoring,
  calculateGlobalScore,
} from "./checks/calculate-score";
import { CheckResult, GlobalScore } from "./checks/types";

// Static, hand-picked checks — not a real analysis. Shared by the landing
// "example report" preview (results-preview.tsx) and the OG card image
// (opengraph-image.tsx) so both surfaces always show the exact same example
// instead of two separately hand-rolled copies that can (and did) drift
// apart from each other and from the real report's anatomy.
export const MOCK_HOSTNAME = "example.com";
export const MOCK_URL = "https://example.com/";

// One representative check per category (http-security gets two, to show
// partial scoring within a category) — real check ids, so the real scoring
// engine can derive MOCK_SCORE/MOCK_CHECKS' scored/scoreContribution below
// instead of those being independently hand-typed and free to drift.
// Infrastructure/WAF stays informational on purpose: it demonstrates the
// real "Info" category state, not a fabricated `0/x` or `x/x`.
const RAW_MOCK_CHECKS: CheckResult[] = [
  {
    id: "https",
    label: "HTTPS & TLS",
    category: "http-security",
    status: "pass",
    summary:
      "HTTPS is properly configured with a valid, non-expiring TLS certificate.",
    durationMs: 180,
  },
  {
    id: "headers",
    label: "HTTP Security Headers",
    category: "http-security",
    status: "warning",
    summary:
      "Content-Security-Policy is present but still allows unsafe-inline scripts.",
    durationMs: 140,
  },
  {
    id: "dns-security",
    label: "DNS Security",
    category: "network-dns",
    status: "pass",
    summary: "SPF and DMARC records are both present.",
    durationMs: 95,
  },
  {
    id: "waf",
    label: "Firewall / WAF Detection",
    category: "infrastructure",
    status: "info",
    summary:
      "Response headers suggest a CDN may be in front of this site (not a confirmed detection).",
    durationMs: 60,
  },
  {
    id: "robots",
    label: "robots.txt",
    category: "website-structure",
    status: "fail",
    summary: "robots.txt not found.",
    durationMs: 110,
  },
  {
    id: "metadata",
    label: "HTML Metadata",
    category: "metadata-stack",
    status: "pass",
    summary: "Title, description, charset, and viewport are all present.",
    durationMs: 50,
  },
  {
    id: "performance",
    label: "Performance Signals",
    category: "performance",
    status: "pass",
    summary: "Response time is fast (under 500ms) with compression enabled.",
    durationMs: 210,
  },
];

export const MOCK_SCORE: GlobalScore = calculateGlobalScore(RAW_MOCK_CHECKS);
export const MOCK_CHECKS: CheckResult[] = annotateScoring(RAW_MOCK_CHECKS);
