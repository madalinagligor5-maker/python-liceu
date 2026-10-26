import { creeazaClientAdmin } from "@/lib/supabase/admin";
import { areAcordMarketing } from "@/lib/marketing";

/**
 * Lista de emailuri pentru campanii (ex. Black Friday), doar pentru admin.
 *
 * Surse: conturile din Supabase Auth (cu acordul din user_metadata) și
 * abonații la newsletter (și-au lăsat emailul tocmai ca să primească noutăți).
 * Starea abonamentului vine din users_meta. Un email apare o singură dată.
 */

export type Contact = {
  email: string;
  areCont: boolean;
  newsletter: boolean;
  /** Acord explicit pentru emailuri de marketing (bifat la cont sau abonat la newsletter). */
  acord: boolean;
  /** Are abonament plătit activ (liceu sau curs practic). */
  platitor: boolean;
  abonament: string;
  creatLa: string | null;
};

export type FiltruLista = "promotie" | "acord" | "toate";

export const FILTRE: Record<FiltruLista, { titlu: string; descriere: string }> = {
  promotie: {
    titlu: "Pentru promoție (Black Friday)",
    descriere: "Au acord pentru oferte și NU au abonament plătit activ.",
  },
  acord: {
    titlu: "Toți cu acord pentru oferte",
    descriere: "Inclusiv cei care plătesc deja (ex. pentru anunțuri de produse noi).",
  },
  toate: {
    titlu: "Toate conturile (fără filtru)",
    descriere: "Doar ca evidență. NU trimite oferte celor fără acord (GDPR).",
  },
};

export function filtreaza(contacte: Contact[], filtru: FiltruLista): Contact[] {
  if (filtru === "promotie") return contacte.filter((c) => c.acord && !c.platitor);
  if (filtru === "acord") return contacte.filter((c) => c.acord);
  return contacte;
}

export async function listaContacte(): Promise<Contact[]> {
  const admin = creeazaClientAdmin();

  // Supabase întoarce maximum 1.000 de rânduri pe cerere; citim pe pagini,
  // altfel peste 1.000 de conturi unii plătitori ar apărea ca neplătitori.
  async function citesteTot<T>(tabel: string, coloane: string): Promise<T[]> {
    const rezultat: T[] = [];
    for (let de = 0; ; de += 1000) {
      // Ordonare stabilă după prima coloană, ca paginile să nu se suprapună.
      const { data, error } = await admin
        .from(tabel)
        .select(coloane)
        .order(coloane.split(",")[0].trim())
        .range(de, de + 999);
      if (error) throw new Error(`Nu am putut citi ${tabel}: ${error.message}`);
      rezultat.push(...((data ?? []) as T[]));
      if (!data || data.length < 1000) return rezultat;
    }
  }

  const dupaEmail = new Map<string, Contact>();
  const idLaEmail = new Map<string, string>();

  // Conturi (paginat: Supabase întoarce maximum 1000 pe pagină).
  for (let pagina = 1; ; pagina++) {
    const { data, error } = await admin.auth.admin.listUsers({ page: pagina, perPage: 1000 });
    if (error) throw new Error(`Nu am putut citi conturile: ${error.message}`);
    for (const u of data.users) {
      if (!u.email) continue;
      const email = u.email.trim().toLowerCase();
      idLaEmail.set(u.id, email);
      dupaEmail.set(email, {
        email,
        areCont: true,
        newsletter: false,
        acord: areAcordMarketing(u.user_metadata),
        platitor: false,
        abonament: "none",
        creatLa: u.created_at ?? null,
      });
    }
    if (data.users.length < 1000) break;
  }

  // Starea abonamentelor. Coloanele cursului practic se cer separat: pot lipsi
  // dacă migrarea nu a fost rulată (vezi src/lib/subscription.ts).
  const meta = await citesteTot<{ user_id: string; subscription_status: string | null }>(
    "users_meta",
    "user_id, subscription_status"
  );
  const metaCurs = await citesteTot<{ user_id: string; curs_status: string | null }>(
    "users_meta",
    "user_id, curs_status"
  ).catch(() => []);
  for (const r of meta) {
    const c = dupaEmail.get(idLaEmail.get(r.user_id) ?? "");
    if (!c) continue;
    c.abonament = r.subscription_status ?? "none";
    if (r.subscription_status === "active") c.platitor = true;
  }
  for (const r of metaCurs) {
    const c = dupaEmail.get(idLaEmail.get(r.user_id) ?? "");
    if (c && r.curs_status === "active") {
      c.platitor = true;
      c.abonament = c.abonament === "active" ? "active + curs" : "curs practic";
    }
  }

  // Abonați la newsletter.
  const newsletter = await citesteTot<{ email: string | null }>("newsletter_emails", "email").catch(() => []);
  for (const r of newsletter) {
    if (!r.email) continue;
    const email = String(r.email).trim().toLowerCase();
    const existent = dupaEmail.get(email);
    if (existent) {
      existent.newsletter = true;
      existent.acord = true;
    } else {
      dupaEmail.set(email, {
        email,
        areCont: false,
        newsletter: true,
        acord: true,
        platitor: false,
        abonament: "—",
        creatLa: null,
      });
    }
  }

  return [...dupaEmail.values()].sort((a, b) => (b.creatLa ?? "").localeCompare(a.creatLa ?? ""));
}

/** CSV compatibil cu Excel și cu importul din Resend / Mailchimp / Brevo. */
export function catreCsv(contacte: Contact[]): string {
  const camp = (v: string) => (/[",\n;]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const randuri = [
    ["email", "are_cont", "newsletter", "acord_oferte", "abonament", "creat_la"],
    ...contacte.map((c) => [
      c.email,
      c.areCont ? "da" : "nu",
      c.newsletter ? "da" : "nu",
      c.acord ? "da" : "nu",
      c.abonament,
      c.creatLa?.slice(0, 10) ?? "",
    ]),
  ];
  // BOM ca Excel să afișeze corect diacriticele.
  return "﻿" + randuri.map((r) => r.map(camp).join(",")).join("\n");
}
