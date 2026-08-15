"use client";

import { brand } from "@/lib/brand";
import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";

interface MetaLensFormProps {
  onAnalyze: (url: string) => void;
  pending: boolean;
}

/** Light client-side pre-check only — accepts a bare domain or a full http(s) URL, defaulting to https like the server's own normalization (spec §10-11). The server remains the source of truth for validation and SSRF safety; this only avoids an unnecessary round trip for obviously malformed input. */
function looksLikeUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function MetaLensForm({ onAnalyze, pending }: MetaLensFormProps) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const valid = looksLikeUrl(value);
  const showError = touched && value.trim() !== "" && !valid;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (!valid) return;
    onAnalyze(value.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3"
    >
      <div className="flex-1">
        <label htmlFor="metalens-url" className="sr-only">
          Public URL to analyze
        </label>
        <input
          id="metalens-url"
          type="text"
          inputMode="url"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="https://example.com"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={showError}
          aria-describedby={showError ? "metalens-url-error" : undefined}
          className="w-full rounded-lg border px-3 py-2.5 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1"
          style={{
            background: brand.colors.surface[1],
            borderColor: showError
              ? brand.colors.functional.danger
              : `${brand.colors.green[500]}30`,
          }}
        />
        {showError && (
          <p
            id="metalens-url-error"
            className="mt-1.5 text-xs"
            style={{ color: brand.colors.functional.danger }}
          >
            Enter a valid public HTTP or HTTPS URL.
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          background: `${brand.colors.green[500]}20`,
          color: brand.colors.green[500],
        }}
      >
        <Search size={14} />
        {pending ? "Analyzing…" : "Analyze"}
      </button>
    </form>
  );
}
