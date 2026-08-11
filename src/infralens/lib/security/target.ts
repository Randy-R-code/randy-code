import { ALLOWED_PORT_BY_PROTOCOL } from "@infralens-config/constants";
import { InvalidTargetError } from "./errors";

export type NormalizedTarget = {
  /** Canonical URL string — no fragment, no credentials, default port only. */
  url: string;
  hostname: string;
  protocol: "http:" | "https:";
};

const ALLOWED_PROTOCOLS = new Set(Object.keys(ALLOWED_PORT_BY_PROTOCOL));

/**
 * The single place user-supplied target strings get parsed (master plan
 * §7.2) — no check should call `new URL()` on raw user input itself.
 *
 * Deliberately synchronous and network-free: DNS resolution and IP
 * classification are a separate step (`resolve-target.ts`), because they're
 * async and must happen fresh for every redirect hop, not just the initial
 * input.
 */
export function normalizeTarget(input: string): NormalizedTarget {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new InvalidTargetError("Empty target.", "Please enter a URL.");
  }

  const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    throw new InvalidTargetError(
      "URL failed to parse.",
      "This doesn't look like a valid URL.",
    );
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    throw new InvalidTargetError(
      `Protocol not allowed: ${parsed.protocol}`,
      "Only http:// and https:// URLs can be analyzed.",
    );
  }

  if (parsed.username || parsed.password) {
    throw new InvalidTargetError(
      "URL contains credentials.",
      "URLs with a username or password are not allowed.",
    );
  }

  const protocol = parsed.protocol as "http:" | "https:";
  const defaultPort = ALLOWED_PORT_BY_PROTOCOL[protocol];
  if (parsed.port && Number(parsed.port) !== defaultPort) {
    throw new InvalidTargetError(
      `Port not allowed: ${parsed.port}`,
      "Only the default port for http:// (80) or https:// (443) is allowed.",
    );
  }

  parsed.hash = "";
  parsed.port = "";

  return {
    url: parsed.toString(),
    hostname: parsed.hostname,
    protocol,
  };
}
