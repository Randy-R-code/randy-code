import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  resolveA,
  resolveAAAA,
  mockFetch,
  checkRateLimit,
  acquireConcurrencySlot,
} = vi.hoisted(() => ({
  resolveA: vi.fn(),
  resolveAAAA: vi.fn(),
  mockFetch: vi.fn(),
  checkRateLimit: vi.fn(),
  acquireConcurrencySlot: vi.fn(),
}));

// DNS + undici fetch mocked the same way as safe-fetch.test.ts — the real
// SSRF stack (normalizeTarget -> resolveValidatedTarget -> safeFetch) runs
// unmocked here, so this file is a genuine integration test of the route
// handler down through InfraLens's shared validation, not just this file's
// own glue.
vi.mock("@infralens-lib/dns/dns-client", () => ({ resolveA, resolveAAAA }));
vi.mock("undici", async (importOriginal) => {
  const actual = await importOriginal<typeof import("undici")>();
  return { ...actual, fetch: mockFetch };
});

vi.mock("@/lib/rate-limit", () => ({ checkRateLimit }));
vi.mock("@/lib/rate-limit/concurrency", () => ({ acquireConcurrencySlot }));

const { POST } = await import("./route");

function dnsOk(...addresses: string[]) {
  return { type: "A" as const, success: true, data: addresses, durationMs: 1 };
}
const noAaaa = { type: "AAAA" as const, success: false, durationMs: 1 };

function buildRequest(body: unknown, rawBody?: string): Request {
  return new Request("http://localhost/api/api-studio/request", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "1.2.3.4",
    },
    body: rawBody ?? JSON.stringify(body),
  });
}

const allowedRateLimit = {
  allowed: true,
  limit: 20,
  remaining: 19,
  resetAt: Date.now() + 60_000,
};

beforeEach(() => {
  resolveA.mockReset();
  resolveAAAA.mockReset();
  mockFetch.mockReset();
  checkRateLimit.mockReset().mockResolvedValue(allowedRateLimit);
  acquireConcurrencySlot.mockReset().mockResolvedValue({
    result: { allowed: true, limit: 4 },
    release: vi.fn(),
  });
});

describe("POST /api/api-studio/request — gates run before any outbound attempt", () => {
  it("returns 429 and never touches the network when rate-limited", async () => {
    checkRateLimit.mockResolvedValue({
      allowed: false,
      limit: 20,
      remaining: 0,
      resetAt: Date.now() + 30_000,
      reason: "exceeded",
    });

    const response = await POST(
      buildRequest({ method: "GET", url: "https://example.com" }),
    );
    const json = await response.json();

    expect(response.status).toBe(429);
    expect(json).toMatchObject({ ok: false, kind: "rate_limited" });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns 429 and never touches the network when the concurrency slot is denied", async () => {
    acquireConcurrencySlot.mockResolvedValue({
      result: { allowed: false, limit: 4 },
      release: vi.fn(),
    });

    const response = await POST(
      buildRequest({ method: "GET", url: "https://example.com" }),
    );
    const json = await response.json();

    expect(response.status).toBe(429);
    expect(json).toMatchObject({ ok: false, kind: "rate_limited" });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns 400 for a malformed JSON body", async () => {
    const response = await POST(buildRequest(undefined, "{not json"));
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toMatchObject({ ok: false, kind: "invalid_config" });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns 400 for a config missing a required field", async () => {
    const response = await POST(buildRequest({ method: "GET" }));
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toMatchObject({ ok: false, kind: "invalid_config" });
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

describe("POST /api/api-studio/request — real outbound flow", () => {
  beforeEach(() => {
    resolveA.mockResolvedValue(dnsOk("93.184.216.34"));
    resolveAAAA.mockResolvedValue(noAaaa);
  });

  it("executes a real GET end-to-end and returns a normalized response", async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ hello: "world" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const response = await POST(
      buildRequest({ method: "GET", url: "https://example.com/api" }),
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toMatchObject({ ok: true, status: 200 });
    expect(json.bodyText).toBe(JSON.stringify({ hello: "world" }));
  });

  it("blocks a loopback destination without ever calling fetch", async () => {
    const response = await POST(
      buildRequest({ method: "GET", url: "http://127.0.0.1/admin" }),
    );
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toMatchObject({ ok: false, kind: "blocked_destination" });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("blocks a redirect from a public host to a private target (SSRF regression)", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(null, {
        status: 302,
        headers: { location: "http://127.0.0.1/internal" },
      }),
    );

    const response = await POST(
      buildRequest({ method: "GET", url: "https://example.com/" }),
    );
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toMatchObject({ ok: false, kind: "blocked_destination" });
    expect(mockFetch).toHaveBeenCalledTimes(1); // only the legitimate first hop
  });

  it("releases the concurrency slot after a successful request", async () => {
    const release = vi.fn();
    acquireConcurrencySlot.mockResolvedValue({
      result: { allowed: true, limit: 4 },
      release,
    });
    mockFetch.mockResolvedValue(new Response("ok", { status: 200 }));

    await POST(buildRequest({ method: "GET", url: "https://example.com/" }));

    expect(release).toHaveBeenCalledTimes(1);
  });

  it("releases the concurrency slot even when the request is blocked", async () => {
    const release = vi.fn();
    acquireConcurrencySlot.mockResolvedValue({
      result: { allowed: true, limit: 4 },
      release,
    });

    await POST(buildRequest({ method: "GET", url: "http://127.0.0.1/" }));

    expect(release).toHaveBeenCalledTimes(1);
  });
});
