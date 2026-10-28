import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { creeazaClientAdmin } from "@/lib/supabase/admin";
import { areAbonamentCursActiv, type UtilizatorMeta } from "@/lib/subscription";

/**
 * Acces la „Curs practic de Python", cu Stripe ca sursă de rezervă.
 *
 * Accesul vine în mod normal din users_meta.curs_status, scris de webhook-ul
 * Stripe. Dacă webhook-ul n-a ajuns (endpoint greșit după mutarea pe
 * Cloudflare, secret lipsă, coloane curs_* nemigrate), un client care a plătit
 * ar rămâne blocat. Atunci întrebăm Stripe direct: un abonament „curs" activ
 * sau în perioada de probă dă acces și se scrie înapoi în users_meta.
 * Se apelează doar pentru utilizatori autentificați, fără acces, pe pagini cu
 * plată — vizitatorii anonimi și abonații nu ajung la Stripe.
 */
export async function areAccesCurs(
  user: { id: string; email: string } | null,
  meta: UtilizatorMeta | null
): Promise<boolean> {
  if (areAbonamentCursActiv(meta)) return true;
  if (!user || !meta) return false;

  try {
    const abonament = await gasesteAbonamentCursActiv(user, meta.stripeCustomerId);
    if (!abonament) return false;
    await salveazaInUsersMeta(user.id, abonament);
    meta.cursStatus = "active";
    return true;
  } catch (e) {
    console.error("[curs-acces] verificarea în Stripe a eșuat", {
      userId: user.id,
      mesaj: e instanceof Error ? e.message : String(e),
    });
    return false;
  }
}

async function gasesteAbonamentCursActiv(
  user: { id: string; email: string },
  stripeCustomerId: string | null
): Promise<Stripe.Subscription | null> {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  const stripe = getStripe();

  // Clientul salvat în users_meta, plus orice client Stripe cu același email
  // (dacă users_meta n-a apucat să primească stripe_customer_id).
  const clienti = new Set<string>();
  if (stripeCustomerId) clienti.add(stripeCustomerId);
  if (user.email) {
    const gasiti = await stripe.customers.list({ email: user.email, limit: 10 });
    gasiti.data.forEach((c) => clienti.add(c.id));
  }

  for (const customer of clienti) {
    const abonamente = await stripe.subscriptions.list({ customer, status: "all", limit: 20 });
    const gasit = abonamente.data.find(
      (s) =>
        s.metadata?.produs === "curs" &&
        (s.status === "active" || s.status === "trialing") &&
        // Un client găsit doar după email trebuie să fie al acestui cont.
        (customer === stripeCustomerId || s.metadata?.supabase_user_id === user.id)
    );
    if (gasit) return gasit;
  }
  return null;
}

async function salveazaInUsersMeta(userId: string, abonament: Stripe.Subscription) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  const perioada = abonament.items.data[0]?.current_period_end;
  const customerId =
    typeof abonament.customer === "string" ? abonament.customer : abonament.customer.id;
  // Eșecul scrierii nu blochează accesul: abonamentul e confirmat de Stripe.
  const { error } = await creeazaClientAdmin()
    .from("users_meta")
    .update({
      stripe_customer_id: customerId,
      curs_status: "active",
      curs_current_period_end: perioada ? new Date(perioada * 1000).toISOString() : null,
      curs_cancel_at_period_end: abonament.cancel_at_period_end,
    })
    .eq("user_id", userId);
  if (error) {
    console.error("[curs-acces] abonament activ în Stripe, dar users_meta nu s-a actualizat", {
      userId,
      mesaj: error.message,
    });
  }
}
