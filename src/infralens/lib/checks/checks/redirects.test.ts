import { describe, expect, it } from "vitest";
import { CollectedContext, PageSnapshot, RedirectHop } from "../collect";
import { runRedirectsCheck } from "./redirects";

function snapshot(overrides: Partial<PageSnapshot> = {}): PageSnapshot {
  return {
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
    ...overrides,
  };
}

function chain(...hops: RedirectHop[]): RedirectHop[] {
  return hops;
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

describe("runRedirectsCheck", () => {
  it("returns error when the shared page collection failed", async () => {
    const result = await runRedirectsCheck(contextWith(null));

    expect(result.status).toBe("error");
  });

  it("passes with no redirects", async () => {
    const result = await runRedirectsCheck(contextWith(snapshot()));

    expect(result.status).toBe("pass");
    expect(result.summary).toBe("No redirects detected.");
    expect(result.data?.hasProtocolDowngrade).toBe(false);
    expect(result.data?.hostnameChanged).toBe(false);
  });

  it("passes with a short, same-protocol, same-host redirect chain", async () => {
    const result = await runRedirectsCheck(
      contextWith(
        snapshot({
          redirectCount: 1,
          finalUrl: "https://example.com/new",
          redirectChain: chain(
            { url: "https://example.com/", status: 301 },
            { url: "https://example.com/new", status: 200 },
          ),
        }),
      ),
    );

    expect(result.status).toBe("pass");
    expect(result.data?.redirectChain).toHaveLength(2);
    expect(result.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Hop 1" }),
        expect.objectContaining({ label: "Hop 2" }),
      ]),
    );
  });

  it("fails on a redirect loop, taking priority over other findings", async () => {
    const result = await runRedirectsCheck(
      contextWith(snapshot({ hasRedirectLoop: true })),
    );

    expect(result.status).toBe("fail");
    expect(result.recommendation?.id).toBe("redirect-loop");
  });

  it("fails when the chain downgrades from https to http", async () => {
    const result = await runRedirectsCheck(
      contextWith(
        snapshot({
          redirectCount: 1,
          finalUrl: "http://example.com/insecure",
          redirectChain: chain(
            { url: "https://example.com/", status: 301 },
            { url: "http://example.com/insecure", status: 200 },
          ),
        }),
      ),
    );

    expect(result.status).toBe("fail");
    expect(result.recommendation?.id).toBe(
      "protocol-downgrade-in-redirect-chain",
    );
    expect(result.data?.hasProtocolDowngrade).toBe(true);
  });

  it("warns on more than 5 redirects", async () => {
    const result = await runRedirectsCheck(
      contextWith(snapshot({ redirectCount: 6 })),
    );

    expect(result.status).toBe("warning");
    expect(result.recommendation?.id).toBe("excessive-redirects");
  });

  it("surfaces a hostname change between the first hop and the final URL as evidence", async () => {
    const result = await runRedirectsCheck(
      contextWith(
        snapshot({
          redirectCount: 1,
          finalUrl: "https://www.example.com/",
          redirectChain: chain(
            { url: "https://example.com/", status: 301 },
            { url: "https://www.example.com/", status: 200 },
          ),
        }),
      ),
    );

    expect(result.data?.hostnameChanged).toBe(true);
    expect(result.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Hostname change" }),
      ]),
    );
  });
});
