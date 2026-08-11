import { describe, expect, it } from "vitest";
import { groupChecksByCategory } from "./category-sections";
import { CheckResult } from "./types";

function check(id: string, category: CheckResult["category"]): CheckResult {
  return { id, label: id, category, status: "pass", durationMs: 1 };
}

describe("groupChecksByCategory", () => {
  it("still shows checks when categories is empty (parse-error.ts's shape)", () => {
    const checks = [check("error", "http-security")];

    const sections = groupChecksByCategory([], checks);

    expect(sections).toHaveLength(1);
    expect(sections[0].category.category).toBe("http-security");
    expect(sections[0].category.score).toBe(0);
    expect(sections[0].checks.map((c) => c.id)).toEqual(["error"]);
  });

  it("groups checks under their real category score when available", () => {
    const checks = [check("a", "http-security"), check("b", "performance")];
    const categories = [
      { category: "http-security" as const, score: 20, maxScore: 25 },
      { category: "performance" as const, score: 10, maxScore: 10 },
    ];

    const sections = groupChecksByCategory(categories, checks);

    expect(sections.map((s) => s.category.category)).toEqual([
      "http-security",
      "performance",
    ]);
    expect(sections[0].category.score).toBe(20);
  });

  it("keeps the canonical category order regardless of check/category input order", () => {
    const checks = [
      check("a", "performance"),
      check("b", "http-security"),
      check("c", "network-dns"),
    ];

    const sections = groupChecksByCategory([], checks);

    expect(sections.map((s) => s.category.category)).toEqual([
      "http-security",
      "network-dns",
      "performance",
    ]);
  });

  it("omits categories with no checks even if a score exists for them", () => {
    const checks = [check("a", "http-security")];
    const categories = [
      { category: "http-security" as const, score: 20, maxScore: 25 },
      { category: "performance" as const, score: 10, maxScore: 10 },
    ];

    const sections = groupChecksByCategory(categories, checks);

    expect(sections).toHaveLength(1);
  });
});
