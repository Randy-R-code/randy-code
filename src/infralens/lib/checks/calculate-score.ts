import {
  CHECK_WEIGHTS,
  isScoredStatus,
  STATUS_MULTIPLIER,
} from "./scoring-config";
import {
  CategoryScore,
  CheckCategory,
  CheckResult,
  GlobalScore,
} from "./types";

const CATEGORIES: CheckCategory[] = [
  "http-security",
  "network-dns",
  "infrastructure",
  "website-structure",
  "metadata-stack",
  "performance",
];

// --------------------
// Category score
// --------------------

/** A check's own point contribution — weight × status multiplier, rounded once here so this is the single source both the category total (below) and the per-check "+X pts" badge (`annotateScoring`) read from. Rounding per check and summing those (rather than summing raw fractional values and rounding once) guarantees the visible per-check badges always add up to exactly the category total shown next to them. */
function checkContribution(check: CheckResult): number {
  return Math.round(
    (CHECK_WEIGHTS[check.id] ?? 0) * STATUS_MULTIPLIER[check.status],
  );
}

/** A check counts toward a category's score only if it has a nonzero weight AND returned a genuine pass/warning/fail for this report — a weight-0 check (informational by design) or a normally-scoreable check that came back not-applicable/inconclusive/unavailable/error for this specific report are both excluded rather than counted as 0. */
function calculateCategoryScore(
  category: CheckCategory,
  checks: CheckResult[],
): CategoryScore {
  const scoredChecks = checks.filter(
    (check) =>
      check.category === category &&
      (CHECK_WEIGHTS[check.id] ?? 0) > 0 &&
      isScoredStatus(check.status),
  );

  if (scoredChecks.length === 0) {
    // Either every check in this category is informational by design (e.g.
    // Infrastructure/waf), or every normally-scoreable one is excluded for
    // this specific report — either way there's nothing to hold against the
    // category, so it's Informational (maxScore 0) rather than a fabricated
    // `0/x`.
    return { category, score: 0, maxScore: 0 };
  }

  const maxScore = scoredChecks.reduce(
    (acc, check) => acc + CHECK_WEIGHTS[check.id],
    0,
  );
  const score = scoredChecks.reduce(
    (acc, check) => acc + checkContribution(check),
    0,
  );

  return { category, score, maxScore };
}

// --------------------
// Global score
// --------------------

/** Best and worst score/maxScore ratio among categories that have a weight at all — the basis for `strongestCategory`/`topPriorityCategory`. */
function pickStrongestAndWeakest(categoryScores: CategoryScore[]): {
  strongest: CheckCategory | null;
  weakest: CheckCategory | null;
} {
  const withRatio = categoryScores
    .filter((c) => c.maxScore > 0)
    .map((c) => ({ category: c.category, ratio: c.score / c.maxScore }));

  if (withRatio.length === 0) {
    return { strongest: null, weakest: null };
  }

  const strongest = withRatio.reduce((best, c) =>
    c.ratio > best.ratio ? c : best,
  );
  const weakest = withRatio.reduce((worst, c) =>
    c.ratio < worst.ratio ? c : worst,
  );

  return { strongest: strongest.category, weakest: weakest.category };
}

export function calculateGlobalScore(checks: CheckResult[]): GlobalScore {
  const categoryScores = CATEGORIES.map((category) =>
    calculateCategoryScore(category, checks),
  );

  // Normal case: every normally-scoreable check landed on pass/warning/fail,
  // so `totalAvailable` is exactly 100 (CHECK_WEIGHTS' nonzero entries sum
  // to 100) and this is a plain earned/100 score. Normalization only
  // happens as a side effect when a normally-scoreable check is genuinely
  // excluded for this report — its weight drops out of `totalAvailable`
  // instead of being counted as a zero.
  const totalEarned = categoryScores.reduce((acc, c) => acc + c.score, 0);
  const totalAvailable = categoryScores.reduce((acc, c) => acc + c.maxScore, 0);
  const totalScore =
    totalAvailable > 0 ? Math.round((totalEarned / totalAvailable) * 100) : 0;

  const scoredCount = checks.filter(
    (c) => (CHECK_WEIGHTS[c.id] ?? 0) > 0 && isScoredStatus(c.status),
  ).length;
  // With nothing actually scored anywhere, every category ties at a 0/0
  // ratio — reporting one of them as "strongest" would be a meaningless,
  // order-dependent pick rather than a real signal.
  const { strongest, weakest } =
    scoredCount > 0
      ? pickStrongestAndWeakest(categoryScores)
      : { strongest: null, weakest: null };

  return {
    score: totalScore,
    grade: scoreToGrade(totalScore),
    categories: categoryScores,
    scoredCount,
    excludedCount: checks.length - scoredCount,
    strongestCategory: strongest,
    topPriorityCategory: weakest,
  };
}

// --------------------
// Per-check annotation
// --------------------

/** Fills in `scored`/`scoreContribution` on the final check list — each check's contribution now depends only on its own weight and status, not on how many sibling checks share its category. */
export function annotateScoring(checks: CheckResult[]): CheckResult[] {
  return checks.map((check) => {
    const weight = CHECK_WEIGHTS[check.id] ?? 0;
    const scored = weight > 0 && isScoredStatus(check.status);
    if (!scored) {
      return { ...check, scored, scoreContribution: undefined };
    }

    return { ...check, scored, scoreContribution: checkContribution(check) };
  });
}

// --------------------
// Grade mapping
// --------------------

function scoreToGrade(score: number): GlobalScore["grade"] {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "E";
}
