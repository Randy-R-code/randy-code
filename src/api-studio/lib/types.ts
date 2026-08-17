export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export type RequestConfig = {
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body?: string;
};

export type BodyMode = "none" | "json" | "text" | "url-encoded";

export type ErrorKind =
  | "rate_limited"
  | "blocked_destination"
  | "invalid_config"
  | "timeout"
  | "dns_or_connection"
  | "oversized"
  | "internal";

/**
 * A target API returning 4xx/5xx is a valid HTTP response, not an API
 * Studio failure — it's always reported as `ok: true` with that status. The
 * `ok: false` branch is reserved for cases where no response was ever
 * obtained (blocked destination, timeout, oversized, ...).
 */
export type ExecuteRequestResult =
  | {
      ok: true;
      status: number;
      statusText: string;
      headers: Record<string, string>;
      bodyText: string;
      isBinary: boolean;
      durationMs: number;
      sizeBytes: number;
      finalUrl: string;
    }
  | { ok: false; kind: ErrorKind; message: string };
