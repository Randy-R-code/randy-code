import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

async function freshPolicies() {
  vi.resetModules();
  return import("./policies");
}

describe("getPolicyLimiters", () => {
  const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
  const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  afterEach(() => {
    if (originalUrl === undefined) delete process.env.UPSTASH_REDIS_REST_URL;
    else process.env.UPSTASH_REDIS_REST_URL = originalUrl;

    if (originalToken === undefined)
      delete process.env.UPSTASH_REDIS_REST_TOKEN;
    else process.env.UPSTASH_REDIS_REST_TOKEN = originalToken;
  });

  it("returns null when Upstash isn't configured", async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    const { getPolicyLimiters } = await freshPolicies();

    expect(getPolicyLimiters("infralens")).toBeNull();
  });

  describe("when configured", () => {
    beforeEach(() => {
      process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
      process.env.UPSTASH_REDIS_REST_TOKEN = "secret";
    });

    it("returns one limiter per configured scope", async () => {
      const { getPolicyLimiters } = await freshPolicies();

      expect(getPolicyLimiters("contact")).toHaveLength(2); // short + daily
      expect(getPolicyLimiters("infralens")).toHaveLength(2); // burst + hourly
    });

    it("caches limiters across calls for the same policy", async () => {
      const { getPolicyLimiters } = await freshPolicies();

      const first = getPolicyLimiters("metalens");
      const second = getPolicyLimiters("metalens");

      expect(first?.[0]).toBe(second?.[0]);
      expect(first?.[1]).toBe(second?.[1]);
    });

    it("keeps independent limiter instances across policies", async () => {
      const { getPolicyLimiters } = await freshPolicies();

      const infralens = getPolicyLimiters("infralens");
      const metalens = getPolicyLimiters("metalens");

      expect(infralens?.[0]).not.toBe(metalens?.[0]);
    });
  });
});
