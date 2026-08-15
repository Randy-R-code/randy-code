"use client";

import { CronExpressionCard } from "@/cron-builder/components/cron-expression";
import { CronFieldEditor } from "@/cron-builder/components/cron-field-editor";
import { CronPresets } from "@/cron-builder/components/cron-presets";
import { CronSchedulePreview } from "@/cron-builder/components/cron-preview";
import {
  DEFAULT_EXPRESSION,
  describeCron,
  getNextRuns,
  serialize,
} from "@/cron-builder/lib/cron";
import {
  FIELD_META,
  validateExpression,
} from "@/cron-builder/lib/cron-validation";
import {
  CRON_FIELD_ORDER,
  type CronFieldName,
  type CronFields,
  type ParsedCronFields,
} from "@/cron-builder/lib/types";
import { brand } from "@/lib/brand";
import { useMemo, useState, useSyncExternalStore } from "react";

function requireValid(expression: string): {
  fields: CronFields;
  parsed: ParsedCronFields;
} {
  const result = validateExpression(expression);
  if (!result.valid) {
    throw new Error(
      `Cron Builder default/preset expression must be valid: ${expression}`,
    );
  }
  return result;
}

export function CronBuilder() {
  const defaults = useMemo(() => requireValid(DEFAULT_EXPRESSION), []);

  const [rawExpression, setRawExpression] = useState(DEFAULT_EXPRESSION);
  const [fields, setFields] = useState<CronFields>(defaults.fields);
  const [parsed, setParsed] = useState<ParsedCronFields>(defaults.parsed);
  const [error, setError] = useState<string | null>(null);
  const [syncEpoch, setSyncEpoch] = useState(0);
  // Next-run times and the detected timezone depend on the client's clock,
  // which the server can't know — this reads as `false` for the SSR/first
  // hydration pass and flips to `true` right after, avoiding a mismatch.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  function applyExpression(expression: string) {
    const result = validateExpression(expression);
    setRawExpression(expression);
    if (result.valid) {
      setFields(result.fields);
      setParsed(result.parsed);
      setError(null);
    } else {
      setError(result.error);
    }
  }

  function handleFieldChange(name: CronFieldName, value: string) {
    const nextFields = { ...fields, [name]: value };
    const nextExpression = serialize(nextFields);
    const result = validateExpression(nextExpression);
    setRawExpression(nextExpression);
    if (result.valid) {
      setFields(result.fields);
      setParsed(result.parsed);
      setError(null);
    }
    // Visual field edits always produce syntactically valid output, so no
    // syncEpoch bump here — the field the user just touched already
    // reflects its own new state and doesn't need to re-derive its mode.
  }

  function handlePresetSelect(expression: string) {
    applyExpression(expression);
    setSyncEpoch((e) => e + 1);
  }

  function handleReset() {
    handlePresetSelect(DEFAULT_EXPRESSION);
  }

  const description = error === null ? describeCron(parsed) : null;
  const timezone = mounted
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : null;
  const nextRuns = mounted && error === null ? getNextRuns(parsed, 5) : [];

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:gap-6">
        <div className="flex flex-col gap-4 lg:gap-6">
          <CronExpressionCard
            rawExpression={rawExpression}
            onRawChange={applyExpression}
            error={error}
            description={description}
            onReset={handleReset}
          />

          <div
            className="rounded-xl border p-5"
            style={{
              borderColor: `${brand.colors.green[500]}18`,
              background: brand.colors.surface[2],
            }}
          >
            <h2 className="mb-4 text-xs font-medium text-zinc-400">
              Visual editor
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CRON_FIELD_ORDER.map((name) => (
                <CronFieldEditor
                  key={`${name}-${syncEpoch}`}
                  fieldName={name}
                  label={FIELD_META[name].label}
                  value={fields[name]}
                  onChange={(value) => handleFieldChange(name, value)}
                />
              ))}
            </div>
          </div>
        </div>

        <CronSchedulePreview
          runs={nextRuns}
          timezone={timezone}
          valid={error === null}
        />
      </div>

      <CronPresets
        activeExpression={rawExpression}
        onSelect={handlePresetSelect}
      />
    </div>
  );
}
