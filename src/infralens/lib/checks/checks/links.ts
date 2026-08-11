import { safeFetch } from "@infralens-lib/security/safe-fetch";
import { CheckRunner } from "../types";

function parseLinks(
  html: string,
  baseUrl: string,
): {
  internal: string[];
  external: string[];
} {
  const baseUrlObj = new URL(baseUrl);
  const baseOrigin = baseUrlObj.origin;

  const internal: string[] = [];
  const external: string[] = [];

  // Simple regex-based parsing (no cheerio dependency for now)
  // Match <a href="..."> tags
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1].trim();
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("javascript:") ||
      href.startsWith("mailto:")
    ) {
      continue;
    }

    try {
      const url = new URL(href, baseUrl);
      if (url.origin === baseOrigin) {
        internal.push(url.toString());
      } else {
        external.push(url.toString());
      }
    } catch {
      // Invalid URL, skip
    }
  }

  return { internal, external };
}

export const runLinksCheck: CheckRunner<{
  internalCount: number;
  externalCount: number;
  unreachableCount: number;
  unreachable: string[];
}> = async ({ url, shared }) => {
  const start = performance.now();

  if (!shared.page) {
    return {
      id: "links",
      label: "Linked Pages",
      category: "website-structure",
      status: "error",
      summary: "Unable to analyze links.",
      durationMs: Math.round(performance.now() - start),
    };
  }

  try {
    const { internal, external } = parseLinks(shared.page.html, url);

    // Check for unreachable links (sample up to 10 links) — these are
    // different URLs than the main page, so each still needs its own
    // request; only the main-page fetch itself was deduplicated.
    const linksToCheck = [...internal, ...external].slice(0, 10);
    const unreachable: string[] = [];

    await Promise.allSettled(
      linksToCheck.map(async (linkUrl) => {
        try {
          const linkController = new AbortController();
          const linkTimeout = setTimeout(() => linkController.abort(), 3000);
          const linkResponse = await safeFetch(linkUrl, {
            method: "HEAD",
            signal: linkController.signal,
          });
          clearTimeout(linkTimeout);
          if (!linkResponse.ok && linkResponse.status >= 400) {
            unreachable.push(linkUrl);
          }
        } catch {
          unreachable.push(linkUrl);
        }
      }),
    );

    const internalCount = internal.length;
    const externalCount = external.length;
    const unreachableCount = unreachable.length;

    let status: "pass" | "warning" = "pass";
    let summary = "";

    if (unreachableCount > 0) {
      status = "warning";
      summary = `Found ${internalCount} internal and ${externalCount} external links. ${unreachableCount} link(s) appear unreachable.`;
    } else if (internalCount === 0 && externalCount === 0) {
      status = "warning";
      summary = "No links found on the page.";
    } else {
      summary = `Found ${internalCount} internal and ${externalCount} external links.`;
    }

    return {
      id: "links",
      label: "Linked Pages",
      category: "website-structure",
      status,
      summary,
      data: {
        internalCount,
        externalCount,
        unreachableCount,
        unreachable: unreachable.slice(0, 5), // Limit to 5 for display
      },
      durationMs: Math.round(performance.now() - start),
    };
  } catch {
    return {
      id: "links",
      label: "Linked Pages",
      category: "website-structure",
      status: "error",
      summary: "Unable to analyze links.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
