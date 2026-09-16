import { test, expect } from "@playwright/test";

test.describe("Traseu gimnaziu (clasele VII-VIII) — acces gratuit, fără cont", () => {
  // Toate modulele VII-VIII sunt gratuit: true (decizie confirmată cu
  // fondatoarea) — spre deosebire de liceu, nu există nicio sublecție
  // plătită aici, deci niciun test din acest fișier nu creează cont.

  test("1. Pagina clasei VII listează cele 3 module, toate marcate gratuit", async ({ page }) => {
    await page.goto("/curriculum/VII");

    await expect(page.getByText("Primii pași în Python")).toBeVisible();
    await expect(page.getByText("De la Scratch la Python: secvențial și alternativ")).toBeVisible();
    await expect(page.getByText("Structura repetitivă și combinarea celor trei structuri")).toBeVisible();

    // Toate 3 modulele au badge-ul "gratuit" (nicio sublecție premium la gimnaziu).
    await expect(page.getByText("gratuit", { exact: true })).toHaveCount(3);
  });

  test("2. Pagina clasei VIII listează cele 2 module, toate marcate gratuit", async ({ page }) => {
    await page.goto("/curriculum/VIII");

    await expect(page.getByText("Șiruri de valori: identificare și generare")).toBeVisible();
    await expect(page.getByText("Algoritmi de prelucrare a șirurilor de valori")).toBeVisible();
    await expect(page.getByText("gratuit", { exact: true })).toHaveCount(2);
  });

  test("3. O sublecție de teorie (VII.1.2) arată conținutul real, fără paywall și fără cont", async ({ page }) => {
    await page.goto("/curriculum/VII/primii-pasi-in-python/VII.1.2");

    // Conținutul real e vizibil direct — nicio variantă gated/teaser, spre
    // deosebire de sublecțiile premium de liceu (vezi fluxuri-critice.spec.ts).
    await expect(page.locator("#lectie-articol")).toHaveCount(1);
    await expect(
      page.getByText("O variabilă e o „cutie” cu un nume, în care ținem o valoare")
    ).toBeVisible();

    // Nu apare niciun CTA către abonament pe conținut gratuit.
    await expect(page.getByRole("link", { name: "Vezi planurile de abonament" })).toHaveCount(0);
  });

  test("4. O sublecție de exerciții (VIII.2.4) randează exercițiile reale din exercitii.json", async ({ page }) => {
    await page.goto("/curriculum/VIII/algoritmi-de-prelucrare-a-sirurilor-de-valori/VIII.2.4");

    // Butonul "Citește mai întâi lecția" gatează afișarea până la scroll —
    // verificăm direct în HTML (randat server-side) că exercițiile reale
    // există în pagină, indiferent de starea de scroll din test.
    const html = await page.content();
    expect(html).toContain("Completează algoritmul care numără câte din numerele");
    expect(html).toContain("Scrie un program care afișează cel mai mic număr");
  });

  test("5. Navigarea 'următor' de la ultima sublecție de gimnaziu (VIII.2.6) duce corect la clasa IX", async ({ page }) => {
    await page.goto("/curriculum/VIII/algoritmi-de-prelucrare-a-sirurilor-de-valori/VIII.2.6");

    const linkUrmator = page.getByRole("link", { name: /1\.1\.1 Recapitulare/ });
    await expect(linkUrmator).toBeVisible();
    // Regresie: link-ul trebuie să folosească modulul/clasa reale ale
    // sublecției următoare (IX), nu clasa/modulul paginii curente (VIII).
    await expect(linkUrmator).toHaveAttribute(
      "href",
      "/curriculum/IX/ce-este-un-algoritm-etapele-elaborarii-unui-program/1.1.1"
    );
  });
});
