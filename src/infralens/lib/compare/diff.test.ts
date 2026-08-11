import { describe, expect, it } from "vitest";
import { InfraLensExport } from "../checks/export";
import { compareExports } from "./diff";

function makeExport(overrides: Partial<InfraLensExport> = {}): InfraLensExport {
  return {
    url: "https://example.com",
    scannedAt: "2026-01-01T00:00:00.000Z",
    score: 70,
    grade: "C",
    version: "2.0.0",
    categories: [
      { category: "http-security", score: 15, maxScore: 25 },
      { category: "network-dns", score: 20, maxScore: 20 },
    ],
    checks: [
      {
        id: "headers",
        label: "HTTP Security Headers",
        category: "http-security",
        status: "fail",
        durationMs: 10,
      },
      {
        id: "dns-records",
        label: "DNS Records",
        category: "network-dns",
        status: "pass",
        durationMs: 5,
      },
      {
        id: "waf",
        label: "Firewall / WAF Detection",
        category: "infrastructure",
        status: "info",
        durationMs: 5,
      },
    ],
    ...overrides,
  };
}

describe("compareExports", () => {
  it("refuses to compare incompatible major schema versions", () => {
    const before = makeExport({ version: "1.4.0" });
    const after = makeExport({ version: "2.0.0" });

    const outcome = compareExports(before, after);

    expect(outcome.compatible).toBe(false);
    if (!outcome.compatible) {
      expect(outcome.reason).toContain("1.4.0");
      expect(outcome.reason).toContain("2.0.0");
    }
  });

  it("classifies fail -> pass as improved and pass -> fail as regressed", () => {
    const before = makeExport({
      checks: [
        {
          id: "a",
          label: "A",
          category: "http-security",
          status: "fail",
          durationMs: 0,
        },
        {
          id: "b",
          label: "B",
          category: "http-security",
          status: "pass",
          durationMs: 0,
        },
      ],
    });
    const after = makeExport({
      checks: [
        {
          id: "a",
          label: "A",
          category: "http-security",
          status: "pass",
          durationMs: 0,
        },
        {
          id: "b",
          label: "B",
          category: "http-security",
          status: "fail",
          durationMs: 0,
        },
      ],
    });

    const outcome = compareExports(before, after);
    expect(outcome.compatible).toBe(true);
    if (!outcome.compatible) return;

    const byId = Object.fromEntries(
      outcome.result.checks.map((c) => [c.id, c]),
    );
    expect(byId.a.kind).toBe("improved");
    expect(byId.b.kind).toBe("regressed");
  });

  it("never calls a transition touching info/unavailable/error an improvement or regression", () => {
    const before = makeExport({
      checks: [
        {
          id: "a",
          label: "A",
          category: "http-security",
          status: "error",
          durationMs: 0,
        },
      ],
    });
    const after = makeExport({
      checks: [
        {
          id: "a",
          label: "A",
          category: "http-security",
          status: "pass",
          durationMs: 0,
        },
      ],
    });

    const outcome = compareExports(before, after);
    expect(outcome.compatible).toBe(true);
    if (!outcome.compatible) return;

    expect(outcome.result.checks[0].kind).toBe("changed");
  });

  it("marks a check missing from the other report as added/removed, not silently dropped", () => {
    const before = makeExport({
      checks: [
        {
          id: "old-check",
          label: "Old",
          category: "http-security",
          status: "pass",
          durationMs: 0,
        },
      ],
    });
    const after = makeExport({
      checks: [
        {
          id: "new-check",
          label: "New",
          category: "http-security",
          status: "pass",
          durationMs: 0,
        },
      ],
    });

    const outcome = compareExports(before, after);
    expect(outcome.compatible).toBe(true);
    if (!outcome.compatible) return;

    const byId = Object.fromEntries(
      outcome.result.checks.map((c) => [c.id, c]),
    );
    expect(byId["old-check"].kind).toBe("removed");
    expect(byId["old-check"].after).toBeNull();
    expect(byId["new-check"].kind).toBe("added");
    expect(byId["new-check"].before).toBeNull();
  });

  it("computes the category score delta and total score delta", () => {
    const before = makeExport({ score: 70 });
    const after = makeExport({ score: 84 });

    const outcome = compareExports(before, after);
    expect(outcome.compatible).toBe(true);
    if (!outcome.compatible) return;

    expect(outcome.result.scoreDelta).toBe(14);
    const httpSecurity = outcome.result.categories.find(
      (c) => c.category === "http-security",
    );
    expect(httpSecurity?.delta).toBe(0);
  });

  it("is symmetric-safe: identical reports produce only unchanged checks and a zero delta", () => {
    const report = makeExport();
    const outcome = compareExports(report, report);
    expect(outcome.compatible).toBe(true);
    if (!outcome.compatible) return;

    expect(outcome.result.scoreDelta).toBe(0);
    expect(outcome.result.checks.every((c) => c.kind === "unchanged")).toBe(
      true,
    );
  });
});
