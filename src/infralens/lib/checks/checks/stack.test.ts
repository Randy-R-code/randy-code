import { describe, expect, it } from "vitest";
import { CollectedContext, PageSnapshot } from "../collect";
import { runStackCheck } from "./stack";

function snapshot(
  html: string,
  headers: Record<string, string> = {},
): PageSnapshot {
  return {
    finalUrl: "https://example.com/",
    redirectChain: [{ url: "https://example.com/", status: 200 }],
    redirectCount: 0,
    hasRedirectLoop: false,
    status: 200,
    headers: new Headers(headers) as PageSnapshot["headers"],
    html,
    responseTimeMs: 10,
    contentLength: html.length,
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

describe("runStackCheck", () => {
  it("returns error when the shared page collection failed", async () => {
    const result = await runStackCheck(contextWith(null));

    expect(result.status).toBe("error");
  });

  it("is always info and never fails/warns, even with nothing detected", async () => {
    const result = await runStackCheck(contextWith(snapshot("<html></html>")));

    expect(result.status).toBe("info");
    expect(result.data?.findings).toEqual([]);
  });

  it("marks a build-output fingerprint as likely, not confirmed", async () => {
    const result = await runStackCheck(
      contextWith(snapshot('<script src="/_next/static/chunk.js"></script>')),
    );

    const next = result.data?.findings.find((f) => f.name === "Next.js");
    expect(next?.confidence).toBe("likely");
  });

  it("marks a bare keyword mention as only possible", async () => {
    const result = await runStackCheck(
      contextWith(snapshot("<p>We love vue.js at this company</p>")),
    );

    const vue = result.data?.findings.find((f) => f.name === "Vue.js");
    expect(vue?.confidence).toBe("possible");
  });

  it("upgrades confidence to the strongest match when both a weak and strong pattern hit", async () => {
    const result = await runStackCheck(
      contextWith(
        snapshot('<div id="___gatsby">gatsby powers this site</div>'),
      ),
    );

    const gatsby = result.data?.findings.find((f) => f.name === "Gatsby");
    expect(gatsby?.confidence).toBe("likely");
  });

  it("marks a CDN header as confirmed", async () => {
    const result = await runStackCheck(
      contextWith(snapshot("<html></html>", { "cf-ray": "abc123" })),
    );

    const cdn = result.data?.findings.find((f) => f.category === "cdn");
    expect(cdn?.name).toBe("Cloudflare");
    expect(cdn?.confidence).toBe("confirmed");
  });
});
