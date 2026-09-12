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
      /** Al doilea nivel de sprijin: un indiciu mai explicit pentru când
       *  elevul e blocat după primul indiciu. */
      hint2?: string;
      /** Variantă de extindere pentru cei care termină repede: o cerință
       *  mai grea pe aceeași temă. */
      extindere?: string;
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
      hint2?: string;
      extindere?: string;
    }
  // Răspuns liber (text) cu dezvăluire model.
  | {
      id: string;
      nivel: Nivel;
      tip: "text";
      enunt: string;
      modelRaspuns?: string;
      hint?: string;
      hint2?: string;
      extindere?: string;
    }
  // Exercițiu de unire (matching) — elevul asociază fiecare element din
  // stânga cu perechea lui corectă din dreapta.
  | {
      id: string;
      nivel: Nivel;
      tip: "unire";
      enunt: string;
      perechi: { stanga: string; dreapta: string }[];
      hint?: string;
      hint2?: string;
      extindere?: string;
    }
  // Exercițiu adevărat/fals — un set de afirmații, elevul marchează
  // valoarea de adevăr a fiecăreia.
  | {
      id: string;
      nivel: Nivel;
      tip: "adevarat-fals";
      enunt: string;
      afirmatii: { text: string; corect: boolean }[];
      hint?: string;
      hint2?: string;
      extindere?: string;
    }
  // Exercițiu de completare (cloze) — elevul pune cuvântul care lipsește
  // în locul fiecărui gol marcat cu "___" în text.
  | {
      id: string;
      nivel: Nivel;
      tip: "completare";
      enunt: string;
      /** Textul cu golurile marcate "___" (trei liniuțe), câte unul per răspuns așteptat. */
      text: string;
      /** Răspunsurile corecte, în ordinea golurilor din text. */
      raspunsuri: string[];
      hint?: string;
      hint2?: string;
      extindere?: string;
    };

export const NIVELE: { id: Nivel; eticheta: string }[] = [
  { id: "de-baza", eticheta: "De bază" },
  { id: "consolidat", eticheta: "Consolidat" },
  { id: "avansat", eticheta: "Avansat" },
];
