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
      .mockResolvedValueOnce(txtOk("v=DMARC1; p=reject"))
      .mockResolvedValueOnce(txtEmpty)
      .mockResolvedValueOnce(txtEmpty)
      .mockResolvedValueOnce(txtEmpty)
      .mockResolvedValueOnce(txtEmpty);

    const result = await runDnsSecurityCheck(context());

    expect(result.status).toBe("pass");
    expect(result.data?.spf).toBe(true);
    expect(result.data?.dmarc).toBe(true);
    expect(result.data?.dmarcPolicy).toBe("reject");
  });

  it("warns when SPF is missing", async () => {
    resolveTXT
      .mockResolvedValueOnce(txtEmpty)
      .mockResolvedValueOnce(txtOk("v=DMARC1; p=reject"))
      .mockResolvedValueOnce(txtEmpty)
      .mockResolvedValueOnce(txtEmpty)
      .mockResolvedValueOnce(txtEmpty)
      .mockResolvedValueOnce(txtEmpty);

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
      .mockResolvedValueOnce(txtOk("v=DMARC1; p=reject"))
      .mockResolvedValueOnce(txtEmpty)
      .mockResolvedValueOnce(txtEmpty)
      .mockResolvedValueOnce(txtEmpty)
      .mockResolvedValueOnce(txtEmpty);

    const result = await runDnsSecurityCheck(context());

    expect(result.status).toBe("warning");
    expect(result.data?.spfMultipleRecords).toBe(true);
    expect(result.recommendation?.id).toBe("spf-multiple-records");
  });

  it("surfaces a weak DMARC policy (p=none) without treating DMARC as missing", async () => {
    resolveTXT
      .mockResolvedValueOnce(txtOk("v=spf1 ~all"))
      .mockResolvedValueOnce(txtOk("v=DMARC1; p=none"))
      .mockResolvedValueOnce(txtEmpty)
      .mockResolvedValueOnce(txtEmpty)
      .mockResolvedValueOnce(txtEmpty)
      .mockResolvedValueOnce(txtEmpty);

    const result = await runDnsSecurityCheck(context());

    expect(result.data?.dmarc).toBe(true);
    expect(result.data?.dmarcPolicy).toBe("none");
    expect(result.recommendation?.id).toBe("dmarc-weak-policy");
  });

  it("does not conclude DKIM is missing when none of the common selectors match", async () => {
    resolveTXT
      .mockResolvedValueOnce(txtOk("v=spf1 ~all"))
      .mockResolvedValueOnce(txtOk("v=DMARC1; p=reject"))
      .mockResolvedValueOnce(txtEmpty)
      .mockResolvedValueOnce(txtEmpty)
      .mockResolvedValueOnce(txtEmpty)
      .mockResolvedValueOnce(txtEmpty);

    const result = await runDnsSecurityCheck(context());

    expect(result.data?.dkimFoundAtCommonSelector).toBe(false);
    // Must stay pass — DKIM not found at a guessed selector is not a
    // confirmed finding and must never fail/warn the check on its own.
    expect(result.status).toBe("pass");
    expect(result.recommendation?.id).toBe(
      "dkim-not-found-at-common-selectors",
    );
    expect(result.recommendation?.title).not.toMatch(/missing/i);
  });

  it("reports DKIM found when a common selector matches", async () => {
    resolveTXT
      .mockResolvedValueOnce(txtOk("v=spf1 ~all"))
      .mockResolvedValueOnce(txtOk("v=DMARC1; p=reject"))
      .mockResolvedValueOnce(txtOk("v=DKIM1; k=rsa; p=abc123"))
      .mockResolvedValueOnce(txtEmpty)
      .mockResolvedValueOnce(txtEmpty)
      .mockResolvedValueOnce(txtEmpty);

    const result = await runDnsSecurityCheck(context());

    expect(result.data?.dkimFoundAtCommonSelector).toBe(true);
    expect(result.data?.dkimSelector).toBe("default");
    expect(result.recommendation).toBeUndefined();
  });

  it("marks DNSSEC as not evaluated rather than implying it was checked", async () => {
    resolveTXT.mockResolvedValue(txtEmpty);

    const result = await runDnsSecurityCheck(context());

    expect(result.data?.dnssec).toBe("not-evaluated");
    expect(result.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "DNSSEC",
          value: expect.stringContaining("not evaluated"),
        }),
      ]),
    );
  });

  it("returns error when DNS resolution throws", async () => {
    resolveTXT.mockRejectedValue(new Error("DNS down"));

    const result = await runDnsSecurityCheck(context());

    expect(result.status).toBe("error");
  });
});
