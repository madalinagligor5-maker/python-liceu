import fs from "fs";
import path from "path";

const REPLACEMENTS = [
  {
    cod: "1.2",
    oldStr: "val1 = 15\nval2 = 30\n\n# Pasul 2: calcul\ntotal = ___ + ___  # Completează variabilele\nprint(\"Total:\", ___)",
    newStr: "pret_produs = 15\ntaxa_transport = 5\n\n# Pasul 2: calcul\ncost_total = pret_produs + taxa_transport  # Completează variabilele\nprint(\"Cost total:\", cost_total)",
  },
  {
    cod: "1.5",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nÎntotdeauna acordă atenție diferenței dintre operatorul de atribuire (=) și cel de egalitate (==). Folosirea greșită în condiții poate duce la erori de sintaxă sau comportament neașteptat!\n:::",
  },
  {
    cod: "1.8",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::atentie\nAsigură-te că buclele while au o condiție de oprire clară care se modifică la fiecare pas, altfel algoritmul va intra într-o buclă infinită!\n:::",
  },
  {
    cod: "1.9",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nÎn Python, primul element dintr-o listă se află la indicele 0, iar ultimul element poate fi accesat direct cu indicele negativ -1!\n:::",
  },
  {
    cod: "1.10",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nCăutarea secvențială parcurge fiecare element pe rând; dacă lista este ordonată, căutarea binară este mult mai rapidă (complexitate O(log n))!\n:::",
  },
  {
    cod: "1.11",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::atentie\nLa determinarea minimului sau maximului, inițializează variabila de sprijin cu primul element din listă (v[0]), nu cu 0 sau o valoare arbitrară!\n:::",
  },
  {
    cod: "1.12",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nBubble Sort compară și schimbă elementele adiacente la fiecare pas, în timp ce Selection Sort caută minimul din restul tabloului și îl plasează la poziția curentă!\n:::",
  },
  {
    cod: "1.13",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::atentie\nLa matrice (liste de liste), primul indice reprezintă linia, iar al doilea indice reprezintă coloana: matrice[linie][coloana]!\n:::",
  },
  {
    cod: "1.14",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nPe diagonala principală a unei matrice pătratice n x n avem i == j, iar pe diagonala secundară i + j == n - 1!\n:::",
  },
  {
    cod: "1.15",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nÎn Python șirurile de caractere sunt imutabile. Orice metodă de tipul .upper() sau .replace() returnează un șir nou fără a modifica șirul original!\n:::",
  },
  {
    cod: "1.16",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nMetoda .find() returnează -1 dacă subșirul nu este găsit, spre deosebire de .index() care aruncă o eroare ValueError!\n:::",
  },
  {
    cod: "1.17",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nMetoda .split() fără parametri împarte textul după orice spațiu alb (spații, tab-uri, newline) și elimină spațiile libere multiple automat!\n:::",
  },
  {
    cod: "1.18",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::atentie\nO funcție oprește executarea imediat ce întâlnește instrucțiunea return. Codul scris după return în același bloc nu va fi executat niciodată!\n:::",
  },
  {
    cod: "1.19",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nÎn Python, obiectele mutabile (cum sunt listele) transmise ca parametri la funcții pot fi modificate direct în interiorul funcției!\n:::",
  },
  {
    cod: "1.20",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::atentie\nModificarea unei variabile globale în interiorul unei funcții necesită cuvântul cheie global; altfel, Python va crea o variabilă locală nouă cu același nume!\n:::",
  },
  {
    cod: "2.1",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::atentie\nFiecare funcție recursivă trebuie să aibă cel puțin un caz de bază (condiție de oprire) bine definit, altfel va rezulta o eroare de tip RecursionError (stack overflow)!\n:::",
  },
  {
    cod: "2.2",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nLa calculul recursiv al șirului Fibonacci sau factorialului, verifică valorile de intrare pentru n <= 0 pentru a preveni apeluri infinite!\n:::",
  },
  {
    cod: "2.3",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nTehnica Divide et Impera împarte problema în subprobleme independente de dimensiune mai mică, le rezolvă recursiv și combină rezultatele!\n:::",
  },
  {
    cod: "2.4",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::atentie\nCăutarea binară funcționează EXCLUSIV pe tablouri deja sortate. Asigură-te că lista este ordonată înainte de apelul funcției!\n:::",
  },
  {
    cod: "2.5",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nMergeSort garantează o complexitate de O(n log n) în toate cazurile, dar folosește memorie suplimentară pentru interclasare!\n:::",
  },
  {
    cod: "2.11",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nFolosește blocul with open(...) as f: pentru a lucra cu fișiere — garantează închiderea automată a fișierului chiar dacă apar erori!\n:::",
  },
  {
    cod: "2.12",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::atentie\nMetoda f.readline() include caracterul de linie nouă '\\n' la finalul fiecărei linii. Folosește .strip() pentru a-l elimina!\n:::",
  },
  {
    cod: "2.13",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nCheile dintr-un dicționar Python trebuie să fie de tip imutabil (str, int, tuple) și sunt unice. Accesarea unei chei inexistente aruncă KeyError — folosește .get(cheie)!\n:::",
  },
  {
    cod: "2.14",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nSeturile (set) stochează doar elemente unice și neordonate, oferind operații rapide O(1) de verificare a apartenenței cu operatorul in!\n:::",
  },
  {
    cod: "2.15",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nO stivă respectă principiul LIFO (Last In First Out), iar o coadă respectă FIFO (First In First Out). În Python le poți implementa eficient folosind collections.deque!\n:::",
  },
  {
    cod: "2.16",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::atentie\nÎnainte de a extrage un element dintr-o stivă sau coadă (pop/popleft), verifică întotdeauna dacă structura nu este goală!\n:::",
  },
  {
    cod: "2.17",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nÎn listele simplu înlănțuite, fiecare nod conține valoarea și o referință (next) către nodul următor. Ultimul nod indică spre None!\n:::",
  },
  {
    cod: "2.18",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nUn graf neorientat cu N noduri poate fi reprezentat prin matrice de adiacență de dimensiune N x N sau prin liste de adiacență (dicționar de liste)!\n:::",
  },
  {
    cod: "2.19",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::atentie\nPăstrează un set de noduri vizitate la parcurgerea grafurilor pentru a evita buclele infinite pe componente conexe sau cicluri!\n:::",
  },
  {
    cod: "2.20",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nUn arbore binar are pentru fiecare nod cel mult doi fii (stânga și dreapta). Rădăcina este singurul nod fără părinte!\n:::",
  },
  {
    cod: "2.21",
    generic: "Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.",
    replacement: ":::tip\nParcurgerea în Inordine (stânga, rădăcină, dreapta) a unui Arbore Binar de Căutare (BST) vizitează nodurile în ordine strict crescătoare!\n:::",
  },
];

const contentDir = path.join(process.cwd(), "content");
const files = fs.readdirSync(contentDir).filter((f) => f.startsWith("lectii_") && f.endsWith(".md"));

for (const file of files) {
  const filePath = path.join(contentDir, file);
  let content = fs.readFileSync(filePath, "utf-8");

  const modulBlocks = content.split(/^# Modulul /m);
  let modified = false;

  for (let i = 1; i < modulBlocks.length; i++) {
    const block = modulBlocks[i];
    const codMatch = block.match(/^(\d+\.\d+|P\d+\.\d+|P7\.1)/);
    if (!codMatch) continue;

    const codModul = codMatch[1];
    const rep = REPLACEMENTS.find((r) => r.cod === codModul);

    if (rep) {
      if (rep.oldStr && block.includes(rep.oldStr)) {
        modulBlocks[i] = block.replace(rep.oldStr, rep.newStr);
        modified = true;
      }
      if (rep.generic && block.includes(rep.generic)) {
        // Înlocuim :::tip ... ::: sau linia directă
        const regexTip = /:::(tip|exemplu|atentie)\s*\nVerifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod\.\s*\n:::/g;
        if (regexTip.test(modulBlocks[i])) {
          modulBlocks[i] = modulBlocks[i].replace(regexTip, rep.replacement);
        } else {
          modulBlocks[i] = modulBlocks[i].replace("Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.", rep.replacement);
        }
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, modulBlocks.join("# Modulul "), "utf-8");
    console.log(`✅ Modificat conținut didactic în ${file}`);
  }
}
