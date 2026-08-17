import { logError, logWarn } from "@infralens-lib/log";
import type { Ratelimit } from "@upstash/ratelimit";
import { getPolicyLimiters, type PolicyName } from "./policies";
import type { RateLimitResult } from "./types";

export type { PolicyName } from "./policies";
export type { RateLimitResult } from "./types";

let warnedNotConfigured = false;

/**
 * Allow-all fallback for the "Upstash isn't configured" state — this is the
 * normal state for local dev and for CI/e2e (which must never touch
 * production Redis, per the audit's testing guidance). Warns once per cold
 * start rather than once per request so a real production misconfiguration
 * is still observable without flooding the logs.
 */
function notConfiguredResult(): RateLimitResult {
  if (!warnedNotConfigured) {
    warnedNotConfigured = true;
    logWarn({ event: "rate_limit_not_configured" });
  }
  return { allowed: true, limit: 0, remaining: 0, resetAt: 0 };
}

/** A short, fixed retry hint — there's no real `reset` timestamp to report when the backend call itself failed. */
function backendErrorResult(): RateLimitResult {
  return {
    allowed: false,
    limit: 0,
    remaining: 0,
    resetAt: Date.now() + 30_000,
    reason: "backend_error",
  };
}

/**
 * Runs every scope configured for `policy` (e.g. burst + hourly) against
 * `identifier` and combines them: blocked if any scope is exceeded,
 * otherwise allowed with the tightest (smallest-remaining) scope reported
 * back. Every scope is always evaluated — none are skipped once one fails —
 * so a sustained abuser still burns through their longer-window quota
 * instead of that counter going stale.
 */
export async function checkRateLimit(
  policy: PolicyName,
  identifier: string,
): Promise<RateLimitResult> {
  const limiters = getPolicyLimiters(policy);
  if (!limiters) {
    return notConfiguredResult();
  }

  let results: Awaited<ReturnType<Ratelimit["limit"]>>[];
  try {
    results = await Promise.all(
      limiters.map((limiter) => limiter.limit(identifier)),
    );
  } catch (error) {
    logError({
      event: "rate_limit_backend_error",
      policy,
      message: error instanceof Error ? error.message : "unknown error",
    });
    return backendErrorResult();
  }

  const blocked = results.find((result) => !result.success);
  if (blocked) {
    return {
      allowed: false,
      limit: blocked.limit,
      remaining: blocked.remaining,
      resetAt: blocked.reset,
      reason: "exceeded",
    };
  }

  const tightest = results.reduce((a, b) =>
    a.remaining <= b.remaining ? a : b,
  );
  return {
    allowed: true,
    limit: tightest.limit,
    remaining: tightest.remaining,
    resetAt: tightest.reset,
  };
}
