import { describe, expect, it } from "vitest";
import {
  computeDepth,
  computeStats,
  countProperties,
  countValues,
  formatBytes,
  rootTypeOf,
} from "../stats";

describe("rootTypeOf", () => {
  it("detects every root type", () => {
    expect(rootTypeOf({})).toBe("object");
    expect(rootTypeOf([])).toBe("array");
    expect(rootTypeOf("hi")).toBe("string");
    expect(rootTypeOf(1)).toBe("number");
    expect(rootTypeOf(true)).toBe("boolean");
    expect(rootTypeOf(null)).toBe("null");
  });
});

describe("computeDepth", () => {
  it("is 0 for a primitive root", () => {
    expect(computeDepth("hello")).toBe(0);
    expect(computeDepth(42)).toBe(0);
    expect(computeDepth(null)).toBe(0);
  });

  it("is 1 for a root object/array with only primitive children", () => {
    expect(computeDepth({ a: 1, b: "two" })).toBe(1);
    expect(computeDepth([1, 2, 3])).toBe(1);
    expect(computeDepth({})).toBe(1);
    expect(computeDepth([])).toBe(1);
  });

  it("adds 1 per level of nesting", () => {
    expect(computeDepth({ a: { b: 1 } })).toBe(2);
    expect(computeDepth({ a: { b: { c: 1 } } })).toBe(3);
    expect(computeDepth([1, [2, [3]]])).toBe(3);
  });

  it("takes the deepest branch", () => {
    expect(computeDepth({ shallow: 1, deep: { a: { b: 1 } } })).toBe(3);
  });
});

describe("countProperties", () => {
  it("counts object keys recursively", () => {
    expect(countProperties({ a: 1, b: 2 })).toBe(2);
    expect(countProperties({ a: { b: 1, c: 2 } })).toBe(3);
  });

  it("is 0 for arrays and primitives with no object keys", () => {
    expect(countProperties([1, 2, 3])).toBe(0);
    expect(countProperties("hello")).toBe(0);
    expect(countProperties(42)).toBe(0);
  });

  it("counts properties inside arrays", () => {
    expect(countProperties([{ a: 1 }, { b: 2 }])).toBe(2);
  });
});

describe("countValues", () => {
  it("counts leaf values recursively", () => {
    expect(countValues({ a: 1, b: { c: 2, d: 3 } })).toBe(3);
  });

  it("counts array elements", () => {
    expect(countValues([1, 2, 3])).toBe(3);
    expect(countValues([[1, 2], [3]])).toBe(3);
  });

  it("is 1 for a primitive root", () => {
    expect(countValues("hello")).toBe(1);
    expect(countValues(42)).toBe(1);
    expect(countValues(null)).toBe(1);
  });
});

describe("formatBytes", () => {
  it("formats bytes, kilobytes and megabytes", () => {
    expect(formatBytes(124)).toBe("124 B");
    expect(formatBytes(1024)).toBe("1.0 KB");
    expect(formatBytes(1024 * 1024)).toBe("1.0 MB");
  });
});

describe("computeStats", () => {
  it("combines every metric deterministically", () => {
    const value = { a: 1, b: { c: 2 } };
    const raw = JSON.stringify(value);
    const stats = computeStats(value, raw);
    expect(stats).toEqual({
      rootType: "object",
      properties: 3,
      values: 2,
      depth: 2,
      characters: raw.length,
      bytes: new TextEncoder().encode(raw).length,
    });
  });

  it("supports a primitive root", () => {
    const stats = computeStats(42, "42");
    expect(stats.rootType).toBe("number");
    expect(stats.depth).toBe(0);
    expect(stats.properties).toBe(0);
    expect(stats.values).toBe(1);
  });
});
