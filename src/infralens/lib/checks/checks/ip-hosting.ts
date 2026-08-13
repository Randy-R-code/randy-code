import {
  IP_INFO_CACHE_TTL_MS,
  IPAPI_BASE_URL,
  USER_AGENT,
} from "@infralens-config/constants";
import { env } from "@infralens-config/env";
import { getCache, setCache } from "@infralens-lib/dns/dns-cache";
import { CheckRunner } from "../types";

type IpApiResponse = {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  country_name?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  asn?: string;
  org?: string;
  isp?: string;
  error?: boolean;
  reason?: string;
};

export const runIpHostingCheck: CheckRunner<{
  ip?: string;
  ipv6?: string;
  asn?: string;
  isp?: string;
  org?: string;
  country?: string;
  city?: string;
}> = async ({ shared, timeout }) => {
  const start = performance.now();

  try {
    // Reuse the A record already resolved by the shared collection step
    // instead of resolving again.
    const ip = shared.dns.a[0];

    if (!ip) {
      return {
        id: "ip-hosting",
        label: "IP & Hosting Information",
        category: "network-dns",
        status: "fail",
        summary: "Unable to resolve IP address.",
        durationMs: Math.round(performance.now() - start),
      };
    }

    // Fetch IP information from ipapi.co — cached across analyses since
    // hosting/ASN info for a given IP changes far less often than DNS
    // records do, which also eases load on the free-tier rate limit.
    const cacheKey = `ipapi:${ip}`;
    const apiKey = env.ipapiKey;
    const apiUrl = apiKey
      ? `${IPAPI_BASE_URL}/${ip}/json/?key=${apiKey}`
      : `${IPAPI_BASE_URL}/${ip}/json/`;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const cached = getCache<IpApiResponse>(cacheKey);
      let data: IpApiResponse;

      if (cached) {
        data = cached;
      } else {
        const response = await fetch(apiUrl, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "User-Agent": USER_AGENT,
          },
        });

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        data = (await response.json()) as IpApiResponse;

        if (data.error) {
          throw new Error(data.reason || "API error");
        }

        setCache(cacheKey, data, IP_INFO_CACHE_TTL_MS);
      }

      clearTimeout(id);

      let status: "pass" | "warning" = "pass";
      let summary = "";

      if (data.asn && data.isp) {
        summary = `IP: ${ip}, ASN: ${data.asn}, ISP: ${data.isp}`;
        if (data.country_name) {
          summary += `, Location: ${data.country_name}`;
        }
      } else if (data.asn) {
        summary = `IP: ${ip}, ASN: ${data.asn}`;
      } else {
        summary = `IP: ${ip}`;
        status = "warning";
      }

      return {
        id: "ip-hosting",
        label: "IP & Hosting Information",
        category: "network-dns",
        status,
        summary,
        data: {
          ip,
          asn: data.asn,
          isp: data.isp,
          org: data.org,
          country: data.country_name || data.country,
          city: data.city,
        },
        evidence: [{ label: "ip", value: ip, source: "dns", sensitive: true }],
        durationMs: Math.round(performance.now() - start),
      };
    } catch {
      clearTimeout(id);
      // The IP itself resolved fine — only the third-party enrichment API
      // failed. That's neither a site misconfiguration nor a failure of
      // this check to run; it shouldn't move the score either way.
      return {
        id: "ip-hosting",
        label: "IP & Hosting Information",
        category: "network-dns",
        status: "unavailable",
        summary: `IP: ${ip} (hosting details unavailable)`,
        data: {
          ip,
        },
        evidence: [{ label: "ip", value: ip, source: "dns", sensitive: true }],
        durationMs: Math.round(performance.now() - start),
      };
    }
  } catch {
    return {
      id: "ip-hosting",
      label: "IP & Hosting Information",
      category: "network-dns",
      status: "error",
      summary: "Unable to retrieve IP and hosting information.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
