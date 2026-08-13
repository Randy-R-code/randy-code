import { Recommendation } from "@infralens-lib/checks/types";

export function securityHeadersRecommendation(
  missing: string[],
  weak: string[] = [],
): Recommendation {
  const missingSteps = missing.map(
    (h) => `Add the "${h}" header with an appropriate value on the server.`,
  );
  const weakSteps = weak.map(
    (h) => `Tighten the "${h}" header — it's present but uses a weak value.`,
  );

  return {
    id: "missing-security-headers",
    title:
      missing.length > 0
        ? "Missing security headers"
        : "Weak security header values",
    description:
      missing.length > 0
        ? "Some important HTTP security headers are not present in the response."
        : "Some security headers are present but use permissive values that reduce their effectiveness.",
    impact:
      "Missing or weak headers may expose users to attacks like XSS, clickjacking, or data injection.",
    howTo: [...missingSteps, ...weakSteps],
    severity: missing.some((h) => h.includes("Content-Security-Policy"))
      ? "critical"
      : "warning",
    references: [
      {
        label: "OWASP Secure Headers Project",
        url: "https://owasp.org/www-project-secure-headers/",
      },
      {
        label: "MDN – Content-Security-Policy",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy",
      },
    ],
  };
}

export function httpsRecommendation(): Recommendation {
  return {
    id: "https-not-enforced",
    title: "HTTPS is not enforced",
    description:
      "The website does not consistently redirect HTTP traffic to HTTPS.",
    impact: "Unencrypted traffic can be intercepted or modified by attackers.",
    howTo: [
      "Enable HTTPS on the server.",
      "Redirect all HTTP requests to HTTPS.",
      "Enable HSTS once HTTPS is stable.",
    ],
    severity: "critical",
    references: [
      {
        label: "MDN – HTTPS",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
      },
    ],
  };
}

export function hstsRecommendation(): Recommendation {
  return {
    id: "missing-hsts",
    title: "HSTS is not enabled",
    description: "The Strict-Transport-Security header is not present.",
    impact: "Users may be vulnerable to downgrade attacks or SSL stripping.",
    howTo: [
      "Add the Strict-Transport-Security header.",
      "Start with a low max-age value (e.g., 300 seconds).",
      "Increase max-age once validated.",
    ],
    severity: "warning",
    references: [
      {
        label: "MDN – Strict-Transport-Security",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security",
      },
    ],
  };
}

export function certificateExpiringRecommendation(
  daysUntilExpiry: number,
): Recommendation {
  return {
    id: "certificate-expiring-soon",
    title: "TLS certificate expiring soon",
    description: `The TLS certificate expires in ${daysUntilExpiry} day(s).`,
    impact:
      "An expired certificate breaks HTTPS for every visitor until it's renewed.",
    howTo: [
      "Renew the certificate before it expires.",
      "Set up automatic renewal (e.g. via Let's Encrypt / ACME) if not already in place.",
    ],
    severity: daysUntilExpiry <= 7 ? "critical" : "warning",
    references: [
      {
        label: "Let's Encrypt – Certificate renewal",
        url: "https://letsencrypt.org/docs/faq/",
      },
    ],
  };
}

export function invalidCertificateRecommendation(
  reason?: string,
): Recommendation {
  return {
    id: "invalid-certificate",
    title: "TLS certificate did not validate",
    description: reason
      ? `The TLS certificate could not be validated: ${reason}.`
      : "The TLS certificate could not be validated.",
    impact:
      "Browsers will show a security warning to visitors, and automated tools may refuse the connection entirely.",
    howTo: [
      "Confirm the certificate is issued for this exact hostname.",
      "Confirm the certificate chain includes any required intermediate certificates.",
      "Confirm the certificate has not expired.",
    ],
    severity: "critical",
    references: [
      {
        label: "MDN – TLS/SSL certificate errors",
        url: "https://developer.mozilla.org/en-US/docs/Web/Security/Certificate_Transparency",
      },
    ],
  };
}

export function protocolDowngradeRecommendation(): Recommendation {
  return {
    id: "protocol-downgrade-in-redirect-chain",
    title: "Redirect chain downgrades from HTTPS to HTTP",
    description:
      "A redirect in the chain sends visitors from an https:// URL back to a plain http:// one.",
    impact:
      "Traffic becomes unencrypted for the rest of the chain, exposing it to interception or modification.",
    howTo: [
      "Ensure every redirect in the chain keeps traffic on HTTPS.",
      "Remove any intermediate step that redirects back to HTTP.",
    ],
    severity: "critical",
    references: [
      {
        label: "MDN – HTTPS",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
      },
    ],
  };
}

export function redirectLoopRecommendation(): Recommendation {
  return {
    id: "redirect-loop",
    title: "Redirect loop detected",
    description: "The website has a redirect loop that prevents access.",
    impact:
      "Users cannot access the website, and search engines may de-index the site.",
    howTo: [
      "Review the redirect chain configuration.",
      "Remove circular redirects.",
      "Ensure each redirect has a clear final destination.",
    ],
    severity: "critical",
  };
}

export function excessiveRedirectsRecommendation(
  count: number,
): Recommendation {
  return {
    id: "excessive-redirects",
    title: "Excessive redirects detected",
    description: `The website has ${count} redirects in the chain.`,
    impact:
      "Multiple redirects slow down page load times and degrade user experience and SEO.",
    howTo: [
      "Simplify the redirect chain.",
      "Use direct redirects to the final destination.",
      "Consider using a single redirect when possible.",
    ],
    severity: "warning",
  };
}

export function securityTxtMissingRecommendation(): Recommendation {
  return {
    id: "missing-security-txt",
    title: "security.txt not found",
    description:
      "No security.txt file was found at /.well-known/security.txt or /security.txt.",
    impact:
      "Security researchers have no standard way to report vulnerabilities responsibly.",
    howTo: [
      "Publish a security.txt file at /.well-known/security.txt (RFC 9116).",
      "Include at least a Contact and an Expires field.",
    ],
    severity: "info",
    references: [
      {
        label: "RFC 9116 – security.txt",
        url: "https://www.rfc-editor.org/rfc/rfc9116",
      },
    ],
  };
}

export function securityTxtMissingExpiresRecommendation(): Recommendation {
  return {
    id: "security-txt-missing-expires",
    title: "security.txt is missing the Expires field",
    description:
      "RFC 9116 requires an Expires field so researchers can tell whether the file is still current.",
    impact:
      "Without an Expires field, the file's freshness can't be verified and tools may treat it as stale.",
    howTo: [
      "Add an Expires field with a date-time no more than a year out (e.g. Expires: 2027-01-01T00:00:00z).",
    ],
    severity: "warning",
    references: [
      {
        label: "RFC 9116 – security.txt",
        url: "https://www.rfc-editor.org/rfc/rfc9116",
      },
    ],
  };
}

export function securityTxtExpiredRecommendation(
  expiresAt: string,
): Recommendation {
  return {
    id: "security-txt-expired",
    title: "security.txt has expired",
    description: `The Expires field (${expiresAt}) is in the past.`,
    impact:
      "RFC 9116 treats an expired file as stale — researchers and tools should no longer rely on it.",
    howTo: ["Update the Expires field to a current future date-time."],
    severity: "warning",
    references: [
      {
        label: "RFC 9116 – security.txt",
        url: "https://www.rfc-editor.org/rfc/rfc9116",
      },
    ],
  };
}

/** Only for SPF/DMARC — both live at a fixed, well-known DNS location, so their absence is something this check can actually confirm. DKIM has its own, deliberately softer recommendation below (see `dkimNotFoundRecommendation`) since it can't be confirmed absent the same way. */
export function dnsSecurityRecommendation(missing: string[]): Recommendation {
  return {
    id: "missing-dns-security",
    title: "Missing DNS security records",
    description: `The following DNS security records are missing: ${missing.join(
      ", ",
    )}.`,
    impact:
      "Missing DNS security records may expose the domain to email spoofing and delivery issues.",
    howTo: [
      missing.includes("SPF") &&
        'Add an SPF record (TXT record starting with "v=spf1") to your DNS.',
      missing.includes("DMARC") &&
        'Add a DMARC record (TXT record at "_dmarc.yourdomain.com" starting with "v=DMARC1").',
    ].filter(Boolean) as string[],
    severity: missing.includes("DMARC") ? "critical" : "warning",
    references: [
      {
        label: "DMARC Guide",
        url: "https://dmarc.org/wiki/FAQ",
      },
    ],
  };
}

export function spfMultipleRecordsRecommendation(): Recommendation {
  return {
    id: "spf-multiple-records",
    title: "Multiple SPF records found",
    description:
      "RFC 7208 allows only one SPF TXT record per domain; having more than one causes mail servers to treat SPF as failed (PermError).",
    impact:
      "Mail servers may reject or fail to validate legitimate outgoing mail because SPF becomes unparseable.",
    howTo: [
      'Merge all SPF mechanisms into a single TXT record starting with "v=spf1".',
      "Remove the duplicate records.",
    ],
    severity: "warning",
    references: [
      {
        label: "RFC 7208 – SPF",
        url: "https://www.rfc-editor.org/rfc/rfc7208",
      },
    ],
  };
}

export function dmarcWeakPolicyRecommendation(policy: string): Recommendation {
  return {
    id: "dmarc-weak-policy",
    title: "DMARC policy does not request enforcement",
    description: `The DMARC record's policy is "p=${policy}", which only monitors and doesn't ask receivers to act on failures.`,
    impact:
      "Spoofed mail using this domain isn't quarantined or rejected by receivers that honor DMARC.",
    howTo: [
      "Move to p=quarantine once SPF/DKIM alignment is confirmed via DMARC reports.",
      "Move to p=reject once quarantine shows no false positives.",
    ],
    severity: "info",
    references: [{ label: "DMARC Guide", url: "https://dmarc.org/wiki/FAQ" }],
  };
}

/**
 * Deliberately not framed as "DKIM is missing" — DKIM selector
 * names are chosen by whoever configured the domain's mail and aren't
 * published anywhere, so checking a handful of common ones can only ever
 * confirm presence, never absence.
 */
export function dkimNotFoundRecommendation(): Recommendation {
  return {
    id: "dkim-not-found-at-common-selectors",
    title: "No DKIM record found at commonly-used selectors",
    description:
      "This doesn't confirm DKIM is unused — the selector name is chosen by whoever configured the domain's mail and isn't discoverable without that information.",
    impact:
      "If DKIM genuinely isn't configured, outgoing mail is easier to spoof and more likely to be marked as spam.",
    howTo: [
      "Confirm with your email provider whether DKIM signing is enabled and what selector it uses.",
      "If it's not enabled, configure DKIM signing and publish the provided public key as a TXT record.",
    ],
    severity: "info",
    references: [
      {
        label: "DKIM Overview",
        url: "https://dkim.org/",
      },
    ],
  };
}
