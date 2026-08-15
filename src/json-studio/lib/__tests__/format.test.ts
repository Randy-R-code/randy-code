import { describe, expect, it } from "vitest";
import { formatJson, minifyJson } from "../format";

describe("formatJson", () => {
  it("pretty-prints with 2 spaces", () => {
    expect(formatJson({ a: 1, b: 2 })).toBe('{\n  "a": 1,\n  "b": 2\n}');
  });

  it("formats nested structures", () => {
    expect(formatJson({ a: [1, 2] })).toBe(
      '{\n  "a": [\n    1,\n    2\n  ]\n}',
    );
  });

  it("formats arrays", () => {
    expect(formatJson([1, "two", true])).toBe('[\n  1,\n  "two",\n  true\n]');
  });

  it("formats a primitive root", () => {
    expect(formatJson("hello")).toBe('"hello"');
    expect(formatJson(42)).toBe("42");
    expect(formatJson(null)).toBe("null");
  });

  it("preserves key order", () => {
    expect(formatJson({ z: 1, a: 2, m: 3 })).toBe(
      '{\n  "z": 1,\n  "a": 2,\n  "m": 3\n}',
    );
  });
});

describe("minifyJson", () => {
  it("produces compact JSON from a formatted object", () => {
    const formatted = '{\n  "a": 1,\n  "b": 2\n}';
    expect(minifyJson(JSON.parse(formatted))).toBe('{"a":1,"b":2}');
  });

  it("does not reorder properties", () => {
    expect(minifyJson({ z: 1, a: 2 })).toBe('{"z":1,"a":2}');
  });

  it("minifies a primitive root", () => {
    expect(minifyJson(42)).toBe("42");
  });
});
