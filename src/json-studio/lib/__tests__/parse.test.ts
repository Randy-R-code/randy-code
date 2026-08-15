import { describe, expect, it } from "vitest";
import { parseJson } from "../parse";

describe("parseJson", () => {
  it("parses a valid object", () => {
    const result = parseJson('{"a":1,"b":"two"}');
    expect(result.success).toBe(true);
    if (result.success) expect(result.value).toEqual({ a: 1, b: "two" });
  });

  it("parses a valid array", () => {
    const result = parseJson("[1,2,3]");
    expect(result.success).toBe(true);
    if (result.success) expect(result.value).toEqual([1, 2, 3]);
  });

  it("parses valid primitives", () => {
    expect(parseJson('"hello"')).toEqual({ success: true, value: "hello" });
    expect(parseJson("42")).toEqual({ success: true, value: 42 });
    expect(parseJson("true")).toEqual({ success: true, value: true });
  });

  it("parses null", () => {
    expect(parseJson("null")).toEqual({ success: true, value: null });
  });

  it("parses nested objects and arrays", () => {
    const result = parseJson('{"a":{"b":[1,{"c":2}]}}');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toEqual({ a: { b: [1, { c: 2 }] } });
    }
  });

  it("preserves Unicode and escaped characters", () => {
    const result = parseJson('{"emoji":"🎉","escaped":"line1\\nline2"}');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toEqual({ emoji: "🎉", escaped: "line1\nline2" });
    }
  });

  it("rejects a missing comma", () => {
    const result = parseJson('{"a":1 "b":2}');
    expect(result.success).toBe(false);
  });

  it("rejects a trailing comma", () => {
    const result = parseJson('{"a":1,}');
    expect(result.success).toBe(false);
  });

  it("rejects single-quoted strings", () => {
    const result = parseJson("{'a':1}");
    expect(result.success).toBe(false);
  });

  it("rejects incomplete JSON", () => {
    const result = parseJson('{"a":');
    expect(result.success).toBe(false);
  });

  it("never throws, even on garbage input", () => {
    expect(() => parseJson("not json at all }{")).not.toThrow();
  });

  it("exposes a non-empty error message without a stack trace", () => {
    const result = parseJson("{invalid}");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message.length).toBeGreaterThan(0);
      expect(result.error.message).not.toMatch(/at JSON\.parse|node_modules/);
    }
  });

  it("computes line and column when a position is extractable", () => {
    const source = '{\n  "a": 1,\n  "b": tru\n}';
    const result = parseJson(source);
    expect(result.success).toBe(false);
    if (!result.success && result.error.position !== undefined) {
      expect(result.error.line).toBeGreaterThanOrEqual(1);
      expect(result.error.column).toBeGreaterThanOrEqual(1);
    }
  });
});
