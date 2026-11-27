export type ExercitiuSuplimentar = {
  id: number;
  cod: string;
  titlu: string;
  enunt: string;
  template: string;
  expectedOutput: string;
};

import practiceRaw from "../../content/exercitii-practice.json";

type ExData = Omit<ExercitiuSuplimentar, "id" | "cod">;

/** Câte 6 exerciții progresive pentru fiecare modul, scrise în
 *  scripts/lectii/practice.json (cu soluții verificate de
 *  scripts/verifica_lectii.py) și copiate fără soluții în content/. */
const BAZA_EXERCITII_SET: Record<string, ExData[]> = practiceRaw;

export function obtineSetExercitii(
  cod: string,
  titluModul: string
): ExercitiuSuplimentar[] {
  const predefinit = BAZA_EXERCITII_SET[cod];
  if (predefinit) {
    return predefinit.map((ex, idx) => ({
      id: idx + 1,
      cod,
      ...ex,
    }));
  }

  // Generare dinamică pentru modulele care nu au încă exerciții scrise
  return Array.from({ length: 6 }).map((_, idx) => {
    const id = idx + 1;
    let titlu = "";
    let enunt = "";
    let template = "";
    let expectedOutput = "";

    switch (id) {
      case 1:
        titlu = `Introducere: ${titluModul}`;
        enunt = `Scrie un program Python care afișează în consolă denumirea modulului curent: "${titluModul}".`;
        template = `# Exercițiul 1: Afișare text\n# Printează textul exact: "${titluModul}"\nprint("${titluModul}")\n`;
        expectedOutput = titluModul;
        break;
      case 2:
        titlu = "Operații elementare";
        enunt = `Declară o variabilă n = 10 și afișează valoarea acesteia înmulțită cu 5.`;
        template = `# Exercițiul 2: Înmulțire simplă\nn = 10\n# Calculează și printează n * 5\n`;
        expectedOutput = "50";
        break;
      case 3:
        titlu = "Aplicare practică simplă";
        enunt = `Scrie un program care calculează și afișează suma a două numere întregi, a = 12 și b = 28.`;
        template = `# Exercițiul 3: Adunare\na = 12\nb = 28\n# Calculează suma și afișeaz-o\n`;
        expectedOutput = "40";
        break;
      case 4:
        titlu = "Nivel mediu - Paritate";
        enunt = `Verifică dacă numărul n = 7 este par sau impar. Afișează 'par' sau 'impar'.`;
        template = `# Exercițiul 4: Structură de decizie\nn = 7\n# Scrie if/else pentru paritate\n`;
        expectedOutput = "impar";
        break;
      case 5:
        titlu = "Problemă avansată";
        enunt = `Scrie o funcție numită \`patrat(x)\` care returnează ridicarea la pătrat a lui x. Apoi, apelează funcția pentru valoarea 9 și afișează rezultatul.`;
        template = `# Exercițiul 5: Funcție ridicare la pătrat\ndef patrat(x):\n    # Completează corpul funcției\n    return x * x\n\n# Apelează pentru 9 și printează\nprint(patrat(9))\n`;
        expectedOutput = "81";
        break;
      case 6:
        titlu = "Provocare de excelență";
        enunt = `Scrie un program Python care simulează parcurgerea unei structuri de date. Pentru testul de verificare automată, afișează textul exact: "Modulul ${cod} finalizat cu succes!"`;
        template = `# Exercițiul 6: Provocarea finală\n# Printează textul de confirmare exact\nprint("Modulul ${cod} finalizat cu succes!")\n`;
        expectedOutput = `Modulul ${cod} finalizat cu succes!`;
        break;
    }

    return {
      id,
      cod,
      titlu,
      enunt,
      template,
      expectedOutput,
    };
  });
}
