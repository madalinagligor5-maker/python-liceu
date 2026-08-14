export type Nivel = "de-baza" | "consolidat" | "avansat";

export type Exercitiu =
  // Exercițiu cu editor Python + verificare output.
  | {
      id: string;
      nivel: Nivel;
      tip: "cod";
      enunt: string;
      template?: string;
      expectedOutput?: string;
      hint?: string;
    }
  // Exercițiu în care elevul pune pașii în ordinea corectă.
  | {
      id: string;
      nivel: Nivel;
      tip: "ordonare";
      enunt: string;
      pasi: string[];
      ordineCorecta: string[];
      hint?: string;
    }
  // Răspuns liber (text) cu dezvăluire model.
  | {
      id: string;
      nivel: Nivel;
      tip: "text";
      enunt: string;
      modelRaspuns?: string;
      hint?: string;
    };

export const NIVELE: { id: Nivel; eticheta: string }[] = [
  { id: "de-baza", eticheta: "De bază" },
  { id: "consolidat", eticheta: "Consolidat" },
  { id: "avansat", eticheta: "Avansat" },
];
