import { beforeEach, describe, expect, it, vi } from "vitest";

const checkRateLimit = vi.fn();
const createEndpoint = vi.fn();
const listEvents = vi.fn();
const getEvent = vi.fn();

vi.mock("@/lib/rate-limit", () => ({ checkRateLimit }));
vi.mock("@/lib/rate-limit/identifier", () => ({
  getClientIdentifier: () => "1.2.3.4",
}));
vi.mock("@/api-studio/lib/webhooks/store", () => ({
  createEndpoint,
  listEvents,
  getEvent,
}));

let mockHeaders = new Headers({
  host: "randy-code.dev",
  "x-forwarded-proto": "https",
});
vi.mock("next/headers", () => ({ headers: async () => mockHeaders }));

const { createWebhookEndpoint, listWebhookEvents, getWebhookEvent } =
  await import("./webhooks");

const allowedRateLimit = {
  allowed: true,
  limit: 10,
  remaining: 9,
  resetAt: Date.now() + 3_600_000,
};

beforeEach(() => {
  checkRateLimit.mockReset().mockResolvedValue(allowedRateLimit);
  createEndpoint.mockReset();
  listEvents.mockReset();
  getEvent.mockReset();
  mockHeaders = new Headers({
    host: "randy-code.dev",
    "x-forwarded-proto": "https",
  });
});

describe("createWebhookEndpoint", () => {
  it("returns a rate-limit message and never calls createEndpoint when exceeded", async () => {
    checkRateLimit.mockResolvedValue({
      allowed: false,
      limit: 10,
      remaining: 0,
      resetAt: Date.now() + 30_000,
      reason: "exceeded",
    });

    const result = await createWebhookEndpoint();

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toMatch(/Rate limit exceeded/);
    expect(createEndpoint).not.toHaveBeenCalled();
  });

  it("returns a distinct message on a rate-limit backend error", async () => {
    checkRateLimit.mockResolvedValue({
      allowed: false,
      limit: 10,
      remaining: 0,
      resetAt: Date.now() + 30_000,
      reason: "backend_error",
    });

    const result = await createWebhookEndpoint();

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toMatch(/temporarily unavailable/);
  });

  it("returns 'temporarily unavailable' when storage isn't configured", async () => {
    createEndpoint.mockResolvedValue(null);

    const result = await createWebhookEndpoint();

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toMatch(/temporarily unavailable/);
  });

  it("builds an absolute URL from the request's host and protocol", async () => {
    createEndpoint.mockResolvedValue({
      token: "tok123",
      createdAt: 1_700_000_000_000,
      expiresAt: 1_700_086_400_000,
    });

    const result = await createWebhookEndpoint();

    expect(result).toEqual({
      ok: true,
      data: {
        token: "tok123",
        url: "https://randy-code.dev/api/api-studio/webhooks/tok123",
        expiresAt: 1_700_086_400_000,
      },
    });
  });

  it("defaults to https when x-forwarded-proto is absent (e.g. local dev without a proxy)", async () => {
    mockHeaders = new Headers({ host: "localhost:3000" });
    createEndpoint.mockResolvedValue({
      token: "tok123",
      createdAt: 0,
      expiresAt: 0,
    });

    const result = await createWebhookEndpoint();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.url).toBe(
        "https://localhost:3000/api/api-studio/webhooks/tok123",
      );
    }
  });
});

describe("listWebhookEvents", () => {
  it("passes through to the store", async () => {
    const summaries = [
      { id: "e1", method: "POST", timestamp: 1, sizeBytes: 2 },
    ];
    listEvents.mockResolvedValue(summaries);

    expect(await listWebhookEvents("tok")).toBe(summaries);
    expect(listEvents).toHaveBeenCalledWith("tok");
  });
});

describe("getWebhookEvent", () => {
  it("passes through to the store, including a null result", async () => {
    getEvent.mockResolvedValue(null);

    expect(await getWebhookEvent("tok", "missing")).toBeNull();
    expect(getEvent).toHaveBeenCalledWith("tok", "missing");
  });
});
