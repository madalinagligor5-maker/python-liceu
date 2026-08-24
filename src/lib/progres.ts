import { creeazaClientServer } from "@/lib/supabase/server";
import { getLectiiGrupate, toateLectiile, type Lectie } from "@/lib/content";

export const XP_PE_LECTIE = 20;
export const XP_PE_QUIZ = 10;
export const XP_PE_PREDIČIE = 10;

export type StareNod = "finalizat" | "curent" | "blocat";

export type NodDrum = {
  lectie: Lectie;
  stare: StareNod;
  href: string;
};

export type UnitateDrum = {
  unitate: string;
  unitate_slug: string;
  noduri: NodDrum[];
  procentFinalizat: number;
};

export type ProgresUtilizator = {
  lectiiFinalizate: string[];
  xpTotal: number;
  streakZile: number;
  ultimaActivitate: string | null;
  clasa: string | null;
  insigne: string[];
};

/**
 * Nivelul e o funcție de XP, replicată identic în SQL (public.nivel_din_xp)
 * ca să nu divergă între client și server. Pragul crește pătratic, deci
 * nivelurile mici vin repede (feedback timpuriu) și apoi se rărește.
 */
export function nivelDinXp(xp: number): number {
  return Math.max(1, Math.floor(Math.sqrt(Math.max(xp, 0) / 100)) + 1);
}

export function xpPentruNivel(nivel: number): number {
  return Math.pow(Math.max(nivel - 1, 0), 2) * 100;
}

/** Câți XP mai sunt până la nivelul următor + procentul pe bara curentă. */
export function progresNivel(xp: number) {
  const nivel = nivelDinXp(xp);
  const xpNivelCurent = xpPentruNivel(nivel);
  const xpNivelUrmator = xpPentruNivel(nivel + 1);
  const interval = xpNivelUrmator - xpNivelCurent;
  const inNivel = xp - xpNivelCurent;

  return {
    nivel,
    xpNivelUrmator,
    xpRamasi: Math.max(xpNivelUrmator - xp, 0),
    procent: interval > 0 ? Math.min(100, Math.round((inNivel / interval) * 100)) : 0,
  };
}

/**
 * Construiește drumul de învățare pentru o clasă: fiecare lecție devine un nod
 * cu stare vizuală. Prima lecție neterminată e "curent"; tot ce vine după ea e
 * "blocat" (vizibil, dar nu următorul pas) — asta dă direcție clară, în loc de
 * un catalog în care elevul nu știe de unde să continue.
 */
export function construiesteDrum(
  clasa: string,
  lectiiFinalizate: string[]
): UnitateDrum[] {
  const finalizate = new Set(lectiiFinalizate);
  const grupate = getLectiiGrupate().find((g) => g.clasa === clasa);
  if (!grupate) return [];

  let curentAtribuit = false;

  return grupate.unitati.map((u) => {
    const noduri: NodDrum[] = u.lectii.map((lectie) => {
      let stare: StareNod;

      if (finalizate.has(lectie.lectie_slug)) {
        stare = "finalizat";
      } else if (!curentAtribuit) {
        stare = "curent";
        curentAtribuit = true;
      } else {
        stare = "blocat";
      }

      return {
        lectie,
        stare,
        href: `/lectii/${lectie.clasa}/${lectie.unitate_slug}/${lectie.lectie_slug}`,
      };
    });

    const nrFinalizate = noduri.filter((n) => n.stare === "finalizat").length;

    return {
      unitate: u.unitate,
      unitate_slug: u.unitate_slug,
      noduri,
      procentFinalizat: noduri.length
        ? Math.round((nrFinalizate / noduri.length) * 100)
        : 0,
    };
  });
}

/** Prima lecție neterminată din clasa dată — ținta cardului "Continuă lecția". */
export function urmatoareaLectie(
  clasa: string,
  lectiiFinalizate: string[]
): Lectie | undefined {
  const finalizate = new Set(lectiiFinalizate);
  return toateLectiile
    .filter((l) => l.clasa === clasa)
    .find((l) => !finalizate.has(l.lectie_slug));
}

/**
 * Provocarea zilei: un quiz scurt din conținut DEJA parcurs (recapitulare),
 * ales determinist după data curentă, ca să fie aceeași provocare toată ziua
 * și să nu se schimbe la fiecare refresh.
 */
export function provocareaZilei(lectiiFinalizate: string[]) {
  const candidate = toateLectiile.filter(
    (l) => lectiiFinalizate.includes(l.lectie_slug) && l.quiz?.length
  );
  if (!candidate.length) return null;

  const azi = new Date();
  const samanta =
    azi.getFullYear() * 10000 + (azi.getMonth() + 1) * 100 + azi.getDate();
  const lectie = candidate[samanta % candidate.length];
  const intrebare = lectie.quiz[samanta % lectie.quiz.length];

  return { lectie, intrebare, xp: 50 };
}

/** Streak-ul e "viu" doar dacă ultima activitate e azi sau ieri. */
export function streakActiv(ultimaActivitate: string | null): boolean {
  if (!ultimaActivitate) return false;
  const ultima = new Date(ultimaActivitate + "T00:00:00");
  const azi = new Date();
  const diff = Math.floor(
    (Date.UTC(azi.getFullYear(), azi.getMonth(), azi.getDate()) -
      Date.UTC(ultima.getFullYear(), ultima.getMonth(), ultima.getDate())) /
      86400000
  );
  return diff <= 1;
}

/**
 * Citește tot progresul utilizatorului curent, server-side. Întoarce null dacă
 * nu există sesiune sau Supabase nu e configurat — landing page-ul de marketing
 * rămâne funcțional fără backend.
 */
export async function getProgresUtilizator(
  userId: string
): Promise<ProgresUtilizator | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  const supabase = await creeazaClientServer();

  const [progres, meta, insigne] = await Promise.all([
    supabase.from("progres_lectii").select("lectie_slug").eq("user_id", userId),
    supabase
      .from("users_meta")
      .select("xp_total, streak_zile, ultima_activitate, clasa")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("insigne_utilizator")
      .select("insigna_slug")
      .eq("user_id", userId),
  ]);

  const ultimaActivitate = meta.data?.ultima_activitate ?? null;

  return {
    lectiiFinalizate: (progres.data ?? []).map((r) => r.lectie_slug as string),
    xpTotal: meta.data?.xp_total ?? 0,
    // Un streak nereînnoit e afișat ca 0, nu ca valoarea veche rămasă în DB.
    streakZile: streakActiv(ultimaActivitate) ? (meta.data?.streak_zile ?? 0) : 0,
    ultimaActivitate,
    clasa: (meta.data?.clasa as string | null) ?? null,
    insigne: (insigne.data ?? []).map((r) => r.insigna_slug as string),
  };
}

export async function getProgresKids(
  userId: string
): Promise<Record<string, { stars: number }>> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {};
  }

  const supabase = await creeazaClientServer();
  const { data } = await supabase
    .from("progres_lectii")
    .select("lectie_slug, stars")
    .eq("user_id", userId)
    .eq("tip", "kids_level");

  const rez: Record<string, { stars: number }> = {};
  if (data) {
    data.forEach((r) => {
      rez[r.lectie_slug] = { stars: Number(r.stars) || 0 };
    });
  }
  return rez;
}

