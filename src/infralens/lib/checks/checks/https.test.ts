import { beforeEach, describe, expect, it, vi } from "vitest";
import { CollectedContext, PageSnapshot } from "../collect";

const { inspectTls } = vi.hoisted(() => ({ inspectTls: vi.fn() }));
vi.mock("@infralens-lib/security/inspect-tls", () => ({ inspectTls }));

const { runHttpsCheck } = await import("./https");

function snapshot(overrides: Partial<PageSnapshot> = {}): PageSnapshot {
  return {
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
    ...overrides,
  };
}

function contextWith(url: string, page: PageSnapshot | null) {
  const shared: CollectedContext = {
    page,
    dns: { a: [], aaaa: [], durationMs: 0 },
  };
  return { url, hostname: "example.com", timeout: 1000, shared };
}

const validTls = {
  protocol: "TLSv1.3",
  issuer: "Test CA",
  validTo: "Jan 1 2030 00:00:00 GMT",
  daysUntilExpiry: 1000,
  authorized: true,
};

beforeEach(() => {
  inspectTls.mockReset().mockResolvedValue(validTls);
});

describe("runHttpsCheck", () => {
  it("returns error when the shared page collection failed", async () => {
    const result = await runHttpsCheck(
      contextWith("https://example.com", null),
    );

    expect(result.status).toBe("error");
  });

  it("fails when HTTPS is unavailable and HTTP does not redirect to HTTPS", async () => {
    const context = contextWith(
      "http://example.com",
      snapshot({ finalUrl: "http://example.com/" }),
    );

    const result = await runHttpsCheck(context);

    expect(result.status).toBe("fail");
    expect(result.data?.httpsAvailable).toBe(false);
    expect(result.data?.httpRedirects).toBe(false);
  });

  it("warns when HTTP redirects to HTTPS but HTTPS was not directly requested", async () => {
    const context = contextWith(
      "http://example.com",
      snapshot({ finalUrl: "https://example.com/" }),
    );

    const result = await runHttpsCheck(context);

    expect(result.status).toBe("warning");
    expect(result.data?.httpRedirects).toBe(true);
  });

  it("passes with strong HSTS and a valid, non-expiring certificate", async () => {
    const context = contextWith(
      "https://example.com",
      snapshot({
        headers: new Headers({
          "strict-transport-security": "max-age=63072000",
        }) as PageSnapshot["headers"],
      }),
    );

    const result = await runHttpsCheck(context);

    expect(result.status).toBe("pass");
    expect(result.recommendation).toBeUndefined();
    expect(result.data?.tlsVersion).toBe("TLSv1.3");
    expect(result.data?.certificateIssuer).toBe("Test CA");
  });

  it("recommends HSTS when missing, without failing the check", async () => {
    const context = contextWith("https://example.com", snapshot());

    const result = await runHttpsCheck(context);

    expect(result.status).toBe("pass");
    expect(result.recommendation?.id).toBe("missing-hsts");
  });

  it("recommends HSTS when the max-age is too short (weak, not just missing)", async () => {
    const context = contextWith(
      "https://example.com",
      snapshot({
        headers: new Headers({
          "strict-transport-security": "max-age=10",
        }) as PageSnapshot["headers"],
      }),
    );

    const result = await runHttpsCheck(context);

    expect(result.recommendation?.id).toBe("missing-hsts");
  });

  it("fails and recommends fixing the certificate when it is not authorized", async () => {
    inspectTls.mockResolvedValue({
      protocol: "TLSv1.2",
      authorized: false,
      authorizationError: "certificate has expired",
    });
    const context = contextWith("https://example.com", snapshot());

    const result = await runHttpsCheck(context);

    expect(result.status).toBe("fail");
    expect(result.recommendation?.id).toBe("invalid-certificate");
  });

  it("warns when the certificate is valid but expiring soon", async () => {
    inspectTls.mockResolvedValue({ ...validTls, daysUntilExpiry: 5 });
    const context = contextWith(
      "https://example.com",
      snapshot({
        headers: new Headers({
          "strict-transport-security": "max-age=63072000",
        }) as PageSnapshot["headers"],
      }),
    );

    const result = await runHttpsCheck(context);

    expect(result.status).toBe("warning");
    expect(result.recommendation?.id).toBe("certificate-expiring-soon");
  });

  it("still returns pass/warning based on HTTPS+HSTS alone when TLS inspection returns null", async () => {
    inspectTls.mockResolvedValue(null);
    const context = contextWith(
      "https://example.com",
      snapshot({
        headers: new Headers({
          "strict-transport-security": "max-age=63072000",
        }) as PageSnapshot["headers"],
      }),
    );

    const result = await runHttpsCheck(context);

    expect(result.status).toBe("pass");
    expect(result.data?.tlsVersion).toBeUndefined();
  });
});
