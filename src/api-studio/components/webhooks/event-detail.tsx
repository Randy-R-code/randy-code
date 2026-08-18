"use client";

import { CopyButton } from "@/api-studio/components/copy-button";
import type { WebhookEvent } from "@/api-studio/lib/webhooks/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatJson } from "@/json-studio/lib/format";
import { parseJson } from "@/json-studio/lib/parse";
import { RotateCcw } from "lucide-react";

function formattedBody(event: WebhookEvent): string {
  if (event.isBinary) {
    return `Binary content (${event.sizeBytes} bytes) — see Raw for the base64-encoded payload.`;
  }
  const parsed = parseJson(event.bodyText);
  return parsed.success ? formatJson(parsed.value) : event.bodyText;
}

function KeyValueList({ entries }: { entries: [string, string][] }) {
  if (entries.length === 0) {
    return <p className="py-2 text-sm text-zinc-400">None.</p>;
  }
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-background p-3 font-mono text-xs">
      {entries.map(([key, value]) => (
        <div key={key} className="break-all">
          <span className="text-brand-accent">{key}</span>
          <span className="text-zinc-500">: </span>
          <span className="text-foreground">{value}</span>
        </div>
      ))}
    </div>
  );
}

interface EventDetailProps {
  event: WebhookEvent;
  onReplay: (event: WebhookEvent) => void;
}

export function EventDetail({ event, onReplay }: EventDetailProps) {
  const queryEntries = Object.entries(event.query);
  const headerEntries = Object.entries(event.headers);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-mono font-semibold text-foreground">
            {event.method}
          </span>
          <span className="break-all text-zinc-400">{event.path}</span>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => onReplay(event)}
          className="border border-brand-accent/40 bg-brand-accent/10 text-brand-accent-hover hover:bg-brand-accent/20"
        >
          <RotateCcw className="size-3.5" />
          Replay
        </Button>
      </div>

      <Tabs defaultValue="body">
        <TabsList>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="raw">Raw</TabsTrigger>
          <TabsTrigger value="headers">
            Headers ({headerEntries.length})
          </TabsTrigger>
          <TabsTrigger value="query">Query ({queryEntries.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="body">
          <div className="flex flex-col gap-2">
            <CopyButton text={formattedBody(event)} />
            <pre className="max-h-128 overflow-auto rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground">
              {formattedBody(event)}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="raw">
          <div className="flex flex-col gap-2">
            <CopyButton text={event.bodyText} />
            <pre className="max-h-128 overflow-auto rounded-lg border border-border bg-background p-3 font-mono text-xs break-all whitespace-pre-wrap text-foreground">
              {event.bodyText || "(empty body)"}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="headers">
          <KeyValueList entries={headerEntries} />
        </TabsContent>

        <TabsContent value="query">
          <KeyValueList entries={queryEntries} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
