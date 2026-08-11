import { CheckRunner, EvidenceItem } from "../types";

// A version number in the value (e.g. "nginx/1.18.0", "Apache/2.4.41") is
// the actual leak — a bare "nginx" or "cloudflare" reveals nothing an
// attacker couldn't guess anyway (master plan §11.18: "Ne pas considérer
// chaque header serveur comme une vulnérabilité critique").
const VERSION_PATTERN = /\d+\.\d+/;

// These headers are unusual enough that their mere presence is already
// notable — unlike `Server`, which almost every response sends.
const SPECIFIC_LEAK_HEADERS = [
  "x-aspnet-version",
  "x-runtime",
  "x-version",
  "via",
];

export const runServerHeadersCheck: CheckRunner<{
  server?: string;
  poweredBy?: string;
  hasInfoLeak: boolean;
  detected: string[];
}> = async ({ shared }) => {
  const start = performance.now();

  if (!shared.page) {
    return {
      id: "server-headers",
      label: "Server Headers",
      category: "metadata-stack",
      status: "error",
      summary: "Unable to analyze server headers.",
      durationMs: Math.round(performance.now() - start),
    };
  }

  const { headers } = shared.page;
  const server = headers.get("server") || undefined;
  const poweredBy = headers.get("x-powered-by") || undefined;
  const detected: string[] = [];

  if (server) detected.push(`Server: ${server}`);
  if (poweredBy) detected.push(`X-Powered-By: ${poweredBy}`);

  const serverLeaksVersion = !!server && VERSION_PATTERN.test(server);
  const specificLeaks = SPECIFIC_LEAK_HEADERS.filter((h) => headers.has(h));

  const hasInfoLeak =
    !!poweredBy || serverLeaksVersion || specificLeaks.length > 0;

  let status: "pass" | "warning" = "pass";
  let summary = "";

  if (poweredBy) {
    status = "warning";
    summary = "X-Powered-By header exposes server information.";
  } else if (serverLeaksVersion) {
    status = "warning";
    summary = `Server header exposes a version number: ${server}.`;
  } else if (specificLeaks.length > 0) {
    status = "warning";
    summary = `Server headers may expose unnecessary information: ${specificLeaks.join(", ")}.`;
  } else if (server) {
    summary = `Server: ${server} (no version disclosed).`;
  } else {
    summary = "No server information exposed in headers.";
  }

  const evidence: EvidenceItem[] = specificLeaks.map((h) => ({
    label: h,
    value: headers.get(h),
    source: "header" as const,
  }));

  return {
    id: "server-headers",
    label: "Server Headers",
    category: "metadata-stack",
    status,
    summary,
    data: {
      server,
      poweredBy,
      hasInfoLeak,
      detected,
    },
    evidence: evidence.length > 0 ? evidence : undefined,
    durationMs: Math.round(performance.now() - start),
  };
};
