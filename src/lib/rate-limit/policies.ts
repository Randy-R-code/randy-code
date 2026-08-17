import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { getRedis } from "./client";

export type PolicyName =
  | "contact"
  | "infralens"
  | "metalens"
  | "apiStudioRequest";

type ScopeDefinition = { scope: string; limit: number; window: Duration };

/** Starting values from the rate-limiting audit's §19 policy registry. */
const POLICY_DEFINITIONS: Record<PolicyName, readonly ScopeDefinition[]> = {
  contact: [
    { scope: "short", limit: 3, window: "15 m" },
    { scope: "daily", limit: 10, window: "24 h" },
  ],
  infralens: [
    { scope: "burst", limit: 5, window: "1 m" },
    { scope: "hourly", limit: 30, window: "1 h" },
  ],
  metalens: [
    { scope: "burst", limit: 10, window: "1 m" },
    { scope: "hourly", limit: 60, window: "1 h" },
  ],
  apiStudioRequest: [
    { scope: "burst", limit: 20, window: "1 m" },
    { scope: "hourly", limit: 200, window: "1 h" },
  ],
};

const limiterCache = new Map<string, Ratelimit>();

/**
 * One `Ratelimit` instance per policy scope, sharing the single Redis
 * client, each in its own key namespace (`rl:<policy>:<scope>`) — namespace
 * separation is what keeps InfraLens's and MetaLens's quotas independent
 * even though they share the same underlying store. Instances are cached
 * across calls (recommended by `@upstash/ratelimit` for its optional
 * ephemeral cache to be useful) but built lazily so a missing Redis client
 * never throws here — `getPolicyLimiters` returns `null` instead, and the
 * caller (`checkRateLimit`) decides what "not configured" means.
 *
 * No `timeout` option is set on any instance — that option makes the
 * ratelimiter fail *open* on a Redis network problem, which is the opposite
 * of what these surfaces want (see the audit's §21 fail-closed guidance).
 * A Redis error is left to reject `.limit()` and is handled explicitly by
 * the caller instead.
 */
export function getPolicyLimiters(policy: PolicyName): Ratelimit[] | null {
  const redis = getRedis();
  if (!redis) {
    return null;
  }

  return POLICY_DEFINITIONS[policy].map((definition) => {
    const cacheKey = `${policy}:${definition.scope}`;
    const cached = limiterCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(definition.limit, definition.window),
      prefix: `rl:${policy}:${definition.scope}`,
    });
    limiterCache.set(cacheKey, limiter);
    return limiter;
  });
}
