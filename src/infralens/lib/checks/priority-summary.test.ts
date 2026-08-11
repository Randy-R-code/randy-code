import { describe, expect, it } from "vitest";
import { derivePrioritySummary } from "./priority-summary";
import { CheckResult } from "./types";

function check(overrides: Partial<CheckResult>): CheckResult {
  return {
    id: "x",
    label: "X",
    category: "http-security",
    status: "pass",
    durationMs: 1,
    ...overrides,
  };
}

describe("derivePrioritySummary", () => {
  it("caps positives and priorities at 3 each", () => {
    const checks = [
      ...Array.from({ length: 5 }, (_, i) =>
        check({ id: `pass-${i}`, status: "pass", scoreContribution: i }),
      ),
      ...Array.from({ length: 5 }, (_, i) =>
        check({ id: `fail-${i}`, status: "fail" }),
      ),
    ];

    const result = derivePrioritySummary(checks);

    expect(result.positives).toHaveLength(3);
    expect(result.priorities).toHaveLength(3);
  });

  it("ranks positives by strongest score contribution first", () => {
    const checks = [
      check({ id: "low", status: "pass", scoreContribution: 2 }),
      check({ id: "high", status: "pass", scoreContribution: 9 }),
      check({ id: "mid", status: "pass", scoreContribution: 5 }),
    ];

    const result = derivePrioritySummary(checks);

    expect(result.positives.map((c) => c.id)).toEqual(["high", "mid", "low"]);
  });

  it("ranks fail above warning regardless of order", () => {
    const checks = [
      check({ id: "warn", status: "warning" }),
      check({ id: "fail", status: "fail" }),
    ];

    const result = derivePrioritySummary(checks);

    expect(result.priorities.map((c) => c.id)).toEqual(["fail", "warn"]);
  });

  it("breaks ties within the same status by recommendation severity", () => {
    const checks = [
      check({
        id: "warn-info",
        status: "warning",
        recommendation: {
          id: "r1",
          title: "t",
          description: "d",
          impact: "i",
          severity: "info",
        },
      }),
      check({
        id: "warn-critical",
        status: "warning",
        recommendation: {
          id: "r2",
          title: "t",
          description: "d",
          impact: "i",
          severity: "critical",
        },
      }),
    ];

    const result = derivePrioritySummary(checks);

    expect(result.priorities.map((c) => c.id)).toEqual([
      "warn-critical",
      "warn-info",
    ]);
  });

  it("counts info/unavailable/error checks as unavailable", () => {
    const checks = [
      check({ status: "pass" }),
      check({ status: "info" }),
      check({ status: "unavailable" }),
      check({ status: "error" }),
    ];

    const result = derivePrioritySummary(checks);

    expect(result.unavailableCount).toBe(3);
  });

  it("returns empty arrays and zero count for an empty check list", () => {
    const result = derivePrioritySummary([]);

    expect(result).toEqual({
      positives: [],
      priorities: [],
      unavailableCount: 0,
    });
  });
});
