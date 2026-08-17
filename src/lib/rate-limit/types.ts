export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  /** Only set when `allowed` is false — lets a caller distinguish a normal
   * quota rejection from a rate-limit backend failure without inspecting
   * logs, so it can show a different message for each. */
  reason?: "exceeded" | "backend_error";
};

export type ConcurrencyResult = {
  allowed: boolean;
  limit: number;
};
