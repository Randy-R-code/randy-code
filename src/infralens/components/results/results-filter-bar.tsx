"use client";

import {
  FILTER_LABELS,
  filterChecks,
  RESULT_FILTERS,
  ResultFilter,
} from "@infralens-lib/checks/results-filter";
import { CheckResult } from "@infralens-lib/checks/types";
import { cn } from "@infralens-lib/utils";

export function ResultsFilterBar({
  checks,
  active,
  onChange,
}: {
  checks: CheckResult[];
  active: ResultFilter;
  onChange: (filter: ResultFilter) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Filter checks by status"
      className="flex flex-wrap gap-2"
    >
      {RESULT_FILTERS.map((filter) => {
        const count = filterChecks(checks, filter).length;
        const isActive = filter === active;
        return (
          <button
            key={filter}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(filter)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              isActive
                ? "bg-zinc-100 text-zinc-900 border-zinc-100"
                : "bg-transparent text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700",
            )}
          >
            {FILTER_LABELS[filter]} ({count})
          </button>
        );
      })}
    </div>
  );
}
