import { CATEGORY_LABELS } from "./category-labels";
import { CategoryScore, CheckCategory, CheckResult } from "./types";

export type CategorySection = {
  category: CategoryScore;
  checks: CheckResult[];
};

// Canonical, weight-derived, stable order.
const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS) as CheckCategory[];

/**
 * Groups checks by category in stable order. Driven by which categories
 * actually have checks, not by `categories` alone — `categories` can
 * legitimately be empty (e.g. the single-check error response from
 * `parse-error.ts` has no computed score) while still having a check that
 * needs to be shown somewhere rather than silently dropped.
 */
export function groupChecksByCategory(
  categories: CategoryScore[],
  checks: CheckResult[],
): CategorySection[] {
  const scoreByCategory = new Map(categories.map((c) => [c.category, c]));
  const presentCategories = new Set(checks.map((c) => c.category));

  return CATEGORY_ORDER.filter((cat) => presentCategories.has(cat)).map(
    (cat) => ({
      category: scoreByCategory.get(cat) ?? {
        category: cat,
        score: 0,
        maxScore: 0,
      },
      checks: checks.filter((c) => c.category === cat),
    }),
  );
}
