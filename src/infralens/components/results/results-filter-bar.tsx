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
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-border",
            )}
          >
            {FILTER_LABELS[filter]} ({count})
          </button>
        );
      })}
    </div>
  );
}
