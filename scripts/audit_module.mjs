import fs from "fs";
import path from "path";

/**
 * Script de audit pedagogic pentru fișierele de lecții din content/lectii_*.md.
 * Verifică respectarea criteriilor minime de calitate pedagogică pe toate modulele,
 * EXCLUZÂND modulele 4.18+ din clasa a XII-a (Machine Learning).
 */

const contentDir = path.join(process.cwd(), "content");
const mainFiles = fs.readdirSync(contentDir).filter(f => f.startsWith("lectii_") && f.endsWith(".md"));
const exercitiiJson = JSON.parse(fs.readFileSync(path.join(contentDir, "exercitii.json"), "utf-8"));

let totalModuleChecked = 0;
let totalErrors = 0;
const report = [];

for (const file of mainFiles) {
  const filePath = path.join(contentDir, file);
  const content = fs.readFileSync(filePath, "utf-8").replace(/\r\n/g, "\n");

  const modulBlocks = content.split(/^# Modulul /m).slice(1);

  for (const block of modulBlocks) {
    const lines = block.split("\n");
    const headerLine = lines[0];
    const codMatch = headerLine.match(/^(\d+\.\d+|P\d+\.\d+|P7\.1)/);
    if (!codMatch) continue;

    const codModul = codMatch[1];

    // Sarcina 1: Excludem explicit modulele din intervalul 4.18+ (Machine Learning clasa XII)
    if (codModul.startsWith("4.")) {
      const nrSub = parseInt(codModul.split(".")[1], 10);
      if (nrSub >= 18) {
        continue; // Sărit conform cerinței 4 din prompt
      }
    }

    totalModuleChecked++;
    const moduleErrors = [];

    // Verificăm cei 6 pași obligatorii
    const tieneRecapitulare = /###\s+🔄.*Recapitulare/.test(block);
    const tieneConceptNou = /###\s+💡.*Concept nou/.test(block);
    const tieneCiteștePrezice = /###\s+🔮.*Citește și prezice/.test(block);
    const tieneExercițiiGhidate = /###\s+🤝.*Exerciții ghidate/.test(block);
    const tieneExercițiiIndependente = /###\s+🎯.*Exerciții independente/.test(block);
    const tieneVerificăÎnțelegerea = /###\s+✅.*Verifică-ți înțelegerea/.test(block);

    if (!tieneRecapitulare) moduleErrors.push("Lipsă secțiune: Recapitulare (🔄)");
    if (!tieneConceptNou) moduleErrors.push("Lipsă secțiune: Concept nou și exemplu (💡)");
    if (!tieneCiteștePrezice) moduleErrors.push("Lipsă secțiune: Citește și prezice (🔮)");
    if (!tieneExercițiiGhidate) moduleErrors.push("Lipsă secțiune: Exerciții ghidate (🤝)");
    if (!tieneExercițiiIndependente) moduleErrors.push("Lipsă secțiune: Exerciții independente (🎯)");
    if (!tieneVerificăÎnțelegerea) moduleErrors.push("Lipsă secțiune: Verifică-ți înțelegerea (✅)");

    // Criterii minime per secțiune
    if (tieneConceptNou) {
      const conceptBlock = block.split(/###\s+💡/)[1].split(/###\s+🔮/)[0] || "";
      const tieneCode = /```python/.test(conceptBlock);
      const tieneTipOrExemplu = /:::(tip|exemplu|atentie)/.test(conceptBlock);
      if (!tieneCode) moduleErrors.push("Concept nou: lipsă bloc de cod Python complet");
      if (!tieneTipOrExemplu) moduleErrors.push("Concept nou: lipsă casetă :::tip sau :::exemplu sau :::atentie");
    }

    if (tieneCiteștePrezice) {
      const preziceBlock = block.split(/###\s+🔮/)[1].split(/###\s+🤝/)[0] || "";
      const tieneRealCode = /```python/.test(preziceBlock);
      if (!tieneRealCode) moduleErrors.push("Citește și prezice: lipsă bloc de cod real");
    }

    if (tieneExercițiiGhidate) {
      const ghidateBlock = block.split(/###\s+🤝/)[1].split(/###\s+🎯/)[0] || "";
      const tieneScaffold = /___/.test(ghidateBlock) || /```python/.test(ghidateBlock);
      if (!tieneScaffold) moduleErrors.push("Exerciții ghidate: lipsă scaffold de cod (___)");
    }

    if (tieneExercițiiIndependente) {
      const indepBlock = block.split(/###\s+🎯/)[1].split(/###\s+✅/)[0] || "";
      const countEx = (indepBlock.match(/(\*\*Exercițiul\s+\d+\.\*\*|Exercițiul\s+\d+)/g) || []).length;
      if (countEx < 1) moduleErrors.push("Exerciții independente: lipsă minim 1-2 exerciții enunțate");
    }

    const sub4Cod = `${codModul}.4`;
    const sub5Cod = `${codModul}.5`;
    if (!exercitiiJson[sub4Cod]) {
      moduleErrors.push(`exercitii.json: lipsă intrări hint pentru ${sub4Cod}`);
    }
    if (!exercitiiJson[sub5Cod]) {
      moduleErrors.push(`exercitii.json: lipsă intrări hint me pentru ${sub5Cod}`);
    }

    // Detectează umplutura generică pe care scripts/fix_pedagogical_content.mjs
    // (eliminat) o insera identic în module fără nicio legătură între ele — vezi
    // auditul care a cerut eliminarea lui. Dacă oricare din aceste tipare mai
    // apare, modulul nu a fost de fapt rescris cu conținut specific temei lui.
    const TIPARE_UMPLUTURA = [
      { nume: "exercițiu generic val1/val2", regex: /val1\s*=\s*15/ },
      { nume: "funcție exemplu_demonstrativ", regex: /exemplu_demonstrativ/ },
      {
        nume: "exercițiu independent generic",
        regex: /Scrie un program Python care rezolvă cerința directă/,
      },
      {
        nume: "sfat generic despre tipuri/indentare",
        regex: /Verifică întotdeauna tipul variabilelor și indentarea corectă/,
      },
    ];
    for (const tipar of TIPARE_UMPLUTURA) {
      if (tipar.regex.test(block)) {
        moduleErrors.push(`Umplutură generică nespecifică temei: ${tipar.nume}`);
      }
    }

    if (moduleErrors.length > 0) {
      totalErrors += moduleErrors.length;
      report.push({ codModul, file, errors: moduleErrors });
    }
  }
}

console.log("==================================================");
console.log(`📊 REZULTAT AUDIT PEDAGOGIC ACADEMIA PYTHON`);
console.log(`Total module verificate (non-ML): ${totalModuleChecked}`);
console.log(`Total erori/abateri găsite: ${totalErrors}`);
console.log("==================================================");

if (report.length > 0) {
  console.log("\n❌ LISTĂ MODULE SUB-STANDARD:");
  for (const item of report) {
    console.log(`\n📌 Modul ${item.codModul} (${item.file}):`);
    item.errors.forEach(e => console.log(`   - ${e}`));
  }
  process.exit(1);
} else {
  console.log("\n✅ TOATE MODULELE PASSĂ AUDITUL PEDAGOGIC 100%!");
  process.exit(0);
}
