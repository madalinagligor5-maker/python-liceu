# Modulul 2.15 — Modelul conceptual mixt (liste de liste, liste de dicționare)

### 🔄 2.15.1 Recapitulare

Ai învățat liste, mulțimi, dicționare, tupluri individual. Dar datele reale le combină: o listă de elevi, fiecare cu propriile note.

### 💡 2.15.2 Concept nou și exemplu

```python
elevi = [
    {"nume": "Ana", "note": [9, 10, 8]},
    {"nume": "Bogdan", "note": [7, 8, 6]},
]
for elev in elevi:
    media = sum(elev["note"]) / len(elev["note"])
    print(elev["nume"], round(media, 2))
```

Combinări frecvente: liste de liste (matrice), liste de tupluri, liste de dicționare, dicționare cu valori-listă.


:::tip
## Sfaturi & Bune Practici Didactice
:::tip
O stivă respectă principiul LIFO (Last In First Out), iar o coadă respectă FIFO (First In First Out). În Python le poți implementa eficient folosind collections.deque!
:::
:::

### 🔮 2.15.3 Citește și prezice

```python
date = [
    {"nume": "Ana", "nota": 10},
    {"nume": "Bogdan", "nota": 7},
]
print(date[0]["nota"])
```
Ce se afișează?

### 🤝 2.15.4 Exerciții ghidate

**Exercițiul 1.** Completează pentru a accesa nota primului elev:
```python
date = [{"nume": "Ana", "nota": 10}]
___  # accesează "nota" din primul element
```

**Exercițiul 2.** Scrie codul care calculează media fiecărui elev dintr-o listă de dicționare.

### 🎯 2.15.5 Exerciții independente

**Exercițiul 1.** Pentru structura de mai sus, calculează media generală a clasei și numele elevului cu cea mai mare medie.

**Exercițiul 2.** Proiectează o structură pentru un carnet de note cu mai multe materii per elev.

### ✅ 2.15.6 Verifică-ți înțelegerea

1. `elevi[0]["nota"]` accesează:
   a) Toți elevii  b) **Nota primului elev**  c) Lista de elevi
      > `elevi[0]` selectează primul dicționar din listă, iar `["nota"]` extrage din el valoarea asociată cheii "nota", deci obții nota primului elev.

2. O listă de dicționare e utilă pentru:
   a) Numere  b) **Înregistrări cu câmpuri**  c) Caractere
      > Fiecare dicționar din listă poate grupa mai multe câmpuri sub un singur nume (ex. "nume" și "note"), exact ca o înregistrare cu mai multe atribute despre aceeași persoană.

3. Pentru o matrice (tablă) folosești:
   a) Un dicționar  b) **Listă de liste**  c) Un tuplu
      > O matrice are nevoie de linii și coloane, iar o listă de liste modelează exact asta: lista exterioară ține liniile, fiecare listă interioară ține elementele unei linii.

4. La accesul imbricat, eroarea comună e:
   a) Prea multe bucle  b) **Nivelul greșit de indexare**  c) Sintaxa greșită
      > La structuri imbricate, cea mai frecventă greșeală e să indexezi la nivelul greșit (de exemplu să aplici direct un indice numeric pe dicționar în loc să intri mai întâi în lista din care face parte).


:::verifica-cod
Scrie o funcție `media_elev(elev)` care primește un dicționar cu cheile "nume" și "note" (listă) și returnează media notelor. Demo: `media_elev({"nume": "Ana", "note": [9, 10, 8]})` -> `9.0`
template: def media_elev(elev):
    # completeaza
    pass

print(media_elev({"nume": "Ana", "note": [9, 10, 8]}))
output: 9.0
:::

# Modulul 2.16 — Elemente de limbaj pentru modele mixte

### 🔄 2.16.1 Recapitulare

În modulul 2.15 ai folosit structuri imbricate. Acum consolidăm accesul la ele.

### 💡 2.16.2 Concept nou și exemplu

Regula: se evaluează de la stânga la dreapta, un nivel pe rând.

```python
matrice = [[1, 2], [3, 4]]
print(matrice[0][1])     # 2 (linia 0, coloana 1)

lista_dict = [{"x": 5}, {"x": 10}]
print(lista_dict[1]["x"]) # 10
```

Se recomandă "citirea cu voce tare": `date[2]["note"][1]` = "al 3-lea elev, câmpul note, a 2-a notă".


:::tip
## Sfaturi & Bune Practici Didactice
:::atentie
Înainte de a extrage un element dintr-o stivă sau coadă (pop/popleft), verifică întotdeauna dacă structura nu este goală!
:::
:::

### 🔮 2.16.3 Citește și prezice

```python
m = [[1, 2, 3], [4, 5, 6]]
print(m[1][0])
```
Ce se afișează?

### 🤝 2.16.4 Exerciții ghidate

**Exercițiul 1.** Completează pentru a accesa elementul de pe linia 2, coloana 3:
```python
m = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
___  # linia 2 (index 2), coloana 3 (index 2)
```

**Exercițiul 2.** Scrie codul care parcurge o matrice și afișează fiecare element.

### 🎯 2.16.5 Exerciții independente

**Exercițiul 1.** Dat un tabel de note (listă de liste), calculează media pe fiecare linie (elev) și pe fiecare coloană (materie).

**Exercițiul 2.** Construiește un dicționar cu valori-listă: `{"Ana": [9,10], "Bogdan": [7,8]}` și afișează media fiecăruia.

### ✅ 2.16.6 Verifică-ți înțelegerea

1. `matrice[i][j]` accesează:
   a) Coloana i, linia j  b) **Linia i, coloana j**  c) Elementul i
      > Prin convenție, primul indice dintr-o listă de liste indică linia, iar al doilea indică poziția pe acea linie (coloana), așa cum arată exemplul `matrice[0][1]` care dă elementul de pe linia 0, coloana 1.

2. La structuri imbricate, recomandarea e:
   a) Să eviți buclele  b) **Să citești nivelul cu voce tare**  c) Să folosești doar liste
      > Lecția recomandă să citești expresia cu voce tare, nivel cu nivel (ca în exemplul `date[2]["note"][1]`), pentru a nu te încurca la accesul imbricat.

3. `date[2]["note"][1]` înseamnă:
   a) Nota 2  b) **Al 3-lea elev, câmpul note, a 2-a notă**  c) Eroare
      > Citind expresia nivel cu nivel: `date[2]` ia al treilea elev (index 2), `["note"]` intră în câmpul notelor lui, iar `[1]` ia a doua notă din acea listă.

4. O matrice e implementată ca:
   a) Dicționar  b) **Listă de liste**  c) Tuplu
      > O matrice nu e un tip separat în Python, ci se construiește ca o listă de liste, fiecare listă interioară reprezentând o linie a tabelului.


:::verifica-cod
Scrie o funcție `element_matrice(m, i, j)` care returnează elementul de pe linia `i` și coloana `j` dintr-o listă de liste. Demo: `element_matrice([[1, 2, 3], [4, 5, 6]], 1, 2)` -> `6`
template: def element_matrice(m, i, j):
    # completeaza
    pass

print(element_matrice([[1, 2, 3], [4, 5, 6]], 1, 2))
output: 6
:::

# Modulul 2.17 — Subprograme recursive

### 🔄 2.17.1 Recapitulare

Ai folosit funcții simple (modulul 3.1 din IX). Acum funcții care se apelează pe ele însele — recursivitatea.

### 💡 2.17.2 Concept nou și exemplu

```python
def factorial(n):
    if n == 0:               # caz de bază
        return 1
    return n * factorial(n - 1)   # pas recursiv

print(factorial(4))   # 24
```

Orice funcție recursivă are: **caz de bază** (oprește recursivitatea) și **pas recursiv** (reduce problema).


:::tip
## Sfaturi & Bune Practici Didactice
:::tip
În listele simplu înlănțuite, fiecare nod conține valoarea și o referință (next) către nodul următor. Ultimul nod indică spre None!
:::
:::

### 🔮 2.17.3 Citește și prezice

```python
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

print(factorial(3))
```
Ce se afișează?

### 🤝 2.17.4 Exerciții ghidate

**Exercițiul 1.** Completează cazul de bază pentru suma cifrelor:
```python
def suma_cifre(n):
    if n == 0:
        return 0
    return ___ + suma_cifre(n // 10)  # completează
```

**Exercițiul 2.** Scrie o funcție recursivă care verifică dacă un șir e palindrom.

### 🎯 2.17.5 Exerciții independente

**Exercițiul 1.** Scrie `putere(a, n)` recursiv (a^n).

**Exercițiul 2.** Desenează arborele de apeluri pentru `factorial(4)` și numără apelurile.

### ✅ 2.17.6 Verifică-ți înțelegerea

1. Orice funcție recursivă are nevoie de:
   a) Doar caz de bază  b) **Caz de bază + pas recursiv**  c) O buclă
      > Fără caz de bază recursivitatea n-ar avea unde să se oprească, iar fără pas recursiv care reduce problema, funcția n-ar avansa spre acel caz de bază, deci sunt ambele obligatorii.

2. Fără caz de bază corect, recursivitatea:
   a) Merge mai repede  b) **Devine infinită (RecursionError)**  c) Returnează 0
      > Dacă niciun apel nu ajunge vreodată la condiția cazului de bază, funcția continuă să se apeleze pe ea însăși la nesfârșit, iar Python oprește execuția cu RecursionError.

3. `factorial(3)` calculează:
   a) 3  b) **6**  c) 9
      > Urmând pasul recursiv `n * factorial(n-1)`, calculul este 3 * factorial(2) = 3 * (2 * factorial(1)) = 3 * 2 * 1 * factorial(0) = 3 * 2 * 1 * 1 = 6.

4. Pasul recursiv trebuie să:
   a) Mărească problema  b) **Reduce problema**  c) Repete același apel
      > Pasul recursiv trebuie să apeleze funcția pentru o problemă mai mică (ca `n - 1` la factorial), altfel problema nu se apropie niciodată de cazul de bază și recursivitatea nu se termină.


:::verifica-cod
Scrie o funcție recursivă `numara_cifre(n)` care returnează numărul de cifre al lui `n`. Demo: `numara_cifre(1234)` -> `4`
template: def numara_cifre(n):
    # completeaza
    pass

print(numara_cifre(1234))
output: 4
:::
