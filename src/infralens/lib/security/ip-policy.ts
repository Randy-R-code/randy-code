import { Address4, Address6 } from "ip-address";
import { isIP } from "node:net";

/** IPv4 documentation/reserved ranges `ip-address` doesn't classify on its own. */
const IPV4_EXTRA_BLOCKED_RANGES = [
  "0.0.0.0/8", // "this network" — isUnspecified() only matches the exact 0.0.0.0
  "192.0.2.0/24", // documentation (RFC 5737, TEST-NET-1)
  "198.51.100.0/24", // documentation (RFC 5737, TEST-NET-2)
  "203.0.113.0/24", // documentation (RFC 5737, TEST-NET-3)
  "240.0.0.0/4", // reserved (RFC 1112, "Class E")
].map((cidr) => new Address4(cidr));

function isBlockedIpv4(address: Address4): boolean {
  return (
    address.isPrivate() ||
    address.isLoopback() ||
    address.isLinkLocal() ||
    address.isUnspecified() ||
    address.isBroadcast() ||
    address.isCGNAT() ||
    address.isMulticast() ||
    IPV4_EXTRA_BLOCKED_RANGES.some((range) => address.isInSubnet(range))
  );
}

function isBlockedIpv6(address: Address6): boolean {
  return (
    address.isLoopback() ||
    address.isPrivate() || // ULA (fc00::/7) + IPv4-mapped/NAT64 RFC1918
    address.isLinkLocal() ||
    address.isMulticast() ||
    address.isUnspecified() ||
    address.isCGNAT() ||
    address.isBroadcast() ||
    address.isDocumentation()
  );
}

/** Strip the `[...]` brackets `URL.hostname` puts around an IPv6 literal. */
export function stripBrackets(hostname: string): string {
  return hostname.startsWith("[") && hostname.endsWith("]")
    ? hostname.slice(1, -1)
    : hostname;
}

/** True if `hostname` (bracketed or not) is a literal IP rather than a domain name that still needs DNS resolution. */
export function isLiteralIp(hostname: string): boolean {
  return isIP(stripBrackets(hostname)) !== 0;
}

/**
 * True if `ip` falls in any non-public range (loopback, private, link-local,
 * multicast, unspecified, CGNAT, broadcast, documentation/reserved) for
 * either IPv4 or IPv6 — including IPv4-mapped/NAT64 IPv6 forms, which
 * `ip-address`'s `Address6` methods unwrap automatically. `ip` must already
 * be a literal IP (bracket-stripped for v6), not a hostname.
 */
export function isBlockedIp(ip: string): boolean {
  const bare = stripBrackets(ip);
  const family = isIP(bare);

  if (family === 4) {
    return isBlockedIpv4(new Address4(bare));
  }

  if (family === 6) {
    return isBlockedIpv6(new Address6(bare));
  }

  // Not a valid literal IP — fail closed rather than silently accept it.
  return true;
}
