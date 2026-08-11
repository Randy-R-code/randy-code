import {
  CATEGORY_WEIGHTS,
  isScoredStatus,
  STATUS_MULTIPLIER,
} from "./scoring-config";
import {
  CategoryScore,
  CheckCategory,
  CheckResult,
  GlobalScore,
} from "./types";

// --------------------
// Category score
// --------------------

function calculateCategoryScore(
  category: CheckCategory,
  checks: CheckResult[],
): CategoryScore {
  // Only results that represent a real assessment count toward the
  // average — a check that merely failed to execute (`error`) or
  // couldn't get a real answer (`unavailable`/`info`) is excluded rather
  // than treated as a failing grade (master plan §9.6, backlog P0 "score
  // excluant indisponibles").
  const categoryChecks = checks.filter(
    (check) => check.category === category && isScoredStatus(check.status),
  );

  if (categoryChecks.length === 0) {
    return {
      category,
      score: 0,
      maxScore: CATEGORY_WEIGHTS[category],
    };
  }

  const total = categoryChecks.reduce((acc, check) => {
    return acc + STATUS_MULTIPLIER[check.status];
  }, 0);

  const average = total / categoryChecks.length;

  const weightedScore = Math.round(average * CATEGORY_WEIGHTS[category]);

  return {
    category,
    score: weightedScore,
    maxScore: CATEGORY_WEIGHTS[category],
  };
}

// --------------------
// Global score
// --------------------

/** Best and worst score/maxScore ratio among categories that have a weight at all — the basis for `strongestCategory`/`topPriorityCategory` (master plan §12.3). */
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
  const categories = Object.keys(CATEGORY_WEIGHTS) as CheckCategory[];

  const categoryScores = categories.map((category) =>
    calculateCategoryScore(category, checks),
  );

  const totalScore = categoryScores.reduce((acc, c) => acc + c.score, 0);
  const scoredCount = checks.filter((c) => isScoredStatus(c.status)).length;
  // With nothing actually scored anywhere, every category ties at a 0/weight
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

/**
 * Fills in `scored`/`scoreContribution` on the final check list, once the
 * category scores are known — a single check can't know its own
 * contribution in isolation, since that depends on how many sibling
 * checks in its category are also scored (master plan §10.1).
 */
export function annotateScoring(
  checks: CheckResult[],
  categories: CategoryScore[],
): CheckResult[] {
  const scoredCountByCategory = new Map<CheckCategory, number>();
  for (const check of checks) {
    if (isScoredStatus(check.status)) {
      scoredCountByCategory.set(
        check.category,
        (scoredCountByCategory.get(check.category) ?? 0) + 1,
      );
    }
  }

  const weightByCategory = new Map(
    categories.map((c) => [c.category, c.maxScore]),
  );

  return checks.map((check) => {
    const scored = isScoredStatus(check.status);
    if (!scored) {
      return { ...check, scored, scoreContribution: undefined };
    }

    const scoredCount = scoredCountByCategory.get(check.category) ?? 1;
    const categoryWeight = weightByCategory.get(check.category) ?? 0;
    const scoreContribution = Math.round(
      (STATUS_MULTIPLIER[check.status] * categoryWeight) / scoredCount,
    );

    return { ...check, scored, scoreContribution };
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
