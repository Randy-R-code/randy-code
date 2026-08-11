"use client";

import { Button } from "@/components/ui/button";
import { HistoryEntry } from "@infralens-lib/history/types";
import { cn } from "@infralens-lib/utils";
import { ExternalLink, History, Trash2, X } from "lucide-react";

type HistorySectionProps = {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
};

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getGradeStyles(grade: string): {
  text: string;
  bg: string;
  border: string;
} {
  switch (grade) {
    case "A":
      return {
        text: "text-emerald-400",
        bg: "bg-emerald-400/10",
        border: "border-emerald-400/30",
      };
    case "B":
      return {
        text: "text-lime-400",
        bg: "bg-lime-400/10",
        border: "border-lime-400/30",
      };
    case "C":
      return {
        text: "text-yellow-400",
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/30",
      };
    case "D":
      return {
        text: "text-orange-400",
        bg: "bg-orange-400/10",
        border: "border-orange-400/30",
      };
    case "E":
      return {
        text: "text-red-400",
        bg: "bg-red-400/10",
        border: "border-red-400/30",
      };
    default:
      return {
        text: "text-zinc-400",
        bg: "bg-zinc-400/10",
        border: "border-zinc-400/30",
      };
  }
}

export function HistorySection({
  history,
  onSelect,
  onRemove,
  onClear,
}: HistorySectionProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <section className="pb-8 md:pb-12 lg:pb-16 px-6 sm:px-8 md:px-12">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="size-4 text-zinc-500" />
            <h2 className="text-sm font-medium text-zinc-400">
              Recent analyses
            </h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-7 px-2 text-xs text-zinc-500 hover:text-red-400"
          >
            <Trash2 className="size-3 mr-1" />
            Clear all
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {history.map((entry) => {
            const gradeStyles = getGradeStyles(entry.results.score.grade);
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => onSelect(entry)}
                className="group relative flex flex-col items-start sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 py-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-brand-secondary/10 hover:border-brand-secondary/40 cursor-pointer transition-all"
              >
                <span className="text-sm text-zinc-200 font-medium group-hover:text-zinc-100 -mt-0.5">
                  {entry.results.hostname}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm font-bold px-2 py-0.5 rounded-md border",
                      gradeStyles.text,
                      gradeStyles.bg,
                      gradeStyles.border,
                    )}
                  >
                    {entry.results.score.grade}
                  </span>
                  <span className="text-xs text-zinc-500 group-hover:text-zinc-400">
                    {formatDate(entry.timestamp)}
                  </span>
                  <ExternalLink className="size-3.5 text-zinc-600 group-hover:text-brand-secondary-hover transition-colors" />
                </div>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(entry.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      onRemove(entry.id);
                    }
                  }}
                  className="absolute top-3 right-3 size-5 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 hover:bg-zinc-700/50 transition-all"
                  aria-label={`Remove ${entry.results.hostname}`}
                >
                  <X className="size-3.5" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
