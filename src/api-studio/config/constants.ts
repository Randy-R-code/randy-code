/** Centralized operational constants for API Studio's outbound proxy. */

export const USER_AGENT =
  "API Studio/1.0 (+https://randy-code.dev/tools/api-studio)";

/** More generous than InfraLens's 8s / MetaLens's 8s — target APIs can legitimately be slower than a page load, but this still bounds the worst case. */
export const FETCH_TIMEOUT_MS = 15_000;

export const MAX_REQUEST_BODY_BYTES = 1 * 1024 * 1024; // 1 MB
/** Larger than InfraLens's 2 MB / MetaLens's 1.5 MB — API responses (JSON payloads) are routinely bigger than a page's <head>. */
export const MAX_RESPONSE_BYTES = 5 * 1024 * 1024; // 5 MB

export const MAX_HEADER_COUNT = 50;
export const MAX_HEADER_VALUE_LENGTH = 8000;

/** Concurrent in-flight requests allowed per client identifier — a client can otherwise stay under the request-rate policy while still firing many requests at once (audit §10). */
export const MAX_CONCURRENT_REQUESTS_PER_CLIENT = 4;
/** Redis TTL safety net for a concurrency slot that never gets released (e.g. the function crashes mid-request) — comfortably above FETCH_TIMEOUT_MS. */
export const CONCURRENCY_TTL_SECONDS = 30;

export const ALLOWED_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
] as const;

/** Hop-by-hop / connection-management headers a client must never set directly — the proxy (or the underlying pinned-DNS fetch) owns these. */
export const FORBIDDEN_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "transfer-encoding",
  "keep-alive",
  "upgrade",
  "te",
  "trailer",
  "proxy-authenticate",
  "proxy-authorization",
]);

/** Response headers stripped before returning to the client — hop-by-hop, or recomputed from the bytes actually read rather than trusted from upstream. */
export const STRIPPED_RESPONSE_HEADERS = new Set([
  "content-length",
  "transfer-encoding",
  "connection",
  "keep-alive",
]);

/** Local (IndexedDB) history cap — oldest entries are dropped past this. */
export const HISTORY_MAX_ENTRIES = 100;

/** Stable, public, deterministic request used by "Load example" — demonstrates params and headers without sending anything. */
export const EXAMPLE_REQUEST = {
  method: "GET" as const,
  url: "https://jsonplaceholder.typicode.com/posts?userId=1",
  headers: { Accept: "application/json" },
};

/** Fixed lifetime of a webhook endpoint from creation — not sliding on activity. */
export const WEBHOOK_TTL_SECONDS = 24 * 60 * 60;
/** Oldest events are evicted past this count (spec's "friendlier than rejecting" behavior for a debugging tool). */
export const WEBHOOK_MAX_EVENTS = 50;
export const WEBHOOK_MAX_BODY_BYTES = 256 * 1024; // 256 KB — webhook payloads are typically small JSON
export const WEBHOOK_MAX_HEADER_COUNT = 50;
/** Client polling interval while a Webhooks endpoint is "listening" — see the plan's SSE-vs-polling decision. */
export const WEBHOOK_POLL_INTERVAL_MS = 2500;
