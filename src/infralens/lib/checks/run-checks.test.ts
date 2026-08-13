import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  safeFetch,
  readBodyText,
  resolveA,
  resolveAAAA,
  resolveMX,
  resolveNS,
  resolveTXT,
  resolveCNAME,
  resolveCAA,
  inspectTls,
} = vi.hoisted(() => ({
  safeFetch: vi.fn(),
  readBodyText: vi.fn(),
  resolveA: vi.fn(),
  resolveAAAA: vi.fn(),
  resolveMX: vi.fn(),
  resolveNS: vi.fn(),
  resolveTXT: vi.fn(),
  resolveCNAME: vi.fn(),
  resolveCAA: vi.fn(),
  inspectTls: vi.fn(),
}));

vi.mock("@infralens-lib/security/safe-fetch", () => ({
  safeFetch,
  readBodyText,
}));
vi.mock("@infralens-lib/dns/dns-client", () => ({
  resolveA,
  resolveAAAA,
  resolveMX,
  resolveNS,
  resolveTXT,
  resolveCNAME,
  resolveCAA,
}));
vi.mock("@infralens-lib/security/inspect-tls", () => ({ inspectTls }));

const { runChecks } = await import("./run-checks");

const MAIN_URL = "https://example.com/";

function htmlResponse() {
  return {
    status: 200,
    headers: new Headers({
      "content-security-policy": "default-src 'self'",
      "x-frame-options": "DENY",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      "strict-transport-security": "max-age=63072000",
      server: "nginx",
    }),
  };
}

function notFound() {
  return { status: 404, headers: new Headers() };
}

beforeEach(() => {
  safeFetch.mockReset();
  readBodyText
    .mockReset()
    .mockResolvedValue(
      "<html><head><title>Example</title></head><body></body></html>",
    );
  resolveA.mockReset().mockResolvedValue({
    type: "A",
    success: true,
    data: ["93.184.216.34"],
    durationMs: 1,
  });
  resolveAAAA
    .mockReset()
    .mockResolvedValue({ type: "AAAA", success: false, durationMs: 1 });
  resolveMX
    .mockReset()
    .mockResolvedValue({ type: "MX", success: false, durationMs: 1 });
  resolveNS
    .mockReset()
    .mockResolvedValue({ type: "NS", success: false, durationMs: 1 });
  resolveTXT
    .mockReset()
    .mockResolvedValue({ type: "TXT", success: false, durationMs: 1 });
  resolveCNAME
    .mockReset()
    .mockResolvedValue({ type: "CNAME", success: false, durationMs: 1 });
  resolveCAA
    .mockReset()
    .mockResolvedValue({ type: "CAA", success: false, durationMs: 1 });

  safeFetch.mockImplementation(async (url: string) => {
    return url === MAIN_URL ? htmlResponse() : notFound();
  });

  inspectTls.mockReset().mockResolvedValue({
    protocol: "TLSv1.3",
    issuer: "Test CA",
    validTo: "Jan 1 2030 00:00:00 GMT",
    daysUntilExpiry: 1000,
    authorized: true,
  });
});

describe("runChecks — shared collection dedup", () => {
  it("fetches the main page exactly once across all 18 checks", async () => {
    await runChecks({ url: MAIN_URL, hostname: "example.com", timeout: 1000 });

    const mainPageCalls = safeFetch.mock.calls.filter(
      ([url]) => url === MAIN_URL,
    );
    expect(mainPageCalls).toHaveLength(1);
  });

  it("still produces a result for every one of the 18 checks", async () => {
    const response = await runChecks({
      url: MAIN_URL,
      hostname: "example.com",
      timeout: 1000,
    });

    expect(response.checks).toHaveLength(18);
    const validStatuses = [
      "pass",
      "warning",
      "fail",
      "info",
      "unavailable",
      "error",
    ];
    expect(response.checks.every((c) => validStatuses.includes(c.status))).toBe(
      true,
    );
  });

  it("lets a single check's failure produce a partial result without breaking the rest", async () => {
    // Simulate the shared page collection itself failing outright.
    safeFetch.mockImplementation(async () => {
      throw new Error("network down");
    });

    const response = await runChecks({
      url: MAIN_URL,
      hostname: "example.com",
      timeout: 1000,
    });

    expect(response.checks).toHaveLength(18);
    const headersCheck = response.checks.find((c) => c.id === "headers");
    expect(headersCheck?.status).toBe("error");
    // DNS-only checks are unaffected by the page-fetch failure.
    const dnsCheck = response.checks.find((c) => c.id === "dns-records");
    expect(dnsCheck?.data).toBeDefined();
  });

  it("reuses the shared A record instead of resolving it again for ip-hosting", async () => {
    await runChecks({ url: MAIN_URL, hostname: "example.com", timeout: 1000 });

    // Only the shared collection step resolves A — ip-hosting.ts no longer
    // calls resolveA itself, so this stays at exactly one call.
    expect(resolveA).toHaveBeenCalledTimes(1);
  });
});
