import { describe, expect, it } from "vitest";
import { parseEnv } from "./env";

describe("parseEnv", () => {
  it("returns all-undefined fields when nothing is set", () => {
    const result = parseEnv({});

    expect(result).toEqual({
      ipapiKey: undefined,
    });
  });

  it("trims and passes through IPAPI_KEY", () => {
    const result = parseEnv({ IPAPI_KEY: "  secret-key  " });

    expect(result.ipapiKey).toBe("secret-key");
  });
});
