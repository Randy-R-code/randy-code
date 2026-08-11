import { describe, expect, it } from "vitest";
import { buildExport } from "./export";
import { ChecksResponse } from "./types";
import { isValidExport } from "./validate-export";

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
      scored: true,
      scoreContribution: 25,
      durationMs: 42,
    },
  ],
  score: {
    score: 84,
    grade: "B",
    scoredCount: 1,
    excludedCount: 0,
    strongestCategory: "http-security",
    topPriorityCategory: "http-security",
    categories: [{ category: "http-security", score: 25, maxScore: 25 }],
  },
};

describe("isValidExport", () => {
  it("accepts a real buildExport() output", () => {
    expect(isValidExport(buildExport(sampleResponse))).toBe(true);
  });

  const invalidCases: Array<[unknown, string]> = [
    [null, "null"],
    [{}, "empty object"],
    [{ ...buildExport(sampleResponse), grade: "Z" }, "invalid grade"],
    [
      { ...buildExport(sampleResponse), checks: [{ id: "x" }] },
      "check missing required fields",
    ],
    [
      {
        ...buildExport(sampleResponse),
        checks: [{ ...buildExport(sampleResponse).checks[0], status: "ok" }],
      },
      "check with a pre-Phase-4 status value",
    ],
  ];

  it.each(invalidCases)("rejects %s (%s)", (input) => {
    expect(isValidExport(input)).toBe(false);
  });
});

describe("buildExport — determinism", () => {
  it("produces byte-identical output for the same input at the same instant", () => {
    const fixedNow = new Date("2026-08-09T12:00:00.000Z");
    const first = JSON.stringify(buildExport(sampleResponse), null, 2);

    // buildExport's only non-deterministic input is `new Date()` for
    // `scannedAt` — freeze it to prove everything else is a pure function
    // of `response`.
    const originalDateNow = Date.now;
    Date.now = () => fixedNow.getTime();
    try {
      const second = JSON.stringify(buildExport(sampleResponse), null, 2);
      // Re-stamp both with the same fixed scannedAt before comparing.
      const normalize = (json: string) =>
        json.replace(/"scannedAt": ".*?"/, '"scannedAt": "FIXED"');
      expect(normalize(first)).toBe(normalize(second));
    } finally {
      Date.now = originalDateNow;
    }
  });
});
