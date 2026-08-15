import { describe, expect, it } from "vitest";
import { buildFindings } from "../findings";
import type { RawMetadata } from "../types";

function emptyRaw(overrides: Partial<RawMetadata> = {}): RawMetadata {
  return {
    titles: [],
    robots: [],
    openGraph: { images: [] },
    twitter: {},
    icons: [],
    hreflang: [],
    ...overrides,
  };
}

function findingIds(findings: ReturnType<typeof buildFindings>): string[] {
  return findings.map((f) => f.id);
}

describe("buildFindings", () => {
  it("flags a missing title, description, canonical and language", () => {
    const findings = buildFindings({
      raw: emptyRaw(),
      finalUrl: "https://example.com/",
    });
    expect(findingIds(findings)).toEqual(
      expect.arrayContaining([
        "title-missing",
        "description-missing",
        "canonical-missing",
        "og-title-missing",
        "og-description-missing",
        "og-image-missing",
        "twitter-card-missing",
        "lang-missing",
      ]),
    );
  });

  it("flags noindex prominently", () => {
    const findings = buildFindings({
      raw: emptyRaw({ robots: ["noindex", "nofollow"] }),
      finalUrl: "https://example.com/",
    });
    const noindex = findings.find((f) => f.id === "robots-noindex");
    expect(noindex).toBeDefined();
    expect(noindex?.severity).toBe("warning");
  });

  it("does not flag noindex when absent", () => {
    const findings = buildFindings({
      raw: emptyRaw({ robots: ["index", "follow"] }),
      finalUrl: "https://example.com/",
    });
    expect(findingIds(findings)).not.toContain("robots-noindex");
  });

  it("flags a malformed canonical differently from a missing one", () => {
    const findings = buildFindings({
      raw: emptyRaw({
        canonical: { href: "not a valid url", duplicateCount: 1 },
      }),
      canonical: undefined,
      finalUrl: "https://example.com/",
    });
    expect(findingIds(findings)).toContain("canonical-malformed");
    expect(findingIds(findings)).not.toContain("canonical-missing");
  });

  it("treats a canonical that differs from the final URL as informational, not an error", () => {
    const findings = buildFindings({
      raw: emptyRaw({
        canonical: { href: "https://example.com/other", duplicateCount: 1 },
      }),
      canonical: "https://example.com/other",
      finalUrl: "https://example.com/page",
    });
    const finding = findings.find((f) => f.id === "canonical-differs");
    expect(finding?.severity).toBe("info");
  });

  it("does not flag a canonical that matches the final URL", () => {
    const findings = buildFindings({
      raw: emptyRaw({
        canonical: { href: "https://example.com/page", duplicateCount: 1 },
      }),
      canonical: "https://example.com/page",
      finalUrl: "https://example.com/page",
    });
    expect(findingIds(findings)).not.toContain("canonical-differs");
  });

  it("surfaces Twitter/Open Graph fallback usage as info, not as if Twitter tags exist", () => {
    const findings = buildFindings({
      raw: emptyRaw({
        openGraph: { title: "Hi", images: ["/img.png"] },
      }),
      ogImage: "https://example.com/img.png",
      finalUrl: "https://example.com/",
    });
    expect(findingIds(findings)).toContain("twitter-title-fallback");
    expect(findingIds(findings)).toContain("twitter-image-fallback");
  });

  it("gives conservative, non-alarmist length guidance rather than hard errors", () => {
    const findings = buildFindings({
      raw: emptyRaw(),
      title: "Hi",
      finalUrl: "https://example.com/",
    });
    const finding = findings.find((f) => f.id === "title-short");
    expect(finding?.severity).toBe("info");
  });

  it("does not repeat duplicate warnings when there is only one of each tag", () => {
    const findings = buildFindings({
      raw: emptyRaw({
        description: { content: "A fine description.", duplicateCount: 1 },
      }),
      description: "A fine description of reasonable length here.",
      finalUrl: "https://example.com/",
    });
    expect(findingIds(findings)).not.toContain("description-duplicate");
  });
});
