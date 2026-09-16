import { creeazaClientServer } from "@/lib/supabase/server";
import type { RolUtilizator } from "@/lib/roluri";

export type UtilizatorMeta = {
  userId: string;
  email: string;
  subscriptionStatus: "none" | "active" | "past_due" | "canceled";
  subscriptionCurrentPeriodEnd: string | null;
  /** True dacă abonamentul e programat să nu se reînnoiască la finalul
   *  perioadei curente (anulat din Stripe Billing Portal, dar nu imediat —
   *  comportamentul implicit Stripe: rămâne "active" până la capătul
   *  perioadei plătite). */
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
  /** Starea abonamentului la "Curs practic de Python" -- produs separat de
   *  cel de liceu, cu propriile coloane in users_meta. */
  cursStatus: "none" | "active" | "past_due" | "canceled";
  cursCurrentPeriodEnd: string | null;
  cursCancelAtPeriodEnd: boolean;
  xpTotal: number;
  streakZile: number;
  clasa: string | null;
  nivel: number;
  rol: RolUtilizator;
  scoala: string | null;
};

/**
 * Citește utilizatorul curent și starea abonamentului lui, direct din Supabase,
 * server-side. Întoarce { user: null } dacă nu există sesiune — nu aruncă eroare
 * dacă Supabase nu e configurat, ca lecțiile gratuite să rămână accesibile.
 */
export async function getUtilizatorCurent(): Promise<{
  user: { id: string; email: string } | null;
  meta: UtilizatorMeta | null;
}> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { user: null, meta: null };
  }

  const supabase = await creeazaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, meta: null };

  const { data: meta } = await supabase
    .from("users_meta")
    .select(
      "subscription_status, subscription_current_period_end, cancel_at_period_end, stripe_customer_id, xp_total, streak_zile, clasa, rol, scoala"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  // Coloanele "Curs practic de Python" sunt cerute într-o interogare SEPARATĂ,
  // tolerantă la erori: până la rularea migrare-curs-practic.sql pe baza de
  // date reală, aceste coloane nu există încă. Dacă le-am fi cerut în
  // interogarea de mai sus, un select eșuat ar fi întors `meta = null` pentru
  // TOATE câmpurile (rol, clasa, abonament de liceu inclusiv) — nu doar
  // pentru cursul practic. Separate, un eșec aici afectează doar accesul la
  // curs (degradă sigur la "none"), fără să strice restul platformei.
  const { data: metaCurs } = await supabase
    .from("users_meta")
    .select("curs_status, curs_current_period_end, curs_cancel_at_period_end")
    .eq("user_id", user.id)
    .maybeSingle();

  const xpTotal = meta?.xp_total ?? 0;
  const nivel = Math.max(1, Math.floor(Math.sqrt(Math.max(xpTotal, 0) / 100)) + 1);

  return {
    user: { id: user.id, email: user.email ?? "" },
    meta: {
      userId: user.id,
      email: user.email ?? "",
      subscriptionStatus: (meta?.subscription_status as UtilizatorMeta["subscriptionStatus"]) ?? "none",
      subscriptionCurrentPeriodEnd: meta?.subscription_current_period_end ?? null,
      cancelAtPeriodEnd: meta?.cancel_at_period_end ?? false,
      stripeCustomerId: meta?.stripe_customer_id ?? null,
      cursStatus: (metaCurs?.curs_status as UtilizatorMeta["cursStatus"]) ?? "none",
      cursCurrentPeriodEnd: metaCurs?.curs_current_period_end ?? null,
      cursCancelAtPeriodEnd: metaCurs?.curs_cancel_at_period_end ?? false,
      xpTotal,
      streakZile: meta?.streak_zile ?? 0,
      clasa: meta?.clasa ?? null,
      nivel,
      rol: (meta?.rol as RolUtilizator) ?? "elev",
      scoala: meta?.scoala ?? null,
    },
  };
}

export function areAbonamentActiv(meta: UtilizatorMeta | null): boolean {
  return meta?.subscriptionStatus === "active";
}

/** Acces la „Curs practic de Python" -- independent de abonamentul de liceu. */
export function areAbonamentCursActiv(meta: UtilizatorMeta | null): boolean {
  return meta?.cursStatus === "active";
}
