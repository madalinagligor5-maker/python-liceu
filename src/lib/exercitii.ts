import { promises as fs } from "fs";
import path from "path";
import { Exercitiu } from "@/lib/exercitii-tipuri";

type IndexExercitii = Record<string, Exercitiu[]>; // cod sublecție -> exerciții

let cache: IndexExercitii | null = null;

export async function getExercitiiSublectie(
  cod: string
): Promise<Exercitiu[]> {
  if (!cache) {
    const cale = path.join(process.cwd(), "content", "exercitii.json");
    const raw = await fs.readFile(cale, "utf-8");
    cache = JSON.parse(raw) as IndexExercitii;
  }
  return cache[cod] ?? [];
}
