import { TLS_INSPECTION_TIMEOUT_MS } from "@infralens-config/constants";
import * as tls from "node:tls";
import { resolveValidatedTarget } from "./resolve-target";
import { normalizeTarget } from "./target";

export type TlsInspection = {
  /** Negotiated protocol, e.g. "TLSv1.3", or null if the handshake didn't report one. */
  protocol: string | null;
  issuer?: string;
  /** Certificate expiry as reported by the peer, verbatim. */
  validTo?: string;
  daysUntilExpiry?: number;
  /** False if the certificate chain didn't validate (self-signed, expired, hostname mismatch, ...). */
  authorized: boolean;
  authorizationError?: string;
};

function firstValue(field: string | string[] | undefined): string | undefined {
  return Array.isArray(field) ? field[0] : field;
}

/**
 * Opens a raw TLS connection to inspect the certificate and negotiated
 * protocol version — `fetch`/undici don't expose this, so it needs its own
 * primitive (master plan §11.3). Connects directly to the already-validated
 * IP with `servername` set for SNI/hostname verification, the same
 * resolve-once-then-pin discipline as `safeFetch` (master plan §8.4) — no
 * fresh DNS lookup happens at connect time. `rejectUnauthorized: false` so
 * an invalid certificate (self-signed, expired, mismatched) is reported as
 * a finding via `authorized`/`authorizationError` instead of just failing
 * the connection outright.
 *
 * Returns `null` on any failure (non-https target, DNS/SSRF validation
 * failure, timeout, connection error) — TLS inspection is a best-effort
 * supplement, never a reason to call a whole analysis "dangerous" when the
 * information simply isn't retrievable in this environment (master plan
 * §11.3's own caution about serverless network conditions).
 */
export async function inspectTls(
  url: string,
  timeoutMs: number = TLS_INSPECTION_TIMEOUT_MS,
): Promise<TlsInspection | null> {
  let ip: string;
  let hostname: string;

  try {
    const target = normalizeTarget(url);
    if (target.protocol !== "https:") return null;
    const validated = await resolveValidatedTarget(target);
    ip = validated.ip;
    hostname = validated.hostname;
  } catch {
    return null;
  }

  return new Promise((resolve) => {
    let settled = false;
    const finish = (result: TlsInspection | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.destroy();
      resolve(result);
    };

    const timer = setTimeout(() => finish(null), timeoutMs);

    const socket = tls.connect(
      {
        host: ip,
        port: 443,
        servername: hostname,
        rejectUnauthorized: false,
      },
      () => {
        const cert = socket.getPeerCertificate();
        const protocol = socket.getProtocol();

        let issuer: string | undefined;
        let validTo: string | undefined;
        let daysUntilExpiry: number | undefined;

        if (cert && Object.keys(cert).length > 0) {
          issuer = firstValue(cert.issuer?.O) ?? firstValue(cert.issuer?.CN);
          validTo = cert.valid_to;
          if (validTo) {
            const expiry = new Date(validTo).getTime();
            if (!Number.isNaN(expiry)) {
              daysUntilExpiry = Math.round(
                (expiry - Date.now()) / (1000 * 60 * 60 * 24),
              );
            }
          }
        }

        finish({
          protocol,
          issuer,
          validTo,
          daysUntilExpiry,
          authorized: socket.authorized,
          authorizationError: socket.authorized
            ? undefined
            : socket.authorizationError?.message,
        });
      },
    );

    socket.on("error", () => finish(null));
  });
}
