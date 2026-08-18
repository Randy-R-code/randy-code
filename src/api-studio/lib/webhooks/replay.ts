import { FORBIDDEN_REQUEST_HEADERS } from "@/api-studio/config/constants";
import type { HttpMethod, RequestConfig } from "@/api-studio/lib/types";
import type { WebhookEvent } from "./types";

/**
 * Strips hop-by-hop headers the outbound proxy would otherwise reject
 * outright (`FORBIDDEN_REQUEST_HEADERS` — host, connection, content-length,
 * ...) that a webhook sender's own HTTP client set on the *inbound* request.
 * Without this, a prefilled Replay form would fail validation the moment
 * the user hits Send, for a reason that isn't obvious from the UI.
 */
export function eventToRequestConfig(event: WebhookEvent): RequestConfig {
  const headers: Record<string, string> = {};
  for (const [name, value] of Object.entries(event.headers)) {
    if (!FORBIDDEN_REQUEST_HEADERS.has(name.toLowerCase())) {
      headers[name] = value;
    }
  }

  return {
    // The ingestion route only ever registers GET/POST/PUT/PATCH/DELETE
    // handlers, all valid HttpMethod values — safe to assert.
    method: event.method as HttpMethod,
    url: "",
    headers,
    body: event.isBinary ? undefined : event.bodyText,
  };
}
