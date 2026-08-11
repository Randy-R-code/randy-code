import {
  AnalysisHistory,
  HISTORY_SCHEMA_VERSION,
  HistoryEntry,
  StoredHistory,
} from "./types";

export function isValidEntry(entry: unknown): entry is HistoryEntry {
  if (!entry || typeof entry !== "object") return false;
  const e = entry as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.timestamp === "number" &&
    e.results !== null &&
    typeof e.results === "object" &&
    typeof (e.results as Record<string, unknown>).hostname === "string" &&
    typeof (e.results as Record<string, unknown>).url === "string" &&
    (e.results as Record<string, unknown>).score !== null &&
    typeof (e.results as Record<string, unknown>).score === "object"
  );
}

// A missing/mismatched version or malformed JSON is treated as incompatible
// data, not corruption to recover from — there's no prior schema to
// migrate, so a version bump (or a garbled value) just starts the local
// history over rather than risking a half-parsed shape reaching the UI.
export function parseStoredHistory(raw: string | null): AnalysisHistory {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Partial<StoredHistory>;
    if (
      parsed.version !== HISTORY_SCHEMA_VERSION ||
      !Array.isArray(parsed.entries)
    ) {
      return [];
    }
    return parsed.entries.filter(isValidEntry);
  } catch {
    return [];
  }
}

export function serializeHistory(history: AnalysisHistory): string {
  const stored: StoredHistory = {
    version: HISTORY_SCHEMA_VERSION,
    entries: history,
  };
  return JSON.stringify(stored);
}
