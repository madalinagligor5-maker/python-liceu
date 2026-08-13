"use server";

import { revalidatePath } from "next/cache";
import { getLectie } from "@/lib/content";
import { creeazaClientServer } from "@/lib/supabase/server";
import { XP_PE_QUIZ } from "@/lib/progres";
import { getQuizSublectie } from "@/lib/quizSublectii";

export type RezultatFinalizare =
  | {
      ok: true;
      xpTotal: number;
      streakZile: number;
      nivel: number;
      scor: number;
      dinTotal: number;
      insigneNoi: string[];
    }
  | { ok: false; eroare: string };

/**
 * Finalizează o lecție și acordă XP.
 *
 * Răspunsurile la quiz sunt validate AICI, pe server, față de conținutul
 * canonic — clientul trimite doar ce a bifat, niciodată scorul. Altfel oricine
 * putea cere XP maxim direct din consola browserului.
 *
 * Scrierea efectivă merge prin RPC-ul `finalizeaza_lectie` (security definer),
 * pentru că trigger-ul de protecție blochează update direct pe xp_total.
 */
export async function finalizeazaLectie(
  clasa: string,
  unitateSlug: string,
  lectieSlug: string,
  raspunsuri: Record<number, number>
): Promise<RezultatFinalizare> {
  const lectie = getLectie(clasa, unitateSlug, lectieSlug);
  if (!lectie) return { ok: false, eroare: "Lecția nu există." };

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return { ok: false, eroare: "Progresul necesită configurarea Supabase." };
  }

  const supabase = await creeazaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, eroare: "Trebuie să fii autentificat." };

  // Acces: lecțiile cu plată se contorizează doar cu abonament activ, ca să nu
  // se poată strânge XP pe conținut la care utilizatorul nu are drept.
  if (!lectie.gratuit) {
    const { data: meta } = await supabase
      .from("users_meta")
      .select("subscription_status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (meta?.subscription_status !== "active") {
      return { ok: false, eroare: "Această lecție necesită abonament activ." };
    }
  }

  const intrebari = lectie.quiz ?? [];
  const scor = intrebari.reduce(
    (acc, intrebare, i) => acc + (raspunsuri?.[i] === intrebare.corect ? 1 : 0),
    0
  );
  const xpQuiz = scor * XP_PE_QUIZ;

  const { data, error } = await supabase.rpc("finalizeaza_lectie", {
    p_lectie_slug: lectieSlug,
    p_xp_quiz: xpQuiz,
  });

  if (error) return { ok: false, eroare: error.message };

  const rezultat = Array.isArray(data) ? data[0] : data;

  const insigneNoi = await acordaInsigne(supabase, user.id, {
    streak: rezultat?.streak_zile ?? 0,
    scorPerfect: intrebari.length > 0 && scor === intrebari.length,
  });

  // Dashboard-ul și header-ul citesc progresul server-side; fără asta ar
  // rămâne pe valorile vechi din cache.
  revalidatePath("/");
  revalidatePath(`/lectii/${clasa}/${unitateSlug}/${lectieSlug}`);

  return {
    ok: true,
    xpTotal: rezultat?.xp_total ?? 0,
    streakZile: rezultat?.streak_zile ?? 0,
    nivel: rezultat?.nivel ?? 1,
    scor,
    dinTotal: intrebari.length,
    insigneNoi,
  };
}

type ClientSupabase = Awaited<ReturnType<typeof creeazaClientServer>>;

/** Insigne deduse din progresul real; insert idempotent (primary key compus). */
async function acordaInsigne(
  supabase: ClientSupabase,
  userId: string,
  ctx: { streak: number; scorPerfect: boolean }
): Promise<string[]> {
  const { count } = await supabase
    .from("progres_lectii")
    .select("lectie_slug", { count: "exact", head: true })
    .eq("user_id", userId);

  const nrLectii = count ?? 0;
  const candidate: string[] = [];

  if (nrLectii >= 1) candidate.push("prima-lectie");
  if (nrLectii >= 5) candidate.push("cinci-lectii");
  if (nrLectii >= 10) candidate.push("zece-lectii");
  if (ctx.streak >= 3) candidate.push("serie-3-zile");
  if (ctx.streak >= 7) candidate.push("serie-7-zile");
  if (ctx.scorPerfect) candidate.push("quiz-perfect");

  if (!candidate.length) return [];

  const { data: existente } = await supabase
    .from("insigne_utilizator")
    .select("insigna_slug")
    .eq("user_id", userId);

  const deja = new Set((existente ?? []).map((r) => r.insigna_slug as string));
  const noi = candidate.filter((s) => !deja.has(s));
  if (!noi.length) return [];

  await supabase
    .from("insigne_utilizator")
    .upsert(
      noi.map((insigna_slug) => ({ user_id: userId, insigna_slug })),
      { onConflict: "user_id,insigna_slug", ignoreDuplicates: true }
    );

  return noi;
}

/**
 * Finalizează o SUBLECȚIE (noul sistem, cod ex. "1.1.1") și acordă XP.
 *
 * Întrebările sunt extrase din Markdown-ul canonic (quizSublectii.ts);
 * clientul trimite doar indexul variantei alese, iar serverul decide ce e
 * corect — deci nu se poate falsifica scorul din consolă.
 *
 * Scrierea merge prin RPC-ul `finalizeaza_lectie` (security definer), pentru
 * că trigger-ul de protecție blochează update direct pe xp_total.
 */
export async function finalizeazaSublectie(
  clasa: string,
  sublectieCod: string,
  raspunsuri: Record<number, number>
): Promise<RezultatFinalizare> {
  const intrebari = await getQuizSublectie(sublectieCod);
  if (!intrebari.length)
    return { ok: false, eroare: "Această sublecție nu are quiz." };

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return { ok: false, eroare: "Progresul necesită configurarea Supabase." };
  }

  const supabase = await creeazaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, eroare: "Trebuie să fii autentificat." };

  // Toate sublecțiile din 1.1–1.8 sunt gratuite. Dacă mai târziu adăugăm
  // conținut plătit, aici verificăm subscription_status ca la finalizeazaLectie.
  const scor = intrebari.reduce(
    (acc, intrebare, i) => acc + (raspunsuri?.[i] === intrebare.corect ? 1 : 0),
    0
  );
  const xpQuiz = scor * XP_PE_QUIZ;

  const { data, error } = await supabase.rpc("finalizeaza_lectie", {
    p_lectie_slug: `sub-${sublectieCod}`,
    p_xp_quiz: xpQuiz,
  });

  if (error) return { ok: false, eroare: error.message };

  const rezultat = Array.isArray(data) ? data[0] : data;

  const insigneNoi = await acordaInsigne(supabase, user.id, {
    streak: rezultat?.streak_zile ?? 0,
    scorPerfect: intrebari.length > 0 && scor === intrebari.length,
  });

  revalidatePath("/");
  revalidatePath(`/curriculum/${clasa}`);

  return {
    ok: true,
    xpTotal: rezultat?.xp_total ?? 0,
    streakZile: rezultat?.streak_zile ?? 0,
    nivel: rezultat?.nivel ?? 1,
    scor,
    dinTotal: intrebari.length,
    insigneNoi,
  };
}
