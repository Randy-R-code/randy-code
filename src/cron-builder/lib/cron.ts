import { FIELD_META, type FieldRange } from "./cron-validation";
import type { CronFields, ParsedCronFields } from "./types";

export const DEFAULT_EXPRESSION = "0 9 * * 1-5";

export const WEEKDAY_LABELS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

export const WEEKDAY_FULL_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const MONTH_FULL_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function serialize(fields: CronFields): string {
  return [
    fields.minute,
    fields.hour,
    fields.dayOfMonth,
    fields.month,
    fields.dayOfWeek,
  ].join(" ");
}

/** True when `values` (sorted, deduplicated, within bounds) covers the entire field range. */
export function isWildcardValues(values: number[], range: FieldRange): boolean {
  return values.length === range.max - range.min + 1;
}

/**
 * True when both day-of-month and day-of-week are restricted (≠ `*`) at the
 * same time — the Vixie-cron OR rule in `dayMatches` below then applies, and
 * that combined behavior can vary between cron implementations.
 */
export function isDayRestrictionAmbiguous(parsed: ParsedCronFields): boolean {
  return (
    !isWildcardValues(parsed.dayOfMonth.values, FIELD_META.dayOfMonth) &&
    !isWildcardValues(parsed.dayOfWeek.values, FIELD_META.dayOfWeek)
  );
}

/**
 * Collapses a set of selected values into the shortest valid field syntax:
 * `*` when it covers the whole range, a contiguous `a-b` range, a bare value,
 * or a comma-separated list.
 */
export function canonicalizeValues(
  values: number[],
  range: FieldRange,
): string {
  const sorted = Array.from(new Set(values)).sort((a, b) => a - b);
  if (sorted.length === 0) {
    throw new Error("At least one value must be selected.");
  }
  if (isWildcardValues(sorted, range)) return "*";
  if (sorted.length === 1) return String(sorted[0]);

  const isContiguous = sorted.every(
    (v, i) => i === 0 || v === sorted[i - 1] + 1,
  );
  if (isContiguous) return `${sorted[0]}-${sorted[sorted.length - 1]}`;

  return sorted.join(",");
}

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

// --- Next run calculation -------------------------------------------------

const SEARCH_HORIZON_YEARS = 4;
const MAX_ITERATIONS = 200_000;

function dayMatches(
  date: Date,
  domValues: Set<number>,
  domIsWildcard: boolean,
  dowValues: Set<number>,
  dowIsWildcard: boolean,
): boolean {
  if (domIsWildcard && dowIsWildcard) return true;
  if (domIsWildcard) return dowValues.has(date.getDay());
  if (dowIsWildcard) return domValues.has(date.getDate());
  // Vixie-cron rule: when both day-of-month and day-of-week are restricted,
  // a day matches if EITHER one matches.
  return domValues.has(date.getDate()) || dowValues.has(date.getDay());
}

/**
 * Returns up to `count` upcoming run times, computed in the caller's local
 * timezone. Advances field-by-field (month → day → hour → minute) rather
 * than minute-by-minute, so it stays fast even for sparse schedules, and
 * gives up gracefully — returning fewer than `count` results — once the
 * search horizon is exceeded (e.g. `0 0 31 2 *`, which never actually runs).
 */
export function getNextRuns(
  parsed: ParsedCronFields,
  count: number,
  from: Date = new Date(),
): Date[] {
  const minuteValues = new Set(parsed.minute.values);
  const hourValues = new Set(parsed.hour.values);
  const domValues = new Set(parsed.dayOfMonth.values);
  const monthValues = new Set(parsed.month.values);
  const dowValues = new Set(parsed.dayOfWeek.values);
  const domIsWildcard = isWildcardValues(
    parsed.dayOfMonth.values,
    FIELD_META.dayOfMonth,
  );
  const dowIsWildcard = isWildcardValues(
    parsed.dayOfWeek.values,
    FIELD_META.dayOfWeek,
  );

  const results: Date[] = [];
  let candidate = new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate(),
    from.getHours(),
    from.getMinutes() + 1,
    0,
    0,
  );
  const horizon = new Date(candidate);
  horizon.setFullYear(horizon.getFullYear() + SEARCH_HORIZON_YEARS);

  let iterations = 0;
  while (
    results.length < count &&
    candidate <= horizon &&
    iterations < MAX_ITERATIONS
  ) {
    iterations++;

    if (!monthValues.has(candidate.getMonth() + 1)) {
      candidate = new Date(
        candidate.getFullYear(),
        candidate.getMonth() + 1,
        1,
        0,
        0,
        0,
        0,
      );
      continue;
    }
    if (
      !dayMatches(candidate, domValues, domIsWildcard, dowValues, dowIsWildcard)
    ) {
      candidate = new Date(
        candidate.getFullYear(),
        candidate.getMonth(),
        candidate.getDate() + 1,
        0,
        0,
        0,
        0,
      );
      continue;
    }
    if (!hourValues.has(candidate.getHours())) {
      candidate = new Date(
        candidate.getFullYear(),
        candidate.getMonth(),
        candidate.getDate(),
        candidate.getHours() + 1,
        0,
        0,
        0,
      );
      continue;
    }
    if (!minuteValues.has(candidate.getMinutes())) {
      candidate = new Date(
        candidate.getFullYear(),
        candidate.getMonth(),
        candidate.getDate(),
        candidate.getHours(),
        candidate.getMinutes() + 1,
        0,
        0,
      );
      continue;
    }

    results.push(new Date(candidate));
    candidate = new Date(
      candidate.getFullYear(),
      candidate.getMonth(),
      candidate.getDate(),
      candidate.getHours(),
      candidate.getMinutes() + 1,
      0,
      0,
    );
  }

  return results;
}

// --- Human-readable description --------------------------------------------

type FieldShape =
  | { type: "every" }
  | { type: "interval"; step: number }
  | { type: "intervalRange"; start: number; end: number; step: number }
  | { type: "range"; start: number; end: number }
  | { type: "list"; values: number[] };

function shapeOf(parsed: ParsedCronFields[keyof ParsedCronFields]): FieldShape {
  const { ast, values } = parsed;
  if (ast.length === 1) {
    const item = ast[0];
    if (item.kind === "every") return { type: "every" };
    if (item.kind === "step") return { type: "interval", step: item.step };
    if (item.kind === "range")
      return { type: "range", start: item.start, end: item.end };
    if (item.kind === "rangeStep") {
      return {
        type: "intervalRange",
        start: item.start,
        end: item.end,
        step: item.step,
      };
    }
  }
  return { type: "list", values };
}

function joinWithAnd(items: string[]): string {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function describeMinutePhrase(shape: FieldShape): string {
  switch (shape.type) {
    case "every":
      return "every minute";
    case "interval":
      return shape.step === 1 ? "every minute" : `every ${shape.step} minutes`;
    case "intervalRange":
      return `every ${shape.step} minutes from minute ${shape.start} through ${shape.end}`;
    case "range":
      return `minutes ${shape.start} through ${shape.end}`;
    case "list":
      return shape.values.length === 1
        ? `minute ${shape.values[0]}`
        : `minutes ${joinWithAnd(shape.values.map(String))}`;
  }
}

function describeHourPhrase(shape: FieldShape): string {
  switch (shape.type) {
    case "every":
      return "every hour";
    case "interval":
      return shape.step === 1 ? "every hour" : `every ${shape.step} hours`;
    case "intervalRange":
      return `every ${shape.step} hours from hour ${shape.start} through ${shape.end}`;
    case "range":
      return `hours ${shape.start} through ${shape.end}`;
    case "list":
      return shape.values.length === 1
        ? `hour ${shape.values[0]}`
        : `hours ${joinWithAnd(shape.values.map(String))}`;
  }
}

function describeTime(minuteShape: FieldShape, hourShape: FieldShape): string {
  const minuteIsSingle =
    minuteShape.type === "list" && minuteShape.values.length === 1;
  const hourIsSingle =
    hourShape.type === "list" && hourShape.values.length === 1;

  if (minuteIsSingle && hourIsSingle) {
    const m = (minuteShape as { type: "list"; values: number[] }).values[0];
    const h = (hourShape as { type: "list"; values: number[] }).values[0];
    return `At ${pad2(h)}:${pad2(m)}`;
  }

  if (hourShape.type === "every") {
    if (minuteShape.type === "every") return "Every minute";
    if (minuteShape.type === "interval") {
      return minuteShape.step === 1
        ? "Every minute"
        : `Every ${minuteShape.step} minutes`;
    }
    if (
      minuteIsSingle &&
      (minuteShape as { type: "list"; values: number[] }).values[0] === 0
    ) {
      return "Every hour";
    }
  }

  if (
    minuteIsSingle &&
    (minuteShape as { type: "list"; values: number[] }).values[0] === 0 &&
    hourShape.type === "interval"
  ) {
    return hourShape.step === 1
      ? "Every hour"
      : `Every ${hourShape.step} hours`;
  }

  return `At ${describeMinutePhrase(minuteShape)} past ${describeHourPhrase(hourShape)}`;
}

function ordinal(n: number): string {
  const suffixes = ["th", "st", "nd", "rd"] as const;
  const mod100 = n % 100;
  const suffix =
    suffixes[(mod100 - 20) % 10] ?? suffixes[mod100] ?? suffixes[0];
  return `${n}${suffix}`;
}

function describeDayOfMonthPhrase(shape: FieldShape): string {
  switch (shape.type) {
    case "every":
      return "every day";
    case "interval":
      return `every ${shape.step} days`;
    case "intervalRange":
      return `every ${shape.step} days from day ${shape.start} through ${shape.end}`;
    case "range":
      return `days ${shape.start} through ${shape.end}`;
    case "list":
      return shape.values.length === 1
        ? `the ${ordinal(shape.values[0])}`
        : `days ${joinWithAnd(shape.values.map(String))}`;
  }
}

function describeMonthPhrase(shape: FieldShape): string {
  switch (shape.type) {
    case "every":
      return "every month";
    case "interval":
      return `every ${shape.step} months`;
    case "intervalRange":
      return `every ${shape.step} months from ${MONTH_FULL_LABELS[shape.start - 1]} through ${MONTH_FULL_LABELS[shape.end - 1]}`;
    case "range":
      return `${MONTH_FULL_LABELS[shape.start - 1]} through ${MONTH_FULL_LABELS[shape.end - 1]}`;
    case "list":
      return joinWithAnd(shape.values.map((v) => MONTH_FULL_LABELS[v - 1]));
  }
}

function describeDate(domShape: FieldShape, monthShape: FieldShape): string {
  const domEvery = domShape.type === "every";
  const monthEvery = monthShape.type === "every";
  const domIsFirst =
    domShape.type === "list" &&
    domShape.values.length === 1 &&
    domShape.values[0] === 1;

  if (domEvery && monthEvery) return "";
  if (domEvery) return `in ${describeMonthPhrase(monthShape)}`;
  if (monthEvery) {
    return domIsFirst
      ? "on the first day of every month"
      : `on ${describeDayOfMonthPhrase(domShape)} of every month`;
  }
  return `on ${describeDayOfMonthPhrase(domShape)} of ${describeMonthPhrase(monthShape)}`;
}

function describeDowPhrase(shape: FieldShape): string {
  switch (shape.type) {
    case "every":
      return "";
    case "interval":
      return `every ${shape.step} days of the week`;
    case "intervalRange":
      return `every ${shape.step} days of the week from ${WEEKDAY_FULL_LABELS[shape.start]} through ${WEEKDAY_FULL_LABELS[shape.end]}`;
    case "range":
      return `${WEEKDAY_FULL_LABELS[shape.start]} through ${WEEKDAY_FULL_LABELS[shape.end]}`;
    case "list":
      return joinWithAnd(shape.values.map((v) => WEEKDAY_FULL_LABELS[v]));
  }
}

/** Deterministic English description of a validated cron expression. */
export function describeCron(parsed: ParsedCronFields): string {
  const minuteShape = shapeOf(parsed.minute);
  const hourShape = shapeOf(parsed.hour);
  const domShape = shapeOf(parsed.dayOfMonth);
  const monthShape = shapeOf(parsed.month);
  const dowShape = shapeOf(parsed.dayOfWeek);

  const timeClause = describeTime(minuteShape, hourShape);
  const dateClause = describeDate(domShape, monthShape);
  const dowClause = describeDowPhrase(dowShape);

  const domOrMonthRestricted =
    domShape.type !== "every" || monthShape.type !== "every";
  const dowRestricted = dowShape.type !== "every";

  let sentence = timeClause;
  if (dateClause && dowClause && domOrMonthRestricted && dowRestricted) {
    sentence += ` ${dateClause}, or ${dowClause}`;
  } else if (dateClause) {
    sentence += ` ${dateClause}`;
  } else if (dowClause) {
    sentence += `, ${dowClause}`;
  }

  return `${sentence}.`;
}
