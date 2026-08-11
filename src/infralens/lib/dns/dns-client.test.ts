import { beforeEach, describe, expect, it, vi } from "vitest";

const { resolveCaa, getCache, setCache } = vi.hoisted(() => ({
  resolveCaa: vi.fn(),
  getCache: vi.fn(),
  setCache: vi.fn(),
}));

vi.mock("dns/promises", () => ({
  resolve4: vi.fn(),
  resolve6: vi.fn(),
  resolveCname: vi.fn(),
  resolveMx: vi.fn(),
  resolveNs: vi.fn(),
  resolveTxt: vi.fn(),
  resolveCaa,
}));
vi.mock("./dns-cache", () => ({ getCache, setCache }));

const { resolveCAA } = await import("./dns-client");

beforeEach(() => {
  resolveCaa.mockReset();
  getCache.mockReset().mockReturnValue(null);
  setCache.mockReset();
});

describe("resolveCAA", () => {
  it("maps CAA records to readable strings", async () => {
    resolveCaa.mockResolvedValue([
      { critical: 0, issue: "letsencrypt.org" },
      { critical: 1, issuewild: ";" },
    ]);

    const result = await resolveCAA("example.com");

    expect(result.success).toBe(true);
    expect(result.type).toBe("CAA");
    expect(result.data).toEqual([
      "issue=letsencrypt.org",
      "critical issuewild=;",
    ]);
  });

  it("reports no data when the domain has no CAA records", async () => {
    resolveCaa.mockRejectedValue(new Error("ENODATA"));

    const result = await resolveCAA("example.com");

    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
  });
});
