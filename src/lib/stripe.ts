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

/** Price ID-uri pentru „Curs practic de Python" -- produs separat de
 *  abonamentul de liceu, cu propriile preturi Stripe (configurate de
 *  fondatoare in Stripe Dashboard, apoi adaugate ca variabile de mediu --
 *  nu sunt create din cod). */
export const STRIPE_PRICE_IDS_CURS: Record<"lunar" | "anual", string | undefined> = {
  lunar: process.env.STRIPE_PRICE_ID_CURS_LUNAR,
  anual: process.env.STRIPE_PRICE_ID_CURS_ANUAL,
};
