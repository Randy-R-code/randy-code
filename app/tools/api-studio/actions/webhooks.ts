"use server";

import {
  createEndpoint,
  getEvent,
  listEvents,
} from "@/api-studio/lib/webhooks/store";
import type {
  WebhookEvent,
  WebhookEventSummary,
} from "@/api-studio/lib/webhooks/types";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIdentifier } from "@/lib/rate-limit/identifier";
import { headers } from "next/headers";

// Matches InfraLens's/MetaLens's own action result shape — a safe,
// UI-ready message travels back as ordinary data instead of a thrown
// Server Action error (which Next redacts in production).
export type CreateWebhookResult =
  | { ok: true; data: { token: string; url: string; expiresAt: number } }
  | { ok: false; message: string };

/** `x-forwarded-proto`/`host` — same trust posture as the client-identifier helper: Vercel's edge sets these, so they're safe to build an absolute, immediately-usable webhook URL from (no hardcoded production domain, works in local dev too). */
async function buildOrigin(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "randy-code.dev";
  const proto = headersList.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

export async function createWebhookEndpoint(): Promise<CreateWebhookResult> {
  const identifier = getClientIdentifier(await headers());
  const rateLimit = await checkRateLimit("apiStudioWebhookCreate", identifier);

  if (!rateLimit.allowed) {
    if (rateLimit.reason === "backend_error") {
      return {
        ok: false,
        message:
          "Webhook creation is temporarily unavailable. Please try again shortly.",
      };
    }
    const secondsLeft = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    return {
      ok: false,
      message: `Rate limit exceeded. Please wait ${secondsLeft} second${
        secondsLeft === 1 ? "" : "s"
      } before trying again.`,
    };
  }

  const endpoint = await createEndpoint();
  if (!endpoint) {
    return {
      ok: false,
      message:
        "Webhook creation is temporarily unavailable. Please try again shortly.",
    };
  }

  const origin = await buildOrigin();
  return {
    ok: true,
    data: {
      token: endpoint.token,
      url: `${origin}/api/api-studio/webhooks/${endpoint.token}`,
      expiresAt: endpoint.expiresAt,
    },
  };
}

/** Lightweight summaries for the polling list — deliberately excludes full body/headers to keep poll payloads small (see `use-webhook-listener.ts`). */
export async function listWebhookEvents(
  token: string,
): Promise<WebhookEventSummary[]> {
  return listEvents(token);
}

/** Full detail, fetched on demand once an event is selected — mirrors V1 history's reopen-on-demand pattern. `null` covers both "never existed" and "evicted/expired" identically. */
export async function getWebhookEvent(
  token: string,
  id: string,
): Promise<WebhookEvent | null> {
  return getEvent(token, id);
}
