export type ExercitiuSuplimentar = {
  id: number;
  cod: string;
  titlu: string;
  enunt: string;
  template: string;
  expectedOutput: string;
};

type ExData = Omit<ExercitiuSuplimentar, "id" | "cod">;

const BAZA_EXERCITII_SET: Record<string, ExData[]> = {
  "1.1": [
    {
      titlu: "Calcularea ariei unui triunghi",
      enunt: "Scrie un program Python care calculează aria unui triunghi având baza = 10 și înălțimea = 5. Formula este: aria = (baza * inaltime) / 2. Afișează rezultatul sub forma: 'Aria triunghiului este: X.Y'.",
      template: "baza = 10\ninaltime = 5\n# Calculează aria și afișeaz-o sub forma cerută\n",
      expectedOutput: "Aria triunghiului este: 25.0",
    },
    {
      titlu: "Calcularea mediei a 3 note",
      enunt: "Scrie un program Python care calculează și afișează media aritmetică a trei note: 7, 9 și 10. Afișează doar valoarea numerică a mediei.",
      template: "nota1 = 7\nnota2 = 9\nnota3 = 10\n# Calculează media aritmetică și printeaz-o\n",
      expectedOutput: "8.666666666666666",
    },
    {
      titlu: "Perimetrul unui pătrat",
      enunt: "Calculează perimetrul unui pătrat care are latura egală cu 8 cm. Afișează doar valoarea numerică a perimetrului (perimetrul = latura * 4).",
      template: "latura = 8\n# Calculează perimetrul și printează-l\n",
      expectedOutput: "32",
    },
    {
      titlu: "Suma primelor 10 numere",
      enunt: "Calculează suma primelor 10 numere naturale nenule (1 + 2 + 3 + ... + 10). Afișează direct rezultatul obținut.",
      template: "# Calculează manual sau prin formulă (n*(n+1))/2 suma primelor 10 numere naturale și afișeaz-o\n",
      expectedOutput: "55",
    },
    {
      titlu: "Afișare nume și clasă",
      enunt: "Scrie un program care afișează pe ecran textul 'Mădălina' pe primul rând, și 'Clasa a IX-a' pe al doilea rând.",
      template: "# Printează numele și clasa pe rânduri diferite\n",
      expectedOutput: "Mădălina\nClasa a IX-a",
    },
    {
      titlu: "Inversarea valorilor",
      enunt: "Având variabilele a = 5 și b = 10, inversează valorile acestora astfel încât a să aibă valoarea 10 și b valoarea 5. Afișează suma valorilor și apoi valorile lor în format: 'a=10 b=5'.",
      template: "a = 5\nb = 10\n# Realizează inversarea valorilor celor două variabile\n# Sugestie: a, b = b, a\nprint(f'a={a} b={b}')\n",
      expectedOutput: "a=10 b=5",
    }
  ]
};

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

  // Generare dinamică pentru restul de 87 module
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
