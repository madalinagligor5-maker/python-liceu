# Modulul 2.18 — Metoda Divide et impera

### 🔄 2.18.1 Recapitulare

Ai văzut recursivitatea (2.17). Divide et impera e un model de rezolvare care o folosește sistematic.

### 💡 2.18.2 Concept nou și exemplu

**Divide et impera** ("împarte și cucerește"): **divizare** (problema în subprobleme mai mici), **rezolvare** (recursivă), **combinare** (unirea rezultatelor).

```python
def interclaseaza(a, b):   # din modulul 2.2
    rez, i, j = [], 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            rez.append(a[i]); i += 1
        else:
            rez.append(b[j]); j += 1
    return rez + a[i:] + b[j:]

def merge_sort(lista):
    if len(lista) <= 1:
        return lista
    mijloc = len(lista) // 2
    stanga = merge_sort(lista[:mijloc])       # divizare + rezolvare
    dreapta = merge_sort(lista[mijloc:])
    return interclaseaza(stanga, dreapta)     # combinare

print(merge_sort([5, 2, 8, 1]))   # [1, 2, 5, 8]
```

Complexitate O(n log n) — mult mai bună decât O(n²).

## Problemă rezolvată pas cu pas

**Enunț.** Turnurile din Hanoi: mutăm n discuri de pe tija A pe tija C, folosind tija B, fără să punem vreodată un disc mare peste unul mic. Afișăm mutările pentru 3 discuri.

**Ideea.** Ca să mutăm n discuri de pe A pe C: mutăm n - 1 discuri de pe A pe B (subproblemă), mutăm discul cel mare de pe A pe C, apoi mutăm cele n - 1 discuri de pe B pe C (subproblemă). Pentru n discuri sunt 2ⁿ - 1 mutări.

```python
def hanoi(n, sursa, destinatie, auxiliar):
    if n == 0:
        return
    hanoi(n - 1, sursa, auxiliar, destinatie)
    print(f'discul {n}: {sursa} -> {destinatie}')
    hanoi(n - 1, auxiliar, destinatie, sursa)

hanoi(3, 'A', 'C', 'B')
```
Rezultatul:
```text
discul 1: A -> C
discul 2: A -> B
discul 1: C -> B
discul 3: A -> C
discul 1: B -> A
discul 2: B -> C
discul 1: A -> C
```

:::atentie
## Greșeli frecvente
- Subproblemele nu sunt mai mici decât problema inițială: recursivitatea nu se mai termină.
- Calculezi mijlocul greșit și una dintre jumătăți rămâne goală sau egală cu întreaga listă.
- Uiți etapa de combinare: rezolvi jumătățile, dar nu le unești într-un rezultat.
- Folosești divide et impera pentru subprobleme care se suprapun (ex. Fibonacci): aceleași calcule se repetă de multe ori. Acolo e mai potrivită programarea dinamică.
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
      > Divide et impera descompune o problemă mare în subprobleme mai mici (divizare), le rezolvă recursiv pe fiecare (rezolvare), apoi unește rezultatele parțiale într-un rezultat final (combinare).

2. merge_sort are complexitatea:
   a) O(n²)  b) **O(n log n)**  c) O(n)
      > Lista se împarte în jumătăți la fiecare nivel de recursivitate (log n niveluri), iar la fiecare nivel interclasarea tuturor bucăților costă n operații, ceea ce dă în total O(n log n).

3. Cazul de bază la merge_sort e:
   a) `len(lista) == 0`  b) **`len(lista) <= 1`**  c) `len(lista) == 10`
      > O listă cu cel mult un element este deja sortată prin definiție, deci nu mai are sens s-o împarți în continuare — acesta e cazul în care recursivitatea se oprește și returnează lista neschimbată.

4. Fără caz de bază, recursivitatea:
   a) Merge  b) **Eroare infinită**  c) Returnează lista
      > Fără condiția `len(lista) <= 1` care oprește recursivitatea, funcția ar continua să apeleze merge_sort pe subliste tot mai mici la infinit, ceea ce duce la eroare, nu la un rezultat.


:::verifica-cod
Scrie o funcție `numara_elemente(lista)` care numără elementele dintr-o listă folosind divide et impera (împarte lista în jumătate, recursează, combină rezultatele). Demo: `numara_elemente([1, 2, 3, 4, 5])` -> `5`
template: def numara_elemente(lista):
    # completeaza
    pass

print(numara_elemente([1, 2, 3, 4, 5]))
output: 5
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

## Problemă rezolvată pas cu pas

**Enunț.** Comparăm cât muncesc trei sortări pe aceeași listă inversată de 8 elemente, numărând comparațiile.

**Ideea.** Adăugăm un contor în locul unde fiecare algoritm compară două elemente. Pe o listă inversată, metoda bulelor face toate comparațiile posibile, iar merge sort face mult mai puține.

```python
def bule(L):
    L, c = L[:], 0
    for i in range(len(L)):
        for j in range(len(L) - i - 1):
            c += 1
            if L[j] > L[j + 1]:
                L[j], L[j + 1] = L[j + 1], L[j]
    return c

def merge(L):
    if len(L) <= 1:
        return L, 0
    m = len(L) // 2
    (a, ca), (b, cb) = merge(L[:m]), merge(L[m:])
    rez, i, j, c = [], 0, 0, ca + cb
    while i < len(a) and j < len(b):
        c += 1
        if a[i] <= b[j]:
            rez.append(a[i]); i += 1
        else:
            rez.append(b[j]); j += 1
    return rez + a[i:] + b[j:], c

L = [8, 7, 6, 5, 4, 3, 2, 1]
print('bule:', bule(L), 'merge sort:', merge(L)[1])
```
Rezultatul: `bule: 28 merge sort: 12`.

:::atentie
## Greșeli frecvente
- La quicksort pui pivotul și în una dintre părți: el apare de două ori în rezultat sau recursivitatea nu se mai termină.
- Folosești `<` pentru o parte și `>` pentru cealaltă: elementele egale cu pivotul se pierd. Una dintre condiții trebuie să fie `<=` sau `>=`.
- Alegi mereu primul element ca pivot pe liste deja sortate: quicksort devine O(n²).
- La merge sort uiți să întorci lista sortată (`return`) și lucrezi mai departe cu jumătățile nesortate.
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
      > Atât merge sort, cât și quicksort împart problema în jumătăți la fiecare pas, ceea ce dă log n niveluri de recursivitate, iar munca de la fiecare nivel e proporțională cu n, deci ambele au O(n log n) în medie.

2. Quicksort în caz nefavorabil e:
   a) O(n log n)  b) **O(n²)**  c) O(n)
      > Dacă pivotul ales este mereu cel mai mic sau cel mai mare element (de exemplu pe o listă deja sortată), împărțirea devine complet dezechilibrată și quicksort degenerează la O(n²), la fel ca sortările simple.

3. Pivotul la quicksort se alege de obicei:
   a) Aleator  b) **Primul/ultimul/mijlocul**  c) Mereu 0
      > Alegerea pivotului contează pentru performanță, iar variantele comune și simplu de implementat sunt primul, ultimul sau elementul din mijloc al listei.

4. Merge sort folosește:
   a) Pivot  b) **Interclasarea**  c) Bule
      > Merge sort sortează combinând cele două jumătăți deja sortate prin interclasare (funcția din modulul 2.2), spre deosebire de quicksort care folosește un pivot.


:::verifica-cod
Scrie o funcție `este_sortata(lista)` care returnează True dacă lista e sortată crescător (utilă pentru a verifica rezultatul lui merge_sort sau quicksort). Demo: `este_sortata([1, 2, 3])` -> `True`
template: def este_sortata(lista):
    # completeaza
    pass

print(este_sortata([1, 2, 3]))
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

## Problemă rezolvată pas cu pas

**Enunț.** Numărăm „insulele” dintr-o hartă: grupurile de celule 1 legate pe orizontală sau verticală. Pentru fiecare 1 încă nevizitat, umplem toată insula lui și creștem contorul.

**Ideea.** Folosim varianta cu stivă a lui Flood Fill, fără recursivitate: scoatem o celulă din stivă, o marcăm cu 0 și punem în stivă vecinii ei care sunt 1.

```python
harta = [
    [1, 1, 0, 0, 1],
    [1, 0, 0, 1, 1],
    [0, 0, 1, 0, 0],
    [1, 0, 1, 1, 0],
]
n, m = len(harta), len(harta[0])
insule = 0
for i in range(n):
    for j in range(m):
        if harta[i][j] == 1:
            insule += 1
            stiva = [(i, j)]
            while stiva:
                x, y = stiva.pop()
                if 0 <= x < n and 0 <= y < m and harta[x][y] == 1:
                    harta[x][y] = 0
                    stiva += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
print(insule)
```
Rezultatul: `4`.

:::atentie
## Greșeli frecvente
- Verifici culoarea înainte de margini: `grila[i][j]` cu `i = -1` nu dă eroare, ci citește ultima linie (indice negativ). Verifică întâi marginile.
- Culoarea nouă e egală cu cea veche: celula colorată arată ca una necolorată și recursivitatea nu se oprește. Tratează separat cazul `veche == noua`.
- Pentru grile foarte mari, recursivitatea depășește limita Python (`RecursionError`). Varianta cu stivă sau coadă nu are această problemă.
- Uiți unul dintre cei 4 vecini și regiunea nu se umple complet.
:::

### 🔮 2.20.3 Citește și prezice

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

grila = [[0, 0, 1], [0, 1, 1], [1, 1, 1]]
flood_fill(grila, 0, 0, 0, 9)
print(grila[0][0], grila[1][0])
```
Ce valori se afișează? (Indiciu: urmărește care celule cu 0 sunt legate de colțul din stânga sus.)

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
      > Flood Fill primește coordonatele unei singure celule de start și se extinde recursiv din ea către vecinii cu aceeași culoare, nu procesează întreaga grilă dintr-o dată.

2. Verificarea marginilor previne:
   a) Culori greșite  b) **Eroare la acces în afara grilei**  c) Recursivitatea
      > Condiția `i < 0 or i >= len(grila) or j < 0 or j >= len(grila[0])` oprește recursivitatea înainte ca funcția să încerce să acceseze un index care nu există în listă, evitând eroarea de indexare.

3. Fără verificarea culorii, algoritmul:
   a) Merge mai repede  b) **Recursează infinit**  c) Nu colorează nimic
      > Fără verificarea `grila[i][j] != veche`, funcția ar continua să recheme flood_fill pe aceleași celule deja colorate, iar apelurile vecinilor s-ar rechema unul pe altul la nesfârșit.

4. Flood Fill e folosit în:
   a) Sortare  b) **Editoare grafice (găleata de vopsea)**  c) Căutare binară
      > Colorarea unei regiuni conexe pornind dintr-un punct și extinzându-se la vecinii de aceeași culoare este exact mecanismul din spatele găleții de vopsea din editoarele grafice.


:::verifica-cod
Scrie o funcție `numara_culoare(grila, culoare)` care numără câte celule dintr-o grilă au o anumită culoare (util pentru a verifica rezultatul unui Flood Fill). Demo: `numara_culoare([[9, 0], [0, 9]], 9)` -> `2`
template: def numara_culoare(grila, culoare):
    # completeaza
    pass

print(numara_culoare([[9, 0], [0, 9]], 9))
output: 2
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

## Problemă rezolvată pas cu pas

**Enunț.** Planificarea activităților: o sală poate găzdui o singură activitate odată. Alegem cât mai multe activități care nu se suprapun.

**Ideea.** Alegerea greedy corectă: sortăm activitățile după ora de terminare și o luăm pe fiecare care începe după ce s-a terminat ultima aleasă. Așa lăsăm cât mai mult timp liber pentru restul.

```python
activitati = [('Robotică', 9, 11), ('Șah', 10, 12), ('Teatru', 11, 13), ('Muzică', 12, 14), ('Sport', 13, 15), ('Desen', 9, 15)]
alese = []
sfarsit = 0
for nume, inceput, final in sorted(activitati, key=lambda a: a[2]):
    if inceput >= sfarsit:
        alese.append(nume)
        sfarsit = final
print(alese)
```
Rezultatul: `['Robotică', 'Teatru', 'Sport']`.

:::atentie
## Greșeli frecvente
- Crezi că greedy dă mereu soluția optimă. Trebuie să verifici (sau să știi) că problema are această proprietate; altfel caută un contraexemplu.
- Sortezi după criteriul greșit: la planificarea activităților se sortează după **ora de terminare**, nu după cea de început sau după durată.
- La rest cu monede uiți să sortezi monedele descrescător înainte de a alege.
- Nu tratezi cazul în care suma nu se poate forma deloc cu monedele date.
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
      > La fiecare pas, funcția `rest_greedy` alege cea mai mare monedă care încă încape în suma rămasă, fără să ia în calcul cum influențează asta alegerile viitoare — asta înseamnă optim local, nu global.

2. Greedy garantează optimul global:
   a) Mereu  b) **Doar pentru anumite probleme**  c) Niciodată
      > Greedy funcționează corect doar pentru anumite probleme (unde optimul local duce la optimul global), iar contraexemplul cu monedele [1, 3, 4] arată clar că nu e o garanție universală.

3. Contraexemplul cu [1, 3, 4] și suma 6 arată:
   a) Greedy e mereu optim  b) **Greedy poate fi suboptimal**  c) Eroare de cod
      > Pentru suma 6 cu monedele [1, 3, 4], Greedy alege întâi 4, apoi rămâne cu 2 care se acoperă doar din monede de 1, deci 4+1+1 (3 monede), în timp ce soluția optimă 3+3 folosește doar 2 monede.

4. Pentru rest la bani cu monede uzuale, Greedy:
   a) Eroare  b) **Este optim**  c) E suboptimal
      > Pentru sistemele de monede uzuale (ca 1, 2, 5), alegerea greedy a celei mai mari monede posibile la fiecare pas produce chiar numărul minim de monede, deci strategia este optimă în acest caz.


:::verifica-cod
Scrie o funcție `numara_monede_greedy(suma, monede)` care returnează numărul minim de monede folosite de strategia Greedy pentru a forma o sumă. Demo: `numara_monede_greedy(6, [1, 2, 5])` -> `2`
template: def numara_monede_greedy(suma, monede):
    # completeaza
    pass

print(numara_monede_greedy(6, [1, 2, 5]))
output: 2
:::
