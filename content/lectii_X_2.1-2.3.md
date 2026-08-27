# Modulul 2.1 — Căutarea binară

### 🔄 2.1.1 Recapitulare

În clasa a IX-a ai învățat să cauți un element într-o listă parcurgând-o de la cap la coadă (căutare secvențială). Funcționează pe orice listă, dar pentru liste mari e ineficientă: în cel mai rău caz verifici toate elementele. Când lista e **deja sortată**, există o metodă mult mai rapidă — căutarea binară.

### 💡 2.1.2 Concept nou și exemplu

**Căutarea binară** găsește un element într-o listă sortată în timp O(log n). Ideea: comparăm elementul căutat cu mijlocul listei; dacă e mai mic, continuăm doar în jumătatea stângă, dacă e mai mare, doar în cea dreaptă. Repetăm până găsim elementul sau intervalul devine vid.

```python
def cautare_binara(lista, x):
    stanga, dreapta = 0, len(lista) - 1
    while stanga <= dreapta:
        mijloc = (stanga + dreapta) // 2
        if lista[mijloc] == x:
            return mijloc
        elif lista[mijloc] < x:
            stanga = mijloc + 1
        else:
            dreapta = mijloc - 1
    return -1   # nu a fost găsit

print(cautare_binara([1, 3, 5, 7, 9, 11], 7))  # 3
print(cautare_binara([1, 3, 5, 7, 9, 11], 4))  # -1
```

**De ce e rapidă?** La fiecare pas eliminăm jumătate din lista rămasă. Pentru 1000 de elemente, în loc de 1000 de pași, ajungem la rezultat în maxim ~10 pași (log₂1000 ≈ 10).

**Interclasarea** combină două liste *deja sortate* într-una singură, sortată, parcurgându-le simultan și alegând mereu cea mai mică valoare disponibilă. E baza sortării prin interclasare (modulul 2.19).

```python
def interclaseaza(a, b):
    rez = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            rez.append(a[i]); i += 1
        else:
            rez.append(b[j]); j += 1
    rez.extend(a[i:]); rez.extend(b[j:])
    return rez

print(interclaseaza([1, 4, 7], [2, 3, 8]))  # [1, 2, 3, 4, 7, 8]
```


:::tip
## Sfaturi & Bune Practici Didactice
:::atentie
Fiecare funcție recursivă trebuie să aibă cel puțin un caz de bază (condiție de oprire) bine definit, altfel va rezulta o eroare de tip RecursionError (stack overflow)!
:::
:::

### 🔮 2.1.3 Citește și prezice

```python
def cautare_binara(lista, x):
    stanga, dreapta = 0, len(lista) - 1
    while stanga <= dreapta:
        mijloc = (stanga + dreapta) // 2
        if lista[mijloc] == x:
            return mijloc
        elif lista[mijloc] < x:
            stanga = mijloc + 1
        else:
            dreapta = mijloc - 1
    return -1

rezultat = cautare_binara([2, 5, 8, 12, 16, 23, 38], 16)
print(rezultat)
```
Ce valoare se afișează? (Indiciu: 16 e pe poziția a 5-a din lista sortată, indexând de la 0.)

### 🤝 2.1.4 Exerciții ghidate

**Exercițiul 1.** Completează condiția care actualizează `dreapta` când elementul de la mijloc e mai mare decât `x`:
```python
def cautare_binara(lista, x):
    stanga, dreapta = 0, len(lista) - 1
    while stanga <= dreapta:
        mijloc = (stanga + dreapta) // 2
        if lista[mijloc] == x:
            return mijloc
        elif lista[mijloc] < x:
            stanga = mijloc + 1
        else:
            ___ = mijloc - 1   # completează
    return -1
```

**Exercițiul 2.** Scrie o funcție care returnează `True` dacă `x` se află în listă (folosind căutarea binară), indiferent de poziție.

### 🎯 2.1.5 Exerciții independente

**Exercițiul 1.** Modifică `cautare_binara` pentru a returna poziția unde ar trebui inserat elementul (dacă nu există în listă), în loc de -1.

**Exercițiul 2.** Scrie o funcție care interclasează două liste sortate și elimină duplicatele din rezultat.

### ✅ 2.1.6 Verifică-ți înțelegerea

1. Căutarea binară funcționează pe:
   a) Orice listă  b) **O listă sortată**  c) Doar liste cu numere pare

2. La fiecare pas, căutarea binară elimină:
   a) Un element  b) **Jumătate din lista rămasă**  c) Primul element

3. Complexitatea căutării binare este:
   a) O(n)  b) **O(log n)**  c) O(n²)

4. Dacă `lista[mijloc] < x`, ce facem?
   a) `dreapta = mijloc - 1`  b) **`stanga = mijloc + 1`**  c) Returnăm -1


:::verifica-cod
Scrie o funcție `numara_pasi(lista, x)` care returnează câți pași (comparații) face căutarea binară până găsește elementul `x`. Demo: `numara_pasi([1, 2, 3, 4, 5, 6, 7, 8], 1)` -> `3`
template: def numara_pasi(lista, x):
    # completeaza
    pass

print(numara_pasi([1, 2, 3, 4, 5, 6, 7, 8], 1))
output: 3
:::

# Modulul 2.3 — Modelul conceptual mulțime

### 🔄 2.3.1 Recapitulare

Ai folosit liste (`[ ]`) pentru a ține mai multe valori. Dar o listă păstrează ordinea și permite duplicate. Ce faci când nu te interesează ordinea și vrei să eviți repetițiile (ex. cuvintele distincte dintr-un text)?

### 💡 2.3.2 Concept nou și exemplu

O **mulțime** (set) e o colecție de elemente **fără ordine** și **fără duplicate**. Operațiile seamănă cu matematica: reuniune (`|`), intersecție (`&`), diferență (`-`), apartenență (`in`).

```python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a | b)    # {1, 2, 3, 4, 5, 6}  (reuniune)
print(a & b)    # {3, 4}               (intersecție)
print(a - b)    # {1, 2}               (diferență)
print(3 in a)   # True

a.add(10)
a.discard(1)    # elimină dacă există; nu crapă dacă nu
print(a)        # {2, 3, 4, 10}
```

Atenție: `{}` creează un **dicționar** vid, nu o mulțime! Mulțimea vidă se creează cu `set()`.


:::tip
## Sfaturi & Bune Practici Didactice
:::tip
Tehnica Divide et Impera împarte problema în subprobleme independente de dimensiune mai mică, le rezolvă recursiv și combină rezultatele!
:::
:::

### 🔮 2.3.3 Citește și prezice

```python
a = {1, 2, 3}
b = {2, 3, 4}
rezultat = a & b
print(rezultat)
```
Ce se afișează?

### 🤝 2.3.4 Exerciții ghidate

**Exercițiul 1.** Completează pentru a crea o mulțime cu trei numere și a verifica apartenența:
```python
m = ___  # creează mulțimea {5, 10, 15}
print(10 ___ m)  # True (completează operatorul de apartenență)
```

**Exercițiul 2.** Scrie codul care afișează elementele comune a două liste (folosind mulțimi).

### 🎯 2.3.5 Exerciții independente

**Exercițiul 1.** Scrie un program care citește un text și afișează mulțimea cuvintelor distincte (ignorând repetițiile).

**Exercițiul 2.** Pentru două liste de participanți la două cursuri, determină cine e înscris la ambele (intersecția).

### ✅ 2.3.6 Verifică-ți înțelegerea

1. O mulțime permite:
   a) Elemente ordonate  b) **Elemente fără duplicate și fără ordine**  c) Doar numere

2. Cum creezi o mulțime vidă?
   a) `{}`  b) **`set()`**  c) `[]`

3. Operatorul pentru intersecție este:
   a) `|`  b) **`&`**  c) `-`

4. `3 in {1, 2, 3}` returnează:
   a) **True**  b) False  c) 3


:::verifica-cod
Scrie o funcție `are_duplicate(lista)` care returnează True dacă lista conține cel puțin un element duplicat (folosind o mulțime). Demo: `are_duplicate([1, 2, 3, 2])` -> `True`
template: def are_duplicate(lista):
    # completeaza
    pass

print(are_duplicate([1, 2, 3, 2]))
output: True
:::
