---
titlu: Instrucțiunea if în Python: if, elif, else explicate cu exemple
titlu_seo: If, elif, else în Python, cu exemple
slug: if-elif-else-in-python
data: 2026-10-12
descriere: Cum iei decizii în Python cu if, elif și else: operatori de comparație, and/or/not, indentare, exemple rezolvate și greșeli frecvente.
---

Instrucțiunea `if` îi permite programului să **aleagă** ce face, în funcție de o condiție. Dacă condiția e adevărată, se execută blocul de sub `if`; altfel, se trece la `elif` sau `else`. Mai jos vezi sintaxa exactă, operatorii de comparație și exemple rezolvate, cu rezultatul afișat.

## Sintaxa de bază

```python
temperatura = 30

if temperatura > 25:
    print("E cald afară.")
    print("Ia o sticlă cu apă.")

print("Program terminat.")
```

Rezultatul:

```text
E cald afară.
Ia o sticlă cu apă.
Program terminat.
```

Trei reguli contează aici:

- linia cu `if` se termină cu **două puncte** `:`;
- instrucțiunile care depind de condiție sunt **retrase** (indentate), de obicei cu 4 spații;
- linia `print("Program terminat.")` nu mai e retrasă, deci se execută oricum.

Dacă schimbi `temperatura = 20`, programul afișează doar `Program terminat.`.

## if și else: două ramuri

```python
numar = 7

if numar % 2 == 0:
    print(numar, "este par")
else:
    print(numar, "este impar")
```

Programul afișează `7 este impar`. Operatorul `%` dă restul împărțirii: un număr e par când restul împărțirii la 2 este 0.

## elif: mai multe variante

Când ai mai mult de două situații, folosești `elif` (prescurtare de la „else if”). Python verifică condițiile **în ordine** și execută doar prima ramură adevărată.

```python
media = 8.40

if media >= 9:
    print("Foarte bine")
elif media >= 7:
    print("Bine")
elif media >= 5:
    print("Suficient")
else:
    print("Insuficient")
```

Programul afișează `Bine`. Deși și condiția `media >= 5` este adevărată, Python nu mai ajunge la ea: s-a oprit la prima ramură adevărată.

## Operatorii de comparație

| Operator | Înseamnă | Exemplu adevărat |
| --- | --- | --- |
| `==` | egal | `5 == 5` |
| `!=` | diferit | `5 != 3` |
| `>` | mai mare | `7 > 2` |
| `<` | mai mic | `2 < 7` |
| `>=` | mai mare sau egal | `5 >= 5` |
| `<=` | mai mic sau egal | `4 <= 5` |

Atenție la diferența dintre `=` (atribuire) și `==` (comparație). `if nota = 10:` produce o eroare de sintaxă; forma corectă este `if nota == 10:`.

## Condiții compuse: and, or, not

```python
varsta = 16
are_bilet = True

if varsta >= 14 and are_bilet:
    print("Poți intra la film.")

zi = "sâmbătă"
if zi == "sâmbătă" or zi == "duminică":
    print("Este weekend.")

ploua = False
if not ploua:
    print("Mergem în parc.")
```

Toate cele trei mesaje sunt afișate:

- `and` e adevărat doar dacă **ambele** condiții sunt adevărate;
- `or` e adevărat dacă **cel puțin una** e adevărată;
- `not` inversează valoarea unei condiții.

Python permite și comparații înlănțuite, foarte utile pentru intervale: `if 1 <= nota <= 10:` verifică dacă nota e între 1 și 10, inclusiv.

## Exemplu rezolvat: cel mai mare dintre trei numere

```python
a = 12
b = 45
c = 30

maxim = a
if b > maxim:
    maxim = b
if c > maxim:
    maxim = c

print("Cel mai mare număr este", maxim)
```

Rezultatul: `Cel mai mare număr este 45`. Ideea: pornești cu primul număr ca „maxim provizoriu” și îl înlocuiești de fiecare dată când găsești unul mai mare. Același tipar îl vei folosi mai târziu pentru liste întregi.

Testează programul și cu alte date, pentru care știi răspunsul: `a, b, c = 5, 5, 5` (așteptat 5) și `a, b, c = -3, -1, -7` (așteptat -1).

## Greșeli frecvente

- **Lipsesc cele două puncte** după condiție: `if x > 5` → `SyntaxError`.
- **Indentare inconsecventă**: amesteci 2 și 4 spații sau taburi cu spații → `IndentationError`.
- **Ordinea greșită a condițiilor la elif**: dacă scrii întâi `media >= 5`, toate mediile peste 5 primesc „Suficient”. Pune condițiile cele mai stricte primele.
- **Compari text cu număr**: `input()` întoarce text, deci `if input("Vârsta: ") >= 18:` dă eroare. Convertește: `int(input("Vârsta: "))`.

Dacă primești un mesaj de eroare pe care nu-l înțelegi, vezi [ghidul erorilor frecvente în Python](/blog/erori-frecvente-python).

## Exercițiu: încearcă singur

Scrie un program care primește un an și afișează dacă e bisect. Regula: un an e bisect dacă se împarte la 4, dar nu la 100 — cu excepția anilor care se împart la 400. Teste: 2024 → bisect, 1900 → nu e bisect, 2000 → bisect, 2026 → nu e bisect.

Rulează-ți soluția în [laboratorul Python](/lab). Deciziile sunt explicate pas cu pas, cu exerciții verificate automat, în modulul gratuit [De la Scratch la Python: secvențial și alternativ](/curriculum/VII/de-la-scratch-la-python-secvential-si-alternativ) și, pentru copii, în lecția [Condiții: if, elif, else](/curriculum/P10/conditii-if-elif-else-deciziile-programului).

## Întrebări frecvente

### Care e diferența dintre elif și mai multe if-uri separate?

La un șir `if` / `elif`, Python execută doar prima ramură adevărată și le sare pe celelalte. La mai multe `if`-uri separate, fiecare condiție este verificată independent, deci se pot executa mai multe blocuri.

### Este obligatoriu să am else?

Nu. `else` e opțional și îl folosești doar când vrei să faci ceva și în cazul în care nicio condiție nu e adevărată.

### Câte spații trebuie la indentare în Python?

Convenția recomandată este de 4 spații. Important este să folosești același număr de spații pentru toate liniile din același bloc și să nu amesteci spații cu taburi.

### Pot pune un if în interiorul altui if?

Da, se numește if imbricat. Deseori însă codul devine mai clar dacă îmbini condițiile cu `and` sau folosești `elif`.
