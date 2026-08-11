import {
  compressionRecommendation,
  performanceRecommendation,
} from "@infralens-lib/recommendations/performance";
import { CheckRunner } from "../types";

export const runPerformanceCheck: CheckRunner<{
  responseTime: number;
  dnsLookupMs: number;
  responseSize: number;
  compression?: "gzip" | "br" | "none";
  cacheControl?: string;
  statusCode: number;
}> = async ({ shared }) => {
  const start = performance.now();

  if (!shared.page) {
    return {
      id: "performance",
      label: "Performance Signals",
      category: "performance",
      status: "error",
      summary: "Unable to measure performance metrics.",
      durationMs: Math.round(performance.now() - start),
    };
  }

  const {
    responseTimeMs: responseTime,
    contentLength: responseSize,
    compression,
    status: statusCode,
    headers,
  } = shared.page;
  const dnsLookupMs = shared.dns.durationMs;
  const cacheControl = headers.get("cache-control") || undefined;

  let status: "pass" | "warning" | "fail" = "pass";
  let summary = "";
  const recommendations = [];

  if (responseTime > 2000) {
    // A genuinely slow response is a real finding, not a check failure.
    status = "fail";
    summary = `Slow response time: ${responseTime}ms.`;
    recommendations.push(performanceRecommendation(responseTime));
  } else if (responseTime > 1000) {
    status = "warning";
    summary = `Response time is high: ${responseTime}ms.`;
    recommendations.push(performanceRecommendation(responseTime));
  } else {
    summary = `Response time: ${responseTime}ms.`;
  }

  if (compression === "none" && responseSize > 10000) {
    if (status === "pass") status = "warning";
    summary += " Compression not enabled.";
    recommendations.push(compressionRecommendation());
  } else if (compression !== "none") {
    summary += ` Compression: ${compression}.`;
  }

  if (!cacheControl) {
    summary += " No Cache-Control header.";
  } else {
    summary += ` Cache-Control: ${cacheControl}.`;
  }

  return {
    id: "performance",
    label: "Performance Signals",
    category: "performance",
    status,
    summary,
    recommendation: recommendations[0],
    data: {
      responseTime,
      dnsLookupMs,
      responseSize,
      compression,
      cacheControl,
      statusCode,
    },
    limitations: [
      "These are performance signals from a single server-side request, not a browser-based audit — InfraLens doesn't replace Lighthouse, WebPageTest, or field Core Web Vitals, and can't measure rendering, script execution, or real-user experience.",
      "Response time is measured end-to-end (DNS + connect + TTFB + download combined); connection setup and time-to-first-byte aren't separately observable through fetch(), so they aren't reported individually rather than being guessed.",
      "dnsLookupMs reflects this analysis's own lookup, which may hit a warm in-memory cache (near-zero) rather than a fresh resolution.",
    ],
    durationMs: Math.round(performance.now() - start),
  };
};
