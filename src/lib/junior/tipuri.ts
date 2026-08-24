// ============================================================
// Academia Python Junior — Tipuri de bază
// ============================================================

export type DirectieByte = "N" | "S" | "E" | "V";

export type CelulaGrila =
  | "liber"
  | "perete"
  | "start"
  | "tinta"
  | "stea_bonus";

export type TipBloc =
  | "merge_inainte"
  | "intoarce_stanga"
  | "intoarce_dreapta"
  | "repeta"
  | "daca_stea"
  | "seteaza_variabila"
  | "adauga_variabila";

export type BlocComanda =
  | { tip: "merge_inainte" }
  | { tip: "intoarce_stanga" }
  | { tip: "intoarce_dreapta" }
  | { tip: "repeta"; deOri: number; comenzi: BlocComanda[] }
  | { tip: "daca_stea"; atunci: BlocComanda[]; altfel?: BlocComanda[] };

export type StareJoc = {
  x: number;
  y: number;
  directie: DirectieByte;
  steleColectate: number;
  completat: boolean;
  esuat: boolean;
  mesajEroare?: string;
};

export type DateNivel = {
  id: string;
  modul: number;
  numar: number;
  titlu: string;
  criteriu: string; // "Pot să..." afișat elevului
  mesajMascota: string; // Ce spune Byte la introducere
  grila: CelulaGrila[][];
  startPos: { x: number; y: number };
  startDir: DirectieByte;
  tintaPos: { x: number; y: number };
  blocuriPermise: TipBloc[];
  solutieOptima: BlocComanda[]; // pentru calculul stelelor
  codPythonVizibil: boolean;
};

export type ProgresNivel = {
  completat: boolean;
  stele: number; // 0-3
  incercari: number;
};

export type ProgresModul = {
  niveluri: Record<string, ProgresNivel>;
  insignaDeblocata: boolean;
};

export type ProfilElev = {
  id: string;
  avatar: number; // 0-5
  nume: string;
  module: Record<string, ProgresModul>;
  createdAt: number;
};
