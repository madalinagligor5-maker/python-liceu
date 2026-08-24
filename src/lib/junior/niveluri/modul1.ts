// ============================================================
// Academia Python Junior — Datele Modulului 1
// „Comenzi și secvențe" — 5 niveluri
// ============================================================
import type { DateNivel } from "../tipuri";

export const nivelurileModul1: DateNivel[] = [
  // ──────────────────────────────────────────────────────────
  // NIVELUL 1 — Drept înainte (intro)
  // ──────────────────────────────────────────────────────────
  {
    id: "M1N1",
    modul: 1,
    numar: 1,
    titlu: "Primul pas al lui Byte",
    criteriu: "Pot să îl ajut pe Byte să ajungă la steluță mergând drept înainte!",
    mesajMascota: "Salut! Eu sunt Byte! Trage blocurile «Mergi înainte» și apasă Rulează ca să ajung la steluță! ⭐",
    grila: [
      ["start", "liber", "liber", "tinta"],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "E",
    tintaPos: { x: 3, y: 0 },
    blocuriPermise: ["merge_inainte"],
    solutieOptima: [
      { tip: "merge_inainte" },
      { tip: "merge_inainte" },
      { tip: "merge_inainte" },
    ],
    codPythonVizibil: false,
  },

  // ──────────────────────────────────────────────────────────
  // NIVELUL 2 — Prima cotitură + cod Python vizibil
  // ──────────────────────────────────────────────────────────
  {
    id: "M1N2",
    modul: 1,
    numar: 2,
    titlu: "Byte face o cotitură",
    criteriu: "Pot să îl ajut pe Byte să vireze și să găsească steluța!",
    mesajMascota: "Acum am nevoie și de blocul «Întoarce dreapta»! Uite, în panoul din dreapta apare limba secretă a roboților: Python! 🐍",
    grila: [
      ["start", "liber", "liber", "liber"],
      ["perete", "perete", "perete", "liber"],
      ["liber",  "liber",  "liber",  "tinta"],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "E",
    tintaPos: { x: 3, y: 2 },
    blocuriPermise: ["merge_inainte", "intoarce_dreapta"],
    solutieOptima: [
      { tip: "merge_inainte" },
      { tip: "merge_inainte" },
      { tip: "merge_inainte" },
      { tip: "intoarce_dreapta" },
      { tip: "merge_inainte" },
      { tip: "merge_inainte" },
      { tip: "intoarce_dreapta" },
      { tip: "merge_inainte" },
      { tip: "merge_inainte" },
      { tip: "merge_inainte" },
    ],
    codPythonVizibil: true,
  },

  // ──────────────────────────────────────────────────────────
  // NIVELUL 3 — Stânga și dreapta
  // ──────────────────────────────────────────────────────────
  {
    id: "M1N3",
    modul: 1,
    numar: 3,
    titlu: "Labirintul lui Byte",
    criteriu: "Pot să navigheze Byte prin labirint folosind toate cele 3 comenzi!",
    mesajMascota: "Atenție la pereți! Dacă Byte se lovește, încearcă din nou — nu e nicio problemă! 💪",
    grila: [
      ["start", "liber",  "perete", "liber", "liber"],
      ["perete","liber",  "perete", "liber", "perete"],
      ["perete","liber",  "liber",  "liber", "perete"],
      ["perete","perete", "perete", "liber", "perete"],
      ["liber", "liber",  "liber",  "liber", "tinta"],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "S",
    tintaPos: { x: 4, y: 4 },
    blocuriPermise: ["merge_inainte", "intoarce_stanga", "intoarce_dreapta"],
    solutieOptima: [
      { tip: "merge_inainte" },
      { tip: "intoarce_dreapta" },
      { tip: "merge_inainte" },
      { tip: "merge_inainte" },
      { tip: "merge_inainte" },
      { tip: "intoarce_stanga" },
      { tip: "merge_inainte" },
      { tip: "merge_inainte" },
      { tip: "intoarce_stanga" },
      { tip: "merge_inainte" },
      { tip: "merge_inainte" },
      { tip: "merge_inainte" },
      { tip: "intoarce_dreapta" },
      { tip: "merge_inainte" },
    ],
    codPythonVizibil: true,
  },

  // ──────────────────────────────────────────────────────────
  // NIVELUL 4 — Labirint mai complex cu stea bonus
  // ──────────────────────────────────────────────────────────
  {
    id: "M1N4",
    modul: 1,
    numar: 4,
    titlu: "Steluța ascunsă",
    criteriu: "Pot să îl duc pe Byte la steluța finală și să colectez și steluța ascunsă!",
    mesajMascota: "Există și o steluță bonus ascunsă în labirint! Poți s-o găsești? 🌟",
    grila: [
      ["start",  "liber",   "liber",    "perete",    "liber",  "liber"  ],
      ["perete", "perete",  "liber",    "perete",    "liber",  "perete" ],
      ["liber",  "liber",   "liber",    "liber",     "liber",  "perete" ],
      ["liber",  "perete",  "perete",   "perete",    "liber",  "perete" ],
      ["liber",  "stea_bonus","liber",  "liber",     "liber",  "perete" ],
      ["liber",  "perete",  "perete",   "perete",    "perete", "tinta"  ],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "E",
    tintaPos: { x: 5, y: 5 },
    blocuriPermise: ["merge_inainte", "intoarce_stanga", "intoarce_dreapta"],
    solutieOptima: [
      { tip: "merge_inainte" }, { tip: "merge_inainte" },
      { tip: "intoarce_dreapta" },
      { tip: "merge_inainte" }, { tip: "merge_inainte" },
      { tip: "intoarce_stanga" },
      { tip: "merge_inainte" }, { tip: "merge_inainte" }, { tip: "merge_inainte" },
      { tip: "intoarce_dreapta" },
      { tip: "merge_inainte" },
      { tip: "intoarce_stanga" },
      { tip: "merge_inainte" }, { tip: "merge_inainte" }, { tip: "merge_inainte" },
      { tip: "intoarce_dreapta" },
      { tip: "merge_inainte" },
    ],
    codPythonVizibil: true,
  },

  // ──────────────────────────────────────────────────────────
  // NIVELUL 5 — Provocare finală M1
  // ──────────────────────────────────────────────────────────
  {
    id: "M1N5",
    modul: 1,
    numar: 5,
    titlu: "Marele labirint al lui Byte",
    criteriu: "Pot să rezolv cel mai dificil labirint din Modulul 1!",
    mesajMascota: "Aceasta este ultima provocare din Modulul 1! Ești gata? Dacă reușești, câștigi insigna de Secvențiator! 🏅",
    grila: [
      ["start",  "liber",  "perete", "liber",  "liber",  "liber",  "perete"],
      ["perete", "liber",  "perete", "liber",  "perete", "liber",  "perete"],
      ["perete", "liber",  "liber",  "liber",  "perete", "liber",  "liber" ],
      ["perete", "perete", "perete", "perete", "perete", "perete", "liber" ],
      ["liber",  "liber",  "liber",  "liber",  "liber",  "perete", "liber" ],
      ["liber",  "perete", "perete", "perete", "liber",  "perete", "liber" ],
      ["liber",  "liber",  "liber",  "liber",  "liber",  "liber",  "tinta" ],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "S",
    tintaPos: { x: 6, y: 6 },
    blocuriPermise: ["merge_inainte", "intoarce_stanga", "intoarce_dreapta"],
    solutieOptima: [
      { tip: "merge_inainte" }, { tip: "intoarce_dreapta" },
      { tip: "merge_inainte" },
      { tip: "intoarce_stanga" },
      { tip: "merge_inainte" }, { tip: "merge_inainte" },
      { tip: "intoarce_dreapta" },
      { tip: "merge_inainte" }, { tip: "merge_inainte" }, { tip: "merge_inainte" },
      { tip: "intoarce_stanga" },
      { tip: "merge_inainte" }, { tip: "merge_inainte" }, { tip: "merge_inainte" }, { tip: "merge_inainte" },
      { tip: "intoarce_dreapta" },
      { tip: "merge_inainte" }, { tip: "merge_inainte" },
      { tip: "intoarce_dreapta" },
      { tip: "merge_inainte" }, { tip: "merge_inainte" },
      { tip: "intoarce_stanga" },
      { tip: "merge_inainte" }, { tip: "merge_inainte" }, { tip: "merge_inainte" },
      { tip: "intoarce_dreapta" },
      { tip: "merge_inainte" }, { tip: "merge_inainte" },
    ],
    codPythonVizibil: true,
  },
];

export default nivelurileModul1;
