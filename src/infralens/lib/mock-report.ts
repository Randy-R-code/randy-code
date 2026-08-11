import { CheckResult, GlobalScore } from "./checks/types";

// Static, hand-picked numbers — not derived from a real analysis. Shared by
// the landing "example report" preview (results-preview.tsx) and the OG
// card image (opengraph-image.tsx) so both surfaces always show the exact
// same example instead of two separately hand-rolled copies that can (and
// did) drift apart from each other and from the real report's anatomy.
export const MOCK_HOSTNAME = "example.com";
export const MOCK_URL = "https://example.com/";

export const MOCK_SCORE: GlobalScore = {
  score: 84,
  grade: "B",
  categories: [
    { category: "http-security", score: 21, maxScore: 25 },
    { category: "network-dns", score: 17, maxScore: 20 },
    { category: "infrastructure", score: 20, maxScore: 20 },
    { category: "website-structure", score: 12, maxScore: 15 },
    { category: "metadata-stack", score: 8, maxScore: 10 },
    { category: "performance", score: 6, maxScore: 10 },
  ],
  scoredCount: 16,
  excludedCount: 2,
  strongestCategory: "infrastructure",
  topPriorityCategory: "performance",
};

// Covers pass/warning/fail/info on purpose — real CheckResultCard and
// PrioritySummary instances render straight off this array, so it needs to
// exercise the same status range a real report would.
export const MOCK_CHECKS: CheckResult[] = [
  {
    id: "https-tls",
    label: "HTTPS & TLS",
    category: "http-security",
    status: "pass",
    summary:
      "HTTPS is properly configured with a valid, non-expiring TLS certificate.",
    durationMs: 180,
    scored: true,
    scoreContribution: 6,
  },
  {
    id: "dns-security",
    label: "DNS Security",
    category: "network-dns",
    status: "pass",
    summary: "SPF and DMARC records are both present.",
    durationMs: 95,
    scored: true,
    scoreContribution: 7,
  },
  {
    id: "security-headers",
    label: "HTTP Security Headers",
    category: "http-security",
    status: "warning",
    summary:
      "Content-Security-Policy is present but still allows unsafe-inline scripts.",
    durationMs: 140,
    scored: true,
    scoreContribution: 4,
  },
  {
    id: "robots-txt",
    label: "robots.txt",
    category: "website-structure",
    status: "fail",
    summary: "robots.txt not found.",
    durationMs: 110,
    scored: true,
    scoreContribution: 0,
  },
  {
    id: "waf-detection",
    label: "Firewall / WAF Detection",
    category: "infrastructure",
    status: "info",
    summary:
      "Response headers suggest a CDN may be in front of this site (not a confirmed detection).",
    durationMs: 60,
    scored: false,
  },
];
