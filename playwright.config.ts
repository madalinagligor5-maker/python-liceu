import { defineConfig, devices } from "@playwright/test";

// Procesul playwright test (spre deosebire de "next start" din webServer, mai jos)
// nu încarcă automat .env.local. Testele din e2e/helpers/auth.ts au nevoie de
// SUPABASE_SERVICE_ROLE_KEY etc. direct în acest proces, ca să poată crea/șterge
// conturi de test și să citească/scrie users_meta ca admin.
try {
  process.loadEnvFile(".env.local");
} catch {
  // .env.local poate lipsi în CI, unde variabilele vin din secrete de mediu.
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "line",
  use: {
    baseURL: "http://localhost:3005",
  },
  webServer: {
    command: "npx next start -p 3005",
    port: 3005,
    reuseExistingServer: true,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
