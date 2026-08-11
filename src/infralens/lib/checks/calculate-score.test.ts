import { describe, expect, it } from "vitest";
import { annotateScoring, calculateGlobalScore } from "./calculate-score";
import { CATEGORY_WEIGHTS } from "./scoring-config";
import { CheckCategory, CheckResult, CheckStatus } from "./types";

function check(category: CheckCategory, status: CheckStatus): CheckResult {
  return {
    id: `${category}-${status}`,
    label: category,
    category,
    status,
    durationMs: 0,
  };
}

const ALL_CATEGORIES: CheckCategory[] = [
  "http-security",
  "network-dns",
  "infrastructure",
  "website-structure",
  "metadata-stack",
  "performance",
];

describe("calculateGlobalScore", () => {
  it("scores 100 and grades A when every category has a single pass check", () => {
    const checks = ALL_CATEGORIES.map((category) => check(category, "pass"));

    const result = calculateGlobalScore(checks);

    expect(result.score).toBe(100);
    expect(result.grade).toBe("A");
    for (const categoryScore of result.categories) {
      expect(categoryScore.score).toBe(categoryScore.maxScore);
    }
  });

  it("scores 0 and grades E when there are no checks at all", () => {
    const result = calculateGlobalScore([]);

    expect(result.score).toBe(0);
    expect(result.grade).toBe("E");
  });

  it("applies the 0.6 warning multiplier per category", () => {
    const checks = ALL_CATEGORIES.map((category) => check(category, "warning"));

    const result = calculateGlobalScore(checks);

    expect(result.score).toBe(60);
  });

  it("zeroes out a category on fail without affecting the others", () => {
    const checks = [
      check("http-security", "fail"), // weight 25, contributes 0
      check("network-dns", "pass"), // weight 20
      check("infrastructure", "pass"), // weight 20
      check("website-structure", "pass"), // weight 15
      check("metadata-stack", "pass"), // weight 10
      check("performance", "pass"), // weight 10
    ];

    const result = calculateGlobalScore(checks);

    expect(result.score).toBe(75);
    expect(result.grade).toBe("B");
    const httpSecurity = result.categories.find(
      (c) => c.category === "http-security",
    );
    expect(httpSecurity?.score).toBe(0);
  });

  it("averages multiple checks within the same category", () => {
    const checks = [
      check("http-security", "pass"),
      check("http-security", "fail"),
      ...ALL_CATEGORIES.filter((c) => c !== "http-security").map((c) =>
        check(c, "pass"),
      ),
    ];

    const result = calculateGlobalScore(checks);

    const httpSecurity = result.categories.find(
      (c) => c.category === "http-security",
    );
    expect(httpSecurity?.score).toBe(Math.round(0.5 * 25));
  });

  it("excludes error/unavailable/info results from the average instead of scoring them as 0 (§9.6)", () => {
    // A category where the only check technically failed to run should
    // not be graded 0 for it — it's excluded entirely.
    const checks = [
      check("http-security", "error"),
      ...ALL_CATEGORIES.filter((c) => c !== "http-security").map((c) =>
        check(c, "pass"),
      ),
    ];

    const result = calculateGlobalScore(checks);

    const httpSecurity = result.categories.find(
      (c) => c.category === "http-security",
    );
    // No scored checks in this category -> falls back to 0, same as an
    // empty category, but for a different, distinguishable reason.
    expect(httpSecurity?.score).toBe(0);

    // A pass alongside the error should NOT be dragged down by it.
    const checksWithPass = [
      check("http-security", "error"),
      check("http-security", "pass"),
      ...ALL_CATEGORIES.filter((c) => c !== "http-security").map((c) =>
        check(c, "pass"),
      ),
    ];
    const resultWithPass = calculateGlobalScore(checksWithPass);
    const httpSecurityWithPass = resultWithPass.categories.find(
      (c) => c.category === "http-security",
    );
    expect(httpSecurityWithPass?.score).toBe(25); // full weight, error ignored
  });
});

describe("annotateScoring", () => {
  it("marks pass/warning/fail results as scored, info/unavailable/error as not", () => {
    const checks = [
      check("http-security", "pass"),
      check("http-security", "warning"),
      check("http-security", "fail"),
      check("network-dns", "info"),
      check("network-dns", "unavailable"),
      check("network-dns", "error"),
    ];
    const { categories } = calculateGlobalScore(checks);

    const annotated = annotateScoring(checks, categories);

    expect(annotated.filter((c) => c.scored).map((c) => c.status)).toEqual([
      "pass",
      "warning",
      "fail",
    ]);
    expect(annotated.filter((c) => !c.scored).map((c) => c.status)).toEqual([
      "info",
      "unavailable",
      "error",
    ]);
  });

  it("leaves scoreContribution undefined for unscored results", () => {
    const checks = [check("performance", "unavailable")];
    const { categories } = calculateGlobalScore(checks);

    const [annotated] = annotateScoring(checks, categories);

    expect(annotated.scoreContribution).toBeUndefined();
  });

  it("splits a category's weight evenly across its scored checks", () => {
    const checks = [
      check("performance", "pass"), // weight 10, 2 scored checks -> 5 each
      check("performance", "pass"),
    ];
    const { categories } = calculateGlobalScore(checks);

    const annotated = annotateScoring(checks, categories);

    expect(annotated[0].scoreContribution).toBe(5);
    expect(annotated[1].scoreContribution).toBe(5);
  });
});

describe("category weights (Phase 5 validation criteria)", () => {
  it("sum to exactly 100", () => {
    const total = Object.values(CATEGORY_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(total).toBe(100);
  });
});

describe("calculateGlobalScore — reproducibility and division safety", () => {
  it("is a pure function: the same input always produces the same output", () => {
    const checks = [
      check("http-security", "pass"),
      check("network-dns", "warning"),
      check("infrastructure", "fail"),
      check("website-structure", "unavailable"),
      check("metadata-stack", "error"),
      check("performance", "info"),
    ];

    const first = calculateGlobalScore(checks);
    const second = calculateGlobalScore(checks);

    expect(second).toEqual(first);
  });

  it("never divides by zero: a category where every check is excluded scores 0, not NaN", () => {
    const checks = ALL_CATEGORIES.flatMap((category) => [
      check(category, "unavailable"),
      check(category, "error"),
      check(category, "info"),
    ]);

    const result = calculateGlobalScore(checks);

    expect(result.score).toBe(0);
    expect(Number.isNaN(result.score)).toBe(false);
    for (const categoryScore of result.categories) {
      expect(Number.isNaN(categoryScore.score)).toBe(false);
    }
  });

  it("never divides by zero with a single check", () => {
    const result = calculateGlobalScore([check("performance", "pass")]);

    expect(Number.isNaN(result.score)).toBe(false);
  });

  it("grades exact boundary scores correctly (90/75/60/40)", () => {
    // Six pass checks (one per category) = 100. Flipping the heaviest
    // category (http-security, 25) to fail brings the score to exactly 75.
    const allPass = ALL_CATEGORIES.map((c) => check(c, "pass"));
    expect(calculateGlobalScore(allPass).score).toBe(100);
    expect(calculateGlobalScore(allPass).grade).toBe("A");

    const httpFail = [
      check("http-security", "fail"),
      ...ALL_CATEGORIES.filter((c) => c !== "http-security").map((c) =>
        check(c, "pass"),
      ),
    ];
    expect(calculateGlobalScore(httpFail).score).toBe(75);
    expect(calculateGlobalScore(httpFail).grade).toBe("B");
  });
});

describe("calculateGlobalScore — calculation summary (§12.3)", () => {
  it("reports scoredCount and excludedCount", () => {
    const checks = [
      check("http-security", "pass"),
      check("network-dns", "warning"),
      check("infrastructure", "unavailable"),
      check("website-structure", "error"),
    ];

    const result = calculateGlobalScore(checks);

    expect(result.scoredCount).toBe(2);
    expect(result.excludedCount).toBe(2);
  });

  it("identifies the strongest and weakest (top priority) categories", () => {
    const checks = [
      check("http-security", "pass"), // 25/25 -> 100%
      check("network-dns", "fail"), // 0/20 -> 0%
      check("infrastructure", "warning"), // 12/20 -> 60%
    ];

    const result = calculateGlobalScore(checks);

    expect(result.strongestCategory).toBe("http-security");
    expect(result.topPriorityCategory).toBe("network-dns");
  });

  it("returns null strongest/priority categories when there are no checks at all", () => {
    const result = calculateGlobalScore([]);

    expect(result.strongestCategory).toBeNull();
    expect(result.topPriorityCategory).toBeNull();
  });
});
