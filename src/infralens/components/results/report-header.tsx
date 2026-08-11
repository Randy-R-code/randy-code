"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildExport, downloadJson } from "@infralens-lib/checks/export";
import {
  buildMarkdownReport,
  downloadTextFile,
} from "@infralens-lib/checks/export-markdown";
import { ChecksResponse } from "@infralens-lib/checks/types";
import { Download, FileText, GitCompare, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CopyButton } from "./copy-button";
import { ScoreBadge } from "./score-badge";

function faviconUrl(finalUrl: string): string | null {
  try {
    return `${new URL(finalUrl).origin}/favicon.ico`;
  } catch {
    return null;
  }
}

function finalUrlOf(results: ChecksResponse): string {
  const redirects = results.checks.find((c) => c.id === "redirects");
  const data = redirects?.data as { finalUrl?: string } | undefined;
  return data?.finalUrl || results.url;
}

function buildSummaryText(results: ChecksResponse): string {
  const finalUrl = finalUrlOf(results);
  const date = new Date(results.analyzedAt).toLocaleString();
  return `InfraLens report for ${results.hostname} — ${results.score.score}/100 (${results.score.grade})\n${finalUrl}\nAnalyzed ${date} · ${results.totalDurationMs}ms`;
}

export function ReportHeader({
  results,
  onNewAnalysis,
}: {
  results: ChecksResponse;
  onNewAnalysis?: () => void;
}) {
  const [favicon, setFavicon] = useState<string | null>(() =>
    faviconUrl(finalUrlOf(results)),
  );
  const finalUrl = finalUrlOf(results);
  const date = new Date(results.analyzedAt);

  const handleExportJson = () => {
    const exportData = buildExport(results);
    const filename = `infralens-${results.hostname}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    downloadJson(exportData, filename);
  };

  const handleExportMarkdown = () => {
    const markdown = buildMarkdownReport(results);
    const filename = `infralens-${results.hostname}-${
      new Date().toISOString().split("T")[0]
    }.md`;
    downloadTextFile(markdown, filename, "text/markdown");
  };

  return (
    <Card className="border-border bg-background/50">
      <CardContent className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          {favicon && (
            // Loaded directly by the browser, not by our server — no SSRF
            // surface, same as any other cross-origin image on the page.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={favicon}
              alt=""
              className="size-10 rounded mt-1"
              onError={() => setFavicon(null)}
            />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-semibold text-foreground truncate">
                {results.hostname}
              </h2>
              <CopyButton value={results.hostname} label="Copy hostname" />
            </div>
            <p className="text-sm text-muted-foreground truncate max-w-md">
              {finalUrl}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {date.toLocaleString()} · {results.totalDurationMs}ms
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 md:items-end">
          <ScoreBadge score={results.score} />
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
            <CopyButton
              value={buildSummaryText(results)}
              label="Copy summary"
              className="border border-border"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              className="border-border text-muted-foreground hover:text-foreground"
              title="Export JSON"
            >
              <Download className="size-4 sm:mr-2" />
              <span className="hidden sm:inline">JSON</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportMarkdown}
              className="border-border text-muted-foreground hover:text-foreground"
              title="Export Markdown"
            >
              <FileText className="size-4 sm:mr-2" />
              <span className="hidden sm:inline">Markdown</span>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:text-foreground"
              title="Compare with another report"
            >
              <Link href="/tools/infralens/compare">
                <GitCompare className="size-4 sm:mr-2" />
                <span className="hidden sm:inline">Compare</span>
              </Link>
            </Button>
            {onNewAnalysis && (
              <Button
                variant="outline"
                size="sm"
                onClick={onNewAnalysis}
                className="border-border text-muted-foreground hover:text-foreground"
                title="New Analysis"
              >
                <RefreshCw className="size-4 sm:mr-2" />
                <span className="hidden sm:inline">New Analysis</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
