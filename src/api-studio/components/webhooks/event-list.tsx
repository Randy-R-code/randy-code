"use client";

import { relativeTime } from "@/api-studio/lib/format-time";
import type { WebhookEventSummary } from "@/api-studio/lib/webhooks/types";
import { brand } from "@/lib/brand";

interface EventListProps {
  events: WebhookEventSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function EventList({ events, selectedId, onSelect }: EventListProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-zinc-400">
        Listening — send a request to this endpoint to see it appear here.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {events.map((event) => {
        const selected = event.id === selectedId;
        return (
          <li key={event.id}>
            <button
              type="button"
              onClick={() => onSelect(event.id)}
              aria-current={selected}
              className={
                selected
                  ? "flex w-full items-center gap-2 rounded-lg border border-brand-accent/40 bg-brand-accent/10 px-3 py-2 text-left"
                  : "flex w-full items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2 text-left hover:border-brand-accent/30"
              }
            >
              <span
                className="shrink-0 rounded px-1.5 py-0.5 font-mono text-xs font-semibold"
                style={{
                  backgroundColor: `${brand.colors.green[500]}18`,
                  color: brand.colors.green[500],
                }}
              >
                {event.method}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                Event {event.id.slice(0, 8)}
              </span>
              <span className="shrink-0 text-xs text-zinc-500">
                {relativeTime(event.timestamp)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
