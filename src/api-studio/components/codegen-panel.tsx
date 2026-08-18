"use client";

import { CopyButton } from "@/api-studio/components/copy-button";
import { toCurl } from "@/api-studio/lib/codegen/to-curl";
import { toFetch } from "@/api-studio/lib/codegen/to-fetch";
import type { RequestConfig } from "@/api-studio/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Snippet({ code }: { code: string }) {
  return (
    <div className="flex flex-col gap-2">
      <CopyButton text={code} />
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
