import type { JsonParseResult, JsonValue } from "./types";

const POSITION_PATTERN = /position (\d+)/;

/** Best-effort — depends on the exact wording of the engine's SyntaxError message, which isn't standardized. */
function extractPosition(message: string): number | undefined {
  const match = POSITION_PATTERN.exec(message);
  return match ? Number(match[1]) : undefined;
}

function lineColumnAt(
  source: string,
  position: number,
): { line: number; column: number } {
  let line = 1;
  let column = 1;
  const end = Math.min(position, source.length);
  for (let i = 0; i < end; i++) {
    if (source[i] === "\n") {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  return { line, column };
}

/** Parses `raw` as JSON. Callers handle empty/whitespace-only input as a distinct "empty" state before calling this. */
export function parseJson(raw: string): JsonParseResult {
  try {
    const value = JSON.parse(raw) as JsonValue;
    return { success: true, value };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid JSON";
    const position = extractPosition(message);
    const location =
      position !== undefined ? lineColumnAt(raw, position) : undefined;
    return {
      success: false,
      error: {
        message,
        position,
        line: location?.line,
        column: location?.column,
      },
    };
  }
}
