---
titlu: Tranziția de la alte limbaje la Python — ghid de profesor
slug: tranzitie-cpp-python-ghid-profesor
descriere: Pentru profesorii veniți din C++ — un traseu de familiarizare cu Python, un tabel de echivalențe rapide și reperul central pentru clasă — nu reînvățăm algoritmica, doar schimbăm forma de exprimare.
tip: pdf
ciorna: true
---

## Ideea centrală

Programa 2026-2027 trece disciplina Informatică pe Python ca limbaj de programare obligatoriu, acolo unde mulți profesori (și mulți elevi, veniți din gimnaziu) au experiență solidă în C++. Reperul de reținut: **algoritmica rămâne aceeași** — se schimbă doar sintaxa și câteva convenții. Un profesor cu experiență în C++ nu pornește de la zero, ci face un transfer de cunoștințe deja solide.

## Tabel de echivalențe rapide

| Ce vreau să fac | C++ | Python | Capcană frecventă |
|---|---|---|---|
| Citesc un întreg și un real | `cin >> n >> x;` | `n = int(input())`<br>`x = float(input())` | `input()` întoarce mereu text — conversia trebuie făcută explicit |
| Condiție compusă | `if (x>=0 && x<10) k++;` | `if x >= 0 and x < 10:`<br>`    k += 1` | indentarea Python înlocuiește acoladele — e parte din sintaxă, nu opțională |
| Buclă cu contor 0..n-1 | `for(int i=0;i<n;i++)` | `for i in range(n):` | `range(n)` nu include n — capătul e exclus |
| Buclă cu contor 1..n | — | `for i in range(1, n+1):` | ușor de uitat +1 la capăt |
| Funcție cu rezultat | `int cmmdc(int a,int b){...}` | `def cmmdc(a, b):`<br>`    ...`<br>`    return a` | Python nu declară tipul parametrilor/rezultatului |

## Primele ore ale profesorului cu Python — un traseu realist

Nu e nevoie de un curs întreg de Python înainte de a preda — un traseu scurt, de familiarizare autonomă, e suficient pentru a intra în clasă cu încredere:

1. **Intrare/ieșire, tipuri, atribuiri** — rescrie 5 programe scurte C++ în Python, notând fiecare conversie.
2. **Condiții și operatori logici** — rescrie probleme cu `if`/`elif`/`else`, fără traducere mecanică a lui `&&`/`||`.
3. **Bucle (`for`, `range`, `while`)** — rescrie 3-4 algoritmi cunoscuți cu repetare, cu atenție la intervalul produs de `range`.
4. **Funcții** — transformă un program monolitic în 2-3 funcții, cu parametri și `return` clari.
5. **Liste** — citire, indexare, `append`, parcurgere.
6. **Metode de listă și copiere** — `sort`, `copy`, slicing — unde modifici lista originală și unde nu.
7. **Fișiere text** — `open`/`read`/`write`, ideal cu `with`.
8. **Depanare** — provoacă-ți singur erori de sintaxă, logică și executare, ca să recunoști rapid tiparul.
9. **Algoritmi cunoscuți** — Euclid, prelucrarea cifrelor, sortare, liste de frecvențe — aceiași algoritmi din C++, acum în Python.
10. **Prima secvență didactică** — proiectează 50 de minute de oră: intenție → sarcină → dovadă → feedback.

## Cum ții diagnoza limbajului separată de diagnoza algoritmului

O capcană frecventă: un elev care stăpânește bine algoritmul, dar se împiedică de sintaxa Python, riscă să fie evaluat ca și cum n-ar înțelege problema. Separă explicit cele două lucruri:
- Cere mai întâi explicația în limbaj natural sau pseudocod (aici verifici algoritmica).
- Abia apoi cere implementarea în Python (aici verifici sintaxa).
- Dacă elevul poate explica algoritmul dar greșește sintaxa, tratează asta ca pe o problemă de transfer, nu de înțelegere — și invers.

## Ce rămâne valabil din experiența cu C++

- Baza algoritmică din concursuri/probleme rămâne complet utilă — Euclid, divizibilitate, sortări, parcurgeri rămân aceiași algoritmi.
- Competențele de proiectare (analiză → proiectare → implementare → testare) sunt independente de limbaj.
- Ce se schimbă e mai ales **vizibilitatea** procesului: în programa nouă contează explicit alegerea structurii, testarea și eficiența soluției, nu doar rezultatul final corect.

---

*Adaptat, cu formulare proprie, după Repere metodologice — Informatică, clasa a IX-a, curriculum de specialitate, 2026-2027 (Ministerul Educației și Cercetării — Centrul Național pentru Curriculum și Evaluare), document oficial de sprijin metodologic, nu manual comercial.*
