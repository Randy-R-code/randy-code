import { describe, expect, it } from "vitest";
import { isBlockedIp } from "./ip-policy";

describe("isBlockedIp — IPv4", () => {
  it.each([
    ["127.0.0.1", "loopback"],
    [
      "127.1",
      "loopback shorthand (should already be canonicalized upstream, but must still classify correctly if it ever reaches here)",
    ],
    ["0.0.0.0", "unspecified / this-network"],
    ["10.0.0.1", "RFC 1918 private (10/8)"],
    ["172.16.0.1", "RFC 1918 private (172.16/12)"],
    ["192.168.1.1", "RFC 1918 private (192.168/16)"],
    ["169.254.169.254", "link-local / cloud metadata"],
    ["100.64.0.1", "carrier-grade NAT"],
    ["255.255.255.255", "broadcast"],
    ["224.0.0.1", "multicast"],
    ["192.0.2.1", "documentation (TEST-NET-1)"],
    ["240.0.0.1", "reserved (class E)"],
  ])("blocks %s (%s)", (ip) => {
    expect(isBlockedIp(ip)).toBe(true);
  });

  it.each([
    ["8.8.8.8", "public"],
    ["1.1.1.1", "public"],
    ["93.184.216.34", "public (example.com-ish)"],
  ])("allows %s (%s)", (ip) => {
    expect(isBlockedIp(ip)).toBe(false);
  });
});

describe("isBlockedIp — IPv6", () => {
  it.each([
    ["::1", "loopback"],
    ["::", "unspecified"],
    ["fe80::1", "link-local"],
    ["fc00::1", "unique local (ULA)"],
    ["fd00::1", "unique local (ULA)"],
    ["ff02::1", "multicast"],
    ["2001:db8::1", "documentation"],
    ["::ffff:127.0.0.1", "IPv4-mapped loopback"],
    ["::ffff:10.0.0.1", "IPv4-mapped RFC 1918 private"],
    ["::ffff:169.254.169.254", "IPv4-mapped cloud metadata"],
    ["[::1]", "bracketed loopback (as URL.hostname serializes it)"],
  ])("blocks %s (%s)", (ip) => {
    expect(isBlockedIp(ip)).toBe(true);
  });

  it.each([
    ["2606:4700:4700::1111", "public (Cloudflare DNS)"],
    ["2001:4860:4860::8888", "public (Google DNS)"],
  ])("allows %s (%s)", (ip) => {
    expect(isBlockedIp(ip)).toBe(false);
  });
});

describe("isBlockedIp — invalid input", () => {
  it("fails closed (blocks) on a non-IP string", () => {
    expect(isBlockedIp("not-an-ip")).toBe(true);
  });

  it("fails closed (blocks) on an empty string", () => {
    expect(isBlockedIp("")).toBe(true);
  });
});
