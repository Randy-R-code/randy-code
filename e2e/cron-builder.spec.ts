import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const SEVERE_IMPACTS = ["serious", "critical"];

test.describe("cron builder", () => {
  test("route loads with a valid default expression and description", async ({
    page,
  }) => {
    await page.goto("/tools/cron-builder");

    await expect(page.locator("h1")).toHaveText("Cron Builder");
    await expect(page.locator("#cron-raw-input")).toHaveValue("0 9 * * 1-5");
    await expect(
      page.getByText("At 09:00, Monday through Friday."),
    ).toBeVisible();
    await expect(page.locator("#cron-raw-error")).toHaveCount(0);
  });

  test("upcoming runs render for the default schedule", async ({ page }) => {
    await page.goto("/tools/cron-builder");

    const nextRunsHeading = page.getByRole("heading", { name: "Next runs" });
    await expect(nextRunsHeading).toBeVisible();
    // Scoped to the sibling <ol> right after the heading — the page also
    // has its own unrelated <ol> in the About section's "How to use it".
    const nextRunsList = nextRunsHeading.locator("xpath=following-sibling::ol");
    // 5 upcoming runs, each formatted like "Mon, Aug 17 · 09:00".
    await expect(nextRunsList.locator("li")).toHaveCount(5);
    await expect(page.getByText(/Previewed in/)).toBeVisible();
  });

  test("selecting a preset updates the expression and description", async ({
    page,
  }) => {
    await page.goto("/tools/cron-builder");

    await page.getByRole("button", { name: "Every 5 minutes" }).click();

    await expect(page.locator("#cron-raw-input")).toHaveValue("*/5 * * * *");
    await expect(page.getByText("Every 5 minutes.")).toBeVisible();
  });

  test("editing the raw expression updates the description", async ({
    page,
  }) => {
    await page.goto("/tools/cron-builder");

    await page.fill("#cron-raw-input", "0 0 1 * *");

    await expect(
      page.getByText("At 00:00 on the first day of every month."),
    ).toBeVisible();
  });

  test("warns when day-of-month and day-of-week are both restricted", async ({
    page,
  }) => {
    await page.goto("/tools/cron-builder");

    const warning = page.getByText(
      "Day of month and day of week are both restricted. Their combined behavior can vary between cron implementations.",
    );
    await expect(warning).toBeHidden();

    await page.fill("#cron-raw-input", "0 9 1 * 1");
    await expect(warning).toBeVisible();

    await page.fill("#cron-raw-input", "0 9 * * 1-5");
    await expect(warning).toBeHidden();
  });

  test("an invalid raw expression is rejected without destroying the visual editor", async ({
    page,
  }) => {
    await page.goto("/tools/cron-builder");

    await page.fill("#cron-raw-input", "60 * * * *");

    await expect(page.locator("#cron-raw-error")).toHaveText(
      "Minute must be between 0 and 59.",
    );
    // The last valid state (hour 9 selected) must still be reflected.
    await expect(page.getByRole("button", { name: "Hour 9" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("copying the expression exposes a success state", async ({ page }) => {
    // Headless Chromium's real clipboard permissions are unreliable in CI,
    // so stub the Clipboard API and assert on what was actually written.
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
    await page.goto("/tools/cron-builder");

    await page.getByRole("button", { name: "Copy cron expression" }).click();

    await expect(
      page.getByRole("button", { name: "Cron expression copied" }),
    ).toBeVisible();
    const copied = await page.evaluate(
      () => (window as unknown as { __copied: string[] }).__copied,
    );
    expect(copied).toEqual(["0 9 * * 1-5"]);
  });

  test("renders an About section explaining the tool", async ({ page }) => {
    await page.goto("/tools/cron-builder");

    await expect(
      page.getByRole("heading", { name: "About Cron Builder" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "What is it?" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "How to use it" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Why use it?" }),
    ).toBeVisible();
  });

  test("mobile viewport has no horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/tools/cron-builder");

    const hasOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    );
    expect(hasOverflow).toBe(false);
  });

  test("has no serious/critical axe violations", async ({ page }) => {
    await page.goto("/tools/cron-builder");
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
});
