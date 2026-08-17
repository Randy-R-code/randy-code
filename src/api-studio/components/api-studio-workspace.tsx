"use client";

import { CodegenPanel } from "@/api-studio/components/codegen-panel";
import { HistoryPanel } from "@/api-studio/components/history/history-panel";
import { RequestBuilder } from "@/api-studio/components/request-builder/request-builder";
import { ResponseViewer } from "@/api-studio/components/response-viewer/response-viewer";
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

export function ApiStudioWorkspace() {
  const [state, setState] = useState<WorkspaceState>(INITIAL_STATE);
  const { state: sendState, send, cancel } = useSendRequest();
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
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Response
          </h2>
          <ResponseViewer result={sendState.result} />
        </section>
      )}

      <section aria-label="Generate code">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Code</h2>
        <CodegenPanel config={buildRequestConfig(state)} />
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
