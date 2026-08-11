import { beforeEach, describe, expect, it, vi } from "vitest";

const { safeFetch, readBodyText } = vi.hoisted(() => ({
  safeFetch: vi.fn(),
  readBodyText: vi.fn(),
}));

vi.mock("@infralens-lib/security/safe-fetch", () => ({
  safeFetch,
  readBodyText,
}));

const { runRobotsCheck, parseRobots } = await import("./robots");

function context() {
  return {
    url: "https://example.com/",
    hostname: "example.com",
    timeout: 1000,
    shared: { page: null, dns: { a: [], aaaa: [], durationMs: 0 } },
  };
}

beforeEach(() => {
  safeFetch.mockReset();
  readBodyText.mockReset();
});

describe("parseRobots", () => {
  it("extracts declared Sitemap: URLs", () => {
    const result = parseRobots(
      "User-agent: *\nDisallow: /admin\nSitemap: https://example.com/sitemap.xml",
    );

    expect(result.sitemaps).toEqual(["https://example.com/sitemap.xml"]);
    expect(result.blocksAll).toBe(false);
  });

  it("detects a global disallow under User-agent: *", () => {
    const result = parseRobots("User-agent: *\nDisallow: /");

    expect(result.blocksAll).toBe(true);
  });

  it("does not treat a partial disallow as a global block", () => {
    const result = parseRobots("User-agent: *\nDisallow: /private");

    expect(result.blocksAll).toBe(false);
  });

  it("does not treat Disallow: / for a specific bot as a global block", () => {
    const result = parseRobots("User-agent: BadBot\nDisallow: /");

    expect(result.blocksAll).toBe(false);
  });
});

describe("runRobotsCheck", () => {
  it("warns when robots.txt is not present", async () => {
    safeFetch.mockResolvedValue({ status: 404 });

    const result = await runRobotsCheck(context());

    expect(result.status).toBe("warning");
    expect(result.data?.present).toBe(false);
  });

  it("passes and surfaces sitemap references as evidence when valid", async () => {
    safeFetch.mockResolvedValue({ status: 200 });
    readBodyText.mockResolvedValue(
      "User-agent: *\nDisallow: /admin\nSitemap: https://example.com/sitemap.xml",
    );

    const result = await runRobotsCheck(context());

    expect(result.status).toBe("pass");
    expect(result.data?.sitemaps).toEqual(["https://example.com/sitemap.xml"]);
    expect(result.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: "https://example.com/sitemap.xml" }),
      ]),
    );
  });

  it("warns (not fails, and not framed as a vulnerability) when the whole site is disallowed", async () => {
    safeFetch.mockResolvedValue({ status: 200 });
    readBodyText.mockResolvedValue("User-agent: *\nDisallow: /");

    const result = await runRobotsCheck(context());

    expect(result.status).toBe("warning");
    expect(result.data?.blocksAll).toBe(true);
  });

  it("returns error when the fetch throws", async () => {
    safeFetch.mockRejectedValue(new Error("network down"));

    const result = await runRobotsCheck(context());

    expect(result.status).toBe("error");
  });
});
