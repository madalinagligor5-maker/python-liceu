"use server";

import { revalidatePath } from "next/cache";
import { getUtilizatorCurent } from "@/lib/subscription";
import { esteAdmin } from "@/lib/roluri";
import { creeazaClientAdmin } from "@/lib/supabase/admin";

/**
 * Toate acțiunile de mai jos verifică admin-ul din nou, server-side, la
 * fiecare apel — nu ne bazăm pe faptul că pagina /admin/profesori e deja
 * gatată în layout, în caz că cineva apelează server action-ul direct.
 * Scrierea merge prin clientul cu service role, care ocolește RLS (același
 * tipar ca webhook-ul Stripe) — pentru că un admin nu are altfel voie, prin
 * RLS, să schimbe rolul altui utilizator.
 */
async function verificaAdmin() {
  const { user } = await getUtilizatorCurent();
  if (!user || !esteAdmin(user.email)) {
    throw new Error("Acces interzis.");
  }
}

export async function listaProfesoriInAsteptare() {
  await verificaAdmin();
  const admin = creeazaClientAdmin();
  const { data, error } = await admin
    .from("users_meta")
    .select("user_id, email, scoala, created_at")
    .eq("rol", "profesor_in_asteptare")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export type Recenzie = {
  id: string;
  stele: number;
  text: string;
  email: string | null;
  creat_la: string;
};

export async function listaRecenzii(): Promise<Recenzie[]> {
  await verificaAdmin();
  const admin = creeazaClientAdmin();
  const { data, error } = await admin
    .from("reviewuri")
    .select("id, stele, text, email, creat_la")
    .order("creat_la", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listaProfesoriAprobati() {
  await verificaAdmin();
  const admin = creeazaClientAdmin();
  const { data, error } = await admin
    .from("users_meta")
    .select("user_id, email, scoala, created_at")
    .eq("rol", "profesor_aprobat")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function aprobaProfesor(userId: string): Promise<{ ok: boolean; eroare?: string }> {
  try {
    await verificaAdmin();
  } catch {
    return { ok: false, eroare: "Acces interzis." };
  }
  const admin = creeazaClientAdmin();
  const { error } = await admin
    .from("users_meta")
    .update({ rol: "profesor_aprobat" })
    .eq("user_id", userId)
    .eq("rol", "profesor_in_asteptare");
  if (error) return { ok: false, eroare: error.message };
  revalidatePath("/admin/profesori");
  return { ok: true };
}

/** „Respinge" resetează cererea la rolul implicit `elev` — nu lasă contul
 *  într-o stare separată „respins" de întreținut, iar persoana poate oricând
 *  bifa din nou „Sunt profesor" dacă vrea să reaplice. */
export async function respingeProfesor(userId: string): Promise<{ ok: boolean; eroare?: string }> {
  try {
    await verificaAdmin();
  } catch {
    return { ok: false, eroare: "Acces interzis." };
  }
  const admin = creeazaClientAdmin();
  const { error } = await admin
    .from("users_meta")
    .update({ rol: "elev" })
    .eq("user_id", userId)
    .eq("rol", "profesor_in_asteptare");
  if (error) return { ok: false, eroare: error.message };
  revalidatePath("/admin/profesori");
  return { ok: true };
}

export async function revocaProfesor(userId: string): Promise<{ ok: boolean; eroare?: string }> {
  try {
    await verificaAdmin();
  } catch {
    return { ok: false, eroare: "Acces interzis." };
  }
  const admin = creeazaClientAdmin();
  const { error } = await admin
    .from("users_meta")
    .update({ rol: "profesor_revocat" })
    .eq("user_id", userId)
    .eq("rol", "profesor_aprobat");
  if (error) return { ok: false, eroare: error.message };
  revalidatePath("/admin/profesori");
  return { ok: true };
}
