import type { JsonValue } from "./types";

/** 2-space pretty-print. Preserves key order and JSON semantics exactly. */
export function formatJson(value: JsonValue): string {
  return JSON.stringify(value, null, 2);
}

/** Compact JSON — no reordering, no value changes. */
export function minifyJson(value: JsonValue): string {
  return JSON.stringify(value);
}
