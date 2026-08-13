import { detectCdnFromHeaders } from "../cdn-fingerprints";
import { CheckRunner } from "../types";

export const runWafCheck: CheckRunner<{
  detected: string[];
  likelyProvider?: string;
}> = async ({ shared }) => {
  const start = performance.now();

  if (!shared.page) {
    return {
      id: "waf",
      label: "Firewall / WAF Detection",
      category: "infrastructure",
      status: "error",
      summary: "Unable to detect WAF/CDN.",
      durationMs: Math.round(performance.now() - start),
    };
  }

  // These are header *fingerprints*, not proof of a WAF — a CDN header
  // doesn't mean requests are actually being filtered, and a real WAF that
  // strips its own signature would show nothing here. Detection is
  // inherently probabilistic, so this never fails or warns — only `info`.
  const { detected, provider: likelyProvider } = detectCdnFromHeaders(
    shared.page.headers,
  );

  // Absence of a fingerprint proves nothing — plenty of WAFs/CDNs don't leak
  // an identifying header, and plenty of legitimate sites simply have none.
  // Never `warning`/`fail`: this is never a scored finding either way.
  const summary = likelyProvider
    ? `Response headers suggest ${likelyProvider} may be in front of this site (not a confirmed detection).`
    : "No CDN/WAF header fingerprint found — this doesn't mean none is present.";

  return {
    id: "waf",
    label: "Firewall / WAF Detection",
    category: "infrastructure",
    status: "info",
    summary,
    data: {
      detected,
      likelyProvider,
    },
    limitations: [
      "Detection relies entirely on known header fingerprints — a WAF/CDN that doesn't add an identifying header is invisible here, and a header alone doesn't prove active filtering.",
    ],
    durationMs: Math.round(performance.now() - start),
  };
};
