import { MAX_REDIRECTS } from "@infralens-config/constants";
import { resolveA, resolveAAAA } from "@infralens-lib/dns/dns-client";
import { readBodyText, safeFetch } from "@infralens-lib/security/safe-fetch";
import type { Response as UndiciResponse } from "undici";

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

/** One hop of the redirect chain — the URL requested and the status it returned, whether that was a redirect or the final response. */
export type RedirectHop = {
  url: string;
  status: number;
};

export type PageSnapshot = {
  finalUrl: string;
  redirectChain: RedirectHop[];
  redirectCount: number;
  hasRedirectLoop: boolean;
  status: number;
  headers: UndiciResponse["headers"];
  html: string;
  responseTimeMs: number;
  contentLength: number;
  compression: "gzip" | "br" | "none";
};

export type CollectedContext = {
  page: PageSnapshot | null;
  dns: {
    a: string[];
    aaaa: string[];
    /** Wall-clock time for the A/AAAA lookups (they run concurrently, so this is their max, not sum). Near-zero on a cache hit — not a fresh-lookup measurement in that case. */
    durationMs: number;
  };
};

/**
 * The single place the target's main page gets fetched — avoids the
 * metadata check, the social-tags check, etc. each independently
 * downloading the same page. Follows redirects manually — the
 * same walk `redirects.ts` used to do on its own — so the chain and the
 * final page's headers/body come out of exactly one sequence of requests,
 * shared by every check that used to fetch this same URL independently.
 *
 * Every hop still goes through `safeFetch`, so it's re-validated (SSRF
 * protections) exactly as before — this only removes
 * *duplicate* fetches of the same content, never a validation step.
 */
async function collectPage(
  url: string,
  timeout: number,
): Promise<PageSnapshot | null> {
  const start = performance.now();
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const redirectChain: RedirectHop[] = [];
    const visited = new Set<string>();
    let currentUrl = url;
    let redirectCount = 0;
    let hasRedirectLoop = false;
    let response: UndiciResponse;

    for (;;) {
      response = await safeFetch(currentUrl, {
        method: "GET",
        signal: controller.signal,
        redirect: "manual",
      });

      redirectChain.push({ url: currentUrl, status: response.status });
      visited.add(currentUrl);

      if (
        !REDIRECT_STATUSES.has(response.status) ||
        redirectCount >= MAX_REDIRECTS
      ) {
        break;
      }

      const location = response.headers.get("location");
      if (!location) break;

      const nextUrl = new URL(location, currentUrl).toString();
      if (visited.has(nextUrl)) {
        hasRedirectLoop = true;
        break;
      }

      currentUrl = nextUrl;
      redirectCount++;
    }

    const html = REDIRECT_STATUSES.has(response.status)
      ? "" // stopped on a redirect (loop or MAX_REDIRECTS) — nothing final to read
      : await readBodyText(response);

    const responseTimeMs = Math.round(performance.now() - start);
    const contentEncoding = response.headers.get("content-encoding");
    const compression: PageSnapshot["compression"] = contentEncoding?.includes(
      "br",
    )
      ? "br"
      : contentEncoding?.includes("gzip")
        ? "gzip"
        : "none";
    const contentLengthHeader = response.headers.get("content-length");
    const contentLength = contentLengthHeader
      ? parseInt(contentLengthHeader, 10)
      : html.length;

    return {
      finalUrl: currentUrl,
      redirectChain,
      redirectCount,
      hasRedirectLoop,
      status: response.status,
      headers: response.headers,
      html,
      responseTimeMs,
      contentLength,
      compression,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(id);
  }
}

export async function collectSharedContext(
  hostname: string,
  url: string,
  timeout: number,
): Promise<CollectedContext> {
  const [page, a, aaaa] = await Promise.all([
    collectPage(url, timeout),
    resolveA(hostname),
    resolveAAAA(hostname),
  ]);

  return {
    page,
    dns: {
      a: a.data ?? [],
      aaaa: aaaa.data ?? [],
      durationMs: Math.max(a.durationMs, aaaa.durationMs),
    },
  };
}
