import { promises as fs } from "fs";
import path from "path";
import { parseazaContinut, type ModulContinut, type SublectieContinut } from "@/lib/markdownMini";

/**
 * Încarcă conținutul lecțiilor din fișierele Markdown din content/.
 * Pentru moment doar clasa a IX-a (modulele 1.1–1.8) e scrisă.
 * Indexăm după codul sublecției (ex. "1.1.1") pentru acces rapid per pagină.
 */

type IndexContinut = {
  module: Record<string, ModulContinut>; // "1.1" -> modul
  sublectii: Record<string, SublectieContinut>; // "1.1.1" -> sublecție
  ordine: string[]; // coduri sublecții în ordine
};

let cache: IndexContinut | null = null;

async function incarcaTot(): Promise<IndexContinut> {
  if (cache) return cache;

  const fisiere = ["lectii_IX_1.1-1.8.md", "lectii_IX_1.9-1.20.md", "lectii_X_2.1-2.3.md", "lectii_X_2.2-2.5.md", "lectii_X_2.6-2.10.md", "lectii_X_2.11-2.14.md", "lectii_X_2.15-2.17.md", "lectii_X_2.18-2.21.md"];
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

export async function getModulContinut(codModul: string): Promise<ModulContinut | undefined> {
  const all = await incarcaTot();
  return all.module[codModul];
}

export async function getSublectieContinut(cod: string): Promise<SublectieContinut | undefined> {
  const all = await incarcaTot();
  return all.sublectii[cod];
}

export async function sublectieUrmatoare(cod: string): Promise<SublectieContinut | undefined> {
  const all = await incarcaTot();
  const i = all.ordine.indexOf(cod);
  return i === -1 || i + 1 >= all.ordine.length ? undefined : all.sublectii[all.ordine[i + 1]];
}

export async function sublectieAnterioara(cod: string): Promise<SublectieContinut | undefined> {
  const all = await incarcaTot();
  const i = all.ordine.indexOf(cod);
  return i <= 0 ? undefined : all.sublectii[all.ordine[i - 1]];
}
