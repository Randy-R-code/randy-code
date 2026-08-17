"use client";

import { HISTORY_MAX_ENTRIES } from "@/api-studio/config/constants";
import { clearEntries, deleteEntry, getAllEntries, putEntry } from "./db";
import type { HistoryEntry } from "./types";

function isSupported(): boolean {
  return typeof indexedDB !== "undefined";
}

/** Saves the entry, then evicts the oldest ones past `HISTORY_MAX_ENTRIES`. */
export async function saveHistoryEntry(entry: HistoryEntry): Promise<void> {
  if (!isSupported()) return;

  await putEntry(entry);

  const all = await getAllEntries();
  if (all.length <= HISTORY_MAX_ENTRIES) return;

  const oldestFirst = [...all].sort((a, b) => a.timestamp - b.timestamp);
  const toEvict = oldestFirst.slice(0, all.length - HISTORY_MAX_ENTRIES);
  await Promise.all(toEvict.map((e) => deleteEntry(e.id)));
}

export async function listHistoryEntries(): Promise<HistoryEntry[]> {
  if (!isSupported()) return [];

  const all = await getAllEntries();
  return all.sort((a, b) => b.timestamp - a.timestamp); // newest first
}

export async function removeHistoryEntry(id: string): Promise<void> {
  if (!isSupported()) return;
  await deleteEntry(id);
}

export async function clearHistory(): Promise<void> {
  if (!isSupported()) return;
  await clearEntries();
}
