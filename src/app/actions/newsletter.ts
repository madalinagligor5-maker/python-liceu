"use server";

import { creeazaClientServer } from "@/lib/supabase/server";

export async function aboneazaNewsletter(emailTrimis: string) {
  const email = emailTrimis.trim().toLowerCase();
  
  // Validare email
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
    return { ok: false, eroare: "Te rugăm să introduci o adresă de email validă." };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { ok: false, eroare: "Configurația bazei de date lipsește." };
  }

  try {
    const supabase = await creeazaClientServer();
    const { error } = await supabase
      .from("newsletter_emails")
      .insert({ email });

    if (error) {
      if (error.code === "23505") { // cod eroare Postgres pentru cheie duplicată (unique_violation)
        return { ok: true, dejaAbonat: true };
      }
      return { ok: false, eroare: error.message };
    }

    return { ok: true, dejaAbonat: false };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, eroare: "A apărut o eroare neașteptată: " + msg };
  }
}
