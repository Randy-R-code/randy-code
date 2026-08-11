import {
  MAX_RESPONSE_BYTES,
  MAX_SAFE_REDIRECTS,
  USER_AGENT,
} from "@infralens-config/constants";
import {
  Agent,
  fetch as undiciFetch,
  type RequestInit as UndiciRequestInit,
  type Response as UndiciResponse,
} from "undici";
import { RedirectLimitError, ResponseTooLargeError } from "./errors";
import { resolveValidatedTarget, ValidatedTarget } from "./resolve-target";
import { normalizeTarget } from "./target";

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

/**
 * Builds a per-request undici dispatcher whose DNS `lookup` is hardcoded to
 * the already-validated IP — the actual TCP/TLS connection goes there no
 * matter what a fresh DNS lookup would return at connect time. The `Host`
 * header and TLS SNI are untouched (they come from the request URL, not
 * from this dispatcher), so the destination server still sees the original
 * hostname. This is the DNS-rebinding protection (master plan §8.4):
 * resolve once, validate, then pin the connection to that exact address —
 * never let the HTTP client re-resolve DNS itself.
 */
function pinnedDispatcher(ip: string): Agent {
  const family = ip.includes(":") ? 6 : 4;

  return new Agent({
    connect: {
      // Node's connector may call this in "all" mode (happy-eyeballs-style
      // multi-address connect), which expects an array back instead of a
      // single (err, address, family) triple — branch on `options.all`
      // rather than assuming the single-address shape.
      lookup: (_hostname, options, callback) => {
        if (
          options &&
          typeof options === "object" &&
          "all" in options &&
          options.all
        ) {
          callback(null, [{ address: ip, family }]);
        } else {
          callback(null, ip, family);
        }
      },
    },
  });
}

/**
 * Deliberately calls `undici`'s own `fetch` rather than the Node global
 * `fetch` — the global implementation is backed by Node's *internal*,
 * separately-versioned copy of undici, and handing it a `dispatcher` built
 * from the standalone `undici` package throws (`invalid onRequestStart
 * method`, an internal version-identity mismatch between the two copies).
 * Calling `undiciFetch` keeps the dispatcher and the fetch call on the same
 * undici instance throughout.
 */
async function fetchOnce(
  validated: ValidatedTarget,
  init: UndiciRequestInit,
): Promise<UndiciResponse> {
  const dispatcher = pinnedDispatcher(validated.ip);

  try {
    return await undiciFetch(validated.url, {
      ...init,
      redirect: "manual",
      headers: { "User-Agent": USER_AGENT, ...init.headers },
      dispatcher,
    });
  } finally {
    dispatcher.close().catch(() => {});
  }
}

/**
 * The only function that should ever fetch a user-supplied target (master
 * plan §7-8). Mirrors `fetch`'s signature so existing call sites only need
 * to swap the function name. Every hop — including the very first request —
 * is independently normalized, DNS-resolved, and IP-classified immediately
 * before connecting; nothing is cached or reused across hops, so a
 * redirect can never reuse an earlier hop's validation to reach a target
 * that wouldn't pass on its own.
 *
 * `init.redirect: "manual"` returns after exactly one hop, same as native
 * `fetch` — used by `redirects.ts`, which does its own hop-by-hop loop to
 * report the chain. Any other (or absent) `redirect` value follows up to
 * `MAX_SAFE_REDIRECTS` hops internally, revalidating each one, and returns
 * the final response — matching native `fetch`'s default "follow" behavior
 * from the caller's point of view, just safe.
 */
export async function safeFetch(
  urlString: string,
  init: UndiciRequestInit = {},
): Promise<UndiciResponse> {
  const shouldFollow = init.redirect !== "manual";
  const visited = new Set<string>();
  let currentUrl = urlString;

  for (let hop = 0; ; hop++) {
    if (visited.has(currentUrl)) {
      throw new RedirectLimitError("Redirect loop detected.");
    }
    visited.add(currentUrl);

    const target = normalizeTarget(currentUrl);
    const validated = await resolveValidatedTarget(target);
    const response = await fetchOnce(validated, init);

    if (!shouldFollow || !REDIRECT_STATUSES.has(response.status)) {
      return response;
    }

    const location = response.headers.get("location");
    if (!location) {
      return response;
    }

    if (hop >= MAX_SAFE_REDIRECTS) {
      throw new RedirectLimitError(
        `Exceeded ${MAX_SAFE_REDIRECTS} redirects while following a target.`,
      );
    }

    currentUrl = new URL(location, validated.url).toString();
  }
}

/**
 * Reads a response body up to `maxBytes`, throwing `ResponseTooLargeError`
 * instead of buffering further (master plan §8.6/§8.7) — `response.text()`
 * has no such limit. Operates on the already-decompressed stream, so this
 * also caps decompression bombs: a small gzipped payload that decompresses
 * to gigabytes is stopped as soon as the *decoded* bytes cross the limit,
 * not after the whole body has been buffered.
 */
export async function readBodyText(
  response: UndiciResponse | Response,
  maxBytes: number = MAX_RESPONSE_BYTES,
): Promise<string> {
  if (!response.body) {
    return "";
  }

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

  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))).toString(
    "utf-8",
  );
}
