"use client";

import type {
  ExecuteRequestResult,
  RequestConfig,
} from "@/api-studio/lib/types";
import { useCallback, useRef, useState } from "react";

type SendState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "done"; result: ExecuteRequestResult };

/**
 * Talks to the Route Handler (not a Server Action, unlike InfraLens/MetaLens
 * — see app/api/api-studio/request/route.ts) specifically so `cancel()` can
 * abort the real in-flight HTTP request via a shared `AbortSignal`, not just
 * stop waiting for it client-side.
 */
export function useSendRequest() {
  const [state, setState] = useState<SendState>({ status: "idle" });
  const controllerRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (config: RequestConfig): Promise<ExecuteRequestResult> => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setState({ status: "pending" });

      let result: ExecuteRequestResult;
      try {
        const response = await fetch("/api/api-studio/request", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(config),
          signal: controller.signal,
        });
        result = (await response.json()) as ExecuteRequestResult;
      } catch (error) {
        result =
          error instanceof DOMException && error.name === "AbortError"
            ? { ok: false, kind: "internal", message: "Request cancelled." }
            : {
                ok: false,
                kind: "internal",
                message: "Could not reach the server.",
              };
      }

      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
      setState({ status: "done", result });
      return result;
    },
    [],
  );

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  return { state, send, cancel };
}
