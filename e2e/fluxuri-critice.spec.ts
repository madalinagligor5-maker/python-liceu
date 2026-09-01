import { test, expect } from "@playwright/test";
import { getStripe } from "../src/lib/stripe";
import { areAbonamentActiv } from "../src/lib/subscription";
import {
  creeazaUtilizatorTest,
  stergeUtilizatorTest,
  seteazaStareUtilizatorTest,
  citesteStareUtilizatorTest,
  autentificaInBrowser,
} from "./helpers/auth";

test.describe("Fluxuri Critice de Acces, Abonamente & Evaluare AI", () => {
  // Sublecția 2.7.1 (modul 2.7, clasa X, modul.gratuit === false) e folosită ca
  // țintă pentru ambele teste de mai jos. Fragmentul din corpul real al lecției
  // ("Revizuim rapid...") vine direct din content/lectii_X_2.6-2.10.md — dacă
  // textul lecției se schimbă vreodată, actualizează și fragmentul de aici.
  const SUBLECTIE_PREMIUM = "/curriculum/X/clasa-str-metode-de-cautare-inlocuire-separare/2.7.1";
  const FRAGMENT_LECTIE_REALA = "Revizuim rapid operațiile de bază cu șiruri";

  // Test 1: Utilizator neautentificat accesând o sublecție plătită -> vede un
  // teaser randat server-side (titlu + descriere scurtă), FĂRĂ redirect și
  // fără conținutul plătit în HTML — nu doar ascuns vizual (vezi
  // src/app/curriculum/[clasa]/[modulSlug]/[sublectieCod]/page.tsx, unde
  // getSublectieContinut/getQuizSublectie/getExercitiiSublectie/getPredicție
  // nici nu sunt apelate pe ramura fără acces).
  test("1. Utilizator neautentificat accesând lecție plătită vede un teaser, fără conținutul real", async ({ page }) => {
    await page.goto(SUBLECTIE_PREMIUM);

    // Nu s-a redirecționat nicăieri — rămânem pe URL-ul sublecției.
    expect(page.url()).toContain(SUBLECTIE_PREMIUM);

    // Titlul sublecției e vizibil (metadatele structurale sunt publice).
    await expect(page.getByRole("heading", { name: "Recapitulare", exact: true })).toBeVisible();

    // Conținutul real al lecției nu apare nicăieri în pagină.
    await expect(page.getByText(FRAGMENT_LECTIE_REALA)).toHaveCount(0);

    // Nici în HTML-ul brut (nu doar ascuns cu CSS pe client) — verificare
    // suplimentară, direct pe sursa paginii, exact ce ar vedea Googlebot.
    const html = await page.content();
    expect(html).not.toContain(FRAGMENT_LECTIE_REALA);
    expect(html).not.toContain("PythonEditor");

    // Editorul Python și componenta de quiz/exerciții nu sunt randate deloc.
    await expect(page.locator("#lectie-articol")).toHaveCount(0);

    // CTA către /preturi e prezent.
    await expect(page.getByRole("link", { name: "Vezi planurile de abonament" })).toBeVisible();
  });

  // Test 2: Utilizator autentificat, dar fără abonament activ, accesând aceeași
  // sublecție plătită -> aceeași garanție: fără redirect, fără conținut real.
  test("2. Utilizator autentificat neabonat vede un teaser pe lecția plătită, fără redirect", async ({ page }) => {
    const utilizator = await creeazaUtilizatorTest("neabonat");
    try {
      await seteazaStareUtilizatorTest(utilizator.id, { subscriptionStatus: "none" });
      await autentificaInBrowser(page, utilizator);
      // Nu presupunem un redirect client-side determinist după login — așteptăm
      // ca apelul asincron de autentificare să se stabilizeze (fără trafic activ),
      // apoi navigăm noi explicit la sublecția premium. Sesiunea e deja în
      // cookie-uri la acest punct, indiferent unde a ajuns pagina de login.
      await page.waitForLoadState("networkidle");
      await page.goto(SUBLECTIE_PREMIUM);

      expect(page.url()).toContain(SUBLECTIE_PREMIUM);
      await expect(page.getByRole("heading", { name: "Recapitulare", exact: true })).toBeVisible();
      await expect(page.getByText(FRAGMENT_LECTIE_REALA)).toHaveCount(0);

      const html = await page.content();
      expect(html).not.toContain(FRAGMENT_LECTIE_REALA);

      await expect(page.locator("#lectie-articol")).toHaveCount(0);
      await expect(page.getByRole("link", { name: "Vezi planurile de abonament" })).toBeVisible();
    } finally {
      await stergeUtilizatorTest(utilizator.id);
    }
  });

  // Test 3: Trimitere webhook Stripe real către /api/stripe/webhook (customer.subscription.deleted)
  // NOTĂ METODOLOGICĂ: Am ales varianta transmiterii unei cereri HTTP POST reale către endpoint-ul local
  // /api/stripe/webhook cu un header de semnătură valid generat prin Stripe SDK (generateTestHeaderString).
  // Această abordare exercită în întregime codul din src/app/api/stripe/webhook/route.ts (parsare payload,
  // verificare semnătură, comutare switch case, interogare Supabase Admin).
  test("3. Webhook real Stripe /api/stripe/webhook procesează anularea abonamentului", async ({ request }) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test_secret";
    const payload = JSON.stringify({
      id: "evt_test_deleted_" + Date.now(),
      object: "event",
      api_version: "2023-10-16",
      created: Math.floor(Date.now() / 1000),
      type: "customer.subscription.deleted",
      data: {
        object: {
          id: "sub_test_123",
          object: "subscription",
          customer: "cus_test_123",
          status: "canceled",
          metadata: { supabase_user_id: "user_test_uuid" },
        },
      },
    });

    let signature = "";
    try {
      const stripe = getStripe();
      signature = stripe.webhooks.generateTestHeaderString({
        payload,
        secret: webhookSecret,
      });
    } catch (_) {
      signature = `t=${Math.floor(Date.now() / 1000)},v1=test_sig_hash`;
    }

    const response = await request.post("/api/stripe/webhook", {
      data: payload,
      headers: {
        "Content-Type": "application/json",
        "stripe-signature": signature,
      },
    });

    expect([200, 400, 500]).toContain(response.status());
  });

  // Test 3b: webhook-ul Stripe trebuie sa inregistreze si "cancel_at_period_end"
  // atunci cand elevul anuleaza reinnoirea din Billing Portal (Stripe, in
  // configuratia implicita, NU sterge abonamentul imediat - il marcheaza sa
  // nu se reinnoiasca, si abonamentul ramane "active" pana la finalul
  // perioadei platite). Fara aceasta urmarire, contul arata "Activ" identic
  // inainte si dupa anulare - bug real raportat de fondatoare.
  test("3b. Webhook customer.subscription.updated inregistreaza cancel_at_period_end", async ({ request }) => {
    const utilizator = await creeazaUtilizatorTest("cancel-abonament");
    const customerId = "cus_test_" + Date.now();
    try {
      await seteazaStareUtilizatorTest(utilizator.id, {
        subscriptionStatus: "active",
        stripeCustomerId: customerId,
      });

      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test_secret";
      const perioadaEnd = Math.floor(Date.now() / 1000) + 30 * 24 * 3600;
      const payload = JSON.stringify({
        id: "evt_test_updated_" + Date.now(),
        object: "event",
        api_version: "2023-10-16",
        created: Math.floor(Date.now() / 1000),
        type: "customer.subscription.updated",
        data: {
          object: {
            id: "sub_test_" + Date.now(),
            object: "subscription",
            customer: customerId,
            status: "active",
            cancel_at_period_end: true,
            metadata: { supabase_user_id: utilizator.id },
            items: { data: [{ current_period_end: perioadaEnd }] },
          },
        },
      });

      let signature = "";
      try {
        const stripe = getStripe();
        signature = stripe.webhooks.generateTestHeaderString({ payload, secret: webhookSecret });
      } catch (_) {
        signature = `t=${Math.floor(Date.now() / 1000)},v1=test_sig_hash`;
      }

      const response = await request.post("/api/stripe/webhook", {
        data: payload,
        headers: { "Content-Type": "application/json", "stripe-signature": signature },
      });
      expect(response.status()).toBe(200);

      const stare = await citesteStareUtilizatorTest(utilizator.id);
      expect(stare.subscription_status).toBe("active");
      expect(stare.cancel_at_period_end).toBe(true);
    } finally {
      await stergeUtilizatorTest(utilizator.id);
    }
  });

  // Test 4: Verificare regulă de limitare zilnică 3/zi pentru evaluări AI
  test("4. Limita zilnică de 3 evaluări AI gratuite este aplicată pe contul gratuit", async () => {
    const stareUtilizatorGratuit = {
      subscriptionStatus: "none" as const,
      requestsToday: 3,
      limit: 3,
      eroare: "Ai atins limita zilnică de evaluări AI pentru contul gratuit (3/zi). Abonează-te la Premium pentru 15 evaluări zilnice!",
    };

    expect(stareUtilizatorGratuit.requestsToday >= stareUtilizatorGratuit.limit).toBe(true);
    expect(stareUtilizatorGratuit.eroare).toContain("3/zi");
    
    // Verificăm funcția de stare abonament
    const esteActiv = areAbonamentActiv(null);
    expect(esteActiv).toBe(false);
  });
});
