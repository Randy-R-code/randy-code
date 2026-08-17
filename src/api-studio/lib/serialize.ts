export type KeyValueRow = {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
};

export function newRow(): KeyValueRow {
  return { id: crypto.randomUUID(), key: "", value: "", enabled: true };
}

/** Only enabled rows with a non-empty key are sent — a disabled or blank row is a draft, not a value. */
export function rowsToRecord(rows: KeyValueRow[]): Record<string, string> {
  const record: Record<string, string> = {};
  for (const row of rows) {
    if (row.enabled && row.key.trim()) {
      record[row.key.trim()] = row.value;
    }
  }
  return record;
}

/** Extracts query params from a URL into editable rows. Returns `[]` for an unparsable URL rather than throwing — the field may still be mid-edit. */
export function paramsFromUrl(url: string): KeyValueRow[] {
  try {
    const parsed = new URL(url);
    return Array.from(parsed.searchParams.entries()).map(([key, value]) => ({
      id: crypto.randomUUID(),
      key,
      value,
      enabled: true,
    }));
  } catch {
    return [];
  }
}

/** Rebuilds a URL's query string from the given rows. Leaves the URL untouched if it doesn't parse. */
export function applyParamsToUrl(url: string, rows: KeyValueRow[]): string {
  try {
    const parsed = new URL(url);
    parsed.search = "";
    for (const row of rows) {
      if (row.enabled && row.key.trim()) {
        parsed.searchParams.append(row.key.trim(), row.value);
      }
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

/** The inverse of `rowsToRecord` — used to re-populate the Headers editor when reopening a saved history entry. */
export function recordToRows(record: Record<string, string>): KeyValueRow[] {
  return Object.entries(record).map(([key, value]) => ({
    id: crypto.randomUUID(),
    key,
    value,
    enabled: true,
  }));
}
