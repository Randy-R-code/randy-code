import {
  WEBHOOK_MAX_BODY_BYTES,
  WEBHOOK_MAX_HEADER_COUNT,
} from "@/api-studio/config/constants";
import { isTextLikeContentType } from "@/api-studio/lib/content-type";
import { appendEvent, getEndpointMeta } from "@/api-studio/lib/webhooks/store";
import type { WebhookEvent } from "@/api-studio/lib/webhooks/types";
import { checkRateLimit } from "@/lib/rate-limit";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ token: string }> };

/**
 * Reads the incoming body up to `maxBytes`, deciding UTF-8 vs base64 the
 * same way the outbound proxy does (`content-type.ts`). Returns `null` to
 * signal "oversized" instead of throwing — this is untrusted inbound
 * traffic from arbitrary senders, not a case worth an exception for.
 */
async function readCappedBody(
  request: Request,
  maxBytes: number,
): Promise<{ bodyText: string; isBinary: boolean; sizeBytes: number } | null> {
  if (!request.body) {
    return { bodyText: "", isBinary: false, sizeBytes: 0 };
  }

  const isBinary = !isTextLikeContentType(
    request.headers.get("content-type") ?? "",
  );

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      total += value.byteLength;
      if (total > maxBytes) {
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const buffer = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
  return {
    bodyText: isBinary ? buffer.toString("base64") : buffer.toString("utf-8"),
    isBinary,
    sizeBytes: buffer.byteLength,
  };
}

/** Stored *as sent* — inspecting a sender's own headers (e.g. `Stripe-Signature`) is the whole point, so nothing is stripped here the way the outbound proxy strips a client's request headers. Only capped in count, for storage sanity. */
function collectHeaders(request: Request): Record<string, string> {
  const headers: Record<string, string> = {};
  let count = 0;
  request.headers.forEach((value, key) => {
    if (count >= WEBHOOK_MAX_HEADER_COUNT) return;
    headers[key] = value;
    count++;
  });
  return headers;
}

function collectQuery(url: URL): Record<string, string> {
  const query: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    query[key] = value;
  });
  return query;
}

/**
 * The single entry point every exported HTTP method below delegates to.
 * A missing, expired, or never-existent token all return the exact same
 * generic 404 — this deliberately never gives a prober a way to tell those
 * three cases apart (see `store.ts`'s `getEndpointMeta`).
 */
async function handleIngest(
  request: Request,
  { params }: RouteContext,
): Promise<Response> {
  const { token } = await params;

  const endpoint = await getEndpointMeta(token);
  if (!endpoint) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const rateLimit = await checkRateLimit("apiStudioWebhookIngest", token);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const captured = await readCappedBody(request, WEBHOOK_MAX_BODY_BYTES);
  if (!captured) {
    return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  }

  const url = new URL(request.url);
  const event: WebhookEvent = {
    id: nanoid(),
    method: request.method,
    timestamp: Date.now(),
    sizeBytes: captured.sizeBytes,
    path: url.pathname,
    query: collectQuery(url),
    headers: collectHeaders(request),
    bodyText: captured.bodyText,
    isBinary: captured.isBinary,
  };

  const stored = await appendEvent(token, event);
  if (!stored) {
    // The endpoint expired between the meta check above and this write (a
    // rare race, not a bug) — same generic response as a straight miss.
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  // Most webhook senders expect a fast 2xx to consider delivery successful.
  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function GET(request: Request, ctx: RouteContext) {
  return handleIngest(request, ctx);
}
export async function POST(request: Request, ctx: RouteContext) {
  return handleIngest(request, ctx);
}
export async function PUT(request: Request, ctx: RouteContext) {
  return handleIngest(request, ctx);
}
export async function PATCH(request: Request, ctx: RouteContext) {
  return handleIngest(request, ctx);
}
export async function DELETE(request: Request, ctx: RouteContext) {
  return handleIngest(request, ctx);
}
