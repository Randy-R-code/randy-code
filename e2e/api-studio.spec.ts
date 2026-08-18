import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const SEVERE_IMPACTS = ["serious", "critical"];

// The proxy's own SSRF/security/rate-limit behavior is covered by
// vitest integration tests (app/api/api-studio/request/route.test.ts)
// against the real InfraLens validation stack. This file only exercises
// the browser-driven UI wiring, so the outbound call is mocked here rather
// than hitting a live endpoint — the same reasoning that keeps InfraLens's
// and MetaLens's own e2e specs to a single live request each.
async function mockSuccessfulResponse(page: Page) {
  await page.route("**/api/api-studio/request", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: { "content-type": "application/json" },
        bodyText: JSON.stringify({ id: 42, status: "created" }),
        isBinary: false,
        durationMs: 42,
        sizeBytes: 30,
        finalUrl: "https://api.example.com/users",
      }),
    });
  });
}

test.describe("api studio", () => {
  test("route loads with an empty, ready state", async ({ page }) => {
    await page.goto("/tools/api-studio");

    await expect(page.locator("h1")).toHaveText("API Studio");
    await expect(page.locator("#api-studio-method")).toHaveValue("GET");
    await expect(page.locator("#api-studio-url")).toHaveValue("");
    await expect(
      page.getByRole("button", { name: "Send", exact: true }),
    ).toBeDisabled();
    await expect(page.getByText("No requests yet")).toBeVisible();
    await expect(page.getByText("Enter a URL to generate code.")).toBeVisible();
  });

  test("Load example populates the builder without sending anything", async ({
    page,
  }) => {
    await page.goto("/tools/api-studio");

    await page.getByRole("button", { name: "Load example" }).click();

    await expect(page.locator("#api-studio-url")).toHaveValue(
      "https://jsonplaceholder.typicode.com/posts?userId=1",
    );
    await expect(page.locator('section[aria-label="Response"]')).toHaveCount(0);
    await page.getByRole("tab", { name: "Params" }).click();
    await expect(page.getByPlaceholder("Key")).toHaveValue("userId");
  });

  test("send -> response -> history -> reopen -> generated code", async ({
    page,
  }) => {
    await mockSuccessfulResponse(page);
    await page.goto("/tools/api-studio");

    await page.fill("#api-studio-url", "https://api.example.com/users");
    await page.getByRole("button", { name: "Send", exact: true }).click();

    const responseSection = page.locator('section[aria-label="Response"]');
    await expect(responseSection.getByText("200 OK")).toBeVisible();
    await expect(responseSection.getByText(/42 ms/)).toBeVisible();
    await expect(
      responseSection.getByText(/"status": "created"/),
    ).toBeVisible();

    // Saved to local history.
    const historyRow = page
      .locator("li")
      .filter({ hasText: "api.example.com/users" });
    await expect(historyRow).toBeVisible();
    await expect(historyRow.getByText("200")).toBeVisible();
    const reopenButton = historyRow.getByRole("button").first();

    // Generated code reflects the actual request.
    await page.getByRole("tab", { name: "curl" }).click();
    await expect(
      page.getByText("curl -X GET 'https://api.example.com/users'"),
    ).toBeVisible();

    // Reopening from history restores the request into the builder.
    await page.fill("#api-studio-url", "");
    await reopenButton.click();
    await expect(page.locator("#api-studio-url")).toHaveValue(
      "https://api.example.com/users",
    );
  });

  test("Clear removes the response panel", async ({ page }) => {
    await mockSuccessfulResponse(page);
    await page.goto("/tools/api-studio");

    await page.fill("#api-studio-url", "https://api.example.com/users");
    await page.getByRole("button", { name: "Send", exact: true }).click();

    const responseSection = page.locator('section[aria-label="Response"]');
    await expect(responseSection).toBeVisible();

    await responseSection.getByRole("button", { name: "Clear" }).click();
    await expect(responseSection).toHaveCount(0);
  });

  test("a request without a URL cannot be sent", async ({ page }) => {
    await page.goto("/tools/api-studio");

    await expect(
      page.getByRole("button", { name: "Send", exact: true }),
    ).toBeDisabled();
  });

  test("switching to JSON body and formatting produces pretty-printed JSON", async ({
    page,
  }) => {
    await page.goto("/tools/api-studio");

    await page.getByRole("tab", { name: "Body" }).click();
    await page.getByRole("radio", { name: "JSON" }).click();
    await page.fill("#body-editor-textarea", '{"a":1,"b":2}');
    await page.getByRole("button", { name: "Format" }).click();

    await expect(page.locator("#body-editor-textarea")).toHaveValue(
      '{\n  "a": 1,\n  "b": 2\n}',
    );
  });

  test("renders an About section explaining the tool", async ({ page }) => {
    await page.goto("/tools/api-studio");

    await expect(
      page.getByRole("heading", { name: "About API Studio" }),
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
    await page.goto("/tools/api-studio");

    const hasOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    );
    expect(hasOverflow).toBe(false);
  });

  test("has no serious/critical axe violations", async ({ page }) => {
    await page.goto("/tools/api-studio");

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
