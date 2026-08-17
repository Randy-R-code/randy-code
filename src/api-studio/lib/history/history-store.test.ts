import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { HistoryEntry } from "./types";

const putEntry = vi.fn();
const getAllEntries = vi.fn();
const deleteEntry = vi.fn();
const clearEntries = vi.fn();
vi.mock("./db", () => ({ putEntry, getAllEntries, deleteEntry, clearEntries }));

const {
  saveHistoryEntry,
  listHistoryEntries,
  removeHistoryEntry,
  clearHistory,
} = await import("./history-store");

function entry(id: string, timestamp: number): HistoryEntry {
  return {
    id,
    timestamp,
    request: { method: "GET", url: "https://example.com", headers: {} },
    response: {
      ok: true,
      status: 200,
      statusText: "OK",
      headers: {},
      bodyText: "",
      isBinary: false,
      durationMs: 1,
      sizeBytes: 0,
      finalUrl: "https://example.com",
    },
  };
}

beforeEach(() => {
  putEntry.mockReset();
  getAllEntries.mockReset().mockResolvedValue([]);
  deleteEntry.mockReset();
  clearEntries.mockReset();
});

// Vitest's environment is Node, where `indexedDB` genuinely doesn't exist —
// this exercises the real SSR/unsupported-environment guard, not a mock of it.
describe("in an environment without indexedDB (e.g. SSR)", () => {
  it("no-ops every operation instead of throwing", async () => {
    await saveHistoryEntry(entry("a", 1));
    expect(await listHistoryEntries()).toEqual([]);
    await removeHistoryEntry("a");
    await clearHistory();

    expect(putEntry).not.toHaveBeenCalled();
    expect(deleteEntry).not.toHaveBeenCalled();
    expect(clearEntries).not.toHaveBeenCalled();
  });
});

describe("with indexedDB available", () => {
  beforeEach(() => {
    vi.stubGlobal("indexedDB", {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("saves an entry without evicting when under the cap", async () => {
    getAllEntries.mockResolvedValue([entry("a", 1)]);

    await saveHistoryEntry(entry("a", 1));

    expect(putEntry).toHaveBeenCalledWith(entry("a", 1));
    expect(deleteEntry).not.toHaveBeenCalled();
  });

  it("evicts the oldest entries once over HISTORY_MAX_ENTRIES", async () => {
    const all = Array.from({ length: 101 }, (_, i) => entry(`id-${i}`, i));
    getAllEntries.mockResolvedValue(all);

    await saveHistoryEntry(entry("id-100", 100));

    expect(deleteEntry).toHaveBeenCalledTimes(1);
    expect(deleteEntry).toHaveBeenCalledWith("id-0"); // the single oldest timestamp
  });

  it("lists entries newest first", async () => {
    getAllEntries.mockResolvedValue([entry("old", 1), entry("new", 2)]);

    const result = await listHistoryEntries();

    expect(result.map((e) => e.id)).toEqual(["new", "old"]);
  });

  it("removes a single entry by id", async () => {
    await removeHistoryEntry("abc");
    expect(deleteEntry).toHaveBeenCalledWith("abc");
  });

  it("clears every entry", async () => {
    await clearHistory();
    expect(clearEntries).toHaveBeenCalledTimes(1);
  });
});
