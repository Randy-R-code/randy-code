import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Master plan §32 Phase 15 — "accessibilité". Fails on serious/critical
// violations only: this is a floor (nothing badly broken for assistive
// tech), not a claim of full WCAG conformance — matching the same
// deliberately-cautious framing already used for the app's own
// "Accessibility Hints" check (never a full audit, just observable signals).
const SEVERE_IMPACTS = ["serious", "critical"];

test.describe("accessibility", () => {
  for (const path of [
    "/tools/infralens",
    "/tools/infralens/docs",
    "/tools/infralens/privacy",
  ]) {
    test(`${path} has no serious/critical axe violations`, async ({ page }) => {
      await page.goto(path);
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
  }
});
