import { creeazaClientServer } from "@/lib/supabase/server";
import type { RolUtilizator } from "@/lib/roluri";

export type UtilizatorMeta = {
  userId: string;
  email: string;
  subscriptionStatus: "none" | "active" | "past_due" | "canceled";
  subscriptionCurrentPeriodEnd: string | null;
  stripeCustomerId: string | null;
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
      "subscription_status, subscription_current_period_end, stripe_customer_id, xp_total, streak_zile, clasa, rol, scoala"
    )
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
      stripeCustomerId: meta?.stripe_customer_id ?? null,
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

/**
 * Un profesor aprobat vede tot conținutul premium, fără abonament - ca să
 * poată pregăti orice lecție. Doar rolul APROBAT contează (nu
 * profesor_in_asteptare) - verificat direct din DB, la fel ca restul
 * verificărilor de rol.
 */
export function esteProfesorAprobat(meta: UtilizatorMeta | null): boolean {
  return meta?.rol === "profesor_aprobat";
}
