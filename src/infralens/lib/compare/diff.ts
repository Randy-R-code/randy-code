import { CATEGORY_LABELS } from "../checks/category-labels";
import { InfraLensExport } from "../checks/export";
import { CheckCategory } from "../checks/types";

export type CheckKind =
  | "improved"
  | "regressed"
  | "changed"
  | "unchanged"
  | "added"
  | "removed";

export type CheckTransition = {
  id: string;
  label: string;
  category: string;
  before: string | null;
  after: string | null;
  kind: CheckKind;
};

export type CategoryDelta = {
  category: string;
  label: string;
  before: number;
  beforeMax: number;
  after: number;
  afterMax: number;
  delta: number;
};

export type ComparisonResult = {
  urlBefore: string;
  urlAfter: string;
  scannedAtBefore: string;
  scannedAtAfter: string;
  scoreBefore: number;
  scoreAfter: number;
  scoreDelta: number;
  gradeBefore: string;
  gradeAfter: string;
  categories: CategoryDelta[];
  checks: CheckTransition[];
};

export type CompareOutcome =
  | { compatible: true; result: ComparisonResult }
  | { compatible: false; reason: string };

// Only pass/warning/fail are real, ranked assessments — info/unavailable/
// error are neutral or a technical non-answer (master plan §9.6), so a
// transition touching either of those is reported as "changed", never as
// an improvement or regression the way "fail -> pass" is.
const SCORED_STATUSES = new Set(["pass", "warning", "fail"]);
const STATUS_RANK: Record<string, number> = { fail: 0, warning: 1, pass: 2 };

function majorVersion(version: string): number | null {
  const n = Number(version.split(".")[0]);
  return Number.isFinite(n) ? n : null;
}

/**
 * Compares two exported reports (master plan §32 Phase 16). Pure,
 * synchronous, and 100% local — no network call, no server persistence.
 * Refuses to diff across incompatible major export-schema versions rather
 * than silently comparing vocabularies that may no longer mean the same
 * thing (master plan's own "versions incompatibles expliquées" criterion).
 */
export function compareExports(
  before: InfraLensExport,
  after: InfraLensExport,
): CompareOutcome {
  const beforeMajor = majorVersion(before.version);
  const afterMajor = majorVersion(after.version);
  if (
    beforeMajor === null ||
    afterMajor === null ||
    beforeMajor !== afterMajor
  ) {
    return {
      compatible: false,
      reason: `Report A uses export schema "${before.version}", Report B uses "${after.version}" — these are different major versions, so the check and category vocabulary may not line up between them. Re-export both reports with the same version of InfraLens and try again.`,
    };
  }

  const categoryIds = new Set([
    ...before.categories.map((c) => c.category),
    ...after.categories.map((c) => c.category),
  ]);
  const categories: CategoryDelta[] = [...categoryIds]
    .map((id) => {
      const b = before.categories.find((c) => c.category === id);
      const a = after.categories.find((c) => c.category === id);
      return {
        category: id,
        label: CATEGORY_LABELS[id as CheckCategory] ?? id,
        before: b?.score ?? 0,
        beforeMax: b?.maxScore ?? 0,
        after: a?.score ?? 0,
        afterMax: a?.maxScore ?? 0,
        delta: (a?.score ?? 0) - (b?.score ?? 0),
      };
    })
    .sort((x, y) => x.label.localeCompare(y.label));

  const checkIds = new Set([
    ...before.checks.map((c) => c.id),
    ...after.checks.map((c) => c.id),
  ]);
  const checks: CheckTransition[] = [...checkIds]
    .map((id) => {
      const b = before.checks.find((c) => c.id === id);
      const a = after.checks.find((c) => c.id === id);
      const label = a?.label ?? b?.label ?? id;
      const category = a?.category ?? b?.category ?? "unknown";

      let kind: CheckKind;
      if (!b) {
        kind = "added";
      } else if (!a) {
        kind = "removed";
      } else if (a.status === b.status) {
        kind = "unchanged";
      } else if (
        SCORED_STATUSES.has(a.status) &&
        SCORED_STATUSES.has(b.status)
      ) {
        kind =
          STATUS_RANK[a.status] > STATUS_RANK[b.status]
            ? "improved"
            : "regressed";
      } else {
        kind = "changed";
      }

      return {
        id,
        label,
        category,
        before: b?.status ?? null,
        after: a?.status ?? null,
        kind,
      };
    })
    .sort((x, y) => x.label.localeCompare(y.label));

  return {
    compatible: true,
    result: {
      urlBefore: before.url,
      urlAfter: after.url,
      scannedAtBefore: before.scannedAt,
      scannedAtAfter: after.scannedAt,
      scoreBefore: before.score,
      scoreAfter: after.score,
      scoreDelta: after.score - before.score,
      gradeBefore: before.grade,
      gradeAfter: after.grade,
      categories,
      checks,
    },
  };
}
