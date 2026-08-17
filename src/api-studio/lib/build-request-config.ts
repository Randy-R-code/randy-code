import { applyAuth, type AuthConfig } from "./auth";
import { applyParamsToUrl, rowsToRecord, type KeyValueRow } from "./serialize";
import type { BodyMode, HttpMethod, RequestConfig } from "./types";

const CONTENT_TYPE_BY_MODE: Record<Exclude<BodyMode, "none">, string> = {
  json: "application/json",
  text: "text/plain",
  "url-encoded": "application/x-www-form-urlencoded",
};

/**
 * Composes the workspace's editable state (method, base URL, param/header
 * rows, auth, body) into the flat `RequestConfig` the proxy actually sends.
 * An explicit header row always wins over the mode's default Content-Type —
 * this only fills a default, never overrides a value the user typed.
 */
export function buildRequestConfig(input: {
  method: HttpMethod;
  url: string;
  paramRows: KeyValueRow[];
  headerRows: KeyValueRow[];
  auth: AuthConfig;
  bodyMode: BodyMode;
  bodyValue: string;
}): RequestConfig {
  const url = applyParamsToUrl(input.url, input.paramRows);
  const contentTypeHeader: Record<string, string> =
    input.bodyMode === "none"
      ? {}
      : { "Content-Type": CONTENT_TYPE_BY_MODE[input.bodyMode] };
  const headers = applyAuth(
    { ...contentTypeHeader, ...rowsToRecord(input.headerRows) },
    input.auth,
  );

  return {
    method: input.method,
    url,
    headers,
    body: input.bodyMode === "none" ? undefined : input.bodyValue,
  };
}
