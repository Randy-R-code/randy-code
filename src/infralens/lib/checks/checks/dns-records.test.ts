import { beforeEach, describe, expect, it, vi } from "vitest";

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

function context(a: string[] = ["93.184.216.34"], aaaa: string[] = []) {
  return {
    url: "https://example.com",
    hostname: "example.com",
    timeout: 1000,
    shared: { page: null, dns: { a, aaaa, durationMs: 0 } },
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

  it("still fails when there are genuinely no DNS records at all", async () => {
    const result = await runDnsRecordsCheck(context([], []));

    expect(result.status).toBe("fail");
  });
});
