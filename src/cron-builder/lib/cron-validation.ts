import {
  CRON_FIELD_ORDER,
  type CronFieldAst,
  type CronFieldName,
  type CronFields,
  type CronItem,
  type CronValidationResult,
  type ParsedCronField,
  type ParsedCronFields,
} from "./types";

export interface FieldRange {
  min: number;
  max: number;
  label: string;
}

/**
 * The Unix 5-field ranges this tool supports. Deliberately excludes Quartz
 * extensions (seconds, year, `?`, `L`, `W`, `#`) — see brief §4/§12.
 */
export const FIELD_META: Record<CronFieldName, FieldRange> = {
  minute: { min: 0, max: 59, label: "Minute" },
  hour: { min: 0, max: 23, label: "Hour" },
  dayOfMonth: { min: 1, max: 31, label: "Day of month" },
  month: { min: 1, max: 12, label: "Month" },
  dayOfWeek: { min: 0, max: 6, label: "Day of week" },
};

const ITEM_PATTERN = /^(\*|\d+)(?:-(\d+))?(?:\/(\d+))?$/;

function parseFieldItem(
  token: string,
  range: FieldRange,
): { ok: true; item: CronItem } | { ok: false; error: string } {
  if (token === "") {
    return { ok: false, error: `${range.label} contains an empty value.` };
  }

  const match = ITEM_PATTERN.exec(token);
  if (!match) {
    return {
      ok: false,
      error: `${range.label} contains unsupported syntax: "${token}".`,
    };
  }

  const [, base, rangeEnd, step] = match;

  if (base === "*") {
    if (rangeEnd) {
      return {
        ok: false,
        error: `${range.label} contains unsupported syntax: "${token}".`,
      };
    }
    if (step === undefined) {
      return { ok: true, item: { kind: "every" } };
    }
    const stepValue = Number(step);
    if (stepValue <= 0) {
      return {
        ok: false,
        error: `${range.label} step must be greater than 0.`,
      };
    }
    return { ok: true, item: { kind: "step", step: stepValue } };
  }

  const baseValue = Number(base);

  if (rangeEnd === undefined) {
    if (step !== undefined) {
      // Bare `value/step` (no range) isn't part of our supported subset.
      return {
        ok: false,
        error: `${range.label} contains unsupported syntax: "${token}".`,
      };
    }
    if (baseValue < range.min || baseValue > range.max) {
      return {
        ok: false,
        error: `${range.label} must be between ${range.min} and ${range.max}.`,
      };
    }
    return { ok: true, item: { kind: "value", value: baseValue } };
  }

  const endValue = Number(rangeEnd);
  if (baseValue < range.min || baseValue > range.max) {
    return {
      ok: false,
      error: `${range.label} must be between ${range.min} and ${range.max}.`,
    };
  }
  if (endValue < range.min || endValue > range.max) {
    return {
      ok: false,
      error: `${range.label} must be between ${range.min} and ${range.max}.`,
    };
  }
  if (baseValue > endValue) {
    return {
      ok: false,
      error: `${range.label} range start (${baseValue}) must not be greater than its end (${endValue}).`,
    };
  }

  if (step === undefined) {
    return {
      ok: true,
      item: { kind: "range", start: baseValue, end: endValue },
    };
  }

  const stepValue = Number(step);
  if (stepValue <= 0) {
    return { ok: false, error: `${range.label} step must be greater than 0.` };
  }

  return {
    ok: true,
    item: {
      kind: "rangeStep",
      start: baseValue,
      end: endValue,
      step: stepValue,
    },
  };
}

function expandItem(item: CronItem, range: FieldRange): number[] {
  switch (item.kind) {
    case "every": {
      const values: number[] = [];
      for (let v = range.min; v <= range.max; v++) values.push(v);
      return values;
    }
    case "step": {
      const values: number[] = [];
      for (let v = range.min; v <= range.max; v += item.step) values.push(v);
      return values;
    }
    case "value":
      return [item.value];
    case "range": {
      const values: number[] = [];
      for (let v = item.start; v <= item.end; v++) values.push(v);
      return values;
    }
    case "rangeStep": {
      const values: number[] = [];
      for (let v = item.start; v <= item.end; v += item.step) values.push(v);
      return values;
    }
  }
}

/** Parses and validates a single field's raw text against its Unix cron range. */
export function parseField(
  raw: string,
  fieldName: CronFieldName,
): { ok: true; parsed: ParsedCronField } | { ok: false; error: string } {
  const range = FIELD_META[fieldName];
  const tokens = raw.split(",");
  const ast: CronFieldAst = [];

  for (const token of tokens) {
    const result = parseFieldItem(token, range);
    if (!result.ok) return result;
    ast.push(result.item);
  }

  const values = Array.from(
    new Set(ast.flatMap((item) => expandItem(item, range))),
  ).sort((a, b) => a - b);

  return { ok: true, parsed: { ast, values } };
}

/** Validates a full 5-field expression and returns its parsed, canonical form. */
export function validateExpression(raw: string): CronValidationResult {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return { valid: false, error: "Enter a cron expression." };
  }

  const tokens = trimmed.split(/\s+/);
  if (tokens.length !== 5) {
    return {
      valid: false,
      error: `A cron expression needs exactly 5 space-separated fields (minute hour day-of-month month day-of-week) — got ${tokens.length}.`,
    };
  }

  const fields = {} as CronFields;
  const parsed = {} as ParsedCronFields;

  for (let i = 0; i < CRON_FIELD_ORDER.length; i++) {
    const fieldName = CRON_FIELD_ORDER[i];
    const result = parseField(tokens[i], fieldName);
    if (!result.ok) return { valid: false, error: result.error };
    fields[fieldName] = tokens[i];
    parsed[fieldName] = result.parsed;
  }

  return { valid: true, fields, parsed };
}
