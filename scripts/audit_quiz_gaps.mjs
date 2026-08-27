import fs from "fs";
import path from "path";

/**
 * Script de audit pentru secțiunile "✅ ... Verifică-ți înțelegerea" din care
 * src/lib/quizSublectii.ts NU reușește să extragă nicio întrebare validă
 * (format grilă: linia "N. Întrebare?" urmată de variante "a) ... b) ...",
 * cu răspunsul corect marcat **bold**).
 *
 * Reproduce EXACT logica de extragere din quizSublectii.ts (extrageDinCorp),
 * ca lista de goluri să fie garantat identică cu ce randează aplicația.
 *
 * Modulele 4.18-4.22 (Machine Learning, clasa XII) au fost rescrise la
 * standardul restului platformei și NU mai sunt excluse — se verifică la
 * fel ca oricare alt modul.
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
    }
  }
  if (cur) quiz.push(cur);
  return quiz;
}

const fisiere = fs.readdirSync(contentDir).filter((f) => f.startsWith("lectii_") && f.endsWith(".md"));

let totalSectiuni = 0;
let goluri = [];

for (const f of fisiere) {
  const mdRaw = fs.readFileSync(path.join(contentDir, f), "utf-8");
  const md = mdRaw.replace(/\r\n/g, "\n");

  const parts = md.split(/^###\s+\S+\s+\S+\s+.+$/m);
  const headers = md.match(/^###\s+(\S+)\s+(\S+)\s+(.+)$/gm) ?? [];
  const seg = headers.map((h, i) => {
    const codMatch = h.match(/^###\s+\S+\s+(\S+)/);
    const cod = codMatch ? codMatch[1] : "";
    return { cod, corp: parts[i + 1] ?? "", header: h.trim() };
  });

  for (const { cod, corp, header } of seg) {
    if (!/\.6$/.test(cod)) continue;
    totalSectiuni++;
    const intrebari = extrageDinCorp(corp);
    const areIncomplete = intrebari.some(
      (q) => q.corect === -1 || q.variante.length < 2
    );
    if (!intrebari.length || areIncomplete) {
      goluri.push({ fisier: f, cod, header, motiv: !intrebari.length ? "0 întrebări extrase" : "întrebare fără variantă corectă marcată **bold** sau cu <2 variante" });
    }
  }
}

console.log("==================================================");
console.log("📊 AUDIT GOLURI QUIZ (secțiuni ✅ Verifică-ți înțelegerea)");
console.log(`Total secțiuni .6 verificate: ${totalSectiuni}`);
console.log(`Secțiuni fără quiz valid: ${goluri.length}`);
console.log("==================================================");

if (goluri.length > 0) {
  console.log("\n❌ SECȚIUNI FĂRĂ QUIZ VALID:");
  for (const g of goluri) {
    console.log(`   - ${g.fisier} :: ${g.cod} (${g.motiv})`);
  }
  process.exit(1);
} else {
  console.log("\n✅ Toate secțiunile .6 au quiz valid extras de parser.");
  process.exit(0);
}
