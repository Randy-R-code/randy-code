import type { CollectedContext } from "./collect";

/**
 * `pass`/`warning`/`fail` are real assessments of the target's config and
 * always count toward the score (for a check with a nonzero weight — see
 * `CHECK_WEIGHTS` in `scoring-config.ts`; a weight-0 check like `waf`/`stack`
 * never counts regardless of status). The rest are all excluded from scoring
 * — see `isScoredStatus` in `scoring-config.ts` — but mean different things:
 * `info` is a neutral, non-judgmental finding (e.g. detected tech stack).
 * `not-applicable` means the underlying condition genuinely doesn't apply to
 * this target (e.g. a mail-auth check for a domain that provably never sends
 * mail) — the check's weight is dropped from that report's denominator
 * rather than counted as a failure.
 * `inconclusive` means the check ran and got *an* answer, but the detection
 * method can't reach a reliable conclusion by design (e.g. DKIM selector
 * guessing, DNSSEC validation with no DNSSEC-aware resolver available) —
 * also dropped from the denominator, distinct from a transient failure.
 * `unavailable` means the check ran but couldn't get a real answer for a
 * reason outside the target's control (e.g. a third-party API being down).
 * `error` means the check itself failed to execute (network/timeout) —
 * never used to represent a bad configuration.
 */
export type CheckStatus =
  | "pass"
  | "warning"
  | "fail"
  | "info"
  | "not-applicable"
  | "inconclusive"
  | "unavailable"
  | "error";

export type CheckCategory =
  | "http-security"
  | "network-dns"
  | "infrastructure"
  | "website-structure"
  | "metadata-stack"
  | "performance";

export type RecommendationSeverity = "info" | "warning" | "critical";

export type Recommendation = {
  id: string;
  title: string;
  description: string;
  impact: string;
  howTo?: string[];
  references?: {
    label: string;
    url: string;
  }[];
  severity: RecommendationSeverity;
};

/** A structured piece of proof behind a result — e.g. the exact header checked, or the resolved IP. `sensitive: true` items are stripped from JSON exports (see `export.ts`). */
export type EvidenceItem = {
  label: string;
  value: string | number | boolean | null;
  source?: "dns" | "header" | "html" | "tls" | "derived";
  sensitive?: boolean;
};

export type CheckResult<T = unknown> = {
  id: string;
  label: string;
  category: CheckCategory;
  status: CheckStatus;
  summary?: string;
  data?: T;
  durationMs: number;
  recommendation?: Recommendation;
  evidence?: EvidenceItem[];
  /** Known caveats specific to this result (e.g. a heuristic's blind spot) — not yet populated by any check as of Phase 4; scaffolded for Phases 6-9. */
  limitations?: string[];
  /**
   * Whether this result counts toward the score — derived from `status`
   * (see `isScoredStatus`) and filled in by `annotateScoring` once all
   * checks have run, not set by individual checks themselves.
   */
  scored?: boolean;
  /** Points this result actually contributed to its category, filled in alongside `scored`. */
  scoreContribution?: number;
};

export type ChecksResponse = {
  url: string;
  hostname: string;
  checks: CheckResult[];
  totalDurationMs: number;
  score: GlobalScore;
  /** ISO timestamp set when the analysis started — real, not set at render/export time. */
  analyzedAt: string;
};

export type CheckContext = {
  url: string;
  hostname: string;
  timeout: number;
  /** Result of the one shared page fetch + DNS lookup done before any check runs — most checks read from this instead of fetching the same URL themselves. */
  shared: CollectedContext;
};

export type CheckRunner<T = unknown> = (
  context: CheckContext,
) => Promise<CheckResult<T>>;

// --------------------
// Scoring types
// --------------------

export type CategoryScore = {
  category: CheckCategory;
  score: number; // 0 - 100
  maxScore: number;
};

export type GlobalScore = {
  score: number; // 0 - 100
  grade: "A" | "B" | "C" | "D" | "E";
  categories: CategoryScore[];
  /** How many of the results actually counted toward `score`. */
  scoredCount: number;
  /** How many results were excluded — weight-0 checks, or any non-pass/warning/fail status (never penalized). */
  excludedCount: number;
  /** Category with the best score/maxScore ratio, if any category has one. */
  strongestCategory: CheckCategory | null;
  /** Category with the worst score/maxScore ratio — the most worthwhile place to improve. */
  topPriorityCategory: CheckCategory | null;
};
