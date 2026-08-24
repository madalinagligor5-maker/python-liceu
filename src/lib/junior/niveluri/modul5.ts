// ============================================================
// Academia Python Junior — Datele Modulului 5
// „Rețete pentru Byte" (Funcții & Reutilizare) — 4 niveluri
// ============================================================
import type { DateNivel } from "../tipuri";

export const nivelurileModul5: DateNivel[] = [
  {
    id: "M5N1",
    modul: 5,
    numar: 1,
    titlu: "Prima rețetă de cod",
    criteriu: "Pot să creez o rețetă (funcție) de pași și să o refolosesc!",
    mesajMascota: "O funcție este ca o rețetă de prăjituri: îi dai un nume și o apelezi când ai nevoie! 📋",
    grila: [
      ["start", "liber", "liber", "liber", "tinta"],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "E",
    tintaPos: { x: 4, y: 0 },
    blocuriPermise: ["merge_inainte", "repeta"],
    solutieOptima: [
      { tip: "repeta", deOri: 4, comenzi: [{ tip: "merge_inainte" }] },
    ],
    codPythonVizibil: true,
  },
  {
    id: "M5N2",
    modul: 5,
    numar: 2,
    titlu: "Rețeta «Pas și viraj»",
    criteriu: "Pot să aplic aceeași secvență de instrucțiuni pentru 3 colțuri!",
    mesajMascota: "Definim rețeta o singură dată în Python cu `def pas_si_viraj():`! 🐍",
    grila: [
      ["start",  "liber", "perete"],
      ["perete", "liber", "perete"],
      ["perete", "liber", "tinta" ],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "E",
    tintaPos: { x: 2, y: 2 },
    blocuriPermise: ["merge_inainte", "intoarce_dreapta", "intoarce_stanga", "repeta"],
    solutieOptima: [
      { tip: "merge_inainte" },
      { tip: "intoarce_dreapta" },
      { tip: "merge_inainte" },
      { tip: "intoarce_stanga" },
      { tip: "merge_inainte" },
      { tip: "intoarce_dreapta" },
      { tip: "merge_inainte" },
    ],
    codPythonVizibil: true,
  },
  {
    id: "M5N3",
    modul: 5,
    numar: 3,
    titlu: "Modelul Zig-Zag",
    criteriu: "Pot să rezolv un traseu repetat în zig-zag!",
    mesajMascota: "Când ai un model care se repetă (stânga-dreapta), folosește bucla peste funcție! ⚡",
    grila: [
      ["start",  "perete", "liber",  "perete"],
      ["liber",  "liber",  "liber",  "perete"],
      ["perete", "liber",  "perete", "tinta" ],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "S",
    tintaPos: { x: 3, y: 2 },
    blocuriPermise: ["merge_inainte", "intoarce_dreapta", "intoarce_stanga", "repeta"],
    solutieOptima: [
      { tip: "merge_inainte" },
      { tip: "intoarce_stanga" },
      { tip: "merge_inainte" }, { tip: "merge_inainte" },
      { tip: "intoarce_dreapta" },
      { tip: "merge_inainte" },
      { tip: "intoarce_stanga" },
      { tip: "merge_inainte" },
    ],
    codPythonVizibil: true,
  },
  {
    id: "M5N4",
    modul: 5,
    numar: 4,
    titlu: "Maestrul Rețetelor",
    criteriu: "Pot să creez cel mai elegant program din Modulul 5!",
    mesajMascota: "Minunat! Acum știi cum funcționează funcțiile în programare! Câștigă insigna Modulului 5! 🏅",
    grila: [
      ["start",      "liber",      "stea_bonus"],
      ["stea_bonus", "perete",     "liber"     ],
      ["liber",      "stea_bonus", "tinta"     ],
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

export default nivelurileModul5;
