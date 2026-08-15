import { beforeEach, describe, expect, it, vi } from "vitest";
import { PageSnapshot } from "../collect";

const { getCache, setCache } = vi.hoisted(() => ({
  getCache: vi.fn(),
  setCache: vi.fn(),
}));
vi.mock("@infralens-lib/dns/dns-cache", () => ({ getCache, setCache }));

const { runIpHostingCheck } = await import("./ip-hosting");

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

// A minimal but real snapshot — just enough to signal "the page loaded
// fine", which is all these tests need `shared.page` for.
const reachablePage: PageSnapshot = {
  finalUrl: "https://example.com/",
  redirectChain: [{ url: "https://example.com/", status: 200 }],
  redirectCount: 0,
  hasRedirectLoop: false,
  status: 200,
  headers: new Headers() as PageSnapshot["headers"],
  html: "",
  responseTimeMs: 10,
  contentLength: 0,
  compression: "none",
};

function context(
  ip = "93.184.216.34",
  page: PageSnapshot | null = reachablePage,
) {
  return {
    url: "https://example.com",
    hostname: "example.com",
    timeout: 1000,
    shared: { page, dns: { a: ip ? [ip] : [], aaaa: [], durationMs: 0 } },
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
  it("fails fast when the page is reachable but no IP was resolved", async () => {
    const result = await runIpHostingCheck(context(""));

    expect(result.status).toBe("fail");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns error instead of fail when no IP AND the page itself is unreachable (outage, not a hosting finding)", async () => {
    const result = await runIpHostingCheck(context("", null));

    expect(result.status).toBe("error");
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
