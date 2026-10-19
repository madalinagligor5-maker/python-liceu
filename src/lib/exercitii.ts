import exercitiiDate from "@/generated/exercitii.json";
import { pachetContinut } from "@/lib/fisiereContinut";

const { citesteText } = pachetContinut(exercitiiDate);
import { Exercitiu } from "@/lib/exercitii-tipuri";

type IndexExercitii = Record<string, Exercitiu[]>; // cod sublecție -> exerciții

let cache: IndexExercitii | null = null;

export async function getExercitiiSublectie(
  cod: string
): Promise<Exercitiu[]> {
  if (!cache) {
    const raw = await citesteText("content/exercitii.json");
    cache = JSON.parse(raw) as IndexExercitii;
  }
  return cache[cod] ?? [];
}

/** Toate id-urile de exerciții existente — pentru validarea datelor primite de la client. */
export async function idExercitiiValide(): Promise<Set<string>> {
  await getExercitiiSublectie("");
  return new Set(Object.values(cache ?? {}).flatMap((lista) => lista.map((e) => e.id)));
}
