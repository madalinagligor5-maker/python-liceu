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

## Problemă rezolvată pas cu pas

**Enunț.** Rucsacul 0/1: un rucsac duce cel mult 10 kg. Avem obiecte cu (greutate, valoare). Alegem obiectele astfel încât valoarea totală să fie maximă. Greedy nu garantează optimul aici, dar PD da.

**Ideea.** `dp[c]` = valoarea maximă cu capacitatea c. Pentru fiecare obiect parcurgem capacitățile **descrescător** (ca fiecare obiect să fie folosit o singură dată): `dp[c] = max(dp[c], dp[c - g] + v)`.

```python
obiecte = [(5, 10), (4, 40), (6, 30), (3, 50)]
cap = 10
dp = [0] * (cap + 1)
for g, v in obiecte:
    for c in range(cap, g - 1, -1):
        dp[c] = max(dp[c], dp[c - g] + v)
print(dp[cap])
```
Rezultatul: `90`.

:::atentie
## Greșeli frecvente
- Folosești PD fără să definești clar ce înseamnă `dp[i]`. Scrie întâi în cuvinte: „dp[i] = numărul de moduri pentru suma i”.
- Uiți cazul de bază (de exemplu `dp[0] = 1`): tot tabelul rămâne 0.
- Completezi tabelul într-o ordine în care folosești valori încă necalculate.
- La problema monedelor, inversezi buclele și numeri combinațiile în toate ordinile (1+2 și 2+1 de două ori), deși ți se cer doar combinațiile.
:::

### 🔮 3.6.3 Citește și prezice

```python
from functools import lru_cache
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
# Numarul de drumuri intr-o grila m x n (doar dreapta/jos)
m, n = 3, 4
drumuri = [[1] * n for _ in range(m)]

for i in range(1, m):
    for j in range(1, n):
        drumuri[i][j] = drumuri[i - 1][j] + drumuri[___][___]  # Completează indicii vecinului din stânga

print("Numar de drumuri:", drumuri[___][___])  # Completează coltul dreapta-jos
```


### 🎯 3.6.5 Exerciții independente

Scrie PD pentru "numărul de moduri de a face suma `s` cu monede dintr-o listă dată".


**Exercițiul 1.** Scrie o funcție `moduri_suma(monede, s)` care calculează, folosind programare dinamică (un tabel `dp` de dimensiune `s + 1`), în câte moduri poți obține suma `s` folosind monedele date, dacă fiecare monedă poate fi folosită de oricâte ori.

**Exercițiul 2.** Extinde funcția anterioară astfel încât să reconstituie și să afișeze un exemplu concret de combinație de monede care formează suma `s`, nu doar numărul total de moduri.


### ✅ 3.6.6 Verifică-ți înțelegerea

1. De ce complexitatea lui Fibonacci recursiv naiv este O(2ⁿ), iar cu memoizare devine O(n)?
   a) pentru că memoizarea rulează codul pe mai multe fire de execuție în paralel  b) **pentru că fără memoizare aceleași subprobleme (aceleași valori ale lui n) sunt recalculate de nenumărate ori, iar memoizarea le calculează o singură dată**  c) pentru că memoizarea înlocuiește complet recursivitatea cu o singură buclă `for`  d) pentru că varianta naivă folosește liste, iar cea memoizată folosește dicționare, care sunt mai rapide
      > Fără memoizare, `fib(n-1)` și `fib(n-2)` recalculează de la zero aceleași valori mici de n de foarte multe ori, ceea ce duce la o explozie de apeluri; cu `lru_cache`, fiecare valoare a lui n e calculată o singură dată și refolosită la orice apel ulterior, deci munca totală crește liniar cu n.

2. Care sunt cele două proprietăți care fac o problemă potrivită pentru programare dinamică?
   a) Recursivitate și buclă `while`  b) **Subprobleme care se suprapun și substructură optimă**  c) Date sortate și unice
      > Subproblemele se repetă (deci merită memorate), iar soluția optimă se construiește din soluțiile optime ale subproblemelor.

3. Ce face `@lru_cache` aplicat unei funcții recursive?
   a) O face iterativă  b) **Memorează rezultatul pentru fiecare argument și nu-l mai recalculează**  c) Limitează numărul de apeluri la 128
      > La al doilea apel cu același argument, rezultatul vine direct din memorie; de aceea Fibonacci devine liniar.

4. În câte moduri urci 5 trepte, cu pași de 1 sau 2?
   a) 5  b) **8**  c) 10
      > w(n) = w(n-1) + w(n-2), cu w(1) = 1 și w(2) = 2: 1, 2, 3, 5, 8.

---


:::verifica-cod
Scrie o funcție `numar_moduri(n)` care calculează, folosind programare dinamică, în câte moduri poți urca o scară cu `n` trepte, dacă la fiecare pas urci 1 sau 2 trepte. Demo: `numar_moduri(4)` -> `5`
template: def numar_moduri(n):
    # completeaza
    pass

print(numar_moduri(4))
output: 5
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
# Reprezentam un graf neorientat si calculam gradul fiecarui varf
graf = {
    1: [2, 4],
    2: [1, 3],
    3: [2, 4],
    4: [1, 3],
}

def grad(varf):
    return len(graf[varf])

for v in graf:
    print(f"Varful {v} are gradul {grad(v)}")
```


:::tip
Multe probleme reale sunt grafuri: rețele sociale (noduri=oameni), hărți (noduri=orașe), dependențe de task-uri.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Avem lista „cine îl urmărește pe cine” într-o rețea socială (graf orientat). Calculăm, pentru fiecare persoană, câți urmăritori are (grad de intrare) și pe câți urmărește (grad de ieșire).

**Ideea.** Fiecare muchie (a, b) mărește gradul de ieșire al lui a și gradul de intrare al lui b. Parcurgem o singură dată lista de muchii.

```python
urmareste = [('ana', 'dan'), ('ion', 'dan'), ('dan', 'ana'), ('eva', 'dan'), ('ana', 'eva')]
persoane = sorted({p for m in urmareste for p in m})
intrare = {p: 0 for p in persoane}
iesire = {p: 0 for p in persoane}
for a, b in urmareste:
    iesire[a] += 1
    intrare[b] += 1
for p in persoane:
    print(p, intrare[p], iesire[p])
```
Rezultatul:
```text
ana 1 2
dan 3 1
eva 1 1
ion 0 1
```

:::atentie
## Greșeli frecvente
- Într-un graf neorientat adaugi muchia doar într-un sens (`graf[a].append(b)`), uitând `graf[b].append(a)`: gradele ies greșite.
- Numeri muchiile adunând gradele, dar uiți să împarți la 2: fiecare muchie apare la ambele capete.
- Confunzi gradul de intrare cu cel de ieșire într-un graf orientat.
- Pui de două ori aceeași muchie în listă: gradele cresc greșit. Folosește mulțimi dacă datele pot avea dubluri.
:::

### 🔮 3.7.3 Citește și prezice

```python
noduri = 5
muchii = 7
suma_grade = 2 * muchii
print(suma_grade)
```

### 🤝 3.7.4 Exerciții ghidate

Reprezintă un graf cu 4 vârfuri și muchiile (1,2), (2,3), (3,4), (1,4) și calculează gradul fiecărui vârf.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Graful cu muchiile (1,2), (2,3), (3,4), (1,4)
muchii = [(1, 2), (2, 3), (3, 4), (1, 4)]
grade = {1: 0, 2: 0, 3: 0, 4: 0}

for a, b in muchii:
    grade[___] += 1  # Completează cu primul varf al muchiei
    grade[___] += 1  # Completează cu al doilea varf al muchiei

for varf, g in grade.items():
    print("Varful", varf, "are gradul", ___)  # Completează cu gradul curent
```


### 🎯 3.7.5 Exerciții independente

Scrie o funcție care verifică dacă un graf neorientat e **complet** (orice pereche de vârfuri e legată).


**Exercițiul 1.** Scrie o funcție `este_complet(graf)` care primește un graf neorientat reprezentat ca dicționar de liste de adiacență și returnează `True` dacă fiecare vârf are gradul `n - 1`, unde `n` e numărul total de vârfuri.

**Exercițiul 2.** Testează funcția `este_complet` pe graful K4 (4 vârfuri, toate legate între ele) și pe un graf cu aceleași 4 vârfuri căruia îi lipsește o singură muchie, afișând rezultatul pentru fiecare caz.


### ✅ 3.7.6 Verifică-ți înțelegerea

1. De ce suma gradelor tuturor vârfurilor unui graf neorientat este egală cu 2 × numărul de muchii?
   a) pentru că fiecare vârf are, în medie, gradul egal cu numărul total de muchii din graf  b) pentru că fiecare muchie leagă întotdeauna două vârfuri care au același grad  c) **pentru că fiecare muchie contribuie cu 1 la gradul fiecăruia din cele două vârfuri pe care le leagă, deci e numărată de două ori în suma gradelor**  d) pentru că un graf neorientat are întotdeauna un număr par de muchii
      > Fiecare muchie a grafului leagă exact două vârfuri, deci contribuie cu 1 la gradul fiecăruia dintre ele; când aduni gradele tuturor vârfurilor, fiecare muchie e numărată de două ori, o dată pentru fiecare capăt al ei, de unde factorul 2 din formulă.

2. Un graf neorientat are 6 muchii. Cât este suma gradelor tuturor vârfurilor?
   a) 6  b) **12**  c) 36
      > Fiecare muchie contribuie cu 1 la gradul fiecăruia dintre cele două capete, deci suma gradelor este 2 · 6 = 12.

3. Într-un graf orientat, gradul de ieșire al unui vârf înseamnă:
   a) Numărul de muchii care intră în el  b) **Numărul de muchii care pleacă din el**  c) Numărul total de vârfuri
      > Muchiile orientate au un sens; cele care pleacă din vârf formează gradul de ieșire, cele care sosesc formează gradul de intrare.

4. Poate exista un graf neorientat cu 3 vârfuri având gradele 1, 1 și 1?
   a) Da  b) **Nu, suma gradelor ar fi impară**  c) Doar dacă e orientat
      > Suma gradelor este întotdeauna 2 · numărul de muchii, deci pară; 1 + 1 + 1 = 3 este imposibil.

---


:::verifica-cod
Scrie o funcție `vecini_comuni(graf, a, b)` care returnează lista vârfurilor care sunt vecini atât pentru `a`, cât și pentru `b`, într-un graf reprezentat ca dicționar de liste de adiacență. Demo: `vecini_comuni({1:[2,3],2:[1,3],3:[1,2]}, 1, 2)` -> `[3]`
template: def vecini_comuni(graf, a, b):
    # completeaza
    pass

print(vecini_comuni({1:[2,3],2:[1,3],3:[1,2]}, 1, 2))
output: [3]
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
## Cum alegi reprezentarea potrivită
Dacă trebuie să răspunzi rapid la întrebarea „există muchie între x și y?" pe un graf dens, matricea de adiacență e mai potrivită (răspuns în O(1)). Dacă parcurgi des vecinii unui vârf, ca la BFS/DFS, sau graful e rar (puține muchii față de numărul de vârfuri), lista de adiacență economisește memorie și timp.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Pornind de la lista de muchii a unui graf neorientat cu vârfurile 1–4, construim și matricea, și listele de adiacență, apoi verificăm că dau aceleași grade.

**Ideea.** Matricea are n linii și n coloane (indicele i corespunde vârfului i + 1). Listele le construim cu `setdefault`. Gradul unui vârf este suma liniei din matrice, respectiv lungimea listei.

```python
n = 4
muchii = [(1, 2), (1, 3), (2, 3), (3, 4)]
a = [[0] * n for _ in range(n)]
liste = {v: [] for v in range(1, n + 1)}
for x, y in muchii:
    a[x - 1][y - 1] = a[y - 1][x - 1] = 1
    liste[x].append(y)
    liste[y].append(x)
for linie in a:
    print(linie)
print([sum(l) for l in a] == [len(liste[v]) for v in range(1, n + 1)])
```
Rezultatul:
```text
[0, 1, 1, 0]
[1, 0, 1, 0]
[1, 1, 0, 1]
[0, 0, 1, 0]
True
```

:::atentie
## Greșeli frecvente
- Numerotezi vârfurile de la 1, dar matricea are indicii de la 0: `a[1][2]` se referă de fapt la vârfurile 2 și 3. Fie scazi 1, fie creezi o matrice cu n + 1 linii.
- Construiești matricea cu `[[0] * n] * n`: toate liniile sunt aceeași listă și o muchie apare peste tot.
- La un graf neorientat setezi doar `a[i][j] = 1`, nu și `a[j][i] = 1`: matricea trebuie să fie simetrică.
- Folosești matricea pentru un graf cu mii de vârfuri și puține muchii: ocupi memorie inutil. Listele de adiacență sunt mai potrivite.
:::

### 🔮 3.8.3 Citește și prezice

```python
adiacenta = {1: [2, 3], 2: [1], 3: [1, 2]}
print(len(adiacenta[1]))
```

### 🤝 3.8.4 Exerciții ghidate

Scrie o funcție care convertește o listă de muchii într-o listă de adiacență.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Conversia unei liste de muchii intr-o lista de adiacenta
muchii = [(1, 2), (2, 3), (1, 3)]
adiacenta = {}

for a, b in muchii:
    adiacenta.setdefault(a, []).append(___)  # Completează cu celălalt capăt al muchiei
    adiacenta.setdefault(___, []).append(a)  # Completează cu primul varf, graful e neorientat

print(adiacenta)
```


### 🎯 3.8.5 Exerciții independente

Scrie o funcție care verifică dacă există muchie între două vârfuri date, folosind lista de adiacență.


**Exercițiul 1.** Scrie o funcție `exista_muchie(adiacenta, x, y)` care primește un graf reprezentat ca listă de adiacență (dicționar vârf → listă vecini) și returnează `True` dacă există muchie între vârfurile `x` și `y`.

**Exercițiul 2.** Folosind aceeași reprezentare, scrie o funcție `numara_muchii(adiacenta)` care calculează numărul total de muchii ale unui graf neorientat, având grijă să nu numeri fiecare muchie de două ori.


### ✅ 3.8.6 Verifică-ți înțelegerea

1. În ce situație este mai potrivită matricea de adiacență decât lista de adiacență?
   a) când graful are foarte multe vârfuri și foarte puține muchii (graf rar)  b) când parcurgi frecvent toți vecinii unui vârf, ca la BFS sau DFS  c) **când graful e dens și ai nevoie frecvent să verifici rapid, în O(1), dacă există muchie între două vârfuri date**  d) când vrei să economisești cât mai multă memorie la un graf cu mii de vârfuri
      > Matricea de adiacență ține direct valoarea `a[i][j]` pentru orice pereche de vârfuri, deci verificarea existenței unei muchii se face printr-un singur acces, în O(1); pe un graf dens, unde oricum aproape toate perechile sunt legate, această verificare rapidă contează mai mult decât spațiul suplimentar O(n²) ocupat.

2. Matricea de adiacență a unui graf neorientat este întotdeauna:
   a) Diagonală  b) **Simetrică față de diagonala principală**  c) Plină de 1
      > Muchia i–j este aceeași cu muchia j–i, deci a[i][j] = a[j][i].

3. Câtă memorie ocupă matricea de adiacență pentru un graf cu 1000 de vârfuri?
   a) 1000 de valori  b) **1 000 000 de valori, indiferent de numărul de muchii**  c) Doar cât numărul de muchii
      > Matricea are n · n celule; numărul de muchii nu schimbă dimensiunea ei.

4. Cum afli gradul vârfului i din matricea de adiacență (graf neorientat, fără bucle)?
   a) Citești a[i][i]  b) **Aduni valorile de pe linia i**  c) Numeri liniile
      > Pe linia i, fiecare 1 marchează un vecin; suma liniei este chiar numărul de vecini.

---


:::verifica-cod
Scrie o funcție `la_matrice(adiacenta, n)` care convertește un graf cu vârfurile `1..n`, dat ca listă de adiacență, într-o matrice de adiacență (listă de liste cu 0/1). Demo: `la_matrice({1:[2],2:[1,3],3:[2]}, 3)` -> `[[0, 1, 0], [1, 0, 1], [0, 1, 0]]`
template: def la_matrice(adiacenta, n):
    # completeaza
    pass

print(la_matrice({1:[2],2:[1,3],3:[2]}, 3))
output: [[0, 1, 0], [1, 0, 1], [0, 1, 0]]
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
# Verificam daca un graf neorientat este complet
def este_complet(graf):
    n = len(graf)
    for v in graf:
        if len(graf[v]) != n - 1:
            return False
    return True

graf = {1: [2, 3], 2: [1, 3], 3: [1, 2]}
print("Graful este complet:", este_complet(graf))
```


:::tip
Euler = muchii (muchie = latură), Hamilton = vârfuri (ham = nod). Un truc să ții minte: E=muchii, H=vârfuri.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Problema podurilor: un oraș are 4 cartiere legate prin poduri. Verificăm dacă putem trece pe fiecare pod exact o dată și ne putem întoarce de unde am plecat.

**Ideea.** Un circuit eulerian există dacă graful e conex (pentru vârfurile cu muchii) și toate gradele sunt pare. Dacă exact două vârfuri au grad impar, există doar un drum eulerian, care pornește dintr-unul și se termină în celălalt.

```python
poduri = [('A', 'B'), ('A', 'B'), ('A', 'C'), ('A', 'C'), ('A', 'D'), ('B', 'D'), ('C', 'D')]
grad = {}
for x, y in poduri:
    grad[x] = grad.get(x, 0) + 1
    grad[y] = grad.get(y, 0) + 1
impare = [v for v in sorted(grad) if grad[v] % 2]
print(grad)
print('vârfuri de grad impar:', impare)
```
Rezultatul:
```text
{'A': 5, 'B': 3, 'C': 3, 'D': 3}
vârfuri de grad impar: ['A', 'B', 'C', 'D']
```

:::atentie
## Greșeli frecvente
- Confunzi eulerian cu hamiltonian: eulerian înseamnă **muchii** parcurse o singură dată, hamiltonian înseamnă **vârfuri** vizitate o singură dată.
- Verifici doar gradele pare și uiți condiția de conexitate: un graf cu două cicluri separate are toate gradele pare, dar nu are un circuit eulerian.
- Crezi că un graf complet cu n vârfuri are n · (n - 1) muchii. Corect este n · (n - 1) / 2: fiecare muchie e numărată o singură dată.
- Consideri un graf cu un singur vârf izolat „neconex” sau „conex” fără să te gândești. Stabilește clar ce înseamnă conexitatea pentru exemplul tău.
:::

### 🔮 3.9.3 Citește și prezice

```python
n = 4
muchii_complet = n * (n - 1) // 2
print(muchii_complet)
```

### 🤝 3.9.4 Exerciții ghidate

Scrie o funcție care verifică dacă un graf neorientat e conex (parcurge din orice vârf și vezi dacă ajungi la toate).


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Verificam daca un graf neorientat este conex, folosind parcurgere DFS
def este_conex(graf):
    start = next(iter(graf))
    vizitate = set()
    stiva = [start]
    while stiva:
        v = stiva.pop()
        if v not in vizitate:
            vizitate.add(___)  # Completează cu vârful curent
            for vecin in graf[v]:
                stiva.append(___)  # Completează cu vecinul din graf[v]
    return len(vizitate) == ___  # Completează cu numărul total de vârfuri din graf
```


### 🎯 3.9.5 Exerciții independente

Scrie o funcție care verifică dacă un graf are toate gradele pare (condiție pentru circuit eulerian).


**Exercițiul 1.** Scrie o funcție `are_toate_gradele_pare(graf)` care primește un graf neorientat (dicționar vârf → listă vecini) și returnează `True` dacă fiecare vârf are grad par — condiția necesară pentru existența unui circuit eulerian.

**Exercițiul 2.** Testează funcția pe graful-ciclu cu 5 vârfuri (fiecare vârf legat de următoarele două, formând un pentagon) și pe un graf „stea" (un vârf central legat de toate celelalte), explicând într-un comentariu de ce rezultatele diferă.


### ✅ 3.9.6 Verifică-ți înțelegerea

1. De ce a găsi un ciclu hamiltonian este mult mai greu (problemă NP-completă) decât a verifica existența unui circuit eulerian?
   a) pentru că ciclul hamiltonian trebuie să treacă prin fiecare muchie a grafului, nu doar prin fiecare vârf, ceea ce implică mult mai multe verificări  b) **pentru că circuitul eulerian are o condiție simplă și rapid verificabilă (toate gradele pare), pe când pentru hamiltonian nu există o condiție similară și trebuie explorate combinatorial ordinile posibile ale vârfurilor**  c) pentru că un ciclu hamiltonian există doar în grafurile orientate, iar circuitul eulerian doar în cele neorientate  d) pentru că verificarea circuitului eulerian se face cu BFS, în timp ce ciclul hamiltonian necesită obligatoriu programare dinamică
      > Pentru circuitul eulerian există o condiție simplă și rapidă de verificat — toate gradele vârfurilor sunt pare —, în timp ce pentru ciclul hamiltonian nu există o astfel de regulă directă, așa că trebuie explorate combinatorial ordinile posibile de vizitare a vârfurilor, ceea ce face problema mult mai costisitoare.

2. Câte muchii are graful complet cu 6 vârfuri?
   a) 30  b) **15**  c) 12
      > K₆ are 6 · 5 / 2 = 15 muchii: fiecare dintre cele 6 vârfuri e legat de celelalte 5, iar fiecare muchie se numără o singură dată.

3. Un graf conex are exact două vârfuri de grad impar. Ce putem spune?
   a) Are circuit eulerian  b) **Are un drum eulerian, care pornește dintr-un vârf impar și se termină în celălalt**  c) Nu poate fi parcurs deloc
      > Cu două vârfuri impare nu te poți întoarce la start, dar poți parcurge fiecare muchie o dată pornind dintr-unul dintre ele.

4. Ce înseamnă că un graf e ponderat?
   a) Are toate vârfurile de același grad  b) **Fiecare muchie are un cost (o valoare numerică)**  c) Are muchii orientate
      > Ponderea poate fi o distanță, un timp sau un preț; algoritmii de drum minim lucrează cu aceste valori.

---


:::verifica-cod
Scrie o funcție `suma_ponderi(graf)` care primește un graf ponderat neorientat, reprezentat ca dicționar vârf -> listă de tupluri `(vecin, pondere)`, și returnează suma ponderilor tuturor muchiilor, numărând fiecare muchie o singură dată. Demo: `suma_ponderi({1:[(2,5),(3,2)], 2:[(1,5)], 3:[(1,2)]})` -> `7`
template: def suma_ponderi(graf):
    # completeaza
    pass

print(suma_ponderi({1:[(2,5),(3,2)], 2:[(1,5)], 3:[(1,2)]}))
output: 7
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

## Problemă rezolvată pas cu pas

**Enunț.** Un labirint e o grilă: `#` e zid, `.` e liber. Aflăm cu BFS numărul minim de pași de la S la F (mișcări sus, jos, stânga, dreapta).

**Ideea.** Fiecare celulă liberă e un vârf al unui graf, cu muchii către celulele libere vecine. BFS din S dă distanța minimă: prima dată când ajungem la F, am folosit cei mai puțini pași.

```python
from collections import deque
lab = ['S.#.....',
       '.##.###.',
       '....#...',
       '.##...#F']
start = (0, 0)
dist = {start: 0}
coada = deque([start])
while coada:
    i, j = coada.popleft()
    if lab[i][j] == 'F':
        print(dist[(i, j)])
        break
    for di, dj in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        x, y = i + di, j + dj
        if 0 <= x < len(lab) and 0 <= y < len(lab[0]) and lab[x][y] != '#' and (x, y) not in dist:
            dist[(x, y)] = dist[(i, j)] + 1
            coada.append((x, y))
```
Rezultatul: `12`.

:::atentie
## Greșeli frecvente
- Marchezi vârful ca vizitat abia când îl scoți din coadă: același vârf poate intra de mai multe ori în coadă. Marchează-l când îl **adaugi**.
- Folosești `lista.pop()` în loc de `popleft()`: obții o parcurgere în adâncime, nu în lățime.
- Pornești BFS o singură dată pe un graf neconex și crezi că ai vizitat tot graful.
- Folosești BFS pentru drum minim într-un graf **ponderat**: BFS numără muchiile, nu costurile. Acolo ai nevoie de Dijkstra.
:::

### 🔮 3.10.3 Citește și prezice

```python
from collections import deque

def bfs(adiacenta, start):
    viz = {start}
    coada = deque([start])
    ordine = []
    while coada:
        v = coada.popleft()
        ordine.append(v)
        for u in adiacenta[v]:
            if u not in viz:
                viz.add(u)
                coada.append(u)
    return ordine

adiacenta = {1: [2, 3], 2: [4], 3: [4], 4: []}
print(*bfs(adiacenta, 1))
```

### 🤝 3.10.4 Exerciții ghidate

Scrie BFS care returnează drumul cel mai scurt (lista de vârfuri) de la start la o țintă.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# BFS care returneaza drumul cel mai scurt de la start la tinta
from collections import deque

def drum_minim(adiacenta, start, tinta):
    parinte = {start: None}
    coada = deque([start])

    while coada:
        v = coada.popleft()
        if v == tinta:
            break
        for u in adiacenta[v]:
            if u not in parinte:
                parinte[___] = v  # Completează cu vecinul descoperit
                coada.append(___)  # Completează cu vecinul descoperit

    drum = [tinta]
    while drum[-1] != start:
        drum.append(parinte[___])  # Completează cu ultimul varf adaugat in drum
    drum.reverse()
    return drum
```


### 🎯 3.10.5 Exerciții independente

Numără componentele conexe ale unui graf folosind BFS repetat.


**Exercițiul 1.** Scrie o funcție `numara_componente(adiacenta)` care primește un graf neorientat (listă de adiacență) și returnează numărul de componente conexe, rulând BFS din fiecare vârf nevizitat.

**Exercițiul 2.** Modifică funcția `numara_componente` să returneze și componentele efective (fiecare componentă fiind lista vârfurilor din ea), nu doar numărul lor.


### ✅ 3.10.6 Verifică-ți înțelegerea

1. De ce BFS găsește întotdeauna drumul cu numărul minim de muchii între două vârfuri (în graf neponderat)?
   a) pentru că BFS folosește o stivă care garantează explorarea celui mai scurt drum mai întâi  b) **pentru că BFS explorează vârfurile în ordinea distanței față de start, nivel cu nivel, folosind o coadă FIFO, deci primul drum găsit către țintă este cel mai scurt**  c) pentru că BFS marchează fiecare vârf ca vizitat înainte de a-l pune în coadă, ceea ce elimină automat drumurile mai lungi  d) pentru că BFS repetă parcurgerea grafului de mai multe ori, până găsește cea mai scurtă cale
      > BFS folosește o coadă FIFO și avansează nivel cu nivel, deci vizitează toate vârfurile aflate la distanță 1 înainte de cele la distanță 2 și așa mai departe; astfel, prima dată când ajunge la vârful țintă, acesta se află pe drumul cu cele mai puține muchii posibil.

2. Ce structură de date folosește BFS?
   a) Stiva  b) **Coada (FIFO)**  c) Heap-ul
      > Coada scoate vârfurile în ordinea în care au fost descoperite, deci întâi toate de pe nivelul 1, apoi de pe nivelul 2 și așa mai departe.

3. Pornind din 1 în graful {1:[2,3], 2:[4], 3:[4], 4:[]}, în ce ordine vizitează BFS vârfurile (vecinii în ordinea din listă)?
   a) 1 2 4 3  b) **1 2 3 4**  c) 1 3 2 4
      > Întâi vârful 1, apoi vecinii lui (2 și 3), apoi vecinul lor nevizitat (4).

4. De ce marcăm un vârf ca vizitat în momentul în care îl adăugăm în coadă?
   a) Ca să fie scos mai repede  b) **Ca să nu fie adăugat de mai multe ori în coadă**  c) Pentru că așa cere `deque`
      > Dacă am marca abia la scoatere, un vârf cu mai mulți vecini deja descoperiți ar intra în coadă de mai multe ori.

---


:::verifica-cod
Scrie o funcție `distanta_bfs(adiacenta, start, tinta)` care calculează, folosind BFS, numărul minim de muchii de la `start` la `tinta` (sau `-1` dacă `tinta` nu e accesibilă). Demo: `distanta_bfs({1:[2,3],2:[4],3:[4],4:[]}, 1, 4)` -> `2`
template: def distanta_bfs(adiacenta, start, tinta):
    # completeaza
    pass

print(distanta_bfs({1:[2,3],2:[4],3:[4],4:[]}, 1, 4))
output: 2
:::
