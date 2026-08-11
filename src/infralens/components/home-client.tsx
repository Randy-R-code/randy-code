"use client";

import { HistorySection } from "@infralens-components/history/history-section";
import { CTA } from "@infralens-components/landing/cta";
import { Hero } from "@infralens-components/landing/hero";
import { ResultsSection } from "@infralens-components/results/results-section";
import { useAnalysisHistory } from "@infralens-hooks/use-analysis-history";
import {
  buildErrorResult,
  parseAnalysisError,
} from "@infralens-lib/checks/parse-error";
import { ChecksResponse } from "@infralens-lib/checks/types";
import { HistoryEntry } from "@infralens-lib/history/types";
import { ReactNode, useRef, useState } from "react";
import { runInfraChecks } from "../../../app/tools/infralens/actions/run-checks";

export function HomeClient({
  landingSections,
}: {
  landingSections: ReactNode;
}) {
  const [results, setResults] = useState<ChecksResponse | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { history, addEntry, removeEntry, clearHistory } = useAnalysisHistory();
  // Cancellation is client-side only (master plan §15.2, "si possible") — the
  // server action already in flight keeps running and its result is simply
  // discarded here rather than applied. Narrow edge case, accepted as a
  // known limitation: cancelling and immediately starting a new analysis
  // before the cancelled one's promise settles could have the stale result
  // briefly overwrite the new run's loading state.
  const cancelledRef = useRef(false);

  const handleResults = (newResults: ChecksResponse) => {
    if (cancelledRef.current) return;
    setResults(newResults);
    setIsLoading(false);
    addEntry(newResults);
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setResults(entry.results);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleReset = () => {
    setResults(undefined);
    setIsLoading(false);
    setTimeout(() => {
      document.getElementById("hero")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleCancel = () => {
    cancelledRef.current = true;
    setIsLoading(false);
    setResults(undefined);
  };

  // Shared analysis runner used by the CTA form
  const runAnalysis = async (url: string) => {
    cancelledRef.current = false;
    setIsLoading(true);
    setResults(undefined);
    try {
      const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
      const result = await runInfraChecks(new URL(normalizedUrl).toString());
      if (cancelledRef.current) return;
      if (result.ok) {
        setResults(result.data);
        addEntry(result.data);
      } else {
        setResults(buildErrorResult(result.message, url));
      }
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error) {
      if (cancelledRef.current) return;
      setResults(parseAnalysisError(error, url));
    } finally {
      if (!cancelledRef.current) setIsLoading(false);
    }
  };

  const hasResults = !isLoading && !!results;

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <Hero
        onResults={handleResults}
        onAnalysisStart={() => {
          cancelledRef.current = false;
          setIsLoading(true);
          setResults(undefined);
        }}
        isLoading={isLoading}
      />

      {(isLoading || results) && (
        <ResultsSection
          results={results}
          isLoading={isLoading}
          onNewAnalysis={handleReset}
          onCancel={handleCancel}
        />
      )}

      {!hasResults && (
        <>
          <HistorySection
            history={history}
            onSelect={handleHistorySelect}
            onRemove={removeEntry}
            onClear={clearHistory}
          />
          {landingSections}
          <CTA onAnalyze={runAnalysis} isLoading={isLoading} />
        </>
      )}
    </main>
  );
}
