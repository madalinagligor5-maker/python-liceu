import fs from "fs";
import path from "path";

/**
 * Script de audit pentru explicațiile de quiz (linia opțională "> ..." de
 * după variantele a)/b)/c)/d), parsată de src/lib/quizSublectii.ts în
 * câmpul `explicatie`).
 *
 * Reproduce EXACT logica de extragere din quizSublectii.ts (extrageDinCorp),
 * ca numărătoarea să fie garantat identică cu ce vede elevul în aplicație.
 *
 * Citește TOATE sublecțiile .6 din TOATE fișierele efectiv încărcate de
 * quizSublectii.ts (lista `fisiere` de mai jos — identică cu cea din
 * incarcaTot()). content/lectii_P7_1.1.md NU e în listă, deliberat: nu e
 * niciodată încărcat de aplicație (fișier orfan, verificat separat).
 *
 * Rulare: node scripts/audit_explicatii_quiz.mjs
 * Exit code 0 dacă 0 întrebări fără explicație, 1 altfel (dar vezi și
 * lista explicită din rezumatul rundei, pentru excepțiile motivate).
 */

const contentDir = path.join(process.cwd(), "content");

function extrageDinCorp(corp) {
  const lines = corp.split("\n");
  const quiz = [];
  let cur = null;

  for (const ln of lines) {
    const qm = ln.match(/^\s*(\d+)\.\s+(.+)$/);
    if (qm) {
      if (/^\*\*\s*Exerci[tț]iul/i.test(qm[2])) {
        cur = null;
        continue;
      }
      if (cur) quiz.push(cur);
      cur = { intrebare: qm[2].trim(), variante: [], corect: -1 };
      continue;
    }

    if (cur && /^\s+[a-d]\)/.test(ln)) {
      const finder = /([a-d])\)\s+(.*?)(?=\s+[a-d]\)|$)/g;
      let vm;
      while ((vm = finder.exec(ln)) !== null) {
        let opt = vm[2].trim();
        if (opt.startsWith("**") && opt.endsWith("**")) {
          opt = opt.slice(2, -2).trim();
          cur.corect = cur.variante.length;
        }
        cur.variante.push(opt);
      }
      continue;
    }

    if (cur && cur.variante.length > 0 && /^\s*>\s*(.+)$/.test(ln)) {
      const em = ln.match(/^\s*>\s*(.+)$/);
      if (em) cur.explicatie = em[1].trim();
    }
  }
  if (cur) quiz.push(cur);
  return quiz;
}

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

let totalSectiuni = 0;
let totalIntrebari = 0;
let cuExplicatie = 0;
const fara = [];

for (const f of fisiere) {
  const mdRaw = fs.readFileSync(path.join(contentDir, f), "utf-8");
  const md = mdRaw.replace(/\r\n/g, "\n");

  const parts = md.split(/^###\s+\S+\s+\S+\s+.+$/m);
  const headers = md.match(/^###\s+(\S+)\s+(\S+)\s+(.+)$/gm) ?? [];
  const seg = headers.map((h, i) => {
    const codMatch = h.match(/^###\s+\S+\s+(\S+)/);
    const cod = codMatch ? codMatch[1] : "";
    return { cod, corp: parts[i + 1] ?? "" };
  });

  for (const { cod, corp } of seg) {
    if (!/\.6$/.test(cod)) continue;
    const intrebari = extrageDinCorp(corp);
    if (!intrebari.length) continue;
    totalSectiuni++;
    intrebari.forEach((q, idx) => {
      totalIntrebari++;
      const nr = idx + 1;
      if (q.explicatie && q.explicatie.trim().length > 0) {
        cuExplicatie++;
      } else {
        fara.push({ fisier: f, cod, nr, intrebare: q.intrebare });
      }
    });
  }
}

console.log("==================================================");
console.log("📊 AUDIT EXPLICAȚII QUIZ (linia opțională \"> ...\")");
console.log(`Total secțiuni .6 cu quiz: ${totalSectiuni}`);
console.log(`Total întrebări: ${totalIntrebari}`);
console.log(`Cu explicație: ${cuExplicatie}`);
console.log(`Fără explicație: ${fara.length}`);
console.log("==================================================");

if (fara.length > 0) {
  console.log("\n❌ ÎNTREBĂRI FĂRĂ EXPLICAȚIE:");
  for (const f of fara) {
    console.log(`   - ${f.fisier} :: ${f.cod} #${f.nr} — "${f.intrebare}"`);
  }
  process.exit(1);
} else {
  console.log("\n✅ Toate întrebările au explicație.");
  process.exit(0);
}
