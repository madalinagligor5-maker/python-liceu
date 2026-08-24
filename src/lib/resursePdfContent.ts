import { capitole } from "./curriculum";

export type FisaPdfContent = {
  teorie: string;
  sintaxa: string;
  exercitii: string[];
};

const BAZA_PDF: Record<string, FisaPdfContent> = {
  "1.1": {
    teorie: "Un algoritm reprezinta o succesiune logica de pasi pentru rezolvarea unei probleme. In Python, scriem cod format din instructiuni executate in ordine de sus in jos. Orice program are o etapa de analiza (ce date avem?), proiectare (cum le prelucram?), implementare (scrierea codului) si testare (rularea cu diverse date de intrare).",
    sintaxa: "# Declarare variabile si afisare\nnume = 'Elev'\nvarsta = 16\nprint('Numele meu este:', nume)\nprint('Varsta:', varsta)",
    exercitii: [
      "Scrie un program care afiseaza numele tau si clasa in care esti pe doua randuri diferite.",
      "Calculeaza aria unui patrat cu latura de 12 cm. Afiseaza rezultatul cu un mesaj potrivit.",
      "Declara doua variabile cu numere intregi si afiseaza suma, diferenta si produsul lor."
    ]
  },
  "1.2": {
    teorie: "Structura de decizie (if-else) ii permite programului sa aleaga intre doua sau mai multe cai de executie, in functie de o conditie logica. In Python, blocul de cod care se executa daca conditia este adevarata se termina obligatoriu cu doua puncte (:), iar liniile urmatoare trebuie sa fie indentate (deplasate spre dreapta cu 4 spatii).",
    sintaxa: "# Verificare numar\nnr = 15\nif nr > 10:\n    print('Numarul este mai mare decat 10')\nelse:\n    print('Numarul este mic')",
    exercitii: [
      "Scrie un program care verifica daca o nota introdusa este mai mare sau egala cu 5 si afiseaza 'Trecut' sau 'Respins'.",
      "Declara doua variabile, x si y. Afiseaza-o pe cea mai mare dintre ele in consola.",
      "Verifica daca un numar intreg este pozitiv, negativ sau egal cu zero (foloseste if, elif si else)."
    ]
  },
  "1.3": {
    teorie: "Eficienta unui algoritm se masoara in functie de resursele consumate: timpul de rulare (complexitate de timp) si memoria utilizata (complexitate de spatiu). Folosim notatia Big O (ex: O(1), O(n), O(n2)) pentru a exprima cum creste timpul de executie in raport cu volumul datelor de intrare (n).",
    sintaxa: "# Eficienta O(1) versus O(n)\ndef primul_element(lista):\n    return lista[0]  # O(1) - timp constant\n\ndef afiseaza_tot(lista):\n    for x in lista:\n        print(x)  # O(n) - timp liniar",
    exercitii: [
      "Care este complexitatea de timp (in notatie Big O) a unui algoritm care cauta secvential un element intr-o lista nesortata de n elemente?",
      "Daca un algoritm are o complexitate de tip O(n2), de cate ori va creste timpul de executie cand dublam cantitatea datelor de intrare?",
      "Explica diferenta fundamentala de performanta dintre un algoritm O(1) si un algoritm O(n) pe seturi mari de date."
    ]
  },
  "1.4": {
    teorie: "Functiile (subprogramele) reprezinta blocuri de cod reutilizabile, create pentru a realiza o actiune specifica. Ele ne permit sa nu duplicam codul. O functie se defineste prin cuvantul cheie `def`, urmat de nume si paranteze. Ea poate primi argumente si poate intoarce o valoare folosind instructiunea `return`.",
    sintaxa: "# Definire functie de adunare\ndef aduna(a, b):\n    return a + b\n\nrezultat = aduna(10, 5)\nprint(rezultat)  # Afiseaza 15",
    exercitii: [
      "Definește o funcție `perimetru_dreptunghi(L, l)` care returneaza perimetrul unui dreptunghi.",
      "Scrie o functie `este_par(n)` care returneaza True daca n este par si False in caz contrar.",
      "Creeaza o functie `salut(nume)` care afiseaza textul 'Salut, [nume]!' in consola."
    ]
  },
  "1.5": {
    teorie: "Domeniul de vizibilitate (scope) al unei variabile determina unde poate fi accesata aceasta. O variabila definita in interiorul unei functii este locala si exista doar in timpul rularii acelei functii. O variabila definita in corpul principal este globala si poate fi citita de oriunde. Modificarea unei variabile globale in interiorul unei functii necesita utilizarea cuvantului cheie 'global'.",
    sintaxa: "# Domeniu de vizibilitate (Scope)\nx = 10  # Variabila globala\n\ndef test_scope():\n    y = 5  # Variabila locala\n    print('Valoare locala:', y)\n    print('Valoare globala citita:', x)\n\ntest_scope()",
    exercitii: [
      "Scrie o functie care incearca sa modifice o variabila globala fara a utiliza cuvantul cheie `global` si observa rezultatul. Explica fenomenul.",
      "Creeaza o functie `calculeaza_reducere(pret, procent)` ce foloseste parametri si returneaza pretul final redus.",
      "Analizeaza codul urmator si explica ce se va afisa: a = 3; def f(): a = 7; f(); print(a)."
    ]
  },
  "2.1": {
    teorie: "Cautarea binara este un algoritm extrem de eficient pentru gasirea unui element intr-o lista sortata. In loc sa verificam elementele unul cate unul, comparam valoarea cautata cu mijlocul intervalului. La fiecare pas, injumatatim spatiul de cautare, obtinand o complexitate de O(log n).",
    sintaxa: "# Cautare binara iterativa\ndef cauta(lista, x):\n    st = 0\n    dr = len(lista) - 1\n    while st <= dr:\n        mj = (st + dr) // 2\n        if lista[mj] == x: return mj\n        elif lista[mj] < x: st = mj + 1\n        else: dr = mj - 1\n    return -1",
    exercitii: [
      "Simuleaza pe foaie cautarea binara a numarului 35 in lista [5, 12, 18, 25, 35, 42, 50]. Scrie indicii stanga, dreapta si mijloc la fiecare pas.",
      "Explica de ce cautarea binara nu poate fi aplicata direct pe o lista nesortata.",
      "Modifica algoritmul pentru a returna True daca elementul exista si False daca nu exista."
    ]
  },
  "2.17": {
    teorie: "Recursivitatea reprezinta tehnica prin care o functie se apeleaza pe ea insasi pentru a rezolva subprobleme mai mici. Orice algoritm recursiv trebuie sa aiba un caz de baza (conditia de oprire, care nu mai face apel recursiv) si un pas recursiv (care simplifica problema si tinde spre cazul de baza). Fara caz de baza, programul intra in bucla infinita.",
    sintaxa: "# Calculeaza factorialul unui numar recursiv\ndef factorial(n):\n    if n <= 1:\n        return 1  # Cazul de baza\n    return n * factorial(n - 1)  # Pasul recursiv",
    exercitii: [
      "Scrie o functie recursiva `suma_n(n)` care returneaza suma primelor n numere naturale.",
      "Implementeaza recursiv algoritmul pentru a calcula al n-lea termen din sirul lui Fibonacci.",
      "Explica ce este eroarea 'RecursionError: maximum recursion depth exceeded' si din ce cauza apare."
    ]
  },
  "2.19": {
    teorie: "Quicksort (Sortarea Rapida) este un algoritm de sortare bazat pe tehnica Divide et Impera. Se alege un element numit 'pivot', se partitioneaza lista astfel incat elementele mai mici decat pivotul sa fie in stanga, iar cele mai mari in dreapta, apoi se sorteaza recursiv cele doua subliste. Complexitatea medie este O(n log n).",
    sintaxa: "# Implementare simpla Quicksort\ndef quicksort(arr):\n    if len(arr) <= 1: return arr\n    pivot = arr[0]\n    st = [x for x in arr[1:] if x <= pivot]\n    dr = [x for x in arr[1:] if x > pivot]\n    return quicksort(st) + [pivot] + quicksort(dr)",
    exercitii: [
      "Simuleaza sortarea rapida pentru lista [8, 4, 3, 9, 1, 5] folosind ca pivot primul element. Arata pasii de partitionare.",
      "Care este cazul cel mai nefavorabil (worst-case) pentru Quicksort si ce complexitate are in acest caz?",
      "Modifica algoritmul quicksort pentru a sorta lista in ordine descrescatoare."
    ]
  }
};

export function obtineFisaPdfContent(
  cod: string,
  titluModul: string
): FisaPdfContent {
  const predefinit = BAZA_PDF[cod];
  if (predefinit) {
    return predefinit;
  }

  // Căutăm modulul în baza de capitole a curriculumului pentru a genera conținut personalizat explicit
  let modulGăsit = null;
  for (const c of capitole) {
    const m = c.module.find((mod) => mod.cod === cod);
    if (m) {
      modulGăsit = m;
      break;
    }
  }

  if (modulGăsit) {
    const sublectiiInfo = modulGăsit.sublectii
      .map((s) => `  - Pasul ${s.cod}: ${s.titlu} (${s.descriere})`)
      .join("\n");

    return {
      teorie: `Fisa de studiu pentru tema "${titluModul}" (Modulul ${cod}) acopera directiile si conceptele stabilite de curriculumul scolar de informatica.\n\n` +
             `In cadrul acestui modul, se aprofundeaza urmatoarele aspecte practice si teoretice:\n` +
             `${sublectiiInfo}\n\n` +
             `Retine: Un algoritm corect se bazeaza pe o structurare logica, scrierea curata a functiilor si testarea repetata a conditiilor de intrare.`,
      sintaxa: `# Sintaxa si Exemple practice specifice temei: ${titluModul}\n` +
               `# Analizeaza codul demonstrativ si ruleaza-l in sandbox\n\n` +
               `def demonstratie_concept_modul_${cod.replace(".", "_")}():\n` +
               `    # TODO: Implementeaza solutia si testeaza rezultatul\n` +
               `    mesaj = "Studiu practic finalizat cu succes pentru modulul ${cod}!"\n` +
               `    print(mesaj)\n\n` +
               `demonstratie_concept_modul_${cod.replace(".", "_")}()`,
      exercitii: [
        `Analizeaza conceptele practice discutate la pasul "${modulGăsit.sublectii[0]?.titlu || 'Recapitulare'}" si raspunde in scris la intrebarea: care sunt limitele si erorile comune in implementarea acestei structuri?`,
        `Scrie un script in Python care implementeaza elementele de la pasul "${modulGăsit.sublectii[1]?.titlu || 'Concept nou'}", adaugand comentarii explicative pentru fiecare instructiune.`,
        `Rezolva o problema algoritmica bazata pe cerintele practice si testele de la pasul "${modulGăsit.sublectii[4]?.titlu || 'Exercitii independente'}", afisand rezultatul corespunzator.`
      ]
    };
  }

  // Generare fallback
  return {
    teorie: `Aceasta fisa constituie suportul de studiu teoretic pentru modulul "${titluModul}". Contine definitii condensate, reguli de sintaxa in Python si exemple rezolvate pentru a te ajuta sa intelegi notiunile cheie conform programei scolare oficiale.`,
    sintaxa: `# Sintaxa model pentru tema: ${titluModul}\n# Scrie cod curat si comenteaza fiecare pas\nprint("Studiu finalizat pentru modulul ${cod}!")`,
    exercitii: [
      `Scrie o aplicatie Python simpla care utilizeaza conceptele descrise in modulul "${titluModul}".`,
      `Implementeaza un exemplu practic care testeaza limitele comportamentului pentru "${titluModul}".`,
      `Rezolva o problema aplicata de nivel mediu bazata pe sintaxa Python a acestui modul.`
    ]
  };
}
