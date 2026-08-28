import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

/**
 * Script de audit pentru content/predicții.json — datele care alimentează
 * PredicțieWidget.tsx ("🔮 Citește și prezice").
 *
 * PROBLEME (gate dur — trebuie să fie 0 pentru exit code 0), pentru
 * FIECARE intrare din fișier (nu o listă parțială):
 *   1. `corect` e un index numeric întreg valid în `variante` (nu text —
 *      widget-ul compară `ales === predic.corect`, unde `ales` e indexul
 *      butonului apăsat, deci un string acolo nu se potrivește niciodată).
 *   2. `cod` conține cel puțin o linie executabilă reală (nu doar
 *      comentarii/gol) — altfel nu există nimic de "citit și prezis".
 *   3. Codul rulează cu Python real (subproces python3) fără eroare și
 *      produce un output nevid pe stdout.
 *
 * AVERTISMENTE (informativ, NU afectează exit code): output-ul real nu
 * corespunde textual/numeric variantei marcate `corect`. Verificarea asta
 * e best-effort (comparație numerică, text normalizat, sau substring) —
 * unele întrebări cer explicit doar UN detaliu din output-ul complet
 * (ex. "câte caractere are bara lui 18?" din output-ul cu 4 bare), nu tot
 * stdout-ul cuvânt cu cuvânt, așa că un avertisment aici nu e neapărat un
 * bug real; verifică manual lista.
 *
 * Rulare: node scripts/audit_predictii.mjs
 * Exit code 0 dacă 0 PROBLEME (avertismentele nu blochează).
 */

const filePath = path.join(process.cwd(), "content/predicții.json");
const raw = fs.readFileSync(filePath, "utf-8");
const data = JSON.parse(raw);

function liniiExecutabile(cod) {
  return String(cod || "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#"));
}

function ruleazaPython(cod, timeoutMs = 6000) {
  try {
    const out = execFileSync("python3", ["-c", cod], {
      timeout: timeoutMs,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
    });
    return { ok: true, stdout: out };
  } catch (e) {
    const stdout = e.stdout ? e.stdout.toString() : "";
    const stderr = e.stderr ? e.stderr.toString() : String(e.message || e);
    return { ok: false, stdout, error: stderr };
  }
}

function extrageNumere(s) {
  const m = String(s).replace(",", ".").match(/-?\d+(\.\d+)?/g);
  return m ? m.map(Number) : [];
}

function outputCorespunde(actual, expected) {
  const norm = (s) => s.replace(/\s+/g, " ").trim();
  const nA = extrageNumere(actual);
  const nE = extrageNumere(expected);
  if (nA.length > 0 && nE.length > 0) {
    return nA.length === nE.length && nA.every((v, i) => Math.abs(v - nE[i]) < 0.01);
  }
  const a = norm(actual);
  const e = norm(expected);
  // Multe variante descriu doar UN detaliu din output (ex. ultima linie,
  // sau un fragment) — acceptăm și potrivire de tip substring, în ambele
  // sensuri, nu doar egalitate exactă.
  return a === e || a.includes(e) || e.includes(a);
}

const chei = Object.keys(data);
const probleme = [];
const avertismente = [];

for (const cheie of chei) {
  const intrare = data[cheie];
  const issues = [];
  const variante = Array.isArray(intrare.variante) ? intrare.variante : [];

  const corectOk =
    typeof intrare.corect === "number" &&
    Number.isInteger(intrare.corect) &&
    intrare.corect >= 0 &&
    intrare.corect < variante.length;

  if (!corectOk) {
    issues.push(
      `corect invalid (tip=${typeof intrare.corect}, valoare=${JSON.stringify(
        intrare.corect
      )}, variante.length=${variante.length})`
    );
  }

  const codLinii = liniiExecutabile(intrare.cod);
  if (codLinii.length === 0) {
    issues.push("cod fără nicio linie executabilă (doar comentarii/gol)");
  } else {
    const rez = ruleazaPython(intrare.cod);
    if (!rez.ok) {
      const ultimaLinieEroare =
        rez.error.split("\n").filter(Boolean).pop() || rez.error;
      issues.push(`eroare la rularea codului cu Python: ${ultimaLinieEroare}`);
    } else if (!rez.stdout.trim()) {
      issues.push("codul rulează fără eroare dar nu produce niciun output (stdout gol)");
    } else if (corectOk) {
      const asteptat = variante[intrare.corect];
      if (!outputCorespunde(rez.stdout.trim(), asteptat)) {
        avertismente.push({
          cheie,
          mesaj: `output real ("${rez.stdout.trim()}") nu corespunde textual/numeric variantei marcate corecte ("${asteptat}") — verifică manual dacă întrebarea cere doar un detaliu din output`,
        });
      }
    }
  }

  if (issues.length > 0) {
    probleme.push({ cheie, issues });
  }
}

console.log("==================================================");
console.log("📊 AUDIT content/predicții.json (PredicțieWidget)");
console.log(`Total intrări verificate: ${chei.length}`);
console.log(`Intrări cu PROBLEME (gate dur): ${probleme.length}`);
console.log(`Intrări cu AVERTISMENTE (informativ): ${avertismente.length}`);
console.log("==================================================");

if (probleme.length > 0) {
  console.log("\n❌ INTRĂRI CU PROBLEME:");
  for (const p of probleme) {
    console.log(`\n- ${p.cheie}`);
    for (const iss of p.issues) {
      console.log(`    · ${iss}`);
    }
  }
}

if (avertismente.length > 0) {
  console.log("\n⚠️  AVERTISMENTE (nu blochează, verifică manual):");
  for (const a of avertismente) {
    console.log(`\n- ${a.cheie}`);
    console.log(`    · ${a.mesaj}`);
  }
}

if (probleme.length > 0) {
  console.log(`\n${probleme.length} intrări cu probleme reale (corect invalid / cod fără output real).`);
  process.exit(1);
} else {
  console.log("\n✅ 0 probleme: toate intrările au `corect` valid (index numeric în variante) și cod care rulează real, cu output nevid.");
  process.exit(0);
}
