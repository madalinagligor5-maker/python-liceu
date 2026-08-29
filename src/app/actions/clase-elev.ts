"use server";

import { revalidatePath } from "next/cache";
import { creeazaClientServer } from "@/lib/supabase/server";

export type ClasaElev = {
  clasaId: string;
  numeClasa: string;
  dataAsocierii: string;
};

/**
 * Elevul introduce singur codul primit de la profesor — profesorul nu are
 * nicio cale să adauge el elevi (regula globală 4). Validarea codului și
 * inserarea merg prin RPC-ul security definer `asociaza_elev_la_clasa`,
 * care rulează cu privilegii proprii dar tot sub identitatea elevului
 * (auth.uid() din interiorul funcției) — nu prin clientul cu service role.
 */
export async function asociazaLaClasa(codClasa: string): Promise<{ ok: boolean; eroare?: string; numeClasa?: string }> {
  const cod = codClasa.trim();
  if (!cod) return { ok: false, eroare: "Introdu un cod de clasă." };

  const supabase = await creeazaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, eroare: "Trebuie să fii autentificat." };

  const { data, error } = await supabase.rpc("asociaza_elev_la_clasa", { p_cod_clasa: cod });
  if (error) return { ok: false, eroare: "Cod de clasă invalid." };

  const rezultat = Array.isArray(data) ? data[0] : data;
  revalidatePath("/cont");
  return { ok: true, numeClasa: rezultat?.nume_clasa };
}

export async function listaClaselorMele(): Promise<ClasaElev[]> {
  const supabase = await creeazaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("clasa_elevi")
    .select("clasa_id, data_asocierii, clase(nume_clasa)")
    .eq("elev_id", user.id);

  if (error || !data) return [];

  return data.map((r) => ({
    clasaId: r.clasa_id as string,
    numeClasa: (r.clase as unknown as { nume_clasa: string } | null)?.nume_clasa ?? "Clasă",
    dataAsocierii: r.data_asocierii as string,
  }));
}

/** Elevul poate părăsi oricând o clasă — RLS permite delete doar pe rândul propriu. */
export async function paraseesteClasa(clasaId: string): Promise<{ ok: boolean; eroare?: string }> {
  const supabase = await creeazaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, eroare: "Trebuie să fii autentificat." };

  const { error } = await supabase
    .from("clasa_elevi")
    .delete()
    .eq("clasa_id", clasaId)
    .eq("elev_id", user.id);

  if (error) return { ok: false, eroare: error.message };
  revalidatePath("/cont");
  return { ok: true };
}
