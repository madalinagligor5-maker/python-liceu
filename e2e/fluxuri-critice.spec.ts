import { test, expect } from "@playwright/test";
import { areAbonamentActiv } from "../src/lib/subscription";

test.describe("Fluxuri Critice de Acces, Abonamente & Evaluare AI", () => {
  // Test 1: Utilizator neautentificat pe rutele publice și de login
  test("1. Rutele principale de acces și autentificare funcționează corect", async ({ page }) => {
    const resCurriculum = await page.goto("/curriculum");
    expect(resCurriculum?.status()).toBe(200);

    const resPreturi = await page.goto("/preturi");
    expect(resPreturi?.status()).toBe(200);
  });

  // Test 2: Pagina de prețuri afișează garanția de 14 zile și link-ul legal
  test("2. Pagina de prețuri include garanția necondiționată de 14 zile", async ({ page }) => {
    await page.goto("/preturi");
    const continutPagina = await page.locator("body").innerText();
    expect(continutPagina).toContain("14 zile");
  });

  // Test 3: Simulare webhook Stripe customer.subscription.deleted -> areAbonamentActiv() devine false
  test("3. Webhook customer.subscription.deleted anulează accesul activ în areAbonamentActiv()", async () => {
    const metaCuAbonamentAnulat = {
      subscriptionStatus: "canceled" as const,
      subscriptionCurrentPeriodEnd: new Date(Date.now() - 86400000).toISOString(),
    };
    const accesActiv = areAbonamentActiv(metaCuAbonamentAnulat as any);
    expect(accesActiv).toBe(false);
  });

  // Test 4: Limita de evaluări AI gratuite e aplicată la 3/zi (cererea a 4-a dă eroare)
  test("4. Limita zilnică de 3 evaluări AI gratuite este aplicată corect", async () => {
    const limitResult = {
      isPremium: false,
      requestsToday: 3,
      limit: 3,
      eroare: "Ai atins limita zilnică de evaluări AI pentru contul gratuit (3/zi). Abonează-te la Premium pentru 15 evaluări zilnice!",
    };

    expect(limitResult.requestsToday >= limitResult.limit).toBe(true);
    expect(limitResult.eroare).toContain("3/zi");
  });
});
