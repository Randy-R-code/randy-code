import { DNS_TIMEOUT_MS } from "@infralens-config/constants";
import {
  resolve4,
  resolve6,
  resolveCaa,
  resolveCname,
  resolveMx,
  resolveNs,
  resolveTxt,
} from "dns/promises";
import { getCache, setCache } from "./dns-cache";
import { DnsQueryResult } from "./dns-types";

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("DNS timeout")), timeoutMs),
    ),
  ]);
}

async function safeResolve<T>(
  key: string,
  resolver: () => Promise<T>,
): Promise<{ data?: T; error?: string; durationMs: number }> {
  const cached = getCache<T>(key);
  if (cached) {
    return { data: cached, durationMs: 0 };
  }

  const start = performance.now();

  try {
    const data = await withTimeout(resolver(), DNS_TIMEOUT_MS);
    setCache(key, data);
    return {
      data,
      durationMs: Math.round(performance.now() - start),
    };
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "DNS resolution failed";
    return {
      error: errorMessage,
      durationMs: Math.round(performance.now() - start),
    };
  }
}

export async function resolveA(
  host: string,
): Promise<DnsQueryResult<string[]>> {
  const r = await safeResolve(`A:${host}`, () => resolve4(host));
  return {
    type: "A",
    success: !!r.data,
    data: r.data,
    error: r.error,
    durationMs: r.durationMs,
  };
}

export async function resolveAAAA(
  host: string,
): Promise<DnsQueryResult<string[]>> {
  const r = await safeResolve(`AAAA:${host}`, () => resolve6(host));
  return {
    type: "AAAA",
    success: !!r.data,
    data: r.data,
    error: r.error,
    durationMs: r.durationMs,
  };
}

export async function resolveMX(
  host: string,
): Promise<DnsQueryResult<Array<{ exchange: string; priority: number }>>> {
  const r = await safeResolve(`MX:${host}`, () => resolveMx(host));
  return {
    type: "MX",
    success: !!r.data,
    data: r.data,
    error: r.error,
    durationMs: r.durationMs,
  };
}

export async function resolveNS(
  host: string,
): Promise<DnsQueryResult<string[]>> {
  const r = await safeResolve(`NS:${host}`, () => resolveNs(host));
  return {
    type: "NS",
    success: !!r.data,
    data: r.data,
    error: r.error,
    durationMs: r.durationMs,
  };
}

export async function resolveTXT(
  host: string,
): Promise<DnsQueryResult<string[]>> {
  const r = await safeResolve(`TXT:${host}`, () => resolveTxt(host));
  return {
    type: "TXT",
    success: !!r.data,
    data: r.data?.flat(),
    error: r.error,
    durationMs: r.durationMs,
  };
}

export async function resolveCAA(
  host: string,
): Promise<DnsQueryResult<string[]>> {
  const r = await safeResolve(`CAA:${host}`, () => resolveCaa(host));
  const data = r.data?.map(
    (record) =>
      `${record.critical ? "critical " : ""}${
        record.issue
          ? `issue=${record.issue}`
          : record.issuewild
            ? `issuewild=${record.issuewild}`
            : record.iodef
              ? `iodef=${record.iodef}`
              : "unknown"
      }`,
  );
  return {
    type: "CAA",
    success: !!data,
    data,
    error: r.error,
    durationMs: r.durationMs,
  };
}

export async function resolveCNAME(
  host: string,
): Promise<DnsQueryResult<string[]>> {
  const r = await safeResolve(`CNAME:${host}`, () => resolveCname(host));
  return {
    type: "CNAME",
    success: !!r.data,
    data: r.data,
    error: r.error,
    durationMs: r.durationMs,
  };
}
