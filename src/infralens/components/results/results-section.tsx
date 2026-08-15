"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORY_LABELS } from "@infralens-lib/checks/category-labels";
import {
  filterChecks,
  ResultFilter,
} from "@infralens-lib/checks/results-filter";
import { ChecksResponse } from "@infralens-lib/checks/types";
import { cn } from "@infralens-lib/utils";
import { XCircle } from "lucide-react";
import { useState } from "react";
import { CategorySections } from "./category-section";
import { PrioritySummary } from "./priority-summary";
import { ReportHeader } from "./report-header";
import { ResultsFilterBar } from "./results-filter-bar";
import { WhyScoreDialog } from "./why-score-dialog";

function LoadingState({ onCancel }: { onCancel?: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Analyzing…
        </p>
        {onCancel && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="border-border text-muted-foreground hover:text-foreground"
          >
            <XCircle className="size-4 sm:mr-2" />
            <span className="hidden sm:inline">Cancel</span>
          </Button>
        )}
      </div>
      <Card className="border-border bg-card/50">
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="size-10 rounded" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3.5 w-56" />
            </div>
            <Skeleton className="h-20 w-20 rounded-full" />
          </div>
        </CardContent>
      </Card>
      {[1, 2].map((i) => (
        <Card key={i} className="border-border bg-card/50">
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CategoryQuickNav({ results }: { results: ChecksResponse }) {
  return (
    <nav aria-label="Jump to category" className="flex flex-wrap gap-2 text-xs">
      {results.score.categories.map((c) => (
        <a
          key={c.category}
          href={`#category-${c.category}`}
          className="px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-border transition-colors"
        >
          {CATEGORY_LABELS[c.category]}
        </a>
      ))}
    </nav>
  );
}

export function ResultsSection({
  results,
  isLoading,
  onNewAnalysis,
  onCancel,
}: {
  results?: ChecksResponse;
  isLoading: boolean;
  onNewAnalysis?: () => void;
  onCancel?: () => void;
}) {
  const [filter, setFilter] = useState<ResultFilter>("all");

  if (!isLoading && !results) {
    return null;
  }

  const filteredChecks = results ? filterChecks(results.checks, filter) : [];

  return (
    <section
      id="results"
      className={cn("py-8 md:py-12 lg:py-16 px-6 sm:px-8 md:px-12 scroll-mt-8")}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {isLoading ? (
          <LoadingState onCancel={onCancel} />
        ) : (
          results && (
            <>
              <ReportHeader results={results} onNewAnalysis={onNewAnalysis} />

              <div className="flex justify-end">
                <WhyScoreDialog score={results.score} />
              </div>

              <PrioritySummary checks={results.checks} />

              <CategoryQuickNav results={results} />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-semibold">Checks</h3>
                <ResultsFilterBar
                  checks={results.checks}
                  active={filter}
                  onChange={setFilter}
                />
              </div>

              {filteredChecks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No checks match this filter.
                </p>
              ) : (
                <CategorySections
                  categories={results.score.categories}
                  checks={filteredChecks}
                />
              )}

              <div className="text-xs text-muted-foreground text-center">
                Analysis completed in {results.totalDurationMs}ms
              </div>
            </>
          )
        )}
      </div>
    </section>
  );
}
