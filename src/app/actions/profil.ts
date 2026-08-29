"use server";

import { revalidatePath } from "next/cache";
import { creeazaClientServer } from "@/lib/supabase/server";

/**
 * Numele afișat e opțional și editabil doar de utilizator (RLS: update pe
 * rândul propriu). E singurul lucru pe care un profesor îl vede despre un
 * elev din clasa lui, în afara progresului — niciodată emailul.
 */
export async function actualizeazaNumeAfisat(nume: string): Promise<{ ok: boolean; eroare?: string }> {
  const curatat = nume.trim().slice(0, 60);

  const supabase = await creeazaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, eroare: "Trebuie să fii autentificat." };

  const { error } = await supabase
    .from("users_meta")
    .update({ nume_afisat: curatat || null })
    .eq("user_id", user.id);

  if (error) return { ok: false, eroare: error.message };
  revalidatePath("/cont");
  return { ok: true };
}
