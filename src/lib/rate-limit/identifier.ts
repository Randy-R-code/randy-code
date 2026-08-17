import { logWarn } from "@infralens-lib/log";

/**
 * This deployment runs directly on Vercel with no Cloudflare (or other
 * proxy) in front of it — nothing in the request path sanitizes
 * `cf-connecting-ip`, so trusting it here would let a client set its own
 * rate-limit identity via a plain request header. Only `x-forwarded-for`
 * (Vercel's edge sets/overwrites this) and `x-real-ip` are trusted. Revisit
 * this order if a CDN/proxy is ever placed in front of the app.
 */
export function getClientIdentifier(headersList: Headers): string {
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  const identifier = forwardedFor?.split(",")[0]?.trim() || realIp?.trim();

  if (identifier) {
    return identifier;
  }

  // Should only happen outside Vercel (local dev, non-Vercel hosting) —
  // logged so a real occurrence in production doesn't go unnoticed. Every
  // unidentified client shares this one bucket by design rather than being
  // given an unlimited or a uniquely strict quota.
  logWarn({ event: "rate_limit_identifier_unknown" });
  return "unknown";
}
