import { describe, expect, it } from "vitest";
import { buildAnalysis } from "../build-analysis";
import { parseHtmlMetadata } from "../parse-html";

describe("buildAnalysis", () => {
  it("assembles a full analysis from a realistic page", () => {
    const html = `
      <html lang="en">
        <head>
          <title>Example Page</title>
          <meta name="description" content="An example page for testing.">
          <link rel="canonical" href="/page">
          <meta name="robots" content="index,follow">
          <meta property="og:title" content="Example OG Title">
          <meta property="og:image" content="/og.png">
          <meta name="twitter:card" content="summary">
          <link rel="icon" href="/favicon.ico">
          <link rel="alternate" hreflang="fr" href="/fr/page">
        </head>
      </html>
    `;
    const analysis = buildAnalysis({
      requestedUrl: "https://example.com/page",
      finalUrl: "https://example.com/page",
      redirectCount: 0,
      raw: parseHtmlMetadata(html),
    });

    expect(analysis.page.title).toBe("Example Page");
    expect(analysis.page.canonical).toBe("https://example.com/page");
    expect(analysis.openGraph.image).toBe("https://example.com/og.png");
    expect(analysis.icons[0]?.url).toBe("https://example.com/favicon.ico");
    expect(analysis.hreflang[0]?.url).toBe("https://example.com/fr/page");
    expect(analysis.previews.search.hostname).toBe("example.com");
    expect(analysis.previews.social.usesFallback).toBe(true);
  });

  it("resolves relative metadata URLs against <base href> rather than the document URL", () => {
    const html = `
      <base href="https://cdn.example.com/assets/">
      <link rel="icon" href="favicon.ico">
    `;
    const analysis = buildAnalysis({
      requestedUrl: "https://example.com/page",
      finalUrl: "https://example.com/page",
      redirectCount: 0,
      raw: parseHtmlMetadata(html),
    });

    expect(analysis.icons[0]?.url).toBe(
      "https://cdn.example.com/assets/favicon.ico",
    );
  });

  it("marks the social preview as not using a fallback when real Twitter tags exist", () => {
    const html = `
      <meta name="twitter:title" content="Twitter-specific title">
      <meta name="twitter:image" content="/twitter.png">
    `;
    const analysis = buildAnalysis({
      requestedUrl: "https://example.com/",
      finalUrl: "https://example.com/",
      redirectCount: 0,
      raw: parseHtmlMetadata(html),
    });

    expect(analysis.previews.social.usesFallback).toBe(false);
    expect(analysis.previews.social.image).toBe(
      "https://example.com/twitter.png",
    );
  });

  it("produces no crash and empty-ish results for a metadata-free page", () => {
    const analysis = buildAnalysis({
      requestedUrl: "https://example.com/",
      finalUrl: "https://example.com/",
      redirectCount: 0,
      raw: parseHtmlMetadata("<html><body>Hello</body></html>"),
    });

    expect(analysis.page.title).toBeUndefined();
    expect(analysis.findings.length).toBeGreaterThan(0);
  });
});
