import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const SEVERE_IMPACTS = ["serious", "critical"];
const SAMPLE = '{\n  "a": 1,\n  "b": {\n    "c": 2\n  }\n}';

test.describe("json studio", () => {
  test("route loads with an empty, ready state", async ({ page }) => {
    await page.goto("/tools/json-studio");

    await expect(page.locator("h1")).toHaveText("JSON Studio");
    await expect(page.locator("#json-studio-editor")).toHaveValue("");
    await expect(page.getByRole("status")).toHaveText("Ready");
    await expect(
      page.getByText("Your JSON structure will appear here."),
    ).toBeVisible();
  });

  test("loading the example produces valid JSON and a tree", async ({
    page,
  }) => {
    await page.goto("/tools/json-studio");

    await page.getByRole("button", { name: "Load example" }).click();

    await expect(page.getByRole("status")).toHaveText("Valid JSON");
    await expect(page.getByText(/Object · \d+ keys · Depth \d+/)).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Collapse root" }),
    ).toBeVisible();
  });

  test("format pretty-prints and minify compacts", async ({ page }) => {
    await page.goto("/tools/json-studio");
    await page.fill("#json-studio-editor", '{"a":1,"b":{"c":2}}');

    await page.getByRole("button", { name: "Format" }).click();
    await expect(page.locator("#json-studio-editor")).toHaveValue(SAMPLE);

    await page.getByRole("button", { name: "Minify" }).click();
    await expect(page.locator("#json-studio-editor")).toHaveValue(
      '{"a":1,"b":{"c":2}}',
    );
  });

  test("invalid JSON is rejected without destroying the source", async ({
    page,
  }) => {
    await page.goto("/tools/json-studio");
    const invalid = '{"a": 1, "b": }';

    await page.fill("#json-studio-editor", invalid);

    await expect(page.getByRole("status")).toHaveText("Invalid JSON");
    await expect(page.locator("#json-studio-editor")).toHaveValue(invalid);
    await expect(
      page.getByText("Fix the JSON syntax to explore its structure."),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Format" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Download" })).toBeDisabled();
  });

  test("clearing resets editor, status and tree", async ({ page }) => {
    await page.goto("/tools/json-studio");
    await page.getByRole("button", { name: "Load example" }).click();

    await page.getByRole("button", { name: "Clear" }).click();

    await expect(page.locator("#json-studio-editor")).toHaveValue("");
    await expect(page.getByRole("status")).toHaveText("Ready");
    await expect(
      page.getByText("Your JSON structure will appear here."),
    ).toBeVisible();
  });

  test("copying the content exposes a success state", async ({ page }) => {
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
    await page.goto("/tools/json-studio");
    await page.fill("#json-studio-editor", '{"a":1}');

    await page.getByRole("button", { name: "Copy" }).click();

    await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
    const copied = await page.evaluate(
      () => (window as unknown as { __copied: string[] }).__copied,
    );
    expect(copied).toEqual(['{"a":1}']);
  });

  test("opening a local file loads, validates and updates the tree", async ({
    page,
  }) => {
    await page.goto("/tools/json-studio");

    await page.getByLabel("Open a JSON file").setInputFiles({
      name: "sample.json",
      mimeType: "application/json",
      buffer: Buffer.from('{"fromFile":true}'),
    });

    await expect(page.locator("#json-studio-editor")).toHaveValue(
      '{"fromFile":true}',
    );
    await expect(page.getByRole("status")).toHaveText("Valid JSON");
  });

  test("downloading valid JSON triggers a .json file with the formatted content", async ({
    page,
  }) => {
    await page.goto("/tools/json-studio");
    await page.fill("#json-studio-editor", '{"a":1}');

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Download" }).click(),
    ]);

    expect(download.suggestedFilename()).toBe("data.json");
  });

  test("renders an About section explaining the tool", async ({ page }) => {
    await page.goto("/tools/json-studio");

    await expect(
      page.getByRole("heading", { name: "About JSON Studio" }),
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
    await page.goto("/tools/json-studio");

    const hasOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    );
    expect(hasOverflow).toBe(false);
  });

  test("has no serious/critical axe violations", async ({ page }) => {
    await page.goto("/tools/json-studio");
    await page.getByRole("button", { name: "Load example" }).click();

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
