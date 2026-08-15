import {
  ANALYSIS_TIMEOUT_MS,
  MAX_CONCURRENT_CHECKS,
} from "@infralens-config/constants";
import { mapWithConcurrencyLimit } from "@infralens-lib/concurrency";
import { logInfo } from "@infralens-lib/log";
import { annotateScoring, calculateGlobalScore } from "./calculate-score";
import { runAccessibilityCheck } from "./checks/accessibility";
import { runDkimCheck } from "./checks/dkim";
import { runDnsRecordsCheck } from "./checks/dns-records";
import { runDnsSecurityCheck } from "./checks/dns-security";
import { runDnssecCheck } from "./checks/dnssec";
import { runHeadersCheck } from "./checks/headers";
import { runHttpsCheck } from "./checks/https";
import { runIpHostingCheck } from "./checks/ip-hosting";
import { runLinksCheck } from "./checks/links";
import { runMetadataCheck } from "./checks/metadata";
import { runPerformanceCheck } from "./checks/performance";
import { runReachabilityCheck } from "./checks/reachability";
import { runRedirectsCheck } from "./checks/redirects";
import { runRobotsCheck } from "./checks/robots";
import { runSecurityTxtCheck } from "./checks/security-txt";
import { runServerHeadersCheck } from "./checks/server-headers";
import { runSitemapCheck } from "./checks/sitemap";
import { runSocialCheck } from "./checks/social";
import { runStackCheck } from "./checks/stack";
import { runWafCheck } from "./checks/waf";
import { collectSharedContext } from "./collect";
import { CheckRunner, ChecksResponse } from "./types";

const CHECKS: CheckRunner[] = [
  runHeadersCheck,
  runHttpsCheck,
  runSecurityTxtCheck,
  runRedirectsCheck,
  runDnsRecordsCheck,
  runDnsSecurityCheck,
  runDkimCheck,
  runDnssecCheck,
  runIpHostingCheck,
  runRobotsCheck,
  runSitemapCheck,
  runLinksCheck,
  runMetadataCheck,
  runAccessibilityCheck,
  runPerformanceCheck,
  runServerHeadersCheck,
  runSocialCheck,
  runStackCheck,
  runWafCheck,
  runReachabilityCheck,
];

export type AnalysisInput = {
  url: string;
  hostname: string;
  timeout: number;
};

export async function runChecks(input: AnalysisInput): Promise<ChecksResponse> {
  const analyzedAt = new Date().toISOString();
  const start = performance.now();

  const collectionStart = performance.now();
  const shared = await collectSharedContext(
    input.hostname,
    input.url,
    input.timeout,
  );
  logInfo({
    event: "collection_completed",
    durationMs: Math.round(performance.now() - collectionStart),
    pageCollected: shared.page !== null,
  });

  const results = await mapWithConcurrencyLimit(
    CHECKS,
    MAX_CONCURRENT_CHECKS,
    async (check) => {
      // Each check's own timeout shrinks to whatever's left of the global
      // budget — a check dispatched late in the pool
      // can't run past the analysis-wide deadline just because it hasn't
      // started yet. Checks that no longer fetch anything (they read
      // `shared` instead) ignore this; the ones that still do their own
      // fetching (robots.txt, sitemap.xml, security.txt, DNS security
      // selectors, link reachability) pass it straight to their existing
      // `AbortController` timeout, unchanged.
      const remaining = ANALYSIS_TIMEOUT_MS - (performance.now() - start);
      const timeout = Math.max(0, Math.min(input.timeout, remaining));

      return check({ ...input, timeout, shared });
    },
  );

  const totalDurationMs = Math.round(performance.now() - start);
  const score = calculateGlobalScore(results);
  const checks = annotateScoring(results);

  return {
    url: input.url,
    hostname: input.hostname,
    checks,
    totalDurationMs,
    score,
    analyzedAt,
  };
}
