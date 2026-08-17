"use client";

import type { HistoryEntry } from "./types";

/**
 * Vanilla IndexedDB, no dependency — deliberately not localStorage like
 * InfraLens's and JSON Studio's own small history/content stores. Entries
 * here carry full request/response bodies (potentially base64-encoded
 * binary responses), which can get considerably bigger than InfraLens's
 * check-result summaries, and localStorage's quota is shared across every
 * tool on this origin. Only `history-store.ts` should import this file —
 * every function here assumes it's called from a browser context.
 */
const DB_NAME = "randy-code-api-studio";
const DB_VERSION = 1;
const STORE_NAME = "history";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, mode);
      const request = run(transaction.objectStore(STORE_NAME));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

export async function putEntry(entry: HistoryEntry): Promise<void> {
  await withStore("readwrite", (store) => store.put(entry));
}

export async function getAllEntries(): Promise<HistoryEntry[]> {
  return withStore("readonly", (store) => store.getAll());
}

export async function deleteEntry(id: string): Promise<void> {
  await withStore("readwrite", (store) => store.delete(id));
}

export async function clearEntries(): Promise<void> {
  await withStore("readwrite", (store) => store.clear());
}
