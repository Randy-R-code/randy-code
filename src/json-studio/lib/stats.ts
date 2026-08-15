import type {
  JsonArray,
  JsonObject,
  JsonRootType,
  JsonStats,
  JsonValue,
} from "./types";

function isContainer(value: JsonValue): value is JsonObject | JsonArray {
  return value !== null && typeof value === "object";
}

export function rootTypeOf(value: JsonValue): JsonRootType {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value as "object" | "string" | "number" | "boolean";
}

/**
 * Nesting depth. Convention: a primitive root is 0, a root object/array
 * with only primitive children is 1, each further level of nesting adds 1.
 */
export function computeDepth(value: JsonValue): number {
  if (!isContainer(value)) return 0;

  const children: JsonValue[] = Array.isArray(value)
    ? value
    : Object.values(value);
  const containerChildren = children.filter(isContainer);

  if (containerChildren.length === 0) return 1;
  return 1 + Math.max(...containerChildren.map(computeDepth));
}

/** Object keys, counted recursively through both objects and arrays. */
export function countProperties(value: JsonValue): number {
  if (Array.isArray(value)) {
    return value.reduce<number>((sum, v) => sum + countProperties(v), 0);
  }
  if (value !== null && typeof value === "object") {
    const keys = Object.keys(value);
    return (
      keys.length +
      keys.reduce((sum, key) => sum + countProperties(value[key]), 0)
    );
  }
  return 0;
}

/** Leaf (primitive) values, counted recursively. Arrays contribute their elements. */
export function countValues(value: JsonValue): number {
  if (Array.isArray(value)) {
    return value.reduce<number>(
      (sum, v) => sum + (isContainer(v) ? countValues(v) : 1),
      0,
    );
  }
  if (value !== null && typeof value === "object") {
    return Object.values(value).reduce<number>(
      (sum, v) => sum + (isContainer(v) ? countValues(v) : 1),
      0,
    );
  }
  return 1;
}

export function byteSize(text: string): number {
  return new TextEncoder().encode(text).length;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function computeStats(value: JsonValue, raw: string): JsonStats {
  return {
    rootType: rootTypeOf(value),
    properties: countProperties(value),
    values: countValues(value),
    depth: computeDepth(value),
    characters: raw.length,
    bytes: byteSize(raw),
  };
}
