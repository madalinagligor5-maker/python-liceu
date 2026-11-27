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

## Problemă rezolvată pas cu pas

**Enunț.** Detectăm dacă un graf neorientat are un ciclu, folosind DFS și ținând minte din ce vârf am venit.

**Ideea.** Dacă, explorând vecinii lui v, găsim un vecin deja vizitat care **nu** este părintele lui v, înseamnă că am găsit un drum închis, deci un ciclu.

```python
def are_ciclu(graf):
    viz = set()
    def dfs(v, parinte):
        viz.add(v)
        for u in graf[v]:
            if u not in viz:
                if dfs(u, v):
                    return True
            elif u != parinte:
                return True
        return False
    return any(dfs(s, None) for s in graf if s not in viz)

arbore = {1: [2, 3], 2: [1, 4], 3: [1], 4: [2]}
cu_ciclu = {1: [2, 3], 2: [1, 3], 3: [1, 2]}
print(are_ciclu(arbore), are_ciclu(cu_ciclu))
```
Rezultatul: `False True`.

:::atentie
## Greșeli frecvente
- Afișezi mulțimea `viz` ca „ordine de vizitare”: o mulțime nu păstrează ordinea. Reține ordinea într-o listă separată.
- În varianta cu stivă pui vecinii în ordinea din listă și te aștepți să fie vizitați în aceeași ordine: stiva îi scoate invers. Pune-i în stivă în ordine inversă.
- La detectarea ciclului într-un graf neorientat, consideri muchia înapoi spre părinte drept ciclu.
- Recursivitatea DFS depășește limita Python pe grafuri foarte mari (`RecursionError`). Atunci folosește varianta cu stivă explicită.
:::

### 🔮 3.11.3 Citește și prezice

```python
def dfs(adiacenta, v, viz=None, ordine=None):
    if viz is None:
        viz = set()
        ordine = []
    viz.add(v)
    ordine.append(v)
    for u in adiacenta[v]:
        if u not in viz:
            dfs(adiacenta, u, viz, ordine)
    return ordine

adiacenta = {1: [2, 3], 2: [4], 3: [4], 4: []}
print(*dfs(adiacenta, 1))
```

### 🤝 3.11.4 Exerciții ghidate

Scrie DFS iterativ (cu o stivă explicită) care afișează ordinea vizitării.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: pregătim structurile
adiacenta = {1:[2,3], 2:[4], 3:[4], 4:[]}
stiva = [1]
viz = set()

# Pasul 2: parcurgere iterativă
while stiva:
    nod = stiva.___()  # scoate ultimul element adăugat (comportament de stivă)
    if nod not in viz:
        viz.___(nod)  # marchează nodul ca vizitat
        for vecin in adiacenta[nod]:
            if vecin not in viz:
                stiva.___(vecin)  # adaugă vecinii nevizitați

print("Ordine vizitare:", viz)
```


### 🎯 3.11.5 Exerciții independente

Detectează dacă un graf neorientat conține un ciclu, folosind DFS.


**Exercițiul 1.** Scrie o funcție `are_ciclu(adiacenta)` care primește un graf neorientat prin liste de adiacență și returnează `True` dacă există cel puțin un ciclu. Folosește DFS și reține, pentru fiecare vârf vizitat, vârful-părinte din care a fost atins, ca să nu confunzi muchia de întoarcere spre părinte cu un ciclu adevărat.

**Exercițiul 2.** Extinde `are_ciclu` să funcționeze și pe grafuri neconexe: pornește DFS din orice vârf nevizitat rămas, verifică fiecare componentă conexă separat și afișează pentru fiecare dacă are sau nu ciclu.


### ✅ 3.11.6 Verifică-ți înțelegerea

1. De ce DFS recursează natural, în timp ce BFS are nevoie de o coadă explicită?
   a) DFS e mai rapidă decât BFS, deci nu are nevoie deloc de o structură de date  b) **Recursivitatea folosește stiva de apeluri, care e LIFO — exact ordinea în care DFS coboară și se întoarce; BFS are nevoie de ordine FIFO, pe care stiva de apeluri n-o oferă**  c) DFS nu vizitează toate vârfurile grafului, deci nu are nevoie de structuri auxiliare  d) BFS are nevoie de coadă doar pe grafuri ponderate, DFS funcționează pe orice tip de graf fără nicio structură auxiliară
      > La fiecare apel recursiv, Python pune automat vârful curent pe stiva de execuție și îl scoate abia când s-a întors din toți vecinii — exact comportamentul LIFO cerut de DFS pentru a merge cât mai adânc pe o ramură înainte de a reveni. BFS are nevoie de ordine FIFO (primul vârf adăugat e primul procesat), pe care stiva de apeluri n-o poate oferi, de-asta se implementează cu o coadă explicită.

2. Ce structură folosește implicit varianta recursivă a DFS?
   a) O coadă  b) **Stiva de apeluri a funcțiilor**  c) Un dicționar de distanțe
      > Fiecare apel recursiv se pune pe stiva de apeluri și se scoate când a terminat cu vecinii lui, exact comportamentul LIFO al DFS.

3. Pornind din 1 în {1:[2,3], 2:[4], 3:[4], 4:[]}, DFS recursiv (vecini în ordine) vizitează:
   a) 1 2 3 4  b) **1 2 4 3**  c) 1 3 4 2
      > Din 1 coboară în 2, din 2 în 4; 4 nu mai are vecini, revine la 1 și abia apoi vizitează 3.

4. Pentru ce este folosit DFS mai des decât BFS?
   a) Drumul cu cele mai puține muchii  b) **Detectarea ciclurilor și explorarea completă a unei componente, în adâncime**  c) Distanțele de la o sursă
      > BFS dă distanțe minime în muchii; DFS e natural pentru cicluri, sortare topologică și labirinturi explorate până la capăt.

---


:::verifica-cod
Scrie o funcție `viziteaza(adiacenta, start)` care returnează câte vârfuri sunt accesibile din `start` folosind DFS (inclusiv `start`). Demo: `viziteaza({1:[2,3],2:[4],3:[4],4:[]}, 1)` -> `4`
template: def viziteaza(adiacenta, start):
    # completeaza
    pass

print(viziteaza({1:[2,3],2:[4],3:[4],4:[]}, 1))
output: 4
:::

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


:::tip
## De ce bucla lui k trebuie să fie cea mai exterioară
La Roy-Warshall, `k` este vârful intermediar prin care încercăm să "trecem" de la `i` la `j`. La pasul `k`, matricea `d` trebuie să conțină deja informația corectă folosind doar vârfurile intermediare `0..k-1` — abia atunci verificarea `d[i][k] and d[k][j]` are sens. Dacă pui bucla după `i` sau `j` în exterior, unele drumuri prin `k` nu apucă să fie "propagate" înainte de a fi folosite, iar rezultatul devine greșit.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Avem zborurile directe dintre 4 orașe (graf orientat). Calculăm cu Roy-Warshall în ce orașe se poate ajunge din fiecare oraș, cu oricâte escale.

**Ideea.** `d[i][j]` devine 1 dacă există drum de la i la j. La pasul k permitem și escala prin orașul k: `d[i][j] = d[i][j] or (d[i][k] and d[k][j])`.

```python
orase = ['București', 'Cluj', 'Iași', 'Timișoara']
a = [[0, 1, 0, 0],
     [0, 0, 1, 0],
     [0, 0, 0, 1],
     [0, 0, 0, 0]]
n = len(a)
d = [linie[:] for linie in a]
for k in range(n):
    for i in range(n):
        for j in range(n):
            d[i][j] = d[i][j] or (d[i][k] and d[k][j])
for i in range(n):
    print(orase[i], '->', [orase[j] for j in range(n) if d[i][j]])
```
Rezultatul:
```text
București -> ['Cluj', 'Iași', 'Timișoara']
Cluj -> ['Iași', 'Timișoara']
Iași -> ['Timișoara']
Timișoara -> []
```

:::atentie
## Greșeli frecvente
- Pui bucla lui `k` în interior: unele drumuri care trec prin mai multe vârfuri intermediare nu mai sunt găsite.
- Modifici matricea de adiacență originală: dacă mai ai nevoie de ea, lucrează pe o copie (`[linie[:] for linie in a]`).
- Folosești Roy-Warshall pentru costuri: el spune doar **dacă** există drum, nu cât costă.
- Uiți că pentru un graf neorientat matricea trebuie să fie simetrică de la început.
:::

### 🔮 3.12.3 Citește și prezice

```python
def roy_warshall(a):
    n = len(a)
    d = [row[:] for row in a]
    for k in range(n):
        for i in range(n):
            for j in range(n):
                d[i][j] = d[i][j] or (d[i][k] and d[k][j])
    return d

a = [[0, 1, 0], [0, 0, 1], [1, 0, 0]]
d = roy_warshall(a)
print("Da (1)" if d[0][2] else "Nu (0)")
```

### 🤝 3.12.4 Exerciții ghidate

Implementează Roy-Warshall pe o matrice de adiacență citită ca listă de liste.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: matricea de adiacență
a = [[0,1,0],[0,0,1],[1,0,0]]
n = len(a)
d = [row[:] for row in a]

# Pasul 2: închiderea tranzitivă (Roy-Warshall)
for k in range(n):
    for i in range(n):
        for j in range(n):
            d[i][j] = d[i][j] or (d[i][___] and d[___][j])  # drum i->k->j

print("Matricea drumurilor:", d)
```


### 🎯 3.12.5 Exerciții independente

Folosește rezultatul pentru a număra perechile de vârfuri între care există drum.


**Exercițiul 1.** Scrie un program care citește o matrice de adiacență, aplică `roy_warshall` și numără câte perechi ordonate (i, j), cu i diferit de j, au `d[i][j] == 1` (adică există drum de la i la j).

**Exercițiul 2.** Extinde programul pentru a afișa, pentru fiecare vârf i, lista vârfurilor j accesibile din i, conform matricei calculate de Roy-Warshall.


### ✅ 3.12.6 Verifică-ți înțelegerea

1. De ce bucla `k` (vârful intermediar) trebuie să fie cea mai exterioară, nu una dintre celelalte două?
   a) Pentru că altfel complexitatea ar crește la O(n⁴) în loc de O(n³)  b) **La pasul `k`, matricea `d` trebuie să conțină deja drumurile găsite prin vârfurile intermediare 0..k-1, ca verificarea `d[i][k] and d[k][j]` să folosească informație completă și corectă**  c) Pentru că Python parcurge buclele `for` imbricate în ordine inversă dacă `k` nu e prima  d) Nu contează ordinea buclelor — rezultatul final e identic oricum le-am aranja
      > d[i][k] and d[k][j] are sens doar dacă d deja reflectă toate drumurile prin intermediarii 0..k-1 pentru orice pereche (i,k) și (k,j), nu doar pentru perechea (i,j) curentă; asta se garantează doar dacă bucla k a terminat complet o valoare înainte să treacă la următoarea, ceea ce cere ca ea să învelească buclele i și j, nu invers.

2. Ce reprezintă `d[i][j] = 1` după Roy-Warshall?
   a) Există muchie directă de la i la j  b) **Există un drum (cu oricâte muchii) de la i la j**  c) Costul minim de la i la j este 1
      > Algoritmul calculează închiderea tranzitivă: drumuri de orice lungime, nu doar muchii directe.

3. Ce complexitate are Roy-Warshall pentru n vârfuri?
   a) O(n)  b) O(n²)  c) **O(n³)**
      > Sunt trei bucle imbricate, fiecare de n pași.

4. Ce înseamnă `d[i][i] = 1` după algoritm, într-un graf orientat?
   a) Vârful i e izolat  b) **Vârful i se află pe un ciclu**  c) Nimic, diagonala e mereu 0
      > Dacă pornind din i poți reveni în i, există un ciclu care trece prin i.

---


:::verifica-cod
Scrie o funcție `numara_drumuri(a)` care aplică Roy-Warshall pe matricea de adiacență `a` și returnează câte perechi ordonate (i, j), cu i diferit de j, au drum de la i la j. Demo: `numara_drumuri([[0,1,0],[0,0,1],[1,0,0]])` -> `6`
template: def numara_drumuri(a):
    # completeaza
    pass

print(numara_drumuri([[0,1,0],[0,0,1],[1,0,0]]))
output: 6
:::

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

## Problemă rezolvată pas cu pas

**Enunț.** Calculăm cel mai scurt drum (în kilometri) de la orașul A la toate celelalte, apoi reconstituim traseul spre E.

**Ideea.** Folosim un heap pentru a scoate mereu vârful cu distanța minimă cunoscută. Când găsim o distanță mai mică pentru un vecin, o actualizăm și ținem minte vârful din care am venit (`prec`).

```python
import heapq
graf = {'A': [('B', 4), ('C', 2)], 'B': [('D', 5)], 'C': [('B', 1), ('D', 8), ('E', 10)], 'D': [('E', 2)], 'E': []}
dist = {v: float('inf') for v in graf}
prec = {'A': None}
dist['A'] = 0
heap = [(0, 'A')]
while heap:
    d, v = heapq.heappop(heap)
    if d > dist[v]:
        continue
    for u, w in graf[v]:
        if d + w < dist[u]:
            dist[u] = d + w
            prec[u] = v
            heapq.heappush(heap, (dist[u], u))
drum, v = [], 'E'
while v:
    drum.append(v)
    v = prec[v]
print(dist)
print(' -> '.join(drum[::-1]))
```
Rezultatul:
```text
{'A': 0, 'B': 3, 'C': 2, 'D': 8, 'E': 10}
A -> C -> B -> D -> E
```

:::atentie
## Greșeli frecvente
- Aplici Dijkstra pe un graf cu costuri negative: rezultatul poate fi greșit.
- Uiți să sari peste intrările vechi scoase din heap (o distanță mai mare decât cea deja cunoscută): algoritmul face pași inutili.
- Inițializezi distanțele cu 0 în loc de infinit: niciun vârf nu mai pare să poată fi îmbunătățit.
- Folosești BFS simplu pe un graf ponderat: obții drumul cu cele mai puține muchii, nu cel mai ieftin.
:::

### 🔮 3.13.3 Citește și prezice

```python
import heapq

def dijkstra(graf, start):
    dist = {start: 0}
    coada = [(0, start)]
    while coada:
        d, v = heapq.heappop(coada)
        for u, w in graf.get(v, []):
            if u not in dist or d + w < dist[u]:
                dist[u] = d + w
                heapq.heappush(coada, (dist[u], u))
    return dist

graf = {1: [(2, 4), (3, 1)], 3: [(2, 2)], 2: []}
dist = dijkstra(graf, 1)
print(dist[2])
```

### 🤝 3.13.4 Exerciții ghidate

Implementează Dijkstra și afișează distanța minimă de la sursă la fiecare vârf.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
import heapq

# Pasul 1: pregătim structurile
graf = {1:[(2,4),(3,1)], 3:[(2,2)], 2:[]}
dist = {1: 0}
coada = [(0, 1)]

# Pasul 2: relaxarea muchiilor
while coada:
    d, v = heapq.___(coada)  # scoate vârful cu distanța minimă cunoscută
    for u, w in graf[v]:
        if u not in dist or d + w < dist[u]:
            dist[u] = d + w
            heapq.___(coada, (dist[u], u))  # reintroduce vârful cu noua distanță

print("Distanțe minime:", ___)
```


### 🎯 3.13.5 Exerciții independente

Reconstruiește drumul efectiv (nu doar distanța) ținând minte predecesorul fiecărui vârf.


**Exercițiul 1.** Scrie o funcție `dijkstra_cu_drum(graf, start)` care, pe lângă dicționarul de distanțe minime, reține pentru fiecare vârf predecesorul din care a fost atins într-un dicționar `prec`, actualizat de fiecare dată când distanța unui vârf este îmbunătățită.

**Exercițiul 2.** Adaugă o funcție `reconstituie_drum(prec, start, destinatie)` care, pornind de la vârful destinație, urmărește predecesorii înapoi până la `start` și returnează drumul complet, ca listă de vârfuri în ordinea parcurgerii.


### ✅ 3.13.6 Verifică-ți înțelegerea

1. De ce Dijkstra e corect când toate costurile sunt pozitive, dar eșuează cu costuri negative?
   a) Pentru că `heapq` din Python nu poate stoca numere negative în coadă  b) **Algoritmul presupune că, odată extras vârful cu distanța minimă cunoscută, aceasta nu mai poate scădea — adevărat doar dacă toate muchiile au cost pozitiv; o muchie negativă poate reduce ulterior o distanță deja considerată finală**  c) Pentru că, cu costuri negative, distanțele devin infinite și bucla `while` nu se mai termină  d) Pentru că Dijkstra folosește DFS pe sub-graf, iar DFS eșuează pe grafuri cu cicluri
      > Dijkstra extrage mereu din coadă vârful cu cea mai mică distanță cunoscută și îl consideră definitiv rezolvat, presupunând că orice drum alternativ ar fi cel puțin la fel de lung — lucru adevărat doar când toate muchiile adaugă cost pozitiv. Dacă există o muchie negativă, ea poate micșora ulterior distanța unui vârf deja „închis”, iar algoritmul nu se mai întoarce să-l corecteze.

2. Ce vârf scoate Dijkstra din coadă la fiecare pas?
   a) Primul adăugat  b) **Vârful cu cea mai mică distanță cunoscută**  c) Un vârf ales la întâmplare
      > Cu costuri pozitive, distanța acestui vârf nu mai poate fi îmbunătățită, deci poate fi considerată definitivă.

3. Ce înseamnă „relaxarea” muchiei (v, u) cu costul w?
   a) Ștergerea muchiei  b) **Dacă dist[v] + w < dist[u], actualizăm dist[u]**  c) Înlocuirea costului cu 0
      > Relaxarea verifică dacă drumul prin v este mai ieftin decât cel cunoscut până atunci pentru u.

4. De ce folosim un heap (`heapq`) în Dijkstra?
   a) Ca să sortăm muchiile  b) **Ca să găsim rapid vârful cu distanța minimă**  c) Ca să evităm recursivitatea
      > Fără heap am căuta minimul parcurgând toate vârfurile la fiecare pas; heap-ul îl dă în O(log n).

---


:::verifica-cod
Scrie o funcție `distanta_minima(graf, start, destinatie)` care returnează, folosind Dijkstra, costul minim de la `start` la `destinatie`. Demo: `distanta_minima({1:[(2,4),(3,1)], 3:[(2,2)], 2:[]}, 1, 2)` -> `3`
template: def distanta_minima(graf, start, destinatie):
    # completeaza
    pass

print(distanta_minima({1:[(2,4),(3,1)], 3:[(2,2)], 2:[]}, 1, 2))
output: 3
:::

# Modulul 3.14 — Drumuri de cost minim — algoritmul Roy-Floyd

### 🔄 3.14.1 Recapitulare

Dijkstra dă drumurile minime de la *un* vârf. Roy-Floyd le dă de la *orice* vârf la *orice* vârf.

### 💡 3.14.2 Concept nou și exemplu

**Roy-Floyd (Floyd-Warshall)** calculează matricea distanțelor minime între toate perechile. Similar cu Roy-Warshall, dar acum minimizează costul.

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

## Problemă rezolvată pas cu pas

**Enunț.** Avem 4 orașe și timpii de mers între ele (graf orientat). Calculăm cu Roy-Floyd timpul minim între oricare două orașe și afișăm tabelul.

**Ideea.** Pornim de la matricea costurilor directe, cu `INF` unde nu e drum și 0 pe diagonală. Pentru fiecare oraș intermediar k, încercăm `d[i][k] + d[k][j]`.

```python
INF = float('inf')
d = [[0, 5, INF, 10],
     [INF, 0, 3, INF],
     [INF, INF, 0, 1],
     [INF, INF, INF, 0]]
n = len(d)
for k in range(n):
    for i in range(n):
        for j in range(n):
            if d[i][k] + d[k][j] < d[i][j]:
                d[i][j] = d[i][k] + d[k][j]
for linie in d:
    print(['-' if x == INF else x for x in linie])
```
Rezultatul:
```text
[0, 5, 8, 9]
['-', 0, 3, 4]
['-', '-', 0, 1]
['-', '-', '-', 0]
```

:::atentie
## Greșeli frecvente
- Pui 0 în loc de infinit acolo unde nu există muchie: algoritmul crede că există drumuri gratuite.
- Uiți `d[i][i] = 0` pe diagonală.
- Pui bucla lui `k` în interior (ca la Roy-Warshall, `k` trebuie să fie bucla exterioară).
- Folosești un număr „mare” (ex. 9999) în loc de `float('inf')` și apoi aduni două asemenea valori: rezultatul pare un drum real.
:::

### 🔮 3.14.3 Citește și prezice

```python
def roy_floyd(d):
    n = len(d)
    for k in range(n):
        for i in range(n):
            for j in range(n):
                d[i][j] = min(d[i][j], d[i][k] + d[k][j])
    return d

d = [[0, 3, float("inf")], [float("inf"), 0, 1], [float("inf"), float("inf"), 0]]
d = roy_floyd(d)
print(d[0][2])
```

### 🤝 3.14.4 Exerciții ghidate

Implementează Roy-Floyd pe o matrice de costuri cu infinit pentru muchii lipsă.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: matricea de costuri
d = [[0,3,float('inf')],[float('inf'),0,1],[float('inf'),float('inf'),0]]
n = len(d)

# Pasul 2: relaxare prin fiecare vârf intermediar k
for k in range(n):
    for i in range(n):
        for j in range(n):
            d[i][j] = ___(d[i][j], d[i][k] + d[___][j])  # păstrează costul minim

print("Distanțe minime:", d)
```


### 🎯 3.14.5 Exerciții independente

Detectează dacă graful are un ciclu de cost negativ (verifică dacă vreo diagonală devine negativă).


**Exercițiul 1.** Scrie o funcție `are_ciclu_negativ(d)` care aplică Roy-Floyd pe matricea de costuri `d` și returnează `True` dacă, după algoritm, există vreun `d[i][i] < 0`, ceea ce indică prezența unui ciclu de cost negativ.

**Exercițiul 2.** Extinde programul pentru a afișa lista vârfurilor `i` pentru care `d[i][i] < 0`, adică vârfurile aflate pe un ciclu de cost negativ.


### ✅ 3.14.6 Verifică-ți înțelegerea

1. De ce Roy-Floyd are complexitate O(n³) deși matricea distanțelor are doar n² celule?
   a) **Pentru fiecare din cele n² perechi (i, j) se testează pe rând toate cele n vârfuri posibile ca intermediar `k`, deci munca totală e n² × n = n³**  b) Pentru că algoritmul recalculează de n ori întreaga matrice din cauza erorilor de rotunjire la numere reale  c) Pentru că, de fapt, Roy-Floyd rulează Dijkstra din fiecare vârf, iar Dijkstra costă O(n) pe grafuri mici  d) Pentru că bucla `while` internă mai adaugă un factor n peste cele două bucle `for` vizibile
      > Deși matricea are n² celule, pentru fiecare pereche (i, j) algoritmul verifică pe rând, la fiecare valoare a lui k, dacă trecerea prin vârful k oferă un drum mai scurt (d[i][k] + d[k][j]); înmulțind cele n² perechi cu cei n intermediari posibili rezultă exact n³ operații.

2. Ce valoare punem la început în d[i][j] dacă nu există muchie de la i la j?
   a) 0  b) -1  c) **Infinit**
      > Infinitul spune „încă nu cunoaștem niciun drum”; orice drum real găsit ulterior va fi mai mic.

3. Prin ce diferă Roy-Floyd de Roy-Warshall?
   a) Are patru bucle  b) **Calculează costul minim, nu doar existența unui drum**  c) Funcționează doar pe arbori
      > Scheletul e același, dar Roy-Floyd folosește `min` și sume de costuri în loc de „și/sau” logic.

4. Când e preferabil Roy-Floyd față de Dijkstra rulat din fiecare vârf?
   a) Pe grafuri cu milioane de vârfuri  b) **Pe grafuri mici sau dense, când ai nevoie de toate perechile**  c) Niciodată
      > Codul e foarte scurt și O(n³); pentru n mic sau grafuri dense este o alegere simplă și rapidă.

---


:::verifica-cod
Scrie o funcție `cost_minim(d, i, j)` care aplică Roy-Floyd pe matricea de costuri `d` și returnează costul minim de la vârful `i` la vârful `j`. Demo: `cost_minim([[0,3,float('inf')],[float('inf'),0,1],[float('inf'),float('inf'),0]], 0, 2)` -> `4`
template: def cost_minim(d, i, j):
    # completeaza
    pass

print(cost_minim([[0,3,float('inf')],[float('inf'),0,1],[float('inf'),float('inf'),0]], 0, 2))
output: 4
:::

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

## Problemă rezolvată pas cu pas

**Enunț.** Trebuie să legăm 5 sate la rețeaua de apă, cu cost minim. Aplicăm Prim și afișăm conductele alese, în ordinea adăugării, și costul total.

**Ideea.** Pornim din satul A. La fiecare pas alegem din heap cea mai ieftină conductă care leagă un sat deja conectat de unul neconectat.

```python
import heapq
cost = {'A': [('B', 4), ('C', 1)], 'B': [('A', 4), ('C', 2), ('D', 5)], 'C': [('A', 1), ('B', 2), ('D', 8), ('E', 10)], 'D': [('B', 5), ('C', 8), ('E', 2)], 'E': [('C', 10), ('D', 2)]}
viz = {'A'}
heap = [(c, 'A', u) for u, c in cost['A']]
heapq.heapify(heap)
total = 0
while heap:
    c, a, b = heapq.heappop(heap)
    if b in viz:
        continue
    viz.add(b)
    total += c
    print(a, '-', b, c)
    for u, c2 in cost[b]:
        if u not in viz:
            heapq.heappush(heap, (c2, b, u))
print('total', total)
```
Rezultatul:
```text
A - C 1
C - B 2
B - D 5
D - E 2
total 10
```

:::atentie
## Greșeli frecvente
- Aplici Prim pe un graf neconex: obții doar arborele componentei vârfului de start.
- Adaugi o muchie spre un vârf deja inclus în arbore: apare un ciclu. Verifică `if b in viz: continue`.
- Pui în heap tupluri `(vârf, cost)` în loc de `(cost, ...)`: heap-ul ordonează după primul element, deci după vârf, nu după cost.
- Crezi că arborele de acoperire minim e unic. Costul total minim e unic, dar la costuri egale pot exista mai mulți arbori.
:::

### 🔮 3.15.3 Citește și prezice

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

graf = {1: [(2, 1), (3, 4)], 2: [(1, 1), (3, 2)], 3: [(1, 4), (2, 2)]}
print(prim(graf, 1))
```

### 🤝 3.15.4 Exerciții ghidate

Implementează Prim și returnează costul total al MST-ului.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
import heapq

# Pasul 1: pregătim structurile
graf = {1:[(2,1),(3,4)], 2:[(1,1),(3,2)], 3:[(1,4),(2,2)]}
viz = {1}
muchii = [(w, 1, u) for u, w in graf[1]]
heapq.heapify(muchii)
total = 0

# Pasul 2: adăugăm mereu muchia de cost minim spre exterior
while muchii:
    w, a, b = heapq.___(muchii)  # extrage muchia de cost minim
    if b in viz:
        continue
    viz.___(b)  # marchează vârful ca inclus în arbore
    total ___ w  # acumulează costul muchiei alese

print("Costul MST:", total)
```


### 🎯 3.15.5 Exerciții independente

Modifică să returneze și lista muchiilor alese (nu doar costul).


**Exercițiul 1.** Modifică funcția `prim` astfel încât să rețină, pe lângă costul total, și lista muchiilor `(a, b, w)` alese pentru arborele de acoperire minim, returnând tuplul `(total, muchii_alese)`.

**Exercițiul 2.** Scrie un program care afișează muchiile MST-ului în ordinea în care au fost adăugate, împreună cu costul fiecăreia și costul total acumulat până în acel moment.


### ✅ 3.15.6 Verifică-ți înțelegerea

1. De ce Prim și Kruskal dau același cost total pentru MST, deși aleg muchiile în ordine diferită?
   a) **Ambele respectă proprietatea tăieturii (cut property): la fiecare pas aleg muchia de cost minim care traversează o tăietură a grafului, ceea ce garantează optimul indiferent de ordinea în care sunt alese muchiile**  b) Pentru că, de fapt, ambele sortează toate muchiile la început; Prim doar le procesează pe rând, în timp ce Kruskal le procesează pe toate deodată  c) Pentru că setul de muchii al MST-ului e mereu unic, deci orice algoritm corect trebuie să aleagă exact aceleași muchii, în orice ordine  d) E o coincidență valabilă doar pe grafuri mici; pe grafuri mari costurile pot să difere ușor între cei doi algoritmi
      > Deși Prim crește arborele dintr-un singur vârf iar Kruskal alege muchii sortate din tot graful, ambele respectă proprietatea tăieturii: la orice separare a vârfurilor în două grupuri, muchia de cost minim care le leagă face parte obligatoriu dintr-un MST optim, indiferent de ordinea în care algoritmul o descoperă.

2. Câte muchii are un arbore de acoperire pentru un graf conex cu 8 vârfuri?
   a) 8  b) **7**  c) 16
      > Orice arbore cu n vârfuri are n - 1 muchii.

3. Ce muchie alege Prim la fiecare pas?
   a) Cea mai ieftină muchie din tot graful  b) **Cea mai ieftină muchie care leagă arborele de un vârf din afara lui**  c) O muchie aleasă la întâmplare
      > Prim crește un singur arbore, așa că alege doar dintre muchiile care ies din el.

4. Prim este un algoritm de tip:
   a) Backtracking  b) **Greedy**  c) Divide et impera
      > La fiecare pas face alegerea care pare cea mai bună local (muchia cea mai ieftină), fără să revină asupra ei, și totuși obține optimul.

---


:::verifica-cod
Scrie o funcție `numara_muchii_mst(graf, start)` care construiește MST-ul cu algoritmul lui Prim, pornind din `start`, și returnează numărul de muchii incluse în arbore. Demo: `numara_muchii_mst({1:[(2,1),(3,4)], 2:[(1,1),(3,2)], 3:[(1,4),(2,2)]}, 1)` -> `2`
template: def numara_muchii_mst(graf, start):
    # completeaza
    pass

print(numara_muchii_mst({1:[(2,1),(3,4)], 2:[(1,1),(3,2)], 3:[(1,4),(2,2)]}, 1))
output: 2
:::
