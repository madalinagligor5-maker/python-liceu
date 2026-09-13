---
titlu: IA responsabilă la ora de Informatică — ghid de profesor
slug: ia-responsabila-la-ora-de-informatica
descriere: Când și cum folosești inteligența artificială ca instrument de tranziție profesională (traducere de cod, generare de exerciții, feedback) — cu riscurile fiecărei utilizări și cum le reduci.
tip: pdf
ciorna: true
---

## Ideea de bază

IA poate accelera pregătirea orelor — traduce cod, generează exemple, propune exerciții diferențiate — dar rezultatul devine material didactic abia după ce profesorul îl verifică. Riscul mare nu e că IA greșește ocazional (se întâmplă), ci că o resursă fluentă și plauzibilă poate fi totuși incorectă, prea avansată sau nepotrivită curricular, fără ca asta să fie evident la prima vedere.

## Folosiri cu risc redus, dacă verifici sintaxa, execuția și sensul algoritmic

| Scop | Ce ceri IA-ului | Ce verifici tu, obligatoriu |
|---|---|---|
| Traducere explicată (C++ → Python) | „Transformă această soluție C++ în Python. Păstrează algoritmul și explică fiecare diferență semantică/sintactică." | Rulezi ambele versiuni pe aceleași teste — o traducere aparent corectă poate avea alt comportament |
| Învățare prin contrast | „Dă-mi o versiune Python apropiată de C++ și una idiomatică. Compară avantajele." | Ambele rezolvă aceeași problemă? Varianta „elegantă" nu trebuie să ascundă conceptul didactic pe care vrei să-l predai |
| Explicarea unei erori | „Nu repara direct. Indică primul loc în care starea programului devine greșită și explică." | Confirmi prin trasare manuală/debugger — IA poate inventa cauza |
| Generare de teste | „Propune caz obișnuit, caz limită, caz advers, plus rezultatul așteptat." | Calculezi/validezi tu rezultatele așteptate — un rezultat greșit oferit ca „așteptat" e periculos |
| Exerciții gradate | „Generează 3 sarcini pe aceeași competență specifică: sprijin, autonomie, transfer." | Corespondența reală cu competența vizată — riscul e să crească doar volumul, nu complexitatea |
| Rescriere pentru elev | „Explică acest concept în română, fără jargon, apoi dă un exemplu minimal." | Corectitudinea și terminologia — o explicație fluentă poate fi imprecisă |
| Feedback pe cod | „Aplică aceste criterii asupra codului. Nu rescrie soluția; formulează 2 observații care lasă elevului munca cognitivă." | IA tinde să rezolve în locul elevului — limitează explicit promptul |

## Listă de verificare înainte de a folosi la clasă o resursă generată cu IA

- Codul rulează în mediul folosit efectiv de elevi?
- Rezultatele pentru testele date sunt corecte — le-ai calculat/verificat independent?
- Algoritmul rezolvă exact problema, nu doar exemplele date (ai adăugat cazuri-limită și contraexemple)?
- Sintaxa și facilitățile folosite sunt potrivite nivelului clasei (sau prea avansate)?
- Conținutul se leagă efectiv de competențele specifice și conținuturile din programă?
- Terminologia e în română clară și corectă?
- Resursa lasă elevului muncă de gândire, sau oferă soluția de-a gata?
- Există date personale, cod sau materiale care nu ar trebui transmise unui serviciu extern?
- Sunt respectate drepturile de autor ale surselor folosite ca bază?
- Poți explica elevului de ce accepți exact această soluție? (Dacă nu — nu o folosi până nu o înțelegi complet.)

## Dovezi, feedback, decizie — cum transformi verificarea în practică zilnică

| Miză | Ce ceri ca dovadă | Feedback concret, nu generic |
|---|---|---|
| Înțelegerea algoritmului | explicație + trasare | „Programul obține rezultatul corect aici; explică ce reprezintă variabila s după fiecare iterație." |
| Corectitudine | cod + suită de teste | „Ai testat doar valori strict pozitive; adaugă 0 și limita inferioară." |
| Depanare | jurnal de erori | „Nu rescrie tot. Identifică primul pas în care valoarea devine incorectă." |
| Eficiență | comparație a două soluții | „Ambele sunt corecte; estimează de câte ori se execută bucla pentru n = 10⁶." |
| Modularizare | diagramă + funcții | „Funcția face două lucruri deodată; separă calculul de afișare." |

## Riscul de fond, pe scurt

IA nu înțelege codul ca un om — generează pe bază de probabilitate, din tipare observate în datele de antrenare. Poate produce explicații care „sună" corect, dar sunt greșite subtil (mai ales la nivel de detaliu tehnic sau la cazuri limită). Regula practică: cu cât rezultatul urmează să fie dat direct elevilor, cu atât verificarea ta trebuie să fie mai riguroasă — pentru propria pregătire personală, riscul e mai mic; pentru un test dat clasei, e maxim.

---

*Adaptat, cu formulare proprie, după documentul oficial de orientare pentru planificarea disciplinei Informatică, clasa a IX-a (Ministerul Educației și Cercetării — Centrul Național pentru Curriculum și Evaluare), secțiunile „IA pentru profesor", „IA pentru materiale", „Verificare resurse IA" și „Dovezi-feedback-decizie".*
