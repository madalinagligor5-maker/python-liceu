---
titlu: Bucla for și range() în Python, explicate pe înțelesul elevilor
titlu_seo: Bucla for și range() în Python
slug: bucla-for-si-range-in-python
data: 2026-10-12
descriere: Bucla for și range() în Python explicate simplu: start, stop, pas, sume, contoare, parcurgerea textului și a listelor, for vs. while.
---

Bucla `for` repetă aceleași instrucțiuni pentru fiecare valoare dintr-o secvență. Cel mai des o folosești împreună cu `range()`, care generează numere. De exemplu, `for i in range(5):` execută blocul de 5 ori, cu `i` luând pe rând valorile 0, 1, 2, 3 și 4. Mai jos găsești toate formele lui `range()`, tiparele cele mai folosite și greșelile care apar des.

## Prima buclă for

```python
for i in range(3):
    print("Salut!")
```

Rezultatul:

```text
Salut!
Salut!
Salut!
```

Ca la `if`, linia cu `for` se termină cu `:`, iar instrucțiunile repetate sunt retrase cu 4 spații.

## Cum funcționează range()

`range()` are trei forme. Cel mai important detaliu: **valoarea de oprire nu este inclusă**.

| Formă | Numere generate | Explicație |
| --- | --- | --- |
| `range(5)` | 0, 1, 2, 3, 4 | de la 0 până la 5, fără 5 |
| `range(1, 6)` | 1, 2, 3, 4, 5 | de la 1 până la 6, fără 6 |
| `range(0, 10, 2)` | 0, 2, 4, 6, 8 | din 2 în 2 |
| `range(10, 0, -1)` | 10, 9, …, 1 | descrescător |

Poți vedea numerele generate transformându-le într-o listă:

```python
print(list(range(1, 6)))
print(list(range(10, 0, -3)))
```

Rezultatul:

```text
[1, 2, 3, 4, 5]
[10, 7, 4, 1]
```

## Tiparul „sumă”: adunarea mai multor valori

Una dintre cele mai folosite idei: pornești cu o variabilă egală cu 0 și adaugi la ea, la fiecare pas.

```python
suma = 0
for i in range(1, 101):
    suma = suma + i
print("Suma numerelor de la 1 la 100 este", suma)
```

Programul afișează `Suma numerelor de la 1 la 100 este 5050`. Poți verifica rezultatul cu formula lui Gauss: n·(n+1)/2 = 100·101/2 = 5050.

## Tiparul „contor”: câte valori îndeplinesc o condiție

```python
contor = 0
for numar in range(1, 51):
    if numar % 7 == 0:
        contor += 1
print("Între 1 și 50 sunt", contor, "multipli de 7")
```

Rezultatul: `Între 1 și 50 sunt 7 multipli de 7` (7, 14, 21, 28, 35, 42, 49).

## Tabla înmulțirii

```python
n = 6
for i in range(1, 11):
    print(n, "x", i, "=", n * i)
```

Programul afișează zece rânduri, de la `6 x 1 = 6` până la `6 x 10 = 60`.

## for parcurge și text sau liste, nu doar numere

```python
for litera in "Python":
    print(litera)

note = [9, 7, 10]
for nota in note:
    print("Nota:", nota)
```

Primul `for` afișează pe rând literele P, y, t, h, o, n. Al doilea afișează fiecare notă. Despre liste afli mai multe în [ghidul despre liste în Python](/blog/liste-in-python).

## for sau while?

- Folosești **`for`** când știi dinainte câte repetări sunt sau ce secvență parcurgi.
- Folosești **`while`** când repeți **până când** se întâmplă ceva și nu știi dinainte de câte ori.

```python
numar = 1
while numar < 100:
    numar = numar * 2
print(numar)
```

Programul afișează `128`, prima putere a lui 2 mai mare sau egală cu 100. Atenție: dacă uiți să modifici variabila din condiție, bucla `while` nu se mai oprește. În editorul de pe Academia Python, o astfel de buclă e oprită automat după câteva secunde și poți apăsa oricând „Oprește”.

## Greșeli frecvente

- **Te aștepți ca range(1, 10) să includă 10.** Nu îl include. Pentru 1…10 scrii `range(1, 11)`.
- **Inițializezi suma în interiorul buclei.** `suma = 0` trebuie pus **înainte** de `for`; altfel se resetează la fiecare pas.
- **Afișezi rezultatul în interiorul buclei**, când voiai doar rezultatul final: verifică indentarea liniei cu `print`.
- **Modifici lista pe care o parcurgi.** Poate duce la elemente sărite. Construiește mai bine o listă nouă.

## Exercițiu: încearcă singur

Scrie un program care afișează suma numerelor pare de la 1 la 20. Rezultatul așteptat: `110`. Apoi modifică programul să afișeze suma numerelor impare din același interval (rezultat așteptat: `100`).

Rulează-ți codul în [laboratorul Python](/lab). Structura repetitivă e explicată pas cu pas, cu exerciții verificate automat, în modulul gratuit [Structura repetitivă și combinarea structurilor](/curriculum/VII/structura-repetitiva-si-combinarea-structurilor). Copiii o pot exersa desenând, în lecția [Bucla for: repetăm acțiuni cu turtle](/curriculum/P9/bucla-for-repetam-actiuni-cu-turtle).

## Întrebări frecvente

### De ce range(5) începe de la 0?

Așa e definit în Python: dacă dai o singură valoare, numărătoarea pornește de la 0 și se oprește înainte de valoarea dată. Începutul de la 0 se potrivește cu felul în care sunt numerotate pozițiile în liste.

### Cum parcurg numerele în ordine descrescătoare?

Folosești un pas negativ: `range(10, 0, -1)` generează 10, 9, …, 1. Valoarea de oprire, 0, nu este inclusă.

### Ce face instrucțiunea break într-o buclă?

`break` oprește imediat bucla, chiar dacă mai erau valori de parcurs. E util când ai găsit deja ce căutai, de exemplu primul număr care îndeplinește o condiție.

### Pot folosi range() cu numere cu zecimale?

Nu. `range()` lucrează doar cu numere întregi. Pentru valori cu zecimale, poți parcurge numere întregi și le împarți apoi, de exemplu `i / 10`.
