import { getStripe, STRIPE_PRICE_IDS, STRIPE_PRICE_IDS_CURS } from "@/lib/stripe";

/**
 * Sursa unică pentru ofertă (prețuri, probă, promoție), folosită de paginile
 * de prețuri și de textele care menționează oferta.
 *
 * Prețurile afișate se citesc din Stripe (prețurile reale folosite la plată)
 * când cheile sunt configurate. Valorile de rezervă de mai jos sunt cele
 * afișate public până acum și se folosesc doar dacă Stripe nu răspunde
 * (ex. mediu local fără chei). Nu modificăm prețuri sau produse aici.
 */

export type Plan = "lunar" | "anual";

export type PretAfisat = {
  /** Suma în unități întregi ale monedei (ex. 15 pentru 15 lei). */
  suma: number;
  moneda: string;
  /** "month" | "year" */
  interval: "month" | "year";
  intervalNumar: number;
  sursa: "stripe" | "rezerva";
};

/** Prețurile afișate public înainte de integrarea cu Stripe (rezervă). */
const REZERVA_LICEU: Record<Plan, PretAfisat> = {
  lunar: { suma: 15, moneda: "ron", interval: "month", intervalNumar: 1, sursa: "rezerva" },
  anual: { suma: 89, moneda: "ron", interval: "year", intervalNumar: 1, sursa: "rezerva" },
};

/** Prețurile standard declarate, afișate ca reper lângă prețul de lansare. */
export const PRET_STANDARD_LICEU: Record<Plan, number> = { lunar: 29, anual: 199 };

/**
 * Promoția de lansare. Textul vechi spunea „Valabil 3 luni!", fără dată de
 * început sau de sfârșit. Istoricul din repository (început pe 24.08.2026)
 * nu permite stabilirea datei reale, așa că data de încheiere trebuie
 * completată de administratoare. Cât timp e `null`, pagina nu afirmă nicio
 * durată a promoției.
 */
export const PROMO_LANSARE: { valabilPanaLa: string | null } = {
  valabilPanaLa: null, // format "AAAA-LL-ZZ", ex. "2026-11-30"
};

/** Perioada de probă, exact cum e configurată în /api/checkout. */
export const PROBA = {
  zile: 7,
  /** Stripe Checkout (mode "subscription") cere cardul la înscriere. */
  cereCard: true,
};

/** Limitele reale ale asistentului AI (src/app/actions/ai-evaluation.ts, ai-demo.ts). */
export const LIMITE_AI = {
  evaluariPeZiGratuit: 3,
  evaluariPeZiAbonament: 15,
  intrebariDemoPeZi: 1,
};

const TTL_MS = 60 * 60 * 1000;
const cache = new Map<string, { la: number; pret: PretAfisat | null }>();

async function citestePretStripe(priceId: string | undefined): Promise<PretAfisat | null> {
  if (!priceId || !priceId.startsWith("price_") || !process.env.STRIPE_SECRET_KEY) return null;
  const dinCache = cache.get(priceId);
  if (dinCache && Date.now() - dinCache.la < TTL_MS) return dinCache.pret;
  try {
    const p = await getStripe().prices.retrieve(priceId);
    const pret: PretAfisat | null =
      p.unit_amount != null && p.recurring
        ? {
            suma: p.unit_amount / 100,
            moneda: p.currency,
            interval: p.recurring.interval === "year" ? "year" : "month",
            intervalNumar: p.recurring.interval_count,
            sursa: "stripe",
          }
        : null;
    cache.set(priceId, { la: Date.now(), pret });
    return pret;
  } catch (e) {
    console.error("[oferta] nu s-a putut citi prețul din Stripe", priceId, e instanceof Error ? e.message : e);
    return null;
  }
}

export async function getPreturiLiceu(): Promise<Record<Plan, PretAfisat>> {
  const [lunar, anual] = await Promise.all([
    citestePretStripe(STRIPE_PRICE_IDS.lunar),
    citestePretStripe(STRIPE_PRICE_IDS.anual),
  ]);
  return { lunar: lunar ?? REZERVA_LICEU.lunar, anual: anual ?? REZERVA_LICEU.anual };
}

/** Cursul practic nu are prețuri de rezervă publicate: fără Stripe, nu afișăm o sumă. */
export async function getPreturiCurs(): Promise<Record<Plan, PretAfisat | null>> {
  const [lunar, anual] = await Promise.all([
    citestePretStripe(STRIPE_PRICE_IDS_CURS.lunar),
    citestePretStripe(STRIPE_PRICE_IDS_CURS.anual),
  ]);
  return { lunar, anual };
}

export function formateazaSuma(p: Pick<PretAfisat, "suma" | "moneda">): string {
  const suma = Number.isInteger(p.suma) ? String(p.suma) : p.suma.toFixed(2).replace(".", ",");
  return p.moneda.toLowerCase() === "ron" ? `${suma} lei` : `${suma} ${p.moneda.toUpperCase()}`;
}

export function formateazaPerioada(p: Pick<PretAfisat, "interval" | "intervalNumar">): string {
  if (p.intervalNumar === 1) return p.interval === "year" ? "an" : "lună";
  return p.interval === "year" ? `${p.intervalNumar} ani` : `${p.intervalNumar} luni`;
}

export function formateazaData(iso: string): string {
  const [a, l, z] = iso.split("-").map(Number);
  const luni = ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"];
  return `${z} ${luni[l - 1]} ${a}`;
}
