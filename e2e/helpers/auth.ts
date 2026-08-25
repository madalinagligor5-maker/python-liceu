import { createClient } from "@supabase/supabase-js";
import type { Page } from "@playwright/test";

/**
 * Client Supabase cu service role — folosit DOAR din testele E2E, pentru a crea/
 * șterge conturi de test și a le seta starea de abonament direct în DB, la fel
 * cum face webhook-ul Stripe în producție. Niciodată nu importa acest fișier
 * în cod de aplicație (client sau server rulat pentru utilizatori reali).
 */
function creeazaClientAdminTest() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Lipsesc NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY — testele E2E au nevoie de acces admin la Supabase (vezi .env.local)."
    );
  }
  return createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
}

export type UtilizatorTest = {
  id: string;
  email: string;
  parola: string;
};

/**
 * Creează un cont de test real (autoconfirmat, fără email de verificare) și
 * șterge orice cont vechi cu același email dintr-o rulare anterioară întreruptă.
 */
export async function creeazaUtilizatorTest(prefix: string): Promise<UtilizatorTest> {
  const admin = creeazaClientAdminTest();
  const email = `e2e-${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}@academiapython-test.ro`;
  const parola = "ParolaTest123!";

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: parola,
    email_confirm: true,
  });

  if (error || !data.user) {
    throw new Error(`Nu s-a putut crea utilizatorul de test: ${error?.message}`);
  }

  return { id: data.user.id, email, parola };
}

/** Șterge contul de test și rândul lui din users_meta (cascadă din auth.users). */
export async function stergeUtilizatorTest(userId: string): Promise<void> {
  const admin = creeazaClientAdminTest();
  await admin.auth.admin.deleteUser(userId);
}

/**
 * Setează direct în users_meta starea de abonament/contorul AI al unui cont de
 * test, exact cum ar face-o webhook-ul Stripe sau server action-ul de evaluare
 * AI — via service role, care ocolește RLS și trigger-ul de protecție a
 * coloanelor sensibile (permis explicit pentru auth.role() = 'service_role').
 */
export async function seteazaStareUtilizatorTest(
  userId: string,
  campuri: {
    subscriptionStatus?: "none" | "active" | "past_due" | "canceled";
    stripeCustomerId?: string;
    aiRequestsToday?: number;
    lastAiRequestDate?: string;
  }
): Promise<void> {
  const admin = creeazaClientAdminTest();
  const update: Record<string, unknown> = {};
  if (campuri.subscriptionStatus !== undefined) update.subscription_status = campuri.subscriptionStatus;
  if (campuri.stripeCustomerId !== undefined) update.stripe_customer_id = campuri.stripeCustomerId;
  if (campuri.aiRequestsToday !== undefined) update.ai_requests_today = campuri.aiRequestsToday;
  if (campuri.lastAiRequestDate !== undefined) update.last_ai_request_date = campuri.lastAiRequestDate;

  const { error } = await admin.from("users_meta").update(update).eq("user_id", userId);
  if (error) {
    throw new Error(`Nu s-a putut actualiza users_meta pentru testul E2E: ${error.message}`);
  }
}

/** Citește direct din users_meta (pentru a verifica efectul real al webhook-ului). */
export async function citesteStareUtilizatorTest(userId: string) {
  const admin = creeazaClientAdminTest();
  const { data, error } = await admin
    .from("users_meta")
    .select("subscription_status, stripe_customer_id, ai_requests_today, last_ai_request_date")
    .eq("user_id", userId)
    .single();
  if (error) {
    throw new Error(`Nu s-a putut citi users_meta pentru testul E2E: ${error.message}`);
  }
  return data;
}

/** Autentifică un cont de test direct prin formularul real de login din UI. */
export async function autentificaInBrowser(
  page: Page,
  utilizator: Pick<UtilizatorTest, "email" | "parola">,
  redirectTo?: string
): Promise<void> {
  const url = redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login";
  await page.goto(url);
  await page.locator("#email").fill(utilizator.email);
  await page.locator("#parola").fill(utilizator.parola);
  await page.getByRole("button", { name: "Autentificare" }).click();
}
