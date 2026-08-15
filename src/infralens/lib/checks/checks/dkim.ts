import { resolveTXT } from "@infralens-lib/dns/dns-client";
import { dkimNotFoundRecommendation } from "@infralens-lib/recommendations/security";
import { CheckRunner, EvidenceItem } from "../types";

// Selector names are chosen by whoever configured the domain's mail and are
// never published anywhere discoverable — these are just the handful of
// common defaults used by major providers. Finding one confirms DKIM is in
// use; not finding any of them proves nothing.
const COMMON_DKIM_SELECTORS = ["default", "google", "selector1", "selector2"];

export const runDkimCheck: CheckRunner<{
  foundAtCommonSelector: boolean;
  selector?: string;
}> = async ({ hostname }) => {
  const start = performance.now();

  try {
    let foundAtCommonSelector = false;
    let selector: string | undefined;

    for (const candidate of COMMON_DKIM_SELECTORS) {
      const dkimHost = `${candidate}._domainkey.${hostname}`;
      const dkimResult = await resolveTXT(dkimHost);
      const dkimRecords = dkimResult.data || [];
      const found = dkimRecords.find((record) =>
        record.toLowerCase().includes("v=dkim1"),
      );
      if (found) {
        foundAtCommonSelector = true;
        selector = candidate;
        break;
      }
    }

    const evidence: EvidenceItem[] = [
      {
        label: "DKIM",
        value: foundAtCommonSelector
          ? `found at selector "${selector}"`
          : "not found at common selectors",
        source: "dns",
      },
    ];

    return {
      id: "dkim",
      label: "DKIM",
      category: "network-dns",
      // A hit is a real, confirmed finding (pass). A miss is never treated
      // as a confirmed failure — only a handful of guessable selector names
      // are tried, so absence-at-those-names proves nothing either way.
      status: foundAtCommonSelector ? "pass" : "inconclusive",
      summary: foundAtCommonSelector
        ? `DKIM found at selector "${selector}".`
        : "DKIM not found at common selectors — this doesn't confirm it's absent, only that it isn't using one of a handful of guessable default names.",
      data: { foundAtCommonSelector, selector },
      evidence,
      recommendation: foundAtCommonSelector
        ? undefined
        : dkimNotFoundRecommendation(),
      limitations: [
        "Only a handful of common selector names are tried — DKIM selectors are chosen by whoever configured the domain's mail and aren't discoverable otherwise. A miss means it wasn't found there, not that it's confirmed absent.",
      ],
      durationMs: Math.round(performance.now() - start),
    };
  } catch {
    return {
      id: "dkim",
      label: "DKIM",
      category: "network-dns",
      status: "error",
      summary: "Unable to check DKIM records.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
