import { ChecksResponse } from "./types";

export function buildErrorResult(
  message: string,
  inputUrl: string,
): ChecksResponse {
  const normalizedUrl = inputUrl.startsWith("http")
    ? inputUrl
    : `https://${inputUrl}`;

  let hostname = "unknown";
  try {
    hostname = new URL(normalizedUrl).hostname;
  } catch {
    // keep "unknown"
  }

  return {
    url: normalizedUrl,
    hostname,
    checks: [
      {
        id: "error",
        label: "Analysis Error",
        category: "http-security",
        status: "error",
        summary: message,
        durationMs: 0,
      },
    ],
    totalDurationMs: 0,
    analyzedAt: new Date().toISOString(),
    score: {
      score: 0,
      grade: "E",
      categories: [],
      scoredCount: 0,
      excludedCount: 1,
      strongestCategory: null,
      topPriorityCategory: null,
    },
  };
}

// Used for errors that were actually thrown and caught client-side (a
// malformed URL failing `new URL()` before the Server Action is even
// called, or a genuinely unexpected server failure) — as opposed to the
// Server Action's own expected rejections, which now return a message
// directly instead of throwing (see RunChecksResult in run-checks.ts).
export function parseAnalysisError(
  error: unknown,
  inputUrl: string,
): ChecksResponse {
  let message =
    "Failed to analyze the URL. Please check the URL and try again.";

  if (error instanceof Error) {
    if (error.message.includes("Rate limit exceeded")) {
      message = error.message;
    } else if (
      error.message.includes("Invalid URL") ||
      error.name === "TypeError"
    ) {
      message =
        "Invalid URL format. Please enter a valid URL (e.g., https://example.com)";
    } else if (
      error.message.includes("timeout") ||
      error.message.includes("fetch")
    ) {
      message =
        "Request timed out or network error. Please check your connection and try again.";
    } else if (error.message) {
      message = error.message;
    }
  }

  return buildErrorResult(message, inputUrl);
}
