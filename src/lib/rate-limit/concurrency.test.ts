import { beforeEach, describe, expect, it, vi } from "vitest";

const logWarn = vi.fn();
const logError = vi.fn();
vi.mock("@infralens-lib/log", () => ({ logWarn, logError }));

async function freshAcquire(getRedis: () => unknown) {
  vi.resetModules();
  vi.doMock("./client", () => ({ getRedis }));
  const mod = await import("./concurrency");
  return mod.acquireConcurrencySlot;
}

const options = {
  resource: "api-studio",
  identifier: "1.2.3.4",
  maxConcurrent: 4,
  ttlSeconds: 30,
};

describe("acquireConcurrencySlot", () => {
  beforeEach(() => {
    logWarn.mockClear();
    logError.mockClear();
  });

  it("allows the request and warns once when Upstash isn't configured", async () => {
    const acquireConcurrencySlot = await freshAcquire(() => null);

    const { result } = await acquireConcurrencySlot(options);

    expect(result).toEqual({ allowed: true, limit: 4 });
    expect(logWarn).toHaveBeenCalledWith({
      event: "rate_limit_not_configured",
    });
  });

  it("grants a slot under the limit, sets a TTL on the first acquisition, and releases via decr", async () => {
    const redis = {
      incr: vi.fn().mockResolvedValue(1),
      expire: vi.fn().mockResolvedValue(1),
      decr: vi.fn().mockResolvedValue(0),
    };
    const acquireConcurrencySlot = await freshAcquire(() => redis);

    const { result, release } = await acquireConcurrencySlot(options);
    expect(result).toEqual({ allowed: true, limit: 4 });
    expect(redis.expire).toHaveBeenCalledWith("concur:api-studio:1.2.3.4", 30);

    await release();
    expect(redis.decr).toHaveBeenCalledWith("concur:api-studio:1.2.3.4");
  });

  it("does not re-arm the TTL on subsequent acquisitions", async () => {
    const redis = {
      incr: vi.fn().mockResolvedValue(2),
      expire: vi.fn(),
      decr: vi.fn().mockResolvedValue(1),
    };
    const acquireConcurrencySlot = await freshAcquire(() => redis);

    await acquireConcurrencySlot(options);

    expect(redis.expire).not.toHaveBeenCalled();
  });

  it("rejects and immediately releases its own increment once over the limit", async () => {
    const redis = {
      incr: vi.fn().mockResolvedValue(5),
      expire: vi.fn(),
      decr: vi.fn().mockResolvedValue(4),
    };
    const acquireConcurrencySlot = await freshAcquire(() => redis);

    const { result, release } = await acquireConcurrencySlot(options);

    expect(result).toEqual({ allowed: false, limit: 4 });
    expect(redis.decr).toHaveBeenCalledTimes(1);

    await release();
    expect(redis.decr).toHaveBeenCalledTimes(1); // release() on a rejected slot is a no-op
  });

  it("fails closed and logs when Redis errors", async () => {
    const redis = {
      incr: vi.fn().mockRejectedValue(new Error("network down")),
      expire: vi.fn(),
      decr: vi.fn(),
    };
    const acquireConcurrencySlot = await freshAcquire(() => redis);

    const { result } = await acquireConcurrencySlot(options);

    expect(result).toEqual({ allowed: false, limit: 4 });
    expect(logError).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "rate_limit_backend_error",
        resource: "api-studio",
      }),
    );
  });
});
