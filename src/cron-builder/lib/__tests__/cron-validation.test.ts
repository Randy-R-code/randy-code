import { describe, expect, it } from "vitest";
import { parseField, validateExpression } from "../cron-validation";

describe("validateExpression", () => {
  it("accepts the default expression", () => {
    const result = validateExpression("0 9 * * 1-5");
    expect(result.valid).toBe(true);
  });

  it("accepts every preset-shaped expression", () => {
    for (const expr of [
      "* * * * *",
      "*/5 * * * *",
      "0 * * * *",
      "0 0 * * *",
      "0 9 * * *",
      "0 9 * * 1-5",
      "0 9 * * 1",
      "0 0 1 * *",
    ]) {
      expect(validateExpression(expr).valid, expr).toBe(true);
    }
  });

  it("accepts lists, ranges and steps", () => {
    expect(validateExpression("1,15,30 * * * *").valid).toBe(true);
    expect(validateExpression("10-20 * * * *").valid).toBe(true);
    expect(validateExpression("1-10/2 * * * *").valid).toBe(true);
    expect(validateExpression("0 9,17 * * *").valid).toBe(true);
  });

  it("rejects a wrong field count", () => {
    const result = validateExpression("* * *");
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error).toMatch(/exactly 5/);
  });

  it("rejects an out-of-range minute", () => {
    const result = validateExpression("60 * * * *");
    expect(result.valid).toBe(false);
    if (!result.valid)
      expect(result.error).toBe("Minute must be between 0 and 59.");
  });

  it("rejects an out-of-range hour", () => {
    const result = validateExpression("0 24 * * *");
    expect(result.valid).toBe(false);
    if (!result.valid)
      expect(result.error).toBe("Hour must be between 0 and 23.");
  });

  it("rejects an out-of-range day of week", () => {
    const result = validateExpression("0 9 * * 8");
    expect(result.valid).toBe(false);
    if (!result.valid)
      expect(result.error).toBe("Day of week must be between 0 and 6.");
  });

  it("rejects a zero step", () => {
    const result = validateExpression("*/0 * * * *");
    expect(result.valid).toBe(false);
    if (!result.valid)
      expect(result.error).toMatch(/step must be greater than 0/i);
  });

  it("rejects Quartz-like syntax", () => {
    const result = validateExpression("0 9 ? * MON");
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error).toMatch(/unsupported syntax/i);
  });

  it("rejects a malformed range where start is greater than end", () => {
    const result = validateExpression("10-5 * * * *");
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error).toMatch(/must not be greater/i);
  });

  it("rejects a bare value/step (not part of the supported subset)", () => {
    const result = validateExpression("5/2 * * * *");
    expect(result.valid).toBe(false);
  });

  it("rejects an empty expression", () => {
    expect(validateExpression("").valid).toBe(false);
    expect(validateExpression("   ").valid).toBe(false);
  });

  it("rejects an empty list item", () => {
    const result = validateExpression("1,,3 * * * *");
    expect(result.valid).toBe(false);
  });

  it("accepts boundary values for every field", () => {
    expect(validateExpression("0 0 1 1 0").valid).toBe(true);
    expect(validateExpression("59 23 31 12 6").valid).toBe(true);
  });

  it("rejects day of month 0 (out of the 1-31 range)", () => {
    const result = validateExpression("0 0 0 1 *");
    expect(result.valid).toBe(false);
    if (!result.valid)
      expect(result.error).toBe("Day of month must be between 1 and 31.");
  });
});

describe("parseField", () => {
  it("expands a step field into concrete values", () => {
    const result = parseField("*/15", "minute");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.parsed.values).toEqual([0, 15, 30, 45]);
  });

  it("expands a range-with-step field into concrete values", () => {
    const result = parseField("1-10/2", "minute");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.parsed.values).toEqual([1, 3, 5, 7, 9]);
  });

  it("deduplicates and sorts overlapping list values", () => {
    const result = parseField("5,1,5,3", "minute");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.parsed.values).toEqual([1, 3, 5]);
  });

  it("expands a wildcard into the full field range", () => {
    const result = parseField("*", "dayOfWeek");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.parsed.values).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });
});
