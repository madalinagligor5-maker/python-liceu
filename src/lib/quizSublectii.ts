import { promises as fs } from "fs";
import path from "path";

/**
 * Extrage quiz-urile de verificare din conținutul lecțiilor (Markdown).
 *
 * Formatul din fișier (consistent la toate sublecțiile de tip "verificare"):
 *   ### ✅ 1.1.6 Verifică-ți înțelegerea
 *   1. Întrebarea?
 *      a) variants  b) **răspuns corect**  c) variants
 *
 * Răspunsul corect e marcat cu **bold** în sursa canonică. Nu ne bazăm pe
 * client să ne zică ce e corect — validarea se face pe server, față de asta.
 */

export type IntrebareQuiz = {
  intrebare: string;
  variante: string[];
  /** indexul (0-based) al variantei corecte, dedus din **bold**. */
  corect: number;
};

type IndexQuiz = Record<string, IntrebareQuiz[]>; // cod sublecție -> întrebări

let cache: IndexQuiz | null = null;

function extrageDinCorp(corp: string): IntrebareQuiz[] {
  const lines = corp.split("\n");
  const quiz: IntrebareQuiz[] = [];
  let cur: IntrebareQuiz | null = null;

  for (const ln of lines) {
    const qm = ln.match(/^\s*(\d+)\.\s+(.+)$/);
    if (qm) {
      // O nouă întrebare; ignorăm liniile de exercițiu ("**Exercițiul 1.**").
      if (/^\*\*\s*Exerci[tț]iul/i.test(qm[2])) {
        cur = null;
        continue;
      }
      if (cur) quiz.push(cur);
      cur = { intrebare: qm[2].trim(), variante: [], corect: -1 };
      continue;
    }

    if (cur && /^\s+[a-d]\)/.test(ln)) {
      const finder = new RegExp(/([a-d])\)\s+(.*?)(?=\s+[a-d]\)|$)/, "g");
      let vm: RegExpExecArray | null;
      while ((vm = finder.exec(ln)) !== null) {
        let opt = vm[2].trim();
        if (opt.startsWith("**") && opt.endsWith("**")) {
          opt = opt.slice(2, -2).trim();
          cur.corect = cur.variante.length;
        }
        cur.variante.push(opt);
      }
    }
  }
  if (cur) quiz.push(cur);
  return quiz;
}

async function incarcaTot(): Promise<IndexQuiz> {
  if (cache) return cache;

  const fisiere = ["lectii_IX_1.1-1.8.md"];
  const index: IndexQuiz = {};

  for (const f of fisiere) {
    const cale = path.join(process.cwd(), "content", f);
    const mdRaw = await fs.readFile(cale, "utf-8");
    const md = mdRaw.split(String.fromCharCode(13)).join("");

    // Împărțim pe sublecții după header-ele "### emoji cod titlu".
    const parts = md.split(/^###\s+\S+\s+\S+\s+.+$/m);
    const headers = md.match(/^###\s+(\S+)\s+(\S+)\s+(.+)$/gm) ?? [];

    // Reconstruim (header, corp) perechi.
    const seg = headers.map((h, i) => {
      const codMatch = h.match(/^###\s+\S+\s+(\S+)/);
      const cod = codMatch ? codMatch[1] : "";
      return { cod, corp: parts[i + 1] ?? "" };
    });

    for (const { cod, corp } of seg) {
      // Doar sublecțiile de verificare (codul se termină în .6) au quiz.
      if (!/\.6$/.test(cod)) continue;
      const intrebari = extrageDinCorp(corp);
      if (intrebari.length) index[cod] = intrebari;
    }
  }

  cache = index;
  return cache;
}

export async function getQuizSublectie(cod: string): Promise<IntrebareQuiz[]> {
  const all = await incarcaTot();
  return all[cod] ?? [];
}
