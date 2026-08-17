import { beforeEach, describe, expect, it, vi } from "vitest";
import type { WebhookEndpoint, WebhookEvent } from "./types";

vi.mock("nanoid", () => ({ nanoid: () => "fixed-token" }));

const redis = {
  set: vi.fn(),
  get: vi.fn(),
  lpush: vi.fn(),
  lrange: vi.fn(),
  ltrim: vi.fn(),
  expire: vi.fn(),
};

async function freshStore(getRedisImpl: () => unknown) {
  vi.resetModules();
  vi.doMock("@/lib/rate-limit/client", () => ({ getRedis: getRedisImpl }));
  return import("./store");
}

function endpoint(overrides: Partial<WebhookEndpoint> = {}): WebhookEndpoint {
  return {
    token: "fixed-token",
    createdAt: 1_700_000_000_000,
    expiresAt: 1_700_000_000_000 + 24 * 60 * 60 * 1000,
    ...overrides,
  };
}

function event(overrides: Partial<WebhookEvent> = {}): WebhookEvent {
  return {
    id: "event-1",
    method: "POST",
    timestamp: 1_700_000_000_000,
    sizeBytes: 12,
    path: "/",
    query: {},
    headers: { "content-type": "application/json" },
    bodyText: '{"a":1}',
    isBinary: false,
    ...overrides,
  };
}

beforeEach(() => {
  redis.set.mockReset().mockResolvedValue("OK");
  redis.get.mockReset();
  redis.lpush.mockReset().mockResolvedValue(1);
  redis.lrange.mockReset().mockResolvedValue([]);
  redis.ltrim.mockReset().mockResolvedValue("OK");
  redis.expire.mockReset().mockResolvedValue(1);
});

describe("when Upstash isn't configured", () => {
  it("every function returns an empty/null result instead of throwing", async () => {
    const {
      createEndpoint,
      getEndpointMeta,
      appendEvent,
      listEvents,
      getEvent,
    } = await freshStore(() => null);

    expect(await createEndpoint()).toBeNull();
    expect(await getEndpointMeta("t")).toBeNull();
    expect(await appendEvent("t", event())).toBe(false);
    expect(await listEvents("t")).toEqual([]);
    expect(await getEvent("t", "e")).toBeNull();
  });
});

describe("createEndpoint", () => {
  it("stores the endpoint with a TTL matching its lifetime and returns it", async () => {
    const { createEndpoint } = await freshStore(() => redis);

    const result = await createEndpoint();

    expect(result?.token).toBe("fixed-token");
    expect(result?.expiresAt).toBe(
      (result?.createdAt ?? 0) + 24 * 60 * 60 * 1000,
    );
    expect(redis.set).toHaveBeenCalledWith(
      "api-studio:webhook:fixed-token:meta",
      expect.objectContaining({ token: "fixed-token" }),
      { ex: 24 * 60 * 60 },
    );
  });
});

describe("getEndpointMeta", () => {
  it("returns null for a missing (or expired) endpoint", async () => {
    redis.get.mockResolvedValue(null);
    const { getEndpointMeta } = await freshStore(() => redis);

    expect(await getEndpointMeta("unknown")).toBeNull();
  });

  it("passes through a stored endpoint", async () => {
    redis.get.mockResolvedValue(endpoint());
    const { getEndpointMeta } = await freshStore(() => redis);

    expect(await getEndpointMeta("fixed-token")).toEqual(endpoint());
  });
});

describe("appendEvent", () => {
  it("returns false without writing anything when the endpoint doesn't exist", async () => {
    redis.get.mockResolvedValue(null); // getEndpointMeta lookup
    const { appendEvent } = await freshStore(() => redis);

    const result = await appendEvent("dead-token", event());

    expect(result).toBe(false);
    expect(redis.set).not.toHaveBeenCalled();
    expect(redis.lpush).not.toHaveBeenCalled();
  });

  it("stores the event, pushes its id, and trims the list to the max event count", async () => {
    const now = 1_700_000_000_000;
    vi.useFakeTimers();
    vi.setSystemTime(now);
    redis.get.mockResolvedValue(endpoint({ expiresAt: now + 3600_000 })); // 1h left

    const { appendEvent } = await freshStore(() => redis);
    const result = await appendEvent("fixed-token", event({ id: "event-1" }));

    expect(result).toBe(true);
    expect(redis.set).toHaveBeenCalledWith(
      "api-studio:webhook:fixed-token:event:event-1",
      expect.objectContaining({ id: "event-1" }),
      { ex: 3600 },
    );
    expect(redis.lpush).toHaveBeenCalledWith(
      "api-studio:webhook:fixed-token:events",
      "event-1",
    );
    expect(redis.expire).toHaveBeenCalledWith(
      "api-studio:webhook:fixed-token:events",
      3600,
    );
    expect(redis.ltrim).toHaveBeenCalledWith(
      "api-studio:webhook:fixed-token:events",
      0,
      49,
    );
    vi.useRealTimers();
  });
});

describe("listEvents", () => {
  it("returns an empty array when the endpoint has no events", async () => {
    redis.lrange.mockResolvedValue([]);
    const { listEvents } = await freshStore(() => redis);

    expect(await listEvents("fixed-token")).toEqual([]);
    expect(redis.get).not.toHaveBeenCalled();
  });

  it("returns lightweight summaries, newest first, skipping any evicted event lookup", async () => {
    redis.lrange.mockResolvedValue(["event-2", "event-1"]);
    redis.get
      .mockResolvedValueOnce(event({ id: "event-2", method: "POST" }))
      .mockResolvedValueOnce(null); // evicted between the id lookup and the event lookup

    const { listEvents } = await freshStore(() => redis);
    const result = await listEvents("fixed-token");

    expect(result).toEqual([
      {
        id: "event-2",
        method: "POST",
        timestamp: expect.any(Number),
        sizeBytes: 12,
      },
    ]);
  });
});

describe("getEvent", () => {
  it("returns null when the event doesn't exist", async () => {
    redis.get.mockResolvedValue(null);
    const { getEvent } = await freshStore(() => redis);

    expect(await getEvent("fixed-token", "missing")).toBeNull();
  });

  it("passes through a stored event", async () => {
    redis.get.mockResolvedValue(event());
    const { getEvent } = await freshStore(() => redis);

    expect(await getEvent("fixed-token", "event-1")).toEqual(event());
  });
});
