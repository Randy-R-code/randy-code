"use client";

import { CopyButton } from "@/api-studio/components/copy-button";
import type { ExecuteRequestResult } from "@/api-studio/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatJson } from "@/json-studio/lib/format";
import { parseJson } from "@/json-studio/lib/parse";
import { brand } from "@/lib/brand";
import { StatusLine } from "./status-line";

function formattedBody(
  result: Extract<ExecuteRequestResult, { ok: true }>,
): string {
  if (result.isBinary) {
    return `Binary content (${result.sizeBytes} bytes) — see Raw for the base64-encoded payload.`;
  }
  const parsed = parseJson(result.bodyText);
  return parsed.success ? formatJson(parsed.value) : result.bodyText;
}

export function ResponseViewer({ result }: { result: ExecuteRequestResult }) {
  if (!result.ok) {
    return (
      <div
        className="rounded-lg border p-4 text-sm"
        style={{
          borderColor: `${brand.colors.functional.danger}40`,
          background: `${brand.colors.functional.danger}10`,
          color: brand.colors.functional.danger,
        }}
      >
        {result.message}
      </div>
    );
  }

  const headerEntries = Object.entries(result.headers);

  return (
    <div className="flex flex-col gap-3">
      <StatusLine
        status={result.status}
        statusText={result.statusText}
        durationMs={result.durationMs}
        sizeBytes={result.sizeBytes}
      />

      <Tabs defaultValue="body">
        <TabsList>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="raw">Raw</TabsTrigger>
          <TabsTrigger value="headers">
            Headers ({headerEntries.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="body">
          <div className="flex flex-col gap-2">
            <CopyButton text={formattedBody(result)} />
            <pre className="max-h-128 overflow-auto rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground">
              {formattedBody(result)}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="raw">
          <div className="flex flex-col gap-2">
            <CopyButton text={result.bodyText} />
            <pre className="max-h-128 overflow-auto rounded-lg border border-border bg-background p-3 font-mono text-xs break-all whitespace-pre-wrap text-foreground">
              {result.bodyText || "(empty body)"}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="headers">
          {headerEntries.length === 0 ? (
            <p className="py-2 text-sm text-zinc-400">No response headers.</p>
          ) : (
            <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-background p-3 font-mono text-xs">
              {headerEntries.map(([name, value]) => (
                <div key={name} className="break-all">
                  <span className="text-brand-accent">{name}</span>
                  <span className="text-zinc-500">: </span>
                  <span className="text-foreground">{value}</span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
