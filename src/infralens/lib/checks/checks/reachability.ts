import { CheckRunner } from "../types";

export const runReachabilityCheck: CheckRunner<{
  reachable: boolean;
  statusCode: number;
  responseTime: number;
}> = async ({ shared }) => {
  const start = performance.now();

  if (!shared.page) {
    return {
      id: "reachability",
      label: "Reachability Snapshot",
      category: "performance",
      status: "error",
      summary: "Site is not reachable or timed out.",
      durationMs: Math.round(performance.now() - start),
    };
  }

  const { status: statusCode, responseTimeMs: responseTime } = shared.page;
  const reachable = statusCode >= 200 && statusCode < 500;

  let status: "pass" | "warning" | "fail" = "pass";
  let summary = "";

  if (!reachable) {
    // We got a response, just a bad one (5xx) — a real site-health
    // finding, not a failure of this check to run.
    status = "fail";
    summary = `Site is not reachable (HTTP ${statusCode}).`;
  } else if (statusCode >= 400 && statusCode < 500) {
    status = "warning";
    summary = `Site returned client error (HTTP ${statusCode}).`;
  } else if (statusCode >= 500) {
    status = "fail";
    summary = `Site returned server error (HTTP ${statusCode}).`;
  } else {
    summary = `Site is reachable (HTTP ${statusCode}, ${responseTime}ms).`;
  }

  return {
    id: "reachability",
    label: "Reachability Snapshot",
    category: "performance",
    status,
    summary,
    data: {
      reachable,
      statusCode,
      responseTime,
    },
    limitations: [
      "This is a single point-in-time reachability check, not historical uptime monitoring — one successful (or failed) request doesn't say anything about the site's availability before or after this moment.",
    ],
    durationMs: Math.round(performance.now() - start),
  };
};
