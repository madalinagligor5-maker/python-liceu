---
titlu: Funcții în Python: def, parametri și return, explicate simplu
titlu_seo: Funcții în Python: def, parametri, return
slug: functii-in-python
data: 2026-10-12
descriere: Funcții în Python explicate simplu: def, parametri, return, valori implicite, variabile locale, print vs. return. Cu exemple și exerciții.
---

O **funcție** este o bucată de cod cu nume, pe care o scrii o singură dată și o folosești ori de câte ori ai nevoie. O definești cu `def`, îi dai date prin **parametri** și primești un rezultat cu `return`. Funcțiile fac programele mai scurte, mai ușor de citit și mai ușor de testat.

## Prima funcție

```python
def saluta():
    print("Bună! Bine ai venit.")

saluta()
saluta()
```

Rezultatul:

```text
Bună! Bine ai venit.
Bună! Bine ai venit.
```

Definiția nu execută nimic: doar „învață” programul ce înseamnă `saluta`. Codul din interior rulează abia când **apelezi** funcția, scriind numele urmat de paranteze.

## Parametri: funcția primește date

```python
def saluta(nume):
    print("Bună,", nume + "!")

saluta("Ana")
saluta("Mihai")
```

Rezultatul: `Bună, Ana!`, apoi `Bună, Mihai!`. `nume` este un **parametru**: o variabilă care primește valoarea dată la apel (numită **argument**).

## return: funcția întoarce un rezultat

```python
def media(a, b):
    return (a + b) / 2

rezultat = media(8, 10)
print(rezultat)
print(media(7, 8))
```

Rezultatul:

```text
9.0
7.5
```

Când Python ajunge la `return`, iese din funcție și trimite valoarea înapoi, acolo de unde a fost apelată. O poți păstra într-o variabilă, o poți afișa sau o poți folosi în alt calcul.

## print sau return? Diferența cea mai importantă

- `print()` **afișează** o valoare pe ecran. Restul programului nu o poate folosi mai departe.
- `return` **întoarce** valoarea, ca restul programului să o poată folosi.

```python
def dublu_afisat(x):
    print(x * 2)

def dublu_intors(x):
    return x * 2

a = dublu_afisat(5)
b = dublu_intors(5)
print(a, b)
```

Rezultatul:

```text
10
None 10
```

Prima funcție afișează 10, dar nu întoarce nimic, așa că `a` primește valoarea specială `None`. Regula practică: dacă rezultatul funcției trebuie folosit mai departe, folosește `return`.

## Testarea unei funcții

O funcție are un avantaj mare: o poți testa separat, cu date pentru care știi răspunsul.

```python
def media(a, b):
    return (a + b) / 2

print(media(8, 10) == 9)
print(media(5, 5) == 5)
print(media(7, 8) == 7.5)
```

Toate trei liniile afișează `True`. Câteva teste reușite cresc încrederea că funcția e corectă, dar nu o garantează pentru orice date. Un singur `False` arată însă sigur că ceva e greșit.

## Parametri cu valoare implicită

```python
def pret_final(pret, reducere=0):
    return pret - pret * reducere / 100

print(pret_final(200))
print(pret_final(200, 25))
```

Rezultatul: `200.0`, apoi `150.0`. Dacă nu dai valoare pentru `reducere`, se folosește 0.

## Variabile locale

Variabilele create în interiorul unei funcții există doar acolo:

```python
def calculeaza():
    total = 42
    return total

print(calculeaza())
print(total)
```

Prima linie afișează `42`, iar a doua oprește programul cu `NameError: name 'total' is not defined`, pentru că `total` există doar în interiorul funcției. Soluția corectă e să folosești valoarea întoarsă: `rezultat = calculeaza()`.

## Exemplu rezolvat: verificarea unui număr prim

```python
def este_prim(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d += 1
    return True

for x in [1, 2, 9, 13, 25, 29]:
    print(x, este_prim(x))
```

Rezultatul:

```text
1 False
2 True
9 False
13 True
25 False
29 True
```

E suficient să verifici divizorii până la radicalul lui n (condiția `d * d <= n`). Dacă n ar avea un divizor mai mare decât radicalul, ar avea obligatoriu și unul mai mic.

## Greșeli frecvente

- **Definești funcția, dar uiți să o apelezi.** Fără `nume_functie()`, codul din interior nu rulează.
- **Apelezi funcția înainte de definiție.** În Python, `def` trebuie să se execute înaintea apelului.
- **Folosești print în loc de return**, apoi încerci să faci calcule cu rezultatul și primești `None`.
- **Uiți parantezele la apel**: `media` (fără paranteze) este funcția însăși, nu rezultatul ei.

## Exercițiu: încearcă singur

Scrie funcția `aria_cerc(r)`, care întoarce aria unui cerc rotunjită la 2 zecimale, folosind `3.14159` pentru π. Teste: `aria_cerc(1)` → `3.14`, `aria_cerc(2)` → `12.57`, `aria_cerc(0)` → `0.0`.

Rulează-ți soluția în [laboratorul Python](/lab). Pentru copii, funcțiile sunt explicate gratuit în lecția [Funcții: reutilizăm codul](/curriculum/P10/functii-reutilizam-codul). Elevii de liceu le găsesc în modulul [Subprograme (funcții): definire și apel](/curriculum/IX/subprograme-functii-definire-si-apel) din clasa a IX-a.

## Întrebări frecvente

### Ce înseamnă def în Python?

`def` vine de la „define” și marchează definirea unei funcții. După el urmează numele funcției, parantezele cu parametri și două puncte.

### O funcție poate întoarce mai multe valori?

Da. Scrii `return a, b`, iar Python întoarce un tuplu. La apel poți scrie `x, y = functia()` ca să primești valorile în variabile separate.

### Ce se întâmplă dacă o funcție nu are return?

Funcția întoarce automat valoarea `None`. E perfect în regulă pentru funcțiile care doar afișează ceva sau modifică o listă primită.

### Care e diferența dintre parametru și argument?

Parametrul este numele din definiția funcției, de exemplu `a` în `def media(a, b)`. Argumentul este valoarea concretă dată la apel, de exemplu `8` în `media(8, 10)`.
