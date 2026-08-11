import { EXPORT_SCHEMA_VERSION } from "@infralens-config/constants";
import { ChecksResponse, EvidenceItem, GlobalScore } from "./types";

export type InfraLensExport = {
  url: string;
  scannedAt: string;
  score: number;
  grade: GlobalScore["grade"];
  categories: Array<{
    category: string;
    score: number;
    maxScore: number;
  }>;
  checks: Array<{
    id: string;
    label: string;
    category: string;
    status: string;
    summary?: string;
    durationMs: number;
    scored?: boolean;
    scoreContribution?: number;
    evidence?: EvidenceItem[];
  }>;
  version: string;
};

/** Drops any evidence item marked `sensitive: true` (master plan §10.3, Phase 4 "nettoyer les données sensibles") — e.g. a resolved IP is useful in the UI but not worth baking into a JSON file someone might share. */
function redactEvidence(
  evidence: EvidenceItem[] | undefined,
): EvidenceItem[] | undefined {
  if (!evidence) return undefined;
  const kept = evidence.filter((item) => !item.sensitive);
  return kept.length > 0 ? kept : undefined;
}

export function buildExport(response: ChecksResponse): InfraLensExport {
  return {
    url: response.url,
    scannedAt: new Date().toISOString(),
    score: response.score.score,
    grade: response.score.grade,
    categories: response.score.categories.map((c) => ({
      category: c.category,
      score: c.score,
      maxScore: c.maxScore,
    })),
    checks: response.checks.map((check) => ({
      id: check.id,
      label: check.label,
      category: check.category,
      status: check.status,
      summary: check.summary,
      durationMs: check.durationMs,
      scored: check.scored,
      scoreContribution: check.scoreContribution,
      evidence: redactEvidence(check.evidence),
    })),
    version: EXPORT_SCHEMA_VERSION,
  };
}

export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}
