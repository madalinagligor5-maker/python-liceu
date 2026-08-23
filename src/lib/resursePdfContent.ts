export type FisaPdfContent = {
  teorie: string;
  sintaxa: string;
  exercitii: string[];
};

const BAZA_PDF: Record<string, FisaPdfContent> = {
  "1.1": {
    teorie: "Un algoritm reprezintă o succesiune logică de pași pentru rezolvarea unei probleme. În Python, scriem cod format din instrucțiuni executate în ordine de sus în jos. Orice program are o etapă de analiză (ce date avem?), proiectare (cum le prelucrăm?), implementare (scrierea codului) și testare (rularea cu diverse date de intrare).",
    sintaxa: "# Declarare variabile și afișare\nnume = 'Elev'\nvarsta = 16\nprint('Numele meu este:', nume)\nprint('Vârsta:', varsta)",
    exercitii: [
      "Scrie un program care afișează numele tău și clasa în care ești pe două rânduri diferite.",
      "Calculează aria unui pătrat cu latura de 12 cm. Afișează rezultatul cu un mesaj potrivit.",
      "Declară două variabile cu numere întregi și afișează suma, diferența și produsul lor."
    ]
  },
  "1.2": {
    teorie: "Structura de decizie (if-else) îi permite programului să aleagă între două sau mai multe căi de execuție, în funcție de o condiție logică. În Python, blocul de cod care se execută dacă condiția este adevărată se termină obligatoriu cu două puncte (:), iar liniile următoare trebuie să fie indentate (deplasate spre dreapta cu 4 spații).",
    sintaxa: "# Verificare număr\nnr = 15\nif nr > 10:\n    print('Numărul este mai mare decât 10')\nelse:\n    print('Numărul este mic')",
    exercitii: [
      "Scrie un program care verifică dacă o notă introdusă este mai mare sau egală cu 5 și afișează 'Trecut' sau 'Respins'.",
      "Declară două variabile, x și y. Afișează-o pe cea mai mare dintre ele în consolă.",
      "Verifică dacă un număr întreg este pozitiv, negativ sau egal cu zero (folosește if, elif și else)."
    ]
  },
  "1.3": {
    teorie: "Eficiența unui algoritm se măsoară în funcție de resursele consumate: timpul de rulare (complexitate de timp) și memoria utilizată (complexitate de spațiu). Folosim notația Big O (ex: O(1), O(n), O(n²)) pentru a exprima cum crește timpul de execuție în raport cu volumul datelor de intrare (n).",
    sintaxa: "# Eficiență O(1) versus O(n)\ndef primul_element(lista):\n    return lista[0]  # O(1) - timp constant\n\ndef afiseaza_tot(lista):\n    for x in lista:\n        print(x)  # O(n) - timp liniar",
    exercitii: [
      "Care este complexitatea de timp (în notație Big O) a unui algoritm care caută secvențial un element într-o listă nesortată de n elemente?",
      "Dacă un algoritm are o complexitate de tip O(n²), de câte ori va crește timpul de execuție când dublăm cantitatea datelor de intrare?",
      "Explică diferența fundamentală de performanță dintre un algoritm O(1) și un algoritm O(n) pe seturi mari de date."
    ]
  },
  "1.4": {
    teorie: "Functiile (subprogramele) reprezintă blocuri de cod reutilizabile, create pentru a realiza o acțiune specifică. Ele ne permit să nu duplicăm codul. O funcție se definește prin cuvântul cheie `def`, urmat de nume și paranteze. Ea poate primi argumente și poate întoarce o valoare folosind instrucțiunea `return`.",
    sintaxa: "# Definire funcție de adunare\ndef aduna(a, b):\n    return a + b\n\nrezultat = aduna(10, 5)\nprint(rezultat)  # Afișează 15",
    exercitii: [
      "Definește o funcție `perimetru_dreptunghi(L, l)` care returnează perimetrul unui dreptunghi.",
      "Scrie o funcție `este_par(n)` care returnează True dacă n este par și False în caz contrar.",
      "Creează o funcție `salut(nume)` care afișează textul 'Salut, [nume]!' în consolă."
    ]
  },
  "1.5": {
    teorie: "Domeniul de vizibilitate (scope) al unei variabile determină unde poate fi accesată aceasta. O variabilă definită în interiorul unei funcții este locală și există doar în timpul rulării acelei funcții. O variabilă definită în corpul principal este globală și poate fi citită de oriunde. Modificarea unei variabile globale în interiorul unei funcții necesită utilizarea cuvântului cheie 'global'.",
    sintaxa: "# Domeniu de vizibilitate (Scope)\nx = 10  # Variabilă globală\n\ndef test_scope():\n    y = 5  # Variabilă locală\n    print('Valoare locală:', y)\n    print('Valoare globală citită:', x)\n\ntest_scope()",
    exercitii: [
      "Scrie o funcție care încearcă să modifice o variabilă globală fără a utiliza cuvântul cheie `global` și observă rezultatul. Explică fenomenul.",
      "Creează o funcție `calculeaza_reducere(pret, procent)` ce folosește parametri și returnează prețul final redus.",
      "Analizează codul următor și explică ce se va afișa: a = 3; def f(): a = 7; f(); print(a)."
    ]
  },
  "2.1": {
    teorie: "Căutarea binară este un algoritm extrem de eficient pentru găsirea unui element într-o listă sortată. În loc să verificăm elementele unul câte unul, comparăm valoarea căutată cu mijlocul intervalului. La fiecare pas, înjumătățim spațiul de căutare, obținând o complexitate de O(log n).",
    sintaxa: "# Căutare binară iterativă\ndef cauta(lista, x):\n    st = 0\n    dr = len(lista) - 1\n    while st <= dr:\n        mj = (st + dr) // 2\n        if lista[mj] == x: return mj\n        elif lista[mj] < x: st = mj + 1\n        else: dr = mj - 1\n    return -1",
    exercitii: [
      "Simulează pe foaie căutarea binară a numărului 35 în lista [5, 12, 18, 25, 35, 42, 50]. Scrie indicii stânga, dreapta și mijloc la fiecare pas.",
      "Explică de ce căutarea binară nu poate fi aplicată direct pe o listă nesortată.",
      "Modifică algoritmul pentru a returna True dacă elementul există și False dacă nu există."
    ]
  },
  "2.17": {
    teorie: "Recursivitatea reprezintă tehnica prin care o funcție se apelează pe ea însăși pentru a rezolva subprobleme mai mici. Orice algoritm recursiv trebuie să aibă un caz de bază (condiția de oprire, care nu mai face apel recursiv) și un pas recursiv (care simplifică problema și tinde spre cazul de bază). Fără caz de bază, programul intră în buclă infinită.",
    sintaxa: "# Calculează factorialul unui număr recursiv\ndef factorial(n):\n    if n <= 1:\n        return 1  # Cazul de bază\n    return n * factorial(n - 1)  # Pasul recursiv",
    exercitii: [
      "Scrie o funcție recursivă `suma_n(n)` care returnează suma primelor n numere naturale.",
      "Implementează recursiv algoritmul pentru a calcula al n-lea termen din șirul lui Fibonacci.",
      "Explică ce este eroarea 'RecursionError: maximum recursion depth exceeded' și din ce cauză apare."
    ]
  },
  "2.19": {
    teorie: "Quicksort (Sortarea Rapidă) este un algoritm de sortare bazat pe tehnica Divide et Impera. Se alege un element numit 'pivot', se partitionează lista astfel încât elementele mai mici decât pivotul să fie în stânga, iar cele mai mari în dreapta, apoi se sortează recursiv cele două subliste. Complexitatea medie este O(n log n).",
    sintaxa: "# Implementare simplă Quicksort\ndef quicksort(arr):\n    if len(arr) <= 1: return arr\n    pivot = arr[0]\n    st = [x for x in arr[1:] if x <= pivot]\n    dr = [x for x in arr[1:] if x > pivot]\n    return quicksort(st) + [pivot] + quicksort(dr)",
    exercitii: [
      "Simulează sortarea rapidă pentru lista [8, 4, 3, 9, 1, 5] folosind ca pivot primul element. Arată pașii de partiționare.",
      "Care este cazul cel mai nefavorabil (worst-case) pentru Quicksort și ce complexitate are în acest caz?",
      "Modifică algoritmul quicksort pentru a sorta lista în ordine descrescătoare."
    ]
  }
};

/**
 * Returnează fișa teoretică și exercițiile pentru PDF.
 * Dacă modulul nu este definit în baza dedicată, generează dinamic o fișă potrivită.
 */
export function obtineFisaPdfContent(
  cod: string,
  titluModul: string
): FisaPdfContent {
  const predefinit = BAZA_PDF[cod];
  if (predefinit) {
    return predefinit;
  }

  // Generare dinamică standard cu conținut alternativ coerent
  return {
    teorie: `Această fișă constituie suportul de studiu teoretic pentru modulul "${titluModul}". Conține definiții condensate, reguli de sintaxă în Python și exemple rezolvate pentru a te ajuta să înțelegi noțiunile cheie conform programei școlare oficiale.`,
    sintaxa: `# Sintaxă model pentru tema: ${titluModul}\n# Scrie cod curat și comentează fiecare pas\nprint("Studiu finalizat pentru modulul ${cod}!")`,
    exercitii: [
      `Scrie o aplicație Python simplă care utilizează conceptele descrise în modulul "${titluModul}".`,
      `Explică, în 3-4 rânduri, utilitatea practică a temei "${titluModul}" în viața de zi cu zi sau în industrie.`,
      `Modifică exemplul de cod prezentat în această fișă pentru a procesa un set diferit de date de intrare.`
    ]
  };
}
