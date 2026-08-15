import { beforeEach, describe, expect, it, vi } from "vitest";

const { resolveTXT } = vi.hoisted(() => ({ resolveTXT: vi.fn() }));
vi.mock("@infralens-lib/dns/dns-client", () => ({ resolveTXT }));

const { runDkimCheck } = await import("./dkim");

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

describe("runDkimCheck", () => {
  it("is inconclusive, not a failure, when none of the common selectors match", async () => {
    resolveTXT.mockResolvedValue(txtEmpty);

    const result = await runDkimCheck(context());

    expect(result.data?.foundAtCommonSelector).toBe(false);
    // Must never be treated as a confirmed absence/failure — only a
    // handful of guessed selector names are tried.
    expect(result.status).toBe("inconclusive");
    expect(result.recommendation?.id).toBe(
      "dkim-not-found-at-common-selectors",
    );
    expect(result.recommendation?.title).not.toMatch(/missing/i);
  });

  it("passes when a common selector matches", async () => {
    resolveTXT
      .mockResolvedValueOnce(txtOk("v=DKIM1; k=rsa; p=abc123"))
      .mockResolvedValue(txtEmpty);

    const result = await runDkimCheck(context());

    expect(result.status).toBe("pass");
    expect(result.data?.foundAtCommonSelector).toBe(true);
    expect(result.data?.selector).toBe("default");
    expect(result.recommendation).toBeUndefined();
  });

  it("returns error when DNS resolution throws", async () => {
    resolveTXT.mockRejectedValue(new Error("DNS down"));

    const result = await runDkimCheck(context());

    expect(result.status).toBe("error");
  });
});
