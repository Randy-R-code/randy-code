import {
  securityTxtExpiredRecommendation,
  securityTxtMissingExpiresRecommendation,
  securityTxtMissingRecommendation,
} from "@infralens-lib/recommendations/security";
import { readBodyText, safeFetch } from "@infralens-lib/security/safe-fetch";
import { CheckRunner } from "../types";

function parseExpires(content: string): string | undefined {
  const match = content.match(/^Expires:\s*(.+)$/im);
  return match?.[1]?.trim();
}

export const runSecurityTxtCheck: CheckRunner<{
  present: boolean;
  location?: string;
  hasContact: boolean;
  hasExpires: boolean;
  expiresAt?: string;
  expired: boolean;
  fields: string[];
}> = async ({ url, timeout }) => {
  const start = performance.now();

  try {
    const urlObj = new URL(url);
    const locations = [
      `${urlObj.origin}/.well-known/security.txt`,
      `${urlObj.origin}/security.txt`,
    ];

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      let foundLocation: string | undefined;
      let content: string | undefined;
      let status = 404;

      // Try both locations
      for (const loc of locations) {
        try {
          const response = await safeFetch(loc, {
            method: "GET",
            signal: controller.signal,
          });
          if (response.status === 200) {
            content = await readBodyText(response);
            // Verify it's actually a security.txt (contains Contact field)
            if (content.toLowerCase().includes("contact:")) {
              foundLocation = loc;
              status = 200;
              break;
            }
          }
        } catch {
          continue;
        }
      }

      clearTimeout(id);

      const present = status === 200 && !!content;
      const hasContact = content?.toLowerCase().includes("contact:") ?? false;
      const expiresAt = content ? parseExpires(content) : undefined;
      const hasExpires = !!expiresAt;

      // RFC 9116: an unparseable Expires value is as good as missing — the
      // file's freshness can't actually be verified from it.
      const expiresDate = expiresAt ? new Date(expiresAt) : undefined;
      const expiresValid =
        !!expiresDate && !Number.isNaN(expiresDate.getTime());
      const expired = expiresValid && expiresDate!.getTime() < Date.now();

      // Extract field names
      const fields: string[] = [];
      if (content) {
        const lines = content.split("\n");
        for (const line of lines) {
          const match = line.match(/^([A-Za-z-]+):/);
          if (match && !fields.includes(match[1])) {
            fields.push(match[1]);
          }
        }
      }

      let checkStatus: "pass" | "warning" | "fail" = "pass";
      let summary = "";
      let recommendation;

      if (!present) {
        checkStatus = "warning";
        summary =
          "security.txt not found. Consider adding one for security researchers.";
        recommendation = securityTxtMissingRecommendation();
      } else if (!hasExpires || !expiresValid) {
        checkStatus = "warning";
        summary =
          "security.txt found but missing a valid Expires field (required by RFC 9116).";
        recommendation = securityTxtMissingExpiresRecommendation();
      } else if (expired) {
        checkStatus = "fail";
        summary = `security.txt found but has expired (Expires: ${expiresAt}).`;
        recommendation = securityTxtExpiredRecommendation(expiresAt!);
      } else {
        summary = `security.txt found with ${fields.length} fields.`;
      }

      return {
        id: "security-txt",
        label: "security.txt",
        category: "http-security",
        status: checkStatus,
        summary,
        recommendation,
        data: {
          present,
          location: foundLocation,
          hasContact,
          hasExpires: hasExpires && expiresValid,
          expiresAt,
          expired,
          fields,
        },
        limitations: [
          "The Expires value is parsed with JavaScript's Date parser rather than a strict RFC 3339 grammar, so a malformed-but-Date-parseable value could be accepted as valid.",
        ],
        durationMs: Math.round(performance.now() - start),
      };
    } catch {
      clearTimeout(id);
      // A genuine fetch/network failure across both locations — the check
      // itself didn't run to completion, not a "site has no security.txt"
      // finding.
      return {
        id: "security-txt",
        label: "security.txt",
        category: "http-security",
        status: "error",
        summary: "Unable to fetch security.txt.",
        data: {
          present: false,
          hasContact: false,
          hasExpires: false,
          expired: false,
          fields: [],
        },
        durationMs: Math.round(performance.now() - start),
      };
    }
  } catch {
    return {
      id: "security-txt",
      label: "security.txt",
      category: "http-security",
      status: "error",
      summary: "Unable to check security.txt.",
      data: {
        present: false,
        hasContact: false,
        hasExpires: false,
        expired: false,
        fields: [],
      },
      durationMs: Math.round(performance.now() - start),
    };
  }
};
