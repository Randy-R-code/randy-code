import { describe, expect, it } from "vitest";
import { parseEnv } from "./env";

describe("parseEnv", () => {
  it("returns all-undefined fields when nothing is set", () => {
    const result = parseEnv({});

    expect(result).toEqual({
      ipapiKey: undefined,
      siteUrl: undefined,
      vercelUrl: undefined,
    });
  });

  it("trims and passes through IPAPI_KEY", () => {
    const result = parseEnv({ IPAPI_KEY: "  secret-key  " });

    expect(result.ipapiKey).toBe("secret-key");
  });

  it("accepts a valid NEXT_PUBLIC_SITE_URL", () => {
    const result = parseEnv({ NEXT_PUBLIC_SITE_URL: "https://infralens.dev" });

    expect(result.siteUrl).toBe("https://infralens.dev");
  });

  it("throws on an invalid NEXT_PUBLIC_SITE_URL", () => {
    expect(() => parseEnv({ NEXT_PUBLIC_SITE_URL: "not-a-url" })).toThrow(
      /NEXT_PUBLIC_SITE_URL/,
    );
  });

  it("passes through VERCEL_URL as-is (it's a bare host, not a full URL)", () => {
    const result = parseEnv({ VERCEL_URL: "my-app.vercel.app" });

    expect(result.vercelUrl).toBe("my-app.vercel.app");
  });
});
