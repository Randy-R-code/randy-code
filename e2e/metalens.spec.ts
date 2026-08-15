import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const SEVERE_IMPACTS = ["serious", "critical"];

test.describe("metalens", () => {
  test("route loads with an empty state", async ({ page }) => {
    await page.goto("/tools/metalens");

    await expect(page.locator("h1")).toHaveText("MetaLens");
    await expect(page.getByLabel("Public URL to analyze")).toHaveValue("");
    await expect(
      page.getByText("Enter a public URL to inspect its metadata."),
    ).toBeVisible();
  });

  test("an obviously invalid URL is rejected without a network call", async ({
    page,
  }) => {
    await page.goto("/tools/metalens");

    // An unsupported protocol is rejected purely by string comparison
    // (spec §11) — unlike host-syntax edge cases, this can't drift between
    // Node's and a browser's URL parser.
    await page.getByLabel("Public URL to analyze").fill("ftp://example.com");
    await page.getByRole("button", { name: "Analyze" }).click();

    await expect(
      page.getByText("Enter a valid public HTTP or HTTPS URL."),
    ).toBeVisible();
    await expect(
      page.getByText("Enter a public URL to inspect its metadata."),
    ).toBeVisible();
  });

  test("mobile viewport has no horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/tools/metalens");

    const hasOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    );
    expect(hasOverflow).toBe(false);
  });

  test("has no serious/critical axe violations", async ({ page }) => {
    await page.goto("/tools/metalens");
    const results = await new AxeBuilder({ page }).analyze();
    const severe = results.violations.filter((v) =>
      SEVERE_IMPACTS.includes(v.impact ?? ""),
    );

    expect(
      severe,
      severe
        .map((v) => `${v.id}: ${v.description} (${v.nodes.length} node(s))`)
        .join("\n"),
    ).toEqual([]);
  });

  // One real, live analysis against example.com (IANA-reserved for exactly
  // this kind of documentation/testing use, so it's a stable, low-flakiness
  // target) — deliberately the only spec in this file that triggers a real
  // analysis, since the rate limiter allows one request per IP per 30s.
  // Matches this project's existing culture of real network smoke tests
  // over mocks (see e2e/infralens/analysis.spec.ts).
  test("analyzing a real public page renders metadata, previews, findings and supports copy", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      (window as unknown as { __copied: string[] }).__copied = [];
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: (text: string) => {
            (window as unknown as { __copied: string[] }).__copied.push(text);
            return Promise.resolve();
          },
        },
      });
    });

    await page.goto("/tools/metalens");
    await page.getByLabel("Public URL to analyze").fill("https://example.com");
    await page.getByRole("button", { name: "Analyze" }).click();

    await expect(page.getByText("Analyzed").first()).toBeVisible({
      timeout: 30_000,
    });

    // Title extracted and shown both in the metadata row and the search preview.
    await expect(page.getByText("Example Domain").first()).toBeVisible();
    await expect(page.getByText("example.com").first()).toBeVisible();

    // Missing fields are surfaced as findings, not silently skipped.
    await expect(page.getByText("Meta description is missing")).toBeVisible();
    await expect(page.getByText("Open Graph image is missing")).toBeVisible();

    // example.com's favicon is a data: URI — must render as plain text,
    // never as a clickable link (spec §87/§147).
    await expect(page.getByText("data:,", { exact: true })).toBeVisible();
    await expect(page.locator('a:has-text("data:,")')).toHaveCount(0);

    // Copy control works and its accessible name reflects the success state.
    await page.getByRole("button", { name: "Copy Title" }).click();
    await expect(
      page.getByRole("button", { name: "Copied Title" }),
    ).toBeVisible();
    const copied = await page.evaluate(
      () => (window as unknown as { __copied: string[] }).__copied,
    );
    expect(copied).toEqual(["Example Domain"]);
  });
});
