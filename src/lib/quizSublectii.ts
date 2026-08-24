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

  const fisiere = [
    "lectii_IX_1.1-1.8.md", "lectii_IX_1.9-1.20.md",
    "lectii_X_2.1-2.3.md", "lectii_X_2.2-2.5.md", "lectii_X_2.6-2.10.md",
    "lectii_X_2.11-2.14.md", "lectii_X_2.15-2.17.md", "lectii_X_2.18-2.21.md",
    "lectii_XI_3.1-3.5.md", "lectii_XI_3.6-3.10.md", "lectii_XI_3.11-3.15.md",
    "lectii_XI_3.16-3.25.md", "lectii_XII_4.1-4.5.md", "lectii_XII_4.6-4.12.md",
    "lectii_XII_4.13-4.17.md", "lectii_XII_4.18-4.22.md",
    "lectii_P7_P7.1.md", "lectii_P7_P7.2.md", "lectii_P7_P7.3.md",
    "lectii_P8_P8.1.md", "lectii_P8_P8.2.md", "lectii_P8_P8.3.md",
    "lectii_P9_P9.1.md", "lectii_P9_P9.2.md", "lectii_P9_P9.3.md",
    "lectii_P10_P10.1.md", "lectii_P10_P10.2.md", "lectii_P10_P10.3.md",
    "lectii_P11_P11.1.md", "lectii_P11_P11.2.md", "lectii_P11_P11.3.md",
  ];
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
