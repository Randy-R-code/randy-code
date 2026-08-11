import { CheckResult } from "./types";

export const RESULT_FILTERS = [
  "all",
  "needs-attention",
  "passed",
  "informational",
  "unavailable",
] as const;

export type ResultFilter = (typeof RESULT_FILTERS)[number];

export const FILTER_LABELS: Record<ResultFilter, string> = {
  all: "All",
  "needs-attention": "Needs attention",
  passed: "Passed",
  informational: "Informational",
  unavailable: "Unavailable",
};

/** Pure so it's directly testable (master plan §14.6). */
export function filterChecks(
  checks: CheckResult[],
  filter: ResultFilter,
): CheckResult[] {
  switch (filter) {
    case "all":
      return checks;
    case "needs-attention":
      return checks.filter(
        (c) => c.status === "fail" || c.status === "warning",
      );
    case "passed":
      return checks.filter((c) => c.status === "pass");
    case "informational":
      return checks.filter((c) => c.status === "info");
    case "unavailable":
      return checks.filter(
        (c) => c.status === "unavailable" || c.status === "error",
      );
  }
}
