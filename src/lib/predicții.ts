import predictiiDate from "@/generated/predictii.json";
import { pachetContinut } from "@/lib/fisiereContinut";

const { citesteText } = pachetContinut(predictiiDate);

export type Predicție = {
  cod: string;
  enunt: string;
  variante: string[];
  corect: number;
};

let cache: Record<string, Predicție> | null = null;

export async function getPredicție(cod: string): Promise<Predicție | null> {
  if (!cache) {
    const raw = await citesteText("content/predicții.json");
    cache = JSON.parse(raw) as Record<string, Predicție>;
  }
  return cache[cod] ?? null;
}

/** Toate predicțiile unei clase (codul începe cu `clasa.`), ca să putem
 *  construi recapitulări cumulative (interleaving) din module mai vechi. */
export async function getPredicțiiClasa(
  clasa: string
): Promise<Predicție[]> {
  if (!cache) await getPredicție("__init__").catch(() => null);
  if (!cache) {
    const raw = await citesteText("content/predicții.json");
    cache = JSON.parse(raw) as Record<string, Predicție>;
  }
  return Object.entries(cache)
    .filter(([cod]) => cod.startsWith(`${clasa}.`))
    .map(([cod, p]) => ({ ...p, cod }));
}
