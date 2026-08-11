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
): Promise<ChecksResponse> {
  // Rate limiting
  const identifier = await getClientIdentifier();
  const rateLimit = checkRateLimit(identifier);

  if (!rateLimit.allowed) {
    logWarn({ event: "rate_limit_exceeded" });
    throw new Error(
      `Rate limit exceeded. Please wait ${Math.ceil(
        (rateLimit.resetAt - Date.now()) / 1000,
      )} seconds before trying again.`,
    );
  }

  let validated;
  try {
    const target = normalizeTarget(inputUrl);
    validated = await resolveValidatedTarget(target);
  } catch (error) {
    if (isSecurityError(error)) {
      logWarn({ event: "target_rejected", reason: error.name });
      throw new Error(error.userMessage);
    }
    throw error;
  }

  const response = await runChecks({
    url: validated.url,
    hostname: validated.hostname,
    timeout: CHECK_TIMEOUT_MS,
  });

  return response;
}
