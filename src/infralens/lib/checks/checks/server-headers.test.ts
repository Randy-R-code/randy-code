import { describe, expect, it } from "vitest";
import { CollectedContext, PageSnapshot } from "../collect";
import { runServerHeadersCheck } from "./server-headers";

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

describe("runServerHeadersCheck", () => {
  it("returns error when the shared page collection failed", async () => {
    const result = await runServerHeadersCheck(contextWith(null));

    expect(result.status).toBe("error");
  });

  it("does not warn on a generic Server header with no version", async () => {
    const result = await runServerHeadersCheck(
      contextWith(snapshot({ server: "nginx" })),
    );

    expect(result.status).toBe("pass");
    expect(result.data?.hasInfoLeak).toBe(false);
  });

  it("warns when the Server header discloses a version number", async () => {
    const result = await runServerHeadersCheck(
      contextWith(snapshot({ server: "nginx/1.18.0" })),
    );

    expect(result.status).toBe("warning");
    expect(result.data?.hasInfoLeak).toBe(true);
  });

  it("warns when X-Powered-By is present, regardless of value", async () => {
    const result = await runServerHeadersCheck(
      contextWith(snapshot({ "x-powered-by": "Express" })),
    );

    expect(result.status).toBe("warning");
  });

  it("warns on a specific leak header like x-aspnet-version", async () => {
    const result = await runServerHeadersCheck(
      contextWith(snapshot({ "x-aspnet-version": "4.0.30319" })),
    );

    expect(result.status).toBe("warning");
    expect(result.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "x-aspnet-version" }),
      ]),
    );
  });

  it("passes cleanly when no server headers are present at all", async () => {
    const result = await runServerHeadersCheck(contextWith(snapshot({})));

    expect(result.status).toBe("pass");
    expect(result.data?.hasInfoLeak).toBe(false);
  });
});
