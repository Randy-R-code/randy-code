import { describe, expect, it } from "vitest";
import { parseHtmlMetadata } from "../parse-html";

describe("parseHtmlMetadata", () => {
  it("extracts the title, decoding entities without double-decoding", () => {
    const raw = parseHtmlMetadata("<title>Tom &amp; Jerry</title>");
    expect(raw.titles).toEqual(["Tom & Jerry"]);
  });

  it("detects duplicate <title> elements", () => {
    const raw = parseHtmlMetadata("<title>First</title><title>Second</title>");
    expect(raw.titles).toEqual(["First", "Second"]);
  });

  it("extracts meta description and counts duplicates", () => {
    const raw = parseHtmlMetadata(
      '<meta name="description" content="A"><meta name="Description" content="B">',
    );
    expect(raw.description).toEqual({ content: "A", duplicateCount: 2 });
  });

  it("treats an empty or whitespace-only description as absent", () => {
    expect(
      parseHtmlMetadata('<meta name="description" content="">').description,
    ).toBeUndefined();
    expect(
      parseHtmlMetadata('<meta name="description" content="   ">').description,
    ).toBeUndefined();
    expect(
      parseHtmlMetadata('<meta name="description">').description,
    ).toBeUndefined();
  });

  it("extracts canonical and counts duplicates", () => {
    const raw = parseHtmlMetadata(
      '<link rel="canonical" href="/a"><link rel="canonical" href="/b">',
    );
    expect(raw.canonical).toEqual({ href: "/a", duplicateCount: 2 });
  });

  it("parses comma-separated robots directives case-insensitively", () => {
    const raw = parseHtmlMetadata(
      '<meta name="ROBOTS" content="noindex, nofollow">',
    );
    expect(raw.robots).toEqual(["noindex", "nofollow"]);
  });

  it("extracts viewport and html lang", () => {
    const raw = parseHtmlMetadata(
      '<html lang="fr-FR"><head><meta name="viewport" content="width=device-width, initial-scale=1"></head></html>',
    );
    expect(raw.lang).toBe("fr-FR");
    expect(raw.viewport).toBe("width=device-width, initial-scale=1");
  });

  it("extracts <base href>", () => {
    const raw = parseHtmlMetadata('<base href="https://cdn.example.com/">');
    expect(raw.baseHref).toBe("https://cdn.example.com/");
  });

  it("extracts hreflang entries", () => {
    const raw = parseHtmlMetadata(
      '<link rel="alternate" hreflang="fr" href="/fr"><link rel="alternate" hreflang="x-default" href="/">',
    );
    expect(raw.hreflang).toEqual([
      { language: "fr", url: "/fr" },
      { language: "x-default", url: "/" },
    ]);
  });

  it("extracts Open Graph metadata, collecting multiple images in order", () => {
    const raw = parseHtmlMetadata(`
      <meta property="og:title" content="Hello">
      <meta property="og:description" content="World">
      <meta property="og:image" content="/a.png">
      <meta property="og:image" content="/b.png">
      <meta property="og:url" content="https://example.com/page">
      <meta property="og:type" content="website">
      <meta property="og:site_name" content="Example">
      <meta property="og:locale" content="en_US">
    `);
    expect(raw.openGraph).toEqual({
      title: "Hello",
      description: "World",
      images: ["/a.png", "/b.png"],
      url: "https://example.com/page",
      type: "website",
      siteName: "Example",
      locale: "en_US",
    });
  });

  it("tolerates Open Graph tags authored with name= instead of property=", () => {
    const raw = parseHtmlMetadata('<meta name="og:title" content="Hello">');
    expect(raw.openGraph.title).toBe("Hello");
  });

  it("extracts Twitter/X metadata", () => {
    const raw = parseHtmlMetadata(`
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="Hi">
      <meta name="twitter:description" content="Desc">
      <meta name="twitter:image" content="/x.png">
      <meta name="twitter:site" content="@example">
      <meta name="twitter:creator" content="@author">
    `);
    expect(raw.twitter).toEqual({
      card: "summary_large_image",
      title: "Hi",
      description: "Desc",
      image: "/x.png",
      site: "@example",
      creator: "@author",
    });
  });

  it("extracts favicon and apple-touch-icon declarations, including the shortcut icon variant", () => {
    const raw = parseHtmlMetadata(`
      <link rel="icon" href="/favicon.ico">
      <link rel="shortcut icon" href="/favicon-legacy.ico">
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
    `);
    expect(raw.icons).toEqual([
      { rel: "icon", url: "/favicon.ico", type: undefined, sizes: undefined },
      {
        rel: "shortcut icon",
        url: "/favicon-legacy.ico",
        type: undefined,
        sizes: undefined,
      },
      {
        rel: "apple-touch-icon",
        url: "/apple-touch-icon.png",
        type: undefined,
        sizes: "180x180",
      },
    ]);
  });

  it("extracts the manifest link", () => {
    const raw = parseHtmlMetadata(
      '<link rel="manifest" href="/manifest.webmanifest">',
    );
    expect(raw.manifest).toBe("/manifest.webmanifest");
  });

  it("handles malformed but parseable HTML: mixed case, unquoted and single-quoted attributes", () => {
    const raw = parseHtmlMetadata(
      "<TITLE>Mixed Case</TITLE><META name=description content='Single quoted'><link rel=canonical href=/no-quotes>",
    );
    expect(raw.titles).toEqual(["Mixed Case"]);
    expect(raw.description?.content).toBe("Single quoted");
    expect(raw.canonical?.href).toBe("/no-quotes");
  });

  it("does not crash on a document with no <head> or malformed structure", () => {
    expect(() =>
      parseHtmlMetadata("<html><body>No head here</body>"),
    ).not.toThrow();
  });
});
