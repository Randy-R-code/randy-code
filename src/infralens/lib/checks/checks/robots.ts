import { readBodyText, safeFetch } from "@infralens-lib/security/safe-fetch";
import { CheckRunner, EvidenceItem } from "../types";

type RobotsAnalysis = {
  sitemaps: string[];
  blocksAll: boolean;
  directiveCounts: Record<string, number>;
};

/**
 * Lightweight line-based parser, not a full spec implementation — good
 * enough to spot a sitewide block or list declared sitemaps without
 * pretending to fully validate robots.txt syntax.
 */
/** Exported for reuse by `sitemap.ts`, which needs the declared Sitemap: URL(s) before falling back to guessed locations. */
export function parseRobots(content: string): RobotsAnalysis {
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const sitemaps: string[] = [];
  const directiveCounts: Record<string, number> = {};
  let currentAgents: string[] = [];
  let lastWasUserAgent = false;
  let blocksAll = false;

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim().toLowerCase();
    const value = line.slice(colonIndex + 1).trim();
    if (!key) continue;

    directiveCounts[key] = (directiveCounts[key] || 0) + 1;

    if (key === "user-agent") {
      if (!lastWasUserAgent) currentAgents = [];
      currentAgents.push(value.toLowerCase());
      lastWasUserAgent = true;
      continue;
    }
    lastWasUserAgent = false;

    if (key === "disallow" && value === "/" && currentAgents.includes("*")) {
      blocksAll = true;
    } else if (key === "sitemap" && value) {
      sitemaps.push(value);
    }
  }

  return { sitemaps, blocksAll, directiveCounts };
}

export const runRobotsCheck: CheckRunner<{
  present: boolean;
  status: number;
  isValid: boolean;
  content?: string;
  sitemaps: string[];
  blocksAll: boolean;
}> = async ({ url, timeout }) => {
  const start = performance.now();

  try {
    const urlObj = new URL(url);
    const robotsUrl = `${urlObj.origin}/robots.txt`;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await safeFetch(robotsUrl, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(id);

      const status = response.status;
      const present = status === 200;
      let isValid = false;
      let content: string | undefined;
      let analysis: RobotsAnalysis = {
        sitemaps: [],
        blocksAll: false,
        directiveCounts: {},
      };

      if (present) {
        content = await readBodyText(response);
        // Basic validation: check for common robots.txt patterns
        isValid =
          content.includes("User-agent:") ||
          content.includes("Disallow:") ||
          content.includes("Allow:") ||
          content.includes("Sitemap:");
        if (isValid) analysis = parseRobots(content);
      }

      let checkStatus: "pass" | "warning" | "error" = "pass";
      let summary = "";

      if (!present) {
        checkStatus = "warning";
        summary = "robots.txt is not present.";
      } else if (!isValid) {
        checkStatus = "warning";
        summary = "robots.txt is present but may be invalid or empty.";
      } else if (analysis.blocksAll) {
        // Not a security problem — this is explicitly an SEO/indexing
        // signal, not a vulnerability.
        checkStatus = "warning";
        summary =
          "robots.txt disallows all crawlers from the entire site (Disallow: / under User-agent: *).";
      } else {
        summary = "robots.txt is present and appears valid.";
      }

      const evidence: EvidenceItem[] = analysis.sitemaps.map((s) => ({
        label: "Sitemap reference",
        value: s,
        source: "derived" as const,
      }));

      return {
        id: "robots",
        label: "robots.txt",
        category: "website-structure",
        status: checkStatus,
        summary,
        data: {
          present,
          status,
          isValid,
          content: content?.substring(0, 500), // Limit content size
          sitemaps: analysis.sitemaps,
          blocksAll: analysis.blocksAll,
        },
        evidence: evidence.length > 0 ? evidence : undefined,
        limitations: [
          "robots.txt is not a security control — its absence isn't reported as a vulnerability, and this check only performs a lightweight, line-based read of the file, not a full spec validation.",
        ],
        durationMs: Math.round(performance.now() - start),
      };
    } catch {
      clearTimeout(id);
      return {
        id: "robots",
        label: "robots.txt",
        category: "website-structure",
        status: "error",
        summary: "Unable to fetch robots.txt.",
        durationMs: Math.round(performance.now() - start),
      };
    }
  } catch {
    return {
      id: "robots",
      label: "robots.txt",
      category: "website-structure",
      status: "error",
      summary: "Unable to check robots.txt.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
