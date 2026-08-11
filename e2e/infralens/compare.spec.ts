import { expect, test } from "@playwright/test";

// Pure client-side feature — no network, no rate limit, safe to run on
// every project without the collision concerns that apply to
// analysis.spec.ts.
const reportA = {
  url: "https://example.com",
  scannedAt: "2026-08-01T10:00:00.000Z",
  score: 70,
  grade: "C",
  version: "2.0.0",
  categories: [{ category: "http-security", score: 15, maxScore: 25 }],
  checks: [
    {
      id: "headers",
      label: "HTTP Security Headers",
      category: "http-security",
      status: "fail",
      durationMs: 10,
    },
  ],
};

const reportB = {
  ...reportA,
  score: 84,
  grade: "B",
  categories: [{ category: "http-security", score: 21, maxScore: 25 }],
  checks: [
    {
      id: "headers",
      label: "HTTP Security Headers",
      category: "http-security",
      status: "pass",
      durationMs: 10,
    },
  ],
};

test.describe("compare reports", () => {
  test("importing two exports shows the score delta and the improved check", async ({
    page,
  }) => {
    await page.goto("/tools/infralens/compare");

    // Real ElementHandles, not Locators — the "Report A" slot's own <input>
    // unmounts once it loads successfully (the slot switches to its
    // "loaded" card view), and a Locator (even one captured via .all())
    // still re-resolves by index against the live DOM on every action, so
    // it would silently start targeting a different, shifted element.
    // Handles are bound to the actual DOM node up front and don't drift.
    const [inputA, inputB] = await page.$$('input[type="file"]');

    await inputA.setInputFiles({
      name: "report-a.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(reportA)),
    });
    await inputB.setInputFiles({
      name: "report-b.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(reportB)),
    });

    await expect(page.getByText("+14")).toBeVisible();
    await expect(page.getByText(/improvements/i)).toBeVisible();
    await expect(page.getByText("HTTP Security Headers")).toBeVisible();
  });

  test("rejects a malformed file with a clear message, per slot", async ({
    page,
  }) => {
    await page.goto("/tools/infralens/compare");

    const input = page.locator('input[type="file"]').first();
    await input.setInputFiles({
      name: "bad.json",
      mimeType: "application/json",
      buffer: Buffer.from("{ not valid json"),
    });

    await expect(page.getByText(/isn't valid JSON/i)).toBeVisible();
  });

  test("rejects a well-formed JSON file that isn't an InfraLens export", async ({
    page,
  }) => {
    await page.goto("/tools/infralens/compare");

    const input = page.locator('input[type="file"]').first();
    await input.setInputFiles({
      name: "notexport.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify({ hello: "world" })),
    });

    await expect(
      page.getByText(/doesn't look like an InfraLens/i),
    ).toBeVisible();
  });

  test("explains, rather than silently comparing, incompatible major schema versions", async ({
    page,
  }) => {
    await page.goto("/tools/infralens/compare");

    const [inputA, inputB] = await page.$$('input[type="file"]');

    await inputA.setInputFiles({
      name: "old.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify({ ...reportA, version: "1.4.0" })),
    });
    await inputB.setInputFiles({
      name: "current.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify({ ...reportB, version: "2.0.0" })),
    });

    await expect(page.getByText(/different major versions/i)).toBeVisible();
  });
});
