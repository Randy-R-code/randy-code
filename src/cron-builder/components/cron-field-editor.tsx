"use client";

import {
  canonicalizeValues,
  MONTH_LABELS,
  WEEKDAY_LABELS,
} from "@/cron-builder/lib/cron";
import { FIELD_META, parseField } from "@/cron-builder/lib/cron-validation";
import type { CronFieldAst, CronFieldName } from "@/cron-builder/lib/types";
import { brand } from "@/lib/brand";
import { useId, useState } from "react";

type FieldMode = "every" | "specific" | "range" | "interval";

const MODES: { id: FieldMode; label: string }[] = [
  { id: "every", label: "Every" },
  { id: "specific", label: "Specific" },
  { id: "range", label: "Range" },
  { id: "interval", label: "Interval" },
];

const FIELD_LABELS: Partial<Record<CronFieldName, readonly string[]>> = {
  month: MONTH_LABELS,
  dayOfWeek: WEEKDAY_LABELS,
};

const FIELD_UNIT: Record<CronFieldName, string> = {
  minute: "minute",
  hour: "hour",
  dayOfMonth: "day",
  month: "month",
  dayOfWeek: "day of the week",
};

function detectMode(ast: CronFieldAst): FieldMode {
  if (ast.length !== 1) return "specific";
  const item = ast[0];
  if (item.kind === "every") return "every";
  if (item.kind === "step") return "interval";
  if (item.kind === "range") return "range";
  return "specific";
}

function pluralize(unit: string, n: number): string {
  return n === 1 ? unit : `${unit}s`;
}

function pillButtonStyle(active: boolean): React.CSSProperties {
  return active
    ? {
        background: `${brand.colors.green[500]}20`,
        color: brand.colors.green[500],
        border: `1px solid ${brand.colors.green[500]}50`,
      }
    : {
        background: brand.colors.surface[1],
        color: "#A9B8C7",
        border: `1px solid ${brand.colors.border.subtle}`,
      };
}

interface CronFieldEditorProps {
  fieldName: CronFieldName;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function CronFieldEditor({
  fieldName,
  label,
  value,
  onChange,
}: CronFieldEditorProps) {
  const range = FIELD_META[fieldName];
  const labels = FIELD_LABELS[fieldName];
  const unit = FIELD_UNIT[fieldName];
  const groupId = useId();

  const [initial] = useState(() => {
    const result = parseField(value, fieldName);
    return result.ok
      ? result.parsed
      : { ast: [{ kind: "every" as const }], values: [] };
  });

  const [mode, setMode] = useState<FieldMode>(() => detectMode(initial.ast));
  const [selected, setSelected] = useState<number[]>(
    initial.values.length > 0 ? initial.values : [range.min],
  );
  const [rangeBounds, setRangeBounds] = useState(() => {
    const item = initial.ast[0];
    if (initial.ast.length === 1 && item.kind === "range") {
      return { from: item.start, to: item.end };
    }
    return { from: range.min, to: range.max };
  });
  const [step, setStep] = useState(() => {
    const item = initial.ast[0];
    if (
      initial.ast.length === 1 &&
      (item.kind === "step" || item.kind === "rangeStep")
    ) {
      return item.step;
    }
    return 1;
  });

  function emit(
    nextMode: FieldMode,
    overrides?: {
      selected?: number[];
      range?: { from: number; to: number };
      step?: number;
    },
  ) {
    const s = overrides?.selected ?? selected;
    const r = overrides?.range ?? rangeBounds;
    const st = overrides?.step ?? step;

    if (nextMode === "every") return onChange("*");
    if (nextMode === "interval") return onChange(`*/${st}`);
    if (nextMode === "range") {
      return onChange(r.from === r.to ? String(r.from) : `${r.from}-${r.to}`);
    }
    onChange(canonicalizeValues(s.length > 0 ? s : [range.min], range));
  }

  function selectMode(next: FieldMode) {
    setMode(next);
    emit(next);
  }

  function toggleValue(v: number) {
    const isSelected = selected.includes(v);
    if (isSelected && selected.length === 1) return; // never allow an empty field
    const next = isSelected
      ? selected.filter((x) => x !== v)
      : [...selected, v].sort((a, b) => a - b);
    setSelected(next);
    emit("specific", { selected: next });
  }

  function updateRangeFrom(from: number) {
    const clamped = Math.min(Math.max(from, range.min), range.max);
    const next = { from: clamped, to: Math.max(clamped, rangeBounds.to) };
    setRangeBounds(next);
    emit("range", { range: next });
  }

  function updateRangeTo(to: number) {
    const clamped = Math.min(Math.max(to, range.min), range.max);
    const next = { from: Math.min(rangeBounds.from, clamped), to: clamped };
    setRangeBounds(next);
    emit("range", { range: next });
  }

  function updateStep(next: number) {
    const clamped = Math.min(
      Math.max(Number.isFinite(next) ? next : 1, 1),
      range.max,
    );
    setStep(clamped);
    emit("interval", { step: clamped });
  }

  const options = Array.from(
    { length: range.max - range.min + 1 },
    (_, i) => range.min + i,
  );

  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-xs font-medium text-zinc-400">
        {label}
      </legend>

      <div
        role="group"
        aria-label={`${label} mode`}
        className="mb-3 flex flex-wrap gap-1"
      >
        {MODES.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              aria-pressed={active}
              onClick={() => selectMode(m.id)}
              className="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
              style={
                active
                  ? {
                      background: `${brand.colors.green[500]}20`,
                      color: brand.colors.green[500],
                      border: `1px solid ${brand.colors.green[500]}40`,
                    }
                  : {
                      background: brand.colors.surface[3],
                      color: "#A9B8C7",
                      border: "1px solid transparent",
                    }
              }
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {mode === "every" && (
        <p className="text-xs text-zinc-400">Runs on every {unit}.</p>
      )}

      {mode === "interval" && (
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>Every</span>
          <input
            type="number"
            min={1}
            max={range.max}
            value={step}
            onChange={(e) => updateStep(Number(e.target.value))}
            aria-label={`${label} interval, in ${unit}s`}
            className="w-16 rounded-md border px-2 py-1 text-sm text-white"
            style={{
              background: brand.colors.surface[1],
              borderColor: `${brand.colors.green[500]}30`,
            }}
          />
          <span>{pluralize(unit, step)}</span>
        </div>
      )}

      {mode === "range" &&
        (labels ? (
          <div className="flex flex-col gap-3">
            <LabeledOptionRow
              legend="From"
              ariaLabel={`${label} range start`}
              labels={labels}
              min={range.min}
              max={range.max}
              value={rangeBounds.from}
              onChange={updateRangeFrom}
            />
            <LabeledOptionRow
              legend="to"
              ariaLabel={`${label} range end`}
              labels={labels}
              min={range.min}
              max={range.max}
              value={rangeBounds.to}
              onChange={updateRangeTo}
            />
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
            <span>From</span>
            <NumberRangeInput
              id={`${groupId}-from`}
              ariaLabel={`${label} range start`}
              min={range.min}
              max={range.max}
              value={rangeBounds.from}
              onChange={updateRangeFrom}
            />
            <span>to</span>
            <NumberRangeInput
              id={`${groupId}-to`}
              ariaLabel={`${label} range end`}
              min={range.min}
              max={range.max}
              value={rangeBounds.to}
              onChange={updateRangeTo}
            />
          </div>
        ))}

      {mode === "specific" && (
        <div className="flex flex-wrap gap-1.5">
          {options.map((v) => {
            const isSelected = selected.includes(v);
            const displayLabel = labels ? labels[v - range.min] : String(v);
            return (
              <button
                key={v}
                type="button"
                aria-pressed={isSelected}
                aria-label={`${label} ${displayLabel}`}
                onClick={() => toggleValue(v)}
                className="flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-xs font-medium transition-colors"
                style={pillButtonStyle(isSelected)}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}

interface LabeledOptionRowProps {
  legend: string;
  ariaLabel: string;
  labels: readonly string[];
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

/** Single-select row of pill buttons — used for Range mode on labeled fields (month, day of week) instead of a native select, to match the rest of the tool's button-driven controls. */
function LabeledOptionRow({
  legend,
  ariaLabel,
  labels,
  min,
  max,
  value,
  onChange,
}: LabeledOptionRowProps) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div>
      <span className="mb-1.5 block text-xs text-zinc-400">{legend}</span>
      <div
        role="group"
        aria-label={ariaLabel}
        className="flex flex-wrap gap-1.5"
      >
        {options.map((v) => {
          const active = v === value;
          return (
            <button
              key={v}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(v)}
              className="flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-xs font-medium transition-colors"
              style={pillButtonStyle(active)}
            >
              {labels[v - min]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface NumberRangeInputProps {
  id: string;
  ariaLabel: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

function NumberRangeInput({
  id,
  ariaLabel,
  min,
  max,
  value,
  onChange,
}: NumberRangeInputProps) {
  return (
    <input
      id={id}
      type="number"
      aria-label={ariaLabel}
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-16 rounded-md border px-2 py-1 text-sm text-white"
      style={{
        background: brand.colors.surface[1],
        borderColor: `${brand.colors.green[500]}30`,
      }}
    />
  );
}
