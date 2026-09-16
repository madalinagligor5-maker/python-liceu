import { promises as fs } from "fs";
import path from "path";
import { parseazaContinut, type ModulContinut, type SublectieContinut } from "@/lib/markdownMini";

/**
 * Încarcă conținutul lecțiilor pentru „Curs practic de Python" din fișierele
 * Markdown din content/ — complet separat de sistemul de liceu/gimnaziu
 * (sublectii.ts), ca să nu depindă în niciun fel de `clasa`.
 */

type IndexContinut = {
  module: Record<string, ModulContinut>;
  sublectii: Record<string, SublectieContinut>;
  ordine: string[];
};

let cache: IndexContinut | null = null;

async function incarcaTot(): Promise<IndexContinut> {
  if (cache) return cache;

  const fisiere = ["curs-practic-u1.md"];
  const moduleMap: Record<string, ModulContinut> = {};
  const sublectii: Record<string, SublectieContinut> = {};
  const ordine: string[] = [];

  for (const f of fisiere) {
    const cale = path.join(process.cwd(), "content", f);
    const mdRaw = await fs.readFile(cale, "utf-8");
    const md = mdRaw.split(String.fromCharCode(13)).join("");
    const parse = parseazaContinut(md);
    for (const m of parse) {
      moduleMap[m.cod] = m;
      for (const s of m.sublectii) {
        sublectii[s.cod] = s;
        ordine.push(s.cod);
      }
    }
  }

  cache = { module: moduleMap, sublectii, ordine };
  return cache;
}

export async function getModulContinutCurs(codModul: string): Promise<ModulContinut | undefined> {
  const all = await incarcaTot();
  return all.module[codModul];
}

export async function getSublectieContinutCurs(cod: string): Promise<SublectieContinut | undefined> {
  const all = await incarcaTot();
  return all.sublectii[cod];
}

export async function sublectieCursUrmatoare(cod: string): Promise<SublectieContinut | undefined> {
  const all = await incarcaTot();
  const i = all.ordine.indexOf(cod);
  return i === -1 || i + 1 >= all.ordine.length ? undefined : all.sublectii[all.ordine[i + 1]];
}

export async function sublectieCursAnterioara(cod: string): Promise<SublectieContinut | undefined> {
  const all = await incarcaTot();
  const i = all.ordine.indexOf(cod);
  return i <= 0 ? undefined : all.sublectii[all.ordine[i - 1]];
}
