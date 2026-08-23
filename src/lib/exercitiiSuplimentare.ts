export type ExercitiuSuplimentar = {
  cod: string;
  titlu: string;
  enunt: string;
  template: string;
  expectedOutput: string;
};

const BAZA_EXERCITII: Record<string, Omit<ExercitiuSuplimentar, "cod">> = {
  "1.1": {
    titlu: "Calcularea ariei unui triunghi",
    enunt: "Scrie un program Python care calculează aria unui triunghi având baza = 10 și înălțimea = 5. Formula este: aria = (baza * inaltime) / 2. Afișează rezultatul sub forma: 'Aria triunghiului este: X.Y'.",
    template: "baza = 10\ninaltime = 5\n# Calculează aria și afișeaz-o sub forma cerută\n",
    expectedOutput: "Aria triunghiului este: 25.0",
  },
  "1.2": {
    titlu: "Verificare număr par sau impar",
    enunt: "Scrie un program Python care verifică dacă un număr n este par sau impar. Dacă este par, afișează 'par', altfel afișează 'impar'. Folosește n = 42.",
    template: "n = 42\n# Scrie decizia if/else aici\n",
    expectedOutput: "par",
  },
  "1.4": {
    titlu: "Definirea unei funcții de dublare",
    enunt: "Definește o funcție numită `dublu(x)` care primește un parametru x și returnează dublul acestuia (x * 2). Apoi apelează funcția pentru valoarea 7 și afișează rezultatul folosind print().",
    template: "def dublu(x):\n    # Scrie corpul funcției aici\n    pass\n\n# Apelează funcția pentru valoarea 7 și afișează rezultatul\n",
    expectedOutput: "14",
  },
  "2.1": {
    titlu: "Căutare Binară",
    enunt: "Implementează o funcție `cautare_binara(lista, x)` care returnează True dacă x se află în lista ordonată, și False în caz contrar. Testează funcția cu lista [1, 3, 5, 7, 9] și valoarea 5, afișând rezultatul.",
    template: "def cautare_binara(lista, x):\n    stanga = 0\n    dreapta = len(lista) - 1\n    # Scrie algoritmul iterativ de căutare binară aici\n    return False\n\nprint(cautare_binara([1, 3, 5, 7, 9], 5))\n",
    expectedOutput: "True",
  },
  "2.17": {
    titlu: "Suma Recursivă",
    enunt: "Definește o funcție recursivă `suma_recursiva(n)` care returnează suma numerelor de la 1 la n. Pentru n = 5, rezultatul trebuie să fie 15. Apelează funcția și afișează rezultatul pentru n = 5.",
    template: "def suma_recursiva(n):\n    # Cazul de bază: dacă n este 1, returnează 1\n    # Pasul recursiv: returnează n + apelul recursiv pentru n-1\n    pass\n\nprint(suma_recursiva(5))\n",
    expectedOutput: "15",
  },
  "2.19": {
    titlu: "Algoritmul Quicksort",
    enunt: "Scrie o funcție `quicksort(lista)` care ordonează o listă de numere folosind metoda divide et impera. Apelează funcția pentru lista [4, 2, 9, 1] și afișează lista sortată în consolă.",
    template: "def quicksort(lista):\n    if len(lista) <= 1:\n        return lista\n    # Alege primul element ca pivot, împarte lista și returnează rezultatul recursiv\n    return lista\n\nprint(quicksort([4, 2, 9, 1]))\n",
    expectedOutput: "[1, 2, 4, 9]",
  },
  "3.4": {
    titlu: "Backtracking - Generare permutări",
    enunt: "Scrie o funcție care generează toate permutările mulțimii {1, 2} și le printează linie cu linie. (Așteptat: [1, 2] și [2, 1]).",
    template: "def permutari():\n    # Scrie o soluție simplă de generare sau folosește backtracking\n    print([1, 2])\n    print([2, 1])\n\npermutari()\n",
    expectedOutput: "[1, 2]\n[2, 1]",
  },
  "3.23": {
    titlu: "Programare Orientată pe Obiecte (POO)",
    enunt: "Creează o clasă numită `Cerc` care are un constructor `__init__(self, raza)` și o metodă `calcul_arie(self)` care returnează raza ridicată la pătrat înmulțită cu 3 (folosim aproximarea pi = 3). Instanțiază un cerc cu raza 5 și afișează aria.",
    template: "class Cerc:\n    def __init__(self, raza):\n        # Inițializează proprietatea raza\n        pass\n        \n    def calcul_arie(self):\n        # Returnează raza * raza * 3\n        return 0\n\nc = Cerc(5)\nprint(c.calcul_arie())\n",
    expectedOutput: "75",
  }
};

/**
 * Returnează un exercițiu suplimentar (exclusiv exercițiu de cod) pentru orice modul.
 * Dacă modulul nu este pre-definit, generează automat un exercițiu pe baza titlului modulului.
 */
export function obtineExercitiuSuplimentar(
  cod: string,
  titluModul: string
): ExercitiuSuplimentar {
  const predefinit = BAZA_EXERCITII[cod];
  if (predefinit) {
    return {
      cod,
      ...predefinit,
    };
  }

  // Generare dinamică pentru modulele care nu au exerciții predefinite scrise de mână
  return {
    cod,
    titlu: `Implementare practică: ${titluModul}`,
    enunt: `Scrie un program Python care demonstrează înțelegerea conceptului "${titluModul}". 
Pentru a finaliza cu succes verificarea automată, afișează în consolă textul exact: "Verificare modul ${cod} completă!"`,
    template: `# Exercițiu pentru modulul ${cod}: ${titluModul}\n# Scrie codul tău mai jos ca să printezi textul cerut\n\nprint("Verificare modul ${cod} completă!")\n`,
    expectedOutput: `Verificare modul ${cod} completă!`,
  };
}
