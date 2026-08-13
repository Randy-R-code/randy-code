import { resolveA, resolveAAAA } from "@infralens-lib/dns/dns-client";
import { BlockedTargetError, DnsResolutionError } from "./errors";
import { isBlockedIp, isLiteralIp, stripBrackets } from "./ip-policy";
import { NormalizedTarget } from "./target";

export type ValidatedTarget = NormalizedTarget & {
  /** The single address `safeFetch` pins its connection to. */
  ip: string;
};

/**
 * Resolves and classifies every address for `target.hostname` (master plan
 * §8.1, §8.3), rejecting the whole target if any resolved address falls in a
 * blocked range — including a hostname that mixes public and private
 * addresses (§22.3's "hostname avec mélange public/privé"). Must be called
 * fresh for every hop of a redirect chain, never reused from an earlier
 * validation — a cached result would reopen the DNS-rebinding window this
 * exists to close.
 */
export async function resolveValidatedTarget(
  target: NormalizedTarget,
): Promise<ValidatedTarget> {
  const bareHostname = stripBrackets(target.hostname);

  if (isLiteralIp(target.hostname)) {
    if (isBlockedIp(bareHostname)) {
      throw new BlockedTargetError(
        "Target hostname is a literal IP in a blocked range.",
      );
    }
    return { ...target, ip: bareHostname };
  }

  const [a, aaaa] = await Promise.all([
    resolveA(bareHostname),
    resolveAAAA(bareHostname),
  ]);

  const addresses = [...(a.data ?? []), ...(aaaa.data ?? [])];

  if (addresses.length === 0) {
    throw new DnsResolutionError(
      `DNS resolution returned no usable records (A: ${
        a.error ?? "none"
      }, AAAA: ${aaaa.error ?? "none"}).`,
    );
  }

  if (addresses.some((address) => isBlockedIp(address))) {
    throw new BlockedTargetError(
      "One or more addresses resolved for this hostname are in a blocked range.",
    );
  }

  return { ...target, ip: addresses[0] };
}
