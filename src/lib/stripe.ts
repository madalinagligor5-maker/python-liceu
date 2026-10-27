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

/* Price ID-urile se citesc la fiecare acces (getteri), nu o singură dată la
 * încărcarea modulului: pe Cloudflare Workers, variabilele de rulare sunt
 * disponibile abia în timpul cererii. */
export const STRIPE_PRICE_IDS: Record<"lunar" | "anual", string | undefined> = {
  get lunar() {
    return process.env.STRIPE_PRICE_ID_LUNAR?.trim() || undefined;
  },
  get anual() {
    return process.env.STRIPE_PRICE_ID_ANUAL?.trim() || undefined;
  },
};

/** Price ID-uri pentru „Curs practic de Python". Abonamentul rămâne separat
 *  de cel de liceu (webhook-ul îl recunoaște după metadata `produs`, nu după
 *  preț), dar poate folosi aceleași prețuri: fără STRIPE_PRICE_ID_CURS_*,
 *  se iau cele de liceu. */
export const STRIPE_PRICE_IDS_CURS: Record<"lunar" | "anual", string | undefined> = {
  get lunar() {
    return process.env.STRIPE_PRICE_ID_CURS_LUNAR?.trim() || STRIPE_PRICE_IDS.lunar;
  },
  get anual() {
    return process.env.STRIPE_PRICE_ID_CURS_ANUAL?.trim() || STRIPE_PRICE_IDS.anual;
  },
};
