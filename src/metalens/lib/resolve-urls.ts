/**
 * Resolves a possibly-relative metadata URL (or protocol-relative
 * `//cdn.example.com/x`) against a base, always through the platform `URL`
 * API — never ad-hoc string concatenation (spec §36). Returns `undefined`
 * for values that don't produce a valid absolute URL rather than throwing,
 * since a malformed metadata value should degrade to "not shown as a link"
 * rather than break the whole analysis.
 */
export function resolveMetadataUrl(
  value: string | undefined,
  base: string,
): string | undefined {
  if (!value) return undefined;
  try {
    return new URL(value, base).toString();
  } catch {
    return undefined;
  }
}

/** The base relative metadata URLs resolve against — the page's own `<base href>` when present and valid, otherwise the final fetched URL (spec §35). */
export function effectiveBase(
  finalUrl: string,
  baseHref: string | undefined,
): string {
  if (!baseHref) return finalUrl;
  try {
    return new URL(baseHref, finalUrl).toString();
  } catch {
    return finalUrl;
  }
}

/** True only for `http:`/`https:` URLs — the gate before any metadata value becomes a clickable `<a>` (spec §87, §147). `javascript:`/`data:`/`file:` and malformed values must still be displayable as plain text, just never active links. */
export function isSafeExternalUrl(value: string | undefined): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
