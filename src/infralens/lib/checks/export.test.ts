import { EXPORT_SCHEMA_VERSION } from "@infralens-config/constants";
import { describe, expect, it } from "vitest";
import { buildExport } from "./export";
import { ChecksResponse } from "./types";

const sampleResponse: ChecksResponse = {
  url: "https://example.com",
  hostname: "example.com",
  totalDurationMs: 502,
  analyzedAt: "2026-01-01T00:00:00.000Z",
  checks: [
    {
      id: "headers",
      label: "HTTP Security Headers",
      category: "http-security",
      status: "pass",
      summary: "All recommended security headers are present.",
      data: { present: ["content-security-policy"], missing: [] },
      evidence: [
        { label: "content-security-policy", value: true, source: "header" },
      ],
      scored: true,
      scoreContribution: 25,
      durationMs: 42,
    },
    {
      id: "ip-hosting",
      label: "IP & Hosting Information",
      category: "network-dns",
      status: "pass",
      summary: "IP: 93.184.216.34",
      evidence: [
        { label: "ip", value: "93.184.216.34", source: "dns", sensitive: true },
      ],
      scored: true,
      scoreContribution: 20,
      durationMs: 10,
    },
  ],
  score: {
    score: 84,
    grade: "B",
    scoredCount: 2,
    excludedCount: 0,
    strongestCategory: "http-security",
    topPriorityCategory: "network-dns",
    categories: [
      { category: "http-security", score: 25, maxScore: 25 },
      { category: "network-dns", score: 15, maxScore: 20 },
    ],
  },
};

describe("buildExport", () => {
  it("carries over url, score, grade, and categories", () => {
    const result = buildExport(sampleResponse);

    expect(result.url).toBe("https://example.com");
    expect(result.score).toBe(84);
    expect(result.grade).toBe("B");
    expect(result.categories).toEqual(sampleResponse.score.categories);
  });

  it("drops the detailed `data` field from each check, keeping only summary fields", () => {
    const result = buildExport(sampleResponse);

    expect(result.checks[0]).toEqual({
      id: "headers",
      label: "HTTP Security Headers",
      category: "http-security",
      status: "pass",
      summary: "All recommended security headers are present.",
      durationMs: 42,
      scored: true,
      scoreContribution: 25,
      evidence: [
        { label: "content-security-policy", value: true, source: "header" },
      ],
    });
    expect(result.checks[0]).not.toHaveProperty("data");
  });

  it("stamps a schema version and an ISO scannedAt timestamp", () => {
    const result = buildExport(sampleResponse);

    expect(result.version).toBe(EXPORT_SCHEMA_VERSION);
    expect(() => new Date(result.scannedAt).toISOString()).not.toThrow();
  });

  it("strips evidence items marked sensitive", () => {
    const result = buildExport(sampleResponse);

    // The headers check's non-sensitive evidence survives...
    expect(result.checks[0].evidence).toHaveLength(1);
    // ...but ip-hosting's IP (marked sensitive) is dropped entirely,
    // leaving no empty array behind either.
    expect(result.checks[1].evidence).toBeUndefined();
  });
});
