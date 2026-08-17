import { describe, expect, it } from "vitest";
import type { RequestConfig } from "../types";
import { toCurl } from "./to-curl";

describe("toCurl", () => {
  it("builds a bare GET with no headers or body", () => {
    const config: RequestConfig = {
      method: "GET",
      url: "https://api.example.com/users",
      headers: {},
    };

    expect(toCurl(config)).toBe("curl -X GET 'https://api.example.com/users'");
  });

  it("includes each header as its own -H flag", () => {
    const config: RequestConfig = {
      method: "GET",
      url: "https://api.example.com/users",
      headers: {
        Authorization: "Bearer secret-token",
        Accept: "application/json",
      },
    };

    const output = toCurl(config);
    expect(output).toContain("-H 'Authorization: Bearer secret-token'");
    expect(output).toContain("-H 'Accept: application/json'");
  });

  it("includes -d for a body", () => {
    const config: RequestConfig = {
      method: "POST",
      url: "https://api.example.com/users",
      headers: {},
      body: '{"name":"Ada"}',
    };

    expect(toCurl(config)).toContain(`-d '{"name":"Ada"}'`);
  });

  it("escapes a single quote embedded in a value without breaking the command", () => {
    const config: RequestConfig = {
      method: "POST",
      url: "https://api.example.com/users",
      headers: {},
      body: "it's a test",
    };

    expect(toCurl(config)).toContain(`-d 'it'\\''s a test'`);
  });
});
