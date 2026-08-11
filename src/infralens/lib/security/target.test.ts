import { describe, expect, it } from "vitest";
import { InvalidTargetError } from "./errors";
import { normalizeTarget } from "./target";

describe("normalizeTarget — accepted formats (§7.1)", () => {
  it.each([
    ["example.com", "https://example.com/", "example.com"],
    ["www.example.com", "https://www.example.com/", "www.example.com"],
    ["https://example.com", "https://example.com/", "example.com"],
    ["http://example.com", "http://example.com/", "example.com"],
    [
      "https://example.com/some/public/path",
      "https://example.com/some/public/path",
      "example.com",
    ],
    ["  example.com  ", "https://example.com/", "example.com"],
  ])("normalizes %s", (input, expectedUrl, expectedHostname) => {
    const result = normalizeTarget(input);

    expect(result.url).toBe(expectedUrl);
    expect(result.hostname).toBe(expectedHostname);
  });

  it("canonicalizes an alternate IPv4 notation via the URL parser", () => {
    const result = normalizeTarget("127.1");

    expect(result.hostname).toBe("127.0.0.1");
  });
});

describe("normalizeTarget — rejections", () => {
  it("rejects an empty target", () => {
    expect(() => normalizeTarget("   ")).toThrow(InvalidTargetError);
  });

  it.each([
    "file:///etc/passwd",
    "ftp://example.com",
    "data:text/html,x",
    "gopher://example.com",
    "ws://example.com",
    "wss://example.com",
  ])("rejects the %s protocol", (input) => {
    expect(() => normalizeTarget(input)).toThrow(InvalidTargetError);
  });

  it("rejects a URL with a username/password", () => {
    expect(() => normalizeTarget("https://user:password@example.com")).toThrow(
      InvalidTargetError,
    );
  });

  it.each([
    "https://example.com:8443",
    "http://example.com:8080",
    "https://example.com:22",
  ])("rejects a non-default port (%s)", (input) => {
    expect(() => normalizeTarget(input)).toThrow(InvalidTargetError);
  });

  it.each(["https://example.com:443", "http://example.com:80"])(
    "allows an explicit default port (%s)",
    (input) => {
      expect(() => normalizeTarget(input)).not.toThrow();
    },
  );
});

describe("normalizeTarget — normalization details", () => {
  it("drops the fragment", () => {
    const result = normalizeTarget("https://example.com/page#section");

    expect(result.url).toBe("https://example.com/page");
  });

  it("keeps the query string", () => {
    const result = normalizeTarget("https://example.com/search?q=test");

    expect(result.url).toBe("https://example.com/search?q=test");
  });
});
