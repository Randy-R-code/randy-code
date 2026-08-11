import { ChecksResponse } from "@infralens-lib/checks/types";

export type HistoryEntry = {
  id: string;
  timestamp: number;
  results: ChecksResponse;
};

export type AnalysisHistory = HistoryEntry[];

// Wrapper actually written to localStorage — versioned so a future format
// change can be detected and handled explicitly instead of guessed at from
// unversioned data shape.
export type StoredHistory = {
  version: number;
  entries: AnalysisHistory;
};

export const HISTORY_STORAGE_KEY = "infralens-history";
export const MAX_HISTORY_ENTRIES = 10;
export const HISTORY_SCHEMA_VERSION = 1;
