"use client";

import { copyToClipboard } from "@/cron-builder/lib/clipboard";
import { brand } from "@/lib/brand";
import { Check, Copy, RotateCcw, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CronExpressionCardProps {
  rawExpression: string;
  onRawChange: (value: string) => void;
  error: string | null;
  description: string | null;
  dayRestrictionAmbiguous: boolean;
  onReset: () => void;
}

export function CronExpressionCard({
  rawExpression,
  onRawChange,
  error,
  description,
  dayRestrictionAmbiguous,
  onReset,
}: CronExpressionCardProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleCopy() {
    const ok = await copyToClipboard(rawExpression);
    if (!ok) return;
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-xl border border-border bg-card/50 p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <label
          htmlFor="cron-raw-input"
          className="text-xs font-medium text-zinc-400"
        >
          Cron expression
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-200"
            style={{ background: brand.colors.surface[3] }}
          >
            <RotateCcw size={12} />
            Reset
          </button>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={
              copied ? "Cron expression copied" : "Copy cron expression"
            }
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: `${brand.colors.green[500]}20`,
              color: brand.colors.green[500],
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <input
        id="cron-raw-input"
        type="text"
        value={rawExpression}
        onChange={(e) => onRawChange(e.target.value)}
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        aria-invalid={error !== null}
        aria-describedby={error ? "cron-raw-error" : undefined}
        className="w-full rounded-lg border px-3 py-2.5 font-mono text-base text-white focus:outline-none focus:ring-1 sm:text-lg"
        style={
          {
            background: brand.colors.surface[1],
            borderColor: error
              ? "rgba(239, 68, 68, 0.5)"
              : `${brand.colors.green[500]}30`,
            "--tw-ring-color": error
              ? "rgba(239, 68, 68, 0.5)"
              : `${brand.colors.green[500]}60`,
          } as React.CSSProperties
        }
      />

      <div className="mt-3 min-h-5" aria-live="polite">
        {error ? (
          <p id="cron-raw-error" className="text-xs text-red-400">
            {error}
          </p>
        ) : (
          description && <p className="text-sm text-zinc-300">{description}</p>
        )}
      </div>

      {!error && dayRestrictionAmbiguous && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-400">
          <TriangleAlert size={12} className="mt-0.5 shrink-0" />
          Day of month and day of week are both restricted. Their combined
          behavior can vary between cron implementations.
        </p>
      )}
    </div>
  );
}
