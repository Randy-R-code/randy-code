"use client";

import { statusColor } from "@/api-studio/components/response-viewer/status-line";
import type { HistoryEntry } from "@/api-studio/lib/history/types";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/brand";
import { RotateCcw, Trash2 } from "lucide-react";

function relativeTime(timestamp: number): string {
  const diffSeconds = Math.round((Date.now() - timestamp) / 1000);
  if (diffSeconds < 60) return "just now";
  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.round(diffHours / 24)}d ago`;
}

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onReopen: (entry: HistoryEntry) => void;
  onResend: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function HistoryPanel({
  entries,
  onReopen,
  onResend,
  onRemove,
  onClear,
}: HistoryPanelProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-zinc-400">
        Sent requests will show up here — nothing sent yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-zinc-400">
          {entries.length} request{entries.length === 1 ? "" : "s"}
        </p>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          Clear all
        </Button>
      </div>

      <ul className="flex flex-col gap-1.5">
        {entries.map((entry) => {
          const color = entry.response.ok
            ? statusColor(entry.response.status)
            : brand.colors.functional.danger;
          const statusLabel = entry.response.ok
            ? String(entry.response.status)
            : "Error";

          return (
            <li
              key={entry.id}
              className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2"
            >
              <button
                type="button"
                onClick={() => onReopen(entry)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <span
                  className="shrink-0 rounded px-1.5 py-0.5 font-mono text-xs font-semibold"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  {statusLabel}
                </span>
                <span className="shrink-0 font-mono text-xs font-medium text-zinc-400">
                  {entry.request.method}
                </span>
                <span className="min-w-0 truncate text-sm text-foreground">
                  {entry.request.url}
                </span>
                <span className="ml-auto shrink-0 text-xs text-zinc-500">
                  {relativeTime(entry.timestamp)}
                </span>
              </button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onResend(entry)}
                aria-label={`Resend ${entry.request.method} ${entry.request.url}`}
              >
                <RotateCcw className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onRemove(entry.id)}
                aria-label={`Remove ${entry.request.method} ${entry.request.url}`}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
