"use client";

import { ApiStudioWorkspace } from "@/api-studio/components/api-studio-workspace";
import { WebhooksWorkspace } from "@/api-studio/components/webhooks/webhooks-workspace";
import type { RequestConfig } from "@/api-studio/lib/types";
import { eventToRequestConfig } from "@/api-studio/lib/webhooks/replay";
import type { WebhookEvent } from "@/api-studio/lib/webhooks/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

/**
 * Top-level Request/Webhooks switcher (spec's own `API Studio / Request |
 * Webhooks` mockup). Owns just enough state to seed the Request tab from a
 * webhook event on Replay — `replaySeed.key` changes on every Replay click
 * and is used as `ApiStudioWorkspace`'s React `key`, forcing a clean remount
 * with the new initial state rather than reaching into its internals.
 */
export function ApiStudioPage() {
  const [tab, setTab] = useState("request");
  const [replaySeed, setReplaySeed] = useState<{
    config: RequestConfig;
    key: number;
  } | null>(null);

  function handleReplay(event: WebhookEvent) {
    setReplaySeed((previous) => ({
      config: eventToRequestConfig(event),
      key: (previous?.key ?? 0) + 1,
    }));
    setTab("request");
  }

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="request">Request</TabsTrigger>
        <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
      </TabsList>

      <TabsContent value="request">
        <ApiStudioWorkspace
          key={replaySeed?.key ?? 0}
          initialSeed={replaySeed?.config}
        />
      </TabsContent>

      <TabsContent value="webhooks">
        <WebhooksWorkspace onReplay={handleReplay} />
      </TabsContent>
    </Tabs>
  );
}
