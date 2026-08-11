/**
 * Shared CDN header-fingerprint table (master plan §11.10/§11.17) — used by
 * both `waf.ts` and `stack.ts`, which each care about "which CDN is this"
 * for a different purpose. Kept in one place so a fix to the fingerprint
 * logic (e.g. the Phase 7 bug where a bare `Server` header key matched
 * almost every response) can't silently drift out of sync between the two.
 */
export const CDN_HEADER_INDICATORS: Record<string, string> = {
  "cf-ray": "Cloudflare",
  "x-sucuri-id": "Sucuri",
  "x-sucuri-cache": "Sucuri",
  "x-fastly-request-id": "Fastly",
  "x-akamai-request-id": "Akamai",
  "x-akamai-transformed": "Akamai",
  "x-aws-cf-id": "AWS CloudFront",
  "x-amz-cf-id": "AWS CloudFront",
  "x-amz-cf-pop": "AWS CloudFront",
  "x-vercel-id": "Vercel",
  "x-nf-request-id": "Netlify",
};

export function detectCdnFromHeaders(headers: {
  has(name: string): boolean;
  get(name: string): string | null;
}): { detected: string[]; provider?: string } {
  const detected: string[] = [];
  let provider: string | undefined;

  for (const [header, name] of Object.entries(CDN_HEADER_INDICATORS)) {
    if (headers.has(header)) {
      detected.push(header);
      if (!provider) provider = name;
    }
  }

  const server = headers.get("server")?.toLowerCase() || "";
  if (server.includes("cloudflare")) {
    provider = "Cloudflare";
    detected.push("server: Cloudflare");
  } else if (server.includes("cloudfront")) {
    provider = "AWS CloudFront";
    detected.push("server: CloudFront");
  } else if (server.includes("vercel")) {
    provider = "Vercel";
    detected.push("server: Vercel");
  } else if (server.includes("netlify")) {
    provider = "Netlify";
    detected.push("server: Netlify");
  }

  return { detected, provider };
}
