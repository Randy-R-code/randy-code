import { CheckResult } from "./types";

export type PrioritySummary = {
  /** Up to 3 `pass` checks worth reassuring the visitor about, strongest contribution first. */
  positives: CheckResult[];
  /** Up to 3 `fail`/`warning` checks worth fixing first, most severe first. */
  priorities: CheckResult[];
  /** Checks that ran but didn't produce a scored verdict (`info`/`unavailable`/`error`). */
  unavailableCount: number;
};

const SEVERITY_RANK: Record<string, number> = {
  critical: 2,
  warning: 1,
  info: 0,
};

const STATUS_RANK: Record<string, number> = {
  fail: 2,
  warning: 1,
};

/** Pure so it's directly testable without React (master plan §14.2 "Résumé prioritaire"). */
export function derivePrioritySummary(checks: CheckResult[]): PrioritySummary {
  const positives = checks
    .filter((c) => c.status === "pass")
    .slice()
    .sort((a, b) => (b.scoreContribution ?? 0) - (a.scoreContribution ?? 0))
    .slice(0, 3);

  const priorities = checks
    .filter((c) => c.status === "fail" || c.status === "warning")
    .slice()
    .sort((a, b) => {
      const statusDelta = STATUS_RANK[b.status] - STATUS_RANK[a.status];
      if (statusDelta !== 0) return statusDelta;
      const severityDelta =
        (SEVERITY_RANK[b.recommendation?.severity ?? "info"] ?? 0) -
        (SEVERITY_RANK[a.recommendation?.severity ?? "info"] ?? 0);
      if (severityDelta !== 0) return severityDelta;
      return (a.scoreContribution ?? 0) - (b.scoreContribution ?? 0);
    })
    .slice(0, 3);

  const unavailableCount = checks.filter(
    (c) =>
      c.status === "info" || c.status === "unavailable" || c.status === "error",
  ).length;

  return { positives, priorities, unavailableCount };
}
