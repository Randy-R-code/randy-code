import { beforeEach, describe, expect, it, vi } from "vitest";

const { safeFetch, readBodyText, resolveA, resolveAAAA } = vi.hoisted(() => ({
  safeFetch: vi.fn(),
  readBodyText: vi.fn(),
  resolveA: vi.fn(),
  resolveAAAA: vi.fn(),
}));

vi.mock("@infralens-lib/security/safe-fetch", () => ({
  safeFetch,
  readBodyText,
}));
vi.mock("@infralens-lib/dns/dns-client", () => ({ resolveA, resolveAAAA }));

const { collectSharedContext } = await import("./collect");

function response(status: number, headers: Record<string, string> = {}) {
  return { status, headers: new Headers(headers) };
}

function dnsOk(...addresses: string[]) {
  return { type: "A" as const, success: true, data: addresses, durationMs: 1 };
}

const noRecords = { success: false, durationMs: 1 };

beforeEach(() => {
  safeFetch.mockReset();
  readBodyText.mockReset();
  resolveA.mockReset().mockResolvedValue(noRecords);
  resolveAAAA.mockReset().mockResolvedValue(noRecords);
});

describe("collectSharedContext — page collection", () => {
  it("fetches the page exactly once when there is no redirect", async () => {
    safeFetch.mockResolvedValue(response(200, { "content-type": "text/html" }));
    readBodyText.mockResolvedValue("<html>hi</html>");

    const result = await collectSharedContext(
      "example.com",
      "https://example.com/",
      1000,
    );

    expect(safeFetch).toHaveBeenCalledTimes(1);
    expect(result.page?.status).toBe(200);
    expect(result.page?.html).toBe("<html>hi</html>");
    expect(result.page?.redirectCount).toBe(0);
    expect(result.page?.finalUrl).toBe("https://example.com/");
  });

  it("follows redirects and reports the chain, reading the body only at the final hop", async () => {
    safeFetch
      .mockResolvedValueOnce(
        response(301, { location: "https://example.com/new" }),
      )
      .mockResolvedValueOnce(response(200, {}));
    readBodyText.mockResolvedValue("final content");

    const result = await collectSharedContext(
      "example.com",
      "https://example.com/",
      1000,
    );

    expect(safeFetch).toHaveBeenCalledTimes(2);
    expect(readBodyText).toHaveBeenCalledTimes(1);
    expect(result.page?.redirectCount).toBe(1);
    expect(result.page?.finalUrl).toBe("https://example.com/new");
    expect(result.page?.redirectChain).toEqual([
      { url: "https://example.com/", status: 301 },
      { url: "https://example.com/new", status: 200 },
    ]);
    expect(result.page?.html).toBe("final content");
  });

  it("detects a redirect loop and stops without reading a body", async () => {
    safeFetch
      .mockResolvedValueOnce(
        response(302, { location: "https://example.com/b" }),
      )
      .mockResolvedValueOnce(
        response(302, { location: "https://example.com/" }),
      );

    const result = await collectSharedContext(
      "example.com",
      "https://example.com/",
      1000,
    );

    expect(result.page?.hasRedirectLoop).toBe(true);
    expect(readBodyText).not.toHaveBeenCalled();
  });

  it("returns page: null when the fetch itself throws", async () => {
    safeFetch.mockRejectedValue(new Error("network down"));

    const result = await collectSharedContext(
      "example.com",
      "https://example.com/",
      1000,
    );

    expect(result.page).toBeNull();
  });

  it("computes compression from the content-encoding header", async () => {
    safeFetch.mockResolvedValue(response(200, { "content-encoding": "br" }));
    readBodyText.mockResolvedValue("x");

    const result = await collectSharedContext(
      "example.com",
      "https://example.com/",
      1000,
    );

    expect(result.page?.compression).toBe("br");
  });
});

describe("collectSharedContext — shared DNS", () => {
  it("carries the resolved A/AAAA records for reuse by other checks", async () => {
    safeFetch.mockResolvedValue(response(200));
    readBodyText.mockResolvedValue("");
    resolveA.mockResolvedValue(dnsOk("93.184.216.34"));
    resolveAAAA.mockResolvedValue(dnsOk("2606:2800:220:1::1"));

    const result = await collectSharedContext(
      "example.com",
      "https://example.com/",
      1000,
    );

    expect(result.dns.a).toEqual(["93.184.216.34"]);
    expect(result.dns.aaaa).toEqual(["2606:2800:220:1::1"]);
  });
});
