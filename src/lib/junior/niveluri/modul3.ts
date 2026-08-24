// ============================================================
// Academia Python Junior — Datele Modulului 3
// „Dacă... Atunci..." (Condiționale if/else) — 5 niveluri
// ============================================================
import type { DateNivel } from "../tipuri";

export const nivelurileModul3: DateNivel[] = [
  {
    id: "M3N1",
    modul: 3,
    numar: 1,
    titlu: "Prima decizie a lui Byte",
    criteriu: "Pot să folosesc blocul «Dacă văd steluță» pentru a citi semnalul!",
    mesajMascota: "Când Byte ajunge pe o steluță ⭐, blocul «Dacă» verifică și execută ce e în interior! 🔀",
    grila: [
      ["start", "stea_bonus", "liber", "tinta"],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "E",
    tintaPos: { x: 3, y: 0 },
    blocuriPermise: ["merge_inainte", "daca_stea"],
    solutieOptima: [
      { tip: "merge_inainte" },
      { tip: "daca_stea", atunci: [{ tip: "merge_inainte" }] },
      { tip: "merge_inainte" },
    ],
    codPythonVizibil: true,
  },
  {
    id: "M3N2",
    modul: 3,
    numar: 2,
    titlu: "Semnalul de cotitură",
    criteriu: "Pot să îl fac pe Byte să vireze doar dacă găsește o steluță indicator!",
    mesajMascota: "Steluța este indicatorul de viraj! Dacă o găsești, virează dreapta! 🚦",
    grila: [
      ["start",  "stea_bonus", "perete"],
      ["perete", "liber",      "perete"],
      ["perete", "tinta",      "perete"],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "E",
    tintaPos: { x: 1, y: 2 },
    blocuriPermise: ["merge_inainte", "intoarce_dreapta", "daca_stea"],
    solutieOptima: [
      { tip: "merge_inainte" },
      {
        tip: "daca_stea",
        atunci: [
          { tip: "intoarce_dreapta" },
          { tip: "merge_inainte" },
          { tip: "merge_inainte" },
        ],
      },
    ],
    codPythonVizibil: true,
  },
  {
    id: "M3N3",
    modul: 3,
    numar: 3,
    titlu: "Căutătorul de steluțe",
    criteriu: "Pot să combin bucla Repetă cu un bloc Dacă în interior!",
    mesajMascota: "Pune blocul «Dacă» în interiorul buclei «Repetă» pentru a verifica steluțe la fiecare pas! 💡",
    grila: [
      ["start", "stea_bonus", "liber", "stea_bonus", "tinta"],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "E",
    tintaPos: { x: 4, y: 0 },
    blocuriPermise: ["merge_inainte", "daca_stea", "repeta"],
    solutieOptima: [
      {
        tip: "repeta",
        deOri: 4,
        comenzi: [
          { tip: "merge_inainte" },
          { tip: "daca_stea", atunci: [] },
        ],
      },
    ],
    codPythonVizibil: true,
  },
  {
    id: "M3N4",
    modul: 3,
    numar: 4,
    titlu: "Labirintul condiționat",
    criteriu: "Pot să ghidez robotul prin labirint folosind verificări la fiecare colț!",
    mesajMascota: "Byte își schimbă direcția doar la steluțe! Mergi înainte și verifică! 🔍",
    grila: [
      ["start",      "liber",  "stea_bonus"],
      ["perete",     "perete", "liber"     ],
      ["stea_bonus", "liber",  "tinta"     ],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "E",
    tintaPos: { x: 2, y: 2 },
    blocuriPermise: ["merge_inainte", "intoarce_dreapta", "intoarce_stanga", "daca_stea", "repeta"],
    solutieOptima: [
      { tip: "merge_inainte" },
      { tip: "merge_inainte" },
      { tip: "daca_stea", atunci: [{ tip: "intoarce_dreapta" }, { tip: "merge_inainte" }] },
      { tip: "merge_inainte" },
    ],
    codPythonVizibil: true,
  },
  {
    id: "M3N5",
    modul: 3,
    numar: 5,
    titlu: "Marele test al logicii",
    criteriu: "Pot să rezolv cel mai inteligent labirint cu condiții!",
    mesajMascota: "Ai demonstrat că știi să iei decizii logice! Câștigă insigna Modulului 3! 🏅",
    grila: [
      ["start",      "liber",      "stea_bonus"],
      ["perete",     "perete",     "liber"     ],
      ["stea_bonus", "stea_bonus", "tinta"     ],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "E",
    tintaPos: { x: 2, y: 2 },
    blocuriPermise: ["merge_inainte", "intoarce_dreapta", "intoarce_stanga", "daca_stea", "repeta"],
    solutieOptima: [
      {
        tip: "repeta",
        deOri: 2,
        comenzi: [
          { tip: "merge_inainte" },
        ],
      },
      { tip: "daca_stea", atunci: [{ tip: "intoarce_dreapta" }] },
      {
        tip: "repeta",
        deOri: 2,
        comenzi: [
          { tip: "merge_inainte" },
        ],
      },
    ],
    codPythonVizibil: true,
  },
];

export default nivelurileModul3;
