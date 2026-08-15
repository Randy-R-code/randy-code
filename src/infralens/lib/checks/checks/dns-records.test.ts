import { beforeEach, describe, expect, it, vi } from "vitest";
import { PageSnapshot } from "../collect";

const { resolveCAA, resolveCNAME, resolveMX, resolveNS, resolveTXT } =
  vi.hoisted(() => ({
    resolveCAA: vi.fn(),
    resolveCNAME: vi.fn(),
    resolveMX: vi.fn(),
    resolveNS: vi.fn(),
    resolveTXT: vi.fn(),
  }));

vi.mock("@infralens-lib/dns/dns-client", () => ({
  resolveCAA,
  resolveCNAME,
  resolveMX,
  resolveNS,
  resolveTXT,
}));

const { runDnsRecordsCheck } = await import("./dns-records");

const empty = { success: false, durationMs: 1 };
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
  a: string[] = ["93.184.216.34"],
  aaaa: string[] = [],
  page: PageSnapshot | null = reachablePage,
) {
  return {
    url: "https://example.com",
    hostname: "example.com",
    timeout: 1000,
    shared: { page, dns: { a, aaaa, durationMs: 0 } },
  };
}

beforeEach(() => {
  resolveCAA.mockReset().mockResolvedValue({ type: "CAA", ...empty });
  resolveCNAME.mockReset().mockResolvedValue({ type: "CNAME", ...empty });
  resolveMX.mockReset().mockResolvedValue({ type: "MX", ...empty });
  resolveNS.mockReset().mockResolvedValue({ type: "NS", ...empty });
  resolveTXT.mockReset().mockResolvedValue({ type: "TXT", ...empty });
});

describe("runDnsRecordsCheck", () => {
  it("includes CAA records in data and evidence when present", async () => {
    resolveCAA.mockResolvedValue({
      type: "CAA",
      success: true,
      data: ["issue=letsencrypt.org"],
      durationMs: 1,
    });

    const result = await runDnsRecordsCheck(context());

    expect(result.data?.caa).toEqual(["issue=letsencrypt.org"]);
    expect(result.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "CAA",
          value: "issue=letsencrypt.org",
        }),
      ]),
    );
  });

  it("never fails or warns solely because CAA is absent", async () => {
    const result = await runDnsRecordsCheck(context());

    expect(result.status).toBe("pass");
    expect(result.data?.caa).toEqual([]);
    expect(result.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "CAA",
          value: expect.stringContaining("none"),
        }),
      ]),
    );
  });

  it("still fails when the page is reachable but there are genuinely no DNS records at all", async () => {
    const result = await runDnsRecordsCheck(context([], []));

    expect(result.status).toBe("fail");
  });

  it("returns error instead of fail when no records AND the page itself is unreachable (outage, not a DNS finding)", async () => {
    const result = await runDnsRecordsCheck(context([], [], null));

    expect(result.status).toBe("error");
  });
});
