import { resolveTXT } from "@infralens-lib/dns/dns-client";
import {
  dmarcWeakPolicyRecommendation,
  dnsSecurityRecommendation,
  spfMultipleRecordsRecommendation,
} from "@infralens-lib/recommendations/security";
import { CheckRunner, EvidenceItem, Recommendation } from "../types";

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

    // Only SPF/DMARC (fixed, well-known locations) drive status/missing —
    // DKIM and DNSSEC are their own separate checks (`dkim.ts`/`dnssec.ts`),
    // since neither can ever reach a confirmed pass/warning/fail here the
    // way SPF/DMARC can.
    const missing: string[] = [];
    if (!spf) missing.push("SPF");
    if (!dmarc) missing.push("DMARC");

    let status: "pass" | "warning" | "fail" = "pass";
    let summary = "";
    let recommendation: Recommendation | undefined;

    if (missing.length === 0 && dmarcPolicy === "none") {
      // Present but non-enforcing: p=none is monitor-only, so a spoofed
      // message still delivers — that's a materially weaker state than a
      // real pass, not just a footnote in the recommendation.
      status = "warning";
      summary =
        "SPF and DMARC are present, but DMARC is in monitor-only mode (p=none) — it doesn't stop spoofed mail from being delivered.";
      recommendation = dmarcWeakPolicyRecommendation(dmarcPolicy);
    } else if (missing.length === 0) {
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

    const evidence: EvidenceItem[] = [];
    if (dmarcPolicy) {
      evidence.push({
        label: "DMARC policy",
        value: dmarcPolicy,
        source: "dns",
      });
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
      },
      evidence: evidence.length > 0 ? evidence : undefined,
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
