import { describe, expect, it } from "vitest";
import { CollectedContext, PageSnapshot } from "../collect";
import { runHeadersCheck } from "./headers";

function snapshot(headers: Record<string, string>): PageSnapshot {
  return {
    finalUrl: "https://example.com/",
    redirectChain: [{ url: "https://example.com/", status: 200 }],
    redirectCount: 0,
    hasRedirectLoop: false,
    status: 200,
    headers: new Headers(headers) as PageSnapshot["headers"],
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

function omit<T extends Record<string, string>>(
  obj: T,
  key: keyof T,
): Record<string, string> {
  const copy = { ...obj };
  delete copy[key];
  return copy;
}

const STRONG_HEADERS = {
  "content-security-policy": "default-src 'self'",
  "x-frame-options": "DENY",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
  "strict-transport-security": "max-age=63072000",
  "permissions-policy": "geolocation=()",
};

describe("runHeadersCheck", () => {
  it("returns pass when every recommended header is present with a strong value", async () => {
    const context = contextWith(snapshot(STRONG_HEADERS));

    const result = await runHeadersCheck(context);

    expect(result.status).toBe("pass");
    expect(result.data?.missing).toEqual([]);
    expect(result.data?.weak).toEqual([]);
  });

  it("returns warning when some but not all headers are present", async () => {
    const context = contextWith(
      snapshot({ "content-security-policy": "default-src 'self'" }),
    );

    const result = await runHeadersCheck(context);

    expect(result.status).toBe("warning");
    expect(result.data?.present).toContain("Content-Security-Policy");
    expect(result.data?.missing.length).toBeGreaterThan(0);
  });

  it("returns fail (a real finding, not a technical failure) when no headers are present", async () => {
    const context = contextWith(snapshot({}));

    const result = await runHeadersCheck(context);

    expect(result.status).toBe("fail");
    expect(result.data?.missing).toHaveLength(6);
  });

  it("returns error when the shared page collection failed", async () => {
    const context = contextWith(null);

    const result = await runHeadersCheck(context);

    expect(result.status).toBe("error");
    expect(result.summary).toBe("Unable to fetch headers.");
  });

  it("flags a CSP with unsafe-inline as present but weak", async () => {
    const context = contextWith(
      snapshot({
        ...STRONG_HEADERS,
        "content-security-policy":
          "default-src 'self'; script-src 'unsafe-inline'",
      }),
    );

    const result = await runHeadersCheck(context);

    expect(result.status).toBe("warning");
    expect(result.data?.weak).toContain("Content-Security-Policy");
    expect(result.data?.missing).not.toContain("Content-Security-Policy");
  });

  it("flags a wildcard CSP source as weak", async () => {
    const context = contextWith(
      snapshot({
        ...STRONG_HEADERS,
        "content-security-policy": "default-src *",
      }),
    );

    const result = await runHeadersCheck(context);

    expect(result.data?.weak).toContain("Content-Security-Policy");
  });

  it("flags a short HSTS max-age as weak", async () => {
    const context = contextWith(
      snapshot({
        ...STRONG_HEADERS,
        "strict-transport-security": "max-age=60",
      }),
    );

    const result = await runHeadersCheck(context);

    expect(result.data?.weak).toContain("Strict-Transport-Security");
  });

  it("flags Referrer-Policy: unsafe-url as weak", async () => {
    const context = contextWith(
      snapshot({ ...STRONG_HEADERS, "referrer-policy": "unsafe-url" }),
    );

    const result = await runHeadersCheck(context);

    expect(result.data?.weak).toContain("Referrer-Policy");
  });

  it("treats frame-ancestors in the CSP as sufficient framing protection without X-Frame-Options", async () => {
    const context = contextWith(
      snapshot({
        ...omit(STRONG_HEADERS, "x-frame-options"),
        "content-security-policy": "default-src 'self'; frame-ancestors 'none'",
      }),
    );

    const result = await runHeadersCheck(context);

    expect(result.status).toBe("pass");
    expect(result.data?.missing).not.toContain(
      "Framing protection (X-Frame-Options or frame-ancestors)",
    );
  });

  it("reports missing framing protection when neither X-Frame-Options nor frame-ancestors is set", async () => {
    const context = contextWith(
      snapshot(omit(STRONG_HEADERS, "x-frame-options")),
    );

    const result = await runHeadersCheck(context);

    expect(result.data?.missing).toContain(
      "Framing protection (X-Frame-Options or frame-ancestors)",
    );
  });

  it("requires Permissions-Policy as a newly-checked header", async () => {
    const context = contextWith(
      snapshot(omit(STRONG_HEADERS, "permissions-policy")),
    );

    const result = await runHeadersCheck(context);

    expect(result.data?.missing).toContain("Permissions-Policy");
  });
});
