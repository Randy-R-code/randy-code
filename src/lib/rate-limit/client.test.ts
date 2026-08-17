import { describe, expect, it } from "vitest";
import { parseCredentials } from "./client";

describe("parseCredentials", () => {
  it("returns null when both vars are missing", () => {
    expect(parseCredentials({})).toBeNull();
  });

  it("returns null when only the URL is set", () => {
    expect(
      parseCredentials({
        UPSTASH_REDIS_REST_URL: "https://example.upstash.io",
      }),
    ).toBeNull();
  });

  it("returns null when only the token is set", () => {
    expect(parseCredentials({ UPSTASH_REDIS_REST_TOKEN: "secret" })).toBeNull();
  });

  it("returns both values when both vars are set", () => {
    expect(
      parseCredentials({
        UPSTASH_REDIS_REST_URL: "https://example.upstash.io",
        UPSTASH_REDIS_REST_TOKEN: "secret",
      }),
    ).toEqual({ url: "https://example.upstash.io", token: "secret" });
  });
});
