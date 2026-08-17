"use client";

import { copyToClipboard } from "@/api-studio/lib/clipboard";
import { toCurl } from "@/api-studio/lib/codegen/to-curl";
import { toFetch } from "@/api-studio/lib/codegen/to-fetch";
import type { RequestConfig } from "@/api-studio/lib/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

function Snippet({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={async () => {
          const ok = await copyToClipboard(code);
          if (ok) {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }
        }}
        className="self-start"
      >
        {copied ? (
          <Check className="size-3.5" />
        ) : (
          <Copy className="size-3.5" />
        )}
        {copied ? "Copied" : "Copy"}
      </Button>
      <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-background p-3 font-mono text-xs whitespace-pre-wrap text-foreground">
        {code}
      </pre>
    </div>
  );
}

export function CodegenPanel({ config }: { config: RequestConfig }) {
  return (
    <Tabs defaultValue="fetch">
      <TabsList>
        <TabsTrigger value="fetch">fetch</TabsTrigger>
        <TabsTrigger value="curl">curl</TabsTrigger>
      </TabsList>
      <TabsContent value="fetch">
        <Snippet code={toFetch(config)} />
      </TabsContent>
      <TabsContent value="curl">
        <Snippet code={toCurl(config)} />
      </TabsContent>
    </Tabs>
  );
}
