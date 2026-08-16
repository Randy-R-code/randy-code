"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      className="flex flex-col gap-3 min-[26.25rem]:flex-row min-[26.25rem]:items-start"
    >
      <div className="relative flex-1">
        <label htmlFor="metalens-url" className="sr-only">
          Public URL to analyze
        </label>
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
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
          className={
            showError
              ? "pl-10 h-12 text-base bg-background border-destructive text-foreground focus:border-destructive focus:ring-destructive/30"
              : "pl-10 h-12 text-base bg-background border-brand-accent/30 text-foreground focus:border-brand-accent focus:ring-brand-accent/30"
          }
        />
        {showError && (
          <p
            id="metalens-url-error"
            className="mt-1.5 text-xs text-destructive"
          >
            Enter a valid public HTTP or HTTPS URL.
          </p>
        )}
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="h-12 min-[26.25rem]:px-8 w-full min-[26.25rem]:w-auto border border-brand-accent/40 bg-brand-accent/10 text-brand-accent-hover hover:bg-brand-accent/20 disabled:opacity-50"
      >
        {pending ? "Analyzing…" : "Analyze"}
      </Button>
    </form>
  );
}
