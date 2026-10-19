import { citesteText } from "@/lib/fisiereContinut";

export type UnitatePlanificare = {
  modulCod: string;
  modulTitlu: string;
  competente: string;
  oreAlocate: number;
  saptamanaEstimata: number;
};

export type Planificare = {
  clasa: string;
  unitati: UnitatePlanificare[];
};

const CLASE_VALIDE = ["IX", "X", "XI", "XII"] as const;

/**
 * Citește planificarea per clasă din content/planificari/{clasa}.json —
 * fișier editabil manual, după modelul „un fișier = o unitate de conținut"
 * folosit deja la blog (src/lib/blog.ts). Nu e nimic hardcodat în cod.
 */
export async function getPlanificare(clasa: string): Promise<Planificare | null> {
  const clasaNorm = clasa.toUpperCase();
  if (!CLASE_VALIDE.includes(clasaNorm as (typeof CLASE_VALIDE)[number])) return null;

  try {
    const raw = await citesteText(`content/planificari/${clasaNorm}.json`);
    const parsed = JSON.parse(raw) as Planificare;
    return parsed;
  } catch {
    return null;
  }
}

export function claseleDisponibile(): readonly string[] {
  return CLASE_VALIDE;
}
