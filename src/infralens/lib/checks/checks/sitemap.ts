import { readBodyText, safeFetch } from "@infralens-lib/security/safe-fetch";
import { CheckRunner } from "../types";
import { parseRobots } from "./robots";

/** Never grows unbounded — this check is a signal, not a crawler (master plan §11.12). */
const MAX_LOCATIONS_TRIED = 3;

async function fetchSitemapDeclaredInRobots(
  origin: string,
  signal: AbortSignal,
): Promise<string[]> {
  try {
    const response = await safeFetch(`${origin}/robots.txt`, {
      method: "GET",
      signal,
    });
    if (response.status !== 200) return [];
    const content = await readBodyText(response);
    return parseRobots(content).sitemaps;
  } catch {
    return [];
  }
}

export const runSitemapCheck: CheckRunner<{
  present: boolean;
  format?: "xml" | "index";
  urlCount?: number;
  sitemapUrl?: string;
  triedLocations: string[];
}> = async ({ url, timeout }) => {
  const start = performance.now();

  try {
    const urlObj = new URL(url);
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      // Prefer whatever robots.txt actually declares (master plan §11.12:
      // "tester [...] les références de robots.txt") before falling back to
      // the two conventional default locations.
      const declared = await fetchSitemapDeclaredInRobots(
        urlObj.origin,
        controller.signal,
      );
      const candidates = [
        ...declared,
        `${urlObj.origin}/sitemap.xml`,
        `${urlObj.origin}/sitemap_index.xml`,
      ]
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, MAX_LOCATIONS_TRIED);

      let present = false;
      let format: "xml" | "index" | undefined;
      let urlCount: number | undefined;
      let sitemapUrl: string | undefined;
      const triedLocations: string[] = [];

      for (const candidate of candidates) {
        triedLocations.push(candidate);
        try {
          const response = await safeFetch(candidate, {
            method: "GET",
            signal: controller.signal,
          });
          if (!response.ok) continue;

          const text = await readBodyText(response);

          if (text.includes("<sitemapindex")) {
            format = "index";
            urlCount = (text.match(/<sitemap>/g) || []).length;
          } else if (text.includes("<urlset")) {
            format = "xml";
            urlCount = (text.match(/<url>/g) || []).length;
          } else {
            continue; // 200 but doesn't look like a sitemap — keep trying
          }

          present = true;
          sitemapUrl = candidate;
          break;
        } catch {
          continue;
        }
      }

      clearTimeout(id);

      let status: "pass" | "warning" = "pass";
      let summary = "";

      if (!present) {
        status = "warning";
        summary = `Sitemap not found at any of the ${triedLocations.length} location(s) tried.`;
      } else {
        summary = `Sitemap found (${format} format${
          urlCount ? `, ~${urlCount} URLs` : ""
        }).`;
      }

      return {
        id: "sitemap",
        label: "Sitemap",
        category: "website-structure",
        status,
        summary,
        data: {
          present,
          format,
          urlCount,
          sitemapUrl,
          triedLocations,
        },
        limitations: [
          `Tries at most ${MAX_LOCATIONS_TRIED} locations (robots.txt's declared Sitemap:, then the two conventional defaults) and never recurses into a sitemap index's child sitemaps — a signal, not a full crawl.`,
        ],
        durationMs: Math.round(performance.now() - start),
      };
    } catch {
      clearTimeout(id);
      // A genuine fetch failure — the check couldn't run, distinct from
      // "no sitemap found" (master plan §9.6).
      return {
        id: "sitemap",
        label: "Sitemap",
        category: "website-structure",
        status: "error",
        summary: "Unable to fetch sitemap.",
        durationMs: Math.round(performance.now() - start),
      };
    }
  } catch {
    return {
      id: "sitemap",
      label: "Sitemap",
      category: "website-structure",
      status: "error",
      summary: "Unable to check sitemap.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
