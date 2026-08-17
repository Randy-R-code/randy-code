import { expect, test } from "@playwright/test";

// One real, live analysis against example.com (IANA-reserved for exactly
// this kind of documentation/testing use, so it's a stable, low-flakiness
// target) — deliberately the only spec that triggers a real analysis, since
// this project stays serialized in case a real "infralens" rate-limit quota
// is active (see playwright.config.ts). Matches this project's existing
// culture of real network smoke tests over mocks (multiple real bugs were
// only ever caught this way, never by a mocked unit test).
test.describe("full analysis journey", () => {
  test("analyze -> results -> export -> history -> clear all", async ({
    page,
  }) => {
    await page.goto("/tools/infralens");

    await page
      .locator("#hero")
      .getByRole("button", { name: "example.com" })
      .click();
    await page
      .locator("#hero")
      .getByRole("button", { name: /analyze website/i })
      .click();

    const results = page.locator("#results");
    await expect(results).toBeVisible({ timeout: 30_000 });
    await expect(results.getByText("example.com").first()).toBeVisible();

    // Score + category breakdown rendered
    await expect(results.getByText(/\d+\/100/)).toBeVisible();
    await expect(
      results.getByRole("heading", { name: "Checks" }),
    ).toBeVisible();

    // Export controls are present and enabled
    await expect(page.getByTitle("Export JSON")).toBeEnabled();
    await expect(page.getByTitle("Export Markdown")).toBeEnabled();

    // Why this score? opens a dialog with real content, not a dead button
    await page.getByRole("button", { name: "Why this score?" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();

    // The history section only renders on the landing view, not alongside
    // an active result (HomeClient: `{!hasResults && <HistorySection />}`)
    // — "New Analysis" is how a user gets back there.
    await page.getByTitle("New Analysis").click();
    await expect(page.getByText("Recent analyses")).toBeVisible();
    const removeButton = page.getByRole("button", {
      name: "Remove example.com",
      exact: true,
    });
    await expect(removeButton).toBeVisible();

    // Deletable, end to end — not just theoretically possible
    await page.getByRole("button", { name: "Clear all" }).click();
    await expect(removeButton).toBeHidden();
    await expect(page.getByText("Recent analyses")).toBeHidden();
  });
});
