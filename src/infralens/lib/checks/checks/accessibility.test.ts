import { describe, expect, it } from "vitest";
import { CollectedContext, PageSnapshot } from "../collect";
import { runAccessibilityCheck } from "./accessibility";

function snapshot(html: string): PageSnapshot {
  return {
    finalUrl: "https://example.com/",
    redirectChain: [{ url: "https://example.com/", status: 200 }],
    redirectCount: 0,
    hasRedirectLoop: false,
    status: 200,
    headers: new Headers() as PageSnapshot["headers"],
    html,
    responseTimeMs: 10,
    contentLength: html.length,
    compression: "none",
  };
}

function contextWith(page: PageSnapshot | null) {
  const shared: CollectedContext = {
    page,
    dns: { a: [], aaaa: [], durationMs: 0 },
  };
  return {
    url: "https://example.com",
    hostname: "example.com",
    timeout: 1000,
    shared,
  };
}

const GOOD_HTML = `
  <html lang="en">
  <body>
    <header></header>
    <nav><a href="#main">Skip to content</a></nav>
    <main><h1>Title</h1><img src="a.png" alt="a"></main>
    <footer></footer>
  </body>
  </html>
`;

describe("runAccessibilityCheck", () => {
  it("returns error when the shared page collection failed", async () => {
    const result = await runAccessibilityCheck(contextWith(null));

    expect(result.status).toBe("error");
  });

  it("always documents itself as a lightweight check, not a full audit", async () => {
    const result = await runAccessibilityCheck(
      contextWith(snapshot(GOOD_HTML)),
    );

    expect(result.limitations?.[0]).toMatch(/lightweight/i);
    expect(result.limitations?.[0]).toMatch(
      /not a complete accessibility audit/i,
    );
  });

  it("passes on a page with good accessibility signals", async () => {
    const result = await runAccessibilityCheck(
      contextWith(snapshot(GOOD_HTML)),
    );

    expect(result.status).toBe("pass");
  });

  it("flags a missing lang attribute and images without alt", async () => {
    const html = `<html><body><h1>t</h1><img src="a.png"></body></html>`;
    const result = await runAccessibilityCheck(contextWith(snapshot(html)));

    expect(result.data?.hasLang).toBe(false);
    expect(result.data?.imagesWithoutAlt).toBe(1);
    expect(result.status).not.toBe("pass");
  });
});
