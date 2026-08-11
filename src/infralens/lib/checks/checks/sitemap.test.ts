import { beforeEach, describe, expect, it, vi } from "vitest";

const { safeFetch, readBodyText } = vi.hoisted(() => ({
  safeFetch: vi.fn(),
  readBodyText: vi.fn(),
}));

vi.mock("@infralens-lib/security/safe-fetch", () => ({
  safeFetch,
  readBodyText,
}));

const { runSitemapCheck } = await import("./sitemap");

function context() {
  return {
    url: "https://example.com/",
    hostname: "example.com",
    timeout: 1000,
    shared: { page: null, dns: { a: [], aaaa: [], durationMs: 0 } },
  };
}

function notFound() {
  return { status: 404, ok: false };
}

beforeEach(() => {
  safeFetch.mockReset();
  readBodyText.mockReset();
});

describe("runSitemapCheck", () => {
  it("uses the Sitemap: URL declared in robots.txt before trying defaults", async () => {
    safeFetch.mockImplementation(async (url: string) => {
      if (url.endsWith("/robots.txt")) return { status: 200, ok: true };
      if (url === "https://example.com/custom-sitemap.xml") {
        return { status: 200, ok: true };
      }
      return notFound();
    });
    readBodyText.mockImplementation(async () => {
      // First call reads robots.txt, second reads the sitemap itself.
      if (readBodyText.mock.calls.length === 1) {
        return "Sitemap: https://example.com/custom-sitemap.xml";
      }
      return "<urlset><url>a</url><url>b</url></urlset>";
    });

    const result = await runSitemapCheck(context());

    expect(result.status).toBe("pass");
    expect(result.data?.sitemapUrl).toBe(
      "https://example.com/custom-sitemap.xml",
    );
    expect(result.data?.urlCount).toBe(2);
  });

  it("falls back to /sitemap.xml when robots.txt declares nothing", async () => {
    safeFetch.mockImplementation(async (url: string) => {
      if (url.endsWith("/robots.txt")) return { status: 404 };
      if (url === "https://example.com/sitemap.xml")
        return { status: 200, ok: true };
      return notFound();
    });
    readBodyText.mockResolvedValue("<urlset><url>a</url></urlset>");

    const result = await runSitemapCheck(context());

    expect(result.status).toBe("pass");
    expect(result.data?.sitemapUrl).toBe("https://example.com/sitemap.xml");
  });

  it("warns and reports every location tried when nothing is found", async () => {
    safeFetch.mockResolvedValue({ status: 404 });

    const result = await runSitemapCheck(context());

    expect(result.status).toBe("warning");
    expect(result.data?.present).toBe(false);
    expect(result.data?.triedLocations.length).toBeGreaterThan(0);
  });

  it("never tries more than the capped number of locations", async () => {
    safeFetch.mockImplementation(async (url: string) => {
      if (url.endsWith("/robots.txt")) return { status: 200, ok: true };
      return notFound();
    });
    readBodyText.mockResolvedValue(
      "Sitemap: https://example.com/a.xml\nSitemap: https://example.com/b.xml\nSitemap: https://example.com/c.xml\nSitemap: https://example.com/d.xml",
    );

    const result = await runSitemapCheck(context());

    expect(result.data?.triedLocations.length).toBeLessThanOrEqual(3);
  });
});
