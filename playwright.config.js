import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://127.0.0.1:4174",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "npx serve . -l 4174",
    url: "http://127.0.0.1:4174",
    reuseExistingServer: true
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
});
