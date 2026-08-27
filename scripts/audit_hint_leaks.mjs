import fs from "fs";
import path from "path";

/**
 * Script de audit pentru indiciile din content/exercitii.json care sunt de
 * fapt soluția, nu un ghiont. Verifică fiecare exercițiu de tip "cod" (unde
 * hint/hint2 chiar se afișează în UI — vezi ExercitiiInteractive.tsx, care
 * exclude explicit tipul "text") și semnalează:
 *
 *   1. hint sau hint2 IDENTIC (normalizat) cu o linie întreagă din `template`
 *      — semn clar că indiciul e copiat direct din soluție;
 *   2. hint === hint2 (al doilea indiciu nu aduce nimic în plus);
 *   3. exerciții de tip "cod"/"ordonare" (exclus ML 4.18-4.22) fără hint
 *      sau fără hint2.
 *
 * Nu e o dovadă matematică de "niciun indiciu nu dă răspunsul" (asta ține de
 * judecată editorială), dar prinde exact tiparul găsit în audit: indicii care
 * sunt linia de cod soluție, copiată identic.
 */

const contentPath = path.join(process.cwd(), "content", "exercitii.json");
const data = JSON.parse(fs.readFileSync(contentPath, "utf-8"));

const ML_KEYS = new Set([
  "4.18.4", "4.18.5", "4.19.4", "4.19.5", "4.20.4", "4.20.5",
  "4.21.4", "4.21.5", "4.22.4", "4.22.5",
]);

function normalizeaza(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

let totalVerificate = 0;
const problematice = [];

for (const cheie of Object.keys(data)) {
  if (ML_KEYS.has(cheie)) continue; // 4.18-4.22: neatins

  for (const ex of data[cheie]) {
    if (ex.tip === "text") continue; // hint-ul nu se afișează niciodată pentru tip "text"
    totalVerificate++;

    const probleme = [];

    if (!ex.hint) probleme.push("lipsă hint");
    if (!ex.hint2) probleme.push("lipsă hint2");

    if (ex.hint && ex.hint2 && normalizeaza(ex.hint) === normalizeaza(ex.hint2)) {
      probleme.push("hint și hint2 sunt identice");
    }

    if (ex.tip === "cod" && ex.template && ex.hint) {
      const liniiTemplate = ex.template
        .split("\n")
        .map((l) => normalizeaza(l))
        .filter((l) => l.length >= 6); // ignorăm linii triviale ("pass", "___")

      const hintNorm = normalizeaza(ex.hint);
      const hint2Norm = ex.hint2 ? normalizeaza(ex.hint2) : "";

      for (const linie of liniiTemplate) {
        if (hintNorm === linie) {
          probleme.push(`hint identic cu linia de cod: "${ex.hint}"`);
        }
        if (hint2Norm && hint2Norm === linie) {
          probleme.push(`hint2 identic cu linia de cod: "${ex.hint2}"`);
        }
      }
    }

    if (probleme.length) {
      problematice.push({ id: ex.id, cheie, probleme });
    }
  }
}

console.log("==================================================");
console.log("📊 AUDIT INDICII (content/exercitii.json)");
console.log(`Exerciții verificate (tip cod/ordonare, exclus ML): ${totalVerificate}`);
console.log(`Exerciții cu probleme: ${problematice.length}`);
console.log("==================================================");

if (problematice.length > 0) {
  console.log("\n❌ EXERCIȚII CU INDICII PROBLEMATICE:");
  for (const p of problematice) {
    console.log(`   - ${p.id}: ${p.probleme.join("; ")}`);
  }
  process.exit(1);
} else {
  console.log("\n✅ Toate exercițiile (cod/ordonare, exclus ML) au hint + hint2, fără copieri identice.");
  process.exit(0);
}
