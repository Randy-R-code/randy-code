import { EventEmitter } from "node:events";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { connect, resolveA, resolveAAAA } = vi.hoisted(() => ({
  connect: vi.fn(),
  resolveA: vi.fn(),
  resolveAAAA: vi.fn(),
}));

vi.mock("node:tls", () => ({ connect }));
vi.mock("@infralens-lib/dns/dns-client", () => ({ resolveA, resolveAAAA }));

const { inspectTls } = await import("./inspect-tls");

function dnsOk(...addresses: string[]) {
  return { type: "A" as const, success: true, data: addresses, durationMs: 1 };
}
const noAaaa = { type: "AAAA" as const, success: false, durationMs: 1 };

class FakeSocket extends EventEmitter {
  authorized = true;
  authorizationError?: Error;
  destroyed = false;
  destroy() {
    this.destroyed = true;
  }
  getPeerCertificate() {
    return {
      issuer: { O: "Test CA", CN: "Test CA" },
      valid_to: this.validTo,
    };
  }
  getProtocol() {
    return this.protocolValue;
  }
  validTo = "Jan 1 2030 00:00:00 GMT";
  protocolValue: string | null = "TLSv1.3";
}

beforeEach(() => {
  connect.mockReset();
  resolveA.mockReset().mockResolvedValue(dnsOk("93.184.216.34"));
  resolveAAAA.mockReset().mockResolvedValue(noAaaa);
});

describe("inspectTls", () => {
  it("returns null for a non-https target without attempting a connection", async () => {
    const result = await inspectTls("http://example.com/");

    expect(result).toBeNull();
    expect(connect).not.toHaveBeenCalled();
  });

  it("returns null for a target that fails SSRF/DNS validation", async () => {
    resolveA.mockResolvedValue({
      type: "A",
      success: true,
      data: ["127.0.0.1"],
      durationMs: 1,
    });

    const result = await inspectTls("https://internal.example/");

    expect(result).toBeNull();
    expect(connect).not.toHaveBeenCalled();
  });

  it("extracts issuer, expiry, and protocol from a valid certificate", async () => {
    const socket = new FakeSocket();
    connect.mockImplementation(
      (_opts: unknown, onSecureConnect: () => void) => {
        queueMicrotask(onSecureConnect);
        return socket;
      },
    );

    const result = await inspectTls("https://example.com/");

    expect(result?.authorized).toBe(true);
    expect(result?.issuer).toBe("Test CA");
    expect(result?.protocol).toBe("TLSv1.3");
    expect(result?.daysUntilExpiry).toBeGreaterThan(0);
  });

  it("connects directly to the validated IP with servername set for SNI (no fresh DNS at connect time)", async () => {
    const socket = new FakeSocket();
    connect.mockImplementation(
      (
        opts: { host: string; servername: string },
        onSecureConnect: () => void,
      ) => {
        expect(opts.host).toBe("93.184.216.34");
        expect(opts.servername).toBe("example.com");
        queueMicrotask(onSecureConnect);
        return socket;
      },
    );

    await inspectTls("https://example.com/");

    expect(connect).toHaveBeenCalledTimes(1);
  });

  it("reports an unauthorized (invalid) certificate instead of throwing", async () => {
    const socket = new FakeSocket();
    socket.authorized = false;
    socket.authorizationError = new Error("certificate has expired");
    connect.mockImplementation(
      (_opts: unknown, onSecureConnect: () => void) => {
        queueMicrotask(onSecureConnect);
        return socket;
      },
    );

    const result = await inspectTls("https://example.com/");

    expect(result?.authorized).toBe(false);
    expect(result?.authorizationError).toBe("certificate has expired");
  });

  it("returns null on a connection error instead of throwing", async () => {
    const socket = new FakeSocket();
    connect.mockImplementation(() => {
      queueMicrotask(() => socket.emit("error", new Error("ECONNREFUSED")));
      return socket;
    });

    const result = await inspectTls("https://example.com/");

    expect(result).toBeNull();
  });

  it("returns null and destroys the socket on timeout", async () => {
    const socket = new FakeSocket();
    connect.mockImplementation(() => socket); // never calls back

    const result = await inspectTls("https://example.com/", 20);

    expect(result).toBeNull();
    expect(socket.destroyed).toBe(true);
  });
});
