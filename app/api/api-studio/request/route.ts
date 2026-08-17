import {
  CONCURRENCY_TTL_SECONDS,
  MAX_CONCURRENT_REQUESTS_PER_CLIENT,
} from "@/api-studio/config/constants";
import {
  executeRequest,
  parseRequestConfig,
} from "@/api-studio/lib/execute-request";
import type { ErrorKind } from "@/api-studio/lib/types";
import { checkRateLimit, type RateLimitResult } from "@/lib/rate-limit";
import { acquireConcurrencySlot } from "@/lib/rate-limit/concurrency";
import { getClientIdentifier } from "@/lib/rate-limit/identifier";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function statusForKind(kind: ErrorKind): number {
  switch (kind) {
    case "invalid_config":
    case "blocked_destination":
      return 400;
    case "rate_limited":
      return 429;
    case "timeout":
      return 504;
    case "dns_or_connection":
    case "oversized":
      return 502;
    case "internal":
      return 500;
  }
}

function rateLimitMessage(rateLimit: RateLimitResult): string {
  return rateLimit.reason === "backend_error"
    ? "Rate limiting is temporarily unavailable. Please try again shortly."
    : "Too many requests. Please slow down and try again.";
}

export async function POST(request: Request) {
  const identifier = getClientIdentifier(request.headers);

  const rateLimit = await checkRateLimit("apiStudioRequest", identifier);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        kind: "rate_limited",
        message: rateLimitMessage(rateLimit),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(0, Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
          ),
        },
      },
    );
  }

  const { result: concurrency, release } = await acquireConcurrencySlot({
    resource: "api-studio",
    identifier,
    maxConcurrent: MAX_CONCURRENT_REQUESTS_PER_CLIENT,
    ttlSeconds: CONCURRENCY_TTL_SECONDS,
  });
  if (!concurrency.allowed) {
    return NextResponse.json(
      {
        ok: false,
        kind: "rate_limited",
        message:
          "Too many requests are already in flight. Wait for one to finish.",
      },
      { status: 429 },
    );
  }

  try {
    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return NextResponse.json(
        {
          ok: false,
          kind: "invalid_config",
          message: "Request body must be valid JSON.",
        },
        { status: 400 },
      );
    }

    const parsed = parseRequestConfig(raw);
    if ("error" in parsed) {
      return NextResponse.json(
        { ok: false, kind: "invalid_config", message: parsed.error },
        { status: 400 },
      );
    }

    const result = await executeRequest(parsed, request.signal);
    return NextResponse.json(result, {
      status: result.ok ? 200 : statusForKind(result.kind),
    });
  } finally {
    await release();
  }
}
