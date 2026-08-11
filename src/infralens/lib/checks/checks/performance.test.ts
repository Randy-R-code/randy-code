import { describe, expect, it } from "vitest";
import { CollectedContext, PageSnapshot } from "../collect";
import { runPerformanceCheck } from "./performance";

function snapshot(overrides: Partial<PageSnapshot> = {}): PageSnapshot {
  return {
    finalUrl: "https://example.com/",
    redirectChain: [{ url: "https://example.com/", status: 200 }],
    redirectCount: 0,
    hasRedirectLoop: false,
    status: 200,
    headers: new Headers() as PageSnapshot["headers"],
    html: "",
    responseTimeMs: 200,
    contentLength: 1000,
    compression: "gzip",
    ...overrides,
  };
}

function contextWith(page: PageSnapshot | null, dnsDurationMs = 5) {
  const shared: CollectedContext = {
    page,
    dns: { a: [], aaaa: [], durationMs: dnsDurationMs },
  };
  return {
    url: "https://example.com",
    hostname: "example.com",
    timeout: 1000,
    shared,
  };
}

describe("runPerformanceCheck", () => {
  it("returns error when the shared page collection failed", async () => {
    const result = await runPerformanceCheck(contextWith(null));

    expect(result.status).toBe("error");
  });

  it("surfaces the real DNS lookup duration from the shared collection step", async () => {
    const result = await runPerformanceCheck(contextWith(snapshot(), 42));

    expect(result.data?.dnsLookupMs).toBe(42);
  });

  it("surfaces the Cache-Control header when present", async () => {
    const result = await runPerformanceCheck(
      contextWith(
        snapshot({
          headers: new Headers({
            "cache-control": "max-age=3600",
          }) as PageSnapshot["headers"],
        }),
      ),
    );

    expect(result.data?.cacheControl).toBe("max-age=3600");
    expect(result.summary).toContain("max-age=3600");
  });

  it("fails on a genuinely slow response", async () => {
    const result = await runPerformanceCheck(
      contextWith(snapshot({ responseTimeMs: 2500 })),
    );

    expect(result.status).toBe("fail");
  });

  it("warns when compression is missing on a large response", async () => {
    const result = await runPerformanceCheck(
      contextWith(snapshot({ compression: "none", contentLength: 50000 })),
    );

    expect(result.status).toBe("warning");
  });

  it("never claims to measure connection time or TTFB separately", async () => {
    const result = await runPerformanceCheck(contextWith(snapshot()));

    expect(result.data).not.toHaveProperty("ttfb");
    expect(result.data).not.toHaveProperty("connectionTime");
    expect(
      result.limitations?.some((l) => /Lighthouse|WebPageTest/i.test(l)),
    ).toBe(true);
  });
});
