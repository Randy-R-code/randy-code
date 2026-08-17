import type { RequestConfig } from "../types";

/**
 * `JSON.stringify` is used for every embedded string rather than hand-rolled
 * escaping — it always produces a valid JS string literal (quotes,
 * backslashes, newlines, unicode) with no edge cases to get wrong.
 */
export function toFetch(config: RequestConfig): string {
  const options = [`  method: ${JSON.stringify(config.method)},`];

  const headerEntries = Object.entries(config.headers);
  if (headerEntries.length > 0) {
    const headerLines = headerEntries
      .map(
        ([name, value]) =>
          `    ${JSON.stringify(name)}: ${JSON.stringify(value)},`,
      )
      .join("\n");
    options.push(`  headers: {\n${headerLines}\n  },`);
  }

  if (config.body) {
    options.push(`  body: ${JSON.stringify(config.body)},`);
  }

  return `fetch(${JSON.stringify(config.url)}, {\n${options.join("\n")}\n});`;
}
