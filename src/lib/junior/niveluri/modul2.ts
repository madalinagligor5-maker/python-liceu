// ============================================================
// Academia Python Junior — Datele Modulului 2
// „Repetă cu Bucla" (Bucle for) — 5 niveluri
// ============================================================
import type { DateNivel } from "../tipuri";

export const nivelurileModul2: DateNivel[] = [
  {
    id: "M2N1",
    modul: 2,
    numar: 1,
    titlu: "Magia Buclei Repetă",
    criteriu: "Pot să folosesc un singur bloc Repetă pentru a merge 4 pași înainte!",
    mesajMascota: "În loc să pui 4 blocuri identice, folosește blocul «Repetă de 4 ori»! Economisești timp! 🔁",
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
    id: "M2N2",
    modul: 2,
    numar: 2,
    titlu: "Pătratul lui Byte",
    criteriu: "Pot să-l fac pe Byte să parcurgă un traseu în formă de pătrat cu o buclă!",
    mesajMascota: "Un pătrat are 4 laturi egale. Repetă combinația «Mergi înainte» + «Întoarce dreapta» de 4 ori! ⬛",
    grila: [
      ["start",  "liber", "liber", "perete"],
      ["perete", "perete", "liber", "perete"],
      ["liber",  "liber", "tinta", "perete"],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "E",
    tintaPos: { x: 2, y: 2 },
    blocuriPermise: ["merge_inainte", "intoarce_dreapta", "repeta"],
    solutieOptima: [
      {
        tip: "repeta",
        deOri: 2,
        comenzi: [
          { tip: "merge_inainte" },
          { tip: "merge_inainte" },
          { tip: "intoarce_dreapta" },
        ],
      },
    ],
    codPythonVizibil: true,
  },
  {
    id: "M2N3",
    modul: 2,
    numar: 3,
    titlu: "Scara de steluțe",
    criteriu: "Pot să urc scara repetând pasul de urcare de 3 ori!",
    mesajMascota: "Urcă scara treaptă cu treaptă! Fiecare treaptă înseamnă: sus și dreapta! 🪜",
    grila: [
      ["perete", "perete", "perete", "tinta"],
      ["perete", "perete", "liber",  "perete"],
      ["perete", "liber",  "perete", "perete"],
      ["start",  "perete", "perete", "perete"],
    ],
    startPos: { x: 0, y: 3 },
    startDir: "N",
    tintaPos: { x: 3, y: 0 },
    blocuriPermise: ["merge_inainte", "intoarce_stanga", "intoarce_dreapta", "repeta"],
    solutieOptima: [
      {
        tip: "repeta",
        deOri: 3,
        comenzi: [
          { tip: "merge_inainte" },
          { tip: "intoarce_dreapta" },
          { tip: "merge_inainte" },
          { tip: "intoarce_stanga" },
        ],
      },
    ],
    codPythonVizibil: true,
  },
  {
    id: "M2N4",
    modul: 2,
    numar: 4,
    titlu: "Bucle suprapuse",
    criteriu: "Pot să combin două bucle diferite pentru un traseu mai lung!",
    mesajMascota: "Folosește o buclă pentru mers înainte și alta după cotitură! 🚀",
    grila: [
      ["start", "liber", "liber", "liber", "perete"],
      ["perete","perete","perete","liber", "perete"],
      ["perete","perete","perete","liber", "perete"],
      ["perete","perete","perete","tinta", "perete"],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "E",
    tintaPos: { x: 3, y: 3 },
    blocuriPermise: ["merge_inainte", "intoarce_dreapta", "repeta"],
    solutieOptima: [
      { tip: "repeta", deOri: 3, comenzi: [{ tip: "merge_inainte" }] },
      { tip: "intoarce_dreapta" },
      { tip: "repeta", deOri: 3, comenzi: [{ tip: "merge_inainte" }] },
    ],
    codPythonVizibil: true,
  },
  {
    id: "M2N5",
    modul: 2,
    numar: 5,
    titlu: "Circuitul campionilor",
    criteriu: "Pot să parcurg tot circuitul și să iau steluțele folosind bucle!",
    mesajMascota: "Super! Acum ești maestru al buclelor! Câștigă insigna Modulului 2! 🏅",
    grila: [
      ["start",     "stea_bonus", "liber",      "stea_bonus"],
      ["stea_bonus","perete",     "perete",     "liber"],
      ["liber",     "perete",     "perete",     "stea_bonus"],
      ["stea_bonus","liber",      "stea_bonus", "tinta"],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "E",
    tintaPos: { x: 3, y: 3 },
    blocuriPermise: ["merge_inainte", "intoarce_stanga", "intoarce_dreapta", "repeta"],
    solutieOptima: [
      {
        tip: "repeta",
        deOri: 3,
        comenzi: [
          { tip: "merge_inainte" },
        ],
      },
      { tip: "intoarce_dreapta" },
      {
        tip: "repeta",
        deOri: 3,
        comenzi: [
          { tip: "merge_inainte" },
        ],
      },
    ],
    codPythonVizibil: true,
  },
];

export default nivelurileModul2;
