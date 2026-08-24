// ============================================================
// Academia Python Junior — Datele Modulului 6
// „Proiectul Meu" (Sandbox / Creativitate liberă) — 1 nivel
// ============================================================
import type { DateNivel } from "../tipuri";

export const nivelurileModul6: DateNivel[] = [
  {
    id: "M6N1",
    modul: 6,
    numar: 1,
    titlu: "Laboratorul de Creație liberă",
    criteriu: "Pot să programez liber robotul Byte prin parc și să adun toate steluțele magic!",
    mesajMascota: "Acesta este laboratorul tău! Toate blocurile sunt deblocate. Colectează toate cele 6 steluțe! 🎨✨",
    grila: [
      ["start",      "stea_bonus", "liber",      "stea_bonus", "liber"     ],
      ["stea_bonus", "perete",     "liber",      "perete",     "stea_bonus"],
      ["liber",      "liber",      "stea_bonus", "liber",      "liber"     ],
      ["stea_bonus", "perete",     "liber",      "perete",     "stea_bonus"],
      ["liber",      "stea_bonus", "liber",      "stea_bonus", "tinta"     ],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "E",
    tintaPos: { x: 4, y: 4 },
    blocuriPermise: ["merge_inainte", "intoarce_stanga", "intoarce_dreapta", "repeta", "daca_stea"],
    solutieOptima: [
      { tip: "repeta", deOri: 4, comenzi: [{ tip: "merge_inainte" }] },
      { tip: "intoarce_dreapta" },
      { tip: "repeta", deOri: 4, comenzi: [{ tip: "merge_inainte" }] },
    ],
    codPythonVizibil: true,
  },
];

export default nivelurileModul6;
