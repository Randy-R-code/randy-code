/** Centralized operational constants (master plan §21.4) — timeouts, limits, and external endpoints used across the analysis engine. */

export const CHECK_TIMEOUT_MS = 8000;

export const DNS_TIMEOUT_MS = 1500;
export const DNS_CACHE_TTL_MS = 60_000;

export const RATE_LIMIT_WINDOW_MS = 30_000;
export const RATE_LIMIT_MAX_REQUESTS = 1;

export const MAX_REDIRECTS = 10;

/** Redirect hops `safeFetch` will follow while revalidating each destination (master plan §8.5) — deliberately lower than MAX_REDIRECTS, which `redirects.ts` uses only to report a chain, not to decide what's safe to connect to. */
export const MAX_SAFE_REDIRECTS = 5;

/** Allowed port per protocol (master plan §7.5) — no other explicit port is accepted, so InfraLens can never be used as a port-scanning proxy. */
export const ALLOWED_PORT_BY_PROTOCOL: Record<string, number> = {
  "http:": 80,
  "https:": 443,
};

/** Maximum response body size read by any check (master plan §8.6/§8.7). */
export const MAX_RESPONSE_BYTES = 2 * 1024 * 1024; // 2 MB

/** Ceiling for the supplementary raw TLS handshake (master plan §11.3) — a TCP+TLS handshake is normally sub-second, this just bounds the worst case so a slow/unreachable host can't stall the whole analysis. */
export const TLS_INSPECTION_TIMEOUT_MS = 5000;

export const USER_AGENT =
  "InfraLens/1.0 (+https://randy-code.dev/tools/infralens)";
export const IPAPI_BASE_URL = "https://ipapi.co";

/** IP/ASN/hosting info changes far less often than DNS records, so this outlives `DNS_CACHE_TTL_MS` (master plan §32 Phase 7: "mettre en cache raisonnablement") — also reduces load on ipapi.co's free-tier rate limit. */
export const IP_INFO_CACHE_TTL_MS = 15 * 60_000;

/** Bump whenever an export-breaking change lands (master plan §10.4) — 2.0.0 marks Phase 4's status vocabulary change (ok/error -> pass/warning/fail/info/unavailable/error) and the new evidence/scored/scoreContribution fields. */
export const EXPORT_SCHEMA_VERSION = "2.0.0";

/** Ceiling for a whole analysis (master plan §9.5) — each check's own timeout shrinks to fit whatever budget remains under this as the analysis progresses, so a slow check can't let the total run away unbounded. */
export const ANALYSIS_TIMEOUT_MS = 20_000;

/** Concurrency pool size for the 18 checks (master plan §9.4) — avoids firing every check's network activity at once. */
export const MAX_CONCURRENT_CHECKS = 6;
