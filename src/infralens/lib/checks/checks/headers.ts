import { securityHeadersRecommendation } from "@infralens-lib/recommendations/security";
import { CheckRunner } from "../types";

/** Header names checked for both presence and value quality. `strong` means present with a reasonably safe value, not just present. */
type HeaderFinding = {
  label: string;
  present: boolean;
  strong: boolean;
  note?: string;
};

/** Informational only — surfaced as evidence, never required. */
const INFORMATIONAL_HEADERS = [
  "cross-origin-opener-policy",
  "cross-origin-embedder-policy",
  "cross-origin-resource-policy",
];

function analyzeCsp(value: string | null): Omit<HeaderFinding, "label"> {
  if (!value) return { present: false, strong: false };
  // A present-but-permissive CSP isn't meaningfully different from having
  // none — flag the classic weakening patterns rather than crediting any
  // non-empty value equally.
  const isWeak =
    /unsafe-inline/i.test(value) ||
    /unsafe-eval/i.test(value) ||
    /(^|[\s;])\*(?=[\s;]|$)/.test(value);
  return {
    present: true,
    strong: !isWeak,
    note: isWeak
      ? "allows unsafe-inline, unsafe-eval, or a wildcard source"
      : undefined,
  };
}

/** Exported for reuse by `https.ts`, which needs the same weak-max-age judgment for its own HSTS assessment. */
export function analyzeHsts(
  value: string | null,
): Omit<HeaderFinding, "label"> {
  if (!value) return { present: false, strong: false };
  const match = value.match(/max-age=(\d+)/i);
  const maxAge = match ? parseInt(match[1], 10) : 0;
  const isWeak = maxAge < 300;
  return {
    present: true,
    strong: !isWeak,
    note: isWeak ? "max-age is missing or very short" : undefined,
  };
}

function analyzeReferrerPolicy(
  value: string | null,
): Omit<HeaderFinding, "label"> {
  if (!value) return { present: false, strong: false };
  const isWeak = value
    .toLowerCase()
    .split(",")
    .map((v) => v.trim())
    .includes("unsafe-url");
  return {
    present: true,
    strong: !isWeak,
    note: isWeak
      ? "unsafe-url leaks the full referrer on every navigation"
      : undefined,
  };
}

/** Framing protection can come from either header — a site with `frame-ancestors` in its CSP and no X-Frame-Options is still protected. */
function analyzeFraming(
  hasXfo: boolean,
  cspValue: string | null,
): Omit<HeaderFinding, "label"> {
  const hasFrameAncestors = !!cspValue && /frame-ancestors/i.test(cspValue);
  const present = hasXfo || hasFrameAncestors;
  return { present, strong: present };
}

export const runHeadersCheck: CheckRunner<{
  present: string[];
  missing: string[];
  weak: string[];
}> = async ({ shared }) => {
  const start = performance.now();

  if (!shared.page) {
    return {
      id: "headers",
      label: "HTTP Security Headers",
      category: "http-security",
      status: "error",
      summary: "Unable to fetch headers.",
      durationMs: Math.round(performance.now() - start),
    };
  }

  const headers = shared.page.headers;
  const cspValue = headers.get("content-security-policy");
  const xcto =
    headers.get("x-content-type-options")?.toLowerCase() === "nosniff";

  const findings: HeaderFinding[] = [
    { label: "Content-Security-Policy", ...analyzeCsp(cspValue) },
    {
      label: "Framing protection (X-Frame-Options or frame-ancestors)",
      ...analyzeFraming(headers.has("x-frame-options"), cspValue),
    },
    { label: "X-Content-Type-Options", present: xcto, strong: xcto },
    {
      label: "Referrer-Policy",
      ...analyzeReferrerPolicy(headers.get("referrer-policy")),
    },
    {
      label: "Strict-Transport-Security",
      ...analyzeHsts(headers.get("strict-transport-security")),
    },
    {
      label: "Permissions-Policy",
      present: headers.has("permissions-policy"),
      strong: headers.has("permissions-policy"),
    },
  ];

  const present = findings.filter((f) => f.present).map((f) => f.label);
  const missing = findings.filter((f) => !f.present).map((f) => f.label);
  const weak = findings
    .filter((f) => f.present && !f.strong)
    .map((f) => f.label);
  const strongCount = findings.filter((f) => f.strong).length;

  let status: "pass" | "warning" | "fail";
  if (strongCount === findings.length) {
    status = "pass";
  } else if (present.length === 0) {
    // Nothing at all is a real configuration gap, not a partial one.
    status = "fail";
  } else {
    status = "warning";
  }

  const summaryParts: string[] = [];
  if (missing.length > 0) summaryParts.push(`${missing.length} missing`);
  if (weak.length > 0) summaryParts.push(`${weak.length} present but weak`);
  const summary =
    summaryParts.length === 0
      ? "All recommended security headers are present with safe values."
      : `${summaryParts.join(", ")} recommended security header(s).`;

  return {
    id: "headers",
    label: "HTTP Security Headers",
    category: "http-security",
    status,
    summary,
    data: { present, missing, weak },
    evidence: [
      ...findings.map((f) => ({
        label: f.label,
        value: f.strong ? "strong" : f.present ? "weak" : "missing",
        source: "header" as const,
      })),
      // Advanced isolation headers — informational only, never required.
      ...INFORMATIONAL_HEADERS.map((h) => ({
        label: h,
        value: headers.has(h),
        source: "header" as const,
      })),
    ],
    recommendation:
      missing.length > 0 || weak.length > 0
        ? securityHeadersRecommendation(missing, weak)
        : undefined,
    limitations: [
      "Value-quality checks are pattern-based (e.g. unsafe-inline, unsafe-eval, wildcard sources for CSP) and don't fully parse the header grammar, so an unusual but safe directive could be flagged as weak, or a subtly unsafe one missed.",
    ],
    durationMs: Math.round(performance.now() - start),
  };
};
