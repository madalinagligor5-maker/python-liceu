"use server";

import { creeazaClientServer } from "@/lib/supabase/server";
import { idExercitiiValide } from "@/lib/exercitii";
import { getExercitiiRezolvateCont } from "@/lib/exercitiiCont";

const MAX_PE_APEL = 500;

/**
 * Salvează în cont exercițiile rezolvate (id-uri din content/exercitii.json).
 * Id-urile necunoscute sunt ignorate, ca un client modificat să nu poată
 * umple tabelul cu valori arbitrare. Fără sesiune sau fără tabel: ok:false,
 * fără eroare vizibilă — progresul din browser rămâne.
 */
export async function salveazaExercitiiRezolvate(
  ids: string[]
): Promise<{ ok: boolean; salvate: number }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { ok: false, salvate: 0 };
  }
  if (!Array.isArray(ids) || ids.length === 0) return { ok: true, salvate: 0 };

  const valide = await idExercitiiValide();
  const curate = [...new Set(ids.filter((id) => typeof id === "string" && valide.has(id)))].slice(0, MAX_PE_APEL);
  if (curate.length === 0) return { ok: true, salvate: 0 };

  const supabase = await creeazaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, salvate: 0 };

  const { error } = await supabase
    .from("exercitii_rezolvate")
    .upsert(
      curate.map((exercitiu_id) => ({ user_id: user.id, exercitiu_id })),
      { onConflict: "user_id,exercitiu_id", ignoreDuplicates: true }
    );
  if (error) {
    console.error("[exercitii] salvarea in cont a esuat", error.message);
    return { ok: false, salvate: 0 };
  }
  return { ok: true, salvate: curate.length };
}

/** Exercițiile rezolvate din contul utilizatorului curent ([] fără sesiune). */
export async function citesteExercitiiRezolvateCont(): Promise<string[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  const supabase = await creeazaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  return getExercitiiRezolvateCont(user.id);
}
