import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  BlockedTargetError,
  InvalidTargetError,
  RedirectLimitError,
  ResponseTooLargeError,
} from "./errors";
import { readBodyText, safeFetch } from "./safe-fetch";

const { resolveA, resolveAAAA, mockFetch } = vi.hoisted(() => ({
  resolveA: vi.fn(),
  resolveAAAA: vi.fn(),
  mockFetch: vi.fn(),
}));

vi.mock("@infralens-lib/dns/dns-client", () => ({ resolveA, resolveAAAA }));

// Keep the real `Agent` (a pinned dispatcher still gets constructed and
// passed to `fetch` on every call) but replace undici's `fetch` itself —
// `safeFetch` deliberately calls undici's own `fetch`, not the Node
// global one (see safe-fetch.ts's `fetchOnce` comment), so that's the
// seam to mock here.
vi.mock("undici", async (importOriginal) => {
  const actual = await importOriginal<typeof import("undici")>();
  return { ...actual, fetch: mockFetch };
});

function dnsOk(...addresses: string[]) {
  return { type: "A" as const, success: true, data: addresses, durationMs: 1 };
}

const noAaaa = { type: "AAAA" as const, success: false, durationMs: 1 };

beforeEach(() => {
  mockFetch.mockReset();
  resolveA.mockReset();
  resolveAAAA.mockReset();
});

describe("safeFetch — blocks before ever attempting a connection", () => {
  it("rejects a loopback target without ever calling fetch", async () => {
    await expect(safeFetch("http://127.0.0.1/")).rejects.toThrow(
      BlockedTargetError,
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("rejects the same target reached via alternate loopback notation (127.1)", async () => {
    await expect(safeFetch("http://127.1/")).rejects.toThrow(
      BlockedTargetError,
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("rejects a bracketed IPv6 loopback target", async () => {
    await expect(safeFetch("http://[::1]/")).rejects.toThrow(
      BlockedTargetError,
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("rejects a cloud metadata target", async () => {
    await expect(safeFetch("http://169.254.169.254/")).rejects.toThrow(
      BlockedTargetError,
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

describe("safeFetch — redirect chain revalidation (§8.5, §22.3)", () => {
  beforeEach(() => {
    resolveA.mockResolvedValue(dnsOk("93.184.216.34"));
    resolveAAAA.mockResolvedValue(noAaaa);
  });

  it("follows a redirect to another public host and returns the final response", async () => {
    mockFetch
      .mockResolvedValueOnce(
        new Response(null, {
          status: 302,
          headers: { location: "https://other-public.example/" },
        }),
      )
      .mockResolvedValueOnce(new Response("final page", { status: 200 }));

    const response = await safeFetch("https://example.com/");

    expect(await response.text()).toBe("final page");
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("blocks a redirect from a public host to a private target, without connecting to it", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(null, {
        status: 302,
        headers: { location: "http://127.0.0.1/internal" },
      }),
    );

    await expect(safeFetch("https://example.com/")).rejects.toThrow(
      BlockedTargetError,
    );
    // Only the first (legitimate) hop actually reached `fetch`.
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("blocks a redirect to a forbidden protocol, without connecting to it", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(null, {
        status: 302,
        headers: { location: "file:///etc/passwd" },
      }),
    );

    await expect(safeFetch("https://example.com/")).rejects.toThrow(
      InvalidTargetError,
    );
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("stops after MAX_SAFE_REDIRECTS hops", async () => {
    mockFetch.mockImplementation(
      async () =>
        new Response(null, {
          status: 302,
          headers: { location: "https://example.com/next" },
        }),
    );

    await expect(safeFetch("https://example.com/")).rejects.toThrow(
      RedirectLimitError,
    );
  });

  it("does not follow redirects when redirect: 'manual' is requested (used by the redirects check)", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(null, {
        status: 302,
        headers: { location: "https://other-public.example/" },
      }),
    );

    const response = await safeFetch("https://example.com/", {
      redirect: "manual",
    });

    expect(response.status).toBe(302);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

function streamOf(...chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
}

describe("readBodyText", () => {
  it("returns the full body when under the limit", async () => {
    const response = new Response(streamOf("hello ", "world"));

    await expect(readBodyText(response, 1000)).resolves.toBe("hello world");
  });

  it("throws once the streamed size exceeds maxBytes, without buffering further", async () => {
    const response = new Response(streamOf("a".repeat(50), "b".repeat(50)));

    await expect(readBodyText(response, 60)).rejects.toThrow(
      ResponseTooLargeError,
    );
  });

  it("returns an empty string when there is no body", async () => {
    const response = new Response(null);

    await expect(readBodyText(response, 1000)).resolves.toBe("");
  });
});
