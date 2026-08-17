"use client";

import {
  clearHistory,
  listHistoryEntries,
  removeHistoryEntry,
  saveHistoryEntry,
} from "@/api-studio/lib/history/history-store";
import type { HistoryEntry } from "@/api-studio/lib/history/types";
import { useCallback, useSyncExternalStore } from "react";

const EMPTY: HistoryEntry[] = [];

let cached: HistoryEntry[] = EMPTY;
let loadedOnce = false;
let listeners: Array<() => void> = [];

function notify() {
  listeners.forEach((listener) => listener());
}

async function refresh(): Promise<void> {
  cached = await listHistoryEntries();
  notify();
}

function subscribe(callback: () => void) {
  listeners.push(callback);
  if (!loadedOnce) {
    loadedOnce = true;
    void refresh();
  }
  return () => {
    listeners = listeners.filter((listener) => listener !== callback);
  };
}

function getSnapshot(): HistoryEntry[] {
  return cached;
}

function getServerSnapshot(): HistoryEntry[] {
  return EMPTY;
}

/**
 * IndexedDB is inherently async, so `getSnapshot` can't read it directly
 * the way JSON Studio's localStorage-backed store does (`lib/storage.ts`).
 * This keeps an in-memory cache in sync instead: `subscribe` kicks off the
 * initial load (the sanctioned side effect for an external store, per
 * `useSyncExternalStore`'s own contract), and every mutation below
 * refreshes it again — never a raw `setState` inside a `useEffect`.
 */
export function useRequestHistory() {
  const entries = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const save = useCallback(async (entry: HistoryEntry) => {
    await saveHistoryEntry(entry);
    await refresh();
  }, []);

  const remove = useCallback(async (id: string) => {
    await removeHistoryEntry(id);
    await refresh();
  }, []);

  const clear = useCallback(async () => {
    await clearHistory();
    await refresh();
  }, []);

  return { entries, save, remove, clear };
}
