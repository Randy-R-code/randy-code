import type { RequestConfig } from "../types";

/** POSIX single-quote escaping: close the quote, emit an escaped quote, reopen it. */
function shellEscape(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

export function toCurl(config: RequestConfig): string {
  const lines = [`curl -X ${config.method} ${shellEscape(config.url)}`];

  for (const [name, value] of Object.entries(config.headers)) {
    lines.push(`  -H ${shellEscape(`${name}: ${value}`)}`);
  }

  if (config.body) {
    lines.push(`  -d ${shellEscape(config.body)}`);
  }

  return lines.join(" \\\n");
}
