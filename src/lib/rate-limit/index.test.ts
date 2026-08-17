import { beforeEach, describe, expect, it, vi } from "vitest";

const logWarn = vi.fn();
const logError = vi.fn();
vi.mock("@infralens-lib/log", () => ({ logWarn, logError }));

function fakeLimiter(result: {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}) {
  return { limit: vi.fn().mockResolvedValue(result) };
}

async function freshCheckRateLimit(
  getPolicyLimiters: (policy: string) => unknown,
) {
  vi.resetModules();
  vi.doMock("./policies", () => ({ getPolicyLimiters }));
  const mod = await import("./index");
  return mod.checkRateLimit;
}

describe("checkRateLimit", () => {
  beforeEach(() => {
    logWarn.mockClear();
    logError.mockClear();
  });

  it("allows the request and warns once when Upstash isn't configured", async () => {
    const checkRateLimit = await freshCheckRateLimit(() => null);

    const result = await checkRateLimit("infralens", "1.2.3.4");

    expect(result).toEqual({
      allowed: true,
      limit: 0,
      remaining: 0,
      resetAt: 0,
    });
    expect(logWarn).toHaveBeenCalledWith({
      event: "rate_limit_not_configured",
    });
  });

  it("allows the request and reports the tightest scope when every scope succeeds", async () => {
    const burst = fakeLimiter({
      success: true,
      limit: 5,
      remaining: 3,
      reset: 111,
    });
    const hourly = fakeLimiter({
      success: true,
      limit: 30,
      remaining: 20,
      reset: 222,
    });
    const checkRateLimit = await freshCheckRateLimit(() => [burst, hourly]);

    const result = await checkRateLimit("infralens", "1.2.3.4");

    expect(result).toEqual({
      allowed: true,
      limit: 5,
      remaining: 3,
      resetAt: 111,
    });
    expect(burst.limit).toHaveBeenCalledWith("1.2.3.4");
    expect(hourly.limit).toHaveBeenCalledWith("1.2.3.4");
  });

  it("blocks the request when any single scope is exceeded, even if others still have room", async () => {
    const burst = fakeLimiter({
      success: false,
      limit: 5,
      remaining: 0,
      reset: 111,
    });
    const hourly = fakeLimiter({
      success: true,
      limit: 30,
      remaining: 25,
      reset: 222,
    });
    const checkRateLimit = await freshCheckRateLimit(() => [burst, hourly]);

    const result = await checkRateLimit("infralens", "1.2.3.4");

    expect(result).toEqual({
      allowed: false,
      limit: 5,
      remaining: 0,
      resetAt: 111,
      reason: "exceeded",
    });
  });

  it("still evaluates every scope even after one is already blocked", async () => {
    const burst = fakeLimiter({
      success: false,
      limit: 5,
      remaining: 0,
      reset: 111,
    });
    const hourly = fakeLimiter({
      success: true,
      limit: 30,
      remaining: 25,
      reset: 222,
    });
    const checkRateLimit = await freshCheckRateLimit(() => [burst, hourly]);

    await checkRateLimit("infralens", "1.2.3.4");

    expect(hourly.limit).toHaveBeenCalledWith("1.2.3.4");
  });

  it("fails closed and logs when the Redis call itself errors", async () => {
    const broken = {
      limit: vi.fn().mockRejectedValue(new Error("network down")),
    };
    const checkRateLimit = await freshCheckRateLimit(() => [broken]);

    const before = Date.now();
    const result = await checkRateLimit("apiStudioRequest", "1.2.3.4");

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("backend_error");
    expect(result.resetAt).toBeGreaterThan(before);
    expect(logError).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "rate_limit_backend_error",
        policy: "apiStudioRequest",
      }),
    );
  });
});
