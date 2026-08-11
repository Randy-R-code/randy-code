import { beforeEach, describe, expect, it, vi } from "vitest";
import { BlockedTargetError, DnsResolutionError } from "./errors";
import { NormalizedTarget } from "./target";

const { resolveA, resolveAAAA } = vi.hoisted(() => ({
  resolveA: vi.fn(),
  resolveAAAA: vi.fn(),
}));

vi.mock("@infralens-lib/dns/dns-client", () => ({ resolveA, resolveAAAA }));

const { resolveValidatedTarget } = await import("./resolve-target");

function target(hostname: string): NormalizedTarget {
  return { url: `https://${hostname}/`, hostname, protocol: "https:" };
}

function ok(...addresses: string[]) {
  return { type: "A" as const, success: true, data: addresses, durationMs: 1 };
}

function empty() {
  return {
    type: "A" as const,
    success: false,
    error: "no records",
    durationMs: 1,
  };
}

beforeEach(() => {
  resolveA.mockReset();
  resolveAAAA.mockReset();
});

describe("resolveValidatedTarget — literal IP hostnames, no DNS involved", () => {
  it("blocks a literal loopback IP without calling DNS", async () => {
    await expect(resolveValidatedTarget(target("127.0.0.1"))).rejects.toThrow(
      BlockedTargetError,
    );
    expect(resolveA).not.toHaveBeenCalled();
  });

  it("blocks 0.0.0.0", async () => {
    await expect(resolveValidatedTarget(target("0.0.0.0"))).rejects.toThrow(
      BlockedTargetError,
    );
  });

  it("blocks a bracketed IPv6 loopback", async () => {
    await expect(resolveValidatedTarget(target("[::1]"))).rejects.toThrow(
      BlockedTargetError,
    );
  });

  it("allows a literal public IP", async () => {
    const result = await resolveValidatedTarget(target("8.8.8.8"));
    expect(result.ip).toBe("8.8.8.8");
  });
});

describe("resolveValidatedTarget — hostnames requiring DNS", () => {
  it("rejects when DNS resolution returns nothing", async () => {
    resolveA.mockResolvedValue(empty());
    resolveAAAA.mockResolvedValue(empty());

    await expect(
      resolveValidatedTarget(target("nonexistent.example")),
    ).rejects.toThrow(DnsResolutionError);
  });

  it("allows a hostname resolving only to public addresses", async () => {
    resolveA.mockResolvedValue(ok("93.184.216.34"));
    resolveAAAA.mockResolvedValue(empty());

    const result = await resolveValidatedTarget(target("example.com"));

    expect(result.ip).toBe("93.184.216.34");
  });

  it("blocks a hostname resolving to a private address", async () => {
    resolveA.mockResolvedValue(ok("10.0.0.5"));
    resolveAAAA.mockResolvedValue(empty());

    await expect(
      resolveValidatedTarget(target("internal.example")),
    ).rejects.toThrow(BlockedTargetError);
  });

  it("blocks a hostname mixing public and private addresses (§22.3)", async () => {
    resolveA.mockResolvedValue(ok("93.184.216.34", "10.0.0.5"));
    resolveAAAA.mockResolvedValue(empty());

    await expect(
      resolveValidatedTarget(target("mixed.example")),
    ).rejects.toThrow(BlockedTargetError);
  });

  it("blocks a hostname whose only address is cloud metadata", async () => {
    resolveA.mockResolvedValue(ok("169.254.169.254"));
    resolveAAAA.mockResolvedValue(empty());

    await expect(
      resolveValidatedTarget(target("metadata.example")),
    ).rejects.toThrow(BlockedTargetError);
  });

  it("blocks a hostname resolving to an IPv6 unique-local address", async () => {
    resolveA.mockResolvedValue(empty());
    resolveAAAA.mockResolvedValue(ok("fd00::1"));

    await expect(resolveValidatedTarget(target("ula.example"))).rejects.toThrow(
      BlockedTargetError,
    );
  });
});
