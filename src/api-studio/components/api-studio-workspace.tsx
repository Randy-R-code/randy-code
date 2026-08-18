"use client";

import { CodegenPanel } from "@/api-studio/components/codegen-panel";
import { HistoryPanel } from "@/api-studio/components/history/history-panel";
import { RequestBuilder } from "@/api-studio/components/request-builder/request-builder";
import { ResponseViewer } from "@/api-studio/components/response-viewer/response-viewer";
import { EXAMPLE_REQUEST } from "@/api-studio/config/constants";
import { useRequestHistory } from "@/api-studio/hooks/use-request-history";
import { useSendRequest } from "@/api-studio/hooks/use-send-request";
import type { AuthConfig } from "@/api-studio/lib/auth";
import { buildRequestConfig } from "@/api-studio/lib/build-request-config";
import type { HistoryEntry } from "@/api-studio/lib/history/types";
import {
  applyParamsToUrl,
  paramsFromUrl,
  recordToRows,
  type KeyValueRow,
} from "@/api-studio/lib/serialize";
import type {
  BodyMode,
  HttpMethod,
  RequestConfig,
} from "@/api-studio/lib/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type WorkspaceState = {
  method: HttpMethod;
  url: string;
  paramRows: KeyValueRow[];
  headerRows: KeyValueRow[];
  auth: AuthConfig;
  bodyMode: BodyMode;
  bodyValue: string;
};

const INITIAL_STATE: WorkspaceState = {
  method: "GET",
  url: "",
  paramRows: [],
  headerRows: [],
  auth: { type: "none" },
  bodyMode: "none",
  bodyValue: "",
};

function loadFromConfig(config: RequestConfig): WorkspaceState {
  return {
    method: config.method,
    url: config.url,
    paramRows: paramsFromUrl(config.url),
    headerRows: recordToRows(config.headers),
    auth: { type: "none" },
    bodyMode: config.body ? "text" : "none",
    bodyValue: config.body ?? "",
  };
}

interface ApiStudioWorkspaceProps {
  /** Prefills the builder from a captured webhook event (see api-studio-page.tsx's Replay wiring) — pass a new object each time to seed a fresh state. */
  initialSeed?: RequestConfig;
}

export function ApiStudioWorkspace({
  initialSeed,
}: ApiStudioWorkspaceProps = {}) {
  const [state, setState] = useState<WorkspaceState>(() =>
    initialSeed ? loadFromConfig(initialSeed) : INITIAL_STATE,
  );
  const { state: sendState, send, cancel, reset } = useSendRequest();
  const history = useRequestHistory();

  const pending = sendState.status === "pending";

  async function handleSend() {
    const config = buildRequestConfig(state);
    const result = await send(config);
    await history.save({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      request: config,
      response: result,
    });
  }

  function handleReopen(entry: HistoryEntry) {
    setState(loadFromConfig(entry.request));
  }

  function handleLoadExample() {
    setState(loadFromConfig(EXAMPLE_REQUEST));
  }

  async function handleResend(entry: HistoryEntry) {
    setState(loadFromConfig(entry.request));
    const result = await send(entry.request);
    await history.save({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      request: entry.request,
      response: result,
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <RequestBuilder
        method={state.method}
        url={state.url}
        params={state.paramRows}
        headers={state.headerRows}
        auth={state.auth}
        bodyMode={state.bodyMode}
        bodyValue={state.bodyValue}
        pending={pending}
        onMethodChange={(method) => setState((s) => ({ ...s, method }))}
        onUrlChange={(url) => setState((s) => ({ ...s, url }))}
        onParamsChange={(paramRows) =>
          setState((s) => ({
            ...s,
            paramRows,
            url: applyParamsToUrl(s.url, paramRows),
          }))
        }
        onHeadersChange={(headerRows) =>
          setState((s) => ({ ...s, headerRows }))
        }
        onAuthChange={(auth) => setState((s) => ({ ...s, auth }))}
        onBodyModeChange={(bodyMode) => setState((s) => ({ ...s, bodyMode }))}
        onBodyValueChange={(bodyValue) =>
          setState((s) => ({ ...s, bodyValue }))
        }
        onSend={handleSend}
        onCancel={cancel}
        onLoadExample={handleLoadExample}
      />

      <div role="status" aria-live="polite" className="sr-only">
        {pending && "Sending request…"}
        {sendState.status === "done" &&
          (sendState.result.ok
            ? `Response received: ${sendState.result.status} ${sendState.result.statusText}.`
            : sendState.result.message)}
      </div>

      {sendState.status === "done" && (
        <section aria-label="Response">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Response</h2>
            <Button type="button" variant="ghost" size="sm" onClick={reset}>
              Clear
            </Button>
          </div>
          <ResponseViewer result={sendState.result} />
        </section>
      )}

      <section aria-label="Generate code">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Code</h2>
        {state.url.trim() === "" ? (
          <p className="text-sm text-zinc-400">Enter a URL to generate code.</p>
        ) : (
          <CodegenPanel config={buildRequestConfig(state)} />
        )}
      </section>

      <section aria-label="Request history">
        <h2 className="mb-3 text-sm font-semibold text-foreground">History</h2>
        <HistoryPanel
          entries={history.entries}
          onReopen={handleReopen}
          onResend={handleResend}
          onRemove={history.remove}
          onClear={history.clear}
        />
      </section>
    </div>
  );
}
