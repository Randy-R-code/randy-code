import { beforeEach, describe, expect, it, vi } from "vitest";

const { resolveTXT } = vi.hoisted(() => ({ resolveTXT: vi.fn() }));
vi.mock("@infralens-lib/dns/dns-client", () => ({ resolveTXT }));

const { runDnsSecurityCheck } = await import("./dns-security");

function txtOk(...records: string[]) {
  return { type: "TXT" as const, success: true, data: records, durationMs: 1 };
}
const txtEmpty = { type: "TXT" as const, success: false, durationMs: 1 };

function context() {
  return {
    url: "https://example.com",
    hostname: "example.com",
    timeout: 1000,
    shared: { page: null, dns: { a: [], aaaa: [], durationMs: 0 } },
  };
}

beforeEach(() => {
  resolveTXT.mockReset();
});

describe("runDnsSecurityCheck", () => {
  it("passes when SPF and DMARC are both present", async () => {
    resolveTXT
      .mockResolvedValueOnce(txtOk("v=spf1 include:_spf.example.com ~all"))
      .mockResolvedValueOnce(txtOk("v=DMARC1; p=reject"));

    const result = await runDnsSecurityCheck(context());

    expect(result.status).toBe("pass");
    expect(result.data?.spf).toBe(true);
    expect(result.data?.dmarc).toBe(true);
    expect(result.data?.dmarcPolicy).toBe("reject");
  });

  it("warns when SPF is missing", async () => {
    resolveTXT
      .mockResolvedValueOnce(txtEmpty)
      .mockResolvedValueOnce(txtOk("v=DMARC1; p=reject"));

    const result = await runDnsSecurityCheck(context());

    expect(result.status).toBe("warning");
    expect(result.summary).toContain("SPF");
    expect(result.recommendation?.id).toBe("missing-dns-security");
  });

  it("flags multiple SPF records as a real RFC 7208 violation", async () => {
    resolveTXT
      .mockResolvedValueOnce(
        txtOk(
          "v=spf1 include:_spf.example.com ~all",
          "v=spf1 include:other.com ~all",
        ),
      )
      .mockResolvedValueOnce(txtOk("v=DMARC1; p=reject"));

    const result = await runDnsSecurityCheck(context());

    expect(result.status).toBe("warning");
    expect(result.data?.spfMultipleRecords).toBe(true);
    expect(result.recommendation?.id).toBe("spf-multiple-records");
  });

  it("warns on a monitor-only DMARC policy (p=none) instead of passing — present isn't the same as enforcing", async () => {
    resolveTXT
      .mockResolvedValueOnce(txtOk("v=spf1 ~all"))
      .mockResolvedValueOnce(txtOk("v=DMARC1; p=none"));

    const result = await runDnsSecurityCheck(context());

    expect(result.data?.dmarc).toBe(true);
    expect(result.data?.dmarcPolicy).toBe("none");
    // The actual bug this test guards against: SPF+DMARC merely *present*
    // (even with DMARC set to monitor-only) used to score a plain "pass".
    expect(result.status).toBe("warning");
    expect(result.recommendation?.id).toBe("dmarc-weak-policy");
  });

  it("returns error when DNS resolution throws", async () => {
    resolveTXT.mockRejectedValue(new Error("DNS down"));

    const result = await runDnsSecurityCheck(context());

    expect(result.status).toBe("error");
  });
});
