import { Resend } from "resend";

/**
 * Trimite un email de notificare fondatoarei. Funcționează doar dacă
 * RESEND_API_KEY e setat — altfel scrie în consolă și nu aruncă eroare, ca
 * să nu strice fluxul de înregistrare pe medii unde emailul nu e configurat
 * (același tipar ca restul integrărilor opționale din proiect: Stripe,
 * Gemini, Supabase).
 *
 * Adresa de expediere (RESEND_FROM_EMAIL) implicit e sandbox-ul Resend
 * (onboarding@resend.dev), care funcționează fără verificare de domeniu —
 * dar DOAR către adresa cu care te-ai înregistrat pe resend.com. Pentru
 * livrare fiabilă către orice adresă, verifică domeniul academiapython.ro
 * în Resend și setează RESEND_FROM_EMAIL la o adresă de pe acel domeniu.
 */
export async function trimiteEmailAdmin(subiect: string, corpText: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const destinatar = process.env.ADMIN_EMAIL;

  if (!apiKey || !destinatar) {
    console.log(`[email dezactivat] ${subiect}\n${corpText}`);
    return;
  }

  const expeditor = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: expeditor,
      to: destinatar,
      subject: subiect,
      text: corpText,
    });
  } catch (err) {
    // Eșecul trimiterii nu trebuie să strice fluxul de înregistrare —
    // cererea de profesor tot apare în /admin/profesori, doar fără notificare.
    console.error("Nu s-a putut trimite emailul de notificare admin:", err);
  }
}
