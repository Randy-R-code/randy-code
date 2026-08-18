"use client";

import { CopyButton } from "@/api-studio/components/copy-button";
import { EventDetail } from "@/api-studio/components/webhooks/event-detail";
import { EventList } from "@/api-studio/components/webhooks/event-list";
import { useWebhookListener } from "@/api-studio/hooks/use-webhook-listener";
import type { WebhookEvent } from "@/api-studio/lib/webhooks/types";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/brand";
import {
  createWebhookEndpoint,
  getWebhookEvent,
} from "@app/tools/api-studio/actions/webhooks";
import { Loader2, Radio } from "lucide-react";
import { useState } from "react";

type State =
  | { status: "idle" }
  | { status: "creating" }
  | { status: "error"; message: string }
  | { status: "listening"; token: string; url: string; expiresAt: number };

interface WebhooksWorkspaceProps {
  onReplay: (event: WebhookEvent) => void;
}

export function WebhooksWorkspace({ onReplay }: WebhooksWorkspaceProps) {
  const [state, setState] = useState<State>({ status: "idle" });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);

  const token = state.status === "listening" ? state.token : null;
  const events = useWebhookListener(token);

  async function handleCreate() {
    setState({ status: "creating" });
    setSelectedId(null);
    setSelectedEvent(null);

    const result = await createWebhookEndpoint();
    if (!result.ok) {
      setState({ status: "error", message: result.message });
      return;
    }
    setState({ status: "listening", ...result.data });
  }

  async function handleSelect(id: string) {
    if (!token) return;
    setSelectedId(id);
    setSelectedEvent(await getWebhookEvent(token, id));
  }

  if (state.status === "idle" || state.status === "creating") {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-zinc-400">
          Generate a temporary URL and inspect any request sent to it — no
          account, 24h lifetime, up to 50 events retained.
        </p>
        <Button
          type="button"
          onClick={handleCreate}
          disabled={state.status === "creating"}
          className="border border-brand-accent/40 bg-brand-accent/10 text-brand-accent-hover hover:bg-brand-accent/20"
        >
          {state.status === "creating" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Radio className="size-4" />
          )}
          Create endpoint
        </Button>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex flex-col items-start gap-3">
        <div
          className="rounded-lg border p-4 text-sm"
          style={{
            borderColor: `${brand.colors.functional.danger}40`,
            background: `${brand.colors.functional.danger}10`,
            color: brand.colors.functional.danger,
          }}
        >
          {state.message}
        </div>
        <Button type="button" variant="outline" onClick={handleCreate}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 rounded-lg border border-brand-accent/30 bg-brand-accent/5 p-4">
        <div className="flex items-center gap-1.5 text-sm font-medium text-brand-accent-hover">
          <Radio className="size-3.5 animate-pulse" />
          Listening
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <code className="break-all rounded bg-background px-2 py-1 text-sm text-foreground">
            {state.url}
          </code>
          <CopyButton text={state.url} />
        </div>
        <p className="text-xs text-zinc-500">
          Expires in 24 hours · up to 50 events retained
        </p>
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {events.length} event{events.length === 1 ? "" : "s"} received.
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <EventList
          events={events}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
        {selectedEvent ? (
          <EventDetail event={selectedEvent} onReplay={onReplay} />
        ) : (
          <p className="text-sm text-zinc-400">
            Select an event to inspect it.
          </p>
        )}
      </div>
    </div>
  );
}
