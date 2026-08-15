"use client";

import { brand } from "@/lib/brand";
import { copyToClipboard } from "@/metalens/lib/clipboard";
import { isSafeExternalUrl } from "@/metalens/lib/resolve-urls";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MetadataRowProps {
  label: string;
  value?: string;
  /** When true and the value is a safe http(s) URL, render it as a clickable link (spec §87/§92). Unsafe schemes (javascript:, data:, file:) always render as plain text. */
  isUrl?: boolean;
  hint?: string;
}

export function MetadataRow({ label, value, isUrl, hint }: MetadataRowProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleCopy() {
    if (!value) return;
    const ok = await copyToClipboard(value);
    if (!ok) return;
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1500);
  }

  const safeLink =
    isUrl && value && isSafeExternalUrl(value) ? value : undefined;

  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-zinc-400">{label}</p>
        {value ? (
          safeLink ? (
            <a
              href={safeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 inline-flex items-start gap-1 hover:underline"
              style={{ color: brand.colors.blue[300] }}
            >
              <span className="break-all text-sm">{value}</span>
              <ExternalLink size={11} className="mt-0.5 shrink-0" />
            </a>
          ) : (
            <p className="mt-0.5 break-all text-sm text-white">{value}</p>
          )
        ) : (
          <p className="mt-0.5 text-sm text-zinc-400">Not found</p>
        )}
        {hint && <p className="mt-1 text-xs text-zinc-400">{hint}</p>}
      </div>
      {value && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? `Copied ${label}` : `Copy ${label}`}
          title={copied ? "Copied" : "Copy"}
          className="shrink-0 rounded-md p-1.5 text-zinc-400 transition-colors hover:text-zinc-200"
          style={{ background: brand.colors.surface[3] }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
      )}
    </div>
  );
}
