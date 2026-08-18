import { describe, expect, it } from "vitest";
import {
  canonicalizeValues,
  describeCron,
  getNextRuns,
  isDayRestrictionAmbiguous,
  isWildcardValues,
  serialize,
} from "../cron";
import { FIELD_META, validateExpression } from "../cron-validation";
import { CRON_PRESETS } from "../presets";
import type { CronFields, ParsedCronFields } from "../types";

function parse(expression: string): ParsedCronFields {
  const result = validateExpression(expression);
  if (!result.valid)
    throw new Error(`expected valid expression: ${expression}`);
  return result.parsed;
}

describe("serialize", () => {
  it("joins the five fields with single spaces", () => {
    const fields: CronFields = {
      minute: "0",
      hour: "9",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "1-5",
    };
    expect(serialize(fields)).toBe("0 9 * * 1-5");
  });
});

describe("canonicalizeValues", () => {
  const minuteRange = FIELD_META.minute;

  it("collapses a full range into a wildcard", () => {
    const all = Array.from({ length: 60 }, (_, i) => i);
    expect(canonicalizeValues(all, minuteRange)).toBe("*");
  });

  it("collapses a contiguous run into a range", () => {
    expect(canonicalizeValues([1, 2, 3, 4, 5], FIELD_META.dayOfWeek)).toBe(
      "1-5",
    );
  });

  it("returns a bare value for a single selection", () => {
    expect(canonicalizeValues([30], minuteRange)).toBe("30");
  });

  it("returns a comma list for non-contiguous values", () => {
    expect(canonicalizeValues([0, 15, 45], minuteRange)).toBe("0,15,45");
  });

  it("sorts and deduplicates before collapsing", () => {
    expect(canonicalizeValues([5, 1, 3], minuteRange)).toBe("1,3,5");
  });

  it("throws on an empty selection", () => {
    expect(() => canonicalizeValues([], minuteRange)).toThrow();
  });
});

describe("isWildcardValues", () => {
  it("is true only when the values cover the whole range", () => {
    expect(isWildcardValues([0, 1, 2, 3, 4, 5, 6], FIELD_META.dayOfWeek)).toBe(
      true,
    );
    expect(isWildcardValues([0, 1, 2], FIELD_META.dayOfWeek)).toBe(false);
  });
});

describe("isDayRestrictionAmbiguous", () => {
  it("is true when both day-of-month and day-of-week are restricted", () => {
    expect(isDayRestrictionAmbiguous(parse("0 9 1 * 1"))).toBe(true);
    expect(isDayRestrictionAmbiguous(parse("0 9 1-7 * 1-5"))).toBe(true);
  });

  it("is false when only one of the two is restricted", () => {
    expect(isDayRestrictionAmbiguous(parse("0 9 * * 1-5"))).toBe(false);
    expect(isDayRestrictionAmbiguous(parse("0 9 1 * *"))).toBe(false);
  });

  it("is false when neither is restricted", () => {
    expect(isDayRestrictionAmbiguous(parse("0 9 * * *"))).toBe(false);
  });
});

describe("getNextRuns", () => {
  it("returns the requested count for an ordinary daily schedule", () => {
    const parsed = parse("0 9 * * *");
    const from = new Date(2026, 7, 15, 8, 0, 0); // Sat Aug 15 2026, 08:00 local
    const runs = getNextRuns(parsed, 5, from);
    expect(runs).toHaveLength(5);
    expect(runs[0]).toEqual(new Date(2026, 7, 15, 9, 0, 0));
    expect(runs[1]).toEqual(new Date(2026, 7, 16, 9, 0, 0));
    expect(runs[4]).toEqual(new Date(2026, 7, 19, 9, 0, 0));
  });

  it("skips to the next day when the time already passed", () => {
    const parsed = parse("0 9 * * *");
    const from = new Date(2026, 7, 15, 10, 0, 0); // 10:00, after 09:00
    const runs = getNextRuns(parsed, 1, from);
    expect(runs[0]).toEqual(new Date(2026, 7, 16, 9, 0, 0));
  });

  it("only lands on weekdays for a weekdays-at-09:00 schedule", () => {
    const fields: CronFields = {
      minute: "0",
      hour: "9",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "1-5",
    };
    const parsed = parse(serialize(fields));
    // Fri Aug 14 2026, 10:00 — next weekday run should skip the weekend.
    const from = new Date(2026, 7, 14, 10, 0, 0);
    const runs = getNextRuns(parsed, 3, from);
    const days = runs.map((d) => d.getDay());
    expect(days).toEqual([1, 2, 3]); // Mon, Tue, Wed — Sat/Sun skipped
  });

  it("applies OR semantics when both day-of-month and day-of-week are restricted", () => {
    // Runs on the 1st of the month OR every Monday.
    const fields: CronFields = {
      minute: "0",
      hour: "0",
      dayOfMonth: "1",
      month: "*",
      dayOfWeek: "1",
    };
    const parsed = parse(serialize(fields));
    const from = new Date(2026, 7, 1, 1, 0, 0); // Sat Aug 1 2026, just after midnight
    const runs = getNextRuns(parsed, 2, from);
    // Next Monday (Aug 3) matches via day-of-week even though day-of-month is 1.
    expect(runs[0]).toEqual(new Date(2026, 7, 3, 0, 0, 0));
  });

  it("handles boundary field values (minute 0/59, hour 0/23)", () => {
    const fields: CronFields = {
      minute: "59",
      hour: "23",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "*",
    };
    const parsed = parse(serialize(fields));
    const from = new Date(2026, 7, 15, 0, 0, 0);
    const runs = getNextRuns(parsed, 1, from);
    expect(runs[0]).toEqual(new Date(2026, 7, 15, 23, 59, 0));
  });

  it("returns fewer than the requested count for a schedule that never occurs", () => {
    // Day 31 of February never exists.
    const fields: CronFields = {
      minute: "0",
      hour: "0",
      dayOfMonth: "31",
      month: "2",
      dayOfWeek: "*",
    };
    const parsed = parse(serialize(fields));
    const runs = getNextRuns(parsed, 5, new Date(2026, 7, 15));
    expect(runs).toHaveLength(0);
  });

  it("respects month boundaries (month 1 and 12)", () => {
    const fields: CronFields = {
      minute: "0",
      hour: "0",
      dayOfMonth: "1",
      month: "1,12",
      dayOfWeek: "*",
    };
    const parsed = parse(serialize(fields));
    const from = new Date(2026, 5, 1); // June 2026
    const runs = getNextRuns(parsed, 2, from);
    expect(runs[0]).toEqual(new Date(2026, 11, 1, 0, 0, 0)); // Dec 1 2026
    expect(runs[1]).toEqual(new Date(2027, 0, 1, 0, 0, 0)); // Jan 1 2027
  });
});

describe("describeCron", () => {
  it("describes weekdays at 09:00", () => {
    expect(describeCron(parse("0 9 * * 1-5"))).toBe(
      "At 09:00, Monday through Friday.",
    );
  });

  it("describes an interval-only schedule", () => {
    expect(describeCron(parse("*/15 * * * *"))).toBe("Every 15 minutes.");
  });

  it("describes a monthly schedule on the first day", () => {
    expect(describeCron(parse("30 18 1 * *"))).toBe(
      "At 18:30 on the first day of every month.",
    );
  });

  it("describes every minute", () => {
    expect(describeCron(parse("* * * * *"))).toBe("Every minute.");
  });

  it("describes every hour", () => {
    expect(describeCron(parse("0 * * * *"))).toBe("Every hour.");
  });

  it("describes midnight daily", () => {
    expect(describeCron(parse("0 0 * * *"))).toBe("At 00:00.");
  });

  it("describes every Monday at 09:00", () => {
    expect(describeCron(parse("0 9 * * 1"))).toBe("At 09:00, Monday.");
  });

  it("never throws for any preset expression", () => {
    for (const preset of CRON_PRESETS) {
      expect(() => describeCron(parse(preset.expression))).not.toThrow();
      expect(describeCron(parse(preset.expression)).length).toBeGreaterThan(0);
    }
  });
});
