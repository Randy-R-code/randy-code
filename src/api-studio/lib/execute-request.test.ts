import {
  BlockedTargetError,
  InvalidTargetError,
} from "@infralens-lib/security/errors";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RequestConfig } from "./types";

const { normalizeTarget, safeFetch } = vi.hoisted(() => ({
  normalizeTarget: vi.fn(),
  safeFetch: vi.fn(),
}));
vi.mock("@infralens-lib/security/target", () => ({ normalizeTarget }));
vi.mock("@infralens-lib/security/safe-fetch", () => ({ safeFetch }));

const { executeRequest, parseRequestConfig } =
  await import("./execute-request");

const baseConfig: RequestConfig = {
  method: "GET",
  url: "https://example.com/",
  headers: {},
};

beforeEach(() => {
  normalizeTarget.mockReset().mockImplementation((url: string) => ({
    url,
    hostname: "example.com",
    protocol: "https:",
  }));
  safeFetch.mockReset();
});

describe("parseRequestConfig", () => {
  it("accepts a minimal valid config, defaulting headers to {}", () => {
    const result = parseRequestConfig({
      method: "GET",
      url: "https://example.com",
    });

    expect(result).toEqual({
      method: "GET",
      url: "https://example.com",
      headers: {},
      body: undefined,
    });
  });

  it("rejects a non-object body", () => {
    expect(parseRequestConfig("nope")).toHaveProperty("error");
    expect(parseRequestConfig(null)).toHaveProperty("error");
  });

  it("rejects an unsupported method", () => {
    expect(
      parseRequestConfig({ method: "TRACE", url: "https://example.com" }),
    ).toHaveProperty("error");
  });

  it("rejects a missing url", () => {
    expect(parseRequestConfig({ method: "GET" })).toHaveProperty("error");
  });

  it("rejects headers that aren't a flat object of strings", () => {
    expect(
      parseRequestConfig({
        method: "GET",
        url: "https://example.com",
        headers: { "x-test": 1 },
      }),
    ).toHaveProperty("error");
    expect(
      parseRequestConfig({
        method: "GET",
        url: "https://example.com",
        headers: ["not", "an", "object"],
      }),
    ).toHaveProperty("error");
  });

  it("rejects a non-string body", () => {
    expect(
      parseRequestConfig({
        method: "POST",
        url: "https://example.com",
        body: { a: 1 },
      }),
    ).toHaveProperty("error");
  });
});

describe("executeRequest — request validation (never reaches safeFetch)", () => {
  it("rejects a header the client can't set manually", async () => {
    const result = await executeRequest(
      { ...baseConfig, headers: { Host: "evil.example" } },
      new AbortController().signal,
    );

    expect(result).toMatchObject({ ok: false, kind: "invalid_config" });
    expect(safeFetch).not.toHaveBeenCalled();
  });

  it("rejects more than the maximum number of headers", async () => {
    const headers = Object.fromEntries(
      Array.from({ length: 51 }, (_, i) => [`x-h${i}`, "v"]),
    );

    const result = await executeRequest(
      { ...baseConfig, headers },
      new AbortController().signal,
    );

    expect(result).toMatchObject({ ok: false, kind: "invalid_config" });
    expect(safeFetch).not.toHaveBeenCalled();
  });

  it("rejects an oversized request body", async () => {
    const result = await executeRequest(
      { ...baseConfig, method: "POST", body: "a".repeat(2 * 1024 * 1024) },
      new AbortController().signal,
    );

    expect(result).toMatchObject({ ok: false, kind: "invalid_config" });
    expect(safeFetch).not.toHaveBeenCalled();
  });
});

describe("executeRequest — target validation", () => {
  it("maps a BlockedTargetError to blocked_destination", async () => {
    normalizeTarget.mockImplementation(() => {
      throw new BlockedTargetError("blocked", "This target is blocked.");
    });

    const result = await executeRequest(
      baseConfig,
      new AbortController().signal,
    );

    expect(result).toEqual({
      ok: false,
      kind: "blocked_destination",
      message: "This target is blocked.",
    });
  });

  it("maps an InvalidTargetError to invalid_config", async () => {
    normalizeTarget.mockImplementation(() => {
      throw new InvalidTargetError("bad", "This isn't a valid URL.");
    });

    const result = await executeRequest(
      baseConfig,
      new AbortController().signal,
    );

    expect(result).toEqual({
      ok: false,
      kind: "invalid_config",
      message: "This isn't a valid URL.",
    });
  });
});

describe("executeRequest — response normalization", () => {
  it("returns a normalized response, stripping hop-by-hop headers and recomputing content-length", async () => {
    const payload = JSON.stringify({ ok: true });
    safeFetch.mockResolvedValue(
      new Response(payload, {
        status: 201,
        statusText: "Created",
        headers: {
          "content-type": "application/json",
          "content-length": "999", // deliberately wrong — must be recomputed
          connection: "keep-alive",
        },
      }),
    );

    const result = await executeRequest(
      baseConfig,
      new AbortController().signal,
    );

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected ok result");
    expect(result.status).toBe(201);
    expect(result.isBinary).toBe(false);
    expect(result.bodyText).toBe(payload);
    expect(result.headers.connection).toBeUndefined();
    expect(Number(result.headers["content-length"])).toBe(result.sizeBytes);
  });

  it("treats a non-text content-type as binary and base64-encodes the body", async () => {
    const bytes = new Uint8Array([0, 1, 2, 3, 255]);
    safeFetch.mockResolvedValue(
      new Response(bytes, {
        status: 200,
        headers: { "content-type": "application/octet-stream" },
      }),
    );

    const result = await executeRequest(
      baseConfig,
      new AbortController().signal,
    );

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected ok result");
    expect(result.isBinary).toBe(true);
    expect(Buffer.from(result.bodyText, "base64")).toEqual(Buffer.from(bytes));
  });

  it("reports a target's 4xx/5xx response as a successful proxy result, not a failure", async () => {
    safeFetch.mockResolvedValue(new Response("not found", { status: 404 }));

    const result = await executeRequest(
      baseConfig,
      new AbortController().signal,
    );

    expect(result).toMatchObject({ ok: true, status: 404 });
  });

  it("caps an oversized response body and reports it as oversized", async () => {
    const chunk = "a".repeat(1024 * 1024); // 1 MB per chunk, 6 MB total > 5 MB cap
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const encoder = new TextEncoder();
        for (let i = 0; i < 6; i++) controller.enqueue(encoder.encode(chunk));
        controller.close();
      },
    });
    safeFetch.mockResolvedValue(new Response(stream, { status: 200 }));

    const result = await executeRequest(
      baseConfig,
      new AbortController().signal,
    );

    expect(result).toMatchObject({ ok: false, kind: "oversized" });
  });
});

describe("executeRequest — timeout and cancellation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function neverResolvingFetch() {
    safeFetch.mockImplementation(
      (_url: string, init: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener("abort", () => {
            const error = new Error("aborted");
            error.name = "AbortError";
            reject(error);
          });
        }),
    );
  }

  it("times out on its own schedule when the target never responds", async () => {
    neverResolvingFetch();

    const promise = executeRequest(baseConfig, new AbortController().signal);
    await vi.advanceTimersByTimeAsync(20_000);

    await expect(promise).resolves.toMatchObject({
      ok: false,
      kind: "timeout",
    });
  });

  it("reports cancellation distinctly when the caller aborts first", async () => {
    neverResolvingFetch();
    const controller = new AbortController();

    const promise = executeRequest(baseConfig, controller.signal);
    controller.abort();

    await expect(promise).resolves.toMatchObject({
      ok: false,
      kind: "internal",
    });
  });
});
