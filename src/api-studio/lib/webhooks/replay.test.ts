import { describe, expect, it } from "vitest";
import { eventToRequestConfig } from "./replay";
import type { WebhookEvent } from "./types";

function event(overrides: Partial<WebhookEvent> = {}): WebhookEvent {
  return {
    id: "event-1",
    method: "POST",
    timestamp: 1_700_000_000_000,
    sizeBytes: 12,
    path: "/",
    query: {},
    headers: {},
    bodyText: '{"a":1}',
    isBinary: false,
    ...overrides,
  };
}

describe("eventToRequestConfig", () => {
  it("leaves the url blank for the user to fill in", () => {
    expect(eventToRequestConfig(event()).url).toBe("");
  });

  it("carries the method and body over", () => {
    const config = eventToRequestConfig(
      event({ method: "PUT", bodyText: '{"hello":"world"}' }),
    );

    expect(config.method).toBe("PUT");
    expect(config.body).toBe('{"hello":"world"}');
  });

  it("omits the body for a binary event", () => {
    const config = eventToRequestConfig(
      event({ isBinary: true, bodyText: "base64stuff" }),
    );

    expect(config.body).toBeUndefined();
  });

  it("strips hop-by-hop headers the sender's own client set, keeping everything else", () => {
    const config = eventToRequestConfig(
      event({
        headers: {
          host: "randy-code.dev",
          "content-length": "43",
          connection: "keep-alive",
          "content-type": "application/json",
          "x-webhook-signature": "abc123",
        },
      }),
    );

    expect(config.headers).toEqual({
      "content-type": "application/json",
      "x-webhook-signature": "abc123",
    });
  });
});
