// ============================================================
// Academia Python Junior — Datele Modulului 4
// „Rucsacul lui Byte" (Variabile & Numărare) — 4 niveluri
// ============================================================
import type { DateNivel } from "../tipuri";

export const nivelurileModul4: DateNivel[] = [
  {
    id: "M4N1",
    modul: 4,
    numar: 1,
    titlu: "Cutia cu comori",
    criteriu: "Pot să colectez steluțe și să le număr în rucsacul lui Byte!",
    mesajMascota: "O variabilă este ca o cutie etichetată! Fiecare steluță culeasă adaugă +1 în cutie! 🎒",
    grila: [
      ["start", "stea_bonus", "stea_bonus", "tinta"],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "E",
    tintaPos: { x: 3, y: 0 },
    blocuriPermise: ["merge_inainte", "repeta"],
    solutieOptima: [
      { tip: "repeta", deOri: 3, comenzi: [{ tip: "merge_inainte" }] },
    ],
    codPythonVizibil: true,
  },
  {
    id: "M4N2",
    modul: 4,
    numar: 2,
    titlu: "Colectorul de puncte",
    criteriu: "Pot să adun toate cele 3 steluțe din traseu!",
    mesajMascota: "Verifică rucsacul la final! Ai nevoie de 3 steluțe pentru scor maxim! ⭐⭐⭐",
    grila: [
      ["start",      "liber", "stea_bonus"],
      ["stea_bonus", "perete","liber"     ],
      ["liber",      "stea_bonus","tinta" ],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "E",
    tintaPos: { x: 2, y: 2 },
    blocuriPermise: ["merge_inainte", "intoarce_dreapta", "intoarce_stanga", "repeta"],
    solutieOptima: [
      { tip: "merge_inainte" },
      { tip: "merge_inainte" },
      { tip: "intoarce_dreapta" },
      { tip: "merge_inainte" },
      { tip: "merge_inainte" },
    ],
    codPythonVizibil: true,
  },
  {
    id: "M4N3",
    modul: 4,
    numar: 3,
    titlu: "Misiunea de numărare",
    criteriu: "Pot să parcurg traseul și să număr steluțele găsite!",
    mesajMascota: "În Python scriem `stele = stele + 1`. Privește cum se actualizează în panoul din dreapta! 🐍",
    grila: [
      ["start",      "stea_bonus", "perete",    "liber"],
      ["perete",     "liber",      "stea_bonus","liber"],
      ["stea_bonus", "liber",      "perete",    "tinta"],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "E",
    tintaPos: { x: 3, y: 2 },
    blocuriPermise: ["merge_inainte", "intoarce_dreapta", "intoarce_stanga", "repeta"],
    solutieOptima: [
      { tip: "merge_inainte" },
      { tip: "intoarce_dreapta" },
      { tip: "merge_inainte" },
      { tip: "merge_inainte" },
      { tip: "intoarce_stanga" },
      { tip: "merge_inainte" },
      { tip: "merge_inainte" },
    ],
    codPythonVizibil: true,
  },
  {
    id: "M4N4",
    modul: 4,
    numar: 4,
    titlu: "Campionul Rucsacului",
    criteriu: "Pot să umplu rucsacul lui Byte cu toate steluțele din labirint!",
    mesajMascota: "Felicitări! Știi să folosești variabile! Câștigă insigna Modulului 4! 🏅",
    grila: [
      ["start",      "stea_bonus", "stea_bonus"],
      ["stea_bonus", "perete",     "stea_bonus"],
      ["stea_bonus", "stea_bonus", "tinta"     ],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "E",
    tintaPos: { x: 2, y: 2 },
    blocuriPermise: ["merge_inainte", "intoarce_dreapta", "intoarce_stanga", "repeta"],
    solutieOptima: [
      { tip: "merge_inainte" }, { tip: "merge_inainte" },
      { tip: "intoarce_dreapta" },
      { tip: "merge_inainte" }, { tip: "merge_inainte" },
    ],
    codPythonVizibil: true,
  },
];

export default nivelurileModul4;
