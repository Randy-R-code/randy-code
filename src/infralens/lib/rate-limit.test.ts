import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows the first request for a new identifier", () => {
    const result = checkRateLimit("client-a");

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("blocks a second request within the same window", () => {
    checkRateLimit("client-b");
    const second = checkRateLimit("client-b");

    expect(second.allowed).toBe(false);
    expect(second.remaining).toBe(0);
  });

  it("allows a request again once the window has elapsed", () => {
    checkRateLimit("client-c");
    vi.advanceTimersByTime(30_001);

    const result = checkRateLimit("client-c");

    expect(result.allowed).toBe(true);
  });

  it("tracks identifiers independently", () => {
    checkRateLimit("client-d");
    const other = checkRateLimit("client-e");

    expect(other.allowed).toBe(true);
  });
});
