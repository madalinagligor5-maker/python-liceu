import { test, expect } from "@playwright/test";

/**
 * Nu presupunem că JSON-ul "arată bine" — îl extragem din HTML-ul randat și
 * îl parsăm efectiv, verificând prezența câmpurilor obligatorii pentru
 * fiecare tip de schema.org adăugat.
 */
async function extrageBlocuriJsonLd(page: import("@playwright/test").Page) {
  const scripturi = await page.locator('script[type="application/ld+json"]').allTextContents();
  return scripturi.map((s) => JSON.parse(s));
}

test.describe("Date structurate (JSON-LD) — parsează valid și au câmpurile obligatorii", () => {
  test("Homepage: Organization + Course (existente) și FAQPage (nou)", async ({ page }) => {
    await page.goto("/");
    const blocuri = await extrageBlocuriJsonLd(page);
    expect(blocuri.length).toBeGreaterThan(0);

    const graf = blocuri.find((b) => Array.isArray(b["@graph"]));
    expect(graf).toBeTruthy();

    const faq = blocuri.find((b) => b["@type"] === "FAQPage");
    expect(faq).toBeTruthy();
    expect(Array.isArray(faq.mainEntity)).toBe(true);
    expect(faq.mainEntity.length).toBeGreaterThan(0);
    for (const item of faq.mainEntity) {
      expect(item["@type"]).toBe("Question");
      expect(typeof item.name).toBe("string");
      expect(item.name.length).toBeGreaterThan(0);
      expect(item.acceptedAnswer?.["@type"]).toBe("Answer");
      expect(typeof item.acceptedAnswer?.text).toBe("string");
      expect(item.acceptedAnswer.text.length).toBeGreaterThan(0);
    }
  });

  test("Pagina de clasă (/curriculum/IX): BreadcrumbList cu 2 niveluri", async ({ page }) => {
    await page.goto("/curriculum/IX");
    const blocuri = await extrageBlocuriJsonLd(page);
    const breadcrumb = blocuri.find((b) => b["@type"] === "BreadcrumbList");
    expect(breadcrumb).toBeTruthy();
    expect(breadcrumb.itemListElement).toHaveLength(2);
    expect(breadcrumb.itemListElement[0].name).toBe("Curriculum");
    expect(breadcrumb.itemListElement[0].item).toBe("https://www.academiapython.ro/curriculum");
    expect(breadcrumb.itemListElement[1].name).toBe("Clasa a IX-a");
    // Ultimul element (pagina curentă) nu trebuie să aibă `item`.
    expect(breadcrumb.itemListElement[1].item).toBeUndefined();
  });

  test("Pagina de modul (/curriculum/IX/...): BreadcrumbList cu 3 niveluri", async ({ page }) => {
    await page.goto("/curriculum/IX");
    const primulModul = await page.locator('a[href^="/curriculum/IX/"]').first().getAttribute("href");
    expect(primulModul).toBeTruthy();

    await page.goto(primulModul!);
    const blocuri = await extrageBlocuriJsonLd(page);
    const breadcrumb = blocuri.find((b) => b["@type"] === "BreadcrumbList");
    expect(breadcrumb).toBeTruthy();
    expect(breadcrumb.itemListElement).toHaveLength(3);
    expect(breadcrumb.itemListElement[2].item).toBeUndefined();
  });

  test("Articol de blog: Article valid + BreadcrumbList cu 2 niveluri", async ({ page }) => {
    await page.goto("/blog/schimbari-bacalaureat-informatica-python-2030");
    const blocuri = await extrageBlocuriJsonLd(page);

    const articol = blocuri.find((b) => b["@type"] === "Article");
    expect(articol).toBeTruthy();
    expect(typeof articol.headline).toBe("string");
    expect(articol.headline.length).toBeGreaterThan(0);
    expect(typeof articol.description).toBe("string");
    expect(articol.description.length).toBeGreaterThan(0);
    expect(articol.datePublished).toBe("2026-08-29");
    expect(articol.url).toBe(
      "https://www.academiapython.ro/blog/schimbari-bacalaureat-informatica-python-2030"
    );

    const breadcrumb = blocuri.find((b) => b["@type"] === "BreadcrumbList");
    expect(breadcrumb).toBeTruthy();
    expect(breadcrumb.itemListElement).toHaveLength(2);
    expect(breadcrumb.itemListElement[0].name).toBe("Blog");
  });
});

test.describe("Linkuri interne blog ↔ curriculum", () => {
  test("Articolul despre schimbarea de programă leagă spre /curriculum/IX", async ({ page }) => {
    await page.goto("/blog/schimbari-bacalaureat-informatica-python-2030");
    const link = page.locator('a[href="/curriculum/IX"]').first();
    await expect(link).toBeVisible();
  });

  test("Pagina /curriculum/IX leagă spre articolul despre schimbarea de programă", async ({ page }) => {
    await page.goto("/curriculum/IX");
    const link = page.locator(
      'a[href="/blog/schimbari-bacalaureat-informatica-python-2030"]'
    );
    await expect(link).toBeVisible();
  });

  test("Homepage arată secțiunea Ultimele din blog cu link către /blog", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Ultimele din blog" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Vezi tot blogul →" }).first()).toBeVisible();
  });
});

test.describe("Crawlability de bază", () => {
  test("robots.txt e accesibil, permite paginile publice și listează sitemap-ul", async ({ request }) => {
    const raspuns = await request.get("/robots.txt");
    expect(raspuns.status()).toBe(200);
    const text = await raspuns.text();
    expect(text).toContain("Sitemap: https://www.academiapython.ro/sitemap.xml");
    expect(text).not.toMatch(/Disallow:\s*\/curriculum/);
    expect(text).not.toMatch(/Disallow:\s*\/blog/);
    expect(text).not.toMatch(/Disallow:\s*\/lectii/);
    expect(text).not.toMatch(/Disallow:\s*\/resurse/);
  });

  test("sitemap.xml e accesibil și conține paginile principale", async ({ request }) => {
    const raspuns = await request.get("/sitemap.xml");
    expect(raspuns.status()).toBe(200);
    const text = await raspuns.text();
    expect(text).toContain("/curriculum");
    expect(text).toContain("/blog/schimbari-bacalaureat-informatica-python-2030");
  });
});
