# Modulul 3.11 — Parcurgerea grafurilor: DFS

### 🔄 3.11.1 Recapitulare

În 3.10 ai folosit BFS (coadă) pentru a explora un graf pe niveluri. DFS e cealaltă abordare fundamentală.

### 💡 3.11.2 Concept nou și exemplu

**DFS (Depth-First Search)** explorează "în adâncime": merge cât mai departe pe o ramură, apoi revine. Se implementează recursiv sau cu o stivă.

```python
def dfs(adiacenta, v, viz=None):
    if viz is None:
        viz = set()
    viz.add(v)
    for u in adiacenta[v]:
        if u not in viz:
            dfs(adiacenta, u, viz)
    return viz
```

DFS e utilă pentru: detectat cicluri, sortare topologică, componente tare conexe, explorat labirinturi.

:::tip
Diferența vizuală: BFS se răspândește ca o undă; DFS "coboară" până la capăt apoi se întoarce.
:::

### 🔮 3.11.3 Citește și prezice

```python
adiacenta = {1:[2,3], 2:[4], 3:[4], 4:[]}
# In ce ordine viziteaza DFS pornind din 1 (vecini in ordine)?
```

### 🤝 3.11.4 Exerciții ghidate

Scrie DFS iterativ (cu o stivă explicită) care afișează ordinea vizitării.

### 🎯 3.11.5 Exerciții independente

Detectează dacă un graf neorientat conține un ciclu, folosind DFS.

### ✅ 3.11.6 Verifică-ți înțelegerea

De ce DFS recursează natural, în timp ce BFS are nevoie de o coadă?

---

# Modulul 3.12 — Matricea drumurilor — algoritmul Roy-Warshall

### 🔄 3.12.1 Recapitulare

Ai parcurs grafuri cu BFS/DFS (3.10, 3.11), care găsesc drumuri parțiale. Roy-Warshall calculează toate drumurile dintr-o dată.

### 💡 3.12.2 Concept nou și exemplu

**Roy-Warshall** determină, pentru orice pereche de vârfuri (i, j), dacă există un drum de la i la j. Pornește de la matricea de adiacență și "închide" relația de accesibilitate.

```python
def roy_warshall(a):
    n = len(a)
    d = [row[:] for row in a]
    for k in range(n):
        for i in range(n):
            for j in range(n):
                d[i][j] = d[i][j] or (d[i][k] and d[k][j])
    return d
```

Complexitate: O(n³). Bun pentru grafuri cu muchii (existență drum), nu neapărat cost minim.

:::atentie
Roy-Warshall lucrează pe matrice de adiacență (0/1 pentru existență). Pentru cost minim folosești Roy-Floyd (3.14).
:::

### 🔮 3.12.3 Citește și prezice

```python
a = [[0,1,0],[0,0,1],[1,0,0]]
# După Roy-Warshall, există drum de la 1 la 3?
```

### 🤝 3.12.4 Exerciții ghidate

Implementează Roy-Warshall pe o matrice de adiacență citită ca listă de liste.

### 🎯 3.12.5 Exerciții independente

Folosește rezultatul pentru a număra perechile de vârfuri între care există drum.

### ✅ 3.12.6 Verifică-ți înțelegerea

De ce bucla `k` (vârful intermediar) e cea din exterior, nu una din interioare?

---

# Modulul 3.13 — Drumuri de cost minim — algoritmul lui Dijkstra

### 🔄 3.13.1 Recapitulare

Roy-Warshall spune doar *dacă* există drum. Dijkstra spune *cel mai scurt drum* (în cost) într-un graf ponderat.

### 💡 3.13.2 Concept nou și exemplu

**Dijkstra** găsește distanțele minime de la un vârf sursă la toate celelalte, în graf cu muchii de cost pozitiv. La fiecare pas alege vârful nevizitat cu distanța minimă cunoscută și relaxează vecinii.

```python
import heapq
def dijkstra(graf, start):
    dist = {start: 0}
    coada = [(0, start)]
    while coada:
        d, v = heapq.heappop(coada)
        for u, w in graf[v]:
            if u not in dist or d + w < dist[u]:
                dist[u] = d + w
                heapq.heappush(coada, (dist[u], u))
    return dist
```

:::tip
Dijkstra NU funcționează cu costuri negative — atunci folosești Bellman-Ford.
:::

### 🔮 3.13.3 Citește și prezice

```python
graf = {1:[(2,4),(3,1)], 3:[(2,2)], 2:[]}
# Care e distanta minima de la 1 la 2?
```

### 🤝 3.13.4 Exerciții ghidate

Implementează Dijkstra și afișează distanța minimă de la sursă la fiecare vârf.

### 🎯 3.13.5 Exerciții independente

Reconstruiește drumul efectiv (nu doar distanța) ținând minte predecesorul fiecărui vârf.

### ✅ 3.13.6 Verifică-ți înțelegerea

De ce Dijkstra e corect când toate costurile sunt pozitive, dar eșuează cu costuri negative?

---

# Modulul 3.14 — Drumuri de cost minim — algoritmul Roy-Floyd

### 🔄 3.14.1 Recapitulare

Dijkstra dă drumurile minime de la *un* vârf. Roy-Floyd le dă de la *orice* vârf la *orice* vârf.

### 💡 3.14.2 Concept nou și exemplu

**Roy-Floyd (Floyd-Warshall)** calculează matricea distantelor minime între toate perechile. Similar cu Roy-Warshall, dar acumminimizează costul.

```python
def roy_floyd(d):
    n = len(d)
    for k in range(n):
        for i in range(n):
            for j in range(n):
                d[i][j] = min(d[i][j], d[i][k] + d[k][j])
    return d
```

Inițializează `d[i][j]` = costul muchiei, `d[i][i]` = 0, restul = infinit. Complexitate O(n³). Acceptă costuri negative (fără cicluri negative).

:::tip
Roy-Warshall = existență drum; Roy-Floyd = cost minim. Ambele au același schelet cu 3 bucle imbricate.
:::

### 🔮 3.14.3 Citește și prezice

```python
d = [[0,3,float('inf')],[float('inf'),0,1],[float('inf'),float('inf'),0]]
# Care e distanta minima de la 1 la 3 dupa Roy-Floyd?
```

### 🤝 3.14.4 Exerciții ghidate

Implementează Roy-Floyd pe o matrice de costuri cu infinit pentru muchii lipsă.

### 🎯 3.14.5 Exerciții independente

Detectează dacă graful are un ciclu de cost negativ (verifică dacă vreo diagonală devine negativă).

### ✅ 3.14.6 Verifică-ți înțelegerea

De ce Roy-Floyd e O(n³) deși pare să calculeze n² distanțe independente?

---

# Modulul 3.15 — Arbore de acoperire minim — algoritmul lui Prim

### 🔄 3.15.1 Recapitulare

Un arbore de acoperire al unui graf conex leagă toate vârfurile cu n−1 muchii, fără cicluri. Cel cu cost total minim e **MST** (Minimum Spanning Tree).

### 💡 3.15.2 Concept nou și exemplu

**Prim** construiește MST-ul crescător: începe cu un vârf, la fiecare pas adaugă muchia de cost minim care leagă un vârf deja în arbore de unul din afară.

```python
import heapq
def prim(graf, start):
    viz = {start}
    muchii = [(w, start, u) for u, w in graf[start]]
    heapq.heapify(muchii)
    total = 0
    while muchii:
        w, a, b = heapq.heappop(muchii)
        if b in viz:
            continue
        viz.add(b)
        total += w
        for u, w2 in graf[b]:
            if u not in viz:
                heapq.heappush(muchii, (w2, b, u))
    return total
```

:::tip
Prim crește un arbore dintr-un punct (greedy pe muchii care conectează interiorul cu exteriorul). Kruskal (3.16) sortează toate muchiile.
:::

### 🔮 3.15.3 Citește și prezice

```python
graf = {1:[(2,1),(3,4)], 2:[(1,1),(3,2)], 3:[(1,4),(2,2)]}
# Care e costul MST (Prim din 1)?
```

### 🤝 3.15.4 Exerciții ghidate

Implementează Prim și returnează costul total al MST-ului.

### 🎯 3.15.5 Exerciții independente

Modifică să returneze și lista muchiilor alese (nu doar costul).

### ✅ 3.15.6 Verifică-ți înțelegerea

De ce Prim și Kruskal dau același cost total pentru MST, deși aleg muchiile în ordine diferită?
