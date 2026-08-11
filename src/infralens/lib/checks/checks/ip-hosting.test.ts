import { beforeEach, describe, expect, it, vi } from "vitest";

const { getCache, setCache } = vi.hoisted(() => ({
  getCache: vi.fn(),
  setCache: vi.fn(),
}));
vi.mock("@infralens-lib/dns/dns-cache", () => ({ getCache, setCache }));

const { runIpHostingCheck } = await import("./ip-hosting");

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

function context(ip = "93.184.216.34") {
  return {
    url: "https://example.com",
    hostname: "example.com",
    timeout: 1000,
    shared: { page: null, dns: { a: ip ? [ip] : [], aaaa: [], durationMs: 0 } },
  };
}

function apiResponse(body: unknown, ok = true) {
  return { ok, status: ok ? 200 : 500, json: async () => body };
}

beforeEach(() => {
  fetchMock.mockReset();
  getCache.mockReset().mockReturnValue(null);
  setCache.mockReset();
});

describe("runIpHostingCheck", () => {
  it("fails fast when no IP was resolved", async () => {
    const result = await runIpHostingCheck(context(""));

    expect(result.status).toBe("fail");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fetches and caches the ipapi.co response on a cache miss", async () => {
    fetchMock.mockResolvedValue(
      apiResponse({ ip: "93.184.216.34", asn: "AS1234", isp: "Example ISP" }),
    );

    const result = await runIpHostingCheck(context());

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(setCache).toHaveBeenCalledWith(
      "ipapi:93.184.216.34",
      expect.objectContaining({ asn: "AS1234" }),
      expect.any(Number),
    );
    expect(result.data?.asn).toBe("AS1234");
  });

  it("uses the cached response instead of calling ipapi.co again", async () => {
    getCache.mockReturnValue({
      ip: "93.184.216.34",
      asn: "AS9999",
      isp: "Cached ISP",
    });

    const result = await runIpHostingCheck(context());

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.data?.asn).toBe("AS9999");
  });

  it("marks the result unavailable, not a failure, when the API is down", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));

    const result = await runIpHostingCheck(context());

    expect(result.status).toBe("unavailable");
    expect(result.data?.ip).toBe("93.184.216.34");
  });
});
