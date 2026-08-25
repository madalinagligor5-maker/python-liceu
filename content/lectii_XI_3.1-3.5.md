# Modulul 3.1 — Liste înlănțuite: concept și tipuri

### 🔄 3.1.1 Recapitulare

În clasele IX–X ai folosit listele Python (`list`), care țin elementele într-o zonă continuă de memorie și permit acces rapid după index. Dar adăugarea/ștergerea la început sau la mijloc e costisitoare (toate elementele se deplasează).

### 💡 3.1.2 Concept nou și exemplu

O **listă înlănțuită** este o structură de date formată din noduri. Fiecare nod ține o **valoare** și o **referință** (legătură) către nodul următor. Nu ai nevoie de memorie continuă — nodurile pot fi oriunde, legate între ele.

Exemplu de nod în Python:
```python
class Nod:
    def __init__(self, valoare):
        self.valoare = valoare
        self.urmator = None  # referinta la urmatorul nod
```

**Tipuri:**
- **Listă simplu înlănțuită**: fiecare nod pointează doar la următorul (parcuregi într-o singură direcție).
- **Listă dublu înlănțuită**: nodul are și `anterior` (poți merge în ambele sensuri).
- **Listă circulară**: ultimul nod pointează înapoi la primul.

:::tip
Diferența esențială față de `list`: în listă înlănțuită, inserarea/ștergerea la capătul potrivit e O(1), dar accesul după index e O(n).
:::

### 🔮 3.1.3 Citește și prezice

```python
n1 = Nod(10)
n2 = Nod(20)
n3 = Nod(30)
n1.urmator = n2
n2.urmator = n3
# Ce valoare se afla in n1.urmator.urmator.valoare?
```

### 🤝 3.1.4 Exerciții ghidate

Construiește o listă simplu înlănțuită cu valorile 5, 8, 12 și afișeaz-o parcurgând de la `n1` la `None`.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: creare noduri
n1 = Nod(5)
n2 = Nod(8)
n3 = Nod(12)

# Pasul 2: legare noduri
n1.___ = n2
n2.urmator = ___

# Pasul 3: parcurgere si afisare
curent = ___
while curent is not None:
    print(curent.valoare)
    curent = curent.___
```


### 🎯 3.1.5 Exerciții independente

Scrie o funcție `lungime(nod_inceput)` care returnează numărul de noduri dintr-o listă înlănțuită.


**Exercițiul 1.** Scrie o funcție `contine(nod_inceput, x)` care returnează `True` dacă valoarea `x` apare în listă și `False` altfel, parcurgând nodurile de la `nod_inceput` până la `None`.

**Exercițiul 2.** Folosind ideea funcției `lungime` de mai sus, scrie o funcție `element_la_pozitie(nod_inceput, i)` care returnează valoarea nodului aflat pe poziția `i` (indexată de la 0) sau `None` dacă poziția depășește lungimea listei.


### ✅ 3.1.6 Verifică-ți înțelegerea

Poți explica de ce într-o listă înlănțuită nu putem accesa elementul de pe poziția i direct, ci trebuie să parcurgem de la început?

---


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
output: 2
:::

# Modulul 3.2 — Liste înlănțuite: operații de bază (adăugare, eliminare)

### 🔄 3.2.1 Recapitulare

În 3.1 ai văzut că un nod ține valoarea și legătura către următorul. O listă e un lanț de astfel de noduri.

### 💡 3.2.2 Concept nou și exemplu

**Adăugare la început:**
```python
def adauga_inceput(cap, valoare):
    nou = Nod(valoare)
    nou.urmator = cap
    return nou  # noul cap devine capul listei
```

**Adăugare la sfârșit:**
```python
def adauga_sfarsit(cap, valoare):
    nou = Nod(valoare)
    if cap is None:
        return nou
    curent = cap
    while curent.urmator is not None:
        curent = curent.urmator
    curent.urmator = nou
    return cap
```

**Eliminare:** refaci legăturile — nodul anterior va pointa la nodul de după cel eliminat.

:::atentie
La eliminarea capului, noul cap devine `cap.urmator`. Dacă uiți să actualizezi referința listei, pierzi întreaga listă!
:::


:::tip
## Capcana referinței pierdute
Funcțiile precum `adauga_inceput` sau `elimina_valoare` întorc noul cap al listei — trebuie mereu să reții rezultatul înapoi în variabilă (`cap = adauga_inceput(cap, x)`). Dacă apelezi funcția fără să suprascrii `cap`, nodurile noi există în memorie, dar restul programului tot vede lista veche, pentru că referința ta n-a fost actualizată.
:::

### 🔮 3.2.3 Citește și prezice

```python
cap = None
cap = adauga_sfarsit(cap, 1)
cap = adauga_sfarsit(cap, 2)
cap = adauga_inceput(cap, 0)
# Ce valori apar la parcurgere, in ordine?
```

### 🤝 3.2.4 Exerciții ghidate

Scrie `elimina_valoare(cap, x)` care elimină primul nod cu valoarea `x` dintr-o listă.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: construire lista goala
cap = None

# Pasul 2: adaugare elemente la sfarsit
cap = adauga_sfarsit(cap, 3)
cap = adauga_sfarsit(___, 7)

# Pasul 3: eliminare valoare din lista
cap = elimina_valoare(___, 3)

# Pasul 4: afisare rezultat
curent = cap
while curent is not None:
    print(curent.___)
    curent = curent.urmator
```


### 🎯 3.2.5 Exerciții independente

Scrie `insereaza_dupa(cap, x, y)` care inserează valoarea `y` imediat după primul nod cu valoarea `x`.


**Exercițiul 1.** Scrie o funcție `elimina_ultimul(cap)` care elimină ultimul nod din listă și întoarce noul cap (ai grijă la cazul în care lista are un singur nod).

**Exercițiul 2.** Folosind `insereaza_dupa` de mai sus, scrie un program care pornește de la o listă goală, adaugă la sfârșit valorile 1, 2 și 4, apoi inserează valoarea 3 după valoarea 2, și afișează lista finală: 1 2 3 4.


### ✅ 3.2.6 Verifică-ți înțelegerea

De ce adăugarea la sfârșit într-o listă simplu înlănțuită necesită parcurgerea întregii liste (O(n)), în timp ce la început e O(1)?

---


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
output: 2
:::

# Modulul 3.3 — Backtracking: principiu și condiții

### 🔄 3.3.1 Recapitulare

Ai folosit recursivitatea (2.17) pentru a rezolva probleme prin apeluri proprii. Backtracking-ul este o tehnică bazată pe recursivitate care explorează sistematic soluții.

### 💡 3.3.2 Concept nou și exemplu

**Backtracking** = "înapoi în caz de eșec". Construiești o soluție pas cu pas; dacă ajungi într-o situație invalidă, te întorci (backtrack) și încerci o altă alegere.

Schema generală:
```python
def backtrack(solutie_partiala):
    if este_completa(solutie_partiala):
        proceseaza(solutie_partiala)
        return
    for optiune in optiuni_posibile():
        if este_valida(solutie_partiala + optiune):
            backtrack(solutie_partiala + optiune)  # continua
```

**Condiții pentru backtracking:**
1. Poți construi soluția incremental (pas cu pas).
2. Poți verifica rapid dacă o alegere e validă.
3. Soluția e finită (se termină).

:::tip
Backtracking explorează un arbore de decizii. La fiecare nivel alegi o ramură; dacă nu duce la nimic, revii și alegi alta.
:::

### 🔮 3.3.3 Citește și prezice

```python
def f(n):
    if n == 0:
        return 1
    total = 0
    for i in range(2):
        total += f(n - 1)
    return total
# Cat este f(3)?
```

### 🤝 3.3.4 Exerciții ghidate

Scrie un backtracking care generează toate șirurile de lungime `n` formate doar din 'A' și 'B'.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: pornim de la un sir partial gol
def genereaza(sir_partial, n):
    # Pasul 2: conditia de oprire - sirul are lungimea n
    if len(___) == n:
        print(sir_partial)
        return
    # Pasul 3: incercam fiecare litera posibila
    for litera in ___:
        genereaza(sir_partial + ___, n)

genereaza("", 3)
```


### 🎯 3.3.5 Exerciții independente

Modifică generatorul de mai sus să nu permită două 'A' alăturate.


**Exercițiul 1.** Scrie o funcție de backtracking `genereaza_fara_AA(sir_partial, n)` care generează toate șirurile de lungime `n` din literele 'A' și 'B', dar nu permite două 'A' consecutive.

**Exercițiul 2.** Modifică funcția de la exercițiul 1 astfel încât, în loc să afișeze fiecare șir, să numere câte șiruri valide există în total pentru un `n` dat și să afișeze doar numărul final.


### ✅ 3.3.6 Verifică-ți înțelegerea

În ce se diferențiază backtracking-ul de o simplă parcurgere recursivă a unui arbore deja dat?

---


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
output: 2
:::

# Modulul 3.4 — Backtracking: probleme clasice (permutări, regine)

### 🔄 3.4.1 Recapitulare

În 3.3 ai văzut schema generală de backtracking. Acum o aplicăm la probleme celebre.

### 💡 3.4.2 Concept nou și exemplu

**Permutări:** generează toate aranjamentele elementelor unei liste. La fiecare poziție, încerci fiecare element care nu e deja folosit.

**Problema reginelor:** plasează `n` regine pe o tablă `n×n` astfel încât nicio două să nu se atace (aceeași linie, coloană sau diagonală).

```python
def regine(n):
    sol = []
    def valid(lin, col):
        for i in range(lin):
            if sol[i] == col or abs(sol[i] - col) == lin - i:
                return False
        return True
    def bk(lin):
        if lin == n:
            print(sol); return
        for col in range(n):
            if valid(lin, col):
                sol.append(col); bk(lin + 1); sol.pop()
    bk(0)
```


:::tip
## Nu uita pasul de revenire
La fiecare apel recursiv din backtracking — la permutări sau la problema reginelor — trebuie să anulezi alegerea făcută înainte de a încerca următoarea variantă: `sol.pop()` după `bk(lin + 1)`, sau marcarea unui element ca nefolosit după ce revii dintr-un apel pentru permutări. Dacă omiți acest pas, starea rămâne "murdară" de la o ramură la alta, iar soluțiile generate vor fi greșite sau incomplete.
:::

### 🔮 3.4.3 Citește și prezice

```python
# Pentru n=4, cate solutii de plasare a reginelor exista?
# (Indiciune: gandeste-te la simetrie)
```

### 🤝 3.4.4 Exerciții ghidate

Scrie un program care afișează toate permutările listei `[1, 2, 3]`.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: lista de start si starea de backtracking
elemente = [1, 2, 3]
folosite = [False, False, False]
permutare_curenta = []

def backtrack_permutari():
    # Pasul 2: conditia de oprire - permutarea e completa
    if len(permutare_curenta) == len(___):
        print(permutare_curenta)
        return
    # Pasul 3: incercam fiecare element nefolosit
    for i in range(len(elemente)):
        if not folosite[___]:
            folosite[i] = True
            permutare_curenta.append(elemente[___])
            backtrack_permutari()
            permutare_curenta.pop()
            folosite[i] = ___
```


### 🎯 3.4.5 Exerciții independente

Modifică problema reginelor să returneze numărul de soluții, nu să le afișeze.


**Exercițiul 1.** Modifică funcția `regine(n)` astfel încât să returneze numărul total de soluții găsite, în loc să le afișeze cu `print`.

**Exercițiul 2.** Folosind funcția modificată de la exercițiul 1, scrie un program care afișează, pentru fiecare valoare a lui `n` de la 1 la 8, numărul de soluții ale problemei celor `n` regine.


### ✅ 3.4.6 Verifică-ți înțelegerea

De ce condiția `abs(sol[i] - col) == lin - i` verifică atacul pe diagonală?

---


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
output: 2
:::

# Modulul 3.5 — Backtracking generalizat

### 🔄 3.5.1 Recapitulare

În 3.4 ai rezolvat permutări și regine — cazuri unde soluția are o structură fixă (o poziție per linie).

### 💡 3.5.2 Concept nou și exemplu

**Backtracking generalizat** se aplică când spațiul soluțiilor e mai liber: combinații, partiții, culori de graf, sudoku. Nu mai ai nevoie de o "linie" fixă — decizi la fiecare pas ce alegi, cu posibilitatea de a lăsa o poziție necompletată.

Exemplu — toate submulțimile unei mulțimi:
```python
def submultimi(elements):
    rez = [[]]
    for x in elements:
        rez += [s + [x] for s in rez]
    return rez
```
Dar varianta cu backtracking explicit e utilă când vrei să oprești explorarea devreme (ex. suma submulțimii să nu depășească o limită).

:::tip
Folosește backtracking generalizat când vrei să generezi soluții și să le validezi pe măsură ce le construiești, nu după.
:::

### 🔮 3.5.3 Citește și prezice

```python
# Cate submultimi are multimea {1, 2, 3, 4}?
```

### 🤝 3.5.4 Exerciții ghidate

Scrie un backtracking care generează toate combinațiile de `k` elemente dintr-o listă de `n`.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: lista rezultat, pornim de la o combinatie goala
rezultat = []

def combinatii(start, k, elemente, combinatie_curenta):
    # Pasul 2: conditia de oprire - combinatia are k elemente
    if len(combinatie_curenta) == ___:
        rezultat.append(combinatie_curenta[:])
        return
    # Pasul 3: incercam fiecare element ramas, de la pozitia start
    for i in range(start, len(elemente)):
        combinatie_curenta.append(elemente[___])
        combinatii(i + 1, k, elemente, combinatie_curenta)
        combinatie_curenta.___()
```


### 🎯 3.5.5 Exerciții independente

Scrie un backtracking care găsește o submulțime cu suma exact `t` dintr-o listă de numere.


**Exercițiul 1.** Scrie o funcție de backtracking `submultime_suma(elemente, t)` care găsește și afișează prima submulțime a listei `elemente` a cărei sumă este exact `t`, oprind căutarea imediat ce o găsește.

**Exercițiul 2.** Modifică funcția de la exercițiul 1 astfel încât să afișeze toate submulțimile a căror sumă este exact `t`, nu doar prima găsită.


### ✅ 3.5.6 Verifică-ți înțelegerea

Când este mai eficient backtracking-ul decât a genera toate soluțiile și a le filtra pe cele valide?


:::verifica-cod
Scrie o funcție `numara(el, lst)` care returnează de câte ori apare `el` în lista `lst`. Demo: `numara(2,[1,2,2,3])` -> `2`
template: def numara(el, lst):
    # completeaza
    pass

print(numara(2,[1,2,2,3]))
output: 2
:::
