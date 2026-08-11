import { InfraLensExport } from "./export";

const VALID_STATUSES = new Set([
  "pass",
  "warning",
  "fail",
  "info",
  "unavailable",
  "error",
]);
const VALID_GRADES = new Set(["A", "B", "C", "D", "E"]);

/**
 * Structural validation for the exported JSON shape (master plan §10.4,
 * Phase 4 "valider l'export"). Used only in tests and, later, by Phase 16's
 * local comparator when it imports a previously-exported report — never
 * called at runtime in the analysis path itself, per the master plan's own
 * scoping ("import de validation uniquement pour tests ou futur
 * comparateur").
 */
export function isValidExport(data: unknown): data is InfraLensExport {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;

  if (typeof d.url !== "string") return false;
  if (
    typeof d.scannedAt !== "string" ||
    Number.isNaN(Date.parse(d.scannedAt))
  ) {
    return false;
  }
  if (typeof d.score !== "number") return false;
  if (typeof d.grade !== "string" || !VALID_GRADES.has(d.grade)) return false;
  if (typeof d.version !== "string") return false;

  if (!Array.isArray(d.categories)) return false;
  for (const entry of d.categories) {
    if (typeof entry !== "object" || entry === null) return false;
    const category = entry as Record<string, unknown>;
    if (typeof category.category !== "string") return false;
    if (typeof category.score !== "number") return false;
    if (typeof category.maxScore !== "number") return false;
  }

  if (!Array.isArray(d.checks)) return false;
  for (const entry of d.checks) {
    if (typeof entry !== "object" || entry === null) return false;
    const check = entry as Record<string, unknown>;
    if (typeof check.id !== "string") return false;
    if (typeof check.label !== "string") return false;
    if (typeof check.category !== "string") return false;
    if (typeof check.status !== "string" || !VALID_STATUSES.has(check.status)) {
      return false;
    }
    if (typeof check.durationMs !== "number") return false;
  }

  return true;
}
