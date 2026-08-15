import { describe, expect, it } from "vitest";
import {
  effectiveBase,
  isSafeExternalUrl,
  resolveMetadataUrl,
} from "../resolve-urls";

describe("resolveMetadataUrl", () => {
  const base = "https://example.com/blog/post";

  it("resolves an absolute path", () => {
    expect(resolveMetadataUrl("/favicon.ico", base)).toBe(
      "https://example.com/favicon.ico",
    );
  });

  it("resolves a relative path against the current path", () => {
    expect(resolveMetadataUrl("images/card.png", base)).toBe(
      "https://example.com/blog/images/card.png",
    );
  });

  it("resolves a parent-relative path", () => {
    expect(resolveMetadataUrl("../card.png", base)).toBe(
      "https://example.com/card.png",
    );
  });

  it("resolves a protocol-relative URL", () => {
    expect(resolveMetadataUrl("//cdn.example.com/card.png", base)).toBe(
      "https://cdn.example.com/card.png",
    );
  });

  it("keeps an already-absolute URL untouched", () => {
    expect(resolveMetadataUrl("https://cdn.example.com/card.png", base)).toBe(
      "https://cdn.example.com/card.png",
    );
  });

  it("returns undefined for empty input", () => {
    expect(resolveMetadataUrl(undefined, base)).toBeUndefined();
    expect(resolveMetadataUrl("", base)).toBeUndefined();
  });

  it("returns undefined instead of throwing on an unresolvable value", () => {
    expect(
      resolveMetadataUrl("javascript:alert(1)", "not a base"),
    ).toBeUndefined();
  });
});

describe("effectiveBase", () => {
  it("honors <base href> when present", () => {
    expect(
      effectiveBase("https://example.com/page", "https://cdn.example.com/"),
    ).toBe("https://cdn.example.com/");
  });

  it("falls back to the final URL when there is no <base href>", () => {
    expect(effectiveBase("https://example.com/page", undefined)).toBe(
      "https://example.com/page",
    );
  });

  it("falls back to the final URL when <base href> is malformed", () => {
    expect(
      effectiveBase("https://example.com/page", "http://exa mple.com"),
    ).toBe("https://example.com/page");
  });
});

describe("isSafeExternalUrl", () => {
  it("allows http and https", () => {
    expect(isSafeExternalUrl("https://example.com")).toBe(true);
    expect(isSafeExternalUrl("http://example.com")).toBe(true);
  });

  it("rejects unsafe schemes", () => {
    expect(isSafeExternalUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeExternalUrl("data:text/html,hi")).toBe(false);
    expect(isSafeExternalUrl("file:///etc/passwd")).toBe(false);
  });

  it("rejects undefined and malformed values", () => {
    expect(isSafeExternalUrl(undefined)).toBe(false);
    expect(isSafeExternalUrl("not a url")).toBe(false);
  });
});
