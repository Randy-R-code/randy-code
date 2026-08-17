import type { ExecuteRequestResult, RequestConfig } from "../types";

export type HistoryEntry = {
  id: string;
  timestamp: number;
  request: RequestConfig;
  response: ExecuteRequestResult;
};
