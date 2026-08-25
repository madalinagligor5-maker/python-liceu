# Modulul 2.18 — Metoda Divide et impera

### 🔄 2.18.1 Recapitulare

Ai văzut recursivitatea (2.17). Divide et impera e un model de rezolvare care o folosește sistematic.

### 💡 2.18.2 Concept nou și exemplu

**Divide et impera** ("împarte și cucerește"): **divizare** (problema în subprobleme mai mici), **rezolvare** (recursivă), **combinare** (unirea rezultatelor).

```python
def merge_sort(lista):
    if len(lista) <= 1:
        return lista
    mijloc = len(lista) // 2
    stanga = merge_sort(lista[:mijloc])
    dreapta = merge_sort(lista[mijloc:])
    return interclaseaza(stanga, dreapta)   # din modulul 2.2

print(merge_sort([5, 2, 8, 1]))   # [1, 2, 5, 8]
```

Complexitate O(n log n) — mult mai bună decât O(n²).


:::tip
## Sfaturi & Bune Practici Didactice
Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.
:::

### 🔮 2.18.3 Citește și prezice

```python
def merge_sort(lista):
    if len(lista) <= 1:
        return lista
    mijloc = len(lista) // 2
    stanga = merge_sort(lista[:mijloc])
    dreapta = merge_sort(lista[mijloc:])
    return stanga + dreapta   # simplificat (fără sortare reală)

print(merge_sort([3, 1, 2]))
```
Ce listă se afișează? (Atenție: aici e doar concatenează, nu interclasează!)

### 🤝 2.18.4 Exerciții ghidate

**Exercițiul 1.** Completează cazul de bază pentru quicksort:
```python
def quicksort(lista):
    if ___:   # completează condiția de oprire
        return lista
    # ...
```

**Exercițiul 2.** Scrie `interclaseaza` (refolosește din 2.2) și folosește-o în merge_sort.

### 🎯 2.18.5 Exerciții independente

**Exercițiul 1.** Desenează arborele de apeluri pentru `merge_sort([5, 2, 8, 1])`.

**Exercițiul 2.** Implementează quicksort și contorizează comparările pentru liste aleatoare vs. sortate.

### ✅ 2.18.6 Verifică-ți înțelegerea

1. Divide et impera are 3 etape:
   a) **Divizare, Rezolvare, Combinare**  b) Citire, Scriere, Testare  c) Init, Loop, Exit

2. merge_sort are complexitatea:
   a) O(n²)  b) **O(n log n)**  c) O(n)

3. Cazul de bază la merge_sort e:
   a) `len(lista) == 0`  b) **`len(lista) <= 1`**  c) `len(lista) == 10`

4. Fără caz de bază, recursivitatea:
   a) Merge  b) **Eroare infinită**  c) Returnează lista


:::verifica-cod
Scrie o funcție `este_par(x)` care returnează True dacă x e par. Demo: `este_par(4)` -> `True`
template: def este_par(x):
    # completeaza
    pass

print(este_par(4))
output: True
:::

# Modulul 2.19 — Sortare prin interclasare și quicksort

### 🔄 2.19.1 Recapitulare

În IX ai învățat sortarea prin selecție și bule (O(n²)). Acum două metode O(n log n).

### 💡 2.19.2 Concept nou și exemplu

**Merge sort** (din 2.18): divide et impera + interclasare. **Quicksort**: alege un pivot, rearanează lista (mai mici la stânga, mai mari la dreapta), sortează recursiv părțile.

```python
def quicksort(lista):
    if len(lista) <= 1:
        return lista
    pivot = lista[0]
    stanga = [x for x in lista[1:] if x < pivot]
    dreapta = [x for x in lista[1:] if x >= pivot]
    return quicksort(stanga) + [pivot] + quicksort(dreapta)

print(quicksort([5, 2, 8, 1, 9]))   # [1, 2, 5, 8, 9]
```

Quicksort: medie O(n log n), caz nefavorabil O(n²) (pivot prost, listă deja sortată).


:::tip
## Sfaturi & Bune Practici Didactice
Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.
:::

### 🔮 2.19.3 Citește și prezice

```python
def quicksort(lista):
    if len(lista) <= 1:
        return lista
    pivot = lista[0]
    stanga = [x for x in lista[1:] if x < pivot]
    dreapta = [x for x in lista[1:] if x >= pivot]
    return quicksort(stanga) + [pivot] + quicksort(dreapta)

print(quicksort([3, 1, 2]))
```
Ce se afișează?

### 🤝 2.19.4 Exerciții ghidate

**Exercițiul 1.** Completează pentru a alege pivotul ca ultimul element:
```python
def quicksort(lista):
    if len(lista) <= 1:
        return lista
    pivot = ___  # ultimul element
    stanga = [x for x in lista[:-1] if x < pivot]
    dreapta = [x for x in lista[:-1] if x >= pivot]
    return quicksort(stanga) + [pivot] + quicksort(dreapta)
```

**Exercițiul 2.** Compară numărul de comparări între merge sort și quicksort pe aceeași listă.

### 🎯 2.19.5 Exerciții independente

**Exercițiul 1.** Implementează quicksort "in-place" (fără liste noi, cu swap).

**Exercițiul 2.** Sortează o listă cu merge_sort și măsoară timpul pentru 1000/10000 elemente.

### ✅ 2.19.6 Verifică-ți înțelegerea

1. Ambele metode au complexitate medie:
   a) O(n²)  b) **O(n log n)**  c) O(n)

2. Quicksort în caz nefavorabil e:
   a) O(n log n)  b) **O(n²)**  c) O(n)

3. Pivotul la quicksort se alege de obicei:
   a) Aleator  b) **Primul/ultimul/mijlocul**  c) Mereu 0

4. Merge sort folosește:
   a) Pivot  b) **Interclasarea**  c) Bule


:::verifica-cod
Scrie o funcție `este_par(x)` care returnează True dacă x e par. Demo: `este_par(4)` -> `True`
template: def este_par(x):
    # completeaza
    pass

print(este_par(4))
output: True
:::

# Modulul 2.20 — Algoritmi de umplere (Flood Fill)

### 🔄 2.20.1 Recapitulare

Ai parcurs liste și arbori. Acum o grilă (matrice) și umplerea unei regiuni conexe.

### 💡 2.20.2 Concept nou și exemplu

**Flood Fill** colorează o regiune conexă dintr-o matrice, pornind dintr-o celulă, extinzându-se recursiv la vecini cu aceeași culoare.

```python
def flood_fill(grila, i, j, veche, noua):
    if i < 0 or i >= len(grila) or j < 0 or j >= len(grila[0]):
        return
    if grila[i][j] != veche:
        return
    grila[i][j] = noua
    flood_fill(grila, i+1, j, veche, noua)
    flood_fill(grila, i-1, j, veche, noua)
    flood_fill(grila, i, j+1, veche, noua)
    flood_fill(grila, i, j-1, veche, noua)
```

**Erori frecvente:** omiterea verificării marginilor (eroare la acces în afara listei) sau a culorii (recursivitate infinită).


:::tip
## Sfaturi & Bune Practici Didactice
Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.
:::

### 🔮 2.20.3 Citește și prezice

```python
grila = [[0, 0, 1], [0, 1, 1], [1, 1, 1]]
flood_fill(grila, 0, 0, 0, 9)
print(grila[0][0], grila[1][0])
```
Ce valori se afișează? (Ambele erau 0 → devin 9.)

### 🤝 2.20.4 Exerciții ghidate

**Exercițiul 1.** Completează verificarea marginilor:
```python
def flood_fill(grila, i, j, veche, noua):
    if ___:   # i sau j în afara grilei -> return
        return
    if grila[i][j] != veche:
        return
    # ...
```

**Exercițiul 2.** Rescrie Flood Fill iterativ folosind o stivă (nu recursivitate).

### 🎯 2.20.5 Exerciții independente

**Exercițiul 1.** Aplică Flood Fill pentru a număra regiunile conexe dintr-o grilă cu 2 culori.

**Exercițiul 2.** Modifică algoritmul să returneze numărul de celule colorate.

### ✅ 2.20.6 Verifică-ți înțelegerea

1. Flood Fill pornește din:
   a) Toată grila  b) **O celulă dată**  c) Colțul din dreapta

2. Verificarea marginilor previne:
   a) Culori greșite  b) **Eroare la acces în afara grilei**  c) Recursivitatea

3. Fără verificarea culorii, algoritmul:
   a) Merge mai repede  b) **Recursează infinit**  c) Nu colorează nimic

4. Flood Fill e folosit în:
   a) Sortare  b) **Editoare grafice (găleata de vopsea)**  c) Căutare binară


:::verifica-cod
Scrie o funcție `este_par(x)` care returnează True dacă x e par. Demo: `este_par(4)` -> `True`
template: def este_par(x):
    # completeaza
    pass

print(este_par(4))
output: True
:::

# Modulul 2.21 — Metoda Greedy

### 🔄 2.21.1 Recapitulare

Ai văzut strategii exacte (căutare, sortare). Greedy e o strategie care alege mereu optimul local.

### 💡 2.21.2 Concept nou și exemplu

**Greedy** alege la fiecare pas decizia care pare cea mai bună pe moment, fără a reconsidera. Funcționează doar pentru probleme unde optimul local → optim global.

```python
def rest_greedy(suma, monede):
    monede = sorted(monede, reverse=True)
    rez = []
    for m in monede:
        while suma >= m:
            rez.append(m)
            suma -= m
    return rez if suma == 0 else None

print(rest_greedy(6, [1, 2, 5]))   # [5, 1]
```

**Contraexemplu:** pentru monede [1, 3, 4] și suma 6, Greedy alege 4+1+1 (3 monede), dar optim e 3+3 (2 monede).


:::tip
## Sfaturi & Bune Practici Didactice
Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.
:::

### 🔮 2.21.3 Citește și prezice

```python
def rest_greedy(suma, monede):
    monede = sorted(monede, reverse=True)
    rez = []
    for m in monede:
        while suma >= m:
            rez.append(m)
            suma -= m
    return rez if suma == 0 else None

print(rest_greedy(7, [1, 3, 4]))
```
Ce se afișează? (Greedy: 4+3 = 7, deci [4, 3]. Dar dacă ar fi [1,3,4] și suma 6, ar fi 4+1+1.)

### 🤝 2.21.4 Exerciții ghidate

**Exercițiul 1.** Completează pentru a verifica dacă restul s-a dat complet:
```python
def rest_greedy(suma, monede):
    monede = sorted(monede, reverse=True)
    rez = []
    for m in monede:
        while suma >= m:
            rez.append(m); suma -= m
    return ___ if suma == 0 else None  # completează
```

**Exercițiul 2.** Scrie un set de monede [1, 3, 4] și demonstrează că Greedy e suboptimal pentru suma 6.

### 🎯 2.21.5 Exerciții independente

**Exercițiul 1.** Aplică Greedy pentru problema planificării activităților (maximul de activități fără suprapunere).

**Exercițiul 2.** Găsește un alt set de monede (diferit de [1,3,4]) unde Greedy e suboptimal.

### ✅ 2.21.6 Verifică-ți înțelegerea

1. Greedy alege la fiecare pas:
   a) Optimul global  b) **Optimul local (pe moment)**  c) Aleator

2. Greedy garantează optimul global:
   a) Mereu  b) **Doar pentru anumite probleme**  c) Niciodată

3. Contraexemplul cu [1, 3, 4] și suma 6 arată:
   a) Greedy e mereu optim  b) **Greedy poate fi suboptimal**  c) Eroare de cod

4. Pentru rest la bani cu monede uzuale, Greedy:
   a) Eroare  b) **Este optim**  c) E suboptimal


:::verifica-cod
Scrie o funcție `este_par(x)` care returnează True dacă x e par. Demo: `este_par(4)` -> `True`
template: def este_par(x):
    # completeaza
    pass

print(este_par(4))
output: True
:::
