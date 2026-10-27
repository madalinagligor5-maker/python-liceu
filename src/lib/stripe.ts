import Stripe from "stripe";

let instanta: Stripe | null = null;

/**
 * Client Stripe, inițializat lazy. Aruncă o eroare explicită dacă
 * STRIPE_SECRET_KEY nu e setat, în loc să eșueze silențios la runtime.
 */
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY nu este configurat.");
  }
  if (!instanta) {
    // Client HTTP bazat pe fetch: merge și pe Cloudflare Workers (unde
    // modulul http din Node nu există), și pe Node/Vercel.
    instanta = new Stripe(process.env.STRIPE_SECRET_KEY, {
      httpClient: Stripe.createFetchHttpClient(),
    });
  }
  return instanta;
}

export const STRIPE_PRICE_IDS: Record<"lunar" | "anual", string | undefined> = {
  lunar: process.env.STRIPE_PRICE_ID_LUNAR,
  anual: process.env.STRIPE_PRICE_ID_ANUAL,
};

/** Price ID-uri pentru „Curs practic de Python". Abonamentul rămâne separat
 *  de cel de liceu (webhook-ul îl recunoaște după metadata `produs`, nu după
 *  preț), dar poate folosi aceleași prețuri: fără STRIPE_PRICE_ID_CURS_*,
 *  se iau cele de liceu. */
export const STRIPE_PRICE_IDS_CURS: Record<"lunar" | "anual", string | undefined> = {
  lunar: process.env.STRIPE_PRICE_ID_CURS_LUNAR || STRIPE_PRICE_IDS.lunar,
  anual: process.env.STRIPE_PRICE_ID_CURS_ANUAL || STRIPE_PRICE_IDS.anual,
};
