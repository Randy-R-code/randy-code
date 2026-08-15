/** Centralized operational constants for MetaLens's server-side analysis. */

export const USER_AGENT =
  "MetaLens/1.0 (+https://randy-code.dev/tools/metalens)";

/** MetaLens's own response ceiling — smaller than InfraLens's 2 MB since only <head> metadata is needed. */
export const MAX_RESPONSE_BYTES = 1.5 * 1024 * 1024;

export const FETCH_TIMEOUT_MS = 8000;

export const RATE_LIMIT_IDENTIFIER_PREFIX = "metalens";

/** Redirect hops MetaLens's own action loop will follow — each one revalidated via `safeFetch` (spec §68). */
export const MAX_REDIRECTS = 5;

/** Length guidance thresholds (characters) — informational only, never a hard validity rule. */
export const TITLE_GUIDANCE = {
  short: 20,
  long: 65,
};

export const DESCRIPTION_GUIDANCE = {
  short: 50,
  long: 160,
};

export const ACCEPTED_HTML_CONTENT_TYPES = [
  "text/html",
  "application/xhtml+xml",
];
