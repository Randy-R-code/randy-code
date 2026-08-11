import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "line",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /infralens\//,
    },
    {
      // InfraLens E2E — the analysis flow is rate-limited to one request per
      // IP per 30s (migration plan §17/§28), so this group must stay
      // serialized. Run via `pnpm e2e:infralens`, never as part of the
      // default `pnpm e2e` (which only targets the "chromium" project).
      name: "infralens-desktop",
      testDir: "./e2e/infralens",
      fullyParallel: false,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      // Mirrors the source repo's mobile project: skips analysis.spec.ts,
      // which makes one real rate-limited request already covered by the
      // desktop project — running it twice would just collide on the limit.
      name: "infralens-mobile",
      testDir: "./e2e/infralens",
      fullyParallel: false,
      use: { ...devices["iPhone 13"] },
      testIgnore: /analysis\.spec\.ts/,
    },
  ],
  webServer: {
    command: "pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
