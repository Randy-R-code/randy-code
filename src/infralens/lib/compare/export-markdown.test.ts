import { describe, expect, it } from "vitest";
import { InfraLensExport } from "../checks/export";
import { compareExports } from "./diff";
import { buildComparisonMarkdown } from "./export-markdown";

const before: InfraLensExport = {
  url: "https://example.com",
  scannedAt: "2026-01-01T00:00:00.000Z",
  score: 70,
  grade: "C",
  version: "2.0.0",
  categories: [{ category: "http-security", score: 15, maxScore: 25 }],
  checks: [
    {
      id: "headers",
      label: "HTTP Security Headers",
      category: "http-security",
      status: "fail",
      durationMs: 0,
    },
  ],
};

const after: InfraLensExport = {
  ...before,
  scannedAt: "2026-02-01T00:00:00.000Z",
  score: 84,
  grade: "B",
  checks: [
    {
      id: "headers",
      label: "HTTP Security Headers",
      category: "http-security",
      status: "pass",
      durationMs: 0,
    },
  ],
};

describe("buildComparisonMarkdown", () => {
  it("includes both URLs, the score delta, and the category table", () => {
    const outcome = compareExports(before, after);
    if (!outcome.compatible) throw new Error("expected compatible outcome");

    const md = buildComparisonMarkdown(before, after, outcome.result);

    expect(md).toContain("https://example.com");
    expect(md).toContain("Score change: +14");
    expect(md).toContain("| Category | A | B | Change |");
  });

  it("lists the improved check under Improvements, not Regressions", () => {
    const outcome = compareExports(before, after);
    if (!outcome.compatible) throw new Error("expected compatible outcome");

    const md = buildComparisonMarkdown(before, after, outcome.result);

    expect(md).toContain("## Improvements");
    expect(md).toContain("HTTP Security Headers");
    expect(md).not.toContain("## Regressions");
  });

  it("omits empty sections rather than printing empty headings", () => {
    const outcome = compareExports(before, before);
    if (!outcome.compatible) throw new Error("expected compatible outcome");

    const md = buildComparisonMarkdown(before, before, outcome.result);

    expect(md).not.toContain("## Improvements");
    expect(md).not.toContain("## Regressions");
    expect(md).not.toContain("## New checks in B");
  });
});
