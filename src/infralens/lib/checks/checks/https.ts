import {
  certificateExpiringRecommendation,
  hstsRecommendation,
  httpsRecommendation,
  invalidCertificateRecommendation,
} from "@infralens-lib/recommendations/security";
import { inspectTls } from "@infralens-lib/security/inspect-tls";
import { CheckRunner, EvidenceItem, Recommendation } from "../types";
import { analyzeHsts } from "./headers";

/** Certificates inside this window are still valid but worth flagging before they lapse. */
const EXPIRY_WARNING_DAYS = 30;

export const runHttpsCheck: CheckRunner<{
  httpsAvailable: boolean;
  httpRedirects: boolean;
  tlsVersion?: string;
  certificateIssuer?: string;
  certificateExpiry?: string;
  daysUntilExpiry?: number;
}> = async ({ url, shared }) => {
  const start = performance.now();

  try {
    const isHttps = new URL(url).protocol === "https:";

    if (!shared.page) {
      return {
        id: "https",
        label: "HTTPS & TLS",
        category: "http-security",
        status: "error",
        summary: "Unable to verify HTTPS configuration.",
        durationMs: Math.round(performance.now() - start),
      };
    }

    // `shared.page` already followed any redirects, so these read off the
    // *final* destination rather than re-fetching url/httpUrl separately
    // the way each of the three original requests did.
    const httpsAvailable = isHttps ? shared.page.status < 500 : isHttps; // preserved as-is: an http:// input never re-checks https availability directly, matching prior behavior
    const httpRedirects = !isHttps && shared.page.finalUrl.startsWith("https:");

    const hstsFinding = analyzeHsts(
      shared.page.headers.get("strict-transport-security"),
    );
    const hasStrongHsts = isHttps && httpsAvailable && hstsFinding.strong;

    let status: "pass" | "warning" | "fail" = "pass";
    let summary = "";
    let recommendation: Recommendation | undefined;
    const evidence: EvidenceItem[] = [];

    if (!httpsAvailable && !httpRedirects) {
      // Neither HTTPS itself nor an HTTP->HTTPS redirect works — a real
      // configuration gap, not a technical failure to run the check.
      status = "fail";
      summary = "HTTPS is not available and HTTP does not redirect to HTTPS.";
      recommendation = httpsRecommendation();
    } else if (!httpsAvailable && httpRedirects) {
      status = "warning";
      summary = "HTTPS is not directly available, but HTTP redirects to HTTPS.";
    } else if (httpsAvailable && !isHttps && !httpRedirects) {
      status = "warning";
      summary = "HTTPS is available but HTTP does not redirect to HTTPS.";
      recommendation = httpsRecommendation();
    } else if (httpsAvailable) {
      summary = "HTTPS is properly configured.";
      if (!hasStrongHsts) {
        recommendation = hstsRecommendation();
      }
    }

    // Raw TLS inspection — best-effort, never escalates a
    // check to `error` on its own since it's a supplement to, not a
    // requirement for, the pass/warning/fail assessment above.
    const tlsTarget = shared.page.finalUrl.startsWith("https:")
      ? shared.page.finalUrl
      : isHttps
        ? url
        : undefined;
    const tls = tlsTarget ? await inspectTls(tlsTarget) : null;

    if (tls) {
      evidence.push(
        { label: "TLS version", value: tls.protocol, source: "tls" },
        {
          label: "Certificate authorized",
          value: tls.authorized,
          source: "tls",
        },
      );
      if (tls.issuer)
        evidence.push({
          label: "Certificate issuer",
          value: tls.issuer,
          source: "tls",
        });
      if (tls.validTo)
        evidence.push({
          label: "Certificate valid until",
          value: tls.validTo,
          source: "tls",
        });

      if (httpsAvailable && !tls.authorized) {
        // An invalid certificate is a more severe finding than anything
        // decided above (including a missing/weak HSTS header).
        status = "fail";
        summary = "The TLS certificate did not validate.";
        recommendation = invalidCertificateRecommendation(
          tls.authorizationError,
        );
      } else if (
        httpsAvailable &&
        tls.daysUntilExpiry !== undefined &&
        tls.daysUntilExpiry <= EXPIRY_WARNING_DAYS
      ) {
        status = status === "fail" ? status : "warning";
        summary = `HTTPS is configured, but the TLS certificate expires in ${tls.daysUntilExpiry} day(s).`;
        recommendation = certificateExpiringRecommendation(tls.daysUntilExpiry);
      }
    }

    if (hstsFinding.present && !hstsFinding.strong && httpsAvailable) {
      evidence.push({
        label: "Strict-Transport-Security",
        value: hstsFinding.note ?? "weak",
        source: "header",
      });
    }

    return {
      id: "https",
      label: "HTTPS & TLS",
      category: "http-security",
      status,
      summary,
      recommendation,
      data: {
        httpsAvailable,
        httpRedirects,
        tlsVersion: tls?.protocol ?? undefined,
        certificateIssuer: tls?.issuer,
        certificateExpiry: tls?.validTo,
        daysUntilExpiry: tls?.daysUntilExpiry,
      },
      evidence: evidence.length > 0 ? evidence : undefined,
      limitations: tls
        ? undefined
        : [
            "The raw TLS handshake used for certificate/protocol inspection could not complete (network conditions, timeout, or the target refusing a second connection) — TLS-specific fields are omitted rather than guessed.",
          ],
      durationMs: Math.round(performance.now() - start),
    };
  } catch {
    return {
      id: "https",
      label: "HTTPS & TLS",
      category: "http-security",
      status: "error",
      summary: "Unable to verify HTTPS configuration.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
