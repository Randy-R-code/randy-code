"use client";

import type { BodyMode } from "@/api-studio/lib/types";
import { Button } from "@/components/ui/button";
import { formatJson } from "@/json-studio/lib/format";
import { parseJson } from "@/json-studio/lib/parse";
import { useState } from "react";

const MODES: { value: BodyMode; label: string }[] = [
  { value: "none", label: "None" },
  { value: "json", label: "JSON" },
  { value: "text", label: "Text" },
  { value: "url-encoded", label: "URL Encoded" },
];

interface BodyEditorProps {
  mode: BodyMode;
  value: string;
  onModeChange: (mode: BodyMode) => void;
  onValueChange: (value: string) => void;
}

export function BodyEditor({
  mode,
  value,
  onModeChange,
  onValueChange,
}: BodyEditorProps) {
  const [jsonError, setJsonError] = useState<string | null>(null);

  function handleFormat() {
    const result = parseJson(value || "");
    if (!result.success) {
      setJsonError(result.error.message);
      return;
    }
    setJsonError(null);
    onValueChange(formatJson(result.value));
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        role="radiogroup"
        aria-label="Body type"
        className="flex flex-wrap gap-2"
      >
        {MODES.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={mode === option.value}
            onClick={() => onModeChange(option.value)}
            className={
              mode === option.value
                ? "rounded-md border border-brand-accent/40 bg-brand-accent/10 px-3 py-1.5 text-sm font-medium text-brand-accent-hover"
                : "rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            }
          >
            {option.label}
          </button>
        ))}
      </div>

      {mode !== "none" && (
        <div className="flex flex-col gap-2">
          {mode === "json" && (
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFormat}
              >
                Format
              </Button>
              {jsonError && (
                <span className="text-xs text-destructive">{jsonError}</span>
              )}
            </div>
          )}
          <label htmlFor="body-editor-textarea" className="sr-only">
            Request body
          </label>
          <textarea
            id="body-editor-textarea"
            value={value}
            onChange={(event) => {
              onValueChange(event.target.value);
              if (mode === "json") setJsonError(null);
            }}
            rows={10}
            spellCheck={false}
            placeholder={
              mode === "json"
                ? '{\n  "key": "value"\n}'
                : mode === "url-encoded"
                  ? "key1=value1&key2=value2"
                  : "Request body..."
            }
            className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
