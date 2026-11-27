# Modulul 3.16 — Arbore de acoperire minim — algoritmul lui Kruskal

### 🔄 3.16.1 Recapitulare

În 3.15 ai construit MST-ul cu Prim, adăugând muchii dintr-un vârf în creștere. Kruskal abordează diferit.

### 💡 3.16.2 Concept nou și exemplu

**Kruskal** sortează toate muchiile după cost și le adaugă pe cele mai ieftine, dar numai dacă nu formează un ciclu (folosește **Union-Find** pentru a verifica componența).

```python
def gaseste(parinte, x):
    while parinte[x] != x:
        parinte[x] = parinte[parinte[x]]
        x = parinte[x]
    return x

def kruskal(muchii, n):
    parinte = list(range(n + 1))
    muchii.sort(key=lambda m: m[2])
    total = 0
    for a, b, w in muchii:
        ra, rb = gaseste(parinte, a), gaseste(parinte, b)
        if ra != rb:
            parinte[ra] = rb
            total += w
    return total
```

:::tip
Prim = greedy pe muchii care conectează arborele la rest; Kruskal = greedy global pe cea mai ieftină muchie fără ciclu.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Aplicăm Kruskal pe aceleași 5 sate ca la Prim și afișăm fiecare muchie: acceptată sau respinsă pentru că ar forma un ciclu.

**Ideea.** Sortăm muchiile crescător. O muchie e acceptată doar dacă capetele ei sunt în componente diferite (rădăcini diferite în Union-Find); apoi unim cele două componente.

```python
muchii = [('A', 'B', 4), ('A', 'C', 1), ('B', 'C', 2), ('B', 'D', 5), ('C', 'D', 8), ('C', 'E', 10), ('D', 'E', 2)]
parinte = {v: v for v in 'ABCDE'}

def radacina(x):
    while parinte[x] != x:
        x = parinte[x]
    return x

total = 0
for a, b, c in sorted(muchii, key=lambda m: m[2]):
    ra, rb = radacina(a), radacina(b)
    if ra != rb:
        parinte[ra] = rb
        total += c
        print('accept', a + b, c)
    else:
        print('ciclu ', a + b, c)
print('total', total)
```
Rezultatul:
```text
accept AC 1
accept BC 2
accept DE 2
ciclu  AB 4
accept BD 5
ciclu  CD 8
ciclu  CE 10
total 10
```

:::atentie
## Greșeli frecvente
- Nu sortezi muchiile după cost înainte de parcurgere: Kruskal devine un simplu „ia muchii fără cicluri”, fără garanția costului minim.
- Unești vârfurile (`parinte[a] = b`) în loc de **rădăcinile** lor: structura Union-Find se strică și ratezi cicluri.
- Verifici ciclurile cu un simplu set de vârfuri vizitate: două muchii pot avea ambele capete „vizitate” fără să formeze un ciclu, dacă sunt în componente diferite.
- Nu te oprești după n - 1 muchii: algoritmul rămâne corect, dar face pași inutili.
:::

### 🔮 3.16.3 Citește și prezice

```python
def gaseste(parinte, x):
    while parinte[x] != x:
        parinte[x] = parinte[parinte[x]]
        x = parinte[x]
    return x

def kruskal(muchii, n):
    parinte = list(range(n + 1))
    muchii = sorted(muchii, key=lambda m: m[2])
    total = 0
    for a, b, w in muchii:
        ra, rb = gaseste(parinte, a), gaseste(parinte, b)
        if ra != rb:
            parinte[ra] = rb
            total += w
    return total

muchii = [(1, 2, 1), (2, 3, 2), (1, 3, 4)]
print(kruskal(muchii, 3))
```

### 🤝 3.16.4 Exerciții ghidate

Implementează Kruskal cu Union-Find și returnează costul MST.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: sortare muchii dupa cost (al treilea element din tuplu)
muchii.sort(key=lambda m: m[___])

# Pasul 2: parcurgere si verificare ciclu cu Union-Find
for a, b, w in muchii:
    ra = gaseste(parinte, a)
    rb = gaseste(parinte, ___)
    if ra != ___:
        parinte[ra] = rb
        total += ___
```


### 🎯 3.16.5 Exerciții independente

Returnează lista muchiilor alese de Kruskal (nu doar costul).


**Exercițiul 1.** Modifică funcția `kruskal` astfel încât să primească și parametrul `n` (numărul de vârfuri) și să oprească parcurgerea muchiilor imediat ce arborele are `n - 1` muchii selectate.

**Exercițiul 2.** Scrie o funcție `cost_total(muchii_alese)` care primește lista de muchii returnată de Kruskal și calculează suma costurilor, apoi verifică că rezultatul coincide cu totalul calculat direct de `kruskal()`.


### ✅ 3.16.6 Verifică-ți înțelegerea

1. De ce Kruskal are nevoie de Union-Find, și nu doar de un set de noduri vizitate, ca să detecteze ciclurile?
   a) pentru că Union-Find sortează automat muchiile după cost, eliminând acel pas  b) **pentru că muchiile nu pornesc dintr-un singur arbore în creștere, ca la Prim/BFS, ci vin din orice parte a grafului, iar Union-Find spune rapid dacă cele două capete sunt deja în aceeași componentă**  c) pentru că un set de vizitate ar ocupa mai multă memorie decât o structură Union-Find  d) pentru că Union-Find garantează singur costul minim al arborelui, indiferent de ordinea muchiilor
      > La Kruskal muchiile vin din orice zonă a grafului, nu doar dintr-un arbore care crește dintr-un singur punct ca la Prim, așa că un simplu set de noduri vizitate nu poate spune dacă două capete aparțin deja aceleiași componente — Union-Find face exact asta rapid, prin gaseste(parinte, x), fără să refacă o parcurgere completă la fiecare muchie.

2. Primul pas al algoritmului lui Kruskal este:
   a) Alegerea unui vârf de start  b) **Sortarea crescătoare a muchiilor după cost**  c) Calculul gradelor
      > Kruskal parcurge muchiile de la cea mai ieftină la cea mai scumpă.

3. Când respinge Kruskal o muchie?
   a) Când e prea scumpă  b) **Când capetele ei sunt deja în aceeași componentă (ar forma un ciclu)**  c) Când un capăt are grad mare
      > Union-Find spune dacă cele două capete au aceeași rădăcină; dacă da, muchia ar închide un ciclu.

4. Ce întoarce `radacina(x)` în structura Union-Find?
   a) Valoarea lui x  b) **Reprezentantul componentei din care face parte x**  c) Numărul de vârfuri
      > Urcând prin `parinte` până la un vârf care e propriul părinte, găsim reprezentantul comun al componentei.

---


:::verifica-cod
În Kruskal, Union-Find găsește rădăcina unei componente urcând prin `parinte[]` până la un nod care e propriul părinte. Scrie o funcție `radacina(parinte, x)` care urcă din `x` până găsește un nod cu `parinte[nod] == nod`, apoi îl returnează. Demo: `radacina([0,0,1,2], 3)` -> `0`
template: def radacina(parinte, x):
    # completeaza
    pass

print(radacina([0, 0, 1, 2], 3))
output: 0
:::

# Modulul 3.17 — Modelul conceptual arbore: concepte de bază

### 🔄 3.17.1 Recapitulare

Ai văzut grafurile (3.7). Un **arbore** e un graf conex, aciclic, cu n vârfuri și n−1 muchii.

### 💡 3.17.2 Concept nou și exemplu

Un **arbore** are:
- un **rădăcină** (vârful de sus, dacă e orientat către rădăcină)
- **noduri interne** și **frunze** (noduri fără copii)
- **niveluri** (rădăcina e nivelul 0)
- **înălțimea** = numărul maxim de muchii de la rădăcină la o frunză

Arborii apar natural: ierarhii, sisteme de fișiere, arborele de decizie, arborele binar de căutare.


```python
copii = {1: [2, 3], 2: [4, 5], 3: [], 4: [], 5: []}

def inaltime(nod):
    if not copii[nod]:
        return 0
    return 1 + max(inaltime(c) for c in copii[nod])

print("Inaltimea arborelui:", inaltime(1))  # 2
```


:::tip
Orice arbore conex cu n vârfuri are exact n−1 muchii. Dacă adaugi o muchie, apare un ciclu; dacă o scoți, se deconectează.
:::

## Problemă rezolvată pas cu pas

**Enunț.** O firmă e organizată ierarhic și reținem pentru fiecare angajat șeful direct (vectorul de tați). Aflăm directorul (rădăcina), angajații fără subordonați (frunzele) și nivelul fiecăruia.

**Ideea.** Rădăcina e singurul nod fără părinte. Frunzele sunt nodurile care nu apar niciodată ca părinte. Nivelul unui nod se află urcând din părinte în părinte până la rădăcină.

```python
sef = {'Ana': None, 'Bogdan': 'Ana', 'Carmen': 'Ana', 'Dan': 'Bogdan', 'Elena': 'Bogdan', 'Florin': 'Carmen'}
radacina = [p for p in sef if sef[p] is None][0]
frunze = sorted(p for p in sef if p not in sef.values())

def nivel(p):
    n = 0
    while sef[p] is not None:
        p = sef[p]
        n += 1
    return n

print(radacina, frunze)
print({p: nivel(p) for p in sef})
```
Rezultatul:
```text
Ana ['Dan', 'Elena', 'Florin']
{'Ana': 0, 'Bogdan': 1, 'Carmen': 1, 'Dan': 2, 'Elena': 2, 'Florin': 2}
```

:::atentie
## Greșeli frecvente
- Confunzi înălțimea (cel mai lung drum de la rădăcină la o frunză, în muchii) cu numărul de niveluri (înălțimea + 1).
- Calculezi înălțimea unei frunze ca 1 în loc de 0 (sau invers) și amesteci convențiile în același program.
- Crezi că orice graf cu n - 1 muchii e arbore: trebuie să fie și conex (echivalent: să nu aibă cicluri).
- În vectorul de tați, rădăcina nu are părinte: folosește `None` (sau 0) și tratează separat acest caz.
:::

### 🔮 3.17.3 Citește și prezice

```python
noduri = 10
muchii = noduri - 1
print(muchii)
```

### 🤝 3.17.4 Exerciții ghidate

Scrie o funcție care calculează înălțimea unui arbore reprezentat prin `parinte[v]`.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: numara nivelul unui nod urcand spre radacina
def nivel(parinte, nod):
    niv = 0
    while parinte[nod] is not None:
        nod = parinte[___]
        niv += 1
    return niv

# Pasul 2: inaltimea e nivelul maxim dintre toate nodurile
noduri = [1, 2, 3, 4, 5]
inaltimea = max(nivel(parinte, n) for n in ___)
print("Inaltime:", ___)
```


### 🎯 3.17.5 Exerciții independente

Numără frunzele unui arbore (nodurile care nu apar ca părinte al nimănui).


**Exercițiul 1.** Scrie o funcție `frunze(parinte)` care primește dicționarul `parinte[v]` și returnează lista nodurilor care nu apar ca valoare în `parinte` (adică nu au niciun copil).

**Exercițiul 2.** Folosind structura `copii` din exemplul de mai sus, scrie `niveluri(radacina)` care returnează un dicționar `{nod: nivel}` pentru toate nodurile arborelui, calculat printr-o parcurgere pornind de la rădăcină.


### ✅ 3.17.6 Verifică-ți înțelegerea

1. Dacă un graf cu n vârfuri și n−1 muchii ar conține totuși un ciclu, ce s-ar întâmpla obligatoriu?
   a) ar rămâne perfect valid ca arbore, pentru că numărul de muchii e cel care contează, nu forma lor  b) **ar exista cu siguranță o componentă deconectată, pentru că muchia „irosită” în ciclu nu mai poate lega restul vârfurilor cu bugetul rămas de muchii**  c) numărul de vârfuri ar trebui să scadă automat pentru ca egalitatea n−1 să rămână adevărată  d) graful ar avea nevoie de exact o muchie în plus ca să fie catalogat drept ciclic
      > Un arbore conex cu n vârfuri are exact n−1 muchii; dacă printre acele n−1 muchii apare un ciclu, înseamnă că cel puțin două muchii au fost „cheltuite” ca să lege aceleași două vârfuri deja conectate, deci restul vârfurilor rămân fără muchie disponibilă care să le lege de arbore — graful se rupe în componente separate.

2. Câte muchii are un arbore cu 10 vârfuri?
   a) 10  b) **9**  c) 11
      > Orice arbore cu n vârfuri are exact n - 1 muchii.

3. Ce este o frunză într-un arbore cu rădăcină?
   a) Rădăcina  b) **Un nod fără copii**  c) Un nod cu exact doi copii
      > Frunzele sunt capetele ramurilor: noduri din care nu mai coboară nicio muchie.

4. Ce se întâmplă dacă adaugi o muchie nouă unui arbore?
   a) Rămâne arbore  b) **Apare un ciclu**  c) Se deconectează
      > Între oricare două noduri ale unui arbore există deja un drum unic; muchia nouă creează un al doilea drum, deci un ciclu.

---


:::verifica-cod
Folosind reprezentarea `copii` din lecție (`copii = {1: [2, 3], 2: [4, 5], 3: [], 4: [], 5: []}`), scrie o funcție `total_noduri(copii, nod)` care numără recursiv câte noduri are subarborele cu rădăcina `nod` (inclusiv `nod` însuși). Demo: `total_noduri(copii, 1)` -> `5`
template: def total_noduri(copii, nod):
    # completeaza
    pass

copii = {1: [2, 3], 2: [4, 5], 3: [], 4: [], 5: []}
print(total_noduri(copii, 1))
output: 5
:::

# Modulul 3.18 — Arbori binari și arbori binari de căutare

### 🔄 3.18.1 Recapitulare

În 3.17 ai definit arborele general. Arborele binar e un caz special, foarte folosit.

### 💡 3.18.2 Concept nou și exemplu

Un **arbore binar**: fiecare nod are cel mult 2 copii (stânga, dreapta). Un **arbore binar de căutare (BST)** respectă: pentru orice nod, valorile din subarborele stâng sunt < valoarea nodului < valorile din dreapta.

```python
class Nod:
    def __init__(self, v):
        self.v = v
        self.st = None
        self.dr = None

def inserare(rad, v):
    if rad is None:
        return Nod(v)
    if v < rad.v:
        rad.st = inserare(rad.st, v)
    else:
        rad.dr = inserare(rad.dr, v)
    return rad
```

:::atentie
În BST, ordinea de inserare contează: aceleași valori inserate în altă ordine dau arbori cu forme diferite (dar aceeași mulțime).
:::


:::tip
## Capcană frecventă la inserare
Funcția `inserare` este recursivă și trebuie să returneze mereu `rad` la final — dacă uiți `return rad`, apelul `rad.st = inserare(rad.st, v)` primește `None` și pierzi tot subarborele construit până atunci.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Inserăm aceleași 7 valori în două ordini diferite și comparăm înălțimea arborilor obținuți.

**Ideea.** Forma unui BST depinde de ordinea inserării. Valorile sortate dau un lanț (înălțime n - 1), iar ordinea „mijloc întâi” dă un arbore echilibrat.

```python
class Nod:
    def __init__(self, v):
        self.v = v
        self.st = None
        self.dr = None

def inserare(rad, v):
    if rad is None:
        return Nod(v)
    if v < rad.v:
        rad.st = inserare(rad.st, v)
    else:
        rad.dr = inserare(rad.dr, v)
    return rad

def inaltime(rad):
    return -1 if rad is None else 1 + max(inaltime(rad.st), inaltime(rad.dr))

for ordine in ([1, 2, 3, 4, 5, 6, 7], [4, 2, 6, 1, 3, 5, 7]):
    rad = None
    for x in ordine:
        rad = inserare(rad, x)
    print(ordine, 'înălțime', inaltime(rad))
```
Rezultatul:
```text
[1, 2, 3, 4, 5, 6, 7] înălțime 6
[4, 2, 6, 1, 3, 5, 7] înălțime 2
```

:::atentie
## Greșeli frecvente
- Uiți `return rad` la finalul lui `inserare`: apelurile `rad.st = inserare(...)` primesc `None` și subarborii se pierd.
- Inserezi valorile egale când în stânga, când în dreapta: căutarea devine imprevizibilă. Alege o regulă (aici: egalele merg la dreapta).
- Verifici proprietatea BST doar între părinte și copii direcți: un nod adânc din stânga poate fi totuși mai mare decât rădăcina.
- Inserezi valori deja sortate și te aștepți la căutare rapidă: arborele devine un lanț și căutarea e O(n).
:::

### 🔮 3.18.3 Citește și prezice

```python
class Nod:
    def __init__(self, v):
        self.v = v
        self.st = None
        self.dr = None

def inserare(rad, v):
    if rad is None:
        return Nod(v)
    if v < rad.v:
        rad.st = inserare(rad.st, v)
    else:
        rad.dr = inserare(rad.dr, v)
    return rad

rad = None
for x in [5, 3, 8, 1, 4]:
    rad = inserare(rad, x)
print(rad.st.v)
```

### 🤝 3.18.4 Exerciții ghidate

Scrie `inserare` și o funcție care verifică dacă un arbore e BST valid.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: cauta valoarea folosind proprietatea BST
def cauta_valoare(rad, v):
    if rad is None:
        return False
    if v == ___:
        return True
    if v < rad.v:
        return cauta_valoare(rad.___, v)
    return cauta_valoare(rad.dr, ___)

# Pasul 2: testeaza cautarea
rad = None
for x in [5, 3, 8]:
    rad = inserare(rad, x)
print(cauta_valoare(rad, ___))  # cauta valoarea 8
```


### 🎯 3.18.5 Exerciții independente

Scrie `minim_bst(rad)` care returnează cea mai mică valoare dintr-un BST.


**Exercițiul 1.** Scrie `maxim_bst(rad)` care returnează cea mai mare valoare dintr-un BST, urmând mereu copilul drept până când acesta e `None`.

**Exercițiul 2.** Scrie `este_bst_valid(rad, minim=None, maxim=None)` care verifică recursiv, pentru fiecare nod, că valoarea sa se încadrează în intervalul `(minim, maxim)` moștenit de la părinți.


### ✅ 3.18.6 Verifică-ți înțelegerea

1. De ce căutarea într-un BST echilibrat este O(log n) și nu O(n), ca la parcurgerea unei liste?
   a) pentru că Python optimizează automat clasele definite de utilizator cu atribute `st` și `dr`  b) **pentru că la fiecare pas compari cu un singur nod și elimini dintr-o dată tot subarborele opus, înjumătățind spațiul de căutare, iar un arbore echilibrat are înălțime proporțională cu log n**  c) pentru că BST parcurge mereu doar subarborele stâng, ignorând jumătate din date  d) pentru că valorile dintr-un BST sunt automat sortate într-o listă ascunsă, deci se aplică binary search clasic
      > Proprietatea BST garantează că, la fiecare nod comparat, tot subarborele din partea opusă valorii căutate poate fi ignorat dintr-o dată, nu doar un element ca la parcurgerea unei liste — de aceea, într-un arbore echilibrat cu înălțime proporțională cu log n, căutarea face cel mult log n comparații în loc de n.

2. Într-un BST, unde se află cea mai mică valoare?
   a) În rădăcină  b) **În nodul cel mai din stânga (urmând mereu `st`)**  c) Într-o frunză oarecare
      > Orice nod din stânga e mai mic decât părintele, deci mergând mereu la stânga ajungi la minim.

3. Inserăm 5, 3, 8, 1, 4 în această ordine. Care este fiul stâng al rădăcinii?
   a) 1  b) **3**  c) 4
      > 5 devine rădăcina, iar 3 < 5 este inserat imediat în stânga ei; 1 și 4 coboară apoi sub 3.

4. Ce înălțime are un BST cu 7 noduri în cel mai rău caz?
   a) 2  b) 3  c) **6**
      > Dacă valorile vin sortate, fiecare nod are un singur copil și arborele devine un lanț cu 6 muchii.

---


:::verifica-cod
Reprezintă un BST ca tuplu `(valoare, stanga, dreapta)` (sau `None` pentru arbore vid). Scrie o funcție `cauta_bst(rad, v)` care caută `v` folosind proprietatea BST (stânga < nod < dreapta) și returnează `True`/`False`. Demo: `cauta_bst((5, (3, None, None), (8, None, None)), 8)` -> `True`
template: def cauta_bst(rad, v):
    # completeaza
    pass

rad = (5, (3, None, None), (8, None, None))
print(cauta_bst(rad, 8))
output: True
:::

# Modulul 3.19 — Heap (ansamblu)

### 🔄 3.19.1 Recapitulare

Ai folosit liste, cozi, arbori. Un **heap** e un arbore binar special, optimizat pentru "extrage mereu minimul/maximul".

### 💡 3.19.2 Concept nou și exemplu

Un **min-heap** e un arbore binar complet unde orice nod e ≤ copiii săi. Îl reprezentăm eficient ca listă: pentru nodul `i`, copiii sunt `2i+1` și `2i+2`, părintele e `(i-1)//2`.

Python are `heapq`:
```python
import heapq
h = []
heapq.heappush(h, 5)
heapq.heappush(h, 1)
print(heapq.heappop(h))  # 1
```

Heap-ul e baza algoritmului **Heapsort** și a cozii cu prioritate.

:::tip
Heap nu e sortat global — doar rădăcina e minimă. Dar extragerea repetată dă elementele în ordine crescătoare.
:::

## Problemă rezolvată pas cu pas

**Enunț.** La urgențe, pacienții sunt chemați în ordinea gravității (1 = cel mai grav). Simulăm coada cu prioritate cu `heapq`: unii pacienți sosesc în timp ce alții sunt tratați.

**Ideea.** Punem în heap perechi (gravitate, nume). `heappop` scoate mereu perechea cu gravitatea minimă, indiferent de ordinea sosirii.

```python
import heapq
h = []
heapq.heappush(h, (3, 'Ana'))
heapq.heappush(h, (1, 'Bogdan'))
heapq.heappush(h, (2, 'Carmen'))
print('tratat:', heapq.heappop(h)[1])
heapq.heappush(h, (1, 'Dan'))
while h:
    print('tratat:', heapq.heappop(h)[1])
```
Rezultatul:
```text
tratat: Bogdan
tratat: Dan
tratat: Carmen
tratat: Ana
```

:::atentie
## Greșeli frecvente
- Crezi că lista internă a unui heap e sortată. Doar `h[0]` e garantat minimul; restul are doar ordinea de heap.
- Folosești `heapq` pentru maxim fără nicio transformare: `heapq` e min-heap. Pentru max-heap pune valorile cu semn schimbat (`-x`).
- Modifici direct elemente din lista heap-ului (`h[3] = 0`): proprietatea de heap se strică.
- Calculezi părintele cu `i // 2` în loc de `(i - 1) // 2` (pentru numerotarea de la 0).
:::

### 🔮 3.19.3 Citește și prezice

```python
import heapq
h = []
for x in [3, 1, 2]:
    heapq.heappush(h, x)
print(heapq.heappop(h), heapq.heappop(h))
```

### 🤝 3.19.4 Exerciții ghidate

Folosește `heapq` pentru a sorta o listă de numere în ordine crescătoare (Heapsort simplu).


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: construieste heap-ul din lista initiala
import heapq
numere = [7, 2, 9, 1, 5]
h = []
for x in numere:
    heapq.___(h, x)

# Pasul 2: extrage elementele in ordine crescatoare
sortate = []
while h:
    sortate.append(heapq.___(h))
print("Sortat:", ___)
```


### 🎯 3.19.5 Exerciții independente

Implementează manual (fără `heapq`) operația `push` într-un min-heap reprezentat ca listă.


**Exercițiul 1.** Scrie funcția `push_manual(h, x)` care adaugă `x` la finalul listei `h`, apoi îl „urcă” (sift-up) interschimbându-l cu părintele său cât timp e mai mic decât acesta, folosind formula părinte `= (i - 1) // 2`.

**Exercițiul 2.** Scrie `pop_manual(h)` care scoate elementul din vârf (`h[0]`), mută ultimul element pe poziția 0 și îl „coboară” (sift-down) interschimbându-l cu cel mai mic dintre copiii săi, cât timp proprietatea de min-heap nu e respectată.


### ✅ 3.19.6 Verifică-ți înțelegerea

1. De ce un heap reprezentat ca listă e mai eficient decât a resorta lista completă de fiecare dată când extragi minimul?
   a) pentru că `heapq` folosește memorie partajată, deci nu mai copiază lista deloc  b) **pentru că push/pop într-un heap costă doar O(log n) — o singură ramificație de sift-up/sift-down — în timp ce resortarea întregii liste costă O(n log n) la fiecare extragere**  c) pentru că un heap ține mereu toată lista complet sortată, deci resortarea ar fi redundantă  d) pentru că heap-ul elimină nevoia de a compara elementele între ele la fiecare pas
      > Push și pop într-un heap ating doar un singur drum de la un nod până la rădăcină sau invers (sift-up/sift-down), deci costă O(log n), pe când resortarea completă a listei la fiecare extragere ar costa O(n log n) — heap-ul păstrează doar rădăcina minimă, nu toată lista sortată, și tocmai asta îl face rapid.

2. Într-un min-heap reținut ca listă, unde e minimul?
   a) La final  b) **Pe poziția 0**  c) La mijloc
      > Proprietatea de heap garantează că rădăcina, adică `h[0]`, este cel mai mic element.

3. Care sunt copiii nodului de pe poziția 3 (numerotare de la 0)?
   a) 4 și 5  b) **7 și 8**  c) 6 și 7
      > Copiii lui i sunt 2i + 1 și 2i + 2, deci 7 și 8.

4. Cât costă `heappush` sau `heappop` într-un heap cu n elemente?
   a) O(1)  b) **O(log n)**  c) O(n)
      > Elementul urcă sau coboară cel mult pe înălțimea arborelui, care este log n.

---


:::verifica-cod
Într-un heap reprezentat ca listă, părintele nodului de la indexul `i` se află la indexul `(i - 1) // 2`. Scrie o funcție `parinte_index(i)` care returnează acest indice (pentru `i > 0`). Demo: `parinte_index(4)` -> `1`
template: def parinte_index(i):
    # completeaza
    pass

print(parinte_index(4))
output: 1
:::

# Modulul 3.20 — Parcurgerea arborilor: preordine, inordine, postordine

### 🔄 3.20.1 Recapitulare

În 3.18 ai construit un arbore binar. Ca să-l procesăm, îl parcurgem în diferite ordini.

### 💡 3.20.2 Concept nou și exemplu

Pentru un nod, cele 3 parcurgeri diferă prin *când* vizitezi nodul curent:
- **Preordine**: nod → stânga → dreapta
- **Inordine**: stânga → nod → dreapta
- **Postordine**: stânga → dreapta → nod

```python
def inordine(rad):
    if rad:
        inordine(rad.st)
        print(rad.v)
        inordine(rad.dr)
```

:::tip
Într-un **BST**, inordinea afișează valorile în ordine crescătoare! E proprietatea cea mai utilă.
:::

## Problemă rezolvată pas cu pas

**Enunț.** O expresie aritmetică se reține ca arbore: operatorii sunt noduri interne, numerele sunt frunze. Arborele pentru (3 + 5) * (10 - 4) îl parcurgem în cele trei moduri, apoi îl evaluăm cu postordinea.

**Ideea.** Inordinea redă expresia obișnuită (cu paranteze), preordinea dă forma prefixată, postordinea forma postfixată. Pentru evaluare calculăm întâi copiii, apoi aplicăm operatorul, deci tot postordine.

```python
arb = ('*', ('+', ('3',), ('5',)), ('-', ('10',), ('4',)))

def pre(n):
    return [n[0]] + (pre(n[1]) + pre(n[2]) if len(n) > 1 else [])

def post(n):
    return (post(n[1]) + post(n[2]) if len(n) > 1 else []) + [n[0]]

def ino(n):
    return n[0] if len(n) == 1 else '(' + ino(n[1]) + ' ' + n[0] + ' ' + ino(n[2]) + ')'

def evalueaza(n):
    if len(n) == 1:
        return int(n[0])
    a, b = evalueaza(n[1]), evalueaza(n[2])
    return {'+': a + b, '-': a - b, '*': a * b}[n[0]]

print(' '.join(pre(arb)))
print(' '.join(post(arb)))
print(ino(arb), '=', evalueaza(arb))
```
Rezultatul:
```text
* + 3 5 - 10 4
3 5 + 10 4 - *
((3 + 5) * (10 - 4)) = 48
```

:::atentie
## Greșeli frecvente
- Confunzi ordinea parcurgerilor: în **pre**ordine nodul vine înaintea copiilor, în **post**ordine după, în inordine între ei.
- Uiți condiția de oprire `if rad:` și apelezi `rad.st` pe `None`: apare `AttributeError`.
- Afișezi cu `print` în interiorul funcției când ai nevoie de rezultat ca listă: întoarce o listă sau adaugă într-o listă primită ca parametru.
- Te aștepți ca inordinea să sorteze orice arbore binar: valorile ies sortate doar într-un **BST**.
:::

### 🔮 3.20.3 Citește și prezice

```python
class Nod:
    def __init__(self, v):
        self.v = v
        self.st = None
        self.dr = None

def inserare(rad, v):
    if rad is None:
        return Nod(v)
    if v < rad.v:
        rad.st = inserare(rad.st, v)
    else:
        rad.dr = inserare(rad.dr, v)
    return rad

def inordine(rad, rezultat):
    if rad:
        inordine(rad.st, rezultat)
        rezultat.append(rad.v)
        inordine(rad.dr, rezultat)
    return rezultat

rad = None
for x in [5, 3, 8, 1, 4]:
    rad = inserare(rad, x)
print(*inordine(rad, []))
```

### 🤝 3.20.4 Exerciții ghidate

Scrie funcțiile `preordine`, `inordine`, `postordine` pentru un arbore binar.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: preordine viziteaza nodul inaintea copiilor
def preordine(rad):
    if rad:
        print(___.v)
        preordine(rad.st)
        preordine(rad.___)

# Pasul 2: postordine viziteaza nodul dupa copii
def postordine(rad):
    if rad:
        postordine(rad.st)
        postordine(rad.dr)
        print(___.v)
```


### 🎯 3.20.5 Exerciții independente

Calculează înălțimea unui arbore binar folosind postordinea.


**Exercițiul 1.** Scrie `total_noduri(rad)` care folosește o parcurgere (preordine, inordine sau postordine, la alegere) pentru a număra recursiv toate nodurile arborelui.

**Exercițiul 2.** Scrie `suma_valori(rad)` care parcurge arborele în inordine și adună valorile tuturor nodurilor într-un total, returnat la final.


### ✅ 3.20.6 Verifică-ți înțelegerea

1. De ce parcurgerea inordine a unui BST produce mereu valorile în ordine crescătoare?
   a) pentru că inordinea vizitează întotdeauna rădăcina prima, iar restul valorilor sunt deja sortate în listele `st` și `dr`  b) **pentru că la fiecare nod, proprietatea BST garantează că tot subarborele stâng conține valori mai mici și tot subarborele drept valori mai mari, iar inordinea respectă exact ordinea stânga → nod → dreapta la orice nivel al recursiei**  c) pentru că Python sortează automat lista rezultată din orice parcurgere recursivă a unui arbore  d) pentru că inordinea e echivalentă cu postordinea pentru arbori binari de căutare
      > Proprietatea BST spune că la orice nod tot ce e în stânga e mai mic și tot ce e în dreapta e mai mare, iar inordinea vizitează exact stânga → nod → dreapta la fiecare nivel al recursiei — aplicată recursiv pe tot arborele, această ordine produce automat șirul crescător al valorilor.

2. În ce ordine vizitează preordinea?
   a) Stânga, nod, dreapta  b) **Nod, stânga, dreapta**  c) Stânga, dreapta, nod
      > „Pre” înseamnă că nodul curent e vizitat înaintea subarborilor lui.

3. Pentru BST-ul cu rădăcina 5, copiii 3 și 8, inordinea afișează:
   a) 5 3 8  b) **3 5 8**  c) 3 8 5
      > Inordinea vizitează stânga (3), nodul (5), apoi dreapta (8), adică ordinea crescătoare.

4. Ce parcurgere folosești ca să ștergi un arbore (întâi copiii, apoi nodul)?
   a) Preordine  b) Inordine  c) **Postordine**
      > Postordinea termină subarborii unui nod înainte de nodul însuși, deci nu ștergi un părinte înaintea copiilor.

---


:::verifica-cod
Folosind reprezentarea `(valoare, stanga, dreapta)` pentru un arbore binar, scrie o funcție `inordine_lista(rad)` care returnează o listă cu valorile arborelui în ordinea inordine (stânga, nod, dreapta). Demo: `inordine_lista((5, (3, None, None), (8, None, None)))` -> `[3, 5, 8]`
template: def inordine_lista(rad):
    # completeaza
    pass

rad = (5, (3, None, None), (8, None, None))
print(inordine_lista(rad))
output: [3, 5, 8]
:::

# Modulul 3.21 — Căutare și inserare într-un arbore binar de căutare

### 🔄 3.21.1 Recapitulare

În 3.18 ai scris `inserare` pentru BST. Acum detaliem căutarea și inserarea corectă.

### 💡 3.21.2 Concept nou și exemplu

**Căutare:** compară cu rădăcina; dacă e mai mică, mergi stânga, dacă mai mare, dreapta; dacă e egal, ai găsit.

```python
def cauta(rad, v):
    while rad:
        if v == rad.v:
            return True
        rad = rad.st if v < rad.v else rad.dr
    return False
```

**Inserarea** e la fel, dar ține minte unde te-ai oprit (părintele) ca să agăți noul nod.

:::atentie
Căutarea e O(h) unde h = înălțimea. Într-un arbore dezechilibrat (lanț), h poate fi O(n) — de asta există AVL/roșu-negru.
:::


:::tip
## Caută iterativ, nu recursiv, când poți
Varianta iterativă a lui `cauta` (ca cea de mai sus) folosește O(1) memorie suplimentară, spre deosebire de o variantă recursivă care ocupă memorie proporțională cu înălțimea arborelui (stiva de apeluri). Pentru arbori foarte înalți, diferența contează.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Ștergem pe rând din BST un nod-frunză, un nod cu un copil și un nod cu doi copii, afișând inordinea după fiecare ștergere.

**Ideea.** Frunza dispare pur și simplu. Nodul cu un copil e înlocuit de acel copil. Nodul cu doi copii primește valoarea succesorului (minimul din subarborele drept), apoi succesorul e șters din dreapta.

```python
class Nod:
    def __init__(self, v):
        self.v = v
        self.st = None
        self.dr = None

def inserare(rad, v):
    if rad is None:
        return Nod(v)
    if v < rad.v:
        rad.st = inserare(rad.st, v)
    else:
        rad.dr = inserare(rad.dr, v)
    return rad

def sterge(r, v):
    if r is None:
        return None
    if v < r.v:
        r.st = sterge(r.st, v)
    elif v > r.v:
        r.dr = sterge(r.dr, v)
    else:
        if r.st is None:
            return r.dr
        if r.dr is None:
            return r.st
        s = r.dr
        while s.st:
            s = s.st
        r.v = s.v
        r.dr = sterge(r.dr, s.v)
    return r

def ino(r):
    return [] if r is None else ino(r.st) + [r.v] + ino(r.dr)

rad = None
for x in [50, 30, 70, 20, 40, 60, 80, 65]:
    rad = inserare(rad, x)
for v in [20, 60, 50]:
    rad = sterge(rad, v)
    print('fără', v, ino(rad))
print('noua rădăcină:', rad.v)
```
Rezultatul:
```text
fără 20 [30, 40, 50, 60, 65, 70, 80]
fără 60 [30, 40, 50, 65, 70, 80]
fără 50 [30, 40, 65, 70, 80]
noua rădăcină: 65
```

:::atentie
## Greșeli frecvente
- La inserarea iterativă te oprești cu `curent` pe `None` și pierzi nodul la care trebuia agățat noul nod. Ține minte `parinte` la fiecare pas.
- La ștergerea unui nod cu doi copii îl înlocuiești cu un copil oarecare: proprietatea BST se poate strica. Folosește succesorul (minimul din dreapta) sau predecesorul.
- Uiți cazul în care valoarea de șters e chiar în rădăcină: funcția trebuie să întoarcă noua rădăcină.
- Cauți recursiv într-un arbore foarte înalt și depășești limita de recursivitate. Varianta iterativă nu are această problemă.
:::

### 🔮 3.21.3 Citește și prezice

```python
class Nod:
    def __init__(self, v):
        self.v = v
        self.st = None
        self.dr = None

def inserare(rad, v):
    if rad is None:
        return Nod(v)
    if v < rad.v:
        rad.st = inserare(rad.st, v)
    else:
        rad.dr = inserare(rad.dr, v)
    return rad

def cauta(rad, v):
    if rad is None:
        return False
    if rad.v == v:
        return True
    if v < rad.v:
        return cauta(rad.st, v)
    return cauta(rad.dr, v)

rad = None
for x in [50, 30, 70, 20, 40]:
    rad = inserare(rad, x)
print("Da" if cauta(rad, 40) else "Nu")
```

### 🤝 3.21.4 Exerciții ghidate

Scrie `cauta` și `inserare` (iterativ, nu recursiv) pentru un BST.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: gaseste pozitia si parintele corect
def inserare_iterativ(rad, v):
    nod_nou = Nod(v)
    if rad is None:
        return nod_nou
    curent = rad
    parinte = None
    while curent:
        parinte = curent
        curent = curent.st if v < curent.v else curent.___

    # Pasul 2: agata nodul nou de parinte
    if v < parinte.v:
        parinte.st = ___
    else:
        parinte.___ = nod_nou
    return rad
```


### 🎯 3.21.5 Exerciții independente

Scrie `sterge(rad, v)` care elimină un nod dintr-un BST păstrând proprietatea.


**Exercițiul 1.** Scrie o funcție `gaseste_parinte(rad, v)` care returnează nodul părinte al nodului cu valoarea `v` (sau `None` dacă `v` e rădăcina sau nu există în arbore) — utilă ca pas pregătitor pentru ștergere.

**Exercițiul 2.** Folosind `sterge(rad, v)`, scrie un mic program care construiește un BST din lista `[50, 30, 70, 20, 40]`, șterge valoarea `30`, apoi afișează arborele rămas folosind inordinea.


### ✅ 3.21.6 Verifică-ți înțelegerea

1. De ce ștergerea unui nod cu doi copii dintr-un BST e mai complicată decât ștergerea unui nod cu cel mult un copil?
   a) pentru că Python nu permite eliminarea unui obiect care are mai multe referințe către el  b) **pentru că nu poți doar să legi părintele direct de un singur copil, ca la celelalte cazuri — trebuie să găsești un succesor (sau predecesor) potrivit care să ia locul nodului șters, fără să strici proprietatea BST**  c) pentru că un nod cu doi copii are întotdeauna o înălțime mai mare, deci recursivitatea durează mai mult  d) pentru că ștergerea trebuie repetată o dată pentru fiecare copil, deci se dublează timpul de execuție
      > Când nodul șters are un singur copil (sau niciunul), părintele se poate lega direct de acel copil; dar cu doi copii nu există un „singur copil” de moștenit locul, așa că trebuie găsit un succesor (cea mai mică valoare din subarborele drept, de exemplu) care să ia locul nodului șters fără să încalce ordinea stânga < nod < dreapta.

2. Ce complexitate are căutarea într-un BST de înălțime h?
   a) O(n²)  b) **O(h)**  c) O(1)
      > La fiecare pas cobori un nivel, deci faci cel mult h + 1 comparații.

3. Cu ce valoare înlocuim un nod cu doi copii la ștergere, ca arborele să rămână BST?
   a) Cu valoarea rădăcinii  b) **Cu succesorul lui (minimul din subarborele drept)**  c) Cu 0
      > Succesorul e mai mare decât tot ce e în stânga și mai mic decât restul din dreapta, deci poate lua locul nodului.

4. Inserăm 50, 30, 70, 20, 40. Pe ce drum se caută 40?
   a) 50 → 70 → 40  b) **50 → 30 → 40**  c) 50 → 20 → 40
      > 40 < 50, deci mergem în stânga la 30; 40 > 30, deci mergem în dreapta lui 30, unde e 40.

---


:::verifica-cod
Scrie o funcție iterativă `adancime_cautare(rad, v)` care caută `v` într-un BST reprezentat ca tuplu `(valoare, stanga, dreapta)` și returnează câți pași (muchii) a parcurs până l-a găsit, pornind de la 0 la rădăcină. Demo: `adancime_cautare((50, (30, (20, None, None), (40, None, None)), (70, None, None)), 40)` -> `2`
template: def adancime_cautare(rad, v):
    # completeaza
    pass

rad = (50, (30, (20, None, None), (40, None, None)), (70, None, None))
print(adancime_cautare(rad, 40))
output: 2
:::

# Modulul 3.22 — Modelul conceptual obiectual: clase, obiecte, moștenire

### 🔄 3.22.1 Recapitulare

Până acum ai scris cod procedural (funcții). **Programarea orientată pe obiecte (POO)** grupează datele și operațiile pe ele.

### 💡 3.22.2 Concept nou și exemplu

- **Clasă**: șablonul (tipul) — ex. `Masina`.
- **Obiect (instanță)**: o copie concretă — `m = Masina()`.
- **Atribute**: datele obiectului (culoare, viteza).
- **Metode**: funcțiile obiectului.
- **Moștenire**: o clasă derivată preia atributele și metodele celei de bază.

```python
class Animal:
    def __init__(self, nume):
        self.nume = nume
    def sunet(self):
        return "..."

class Caine(Animal):  # Caine mosteneste Animal
    def sunet(self):
        return "Ham!"
```

:::tip
Moștenirea evită duplicarea codului: `Caine` refolosește `nume` din `Animal` și suprascrie doar ce e diferit.
:::

## Problemă rezolvată pas cu pas

**Enunț.** O grădină zoologică are animale de mai multe feluri. Clasa de bază `Animal` are numele și o metodă `prezentare()`, iar fiecare clasă derivată suprascrie `sunet()`. Parcurgem toate animalele cu aceeași buclă.

**Ideea.** Polimorfism: bucla apelează `a.prezentare()` fără să știe tipul exact, iar Python alege `sunet()` din clasa reală a fiecărui obiect.

```python
class Animal:
    def __init__(self, nume):
        self.nume = nume

    def sunet(self):
        return '...'

    def prezentare(self):
        return f'{self.nume} face {self.sunet()}'

class Caine(Animal):
    def sunet(self):
        return 'ham'

class Pisica(Animal):
    def sunet(self):
        return 'miau'

class Peste(Animal):
    pass

for a in [Caine('Rex'), Pisica('Tom'), Peste('Nemo')]:
    print(a.prezentare(), '|', isinstance(a, Animal))
```
Rezultatul:
```text
Rex face ham | True
Tom face miau | True
Nemo face ... | True
```

:::atentie
## Greșeli frecvente
- În constructorul clasei derivate uiți `super().__init__(...)`: atributele definite în clasa de bază nu mai există și apare `AttributeError`.
- Suprascrii o metodă cu alt număr de parametri decât în clasa de bază: codul care o apelează generic (polimorfic) nu mai funcționează.
- Folosești moștenirea acolo unde relația nu e „este un” (un `Motor` nu este o `Masina`). Pentru „are un” folosește compunerea (un atribut).
- Verifici tipul cu `type(x) == Animal` și ratezi obiectele claselor derivate. Folosește `isinstance(x, Animal)`.
:::

### 🔮 3.22.3 Citește și prezice

```python
class Animal:
    def __init__(self, nume):
        self.nume = nume
    def sunet(self):
        return "..."

class Caine(Animal):
    def sunet(self):
        return "Ham!"

c = Caine("Rex")
print(c.nume, c.sunet())
```

### 🤝 3.22.4 Exerciții ghidate

Creează clasa `Forma` cu atribut `culoare` și clasele `Cerc` și `Patrat` care moștenesc `Forma`.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: definire clasa de baza
class Forma:
    def __init__(self, culoare):
        self.culoare = ___

# Pasul 2: clasa derivata mosteneste Forma
class Cerc(___):
    def __init__(self, culoare, raza):
        super().__init__(___)
        self.raza = raza

c = Cerc("rosu", 5)
print(c.culoare, ___.raza)
```


### 🎯 3.22.5 Exerciții independente

Adaugă metoda `descriere()` în `Forma` și suprascrie-o în derivate.


**Exercițiul 1.** Scrie clasa `Patrat` (moștenind `Forma`) cu atributul `latura` și metoda `arie()` care calculează `latura ** 2`.

**Exercițiul 2.** Creează o listă cu un `Cerc` și un `Patrat`, apoi parcurge lista afișând pentru fiecare `forma.descriere()` — observă cum Python apelează automat versiunea corectă a metodei pentru fiecare obiect (polimorfism).


### ✅ 3.22.6 Verifică-ți înțelegerea

1. Ce înseamnă exact „polimorfism” când ai o variabilă tratată ca `Animal`, dar apelezi `sunet()` și obții `"Ham!"` pentru că obiectul e de fapt un `Caine`?
   a) faptul că `Caine` și `Animal` au metode cu nume identic, dar complet independente, fără nicio legătură între ele  b) **faptul că Python alege la rulare metoda din clasa reală a obiectului (aici `Caine`), nu din clasa declarată sau presupusă (`Animal`), deci fiecare obiect „știe” cum să răspundă la același apel**  c) faptul că `Animal` transformă automat orice apel de metodă în apelul echivalent din clasa copil, prin `super()`  d) faptul că `sunet()` există o singură dată, în `Animal`, iar `Caine` doar afișează alt text hardcodat
      > Polimorfismul înseamnă că Python decide la rulare, nu la scrierea codului, ce versiune de sunet() se execută — folosește clasa reală a obiectului din memorie (Caine), indiferent cum e declarată sau tratată variabila (ca Animal), pentru că fiecare obiect „știe” care metodă suprascrisă îi aparține.

2. Ce înseamnă că `Caine` moștenește `Animal`?
   a) `Caine` copiază codul lui `Animal` la rulare  b) **Un `Caine` este și un `Animal`: preia atributele și metodele lui și le poate suprascrie**  c) `Animal` devine `Caine`
      > Moștenirea modelează relația „este un”; clasa derivată primește tot ce are clasa de bază și adaugă sau modifică doar ce e diferit.

3. Ce afișează `isinstance(Caine('Rex'), Animal)`?
   a) False  b) **True**  c) Eroare
      > Un obiect al clasei derivate este și o instanță a clasei de bază.

4. Dacă `Peste` nu suprascrie `sunet()`, ce întoarce `Peste('Nemo').sunet()`?
   a) Eroare  b) **Valoarea din `Animal`, adică '...'**  c) None
      > Când metoda lipsește din clasa derivată, Python o caută în clasa de bază.

---


:::verifica-cod
Scrie o funcție `descrie_animal(a)` care primește un obiect cu atributul `nume` și metoda `sunet()` și returnează un string de forma `"nume: sunet"`. Demo: pentru un `Caine("Rex")` care moștenește `Animal` și suprascrie `sunet()` cu `"Ham!"`, rezultatul e `"Rex: Ham!"`
template: def descrie_animal(a):
    # completeaza
    pass

class Animal:
    def __init__(self, nume):
        self.nume = nume
    def sunet(self):
        return "..."

class Caine(Animal):
    def sunet(self):
        return "Ham!"

c = Caine("Rex")
print(descrie_animal(c))
output: Rex: Ham!
:::

# Modulul 3.23 — POO în Python: sintaxa `class` și constructorul

### 🔄 3.23.1 Recapitulare

În 3.22 ai văzut conceptul de clasă/obiect. Acum sintaxa concretă în Python.

### 💡 3.23.2 Concept nou și exemplu

```python
class ContBancar:
    def __init__(self, titular, sold=0):
        self.titular = titular
        self.sold = sold

    def depune(self, suma):
        self.sold += suma

    def retrage(self, suma):
        if suma <= self.sold:
            self.sold -= suma
        else:
            print("Fonduri insuficiente")

c = ContBancar("Ana", 100)
c.depune(50)
print(c.sold)  # 150
```

`__init__` e **constructorul** — se apelează automat la crearea obiectului. `self` e referința la obiectul curent (primul parametru al oricărei metode).

:::atentie
`self` e obligatoriu în definiția metodei, dar NU la apel (Python îl pune automat: `c.depune(50)` nu `c.depune(c, 50)`).
:::


:::tip
## Atenție la valorile implicite mutabile în `__init__`
`sold=0` e sigur ca valoare implicită, dar nu folosi niciodată o listă sau un dicționar ca valoare implicită (`def __init__(self, istoric=[])`) — acel obiect e creat o singură dată și ajunge partajat, din greșeală, între toate instanțele clasei.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Construim clasa `Fractie`, cu simplificare automată în constructor, adunare de fracții și afișare frumoasă cu `__str__`.

**Ideea.** Constructorul împarte numărătorul și numitorul la cmmdc. Metoda `aduna` întoarce o fracție **nouă**. `__str__` stabilește cum arată obiectul în `print`.

```python
from math import gcd

class Fractie:
    def __init__(self, a, b):
        d = gcd(a, b)
        self.a, self.b = a // d, b // d

    def aduna(self, alta):
        return Fractie(self.a * alta.b + alta.a * self.b, self.b * alta.b)

    def __str__(self):
        return f'{self.a}/{self.b}'

x = Fractie(2, 4)
y = Fractie(1, 3)
print(x, y, x.aduna(y))
```
Rezultatul: `1/2 1/3 5/6`.

:::atentie
## Greșeli frecvente
- Definești o metodă fără `self` (`def depune(suma):`): la apel apare `TypeError`.
- Folosești o variabilă locală în loc de atribut (`sold = sold + suma` în loc de `self.sold += suma`): obiectul nu se modifică.
- Folosești o listă ca valoare implicită (`def __init__(self, istoric=[])`): lista e comună tuturor obiectelor. Folosește `None` și creează lista în constructor.
- Afișezi un obiect fără metoda `__str__`: apare ceva de forma `<__main__.ContBancar object at 0x...>`.
:::

### 🔮 3.23.3 Citește și prezice

```python
class ContBancar:
    def __init__(self, titular, sold=0):
        self.titular = titular
        self.sold = sold
    def depune(self, suma):
        self.sold += suma
    def retrage(self, suma):
        if suma <= self.sold:
            self.sold -= suma
        else:
            print("Fonduri insuficiente")

c = ContBancar("Ana", 100)
c.retrage(30)
print(c.sold)
```

### 🤝 3.23.4 Exerciții ghidate

Creează clasa `Produs` cu `nume`, `pret`, `stoc` și metoda `vinde(n)` care scade stocul.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: constructorul clasei Produs
class Produs:
    def __init__(self, nume, pret, stoc):
        self.nume = nume
        self.pret = ___
        self.stoc = stoc

    # Pasul 2: metoda care scade stocul
    def vinde(self, n):
        if n <= self.___:
            self.stoc -= ___
        else:
            print("Stoc insuficient")

p = Produs("Caiet", 5, 20)
p.vinde(3)
print(p.___)  # 17
```


### 🎯 3.23.5 Exerciții independente

Adaugă metoda `total()` care returnează `pret * stoc`.


**Exercițiul 1.** Adaugă la clasa `Produs` metoda `reaprovizioneaza(n)` care crește stocul cu `n` bucăți și afișează un mesaj cu noul stoc.

**Exercițiul 2.** Scrie o funcție `valoare_totala_magazin(lista_produse)` care primește o listă de obiecte `Produs` și returnează suma valorilor `total()` pentru toate produsele din listă.


### ✅ 3.23.6 Verifică-ți înțelegerea

1. De ce `self` trebuie declarat ca prim parametru al oricărei metode, deși nu-l scrii explicit când apelezi `c.depune(50)`?
   a) pentru că `self` e doar o convenție de denumire fără niciun efect real, ca un comentariu  b) **pentru că Python transformă automat apelul `c.depune(50)` în `ContBancar.depune(c, 50)`, deci metoda are nevoie de un parametru care să primească acel obiect (`c`) ca să-i poată accesa sau modifica atributele**  c) pentru că `self` trebuie mereu inițializat manual în interiorul metodei, înainte de a fi folosit  d) pentru că fără `self`, Python nu ar putea diferenția metodele de funcțiile obișnuite la nivel de fișier
      > Când scrii c.depune(50), Python îl traduce automat în ContBancar.depune(c, 50), trimițând obiectul c ca prim argument — self trebuie declarat în definiție tocmai ca să primească acel obiect și să poată citi sau modifica atributele lui (self.sold), chiar dacă la apel nu-l scrii tu manual.

2. Când se apelează `__init__`?
   a) Când se termină programul  b) **Automat, la crearea fiecărui obiect**  c) Doar dacă îl apelezi explicit
      > `ContBancar('Ana', 100)` creează obiectul și apelează imediat `__init__` pentru a-i seta atributele.

3. Ce afișează `print(obiect)` dacă clasa are metoda `__str__`?
   a) Adresa din memorie  b) **Textul întors de `__str__`**  c) Numele clasei
      > `print` folosește `__str__` pentru a transforma obiectul în text.

4. Ce greșeală are `def __init__(self, note=[])`?
   a) Nicio greșeală  b) **Lista implicită e creată o singură dată și ajunge comună tuturor obiectelor**  c) `self` trebuie pus la final
      > Valoarea implicită se evaluează o singură dată, la definirea funcției; orice `append` se vede apoi în toate obiectele.

---


:::verifica-cod
Folosind clasa `ContBancar` din lecție (cu metodele `depune` și `retrage`), scrie o funcție `sold_final(cont, sume)` care aplică pe rând o listă de sume: o valoare pozitivă înseamnă `depune`, o valoare negativă înseamnă `retrage` cu suma absolută. Returnează soldul final. Demo: pornind de la sold `100`, aplicând `[50, -30]`, rezultatul e `120`
template: def sold_final(cont, sume):
    # completeaza
    pass

class ContBancar:
    def __init__(self, titular, sold=0):
        self.titular = titular
        self.sold = sold
    def depune(self, suma):
        self.sold += suma
    def retrage(self, suma):
        if suma <= self.sold:
            self.sold -= suma

c = ContBancar("Ana", 100)
print(sold_final(c, [50, -30]))
output: 120
:::

# Modulul 3.24 — POO în Python: niveluri de acces și clase derivate

### 🔄 3.24.1 Recapitulare

În 3.23 ai scris o clasă cu `self` și `__init__`. Acum accesul la atribute și derivarea.

### 💡 3.24.2 Concept nou și exemplu

Python nu are `private`/`public` stricte, dar convenția e:
- `atribut` — public
- `_atribut` — "protejat" (convenție, nu forță)
- `__atribut` — "privat" (name mangling: devine `_Clasa__atribut`)

```python
class Persoana:
    def __init__(self, nume):
        self.nume = nume
        self.__salariu = 0  # privat

class Angajat(Persoana):
    def __init__(self, nume, post):
        super().__init__(nume)
        self.post = post
```

`super()` apelează constructorul clasei de bază.

:::tip
`super()` e esențial în clasele derivate: îți permite să reutilizezi logica clasei părinte fără să o rescrii.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Clasa `ContBancar` ascunde soldul (`__sold`) și îl schimbă doar prin metode care validează sumele. Arătăm că accesul direct e blocat, dar valoarea poate fi citită prin metoda publică.

**Ideea.** Atributul privat nu poate fi citit cu `c.__sold` din afara clasei. Metoda `sold()` îl citește corect. Name mangling arată că numele real este `_ContBancar__sold`.

```python
class ContBancar:
    def __init__(self, sold):
        self.__sold = sold

    def depune(self, suma):
        if suma > 0:
            self.__sold += suma

    def sold(self):
        return self.__sold

c = ContBancar(100)
c.depune(-500)
c.depune(50)
print(c.sold())
try:
    print(c.__sold)
except AttributeError:
    print('acces direct blocat')
print(c._ContBancar__sold)
```
Rezultatul:
```text
150
acces direct blocat
150
```

:::atentie
## Greșeli frecvente
- Încerci să citești `obiect.__salariu` din afara clasei: apare `AttributeError`, din cauza name mangling (numele real e `_Clasa__salariu`).
- În clasa derivată folosești `self.__viteza` definit în clasa de bază: numele e transformat diferit (`_Masina__viteza`) și nu-l găsește. Expune valoarea printr-o metodă sau folosește `_viteza`.
- Crezi că `_atribut` e protejat de limbaj. E doar o convenție: Python nu te oprește să-l modifici.
- Lași clientul clasei să modifice direct atributele importante (de exemplu soldul). Validează modificările prin metode.
:::

### 🔮 3.24.3 Citește și prezice

```python
class Persoana:
    def __init__(self, nume):
        self.nume = nume
        self.__salariu = 0

class Angajat(Persoana):
    def __init__(self, nume, post):
        super().__init__(nume)
        self.post = post

a = Angajat("Ion", "dev")
print(a.nume, a.post)
```

### 🤝 3.24.4 Exerciții ghidate

Creează `Vehicul` (cu `__viteza`) și `Bicicleta`/`Masina` care moștenesc, folosind `super()`.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: clasa de baza cu atribut privat
class Vehicul:
    def __init__(self, marca, viteza_maxima):
        self.marca = marca
        self.__viteza = ___

# Pasul 2: clasa derivata apeleaza constructorul parintelui
class Masina(___):
    def __init__(self, marca, viteza_maxima, nr_usi):
        super().__init__(marca, ___)
        self.nr_usi = nr_usi

m = Masina("Dacia", 180, 4)
print(m.marca, m.___)
```


### 🎯 3.24.5 Exerciții independente

Demonstrează name mangling: accesează atributul privat din exterior ca `_Clasa__atribut`.


**Exercițiul 1.** Scrie clasa `Bicicleta(Vehicul)` cu un atribut suplimentar `nr_viteze`, folosind `super().__init__()` pentru partea comună moștenită din `Vehicul`.

**Exercițiul 2.** Adaugă în `Vehicul` o metodă publică `viteza_maxima()` care returnează valoarea din `self.__viteza`, astfel încât clasele derivate să poată citi atributul privat fără să folosească name mangling direct.


### ✅ 3.24.6 Verifică-ți înțelegerea

1. De ce Python se bazează pe convenții de denumire (`_`, `__`) în loc de cuvinte cheie stricte `private`/`public`, ca alte limbaje?
   a) pentru că interpretorul Python nu poate face verificări de acces la rulare, din motive tehnice legate de memorie  b) **pentru că filozofia Python e „suntem toți adulți”: accesul e o convenție de comunicare între dezvoltatori, nu o restricție impusă forțat de limbaj — `__atribut` doar descurajează accesul accidental prin name mangling, dar tot poate fi accesat**  c) pentru că `_` și `__` sunt de fapt cuvinte cheie speciale, echivalente funcțional cu `private`/`public` din alte limbaje  d) pentru că orice atribut care începe cu `_` devine automat needitabil după ce obiectul e creat
      > Python urmează filozofia „suntem toți adulți”: nu impune blocarea accesului prin cuvinte cheie ca alte limbaje, ci doar semnalează intenția prin convenție — __atribut declanșează name mangling (devine _Clasa__atribut), ceea ce descurajează accesul accidental din exterior, dar nu îl interzice tehnic.

2. Ce face `super().__init__(marca, viteza)` în constructorul clasei `Masina`?
   a) Creează un obiect nou `Vehicul`  b) **Apelează constructorul clasei de bază pentru obiectul curent**  c) Șterge atributele din `Vehicul`
      > Astfel partea comună (marca, viteza) e inițializată de codul din `Vehicul`, iar `Masina` adaugă doar ce îi e specific.

3. Ce nume real primește atributul `__viteza` definit în clasa `Vehicul`?
   a) `viteza`  b) **`_Vehicul__viteza`**  c) `__viteza__`
      > Name mangling adaugă `_NumeClasa` în fața numelui, ca să descurajeze accesul și coliziunile în clasele derivate.

4. Ce semnalează un singur underscore, ca în `_stoc`?
   a) Atributul e constant  b) **Convenția „folosește-l doar în interiorul clasei sau al clasei derivate”**  c) Atributul e șters automat
      > Python nu aplică nicio restricție; underscore-ul e un mesaj pentru ceilalți programatori.

---


:::verifica-cod
Folosind clasele `Vehicul` și `Masina(Vehicul)` din lecție (unde `Masina` apelează `super().__init__()` și adaugă atributul `nr_usi`), scrie o funcție `info_masina(m)` care returnează un string de forma `"marca are nr_usi usi"`. Demo: pentru `Masina("Dacia", 180, 4)`, rezultatul e `"Dacia are 4 usi"`
template: def info_masina(m):
    # completeaza
    pass

class Vehicul:
    def __init__(self, marca, viteza_maxima):
        self.marca = marca
        self.__viteza = viteza_maxima

class Masina(Vehicul):
    def __init__(self, marca, viteza_maxima, nr_usi):
        super().__init__(marca, viteza_maxima)
        self.nr_usi = nr_usi

m = Masina("Dacia", 180, 4)
print(info_masina(m))
output: Dacia are 4 usi
:::

# Modulul 3.25 — Paradigme de programare

### 🔄 3.25.1 Recapitulare

Ai scris cod procedural (funcții) și POO (clase). Acestea sunt **paradigme** diferite de a structura un program.

### 💡 3.25.2 Concept nou și exemplu

Principalele paradigme:
- **Imperativă / procedurală**: secvențe de instrucțiuni și funcții (ce ai făcut la început).
- **Orientată pe obiecte (POO)**: obiecte care își manipulează datele (3.22–3.24).
- **Funcțională**: funcții ca valori, imutabilitate, `map`/`filter`/`lambda` (ex. `list(map(lambda x: x*2, l))`).
- **Logică / declarativă**: descrii *ce* vrei, nu *cum* (ex. SQL, Prolog).

Python suportă multiple paradigme — le poți amesteca.


```python
numere = [1, 2, 3, 4, 5, 6]

# stil procedural
pare_procedural = []
for x in numere:
    if x % 2 == 0:
        pare_procedural.append(x)

# stil functional
pare_functional = list(filter(lambda x: x % 2 == 0, numere))

print("Procedural:", pare_procedural)
print("Functional:", pare_functional)
```


:::tip
Nu e "una e mai bună". Procedural e simplu pentru scripturi; POO e bun pentru sisteme mari; funcționala e elegantă pentru transformări de date.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Rezolvăm aceeași problemă în trei stiluri: media notelor de cel puțin 5 dintr-o listă, rotunjită la două zecimale.

**Ideea.** Procedural: o buclă cu variabile care se modifică. Funcțional: `filter`, apoi `sum`/`len`, fără variabile modificate. Obiectual: o clasă `Catalog` care ascunde detaliile într-o metodă.

```python
note = [9, 4, 7, 10, 3, 8]

# procedural
s, n = 0, 0
for x in note:
    if x >= 5:
        s += x
        n += 1
print(round(s / n, 2))

# funcțional
trecute = list(filter(lambda x: x >= 5, note))
print(round(sum(trecute) / len(trecute), 2))

# obiectual
class Catalog:
    def __init__(self, note):
        self.note = note
    def media_promovati(self):
        bune = [x for x in self.note if x >= 5]
        return round(sum(bune) / len(bune), 2)

print(Catalog(note).media_promovati())
```
Rezultatul:
```text
8.5
8.5
8.5
```

:::atentie
## Greșeli frecvente
- Crezi că un stil e „corect” și celelalte „greșite”. Alegi paradigma potrivită problemei.
- Uiți că `map` și `filter` întorc obiecte care se pot parcurge o singură dată: dacă ai nevoie de listă, scrie `list(...)`.
- Scrii `lambda` complicate pe o singură linie, greu de citit. O funcție cu nume e adesea mai clară.
- În stil funcțional modifici o listă externă din interiorul lui `map`: amesteci paradigmele și pierzi avantajul (lipsa efectelor secundare).
:::

### 🔮 3.25.3 Citește și prezice

```python
l = [1, 2, 3, 4]
print(list(map(lambda x: x**2, l)))
```

### 🤝 3.25.4 Exerciții ghidate

Scrie același program (filtrat numere pare dintr-o listă) în stil procedural și în stil funcțional (`filter`).


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: stil procedural
numere = [1, 2, 3, 4, 5, 6]
pare = []
for x in numere:
    if x % ___ == 0:
        pare.append(___)

# Pasul 2: acelasi rezultat, stil functional
pare_functional = list(___(lambda x: x % 2 == 0, numere))
print("Rezultat:", ___)
```


### 🎯 3.25.5 Exerciții independente

Scrie o clasă `Calculator` (POO) care expune operații ca metode, demonstrând paradigma obiectuală.


**Exercițiul 1.** Scrie aceeași logică din `Calculator` ca versiune procedurală — patru funcții separate `aduna(a, b)`, `scade(a, b)`, `inmulteste(a, b)`, `imparte(a, b)` — și compară cele două stiluri pe aceleași date de test.

**Exercițiul 2.** Scrie o versiune funcțională: o funcție `calculeaza(operatie, a, b)` care primește o funcție (de exemplu `aduna` sau `scade`) ca parametru și o aplică pe `a` și `b`, demonstrând folosirea funcțiilor ca valori de prim rang.


### ✅ 3.25.6 Verifică-ți înțelegerea

1. În ce situație e mai potrivit stilul funcțional (`map`/`filter`/`lambda`) decât cel procedural (bucle `for` cu variabile mutabile)?
   a) când vrei să modifici direct o bază de date externă, pas cu pas, în ordine strict controlată  b) **când transformi date dintr-o formă în alta (filtrare, mapare) fără să ai nevoie de stare mutabilă intermediară, iar codul câștigă în claritate și se poate compune ușor din funcții mici**  c) când programul are nevoie de mai puține linii de cod, indiferent de ce face acel cod  d) când vrei să eviți complet definirea oricăror funcții în program
      > Stilul funcțional câștigă exact când transformi o colecție de date dintr-o formă în alta — filtrare sau mapare — fără să ai nevoie de o variabilă mutabilă care să acumuleze rezultatul pas cu pas, ca lista goală dintr-o buclă for; map/filter/lambda exprimă direct transformarea și se pot combina ușor din funcții mici.

2. Ce afișează `list(map(lambda x: x * x, [1, 2, 3]))`?
   a) [1, 2, 3]  b) **[1, 4, 9]**  c) [2, 4, 6]
      > `map` aplică funcția fiecărui element: 1·1, 2·2, 3·3.

3. SQL este un exemplu de paradigmă:
   a) Procedurală  b) **Declarativă**  c) Orientată pe obiecte
      > În SQL descrii ce date vrei (SELECT ... WHERE ...), nu pașii prin care le găsește baza de date.

4. Ce înseamnă că în Python funcțiile sunt „valori de prim rang”?
   a) Se execută primele  b) **Pot fi salvate în variabile, transmise ca parametri și întoarse din alte funcții**  c) Nu pot avea parametri
      > De aceea poți scrie `sorted(L, key=len)` sau `map(f, L)`: funcția însăși e transmisă ca argument.

---


:::verifica-cod
Scrie, în stil funcțional (folosind `map` și `lambda`, nu buclă `for`), o funcție `dubleaza_functional(lst)` care returnează o listă nouă cu toate elementele din `lst` înmulțite cu 2. Demo: `dubleaza_functional([1,2,3])` -> `[2, 4, 6]`
template: def dubleaza_functional(lst):
    # completeaza
    pass

print(dubleaza_functional([1, 2, 3]))
output: [2, 4, 6]
:::
