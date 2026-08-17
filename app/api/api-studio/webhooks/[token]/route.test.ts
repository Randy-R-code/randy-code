import { beforeEach, describe, expect, it, vi } from "vitest";

const getEndpointMeta = vi.fn();
const appendEvent = vi.fn();
const checkRateLimit = vi.fn();

vi.mock("@/api-studio/lib/webhooks/store", () => ({
  getEndpointMeta,
  appendEvent,
}));
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit }));
vi.mock("nanoid", () => ({ nanoid: () => "event-id" }));

const { GET, POST } = await import("./route");

function ctx(token = "tok"): { params: Promise<{ token: string }> } {
  return { params: Promise.resolve({ token }) };
}

const liveEndpoint = {
  token: "tok",
  createdAt: Date.now(),
  expiresAt: Date.now() + 3600_000,
};

beforeEach(() => {
  getEndpointMeta.mockReset().mockResolvedValue(liveEndpoint);
  appendEvent.mockReset().mockResolvedValue(true);
  checkRateLimit.mockReset().mockResolvedValue({
    allowed: true,
    limit: 60,
    remaining: 59,
    resetAt: Date.now() + 60_000,
  });
});

describe("webhook ingestion route", () => {
  it("returns a generic 404 for a missing or expired token, without checking the rate limit", async () => {
    getEndpointMeta.mockResolvedValue(null);

    const response = await POST(
      new Request("https://randy-code.dev/api/api-studio/webhooks/dead"),
      ctx("dead"),
    );

    expect(response.status).toBe(404);
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(appendEvent).not.toHaveBeenCalled();
  });

  it("returns 429 without storing anything when rate-limited", async () => {
    checkRateLimit.mockResolvedValue({
      allowed: false,
      limit: 60,
      remaining: 0,
      resetAt: Date.now() + 1000,
      reason: "exceeded",
    });

    const response = await POST(
      new Request("https://randy-code.dev/api/api-studio/webhooks/tok", {
        method: "POST",
        body: "{}",
      }),
      ctx(),
    );

    expect(response.status).toBe(429);
    expect(appendEvent).not.toHaveBeenCalled();
  });

  it("returns 413 for an oversized body without storing anything", async () => {
    const response = await POST(
      new Request("https://randy-code.dev/api/api-studio/webhooks/tok", {
        method: "POST",
        headers: { "content-type": "text/plain" },
        body: "a".repeat(300 * 1024), // over WEBHOOK_MAX_BODY_BYTES (256 KB)
      }),
      ctx(),
    );

    expect(response.status).toBe(413);
    expect(appendEvent).not.toHaveBeenCalled();
  });

  it("captures method, query, headers and body, and returns 200", async () => {
    const response = await POST(
      new Request(
        "https://randy-code.dev/api/api-studio/webhooks/tok/?a=1&b=2",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-webhook-signature": "abc123",
          },
          body: '{"hello":"world"}',
        },
      ),
      ctx(),
    );

    expect(response.status).toBe(200);
    expect(appendEvent).toHaveBeenCalledWith(
      "tok",
      expect.objectContaining({
        id: "event-id",
        method: "POST",
        query: { a: "1", b: "2" },
        headers: expect.objectContaining({
          "x-webhook-signature": "abc123",
        }),
        bodyText: '{"hello":"world"}',
        isBinary: false,
      }),
    );
  });

  it("routes GET through the same handler", async () => {
    const response = await GET(
      new Request("https://randy-code.dev/api/api-studio/webhooks/tok"),
      ctx(),
    );

    expect(response.status).toBe(200);
    expect(appendEvent).toHaveBeenCalledWith(
      "tok",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("returns a generic 404 if the endpoint expires between the check and the write", async () => {
    appendEvent.mockResolvedValue(false);

    const response = await POST(
      new Request("https://randy-code.dev/api/api-studio/webhooks/tok", {
        method: "POST",
      }),
      ctx(),
    );

    expect(response.status).toBe(404);
  });

  it("caps the number of stored headers", async () => {
    const headers = new Headers();
    for (let i = 0; i < 60; i++) headers.set(`x-h${i}`, "v");

    await POST(
      new Request("https://randy-code.dev/api/api-studio/webhooks/tok", {
        method: "POST",
        headers,
      }),
      ctx(),
    );

    const [, event] = appendEvent.mock.calls[0];
    expect(Object.keys(event.headers).length).toBeLessThanOrEqual(50);
  });
});
