import { describe, expect, it } from "vitest";
import { CollectedContext, PageSnapshot } from "../collect";
import { runReachabilityCheck } from "./reachability";

function snapshot(status: number): PageSnapshot {
  return {
    finalUrl: "https://example.com/",
    redirectChain: [{ url: "https://example.com/", status }],
    redirectCount: 0,
    hasRedirectLoop: false,
    status,
    headers: new Headers() as PageSnapshot["headers"],
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

describe("runReachabilityCheck", () => {
  it("uses the reachability id/label, not the old uptime one", async () => {
    const result = await runReachabilityCheck(contextWith(snapshot(200)));

    expect(result.id).toBe("reachability");
    expect(result.label).toBe("Reachability Snapshot");
  });

  it("always documents itself as a point-in-time check, not historical monitoring", async () => {
    const result = await runReachabilityCheck(contextWith(snapshot(200)));

    expect(result.limitations?.[0]).toMatch(/point-in-time/i);
  });

  it("passes on 200", async () => {
    const result = await runReachabilityCheck(contextWith(snapshot(200)));

    expect(result.status).toBe("pass");
    expect(result.data?.reachable).toBe(true);
  });

  it("warns on 4xx", async () => {
    const result = await runReachabilityCheck(contextWith(snapshot(404)));

    expect(result.status).toBe("warning");
  });

  it("fails on 5xx", async () => {
    const result = await runReachabilityCheck(contextWith(snapshot(503)));

    expect(result.status).toBe("fail");
    expect(result.data?.reachable).toBe(false);
  });

  it("returns error when the shared page collection failed", async () => {
    const result = await runReachabilityCheck(contextWith(null));

    expect(result.status).toBe("error");
  });
});
