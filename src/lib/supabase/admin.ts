import { createClient } from "@supabase/supabase-js";

/**
 * Client cu service role — ocolește RLS. Folosit exclusiv server-side, din
 * webhook-ul Stripe, unde nu există o sesiune de utilizator autentificat.
 * Nu importa acest fișier în cod care rulează în browser.
 */
export function creeazaClientAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
