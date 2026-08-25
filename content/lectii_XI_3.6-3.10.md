# Modulul 3.6 — Programare dinamică

### 🔄 3.6.1 Recapitulare

Ai văzut recursivitatea (2.17) și backtracking-ul (3.3). Ambele pot recalcula de multe ori aceleași subprobleme.

### 💡 3.6.2 Concept nou și exemplu

**Programarea dinamică (PD)** rezolvă o problemă prin combinarea soluțiilor unor subprobleme suprapuse, memoizând rezultatele ca să nu le recalculăm.

Exemplu — Fibonacci cu memoizare:
```python
from functools import lru_cache
@lru_cache(None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
```

Sau iterativ (tabular), ținând doar ultimele două valori. PD se aplică la: drumuri minime, numărul de căi, subșiruri, rucsac (knapsack).

:::tip
Dacă o problemă are subprobleme suprapuse și o structură optimă (sol. optimă conține sol. opt. ale subproblemelor), e candidată pentru PD.
:::

### 🔮 3.6.3 Citește și prezice

```python
@lru_cache(None)
def fib(n):
    if n < 2: return n
    return fib(n-1) + fib(n-2)
print(fib(10))
```

### 🤝 3.6.4 Exerciții ghidate

Calculează numărul de căi de la colțul stânga-sus la dreapta-jos într-o grilă `m×n`, mișcând doar dreapta sau jos, folosind PD.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: declarare date
val1 = 15
val2 = 30

# Pasul 2: calcul
total = ___ + ___  # Completează variabilele
print("Total:", ___)
```


### 🎯 3.6.5 Exerciții independente

Scrie PD pentru "numărul de moduri de a face suma `s` cu monede dintr-o listă dată".


**Exercițiul 1.** Scrie un program Python care rezolvă cerința directă folosind concepte din acest modul.

**Exercițiul 2.** Extinde programul anterior adăugând afișare formatată și validare minimală.


### ✅ 3.6.6 Verifică-ți înțelegerea

De ce Fibonacci recursiv naiv e O(2ⁿ), iar cu memoizare devine O(n)?

---


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
output: 2
:::

# Modulul 3.7 — Modelul conceptual graf: concepte de bază

### 🔄 3.7.1 Recapitulare

Ai lucrat cu liste, arbori, mulțimi. Un **graf** e o structură mai generală: o mulțime de noduri (vârfuri) legate prin muchii.

### 💡 3.7.2 Concept nou și exemplu

Un **graf** G = (V, E) are:
- **V** — mulțimea de vârfuri (noduri)
- **E** — mulțimea de muchii (perechi de vârfuri legate)

Graf **orientat**: muchiile au sens (A→B ≠ B→A). Graf **neorientat**: muchiile n-au sens.
**Gradul** unui vârf = numărul de muchii care îl ating. În grafurile orientate: grad intrare / grad ieșire.


```python
# Exemplu practic de cod Python pentru modulul 3.7
def exemplu_demonstrativ():
    # Implementare de bază
    valoare = 10
    return valoare * 2

print("Rezultat:", exemplu_demonstrativ())
```


:::tip
Multe probleme reale sunt grafuri: rețele sociale (noduri=oameni), hărți (noduri=orașe), dependențe de task-uri.
:::

### 🔮 3.7.3 Citește și prezice

```python
# Un graf are 5 varfuri si 7 muchii neorientate.
# Care e suma gradelor tuturor varfurilor?
```

### 🤝 3.7.4 Exerciții ghidate

Reprezintă un graf cu 4 vârfuri și muchiile (1,2), (2,3), (3,4), (1,4) și calculează gradul fiecărui vârf.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: declarare date
val1 = 15
val2 = 30

# Pasul 2: calcul
total = ___ + ___  # Completează variabilele
print("Total:", ___)
```


### 🎯 3.7.5 Exerciții independente

Scrie o funcție care verifică dacă un graf neorientat e **complet** (orice pereche de vârfuri e legată).


**Exercițiul 1.** Scrie un program Python care rezolvă cerința directă folosind concepte din acest modul.

**Exercițiul 2.** Extinde programul anterior adăugând afișare formatată și validare minimală.


### ✅ 3.7.6 Verifică-ți înțelegerea

De ce în orice graf neorientat, suma gradelor tuturor vârfurilor e egală cu 2 × numărul de muchii?

---


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
output: 2
:::

# Modulul 3.8 — Reprezentarea grafurilor (matrice, liste de adiacență)

### 🔄 3.8.1 Recapitulare

În 3.7 ai definit un graf teoretic. Ca să lucrezi cu el în program, îl reprezentăm în memorie.

### 💡 3.8.2 Concept nou și exemplu

**Matrice de adiacență:** tablou `n×n`, unde `a[i][j] = 1` dacă există muchie i–j (sau greutatea muchiei).
**Listă de adiacență:** pentru fiecare vârf, o listă cu vecinii săi.

```python
# Lista de adiacenta pentru graful (1,2),(2,3),(1,3)
adiacenta = {
    1: [2, 3],
    2: [1, 3],
    3: [1, 2],
}
```

| Reprezentare | Spațiu | Verifică muchie | Iterează vecini |
|---|---|---|---|
| Matrice | O(n²) | O(1) | O(n) |
| Listă | O(n+m) | O(grad) | O(grad) |

:::atentie
La grafuri cu multe vârfuri și puține muchii (sparse), lista de adiacență e mult mai eficientă decât matricea.
:::


:::tip
## Sfaturi & Bune Practici Didactice
Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.
:::

### 🔮 3.8.3 Citește și prezice

```python
adiacenta = {1:[2,3], 2:[1], 3:[1,2]}
# Cat are gradul varfului 1?
```

### 🤝 3.8.4 Exerciții ghidate

Scrie o funcție care convertește o listă de muchii într-o listă de adiacență.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: declarare date
val1 = 15
val2 = 30

# Pasul 2: calcul
total = ___ + ___  # Completează variabilele
print("Total:", ___)
```


### 🎯 3.8.5 Exerciții independente

Scrie o funcție care verifică dacă există muchie între două vârfuri date, folosind lista de adiacență.


**Exercițiul 1.** Scrie un program Python care rezolvă cerința directă folosind concepte din acest modul.

**Exercițiul 2.** Extinde programul anterior adăugând afișare formatată și validare minimală.


### ✅ 3.8.6 Verifică-ți înțelegerea

Când preferi matricea de adiacență în detrimentul listei?

---


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
output: 2
:::

# Modulul 3.9 — Tipuri de grafuri (complet, conex, ponderat, hamiltonian, eulerian)

### 🔄 3.9.1 Recapitulare

În 3.8 ai văzut cum reprezentăm un graf. Acum clasificăm grafurile după proprietăți.

### 💡 3.9.2 Concept nou și exemplu

- **Complet**: orice pereche de vârfuri e legată (Kₙ are n(n−1)/2 muchii).
- **Conex**: orice două vârfuri sunt unite printr-un drum.
- **Ponderat**: muchiile au o valoare (cost, distanță).
- **Eulerian**: are un circuit care trece prin fiecare muchie exact o dată (toate gradele pare, sau 0/2 impare pentru circuit/ciclu).
- **Hamiltonian**: are un ciclu care vizitează fiecare vârf exact o dată.


```python
# Exemplu practic de cod Python pentru modulul 3.9
def exemplu_demonstrativ():
    # Implementare de bază
    valoare = 10
    return valoare * 2

print("Rezultat:", exemplu_demonstrativ())
```


:::tip
Euler = muchii (muchie = latură), Hamilton = vârfuri (ham = nod). Un truc să ții minte: E=muchii, H=vârfuri.
:::

### 🔮 3.9.3 Citește și prezice

```python
# Un graf complet K4 are 4 varfuri. Cate muchii are?
```

### 🤝 3.9.4 Exerciții ghidate

Scrie o funcție care verifică dacă un graf neorientat e conex (parcurge din orice vârf și vezi dacă ajungi la toate).


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: declarare date
val1 = 15
val2 = 30

# Pasul 2: calcul
total = ___ + ___  # Completează variabilele
print("Total:", ___)
```


### 🎯 3.9.5 Exerciții independente

Scrie o funcție care verifică dacă un graf are toate gradele pare (condiție pentru circuit eulerian).


**Exercițiul 1.** Scrie un program Python care rezolvă cerința directă folosind concepte din acest modul.

**Exercițiul 2.** Extinde programul anterior adăugând afișare formatată și validare minimală.


### ✅ 3.9.6 Verifică-ți înțelegerea

De ce găsirea unui ciclu hamiltonian e mult mai grea (NP-completă) decât verificarea unui circuit eulerian?

---


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
output: 2
:::

# Modulul 3.10 — Parcurgerea grafurilor: BFS

### 🔄 3.10.1 Recapitulare

Ai reprezentat grafuri (3.8) și le-ai clasificat (3.9). Ca să le explorăm, folosim parcurgeri.

### 💡 3.10.2 Concept nou și exemplu

**BFS (Breadth-First Search)** explorează pe "niveluri": mai întâi vârful de start, apoi toți vecinii săi, apoi vecinii vecinilor. Folosește o **coadă**.

```python
from collections import deque
def bfs(adiacenta, start):
    viz = {start}
    coada = deque([start])
    while coada:
        v = coada.popleft()
        for u in adiacenta[v]:
            if u not in viz:
                viz.add(u)
                coada.append(u)
    return viz
```

BFS găsește drumul cel mai scurt în număr de muchii (în graf neponderat).

:::tip
BFS = coadă (FIFO), explorează "în lățime". DFS = stivă/recursivitate, explorează "în adâncime".
:::

### 🔮 3.10.3 Citește și prezice

```python
adiacenta = {1:[2,3], 2:[4], 3:[4], 4:[]}
# In ce ordine viziteaza BFS pornind din 1?
```

### 🤝 3.10.4 Exerciții ghidate

Scrie BFS care returnează drumul cel mai scurt (lista de vârfuri) de la start la o țintă.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: declarare date
val1 = 15
val2 = 30

# Pasul 2: calcul
total = ___ + ___  # Completează variabilele
print("Total:", ___)
```


### 🎯 3.10.5 Exerciții independente

Numără componentele conexe ale unui graf folosind BFS repetat.


**Exercițiul 1.** Scrie un program Python care rezolvă cerința directă folosind concepte din acest modul.

**Exercițiul 2.** Extinde programul anterior adăugând afișare formatată și validare minimală.


### ✅ 3.10.6 Verifică-ți înțelegerea

De ce BFS găsește întotdeauna drumul cu număr minim de muchii între două vârfuri?


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
output: 2
:::
