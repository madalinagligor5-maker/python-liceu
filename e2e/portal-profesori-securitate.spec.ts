import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import {
  creeazaUtilizatorTest,
  stergeUtilizatorTest,
  seteazaStareUtilizatorTest,
  autentificaInBrowser,
} from "./helpers/auth";
import { creeazaClasaTest, stergeClasaTest } from "./helpers/clase";

/**
 * Teste de atac pentru portalul de profesori (Sarcina 1 + Sarcina 4).
 * Verifică exact garanția cerută: un elev obișnuit (sau neautentificat) nu
 * poate accesa nimic din zona de profesor/admin, nici prin URL direct, nici
 * apelând Supabase direct din "consolă" (aceleași client + chei publice pe
 * care le-ar folosi cineva din browser, dar apelate direct — ocolind
 * complet server action-urile din aplicație, exact tiparul de atac descris
 * în promptul original: RPC apelat direct din consola browserului).
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
    await page.goto("/profesor/clase");
    await expect(page).toHaveURL(/\/login/);

    await page.goto("/admin/profesori");
    await expect(page).toHaveURL(/\/login/);
  });

  test("2. Elev obișnuit autentificat nu poate accesa /profesor/* sau /admin/*", async ({ page }) => {
    const elev = await creeazaUtilizatorTest("elev-atac");
    try {
      await autentificaInBrowser(page, elev);
      await page.waitForLoadState("networkidle");

      await page.goto("/profesor/clase");
      await expect(page).not.toHaveURL(/\/profesor\/clase/);
      await expect(page.getByText("Clasele mele").first()).toHaveCount(0);

      await page.goto("/profesor/planificari/IX");
      await expect(page).not.toHaveURL(/\/profesor\/planificari/);

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

      await page.goto("/profesor/clase");
      await expect(page).toHaveURL(/\/profesor-asteptare/);
    } finally {
      await stergeUtilizatorTest(candidat.id);
    }
  });

  test("4. Elev nu poate crea o clasă direct din Supabase (RLS), ocolind server action-ul", async () => {
    const elev = await creeazaUtilizatorTest("elev-rls-clase");
    try {
      const token = await obtineToken(elev.email, elev.parola);
      const client = clientAnonCaUtilizator(token);

      const { error } = await client
        .from("clase")
        .insert({ profesor_id: (await client.auth.getUser(token)).data.user!.id, nume_clasa: "Clasă fantomă" });

      expect(error).not.toBeNull();
    } finally {
      await stergeUtilizatorTest(elev.id);
    }
  });

  test("5. Elev nu-și poate seta singur rol='profesor_aprobat' printr-un update direct", async () => {
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

  test("6. Un profesor nu poate vedea progresul unei clase care nu e a lui", async () => {
    const profA = await creeazaUtilizatorTest("prof-a");
    const profB = await creeazaUtilizatorTest("prof-b");
    let clasaA: { id: string; codClasa: string } | null = null;
    try {
      await seteazaStareUtilizatorTest(profA.id, { rol: "profesor_aprobat" });
      await seteazaStareUtilizatorTest(profB.id, { rol: "profesor_aprobat" });
      clasaA = await creeazaClasaTest(profA.id, "Clasa lui A");

      const tokenB = await obtineToken(profB.email, profB.parola);
      const clientB = clientAnonCaUtilizator(tokenB);

      const { data, error } = await clientB.rpc("progres_elevi_clasa", { p_clasa_id: clasaA.id });

      // RPC-ul trebuie fie să arunce eroare ("Acces interzis"), fie să
      // întoarcă un set gol — niciodată datele elevilor din clasa lui A.
      expect(error !== null || (Array.isArray(data) && data.length === 0)).toBe(true);
    } finally {
      if (clasaA) await stergeClasaTest(clasaA.id);
      await stergeUtilizatorTest(profA.id);
      await stergeUtilizatorTest(profB.id);
    }
  });

  test("7. Un elev nu poate citi asocierile altui elev cu o clasă (RLS pe clasa_elevi)", async () => {
    const profesor = await creeazaUtilizatorTest("prof-privacy");
    const elevTinta = await creeazaUtilizatorTest("elev-tinta");
    const elevAtacator = await creeazaUtilizatorTest("elev-atacator");
    let clasa: { id: string; codClasa: string } | null = null;
    try {
      await seteazaStareUtilizatorTest(profesor.id, { rol: "profesor_aprobat" });
      clasa = await creeazaClasaTest(profesor.id, "Clasa privacy");

      const tokenTinta = await obtineToken(elevTinta.email, elevTinta.parola);
      const clientTinta = clientAnonCaUtilizator(tokenTinta);
      await clientTinta.rpc("asociaza_elev_la_clasa", { p_cod_clasa: clasa.codClasa });

      const tokenAtacator = await obtineToken(elevAtacator.email, elevAtacator.parola);
      const clientAtacator = clientAnonCaUtilizator(tokenAtacator);

      const { data } = await clientAtacator.from("clasa_elevi").select("*").eq("clasa_id", clasa.id);
      expect(data ?? []).toHaveLength(0);
    } finally {
      if (clasa) await stergeClasaTest(clasa.id);
      await stergeUtilizatorTest(profesor.id);
      await stergeUtilizatorTest(elevTinta.id);
      await stergeUtilizatorTest(elevAtacator.id);
    }
  });
});
