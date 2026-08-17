import { Redis } from "@upstash/redis";

/**
 * Deliberately reads the two env vars explicitly instead of `Redis.fromEnv()`
 * — that helper falls back to `console.warn` and still constructs a client
 * pointed at `undefined`/`undefined`, which would only surface as a request-time
 * fetch failure. Checking here up front gives every caller a clean, explicit
 * "not configured" signal instead of conflating it with a real backend error.
 * A pure function of `raw`, matching `infralens/config/env.ts`'s `parseEnv`
 * pattern, so this is testable without stubbing `process.env`.
 */
export function parseCredentials(
  raw: Record<string, string | undefined>,
): { url: string; token: string } | null {
  const url = raw.UPSTASH_REDIS_REST_URL;
  const token = raw.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return { url, token };
}

let cached: Redis | null | undefined;

/** Lazy singleton — constructed once per server instance, on first use. */
export function getRedis(): Redis | null {
  if (cached !== undefined) {
    return cached;
  }

  const credentials = parseCredentials(process.env);
  cached = credentials ? new Redis(credentials) : null;
  return cached;
}

export function isRateLimitConfigured(): boolean {
  return parseCredentials(process.env) !== null;
}
