import { logError, logWarn } from "@infralens-lib/log";
import { getRedis } from "./client";
import type { ConcurrencyResult } from "./types";

let warnedNotConfigured = false;

/**
 * Best-effort distributed semaphore for capping simultaneous in-flight
 * requests per identifier — a separate concern from the request-rate
 * policies in `policies.ts` (a client can stay under its rate limit while
 * still firing many requests at once). Generic rather than named like the
 * rate-limit policies: today only API Studio's outbound proxy needs this
 * layer, so its numbers live at that call site instead of being hardcoded
 * here.
 *
 * INCR + EXPIRE + (on over-limit) DECR isn't atomic across those calls, so
 * a very tight race could transiently let one extra request through. Fine
 * here — this is a coarse cost-control layer, not a correctness-critical
 * lock. `ttlSeconds` is a safety net that reclaims the slot on its own if
 * `release()` is never called (e.g. the function crashes mid-request).
 */
export async function acquireConcurrencySlot(options: {
  resource: string;
  identifier: string;
  maxConcurrent: number;
  ttlSeconds: number;
}): Promise<{ result: ConcurrencyResult; release: () => Promise<void> }> {
  const { resource, identifier, maxConcurrent, ttlSeconds } = options;
  const noop = async () => {};

  const redis = getRedis();
  if (!redis) {
    if (!warnedNotConfigured) {
      warnedNotConfigured = true;
      logWarn({ event: "rate_limit_not_configured" });
    }
    return { result: { allowed: true, limit: maxConcurrent }, release: noop };
  }

  const redisKey = `concur:${resource}:${identifier}`;

  try {
    const count = await redis.incr(redisKey);
    if (count === 1) {
      await redis.expire(redisKey, ttlSeconds);
    }

    if (count > maxConcurrent) {
      await redis.decr(redisKey);
      return {
        result: { allowed: false, limit: maxConcurrent },
        release: noop,
      };
    }

    return {
      result: { allowed: true, limit: maxConcurrent },
      release: async () => {
        try {
          await redis.decr(redisKey);
        } catch (error) {
          logError({
            event: "rate_limit_backend_error",
            resource,
            message: error instanceof Error ? error.message : "unknown error",
          });
        }
      },
    };
  } catch (error) {
    logError({
      event: "rate_limit_backend_error",
      resource,
      message: error instanceof Error ? error.message : "unknown error",
    });
    return { result: { allowed: false, limit: maxConcurrent }, release: noop };
  }
}
