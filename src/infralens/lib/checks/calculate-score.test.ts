import { describe, expect, it } from "vitest";
import { annotateScoring, calculateGlobalScore } from "./calculate-score";
import { CHECK_WEIGHTS } from "./scoring-config";
import { CheckCategory, CheckResult, CheckStatus } from "./types";

/** Every real check id mapped to its real category — mirrors `run-checks.ts`'s `CHECKS` list and `scoring-config.ts`'s `CHECK_WEIGHTS`, so tests exercise the actual model instead of a synthetic one. */
const CHECK_CATEGORIES: Record<string, CheckCategory> = {
  https: "http-security",
  headers: "http-security",
  "security-txt": "http-security",
  redirects: "http-security",
  "dns-security": "network-dns",
  "dns-records": "network-dns",
  "ip-hosting": "network-dns",
  dkim: "network-dns",
  dnssec: "network-dns",
  waf: "infrastructure",
  robots: "website-structure",
  sitemap: "website-structure",
  links: "website-structure",
  accessibility: "metadata-stack",
  metadata: "metadata-stack",
  "server-headers": "metadata-stack",
  social: "metadata-stack",
  stack: "metadata-stack",
  reachability: "performance",
  performance: "performance",
};

const ALL_IDS = Object.keys(CHECK_WEIGHTS);

function check(id: string, status: CheckStatus): CheckResult {
  return {
    id,
    label: id,
    category: CHECK_CATEGORIES[id],
    status,
    durationMs: 0,
  };
}

/** All 18 real checks, every one passing — the model's own "everything is fine" baseline. */
function allPassChecks(): CheckResult[] {
  return ALL_IDS.map((id) => check(id, "pass"));
}

/** Swaps a single check's status in an otherwise-all-pass report. */
function withStatus(id: string, status: CheckStatus): CheckResult[] {
  return ALL_IDS.map((checkId) =>
    checkId === id ? check(id, status) : check(checkId, "pass"),
  );
}

describe("scoring invariants", () => {
  it("A. all scored checks pass => exactly 100/100", () => {
    const result = calculateGlobalScore(allPassChecks());
    expect(result.score).toBe(100);
    expect(result.grade).toBe("A");
  });

  it("B. informational checks present (waf/stack/ip-hosting) => still 100/100 if every scored check passes", () => {
    // allPassChecks() already includes waf/stack/ip-hosting as "pass" (their
    // own code always returns "info" in practice, but even if they returned
    // pass, weight 0 keeps them out of the score entirely).
    const checks = allPassChecks();
    const result = calculateGlobalScore(checks);
    expect(result.score).toBe(100);
    const infra = result.categories.find(
      (c) => c.category === "infrastructure",
    );
    expect(infra?.maxScore).toBe(0);
  });

  it("C. informational-only category (infrastructure/waf) shows no score/max, not 0/x", () => {
    const checks = withStatus("waf", "info");
    const result = calculateGlobalScore(checks);
    const infra = result.categories.find(
      (c) => c.category === "infrastructure",
    );
    expect(infra?.maxScore).toBe(0);
    expect(infra?.score).toBe(0);
    // The rest of the report is unaffected — this is not the old `0/20` bug.
    expect(result.score).toBe(100);
  });

  it("D. one scored warning => exact expected point loss", () => {
    const checks = withStatus("https", "warning");
    const result = calculateGlobalScore(checks);
    // https weight 18 at the 0.6 warning multiplier earns 10.8 instead of
    // 18 — http-security's category score is Math.round(37.8) = 38 (10.8 +
    // the other 3 http-security checks' full 27), so the category loses 7
    // points off its 45 max; every other category stays at full weight.
    // 100 - 7 = 93.
    expect(result.score).toBe(93);
  });

  it("E. one scored fail => exact expected point loss", () => {
    const checks = withStatus("headers", "fail");
    const result = calculateGlobalScore(checks);
    // headers weight 16, fail multiplier 0 -> 100 - 16 = 84.
    expect(result.score).toBe(84);
  });

  it("F. mixed scored + informational category (network-dns: dns-security/dns-records/dkim/dnssec scored, ip-hosting informational)", () => {
    const checks = allPassChecks();
    const result = calculateGlobalScore(checks);
    const dns = result.categories.find((c) => c.category === "network-dns");
    // dns-security(8) + dns-records(2) + dkim(2) + dnssec(2) = 14;
    // ip-hosting excluded (weight 0).
    expect(dns?.maxScore).toBe(14);
    expect(dns?.score).toBe(14);
  });

  it("G. inconclusive normally-scored check => denominator fallback normalization", () => {
    const checks = withStatus("dns-security", "inconclusive");
    const result = calculateGlobalScore(checks);
    // dns-security's weight (8) drops out of both earned and available:
    // 92/92 * 100 = 100, not 92/100.
    expect(result.score).toBe(100);
    const dns = result.categories.find((c) => c.category === "network-dns");
    // dns-records(2) + dkim(2) + dnssec(2) are the checks left scored here.
    expect(dns?.maxScore).toBe(6);
  });

  it("H. unavailable normally-scored check => denominator fallback normalization", () => {
    const checks = withStatus("performance", "unavailable");
    const result = calculateGlobalScore(checks);
    // performance's weight (6) drops out of both earned and available.
    expect(result.score).toBe(100);
  });

  it("I. not-applicable check => denominator fallback normalization", () => {
    const checks = withStatus("dns-records", "not-applicable");
    const result = calculateGlobalScore(checks);
    expect(result.score).toBe(100);
  });

  it("J. scanner error not caused by site => no automatic penalty", () => {
    const checks = withStatus("robots", "error");
    const result = calculateGlobalScore(checks);
    expect(result.score).toBe(100);
  });

  it("K. category totals equal the sum of their scoreable checks", () => {
    const result = calculateGlobalScore(allPassChecks());
    const expected: Record<CheckCategory, number> = {
      "http-security": 45, // https 18 + headers 16 + security-txt 4 + redirects 7
      "network-dns": 14, // dns-security 8 + dns-records 2 + dkim 2 + dnssec 2 (ip-hosting excluded)
      infrastructure: 0, // waf excluded
      "website-structure": 11, // robots 4 + sitemap 4 + links 3
      "metadata-stack": 17, // accessibility 6 + metadata 5 + server-headers 4 + social 2 (stack excluded)
      performance: 13, // reachability 7 + performance 6
    };
    for (const categoryScore of result.categories) {
      expect(categoryScore.maxScore).toBe(expected[categoryScore.category]);
    }
  });

  it("L. normal total available weight equals exactly 100", () => {
    const total = Object.values(CHECK_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(total).toBe(100);
  });

  it("M. no legacy fixed category budget affects score — an empty category never reserves points", () => {
    // Infrastructure has weight 0 across all its checks; removing it
    // entirely from the report changes nothing about the other categories'
    // math (the old model reserved a fixed 20-point budget for it no matter
    // what).
    const withoutWaf = allPassChecks().filter((c) => c.id !== "waf");
    const result = calculateGlobalScore(withoutWaf);
    expect(result.score).toBe(100);
  });

  it("per-check score badges always sum to exactly the category total shown next to them", () => {
    // website-structure: robots(4) and sitemap(4) both warning (0.6 ->
    // 2.4, rounds to 2 each), links(3) passing. Regression guard for a real
    // bug: category total used to round the raw 2.4+2.4+3=7.8 sum once
    // (-> 8), while the visible per-check badges rounded individually
    // (2+2+3=7) — the two could visibly disagree by a point.
    const checks = withStatus("robots", "warning").map((c) =>
      c.id === "sitemap" ? check("sitemap", "warning") : c,
    );
    const result = calculateGlobalScore(checks);
    const annotated = annotateScoring(checks);

    const websiteStructure = result.categories.find(
      (c) => c.category === "website-structure",
    );
    const badgeSum = annotated
      .filter((c) => c.category === "website-structure" && c.scored)
      .reduce((acc, c) => acc + (c.scoreContribution ?? 0), 0);

    expect(websiteStructure?.score).toBe(badgeSum);
    expect(websiteStructure?.score).toBe(7); // round(2.4)+round(2.4)+3, not round(2.4+2.4+3)
  });

  it("global earned never exceeds effective available", () => {
    const checks = [...withStatus("https", "warning")];
    const result = calculateGlobalScore(checks);
    for (const c of result.categories) {
      expect(c.score).toBeLessThanOrEqual(c.maxScore);
    }
  });

  it("global normalized score never exceeds 100", () => {
    const scenarios = [
      allPassChecks(),
      withStatus("https", "warning"),
      withStatus("headers", "fail"),
      withStatus("dns-security", "inconclusive"),
      ALL_IDS.map((id) => check(id, "unavailable")),
    ];
    for (const checks of scenarios) {
      const result = calculateGlobalScore(checks);
      expect(result.score).toBeLessThanOrEqual(100);
    }
  });
});

describe("calculateGlobalScore — reproducibility and division safety", () => {
  it("is a pure function: the same input always produces the same output", () => {
    const checks = allPassChecks();
    const first = calculateGlobalScore(checks);
    const second = calculateGlobalScore(checks);
    expect(second).toEqual(first);
  });

  it("scores 0, not NaN, when there are no checks at all", () => {
    const result = calculateGlobalScore([]);
    expect(result.score).toBe(0);
    expect(result.grade).toBe("E");
    expect(Number.isNaN(result.score)).toBe(false);
  });

  it("never divides by zero: a category where every check is excluded scores 0/0, not NaN", () => {
    const checks = ALL_IDS.map((id) => check(id, "unavailable"));
    const result = calculateGlobalScore(checks);
    expect(result.score).toBe(0);
    expect(Number.isNaN(result.score)).toBe(false);
    for (const categoryScore of result.categories) {
      expect(Number.isNaN(categoryScore.score)).toBe(false);
      expect(categoryScore.maxScore).toBe(0);
    }
  });

  it("grades exact boundary scores correctly (90/75/60/40)", () => {
    expect(calculateGlobalScore(allPassChecks()).grade).toBe("A");
    // https(18) + headers(16) failing = 100 - 34 = 66 -> C.
    const bothFail = withStatus("https", "fail").map((c) =>
      c.id === "headers" ? check("headers", "fail") : c,
    );
    expect(calculateGlobalScore(bothFail).score).toBe(66);
    expect(calculateGlobalScore(bothFail).grade).toBe("C");
  });
});

describe("calculateGlobalScore — calculation summary", () => {
  it("reports scoredCount and excludedCount", () => {
    // 20 checks total; waf/stack/ip-hosting are weight-0 and stay excluded
    // regardless of status, even though allPassChecks() sets them to "pass"
    // like everything else here — 17 nonzero-weight checks are scored.
    const checks = allPassChecks();
    const result = calculateGlobalScore(checks);
    expect(result.scoredCount).toBe(17);
    expect(result.excludedCount).toBe(3);
  });

  it("identifies the strongest and weakest (top priority) categories", () => {
    const checks = withStatus("https", "fail"); // drags http-security down
    const result = calculateGlobalScore(checks);
    expect(result.topPriorityCategory).toBe("http-security");
  });

  it("returns null strongest/priority categories when there are no checks at all", () => {
    const result = calculateGlobalScore([]);
    expect(result.strongestCategory).toBeNull();
    expect(result.topPriorityCategory).toBeNull();
  });
});

describe("annotateScoring", () => {
  it("marks nonzero-weight pass/warning/fail results as scored; weight-0 and other statuses as not", () => {
    const checks = [
      check("https", "pass"),
      check("headers", "warning"),
      check("redirects", "fail"),
      check("waf", "info"), // weight 0 -> never scored
      check("dns-security", "inconclusive"),
      check("performance", "unavailable"),
      check("robots", "error"),
    ];

    const annotated = annotateScoring(checks);

    expect(annotated.filter((c) => c.scored).map((c) => c.id)).toEqual([
      "https",
      "headers",
      "redirects",
    ]);
    expect(annotated.filter((c) => !c.scored).map((c) => c.id)).toEqual([
      "waf",
      "dns-security",
      "performance",
      "robots",
    ]);
  });

  it("leaves scoreContribution undefined for unscored results", () => {
    const [annotated] = annotateScoring([check("performance", "unavailable")]);
    expect(annotated.scoreContribution).toBeUndefined();
  });

  it("gives each scored check its own weight as scoreContribution — no longer split across category siblings", () => {
    const checks = [
      check("reachability", "pass"),
      check("performance", "pass"),
    ];
    const annotated = annotateScoring(checks);
    expect(annotated[0].scoreContribution).toBe(CHECK_WEIGHTS.reachability);
    expect(annotated[1].scoreContribution).toBe(CHECK_WEIGHTS.performance);
  });

  it("applies the warning multiplier to scoreContribution", () => {
    const [annotated] = annotateScoring([check("https", "warning")]);
    expect(annotated.scoreContribution).toBe(
      Math.round(CHECK_WEIGHTS.https * 0.6),
    );
  });
});
