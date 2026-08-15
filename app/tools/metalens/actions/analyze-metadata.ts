"use server";

import { buildAnalysis } from "@/metalens/lib/build-analysis";
import {
  ACCEPTED_HTML_CONTENT_TYPES,
  FETCH_TIMEOUT_MS,
  MAX_REDIRECTS,
  MAX_RESPONSE_BYTES,
  RATE_LIMIT_IDENTIFIER_PREFIX,
  USER_AGENT,
} from "@/metalens/lib/constants";
import { parseHtmlMetadata } from "@/metalens/lib/parse-html";
import type { MetadataAnalysis } from "@/metalens/lib/types";
import { logInfo, logWarn } from "@infralens-lib/log";
import { checkRateLimit } from "@infralens-lib/rate-limit";
import { isSecurityError } from "@infralens-lib/security/errors";
import { resolveValidatedTarget } from "@infralens-lib/security/resolve-target";
import { readBodyText, safeFetch } from "@infralens-lib/security/safe-fetch";
import { normalizeTarget } from "@infralens-lib/security/target";
import { headers } from "next/headers";

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

// Returned instead of thrown for every expected rejection, matching
// InfraLens's own action (app/tools/infralens/actions/run-checks.ts) —
// Next redacts thrown Server Action error messages in production, so a
// safe, useful message needs to travel back as ordinary data.
export type AnalyzeMetadataResult =
  | { ok: true; data: MetadataAnalysis }
  | { ok: false; message: string };

// Small, duplicated on purpose rather than imported from InfraLens's action
// file — each tool owns its own tiny request-identity helper instead of a
// shared cross-tool utility for something this small.
async function getClientIdentifier(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const cfConnectingIp = headersList.get("cf-connecting-ip");

  return (
    forwardedFor?.split(",")[0]?.trim() || realIp || cfConnectingIp || "unknown"
  );
}

export async function analyzeMetadata(
  inputUrl: string,
): Promise<AnalyzeMetadataResult> {
  const identifier = await getClientIdentifier();
  // Prefixed so MetaLens's quota never shares a bucket with InfraLens's own
  // rate limiter, even though both call the same underlying store.
  const rateLimit = checkRateLimit(
    `${RATE_LIMIT_IDENTIFIER_PREFIX}:${identifier}`,
  );

  if (!rateLimit.allowed) {
    logWarn({ event: "metalens_rate_limit_exceeded" });
    const secondsLeft = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    return {
      ok: false,
      message: `Rate limit exceeded. Please wait ${secondsLeft} second${
        secondsLeft === 1 ? "" : "s"
      } before trying again.`,
    };
  }

  let validatedUrl: string;
  try {
    const target = normalizeTarget(inputUrl);
    const validated = await resolveValidatedTarget(target);
    validatedUrl = validated.url;
  } catch (error) {
    if (isSecurityError(error)) {
      logWarn({ event: "metalens_target_rejected", reason: error.name });
      return { ok: false, message: error.userMessage };
    }
    if (error instanceof TypeError) {
      return {
        ok: false,
        message: "Enter a valid public HTTP or HTTPS URL.",
      };
    }
    throw error;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const visited = new Set<string>();
    let currentUrl = validatedUrl;
    let redirectCount = 0;
    let response: Awaited<ReturnType<typeof safeFetch>>;

    for (;;) {
      response = await safeFetch(currentUrl, {
        method: "GET",
        redirect: "manual",
        headers: { "User-Agent": USER_AGENT },
        signal: controller.signal,
      });
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
        return { ok: false, message: "This page redirects in a loop." };
      }

      currentUrl = nextUrl;
      redirectCount++;
    }

    if (REDIRECT_STATUSES.has(response.status)) {
      return {
        ok: false,
        message: "Too many redirects were followed for this target.",
      };
    }

    if (response.status < 200 || response.status >= 300) {
      return {
        ok: false,
        message: `The page responded with status ${response.status}.`,
      };
    }

    const contentType = response.headers.get("content-type") ?? "";
    const isHtml = ACCEPTED_HTML_CONTENT_TYPES.some((type) =>
      contentType.includes(type),
    );
    if (!isHtml) {
      return { ok: false, message: "The URL did not return an HTML document." };
    }

    const html = await readBodyText(response, MAX_RESPONSE_BYTES);
    const raw = parseHtmlMetadata(html);
    const data = buildAnalysis({
      requestedUrl: inputUrl,
      finalUrl: currentUrl,
      redirectCount,
      raw,
    });

    logInfo({ event: "metalens_analysis_succeeded" });
    return { ok: true, data };
  } catch (error) {
    if (isSecurityError(error)) {
      logWarn({ event: "metalens_target_rejected", reason: error.name });
      return { ok: false, message: error.userMessage };
    }
    if (error instanceof Error && error.name === "AbortError") {
      return { ok: false, message: "The page took too long to respond." };
    }
    logWarn({ event: "metalens_analysis_failed" });
    return { ok: false, message: "This page could not be reached." };
  } finally {
    clearTimeout(timeoutId);
  }
}
