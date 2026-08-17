export type AuthConfig =
  | { type: "none" }
  | { type: "bearer"; token: string }
  | { type: "basic"; username: string; password: string };

function encodeBase64(value: string): string {
  return typeof window !== "undefined"
    ? window.btoa(value)
    : Buffer.from(value, "utf-8").toString("base64");
}

/**
 * Layers the Auth tab's configuration onto the request's headers as a real
 * `Authorization` header — kept as its own tab rather than just another
 * header row (spec) so switching Auth mode never leaves a stale header
 * behind in the Headers editor.
 */
export function applyAuth(
  headers: Record<string, string>,
  auth: AuthConfig,
): Record<string, string> {
  switch (auth.type) {
    case "none":
      return headers;
    case "bearer":
      return auth.token
        ? { ...headers, Authorization: `Bearer ${auth.token}` }
        : headers;
    case "basic":
      return auth.username || auth.password
        ? {
            ...headers,
            Authorization: `Basic ${encodeBase64(`${auth.username}:${auth.password}`)}`,
          }
        : headers;
  }
}
