"use client";

import { copyToClipboard } from "@/api-studio/lib/clipboard";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

/** Shared "Copy" affordance used across the response viewer, code panel and webhook event detail — a brief "Copied" confirmation, best-effort (see `clipboard.ts`). */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={async () => {
        const ok = await copyToClipboard(text);
        if (ok) {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }
      }}
      className="self-start"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}
