"use client";

import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@infralens-lib/clipboard";
import { cn } from "@infralens-lib/utils";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={handleClick}
      title={label}
      aria-label={copied ? `${label} — copied` : label}
      className={cn("text-muted-foreground hover:text-foreground", className)}
    >
      {copied ? (
        <Check className="size-3.5 text-emerald-500" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" aria-hidden="true" />
      )}
    </Button>
  );
}
