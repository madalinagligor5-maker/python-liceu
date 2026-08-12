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
    instanta = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return instanta;
}

export const STRIPE_PRICE_IDS: Record<"lunar" | "anual", string | undefined> = {
  lunar: process.env.STRIPE_PRICE_ID_LUNAR,
  anual: process.env.STRIPE_PRICE_ID_ANUAL,
};
