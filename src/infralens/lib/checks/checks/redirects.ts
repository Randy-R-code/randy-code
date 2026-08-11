import {
  excessiveRedirectsRecommendation,
  protocolDowngradeRecommendation,
  redirectLoopRecommendation,
} from "@infralens-lib/recommendations/security";
import { RedirectHop } from "../collect";
import { CheckRunner, EvidenceItem } from "../types";

function protocolOf(url: string): string | null {
  try {
    return new URL(url).protocol;
  } catch {
    return null;
  }
}

function hostnameOf(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

/** True if any hop goes from https:// to http:// (master plan §11.4: "downgrade HTTPS vers HTTP"). */
function hasProtocolDowngrade(chain: RedirectHop[]): boolean {
  for (let i = 0; i < chain.length - 1; i++) {
    if (
      protocolOf(chain[i].url) === "https:" &&
      protocolOf(chain[i + 1].url) === "http:"
    ) {
      return true;
    }
  }
  return false;
}

export const runRedirectsCheck: CheckRunner<{
  redirectCount: number;
  finalUrl: string;
  redirectChain: RedirectHop[];
  hasLoop: boolean;
  hasProtocolDowngrade: boolean;
  hostnameChanged: boolean;
}> = async ({ shared }) => {
  const start = performance.now();

  if (!shared.page) {
    return {
      id: "redirects",
      label: "Redirect Behavior",
      category: "http-security",
      status: "error",
      summary: "Unable to analyze redirect behavior.",
      durationMs: Math.round(performance.now() - start),
    };
  }

  const {
    redirectChain,
    redirectCount,
    hasRedirectLoop: hasLoop,
    finalUrl,
  } = shared.page;

  const downgrade = hasProtocolDowngrade(redirectChain);
  const firstHostname = redirectChain[0]
    ? hostnameOf(redirectChain[0].url)
    : null;
  const hostnameChanged =
    firstHostname !== null && firstHostname !== hostnameOf(finalUrl);

  let status: "pass" | "warning" | "fail" = "pass";
  let summary = "";
  let recommendation;

  if (hasLoop) {
    // A real, broken configuration — not a technical failure to detect it.
    status = "fail";
    summary = "Redirect loop detected.";
    recommendation = redirectLoopRecommendation();
  } else if (downgrade) {
    status = "fail";
    summary = "The redirect chain downgrades from HTTPS to HTTP at some point.";
    recommendation = protocolDowngradeRecommendation();
  } else if (redirectCount > 5) {
    status = "warning";
    summary = `Excessive redirects detected (${redirectCount} redirects).`;
    recommendation = excessiveRedirectsRecommendation(redirectCount);
  } else if (redirectCount > 0) {
    summary = `Redirect chain: ${redirectCount} redirect(s) to final URL.`;
  } else {
    summary = "No redirects detected.";
  }

  const evidence: EvidenceItem[] = redirectChain.map((hop, i) => ({
    label: `Hop ${i + 1}`,
    value: `${hop.url} -> ${hop.status}`,
    source: "derived",
  }));
  if (hostnameChanged) {
    evidence.push({
      label: "Hostname change",
      value: `${firstHostname} -> ${hostnameOf(finalUrl)}`,
      source: "derived",
    });
  }

  return {
    id: "redirects",
    label: "Redirect Behavior",
    category: "http-security",
    status,
    summary,
    recommendation,
    data: {
      redirectCount,
      finalUrl,
      redirectChain,
      hasLoop,
      hasProtocolDowngrade: downgrade,
      hostnameChanged,
    },
    evidence,
    limitations: [
      "A hostname change is reported as a fact, not scored as good or bad — moving from a bare domain to a www subdomain (or the reverse) is normal and shouldn't be conflated with a redirect to an unrelated host.",
    ],
    durationMs: Math.round(performance.now() - start),
  };
};
