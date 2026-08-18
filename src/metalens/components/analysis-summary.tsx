import type { MetadataAnalysis } from "@/metalens/lib/types";

function countFor(
  findings: MetadataAnalysis["findings"],
  severity: MetadataAnalysis["findings"][number]["severity"],
): number {
  return findings.filter((f) => f.severity === severity).length;
}

export function AnalysisSummary({ analysis }: { analysis: MetadataAnalysis }) {
  const missing = countFor(analysis.findings, "missing");
  const warnings = countFor(analysis.findings, "warning");
  const invalid = countFor(analysis.findings, "invalid");
  const info = countFor(analysis.findings, "info");

  const parts = [
    warnings > 0 && `${warnings} check${warnings === 1 ? "" : "s"}`,
    missing > 0 && `${missing} missing`,
    invalid > 0 && `${invalid} invalid`,
    info > 0 && `${info} info`,
  ].filter(Boolean);

  const hasDifferentFinalUrl = analysis.finalUrl !== analysis.requestedUrl;

  return (
    <div className="rounded-xl border border-border bg-card/50 p-5">
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-zinc-400">Analyzed</p>
          <p className="break-all text-sm text-white">
            {analysis.requestedUrl}
          </p>
        </div>
        {hasDifferentFinalUrl && (
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-400">
              Final URL
              {analysis.redirectCount > 0
                ? ` · ${analysis.redirectCount} redirect${
                    analysis.redirectCount === 1 ? "" : "s"
                  }`
                : ""}
            </p>
            <p className="break-all text-sm text-white">{analysis.finalUrl}</p>
          </div>
        )}
      </div>
      {parts.length > 0 && (
        <p className="mt-3 text-xs text-zinc-400">{parts.join(" · ")}</p>
      )}
    </div>
  );
}
