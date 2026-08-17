import { describe, expect, it } from "vitest";
import { applyAuth } from "./auth";

describe("applyAuth", () => {
  it("leaves headers untouched for 'none'", () => {
    expect(applyAuth({ Accept: "*/*" }, { type: "none" })).toEqual({
      Accept: "*/*",
    });
  });

  it("adds a Bearer Authorization header", () => {
    expect(applyAuth({}, { type: "bearer", token: "secret-token" })).toEqual({
      Authorization: "Bearer secret-token",
    });
  });

  it("leaves headers untouched for an empty Bearer token", () => {
    expect(applyAuth({ Accept: "*/*" }, { type: "bearer", token: "" })).toEqual(
      {
        Accept: "*/*",
      },
    );
  });

  it("adds a Basic Authorization header encoded from username:password", () => {
    const result = applyAuth(
      {},
      { type: "basic", username: "ada", password: "lovelace" },
    );

    expect(result.Authorization).toBe(
      `Basic ${Buffer.from("ada:lovelace").toString("base64")}`,
    );
  });

  it("leaves headers untouched when both username and password are empty", () => {
    expect(
      applyAuth(
        { Accept: "*/*" },
        { type: "basic", username: "", password: "" },
      ),
    ).toEqual({ Accept: "*/*" });
  });

  it("does not clobber existing headers", () => {
    const result = applyAuth(
      { "X-Custom": "1" },
      { type: "bearer", token: "t" },
    );

    expect(result).toEqual({ "X-Custom": "1", Authorization: "Bearer t" });
  });
});
