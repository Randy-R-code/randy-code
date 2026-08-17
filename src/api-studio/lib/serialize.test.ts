import { describe, expect, it } from "vitest";
import {
  applyParamsToUrl,
  newRow,
  paramsFromUrl,
  recordToRows,
  rowsToRecord,
  type KeyValueRow,
} from "./serialize";

describe("newRow", () => {
  it("creates an enabled, empty row with a unique id", () => {
    const a = newRow();
    const b = newRow();

    expect(a).toMatchObject({ key: "", value: "", enabled: true });
    expect(a.id).not.toBe(b.id);
  });
});

describe("rowsToRecord", () => {
  it("keeps only enabled rows with a non-empty key", () => {
    const rows: KeyValueRow[] = [
      { id: "1", key: "Accept", value: "application/json", enabled: true },
      { id: "2", key: "X-Disabled", value: "nope", enabled: false },
      { id: "3", key: "  ", value: "blank key", enabled: true },
      { id: "4", key: " X-Trimmed ", value: "v", enabled: true },
    ];

    expect(rowsToRecord(rows)).toEqual({
      Accept: "application/json",
      "X-Trimmed": "v",
    });
  });
});

describe("paramsFromUrl", () => {
  it("extracts existing query params as rows", () => {
    const rows = paramsFromUrl("https://api.example.com/users?page=2&limit=10");

    expect(rows.map(({ key, value }) => ({ key, value }))).toEqual([
      { key: "page", value: "2" },
      { key: "limit", value: "10" },
    ]);
  });

  it("returns an empty array for a URL with no query string", () => {
    expect(paramsFromUrl("https://api.example.com/users")).toEqual([]);
  });

  it("returns an empty array for an unparsable URL instead of throwing", () => {
    expect(paramsFromUrl("not a url")).toEqual([]);
  });
});

describe("applyParamsToUrl", () => {
  it("replaces the query string with only enabled, non-empty-key rows", () => {
    const rows: KeyValueRow[] = [
      { id: "1", key: "page", value: "3", enabled: true },
      { id: "2", key: "debug", value: "true", enabled: false },
      { id: "3", key: "", value: "ignored", enabled: true },
    ];

    expect(applyParamsToUrl("https://api.example.com/users?old=1", rows)).toBe(
      "https://api.example.com/users?page=3",
    );
  });

  it("leaves the URL untouched when it doesn't parse", () => {
    expect(applyParamsToUrl("not a url", [])).toBe("not a url");
  });
});

describe("recordToRows", () => {
  it("converts a header record into enabled rows with unique ids", () => {
    const rows = recordToRows({ Accept: "application/json", "X-Test": "1" });

    expect(
      rows.map(({ key, value, enabled }) => ({ key, value, enabled })),
    ).toEqual([
      { key: "Accept", value: "application/json", enabled: true },
      { key: "X-Test", value: "1", enabled: true },
    ]);
    expect(new Set(rows.map((r) => r.id)).size).toBe(rows.length);
  });

  it("returns an empty array for an empty record", () => {
    expect(recordToRows({})).toEqual([]);
  });
});
