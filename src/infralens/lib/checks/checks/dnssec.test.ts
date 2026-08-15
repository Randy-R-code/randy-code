import { describe, expect, it } from "vitest";
import { runDnssecCheck } from "./dnssec";

function context() {
  return {
    url: "https://example.com",
    hostname: "example.com",
    timeout: 1000,
    shared: { page: null, dns: { a: [], aaaa: [], durationMs: 0 } },
  };
}

describe("runDnssecCheck", () => {
  it("is always inconclusive rather than implying it was checked", async () => {
    const result = await runDnssecCheck(context());

    expect(result.status).toBe("inconclusive");
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
});
