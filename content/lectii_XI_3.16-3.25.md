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

### 🔮 3.16.3 Citește și prezice

```python
muchii = [(1,2,1),(2,3,2),(1,3,4)]
# Care e costul MST (Kruskal)?
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

Ai văzut grafurile (3.7). Un **arbore** e un graf conic, aciclic, cu n vârfuri și n−1 muchii.

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

### 🔮 3.17.3 Citește și prezice

```python
# Un arbore are 10 varfuri. Cate muchii are?
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

### 🔮 3.18.3 Citește și prezice

```python
rad = None
for x in [5, 3, 8, 1, 4]:
    rad = inserare(rad, x)
# Care e fiul stang al radacinii?
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
În un **BST**, inordinea afișează valorile în ordine crescătoare! E proprietatea cea mai utilă.
:::

### 🔮 3.20.3 Citește și prezice

```python
# BST cu valorile 5,3,8,1,4 (rad=5)
# Ce afiseaza inordinea?
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

### 🔮 3.21.3 Citește și prezice

```python
rad = None
for x in [50, 30, 70, 20, 40]:
    rad = inserare(rad, x)
# Exista 40 in arbore?
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
- **Moștenire**: o clasă derivată preia atributele/mrețurile celei de bază.

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

### 🔮 3.22.3 Citește și prezice

```python
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

### 🔮 3.23.3 Citește și prezice

```python
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
- `_atribut` — "protejat" (convenție, nu fortă)
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

### 🔮 3.24.3 Citește și prezice

```python
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

Demonstră name mangling: accesează atributul privat din exterior ca `_Clasa__atribut`.


**Exercițiul 1.** Scrie clasa `Bicicleta(Vehicul)` cu un atribut suplimentar `nr_viteze`, folosind `super().__init__()` pentru partea comună moștenită din `Vehicul`.

**Exercițiul 2.** Adaugă în `Vehicul` o metodă publică `viteza_maxima()` care returnează valoarea din `self.__viteza`, astfel încât clasele derivate să poată citi atributul privat fără să folosească name mangling direct.


### ✅ 3.24.6 Verifică-ți înțelegerea

1. De ce Python se bazează pe convenții de denumire (`_`, `__`) în loc de cuvinte cheie stricte `private`/`public`, ca alte limbaje?
   a) pentru că interpretorul Python nu poate face verificări de acces la rulare, din motive tehnice legate de memorie  b) **pentru că filozofia Python e „suntem toți adulți”: accesul e o convenție de comunicare între dezvoltatori, nu o restricție impusă forțat de limbaj — `__atribut` doar descurajează accesul accidental prin name mangling, dar tot poate fi accesat**  c) pentru că `_` și `__` sunt de fapt cuvinte cheie speciale, echivalente funcțional cu `private`/`public` din alte limbaje  d) pentru că orice atribut care începe cu `_` devine automat needitabil după ce obiectul e creat

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
- **Imperativă / procedurală**: sequențe de instrucțiuni și funcții (ce ai făcut la început).
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

### 🔮 3.25.3 Citește și prezice

```python
l = [1, 2, 3, 4]
# Ce returneaza list(map(lambda x: x**2, l))?
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


:::verifica-cod
Scrie, în stil funcțional (folosind `map` și `lambda`, nu buclă `for`), o funcție `dubleaza_functional(lst)` care returnează o listă nouă cu toate elementele din `lst` înmulțite cu 2. Demo: `dubleaza_functional([1,2,3])` -> `[2, 4, 6]`
template: def dubleaza_functional(lst):
    # completeaza
    pass

print(dubleaza_functional([1, 2, 3]))
output: [2, 4, 6]
:::
