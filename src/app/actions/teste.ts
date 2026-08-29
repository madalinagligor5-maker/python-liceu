"use server";

import { creeazaClientServer } from "@/lib/supabase/server";
import { getQuizSublectie, type IntrebareQuiz } from "@/lib/quizSublectii";

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
}

export type IntrebareTest = IntrebareQuiz & { modulCod: string };

/**
 * Testul și baremul se generează din exact aceleași întrebări — nu există
 * două surse separate care ar putea diverge. Selecția e aleatoare, dar
 * DOAR server-side: un profesor nu poate influența din client ce întrebări
 * ies (nici indirect, pentru că nici nu se trimit dinspre client întrebări,
 * doar coduri de modul).
 */
export async function genereazaTest(
  moduleCoduri: string[],
  nrIntrebari: number
): Promise<{ ok: boolean; eroare?: string; intrebari?: IntrebareTest[] }> {
  try {
    await verificaProfesorAprobat();
  } catch (e) {
    return { ok: false, eroare: e instanceof Error ? e.message : "Acces interzis." };
  }

  if (!moduleCoduri.length) return { ok: false, eroare: "Alege cel puțin un modul." };

  const pool: IntrebareTest[] = [];
  for (const modulCod of moduleCoduri) {
    const intrebari = await getQuizSublectie(`${modulCod}.6`);
    for (const i of intrebari) pool.push({ ...i, modulCod });
  }

  if (pool.length === 0) {
    return { ok: false, eroare: "Modulele alese nu au încă întrebări de quiz." };
  }

  // Amestecare Fisher-Yates, apoi tăiem la numărul cerut (clamp la ce există).
  const amestecat = [...pool];
  for (let i = amestecat.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [amestecat[i], amestecat[j]] = [amestecat[j], amestecat[i]];
  }

  const nr = Math.min(Math.max(1, nrIntrebari), amestecat.length);
  return { ok: true, intrebari: amestecat.slice(0, nr) };
}
