import { Recommendation } from "@infralens-lib/checks/types";

export function performanceRecommendation(ttfb: number): Recommendation {
  return {
    id: "slow-response-time",
    title: "Slow server response time",
    description: `The server response time is higher than recommended (${ttfb} ms).`,
    impact: "Slow responses degrade user experience and SEO rankings.",
    howTo: [
      "Enable server-side caching.",
      "Use a CDN to serve static assets.",
      "Optimize backend processing and database queries.",
      "Consider using a faster hosting provider or upgrading your plan.",
    ],
    severity: ttfb > 1500 ? "critical" : "warning",
    references: [
      {
        label: "Web.dev – Time to First Byte",
        url: "https://web.dev/ttfb/",
      },
    ],
  };
}

export function compressionRecommendation(): Recommendation {
  return {
    id: "no-compression",
    title: "Compression not enabled",
    description:
      "The server is not using compression (gzip or brotli) for responses.",
    impact:
      "Larger response sizes increase bandwidth usage and slow down page loads.",
    howTo: [
      "Enable gzip or brotli compression on your server.",
      "Configure your web server (nginx, Apache, etc.) to compress text-based files.",
      "Test compression with tools like PageSpeed Insights.",
    ],
    severity: "warning",
    references: [
      {
        label: "MDN – HTTP Compression",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Compression",
      },
    ],
  };
}
