import {
  ALLOWED_METHODS,
  FETCH_TIMEOUT_MS,
  FORBIDDEN_REQUEST_HEADERS,
  MAX_HEADER_COUNT,
  MAX_HEADER_VALUE_LENGTH,
  MAX_REQUEST_BODY_BYTES,
  MAX_RESPONSE_BYTES,
  STRIPPED_RESPONSE_HEADERS,
  USER_AGENT,
} from "@/api-studio/config/constants";
import { logWarn } from "@infralens-lib/log";
import {
  BlockedTargetError,
  DnsResolutionError,
  RedirectLimitError,
  ResponseTooLargeError,
  isSecurityError,
} from "@infralens-lib/security/errors";
import { safeFetch } from "@infralens-lib/security/safe-fetch";
import { normalizeTarget } from "@infralens-lib/security/target";
import type { Response as UndiciResponse } from "undici";
import type {
  ErrorKind,
  ExecuteRequestResult,
  HttpMethod,
  RequestConfig,
} from "./types";

const TEXT_LIKE_CONTENT_TYPE =
  /^(text\/|application\/(json|xml|javascript|x-www-form-urlencoded)|[^;]+\+(json|xml))/i;

/**
 * Parses and validates an untrusted JSON body into a `RequestConfig` — the
 * TypeScript type alone guarantees nothing at runtime once data has crossed
 * the wire from the browser. Returns `{ error }` instead of throwing so the
 * route handler can turn it into a safe 400 without a try/catch.
 */
export function parseRequestConfig(
  raw: unknown,
): RequestConfig | { error: string } {
  if (typeof raw !== "object" || raw === null) {
    return { error: "Request body must be a JSON object." };
  }

  const { method, url, headers, body } = raw as Record<string, unknown>;

  if (
    typeof method !== "string" ||
    !(ALLOWED_METHODS as readonly string[]).includes(method)
  ) {
    return { error: "Invalid or unsupported HTTP method." };
  }

  if (typeof url !== "string" || url.trim() === "") {
    return { error: "A URL is required." };
  }

  if (
    headers !== undefined &&
    (typeof headers !== "object" || headers === null || Array.isArray(headers))
  ) {
    return { error: "Headers must be a flat object of string values." };
  }

  const parsedHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(
    (headers as Record<string, unknown> | undefined) ?? {},
  )) {
    if (typeof value !== "string") {
      return { error: `Header "${key}" must be a string.` };
    }
    parsedHeaders[key] = value;
  }

  if (body !== undefined && typeof body !== "string") {
    return { error: "Body must be a string." };
  }

  return { method: method as HttpMethod, url, headers: parsedHeaders, body };
}

function validateConfig(
  config: RequestConfig,
): { kind: "invalid_config"; message: string } | null {
  const headerEntries = Object.entries(config.headers);

  if (headerEntries.length > MAX_HEADER_COUNT) {
    return {
      kind: "invalid_config",
      message: `Too many headers (max ${MAX_HEADER_COUNT}).`,
    };
  }

  for (const [name, value] of headerEntries) {
    if (FORBIDDEN_REQUEST_HEADERS.has(name.toLowerCase())) {
      return {
        kind: "invalid_config",
        message: `Header "${name}" cannot be set manually.`,
      };
    }
    if (value.length > MAX_HEADER_VALUE_LENGTH) {
      return {
        kind: "invalid_config",
        message: `Header "${name}" is too long.`,
      };
    }
  }

  if (
    config.body &&
    Buffer.byteLength(config.body, "utf-8") > MAX_REQUEST_BODY_BYTES
  ) {
    return { kind: "invalid_config", message: "Request body is too large." };
  }

  return null;
}

function mapSecurityErrorKind(error: Error): ErrorKind {
  if (
    error instanceof BlockedTargetError ||
    error instanceof RedirectLimitError
  ) {
    return "blocked_destination";
  }
  if (error instanceof DnsResolutionError) {
    return "dns_or_connection";
  }
  if (error instanceof ResponseTooLargeError) {
    return "oversized";
  }
  return "invalid_config"; // InvalidTargetError and any future addition
}

/**
 * Byte-capped body read, like InfraLens's `readBodyText` — but content-type
 * aware: text-ish payloads decode as UTF-8, anything else comes back as
 * base64 with `isBinary: true` so the UI can show a placeholder instead of
 * garbled bytes. Kept as its own copy rather than extending InfraLens's
 * version in place — that one is always-UTF-8 by contract and shared by
 * every one of its checks.
 */
async function readCappedBody(
  response: UndiciResponse | Response,
  maxBytes: number,
): Promise<{ bodyText: string; isBinary: boolean; sizeBytes: number }> {
  if (!response.body) {
    return { bodyText: "", isBinary: false, sizeBytes: 0 };
  }

  const isBinary = !TEXT_LIKE_CONTENT_TYPE.test(
    response.headers.get("content-type") ?? "",
  );

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      total += value.byteLength;
      if (total > maxBytes) {
        throw new ResponseTooLargeError(
          `Response body exceeded ${maxBytes} bytes.`,
        );
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const buffer = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
  return {
    bodyText: isBinary ? buffer.toString("base64") : buffer.toString("utf-8"),
    isBinary,
    sizeBytes: buffer.byteLength,
  };
}

/**
 * The only function that sends a user-configured outbound request. Reuses
 * InfraLens's target validation and pinned-DNS `safeFetch` untouched — no
 * parallel SSRF implementation. `signal` is the caller's own cancellation
 * signal (the route handler's `Request.signal`); combined here with this
 * function's own timeout so either one aborts the same underlying fetch.
 */
export async function executeRequest(
  config: RequestConfig,
  signal: AbortSignal,
): Promise<ExecuteRequestResult> {
  const validationError = validateConfig(config);
  if (validationError) {
    return {
      ok: false,
      kind: validationError.kind,
      message: validationError.message,
    };
  }

  let target: ReturnType<typeof normalizeTarget>;
  try {
    target = normalizeTarget(config.url);
  } catch (error) {
    if (isSecurityError(error)) {
      return {
        ok: false,
        kind: mapSecurityErrorKind(error),
        message: error.userMessage,
      };
    }
    return {
      ok: false,
      kind: "invalid_config",
      message: "Enter a valid public HTTP or HTTPS URL.",
    };
  }

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(
    () => timeoutController.abort(),
    FETCH_TIMEOUT_MS,
  );
  const onCallerAbort = () => timeoutController.abort();
  signal.addEventListener("abort", onCallerAbort);

  const startedAt = Date.now();

  try {
    const response = await safeFetch(target.url, {
      method: config.method,
      headers: { "User-Agent": USER_AGENT, ...config.headers },
      body: config.body,
      redirect: "follow",
      signal: timeoutController.signal,
    });

    const { bodyText, isBinary, sizeBytes } = await readCappedBody(
      response,
      MAX_RESPONSE_BYTES,
    );
    const durationMs = Date.now() - startedAt;

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      if (!STRIPPED_RESPONSE_HEADERS.has(key.toLowerCase())) {
        headers[key] = value;
      }
    });
    headers["content-length"] = String(sizeBytes);

    return {
      ok: true,
      status: response.status,
      statusText: response.statusText,
      headers,
      bodyText,
      isBinary,
      durationMs,
      sizeBytes,
      finalUrl: response.url || target.url,
    };
  } catch (error) {
    if (isSecurityError(error)) {
      logWarn({ event: "api_studio_target_rejected", reason: error.name });
      return {
        ok: false,
        kind: mapSecurityErrorKind(error),
        message: error.userMessage,
      };
    }
    if (error instanceof Error && error.name === "AbortError") {
      if (signal.aborted) {
        return {
          ok: false,
          kind: "internal",
          message: "The request was cancelled.",
        };
      }
      return {
        ok: false,
        kind: "timeout",
        message: "The request timed out.",
      };
    }
    logWarn({ event: "api_studio_request_failed" });
    return {
      ok: false,
      kind: "dns_or_connection",
      message: "Could not connect to this destination.",
    };
  } finally {
    clearTimeout(timeoutId);
    signal.removeEventListener("abort", onCallerAbort);
  }
}
