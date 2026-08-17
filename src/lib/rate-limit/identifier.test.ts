import { beforeEach, describe, expect, it, vi } from "vitest";

const logWarn = vi.fn();
vi.mock("@infralens-lib/log", () => ({ logWarn }));

const { getClientIdentifier } = await import("./identifier");

describe("getClientIdentifier", () => {
  beforeEach(() => {
    logWarn.mockClear();
  });

  it("prefers the first entry of x-forwarded-for", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.5, 10.0.0.1",
      "x-real-ip": "198.51.100.9",
    });

    expect(getClientIdentifier(headers)).toBe("203.0.113.5");
  });

  it("falls back to x-real-ip when x-forwarded-for is absent", () => {
    const headers = new Headers({ "x-real-ip": "198.51.100.9" });

    expect(getClientIdentifier(headers)).toBe("198.51.100.9");
  });

  it("does not trust cf-connecting-ip — this deployment has no Cloudflare in front of it", () => {
    const headers = new Headers({ "cf-connecting-ip": "203.0.113.5" });

    expect(getClientIdentifier(headers)).toBe("unknown");
  });

  it("falls back to a shared 'unknown' bucket and logs it when no trusted header is present", () => {
    const headers = new Headers();

    expect(getClientIdentifier(headers)).toBe("unknown");
    expect(logWarn).toHaveBeenCalledWith({
      event: "rate_limit_identifier_unknown",
    });
  });
});
