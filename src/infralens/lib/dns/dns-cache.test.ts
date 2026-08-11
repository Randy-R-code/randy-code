import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getCache, setCache } from "./dns-cache";

describe("dns-cache", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null for a key that was never set", () => {
    expect(getCache("never-set-key")).toBeNull();
  });

  it("returns the cached value before it expires", () => {
    setCache("fresh-key", { ip: "1.2.3.4" }, 1000);

    expect(getCache("fresh-key")).toEqual({ ip: "1.2.3.4" });
  });

  it("expires and clears the entry after its TTL elapses", () => {
    setCache("expiring-key", ["a"], 1000);

    vi.advanceTimersByTime(1001);

    expect(getCache("expiring-key")).toBeNull();
  });

  it("falls back to the default TTL when none is passed", () => {
    setCache("default-ttl-key", "value");

    vi.advanceTimersByTime(59_000);
    expect(getCache("default-ttl-key")).toBe("value");

    vi.advanceTimersByTime(2_000);
    expect(getCache("default-ttl-key")).toBeNull();
  });
});
