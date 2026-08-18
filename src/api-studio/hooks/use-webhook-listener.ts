"use client";

import { WEBHOOK_POLL_INTERVAL_MS } from "@/api-studio/config/constants";
import type { WebhookEventSummary } from "@/api-studio/lib/webhooks/types";
import { listWebhookEvents } from "@app/tools/api-studio/actions/webhooks";
import { useEffect, useSyncExternalStore } from "react";

const EMPTY: WebhookEventSummary[] = [];

let cached: WebhookEventSummary[] = EMPTY;
let listeners: Array<() => void> = [];

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function getSnapshot(): WebhookEventSummary[] {
  return cached;
}

function getServerSnapshot(): WebhookEventSummary[] {
  return EMPTY;
}

/**
 * Polls `listWebhookEvents` every `WEBHOOK_POLL_INTERVAL_MS` while `token`
 * is non-null (lightweight polling instead of SSE — see the plan's
 * reasoning: no `vercel.json`/`maxDuration` in this repo, so a long-lived
 * connection would be at the mercy of the default serverless function
 * duration limit), and stops on unmount or when the token changes/clears.
 *
 * Same `useSyncExternalStore` + module-level cache shape as
 * `use-request-history.ts`, for the same reason: `notify()` triggers a
 * re-read of `getSnapshot()` through the external-store subscription
 * protocol — never a raw `setState` call from inside the effect.
 */
export function useWebhookListener(
  token: string | null,
): WebhookEventSummary[] {
  const events = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    cached = EMPTY;
    notify();

    if (!token) {
      return;
    }

    let cancelled = false;

    async function poll() {
      const result = await listWebhookEvents(token as string);
      if (cancelled) return;
      cached = result;
      notify();
    }

    void poll();
    const interval = setInterval(poll, WEBHOOK_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token]);

  return events;
}
