---
titlu: Liste în Python: ghid complet pentru elevi, cu exemple și exerciții
titlu_seo: Liste în Python: ghid cu exemple
slug: liste-in-python
data: 2026-10-12
descriere: Listele în Python explicate simplu: creare, indexare, slicing, append, remove, sortare, sum, min, max și greșeli frecvente. Cu exemple rulabile.
---

O **listă** în Python păstrează mai multe valori, în ordine, într-o singură variabilă. O scrii între paranteze drepte, cu elementele separate prin virgulă: `note = [9, 7, 10]`. Listele se pot modifica — adaugi, ștergi, sortezi — și sunt una dintre cele mai folosite structuri de date în programele elevilor. Mai jos găsești operațiile esențiale, cu rezultatul afișat.

## Crearea unei liste

```python
note = [9, 7, 10, 8]
orase = ["Iași", "Cluj", "Timișoara"]
goala = []

print(note)
print(len(orase))
```

Rezultatul:

```text
[9, 7, 10, 8]
3
```

Funcția `len()` întoarce numărul de elemente.

## Indexarea: cum accesezi un element

Pozițiile (indicii) încep de la **0**. Indicii negativi numără de la final.

```python
note = [9, 7, 10, 8]
print(note[0])
print(note[2])
print(note[-1])
```

Rezultatul:

```text
9
10
8
```

Ultimul element are indicele `len(note) - 1`, adică 3. Dacă ceri `note[4]`, Python oprește programul cu `IndexError: list index out of range`.

## Slicing: o bucată din listă

```python
numere = [10, 20, 30, 40, 50]
print(numere[1:4])
print(numere[:2])
print(numere[::-1])
```

Rezultatul:

```text
[20, 30, 40]
[10, 20]
[50, 40, 30, 20, 10]
```

Ca la `range()`, poziția de final nu este inclusă: `numere[1:4]` ia elementele de pe pozițiile 1, 2 și 3.

## Modificarea unei liste

| Operație | Ce face | Exemplu |
| --- | --- | --- |
| `append(x)` | adaugă la final | `note.append(6)` |
| `insert(i, x)` | inserează pe poziția i | `note.insert(0, 5)` |
| `remove(x)` | șterge prima apariție a lui x | `note.remove(7)` |
| `pop()` | scoate și întoarce ultimul element | `ultima = note.pop()` |
| `lista[i] = x` | înlocuiește elementul de pe poziția i | `note[1] = 8` |

```python
cumparaturi = ["pâine", "lapte"]
cumparaturi.append("mere")
cumparaturi.insert(0, "ouă")
cumparaturi.remove("lapte")
print(cumparaturi)
```

Rezultatul: `['ouă', 'pâine', 'mere']`.

## Funcții utile: sum, min, max, sorted

```python
note = [9, 7, 10, 8, 6]
print(sum(note))
print(min(note), max(note))
print(round(sum(note) / len(note), 2))
print(sorted(note))
print(note)
```

Rezultatul:

```text
40
6 10
8.0
[6, 7, 8, 9, 10]
[9, 7, 10, 8, 6]
```

Observă diferența: `sorted(note)` întoarce o listă **nouă**, sortată, și lasă lista inițială neschimbată. Metoda `note.sort()` sortează chiar lista inițială și nu întoarce nimic. Pentru ordine descrescătoare: `sorted(note, reverse=True)`.

## Parcurgerea unei liste

```python
note = [9, 7, 10]

for nota in note:
    print(nota)

for i in range(len(note)):
    print("Poziția", i, "->", note[i])
```

Prima formă e mai simplă când ai nevoie doar de valori. A doua e utilă când ai nevoie și de poziție. Despre bucle afli mai multe în [ghidul despre for și range()](/blog/bucla-for-si-range-in-python).

## Căutarea unui element

```python
elevi = ["Ana", "Mihai", "Ioana"]
print("Mihai" in elevi)
print(elevi.index("Ioana"))
print(elevi.count("Ana"))
```

Rezultatul: `True`, apoi `2`, apoi `1`. Operatorul `in` răspunde cu `True` sau `False`, iar `index()` dă poziția primei apariții (și produce eroare dacă elementul nu există).

## Exemplu rezolvat: câte note sunt peste medie

```python
note = [9, 7, 10, 8, 6]
media = sum(note) / len(note)

peste_medie = 0
for nota in note:
    if nota > media:
        peste_medie += 1

print("Media:", media)
print("Note peste medie:", peste_medie)
```

Rezultatul: `Media: 8.0`, apoi `Note peste medie: 2` (notele 9 și 10). Exemplul combină trei idei: o funcție predefinită, o buclă și o condiție.

## Greșeli frecvente

- **Uiți că indicii încep de la 0.** Primul element este `lista[0]`, nu `lista[1]`.
- **Folosești `lista = lista.sort()`.** `sort()` întoarce `None`, deci pierzi lista. Scrie doar `lista.sort()` sau `lista = sorted(lista)`.
- **Copiezi o listă cu `=`.** `b = a` nu face o copie: ambele nume arată spre aceeași listă. Pentru copie folosește `b = a.copy()` sau `b = a[:]`.
- **Ștergi elemente în timp ce parcurgi lista.** Unele elemente pot fi sărite. Construiește mai bine o listă nouă cu elementele pe care le păstrezi.

## Exercițiu: încearcă singur

Pornind de la lista `temperaturi = [21, 25, 19, 30, 27, 18]`, afișează temperatura maximă, minimă și câte zile au avut peste 20 de grade. Rezultate așteptate: `30`, `18` și `4`.

Rulează soluția în [laboratorul Python](/lab). Lucrul cu șiruri de valori e explicat pas cu pas, gratuit, în modulele de gimnaziu [Șiruri de valori: identificare și generare](/curriculum/VIII/siruri-de-valori-identificare-si-generare) și [Algoritmi de prelucrare a șirurilor de valori](/curriculum/VIII/algoritmi-de-prelucrare-a-sirurilor-de-valori).

## Întrebări frecvente

### Ce poate conține o listă în Python?

Orice tip de valori: numere, text, valori logice și chiar alte liste. Pot fi amestecate în aceeași listă, deși de obicei e mai clar să păstrezi valori de același fel.

### Care e diferența dintre listă și tuplu?

Lista se poate modifica după ce a fost creată, iar tuplul nu. Lista se scrie cu paranteze drepte `[1, 2]`, tuplul cu paranteze rotunde `(1, 2)`.

### Cum aflu câte elemente are o listă?

Cu funcția `len()`. De exemplu, `len([9, 7, 10])` întoarce 3.

### Cum calculez media elementelor dintr-o listă?

Împarți suma la numărul de elemente: `sum(lista) / len(lista)`. Dacă lista e goală, împărțirea produce eroare, așa că verifică întâi că `len(lista) > 0`.
