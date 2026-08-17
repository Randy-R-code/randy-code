import { describe, expect, it } from "vitest";
import type { RequestConfig } from "../types";
import { toFetch } from "./to-fetch";

describe("toFetch", () => {
  it("produces valid, evaluable JS for a bare GET", () => {
    const config: RequestConfig = {
      method: "GET",
      url: "https://api.example.com/users",
      headers: {},
    };

    const output = toFetch(config);
    expect(output).toContain('fetch("https://api.example.com/users"');
    expect(output).toContain('method: "GET"');

    expect(() => new Function(`return ${output}`)).not.toThrow();
  });

  it("omits the headers block entirely when there are no headers", () => {
    const config: RequestConfig = {
      method: "GET",
      url: "https://api.example.com",
      headers: {},
    };

    expect(toFetch(config)).not.toContain("headers:");
  });

  it("includes headers and body, with values safely escaped via JSON.stringify", () => {
    const config: RequestConfig = {
      method: "POST",
      url: "https://api.example.com/users",
      headers: { "Content-Type": 'application/json; charset="utf-8"' },
      body: '{"name":"Ada \\"Lovelace\\""}',
    };

    const output = toFetch(config);
    expect(output).toContain(
      '"Content-Type": "application/json; charset=\\"utf-8\\""',
    );
    expect(output).toContain("body:");

    expect(() => new Function(`return ${output}`)).not.toThrow();
  });
});
