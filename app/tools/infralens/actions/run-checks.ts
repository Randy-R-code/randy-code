"use server";

import { CHECK_TIMEOUT_MS } from "@infralens-config/constants";
import { runChecks } from "@infralens-lib/checks";
import { ChecksResponse } from "@infralens-lib/checks/types";
import { logWarn } from "@infralens-lib/log";
import { checkRateLimit } from "@infralens-lib/rate-limit";
import { isSecurityError } from "@infralens-lib/security/errors";
import { resolveValidatedTarget } from "@infralens-lib/security/resolve-target";
import { normalizeTarget } from "@infralens-lib/security/target";
import { headers } from "next/headers";

// Returned instead of thrown for every expected rejection (rate limit,
// SSRF/target validation, malformed URL). Next.js redacts the .message of
// any Error actually thrown out of a Server Action in production builds —
// these messages are deliberately written to be safe and useful to show as
// UI copy, so they need to travel back as ordinary data instead. A truly
// unexpected failure (a bug in runChecks itself) still throws and gets
// Next's generic production message, which is the correct behavior for
// something that was never meant to happen.
export type RunChecksResult =
  | { ok: true; data: ChecksResponse }
  | { ok: false; message: string };

async function getClientIdentifier(): Promise<string> {
  const headersList = await headers();
  // Try to get IP from various headers (Vercel, Cloudflare, etc.)
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const cfConnectingIp = headersList.get("cf-connecting-ip");

  const ip =
    forwardedFor?.split(",")[0]?.trim() ||
    realIp ||
    cfConnectingIp ||
    "unknown";

  return ip;
}

export async function runInfraChecks(
  inputUrl: string,
): Promise<RunChecksResult> {
  // Rate limiting
  const identifier = await getClientIdentifier();
  const rateLimit = checkRateLimit(identifier);

  if (!rateLimit.allowed) {
    logWarn({ event: "rate_limit_exceeded" });
    const secondsLeft = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    return {
      ok: false,
      message: `Rate limit exceeded. Please wait ${secondsLeft} second${
        secondsLeft === 1 ? "" : "s"
      } before trying again.`,
    };
  }

  let validated;
  try {
    const target = normalizeTarget(inputUrl);
    validated = await resolveValidatedTarget(target);
  } catch (error) {
    if (isSecurityError(error)) {
      logWarn({ event: "target_rejected", reason: error.name });
      return { ok: false, message: error.userMessage };
    }
    if (error instanceof TypeError) {
      return {
        ok: false,
        message:
          "Invalid URL format. Please enter a valid URL (e.g., https://example.com)",
      };
    }
    throw error;
  }

  const response = await runChecks({
    url: validated.url,
    hostname: validated.hostname,
    timeout: CHECK_TIMEOUT_MS,
  });

  return { ok: true, data: response };
}
