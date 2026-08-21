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

### 🎯 3.16.5 Exerciții independente

Returnează lista muchiilor alese de Kruskal (nu doar costul).

### ✅ 3.16.6 Verifică-ți înțelegerea

De ce ai nevoie de Union-Find (și nu doar de un set de vârfuri vizitate) ca să detectezi cicluri?

---


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
output: 2
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

:::tip
Orice arbore conex cu n vârfuri are exact n−1 muchii. Dacă adaugi o muchie, apare un ciclu; dacă o scoți, se deconectează.
:::

### 🔮 3.17.3 Citește și prezice

```python
# Un arbore are 10 varfuri. Cate muchii are?
```

### 🤝 3.17.4 Exerciții ghidate

Scrie o funcție care calculează înălțimea unui arbore reprezentat prin `parinte[v]`.

### 🎯 3.17.5 Exerciții independente

Numără frunzele unui arbore (nodurile care nu apar ca părinte al nimănui).

### ✅ 3.17.6 Verifică-ți înțelegerea

De ce nu poate exista un arbore cu cicluri sau deconectat, având în același timp n vârfuri și n−1 muchii?

---


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
output: 2
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

### 🔮 3.18.3 Citește și prezice

```python
rad = None
for x in [5, 3, 8, 1, 4]:
    rad = inserare(rad, x)
# Care e fiul stang al radacinii?
```

### 🤝 3.18.4 Exerciții ghidate

Scrie `inserare` și o funcție care verifică dacă un arbore e BST valid.

### 🎯 3.18.5 Exerciții independente

Scrie `minim_bst(rad)` care returnează cea mai mică valoare dintr-un BST.

### ✅ 3.18.6 Verifică-ți înțelegerea

De ce căutarea într-un BST echilibrat e O(log n), nu O(n)?

---


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
output: 2
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

### 🎯 3.19.5 Exerciții independente

Implementează manual (fără `heapq`) operația `push` într-un min-heap reprezentat ca listă.

### ✅ 3.19.6 Verifică-ți înțelegerea

De ce un heap bazat pe listă e mai eficient decât re-sortarea listei la fiecare extragere a minimului?

---


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
output: 2
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

### 🎯 3.20.5 Exerciții independente

Calculează înălțimea unui arbore binar folosind postordinea.

### ✅ 3.20.6 Verifică-ți înțelegerea

De ce inordinea unui BST dă mereu valorile sortate crescător?

---


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
output: 2
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

### 🔮 3.21.3 Citește și prezice

```python
rad = None
for x in [50, 30, 70, 20, 40]:
    rad = inserare(rad, x)
# Exista 40 in arbore?
```

### 🤝 3.21.4 Exerciții ghidate

Scrie `cauta` și `inserare` (iterativ, nu recursiv) pentru un BST.

### 🎯 3.21.5 Exerciții independente

Scrie `sterge(rad, v)` care elimină un nod dintr-un BST păstrând proprietatea.

### ✅ 3.21.6 Verifică-ți înțelegerea

De ce ștergerea unui nod cu doi copii e mai complicată decât a unui nod cu cel mult un copil?

---


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
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

### 🎯 3.22.5 Exerciții independente

Adaugă metoda `descriere()` în `Forma` și suprascrie-o în derivate.

### ✅ 3.22.6 Verifică-ți înțelegerea

Ce înseamnă "polimorfismul" când apelezi `sunet()` pe un `Animal` care e de fapt un `Caine`?

---


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
output: 2
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

### 🔮 3.23.3 Citește și prezice

```python
c = ContBancar("Ana", 100)
c.retrage(30)
print(c.sold)
```

### 🤝 3.23.4 Exerciții ghidate

Creează clasa `Produs` cu `nume`, `pret`, `stoc` și metoda `vinde(n)` care scade stocul.

### 🎯 3.23.5 Exerciții independente

Adaugă metoda `total()` care returnează `pret * stoc`.

### ✅ 3.23.6 Verifică-ți înțelegerea

De ce `self` trebuie să fie primul parametru al metodei, deși nu îl scrii la apel?

---


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
output: 2
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

### 🎯 3.24.5 Exerciții independente

Demonstră name mangling: accesează atributul privat din exterior ca `_Clasa__atribut`.

### ✅ 3.24.6 Verifică-ți înțelegerea

De ce Python folosește convenții (`_`, `__`) în loc de cuvinte cheie `private`/`public`?

---


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
output: 2
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

### 🎯 3.25.5 Exerciții independente

Scrie o clasă `Calculator` (POO) care expune operații ca metode, demonstrând paradigma obiectuală.

### ✅ 3.25.6 Verifică-ți înțelegerea

În ce situații ai alege paradigma funcțională în loc de cea procedurală?


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
output: 2
:::
