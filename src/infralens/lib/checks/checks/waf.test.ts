import { describe, expect, it } from "vitest";
import { CollectedContext, PageSnapshot } from "../collect";
import { runWafCheck } from "./waf";

function snapshot(headers: Record<string, string>): PageSnapshot {
  return {
    finalUrl: "https://example.com/",
    redirectChain: [{ url: "https://example.com/", status: 200 }],
    redirectCount: 0,
    hasRedirectLoop: false,
    status: 200,
    headers: new Headers(headers) as PageSnapshot["headers"],
    html: "",
    responseTimeMs: 10,
    contentLength: 0,
    compression: "none",
  };
}

function contextWith(page: PageSnapshot | null) {
  const shared: CollectedContext = {
    page,
    dns: { a: [], aaaa: [], durationMs: 0 },
  };
  return {
    url: "https://example.com",
    hostname: "example.com",
    timeout: 1000,
    shared,
  };
}

describe("runWafCheck", () => {
  it("returns error when the shared page collection failed", async () => {
    const result = await runWafCheck(contextWith(null));

    expect(result.status).toBe("error");
  });

  it("never fails or warns when no fingerprint is found — always info", async () => {
    const result = await runWafCheck(contextWith(snapshot({})));

    expect(result.status).toBe("info");
    expect(result.data?.likelyProvider).toBeUndefined();
  });

  it("reports a likely provider as info, using non-conclusive wording", async () => {
    const result = await runWafCheck(
      contextWith(snapshot({ "cf-ray": "abc123" })),
    );

    expect(result.status).toBe("info");
    expect(result.data?.likelyProvider).toBe("Cloudflare");
    expect(result.summary).toMatch(/may be|not a confirmed/i);
  });

  it("does not treat every response with a generic Server header as Cloudflare", async () => {
    const result = await runWafCheck(
      contextWith(snapshot({ server: "nginx/1.25.3" })),
    );

    expect(result.data?.likelyProvider).toBeUndefined();
    expect(result.status).toBe("info");
  });

  it("still recognizes an explicit cloudflare Server header value", async () => {
    const result = await runWafCheck(
      contextWith(snapshot({ server: "cloudflare" })),
    );

    expect(result.data?.likelyProvider).toBe("Cloudflare");
  });
});
