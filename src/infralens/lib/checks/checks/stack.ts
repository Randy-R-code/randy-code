import { detectCdnFromHeaders } from "../cdn-fingerprints";
import { CheckRunner } from "../types";

/**
 * Confidence tiers (master plan §11.17: "confirmed / likely / possible") —
 * a single fragile string match is never enough to claim certainty:
 * - `likely`: a structural fingerprint (a build-output path, a generated
 *   attribute, a distinctive script URL) that's very unlikely to appear by
 *   coincidence, but still just static markup, not an executed check.
 * - `possible`: a bare keyword match anywhere in the page text — the
 *   technology's name could appear in prose without the technology being
 *   in use at all.
 */
type Confidence = "confirmed" | "likely" | "possible";

type StackFinding = {
  name: string;
  category: "framework" | "cms" | "analytics" | "cdn";
  confidence: Confidence;
};

type PatternEntry = { name: string; pattern: RegExp; confidence: Confidence };

const FRAMEWORK_PATTERNS: PatternEntry[] = [
  {
    name: "Next.js",
    pattern: /_next\/static\/|__NEXT_DATA__|id=["']__next["']/i,
    confidence: "likely",
  },
  { name: "Next.js", pattern: /next\.js/i, confidence: "possible" },
  {
    name: "React",
    pattern: /data-reactroot|react-dom(\.min)?\.js|_reactrootcontainer/i,
    confidence: "likely",
  },
  { name: "React", pattern: /\breact\b/i, confidence: "possible" },
  {
    name: "Vue.js",
    pattern: /data-v-[a-f0-9]{6,}|__vue__|vue\.runtime/i,
    confidence: "likely",
  },
  { name: "Vue.js", pattern: /\bvue\.js\b|\bvuejs\b/i, confidence: "possible" },
  {
    name: "Angular",
    pattern: /ng-version=["']|ng-app=/i,
    confidence: "likely",
  },
  { name: "Angular", pattern: /\bangular\b/i, confidence: "possible" },
  {
    name: "Svelte",
    pattern: /class=["'][^"']*svelte-[a-z0-9]+/i,
    confidence: "likely",
  },
  { name: "Svelte", pattern: /\bsvelte\b/i, confidence: "possible" },
  { name: "Gatsby", pattern: /___gatsby|data-gatsby/i, confidence: "likely" },
  { name: "Gatsby", pattern: /\bgatsby\b/i, confidence: "possible" },
];

const CMS_PATTERNS: PatternEntry[] = [
  {
    name: "WordPress",
    pattern: /wp-content\/|wp-includes\//i,
    confidence: "likely",
  },
  { name: "WordPress", pattern: /\bwordpress\b/i, confidence: "possible" },
  {
    name: "Drupal",
    pattern: /Drupal\.settings|sites\/(default|all)\/(files|modules|themes)/i,
    confidence: "likely",
  },
  { name: "Drupal", pattern: /\bdrupal\b/i, confidence: "possible" },
  {
    name: "Joomla",
    pattern: /components\/com_|media\/jui\//i,
    confidence: "likely",
  },
  { name: "Joomla", pattern: /\bjoomla\b/i, confidence: "possible" },
  {
    name: "Ghost",
    pattern: /content=["']Ghost\b|ghost-url/i,
    confidence: "likely",
  },
  { name: "Strapi", pattern: /powered by strapi/i, confidence: "likely" },
  { name: "Strapi", pattern: /\bstrapi\b/i, confidence: "possible" },
];

const ANALYTICS_PATTERNS: PatternEntry[] = [
  {
    name: "Google Analytics",
    pattern: /google-analytics\.com\/analytics\.js|gtag\(["']config["']/i,
    confidence: "likely",
  },
  {
    name: "Google Tag Manager",
    pattern: /googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]+/i,
    confidence: "likely",
  },
  {
    name: "Adobe Analytics",
    pattern: /assets\.adobedtm\.com|omniture/i,
    confidence: "likely",
  },
  {
    name: "Mixpanel",
    pattern: /cdn\.mxpnl\.com|mixpanel\.init/i,
    confidence: "likely",
  },
  {
    name: "Segment",
    pattern: /cdn\.segment\.com\/analytics\.js/i,
    confidence: "likely",
  },
];

/** Strongest confidence wins per (category, name) pair. */
function strongest(a: Confidence, b: Confidence): Confidence {
  const rank: Record<Confidence, number> = {
    confirmed: 3,
    likely: 2,
    possible: 1,
  };
  return rank[a] >= rank[b] ? a : b;
}

function matchAll(
  html: string,
  patterns: PatternEntry[],
  category: StackFinding["category"],
): StackFinding[] {
  const byName = new Map<string, Confidence>();
  for (const { name, pattern, confidence } of patterns) {
    if (pattern.test(html)) {
      const existing = byName.get(name);
      byName.set(name, existing ? strongest(existing, confidence) : confidence);
    }
  }
  return Array.from(byName, ([name, confidence]) => ({
    name,
    category,
    confidence,
  }));
}

export const runStackCheck: CheckRunner<{
  findings: StackFinding[];
  frameworks: string[];
  cms: string[];
  analytics: string[];
  cdn: string[];
}> = async ({ shared }) => {
  const start = performance.now();

  if (!shared.page) {
    return {
      id: "stack",
      label: "Technology Stack",
      category: "metadata-stack",
      status: "error",
      summary: "Unable to detect technology stack.",
      durationMs: Math.round(performance.now() - start),
    };
  }

  const { html, headers } = shared.page;

  // Header-based CDN evidence comes from the actual serving infrastructure,
  // not page content — the only source strong enough to call "confirmed".
  const { detected: cdnHeaderEvidence, provider: cdnProvider } =
    detectCdnFromHeaders(headers);
  const cdnFindings: StackFinding[] = cdnProvider
    ? [{ name: cdnProvider, category: "cdn", confidence: "confirmed" }]
    : [];

  const findings: StackFinding[] = [
    ...matchAll(html, FRAMEWORK_PATTERNS, "framework"),
    ...matchAll(html, CMS_PATTERNS, "cms"),
    ...matchAll(html, ANALYTICS_PATTERNS, "analytics"),
    ...cdnFindings,
  ];

  const frameworks = findings
    .filter((f) => f.category === "framework")
    .map((f) => f.name);
  const cms = findings.filter((f) => f.category === "cms").map((f) => f.name);
  const analytics = findings
    .filter((f) => f.category === "analytics")
    .map((f) => f.name);
  const cdn = findings.filter((f) => f.category === "cdn").map((f) => f.name);

  // Detecting nothing isn't a finding at all — most sites don't leak a
  // fingerprint for every category, and that's not a configuration gap
  // (same reasoning as the WAF check, master plan §32 Phase 7).
  const status: "pass" | "info" = "info";
  const summary =
    findings.length === 0
      ? "No technology fingerprints detected."
      : `Detected: ${[
          frameworks.length && `${frameworks.length} framework(s)`,
          cms.length && `${cms.length} CMS`,
          analytics.length && `${analytics.length} analytics`,
          cdn.length && `${cdn.length} CDN`,
        ]
          .filter(Boolean)
          .join(", ")}.`;

  return {
    id: "stack",
    label: "Technology Stack",
    category: "metadata-stack",
    status,
    summary,
    data: {
      findings,
      frameworks,
      cms,
      analytics,
      cdn,
    },
    evidence: [
      ...findings.map((f) => ({
        label: f.name,
        value: f.confidence,
        source: "html" as const,
      })),
      ...(cdnHeaderEvidence.length > 0
        ? [
            {
              label: "CDN header evidence",
              value: cdnHeaderEvidence.join(", "),
              source: "header" as const,
            },
          ]
        : []),
    ],
    limitations: [
      'Detection is based on static markup and header fingerprints only — "possible" findings are a single fragile keyword match and can be wrong; nothing here is executed or verified at runtime.',
    ],
    durationMs: Math.round(performance.now() - start),
  };
};
