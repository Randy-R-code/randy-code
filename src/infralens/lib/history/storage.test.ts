import { describe, expect, it } from "vitest";
import { isValidEntry, parseStoredHistory, serializeHistory } from "./storage";
import { HISTORY_SCHEMA_VERSION } from "./types";

const validEntry = {
  id: "abc123",
  timestamp: 1700000000000,
  results: {
    hostname: "example.com",
    url: "https://example.com",
    score: { score: 84, grade: "B" },
  },
};

describe("parseStoredHistory", () => {
  it("returns an empty history when nothing is stored", () => {
    expect(parseStoredHistory(null)).toEqual([]);
  });

  it("round-trips through serializeHistory at the current schema version", () => {
    const serialized = serializeHistory([validEntry as never]);
    expect(parseStoredHistory(serialized)).toEqual([validEntry]);
  });

  it("resets to empty on malformed JSON instead of throwing", () => {
    expect(parseStoredHistory("{not json")).toEqual([]);
  });

  it("resets to empty on the pre-versioning bare-array format", () => {
    // What every stored history looked like before HISTORY_SCHEMA_VERSION
    // existed — must not be misread as valid current-version data.
    expect(parseStoredHistory(JSON.stringify([validEntry]))).toEqual([]);
  });

  it("resets to empty when the stored version doesn't match", () => {
    const stale = JSON.stringify({
      version: HISTORY_SCHEMA_VERSION + 1,
      entries: [validEntry],
    });
    expect(parseStoredHistory(stale)).toEqual([]);
  });

  it("filters out individually malformed entries without dropping valid ones", () => {
    const mixed = JSON.stringify({
      version: HISTORY_SCHEMA_VERSION,
      entries: [validEntry, { id: "broken" }, null, "not-an-entry"],
    });
    expect(parseStoredHistory(mixed)).toEqual([validEntry]);
  });
});

describe("isValidEntry", () => {
  it("accepts a well-formed entry", () => {
    expect(isValidEntry(validEntry)).toBe(true);
  });

  it("rejects an entry missing a score", () => {
    expect(
      isValidEntry({ ...validEntry, results: { hostname: "x", url: "y" } }),
    ).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(isValidEntry(null)).toBe(false);
    expect(isValidEntry("string")).toBe(false);
  });
});
