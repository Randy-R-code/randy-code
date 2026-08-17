import { describe, expect, it } from "vitest";
import type { AuthConfig } from "./auth";
import { buildRequestConfig } from "./build-request-config";
import type { KeyValueRow } from "./serialize";

const noAuth: AuthConfig = { type: "none" };

function row(key: string, value: string, enabled = true): KeyValueRow {
  return { id: crypto.randomUUID(), key, value, enabled };
}

describe("buildRequestConfig", () => {
  it("applies param rows to the URL", () => {
    const result = buildRequestConfig({
      method: "GET",
      url: "https://api.example.com/users",
      paramRows: [row("page", "2")],
      headerRows: [],
      auth: noAuth,
      bodyMode: "none",
      bodyValue: "",
    });

    expect(result.url).toBe("https://api.example.com/users?page=2");
    expect(result.body).toBeUndefined();
  });

  it("fills a default Content-Type for the body mode, without overriding an explicit header", () => {
    const jsonDefault = buildRequestConfig({
      method: "POST",
      url: "https://api.example.com/users",
      paramRows: [],
      headerRows: [],
      auth: noAuth,
      bodyMode: "json",
      bodyValue: "{}",
    });
    expect(jsonDefault.headers["Content-Type"]).toBe("application/json");

    const explicitOverride = buildRequestConfig({
      method: "POST",
      url: "https://api.example.com/users",
      paramRows: [],
      headerRows: [row("Content-Type", "application/vnd.api+json")],
      auth: noAuth,
      bodyMode: "json",
      bodyValue: "{}",
    });
    expect(explicitOverride.headers["Content-Type"]).toBe(
      "application/vnd.api+json",
    );
  });

  it("omits body and Content-Type when the body mode is none", () => {
    const result = buildRequestConfig({
      method: "GET",
      url: "https://api.example.com/users",
      paramRows: [],
      headerRows: [],
      auth: noAuth,
      bodyMode: "none",
      bodyValue: "leftover text",
    });

    expect(result.body).toBeUndefined();
    expect(result.headers["Content-Type"]).toBeUndefined();
  });

  it("layers auth on top of the header rows", () => {
    const result = buildRequestConfig({
      method: "GET",
      url: "https://api.example.com/users",
      paramRows: [],
      headerRows: [row("Accept", "application/json")],
      auth: { type: "bearer", token: "secret" },
      bodyMode: "none",
      bodyValue: "",
    });

    expect(result.headers).toEqual({
      Accept: "application/json",
      Authorization: "Bearer secret",
    });
  });
});
