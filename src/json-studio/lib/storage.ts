"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "randy-code:json-studio:content";
const EMPTY = "";

function readStorage(): string {
  if (typeof window === "undefined") return EMPTY;
  try {
    return localStorage.getItem(STORAGE_KEY) ?? EMPTY;
  } catch {
    return EMPTY;
  }
}

function writeStorage(value: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Private browsing / quota exceeded — persistence is a nice-to-have, not
    // something worth surfacing an error for.
  }
}

let cached: string | null = null;
let listeners: Array<() => void> = [];

function subscribe(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function getSnapshot(): string {
  if (cached === null) cached = readStorage();
  return cached;
}

function getServerSnapshot(): string {
  return EMPTY;
}

/** SSR-safe editor content persisted to localStorage, restored on revisit. Never synced remotely. */
export function useStoredContent(): [string, (next: string) => void] {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback((next: string) => {
    cached = next;
    writeStorage(next);
    listeners.forEach((listener) => listener());
  }, []);

  return [value, setValue];
}
