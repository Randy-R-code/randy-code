export type CronFieldName =
  | "minute"
  | "hour"
  | "dayOfMonth"
  | "month"
  | "dayOfWeek";

export const CRON_FIELD_ORDER: readonly CronFieldName[] = [
  "minute",
  "hour",
  "dayOfMonth",
  "month",
  "dayOfWeek",
];

export interface CronFields {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

/** One comma-separated item within a field, e.g. the `1-5` in `1-5,10`. */
export type CronItem =
  | { kind: "every" }
  | { kind: "step"; step: number }
  | { kind: "value"; value: number }
  | { kind: "range"; start: number; end: number }
  | { kind: "rangeStep"; start: number; end: number; step: number };

export type CronFieldAst = CronItem[];

export interface ParsedCronField {
  ast: CronFieldAst;
  /** Sorted, deduplicated concrete values this field matches. */
  values: number[];
}

export type ParsedCronFields = Record<CronFieldName, ParsedCronField>;

export type CronValidationResult =
  | { valid: true; fields: CronFields; parsed: ParsedCronFields }
  | { valid: false; error: string };
