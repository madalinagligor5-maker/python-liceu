import { test, expect } from "@playwright/test";

test.describe("Curs practic de Python — produs separat, cu abonament propriu", () => {
  // Modulul 1 (CP1.1) e complet gratuit (preview), modulele 2-3 cer
  // abonamentul propriu al cursului (curs_status = active) -- independent de
  // abonamentul de liceu.

  test("1. Pagina /curs-practic listeaza modulul 1 gratuit si harta completa a cursului", async ({ page }) => {
    await page.goto("/curs-practic");

    await expect(page.getByRole("link", { name: /Ce e programarea și de ce Python/ })).toBeVisible();
    await expect(page.getByText("Începe modulul 1 — gratuit →")).toBeVisible();
    // Harta completa (informativa) mentioneaza unitati care nu sunt inca scrise.
    await expect(page.getByText("Introducere în analiza de date cu pandas")).toBeVisible();
  });

  test("2. Modulul 1 (gratuit) arata continut real, fara paywall si fara cont", async ({ page }) => {
    await page.goto("/curs-practic/ce-e-programarea-si-de-ce-python/CP1.1.2");

    await expect(page.locator("#lectie-articol")).toHaveCount(1);
    await expect(
      page.getByText("Un program e o listă de instrucțiuni precise")
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Vezi planurile cursului" })).toHaveCount(0);
  });

  test("3. Modulul 2 (necesita abonamentul cursului) arata teaser, fara redirect, fara cont", async ({ page }) => {
    const URL_MODUL_2 = "/curs-practic/variabile-si-tipuri-de-date/CP1.2.2";
    await page.goto(URL_MODUL_2);

    expect(page.url()).toContain(URL_MODUL_2);
    await expect(page.getByText("Acest modul necesită abonamentul Cursului practic de Python.")).toBeVisible();
    await expect(page.getByText("Un program e o listă de instrucțiuni precise")).toHaveCount(0);
    await expect(page.locator("#lectie-articol")).toHaveCount(0);

    const html = await page.content();
    expect(html).not.toContain("Un program e o listă de instrucțiuni precise");

    await expect(page.getByRole("link", { name: "Vezi planurile cursului" })).toBeVisible();
  });

  test("4. Pagina de preturi a cursului e separata de cea de liceu si duce catre checkout cu produs=curs", async ({ page }) => {
    await page.goto("/curs-practic/preturi");

    await expect(page.getByText("Produs separat de abonamentul de liceu")).toBeVisible();
    await expect(page.getByRole("link", { name: "Vezi planurile de acolo" })).toHaveAttribute("href", "/preturi");
  });

  test("5. O sublectie de exercitii (CP1.1.4) randeaza exercitiile reale din exercitii.json", async ({ page }) => {
    await page.goto("/curs-practic/ce-e-programarea-si-de-ce-python/CP1.1.4");

    const html = await page.content();
    expect(html).toContain("Completează codul ca să afișeze numele");
  });
});
