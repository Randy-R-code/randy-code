import { resolveTXT } from "@infralens-lib/dns/dns-client";
import {
  dkimNotFoundRecommendation,
  dmarcWeakPolicyRecommendation,
  dnsSecurityRecommendation,
  spfMultipleRecordsRecommendation,
} from "@infralens-lib/recommendations/security";
import { CheckRunner, EvidenceItem, Recommendation } from "../types";

// Selector names are chosen by whoever configured the domain's mail and are
// never published anywhere discoverable — these are just the handful of
// common defaults used by major providers. Finding one confirms DKIM is in
// use; not finding any of them proves nothing (master plan §32 Phase 7).
const COMMON_DKIM_SELECTORS = ["default", "google", "selector1", "selector2"];

function extractDmarcPolicy(record: string): string | undefined {
  const match = record.match(/(?:^|;)\s*p=([a-zA-Z]+)/i);
  return match?.[1]?.toLowerCase();
}

export const runDnsSecurityCheck: CheckRunner<{
  spf: boolean;
  spfRecord?: string;
  spfMultipleRecords: boolean;
  dmarc: boolean;
  dmarcRecord?: string;
  dmarcPolicy?: string;
  dkimFoundAtCommonSelector: boolean;
  dkimSelector?: string;
  dkimRecord?: string;
  dnssec: "not-evaluated";
}> = async ({ hostname }) => {
  const start = performance.now();

  try {
    // Resolve SPF (TXT record at root domain)
    const txtResult = await resolveTXT(hostname);
    const txtRecords = txtResult.data || [];

    const spfRecords = txtRecords.filter((record) =>
      record.toLowerCase().startsWith("v=spf1"),
    );
    const spf = spfRecords.length > 0;
    const spfRecord = spfRecords[0];
    // RFC 7208: more than one SPF TXT record is itself invalid — receivers
    // treat this as a PermError, not "extra protection".
    const spfMultipleRecords = spfRecords.length > 1;

    // Check for DMARC (_dmarc subdomain)
    const dmarcHost = `_dmarc.${hostname}`;
    const dmarcResult = await resolveTXT(dmarcHost);
    const dmarcRecords = dmarcResult.data || [];
    const dmarcRecord = dmarcRecords.find((record) =>
      record.toLowerCase().startsWith("v=dmarc1"),
    );
    const dmarc = !!dmarcRecord;
    const dmarcPolicy = dmarcRecord
      ? extractDmarcPolicy(dmarcRecord)
      : undefined;

    // DKIM: only a handful of common selectors can be guessed — see
    // COMMON_DKIM_SELECTORS above. A miss here is reported as "not found at
    // common selectors", never as "missing".
    let dkimFoundAtCommonSelector = false;
    let dkimSelector: string | undefined;
    let dkimRecord: string | undefined;

    for (const selector of COMMON_DKIM_SELECTORS) {
      const dkimHost = `${selector}._domainkey.${hostname}`;
      const dkimResult = await resolveTXT(dkimHost);
      const dkimRecords = dkimResult.data || [];
      const found = dkimRecords.find((record) =>
        record.toLowerCase().includes("v=dkim1"),
      );
      if (found) {
        dkimFoundAtCommonSelector = true;
        dkimSelector = selector;
        dkimRecord = found;
        break;
      }
    }

    // DNSSEC: Node's built-in `dns/promises` has no DS/DNSKEY/RRSIG
    // resolution, so genuine validation isn't possible here without adding
    // a DNSSEC-aware resolver dependency — explicitly documented as
    // not-evaluated rather than silently omitted or implied absent (master
    // plan §32 Phase 7: "documenter DNSSEC").
    const dnssec = "not-evaluated" as const;

    // Only SPF/DMARC (fixed, well-known locations) drive status/missing —
    // DKIM's absence-at-common-selectors is never treated as a confirmed
    // finding.
    const missing: string[] = [];
    if (!spf) missing.push("SPF");
    if (!dmarc) missing.push("DMARC");

    let status: "pass" | "warning" | "fail" = "pass";
    let summary = "";
    let recommendation: Recommendation | undefined;

    if (missing.length === 0) {
      status = "pass";
      summary = "SPF and DMARC records are present.";
    } else {
      status = "warning";
      summary =
        missing.length === 1
          ? `Missing DNS security record: ${missing[0]}.`
          : `Missing DNS security records: ${missing.join(", ")}.`;
      recommendation = dnsSecurityRecommendation(missing);
    }

    // Priority when several findings apply at once: a missing SPF/DMARC
    // record (above) outranks a malformed SPF, which outranks a merely weak
    // (not missing) DMARC policy — each is strictly less severe than the last.
    if (spfMultipleRecords) {
      status = "warning";
      summary += " Multiple SPF records found (invalid per RFC 7208).";
      if (!recommendation) recommendation = spfMultipleRecordsRecommendation();
    }

    const evidence: EvidenceItem[] = [
      {
        label: "DKIM",
        value: dkimFoundAtCommonSelector
          ? `found at selector "${dkimSelector}"`
          : "not found at common selectors (inconclusive)",
        source: "dns",
      },
      {
        label: "DNSSEC",
        value: "not evaluated — requires a DNSSEC-aware resolver",
        source: "dns",
      },
    ];
    if (dmarcPolicy) {
      evidence.push({
        label: "DMARC policy",
        value: dmarcPolicy,
        source: "dns",
      });
      if (dmarcPolicy === "none" && !recommendation) {
        recommendation = dmarcWeakPolicyRecommendation(dmarcPolicy);
      }
    }
    if (!dkimFoundAtCommonSelector && !recommendation) {
      recommendation = dkimNotFoundRecommendation();
    }

    return {
      id: "dns-security",
      label: "DNS Security",
      category: "network-dns",
      status,
      summary,
      recommendation,
      data: {
        spf,
        spfRecord,
        spfMultipleRecords,
        dmarc,
        dmarcRecord,
        dmarcPolicy,
        dkimFoundAtCommonSelector,
        dkimSelector,
        dkimRecord,
        dnssec,
      },
      evidence,
      limitations: [
        "DKIM is only checked at a handful of common selector names — a miss means it wasn't found there, not that it's confirmed absent.",
        "DNSSEC is not evaluated at all — Node's built-in DNS resolver doesn't support DS/DNSKEY/RRSIG lookups.",
      ],
      durationMs: Math.round(performance.now() - start),
    };
  } catch {
    return {
      id: "dns-security",
      label: "DNS Security",
      category: "network-dns",
      status: "error",
      summary: "Unable to check DNS security records.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
