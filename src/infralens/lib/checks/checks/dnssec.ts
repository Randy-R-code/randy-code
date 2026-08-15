import { CheckRunner } from "../types";

export const runDnssecCheck: CheckRunner<{
  dnssec: "not-evaluated";
}> = async () => {
  const start = performance.now();

  // Node's built-in `dns/promises` has no DS/DNSKEY/RRSIG resolution, so
  // genuine DNSSEC validation isn't possible here without adding a
  // DNSSEC-aware resolver dependency — always inconclusive rather than
  // silently omitted or implied absent. A future DNSSEC-aware resolver
  // could make this a real pass/warning/fail check later.
  return {
    id: "dnssec",
    label: "DNSSEC",
    category: "network-dns",
    status: "inconclusive",
    summary:
      "DNSSEC is not evaluated — this scanner has no DNSSEC-aware resolver.",
    data: { dnssec: "not-evaluated" },
    evidence: [
      {
        label: "DNSSEC",
        value: "not evaluated — requires a DNSSEC-aware resolver",
        source: "dns",
      },
    ],
    limitations: [
      "DNSSEC is not evaluated at all — Node's built-in DNS resolver doesn't support DS/DNSKEY/RRSIG lookups.",
    ],
    durationMs: Math.round(performance.now() - start),
  };
};
