"use server";

import { revalidatePath } from "next/cache";
import { creeazaClientServer } from "@/lib/supabase/server";
import { toateModulele } from "@/lib/curriculum";

async function verificaProfesorAprobat() {
  const supabase = await creeazaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Trebuie să fii autentificat.");

  const { data: meta } = await supabase
    .from("users_meta")
    .select("rol")
    .eq("user_id", user.id)
    .maybeSingle();

  if (meta?.rol !== "profesor_aprobat") {
    throw new Error("Acces interzis.");
  }
  return { supabase, userId: user.id };
}

export type Clasa = {
  id: string;
  numeClasa: string;
  codClasa: string;
  creatLa: string;
  nrElevi: number;
};

export async function listaClaseProfesor(): Promise<Clasa[]> {
  const { supabase, userId } = await verificaProfesorAprobat();

  const { data, error } = await supabase
    .from("clase")
    .select("id, nume_clasa, cod_clasa, creat_la, clasa_elevi(count)")
    .eq("profesor_id", userId)
    .order("creat_la", { ascending: false });

  if (error || !data) return [];

  return data.map((c) => ({
    id: c.id as string,
    numeClasa: c.nume_clasa as string,
    codClasa: c.cod_clasa as string,
    creatLa: c.creat_la as string,
    nrElevi: Array.isArray(c.clasa_elevi) ? (c.clasa_elevi[0]?.count as number) ?? 0 : 0,
  }));
}

/** Codul e generat server-side (RPC), niciodată ales de client — evită
 *  coduri previzibile sau coliziuni intenționate. */
export async function creeazaClasa(numeClasa: string): Promise<{ ok: boolean; eroare?: string; codClasa?: string }> {
  const nume = numeClasa.trim();
  if (!nume) return { ok: false, eroare: "Numele clasei nu poate fi gol." };

  let supabase, userId;
  try {
    ({ supabase, userId } = await verificaProfesorAprobat());
  } catch (e) {
    return { ok: false, eroare: e instanceof Error ? e.message : "Acces interzis." };
  }

  for (let incercare = 0; incercare < 5; incercare++) {
    const { data: cod, error: codError } = await supabase.rpc("genereaza_cod_clasa");
    if (codError || !cod) return { ok: false, eroare: "Nu s-a putut genera codul clasei." };

    const { error } = await supabase.from("clase").insert({
      profesor_id: userId,
      nume_clasa: nume,
      cod_clasa: cod,
    });

    if (!error) {
      revalidatePath("/profesor/clase");
      return { ok: true, codClasa: cod as string };
    }
    // Coliziune de cod unic — reîncercăm cu un cod nou.
    if (error.code !== "23505") return { ok: false, eroare: error.message };
  }

  return { ok: false, eroare: "Nu s-a putut crea clasa, încearcă din nou." };
}

export type ElevProgres = {
  elevId: string;
  numeAfisat: string;
  procentModule: number;
  scorMediu: number | null;
  ultimaActivitate: string | null;
};

/**
 * Progresul agregat citit din RPC-ul `progres_elevi_clasa` (verifică el
 * însuși, în DB, că profesorul chiar deține clasa). Procentul de module
 * parcurse se calculează aici, față de structura curriculumului — nu e
 * date nou de urmărire, doar o interpretare a lecțiilor deja finalizate
 * (progres_lectii, cu prefixul "sub-" pentru sublecțiile din curriculum).
 */
export async function progresulClasei(clasaId: string): Promise<ElevProgres[]> {
  const { supabase } = await verificaProfesorAprobat();

  const { data, error } = await supabase.rpc("progres_elevi_clasa", { p_clasa_id: clasaId });
  if (error || !data) return [];

  const totalModule = toateModulele().length;

  return (data as Array<{
    elev_id: string;
    nume_afisat: string | null;
    ultima_activitate: string | null;
    lectii_finalizate: string[] | null;
    scor_total: number;
    scor_din_total: number;
  }>).map((r) => {
    const sublectiiFinalizate = (r.lectii_finalizate ?? []).filter((s) => s.startsWith("sub-"));
    const moduleAtinse = new Set(
      sublectiiFinalizate.map((s) => {
        const cod = s.replace(/^sub-/, "");
        return cod.split(".").slice(0, 2).join(".");
      })
    );

    return {
      elevId: r.elev_id,
      numeAfisat: r.nume_afisat || "Elev fără nume completat",
      procentModule: totalModule ? Math.round((moduleAtinse.size / totalModule) * 100) : 0,
      scorMediu: r.scor_din_total > 0 ? Math.round((r.scor_total / r.scor_din_total) * 100) : null,
      ultimaActivitate: r.ultima_activitate,
    };
  });
}
