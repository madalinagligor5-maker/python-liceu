# Conținut lecții — Curs practic de Python, Unitatea 4 (Modulele CP4.1–CP4.4)

Respectă exact structura de pe `academiapython.ro/curs-practic` — 6 sublecții per modul, aceleași etichete/iconuri ca în unitățile anterioare. Unitatea 4 introduce funcțiile: cum împarți un program în bucăți mici, cu nume, pe care le poți refolosi.

---

# Modulul CP4.1 — Funcții: definire și apel

### 🔄 CP4.1.1 Recapitulare

Până acum ai folosit deja funcții scrise de alții: `print()`, `len()`, `input()`, `sorted()`. Le-ai apelat cu un nume urmat de paranteze, fără să te intereseze cum lucrează pe dinăuntru. În acest modul înveți să-ți scrii propriile funcții, ca să nu mai copiezi același cod în mai multe locuri.

### 💡 CP4.1.2 Concept nou și exemplu

O **funcție** este un bloc de cod cu nume, pe care îl scrii o dată și îl rulezi de câte ori ai nevoie. O definești cu cuvântul `def`, urmat de nume, paranteze și două puncte. Codul funcției se scrie indentat, exact ca la `if` sau `for`.

```python
def saluta():
    print("Bună ziua!")
    print("Bine ai venit la curs.")

saluta()
saluta()
```

Definirea nu rulează nimic: abia **apelul** `saluta()` execută liniile din funcție. Aici funcția e apelată de două ori, deci cele două mesaje apar de două ori.

O funcție devine cu adevărat utilă când primește **parametri**: valori pe care i le dai la apel și pe care le folosește în interior.

```python
def saluta(nume):
    print(f"Bună ziua, {nume}!")

saluta("Ana")
saluta("Mihai")
```

Rezultatul: `Bună ziua, Ana!`, apoi `Bună ziua, Mihai!`.

O funcție poate avea mai mulți parametri, separați prin virgulă. Valorile de la apel se potrivesc cu parametrii în ordinea în care sunt scrise:

```python
def afiseaza_produs(nume, pret):
    print(f"{nume}: {pret} lei")

afiseaza_produs("Cafea", 18)
afiseaza_produs("Ceai", 9)
```

Rezultatul: `Cafea: 18 lei`, apoi `Ceai: 9 lei`.

:::exemplu
## De ce merită o funcție
Dacă afișezi bonul pentru 20 de produse, scrii formatarea o singură dată, în `afiseaza_produs`. Dacă mâine vrei să afișezi și „RON” în loc de „lei”, schimbi o singură linie, nu douăzeci.
:::

:::atentie
## Definirea trebuie să vină înaintea apelului
Python citește fișierul de sus în jos. Dacă apelezi `saluta()` înainte de linia `def saluta():`, primești `NameError: name 'saluta' is not defined`. Scrie întâi funcțiile, apoi codul care le folosește.
:::

### 🔮 CP4.1.3 Citește și prezice

Fără să rulezi codul, scrie pe hârtie ce afișează, rând cu rând:

```python
def linie(caracter, lungime):
    print(caracter * lungime)

linie("-", 5)
linie("*", 3)
print("gata")
```

Câte rânduri apar? Ce conține fiecare? Verifică apoi rulând codul.

### 🤝 CP4.1.4 Exerciții ghidate

**Exercițiul 1.** Completează apelul ca funcția să afișeze `Bună ziua, Ioana!`.

```python
def saluta(nume):
    print(f"Bună ziua, {nume}!")

saluta(___)
```

**Exercițiul 2.** Scrie funcția `afiseaza_dublu(numar)`, care afișează dublul numărului primit, și apeleaz-o cu `21`.

### 🎯 CP4.1.5 Exerciții independente

**Exercițiul 1.** Scrie o funcție `chenar(text)` care afișează textul între două linii de câte 10 caractere `=`. Apeleaz-o cu `"Raport"`.

**Exercițiul 2 (mini-proiect de închidere).** Scrie o funcție `bon(produs, cantitate, pret)` care afișează o linie de forma `Cafea x 2 = 36 lei`. Apeleaz-o pentru cafea (2 bucăți, 18 lei) și pentru ceai (3 bucăți, 9 lei).

### ✅ CP4.1.6 Verifică-ți înțelegerea

1. Cu ce cuvânt începe definirea unei funcții în Python?
   a) `function`  b) **`def`**  c) `func`
      > Orice funcție proprie se definește cu `def nume(parametri):`, urmat de corpul indentat.

2. Ce se întâmplă când Python citește linia `def saluta():` și corpul ei?
   a) Afișează mesajele din funcție  b) **Reține funcția, dar nu o rulează încă**  c) Dă eroare dacă funcția nu e apelată
      > Definirea doar creează funcția. Codul din ea rulează abia la apel, adică la `saluta()`.

3. Pentru `def afiseaza_produs(nume, pret):`, ce primește `pret` la apelul `afiseaza_produs("Ceai", 9)`?
   a) `"Ceai"`  b) **`9`**  c) Nimic, pentru că lipsește
      > Valorile de la apel se potrivesc cu parametrii în ordine: primul merge în `nume`, al doilea în `pret`.

4. Care e principalul avantaj al unei funcții?
   a) Programul rulează mereu mai repede  b) **Scrii codul o singură dată și îl refolosești**  c) Nu mai ai nevoie de variabile
      > O funcție adună într-un singur loc un cod pe care îl folosești de mai multe ori, așa că o modificare se face într-un singur loc.

:::verifica-cod
Completează apelul funcției ca programul să afișeze exact „Bună ziua, Maria!”.
template: def saluta(nume):
    print(f"Bună ziua, {nume}!")

saluta(___)
output: Bună ziua, Maria!
:::

---

# Modulul CP4.2 — Valori returnate și domeniul variabilelor

### 🔄 CP4.2.1 Recapitulare

În modulul anterior, funcțiile tale **afișau** rezultatul cu `print()`. Asta e util pentru mesaje, dar uneori ai nevoie de rezultat ca să calculezi mai departe: de exemplu, prețul cu TVA, pe care apoi îl aduni la un total. Pentru asta, funcția trebuie să **întoarcă** valoarea.

### 💡 CP4.2.2 Concept nou și exemplu

Cuvântul `return` trimite o valoare înapoi, acolo unde a fost apelată funcția. Valoarea întoarsă poate fi salvată într-o variabilă sau folosită direct într-un calcul.

```python
def pret_cu_tva(pret):
    return pret * 1.19

total = pret_cu_tva(100) + pret_cu_tva(50)
print(round(total, 2))
```

Rezultatul: `178.5`.

`return` oprește imediat funcția. Orice linie scrisă după el, în același bloc, nu mai rulează. Poți folosi asta pentru a întoarce rezultate diferite în funcție de o condiție:

```python
def categorie(varsta):
    if varsta < 18:
        return "minor"
    return "adult"

print(categorie(15))
print(categorie(40))
```

Rezultatul: `minor`, apoi `adult`.

O funcție fără `return` întoarce totuși ceva: valoarea specială `None`, adică „nimic”.

```python
def anunta(mesaj):
    print(mesaj)

rezultat = anunta("Salut")
print(rezultat)
```

Rezultatul: `Salut`, apoi `None`.

**Domeniul variabilelor.** O variabilă creată în interiorul unei funcții este **locală**: există doar cât rulează funcția și nu se vede din afara ei.

```python
def calculeaza():
    reducere = 10
    return 100 - reducere

print(calculeaza())
```

Rezultatul: `90`. Dacă ai scrie apoi `print(reducere)` în afara funcției, ai primi `NameError`, pentru că `reducere` există doar în interiorul lui `calculeaza`.

:::exemplu
## Funcții care se combină
Funcțiile care întorc valori se pot pune una în alta: `round(pret_cu_tva(80), 2)` calculează întâi prețul cu TVA, apoi îl rotunjește. Așa construiești calcule complexe din bucăți mici, ușor de verificat separat.
:::

:::atentie
## `print` nu este `return`
O funcție care doar afișează rezultatul îl arată pe ecran, dar îl pierde imediat. Dacă scrii `total = pret_cu_tva(100)` și funcția folosește `print` în loc de `return`, `total` va fi `None`, iar un calcul ca `total + 5` va da eroare.
:::

### 🔮 CP4.2.3 Citește și prezice

Fără să rulezi codul, scrie ce afișează:

```python
def maxim(a, b):
    if a > b:
        return a
    return b

x = maxim(7, 12)
print(x * 2)
print(maxim(3, 3))
```

### 🤝 CP4.2.4 Exerciții ghidate

**Exercițiul 1.** Completează funcția astfel încât să întoarcă aria unui dreptunghi.

```python
def arie(lungime, latime):
    return ___

print(arie(4, 5))
```

**Exercițiul 2.** Scrie funcția `este_par(n)`, care întoarce `True` dacă `n` este par și `False` altfel. Afișează rezultatul pentru `10`.

### 🎯 CP4.2.5 Exerciții independente

**Exercițiul 1.** Scrie funcția `medie(numere)`, care întoarce media unei liste de numere. Afișează media notelor `[8, 9, 10, 7]`.

**Exercițiul 2 (mini-proiect de închidere).** Scrie funcția `pret_final(pret, reducere_procent)`, care întoarce prețul după reducere, rotunjit la 2 zecimale. Folosește-o ca să calculezi totalul unui coș cu un produs de 200 lei redus cu 15% și unul de 80 lei redus cu 10%, apoi afișează totalul.

### ✅ CP4.2.6 Verifică-ți înțelegerea

1. Ce face instrucțiunea `return` într-o funcție?
   a) Afișează valoarea pe ecran  b) **Trimite valoarea înapoi la locul apelului și oprește funcția**  c) Repornește funcția de la început
      > `return` întoarce rezultatul către codul care a apelat funcția și încheie imediat execuția funcției.

2. Ce întoarce o funcție care nu are niciun `return`?
   a) `0`  b) Un text gol  c) **`None`**
      > Fără `return`, Python întoarce automat valoarea specială `None`, care înseamnă „nicio valoare”.

3. O variabilă creată în interiorul unei funcții…
   a) se poate folosi oriunde în program  b) **există doar în interiorul funcției**  c) se transformă automat în parametru
      > Variabilele create în funcție sunt locale: dispar după ce funcția se termină și nu se văd din exterior.

4. Ce afișează `print(len("abc") + len("de"))`?
   a) `abcde`  b) **`5`**  c) Eroare
      > `len` întoarce o valoare (3 și 2), iar valorile întoarse se pot aduna direct.

:::verifica-cod
Completează funcția ca să întoarcă pătratul numărului primit. Programul trebuie să afișeze 49.
template: def patrat(n):
    return ___

print(patrat(7))
output: 49
:::

---

# Modulul CP4.3 — Argumente implicite și argumente cu nume

### 🔄 CP4.3.1 Recapitulare

Ai scris funcții cu parametri și ai văzut că valorile de la apel se potrivesc cu parametrii în ordine. Când o funcție are mulți parametri, devine ușor să-i încurci. Iar unii parametri au aproape mereu aceeași valoare, așa că e obositor să o scrii de fiecare dată.

### 💡 CP4.3.2 Concept nou și exemplu

Un **parametru cu valoare implicită** primește o valoare de rezervă direct în definiție. Dacă la apel nu dai nimic pentru el, se folosește valoarea implicită.

```python
def pret_cu_tva(pret, tva=19):
    return pret + pret * tva / 100

print(pret_cu_tva(100))
print(pret_cu_tva(100, 9))
```

Rezultatul: `119.0`, apoi `109.0`. Primul apel folosește TVA-ul implicit de 19%, al doilea îl înlocuiește cu 9%.

**Argumentele cu nume** îți permit să spui explicit cărui parametru îi dai o valoare. Ordinea lor nu mai contează, iar apelul devine mai ușor de citit.

```python
def programare(nume, zi, ora="10:00"):
    print(f"{nume}: {zi}, ora {ora}")

programare("Ana", "luni")
programare(zi="marți", nume="Radu", ora="14:30")
```

Rezultatul: `Ana: luni, ora 10:00`, apoi `Radu: marți, ora 14:30`.

Ai folosit deja argumente cu nume fără să știi: `print("a", "b", sep="-")` afișează `a-b`, iar `print("fără rând nou", end="")` nu mai trece pe rândul următor. `sep` și `end` sunt parametri cu valori implicite ai funcției `print`.

:::exemplu
## Un apel care se citește singur
Compară `trimite_email("ana@exemplu.ro", True, False)` cu `trimite_email("ana@exemplu.ro", urgent=True, copie=False)`. A doua variantă se înțelege fără să cauți definiția funcției.
:::

:::atentie
## Parametrii impliciți vin la final
În definiție, parametrii cu valoare implicită se scriu după cei fără. `def f(a=1, b):` dă `SyntaxError`. Corect este `def f(b, a=1):`.
:::

### 🔮 CP4.3.3 Citește și prezice

Fără să rulezi codul, scrie ce afișează:

```python
def salut(nume, mesaj="Bună"):
    return f"{mesaj}, {nume}!"

print(salut("Ioana"))
print(salut("Dan", "Salut"))
print(salut(mesaj="Hei", nume="Eva"))
```

### 🤝 CP4.3.4 Exerciții ghidate

**Exercițiul 1.** Completează valoarea implicită astfel încât `rata()` fără al doilea argument să împartă suma în 12 luni.

```python
def rata(suma, luni=___):
    return suma / luni

print(rata(1200))
```

**Exercițiul 2.** Afișează cuvintele `rosu`, `galben` și `albastru` pe același rând, separate prin ` | `, folosind un singur `print` și argumentul `sep`.

### 🎯 CP4.3.5 Exerciții independente

**Exercițiul 1.** Scrie funcția `formateaza_pret(suma, moneda="lei")`, care întoarce un text de forma `250 lei`. Afișează rezultatul pentru `250` (cu moneda implicită) și pentru `40` cu moneda `"EUR"`, pe rânduri separate.

**Exercițiul 2 (mini-proiect de închidere).** Scrie funcția `dobanda(suma, rata=5, ani=1)`, care întoarce suma finală cu dobândă compusă (`suma * (1 + rata / 100) ** ani`), rotunjită la 2 zecimale. Afișează rezultatul pentru 1000 de lei, cu rata implicită, pe 3 ani, folosind argumentul cu nume `ani=3`.

### ✅ CP4.3.6 Verifică-ți înțelegerea

1. Pentru `def f(a, b=10): return a + b`, cât întoarce `f(5)`?
   a) `5`  b) **`15`**  c) Eroare, lipsește `b`
      > `b` nu a primit valoare la apel, așa că folosește valoarea implicită 10: 5 + 10 = 15.

2. Care definiție este corectă?
   a) `def f(a=1, b):`  b) **`def f(b, a=1):`**  c) Ambele
      > Parametrii cu valori implicite trebuie scriși după cei fără valori implicite.

3. Ce afișează `print("x", "y", sep="")`?
   a) `x y`  b) **`xy`**  c) `x,y`
      > `sep` stabilește ce se pune între valori. Cu `sep=""` nu se pune nimic, deci rezultatul e `xy`.

4. Care e avantajul argumentelor cu nume, de forma `ora="14:30"`?
   a) Rulează mai repede  b) **Apelul e mai clar și ordinea nu mai contează**  c) Nu mai e nevoie de parametri în definiție
      > Când numești argumentul, se vede imediat ce înseamnă fiecare valoare și le poți da în orice ordine.

:::verifica-cod
Folosește argumentul `sep` ca programul să afișeze exact 2026-10-27.
template: print(2026, 10, 27, sep=___)
output: 2026-10-27
:::

---

# Modulul CP4.4 — Funcții ca valori: lambda și sortare cu `key`

### 🔄 CP4.4.1 Recapitulare

Știi să scrii funcții cu `def`, să le dai parametri și să întorci rezultate. Ai folosit și `sorted()` ca să ordonezi liste de numere sau texte. Dar ce faci când vrei să ordonezi o listă de produse după preț, nu după nume? Aici intervine o idee nouă: o funcție poate fi dată ca valoare altei funcții.

### 💡 CP4.4.2 Concept nou și exemplu

În Python, o funcție este o valoare ca oricare alta: o poți pune într-o variabilă sau o poți trimite ca argument. `sorted()` are un parametru `key`, care primește o funcție. Pentru fiecare element, `sorted` apelează acea funcție și ordonează după rezultatul ei.

```python
cuvinte = ["kiwi", "banană", "măr"]
print(sorted(cuvinte, key=len))
```

Rezultatul: `['măr', 'kiwi', 'banană']`. Am dat funcția `len` fără paranteze, deci nu am apelat-o noi: `sorted` o apelează pentru fiecare cuvânt și ordonează după lungime.

Pentru funcții scurte, de o singură expresie, Python are **lambda**: o funcție fără nume, scrisă direct pe loc.

```python
produse = [("cafea", 18), ("ceai", 9), ("ciocolată", 12)]
ieftine_intai = sorted(produse, key=lambda p: p[1])
print(ieftine_intai)
```

Rezultatul: `[('ceai', 9), ('ciocolată', 12), ('cafea', 18)]`. `lambda p: p[1]` înseamnă „pentru produsul `p`, întoarce `p[1]`”, adică prețul.

Cu `reverse=True` inversezi ordinea. Același `key` funcționează și la `max()` și `min()`:

```python
produse = [("cafea", 18), ("ceai", 9), ("ciocolată", 12)]
scump = max(produse, key=lambda p: p[1])
print(scump[0])
print(sorted(produse, key=lambda p: p[1], reverse=True)[0])
```

Rezultatul: `cafea`, apoi `('cafea', 18)`.

:::exemplu
## Același lucru, cu `def`
`lambda p: p[1]` e echivalent cu `def pret(p): return p[1]`, urmat de `sorted(produse, key=pret)`. Folosește `lambda` pentru reguli de o linie și `def` când regula are mai mulți pași sau merită un nume.
:::

:::atentie
## `key=len`, nu `key=len()`
Dacă scrii `key=len()`, Python încearcă să apeleze `len` imediat, fără argument, și dă eroare. Lui `key` îi dai funcția însăși, fără paranteze, iar `sorted` o apelează pentru fiecare element.
:::

### 🔮 CP4.4.3 Citește și prezice

Fără să rulezi codul, scrie ce afișează:

```python
note = {"Ana": 9, "Radu": 7, "Ioana": 10}
ordonate = sorted(note, key=lambda nume: note[nume], reverse=True)
print(ordonate[0])
print(ordonate)
```

### 🤝 CP4.4.4 Exerciții ghidate

**Exercițiul 1.** Completează `key` astfel încât orașele să fie ordonate după lungimea numelui.

```python
orase = ["Iași", "Cluj-Napoca", "Arad"]
print(sorted(orase, key=___))
```

**Exercițiul 2.** Pentru lista de numere `[-7, 3, -1, 5]`, afișează numărul cel mai apropiat de zero folosind `min` și `key=abs`.

### 🎯 CP4.4.5 Exerciții independente

**Exercițiul 1.** Pentru angajații `[("Ana", 5200), ("Mihai", 4800), ("Ioana", 6100)]`, afișează numele celui cu salariul cel mai mare.

**Exercițiul 2 (mini-proiect de închidere).** Pentru produsele `[("pix", 3), ("caiet", 12), ("rucsac", 150), ("riglă", 5)]`, afișează numele produselor ordonate de la cel mai scump la cel mai ieftin, separate prin virgulă și spațiu.

### ✅ CP4.4.6 Verifică-ți înțelegerea

1. Ce primește parametrul `key` al funcției `sorted()`?
   a) Un număr  b) **O funcție aplicată fiecărui element**  c) Numele listei
      > `key` primește o funcție. `sorted` o apelează pentru fiecare element și ordonează după rezultatele ei.

2. Ce înseamnă `lambda x: x * 2`?
   a) O variabilă numită `lambda`  b) **O funcție fără nume care întoarce dublul lui `x`**  c) O buclă care dublează o listă
      > `lambda` creează pe loc o funcție scurtă. Expresia de după două puncte este valoarea întoarsă.

3. Ce afișează `print(sorted([3, 1, 2], reverse=True))`?
   a) `[1, 2, 3]`  b) **`[3, 2, 1]`**  c) `[2, 1, 3]`
      > `reverse=True` ordonează descrescător.

4. De ce scriem `key=len` și nu `key=len()`?
   a) Sunt la fel  b) **Îi dăm funcția, nu rezultatul apelării ei**  c) `len()` merge doar pe numere
      > `sorted` are nevoie de funcție ca s-o apeleze pentru fiecare element. Cu paranteze, `len` ar fi apelată imediat, fără argument, și ar da eroare.

:::verifica-cod
Completează `key` ca programul să afișeze numele celui mai tânăr. Rezultatul așteptat este Eva.
template: persoane = [("Dan", 34), ("Eva", 22), ("Ion", 41)]
tanar = min(persoane, key=___)
print(tanar[0])
output: Eva
:::
