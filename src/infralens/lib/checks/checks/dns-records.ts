import {
  resolveCAA,
  resolveCNAME,
  resolveMX,
  resolveNS,
  resolveTXT,
} from "@infralens-lib/dns/dns-client";
import { CheckRunner, EvidenceItem } from "../types";

export const runDnsRecordsCheck: CheckRunner<{
  a: string[];
  aaaa: string[];
  mx: Array<{ exchange: string; priority: number }>;
  ns: string[];
  txt: string[];
  cname: string[];
  caa: string[];
}> = async ({ hostname, shared }) => {
  const start = performance.now();

  try {
    // A/AAAA come from the shared collection step (master plan §9.2) —
    // only the record types it doesn't already resolve are fetched here.
    const a = shared.dns.a;
    const aaaa = shared.dns.aaaa;

    const results = await Promise.allSettled([
      resolveMX(hostname),
      resolveNS(hostname),
      resolveTXT(hostname),
      resolveCNAME(hostname),
      resolveCAA(hostname),
    ]);

    const mx: Array<{ exchange: string; priority: number }> = [];
    const ns: string[] = [];
    const txt: string[] = [];
    const cname: string[] = [];
    const caa: string[] = [];

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        const data = result.value;
        if (data.success && data.data) {
          switch (data.type) {
            case "MX":
              mx.push(
                ...(data.data as Array<{ exchange: string; priority: number }>),
              );
              break;
            case "NS":
              ns.push(...(data.data as string[]));
              break;
            case "TXT":
              txt.push(...(data.data as string[]));
              break;
            case "CNAME":
              cname.push(...(data.data as string[]));
              break;
            case "CAA":
              caa.push(...(data.data as string[]));
              break;
          }
        }
      }
    });

    const hasRecords =
      a.length > 0 || aaaa.length > 0 || mx.length > 0 || ns.length > 0;

    let status: "pass" | "warning" | "fail" = "pass";
    let summary = "";

    if (!hasRecords) {
      // A domain with genuinely no DNS records is a real (if unusual)
      // finding, not a technical failure to look them up.
      status = "fail";
      summary = "No DNS records found.";
    } else {
      const recordCounts: string[] = [];
      if (a.length > 0) recordCounts.push(`${a.length} A`);
      if (aaaa.length > 0) recordCounts.push(`${aaaa.length} AAAA`);
      if (mx.length > 0) recordCounts.push(`${mx.length} MX`);
      if (ns.length > 0) recordCounts.push(`${ns.length} NS`);
      if (txt.length > 0) recordCounts.push(`${txt.length} TXT`);
      if (cname.length > 0) recordCounts.push(`${cname.length} CNAME`);
      if (caa.length > 0) recordCounts.push(`${caa.length} CAA`);

      summary = `Found: ${recordCounts.join(", ")}.`;
    }

    // CAA restricts which CAs may issue certificates for the domain — a real
    // hardening signal when present, but its absence is the common default
    // and not itself a misconfiguration, so it's surfaced as evidence only
    // and never moves `status` (master plan §11: "ajouter CAA si pertinent").
    const evidence: EvidenceItem[] = [
      {
        label: "CAA",
        value: caa.length > 0 ? caa.join("; ") : "none (any CA may issue)",
        source: "dns",
      },
    ];

    return {
      id: "dns-records",
      label: "DNS Records",
      category: "network-dns",
      status,
      summary,
      data: {
        a,
        aaaa,
        mx,
        ns,
        txt,
        cname,
        caa,
      },
      evidence,
      durationMs: Math.round(performance.now() - start),
    };
  } catch {
    return {
      id: "dns-records",
      label: "DNS Records",
      category: "network-dns",
      status: "error",
      summary: "Unable to resolve DNS records.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
