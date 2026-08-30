import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import {
  creeazaUtilizatorTest,
  stergeUtilizatorTest,
  seteazaStareUtilizatorTest,
  autentificaInBrowser,
} from "./helpers/auth";

/**
 * Teste de atac pentru portalul de profesori (Sarcina 1). Verifică exact
 * garanția cerută: un elev obișnuit (sau neautentificat) nu poate accesa
 * nimic din zona de profesor/admin — nici rutele de pagină, nici endpoint-
 * urile de PDF (care NU sunt acoperite de gating-ul din layout, pentru că
 * layout-ul Next.js nu se aplică peste rutele din app/api/*), nici prin
 * apeluri directe către Supabase din "consolă" (același client + chei
 * publice pe care le-ar folosi cineva din browser, dar apelate direct).
 *
 * Portalul de profesori NU are nicio legătură cu conturile de elevi — fără
 * clase, fără cod de asociere — deci nu există teste de izolare elev↔clasă.
 */

function clientAnonCaUtilizator(accessToken: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  // Client anon, dar cu header-ul Authorization suprascris cu JWT-ul
  // utilizatorului de test — exact ce ar trimite un apel din consola
  // browserului cu o sesiune reală. RLS din Postgres evaluează auth.uid()
  // din acest JWT, nu din starea internă a clientului.
  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

async function obtineToken(email: string, parola: string): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const client = createClient(url, anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await client.auth.signInWithPassword({ email, password: parola });
  if (error || !data.session) throw new Error(`Autentificare eșuată în test: ${error?.message}`);
  return data.session.access_token;
}

test.describe("Portal profesori — atac din contul de elev / neautentificat", () => {
  test("1. Neautentificat: /profesor/* și /admin/* redirecționează la login", async ({ page }) => {
    await page.goto("/profesor/planificari");
    await expect(page).toHaveURL(/\/login/);

    await page.goto("/admin/profesori");
    await expect(page).toHaveURL(/\/login/);
  });

  test("2. Elev obișnuit autentificat nu poate accesa /profesor/* sau /admin/*", async ({ page }) => {
    const elev = await creeazaUtilizatorTest("elev-atac");
    try {
      await autentificaInBrowser(page, elev);
      await page.waitForLoadState("networkidle");

      await page.goto("/profesor/planificari");
      await expect(page).not.toHaveURL(/\/profesor\/planificari/);
      await expect(page.getByText("Generator de teste").first()).toHaveCount(0);

      await page.goto("/profesor/fise");
      await expect(page).not.toHaveURL(/\/profesor\/fise/);

      await page.goto("/profesor/teste/generator");
      await expect(page).not.toHaveURL(/\/profesor\/teste/);

      await page.goto("/admin/profesori");
      await expect(page).not.toHaveURL(/\/admin\/profesori/);
      await expect(page.getByText("Cereri de acces").first()).toHaveCount(0);
    } finally {
      await stergeUtilizatorTest(elev.id);
    }
  });

  test("3. Profesor în așteptare nu poate accesa zona de profesor, doar ecranul de așteptare", async ({ page }) => {
    const candidat = await creeazaUtilizatorTest("prof-asteptare");
    try {
      await seteazaStareUtilizatorTest(candidat.id, { rol: "profesor_in_asteptare" });
      await autentificaInBrowser(page, candidat);
      await page.waitForLoadState("networkidle");

      await page.goto("/profesor/planificari");
      await expect(page).toHaveURL(/\/profesor-asteptare/);
    } finally {
      await stergeUtilizatorTest(candidat.id);
    }
  });

  test("4. Elev nu-și poate seta singur rol='profesor_aprobat' printr-un update direct", async () => {
    const elev = await creeazaUtilizatorTest("elev-rol-hack");
    try {
      const token = await obtineToken(elev.email, elev.parola);
      const client = clientAnonCaUtilizator(token);
      const userId = (await client.auth.getUser(token)).data.user!.id;

      await client.from("users_meta").update({ rol: "profesor_aprobat" }).eq("user_id", userId);

      // Verificăm efectul REAL: trigger-ul de protecție a coloanelor
      // sensibile (protejeaza_coloane_sensibile) trebuie să fi anulat
      // scrierea pe coloana `rol` — citim înapoi cu același client RLS.
      const verificare = await client.from("users_meta").select("rol").eq("user_id", userId).maybeSingle();
      expect(verificare.data?.rol).not.toBe("profesor_aprobat");
    } finally {
      await stergeUtilizatorTest(elev.id);
    }
  });

  test("5. Endpoint-urile de PDF nu sunt acoperite de layout — trebuie să-și verifice singure rolul", async ({
    page,
    request,
  }) => {
    // Neautentificat, direct pe endpoint-ul de PDF (nu prin pagină).
    const raspunsAnonim = await request.get("/api/profesor-pdf/planificare/IX");
    expect(raspunsAnonim.status()).not.toBe(200);
    expect(raspunsAnonim.headers()["content-type"] ?? "").not.toContain("application/pdf");

    // Autentificat ca elev obișnuit — nu doar fără sesiune.
    const elev = await creeazaUtilizatorTest("elev-pdf-atac");
    try {
      await autentificaInBrowser(page, elev);
      await page.waitForLoadState("networkidle");

      const raspunsPlanificare = await page.request.get("/api/profesor-pdf/planificare/IX");
      expect(raspunsPlanificare.status()).not.toBe(200);
      expect(raspunsPlanificare.headers()["content-type"] ?? "").not.toContain("application/pdf");

      const raspunsFisa = await page.request.get("/api/profesor-pdf/fisa/IX/clasa-str-metode-de-baza");
      expect(raspunsFisa.status()).not.toBe(200);
      expect(raspunsFisa.headers()["content-type"] ?? "").not.toContain("application/pdf");

      const raspunsTest = await page.request.post("/api/profesor-pdf/test", {
        data: {
          clasa: "IX",
          arataRaspunsuri: false,
          intrebari: [{ intrebare: "test?", variante: ["a", "b"], corect: 0 }],
        },
      });
      expect(raspunsTest.status()).not.toBe(200);
      expect(raspunsTest.headers()["content-type"] ?? "").not.toContain("application/pdf");
    } finally {
      await stergeUtilizatorTest(elev.id);
    }
  });
});
