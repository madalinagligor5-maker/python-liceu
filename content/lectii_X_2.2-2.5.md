# Modulul 2.2 — Interclasarea a două liste ordonate

### 🔄 2.2.1 Recapitulare

În modulul anterior ai văzut căutarea binară pe liste sortate. Dar ce faci când ai deja două liste sortate și vrei una singură, sortată? Le poți concatena și sorta din nou, dar există o metodă mai eficientă: interclasarea.

### 💡 2.2.2 Concept nou și exemplu

**Interclasarea** parcurge cele două liste simultan, alegând mereu cea mai mică valoare disponibilă și adăugând-o în rezultat. Complexitate O(n+m), mult mai bună decât sortarea listei concatenate O((n+m)·log(n+m)).

```python
def interclaseaza(a, b):
    rez = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            rez.append(a[i]); i += 1
        else:
            rez.append(b[j]); __
    rez.extend(a[i:]); rez.extend(b[j:])
    return rez

print(interclaseaza([1, 4, 7], [2, 3, 8]))  # [1, 2, 3, 4, 7, 8]
```

Interclasarea e baza **sortării prin interclasare** (merge sort, modulul 2.19).


:::tip
## Sfaturi & Bune Practici Didactice
:::tip
La calculul recursiv al șirului Fibonacci sau factorialului, verifică valorile de intrare pentru n <= 0 pentru a preveni apeluri infinite!
:::
:::

### 🔮 2.2.3 Citește și prezice

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

print(interclaseaza([1, 3, 5], [2, 4, 6]))
```
Ce listă se afișează?

### 🤝 2.2.4 Exerciții ghidate

**Exercițiul 1.** Completează linia lipsă din `interclaseaza` (unde adaugi elementul din `b` când e mai mic):
```python
def interclaseaza(a, b):
    rez = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            rez.append(a[i]); i += 1
        else:
            ___ ; j += 1
    rez.extend(a[i:]); rez.extend(b[j:])
    return rez
```

**Exercițiul 2.** Scrie o funcție care interclasează și elimină duplicatele.

### 🎯 2.2.5 Exerciții independente

**Exercițiul 1.** Scrie o funcție care verifică dacă două liste interclasate dau o listă sortată corect (test de corectitudine).

**Exercițiul 2.** Interclasează trei liste sortate (folosește interclasarea a două liste de două ori).

### ✅ 2.2.6 Verifică-ți înțelegerea

1. Interclasarea necesită ca listele de intrare să fie:
   a) Oricum  b) **Sortate**  c) Egale ca lungime

2. Complexitatea interclasării a două liste de lungimi n și m este:
   a) O(n·m)  b) **O(n+m)**  c) O(n²)

3. La fiecare pas, interclasarea alege:
   a) Ultimul element  b) **Cea mai mică valoare disponibilă**  c) Un element aleator

4. Dacă una din liste se termină, ce se adaugă?
   a) Nimic  b) **Restul celeilalte liste**  c) Zero


:::verifica-cod
Scrie o funcție `interclaseaza(a, b)` care interclasează două liste deja sortate într-o singură listă sortată. Demo: `interclaseaza([1, 4], [2, 3])` -> `[1, 2, 3, 4]`
template: def interclaseaza(a, b):
    # completeaza
    pass

print(interclaseaza([1, 4], [2, 3]))
output: [1, 2, 3, 4]
:::

# Modulul 2.4 — Clasa set: operatori și metode

### 🔄 2.4.1 Recapitulare

În modulul 2.3 ai învățat ce e o mulțime conceptual. Acum vezi implementarea ei în Python: clasa `set`.

### 💡 2.4.2 Concept nou și exemplu

```python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a | b)    # reuniune: {1, 2, 3, 4, 5, 6}
print(a & b)    # intersecție: {3, 4}
print(a - b)    # diferență: {1, 2}
print(a <= b)   # incluziune (a submulțime a lui b?): False
a.add(10)
a.discard(1)    # elimină dacă există; nu crapă dacă nu
a.remove(2)     # elimină; crapă dacă nu există
```

Metode uzuale: `add(x)`, `remove(x)`/`discard(x)`, `union()`, `intersection()`, `difference()` (variante-metodă ale operatorilor).


:::tip
## Sfaturi & Bune Practici Didactice
:::atentie
Căutarea binară funcționează EXCLUSIV pe tablouri deja sortate. Asigură-te că lista este ordonată înainte de apelul funcției!
:::
:::

### 🔮 2.4.3 Citește și prezice

```python
a = {1, 2, 3}
b = {2, 3, 4}
print(a - b)
```
Ce se afișează?

### 🤝 2.4.4 Exerciții ghidate

**Exercițiul 1.** Completează pentru a adăuga 7 în mulțimea `m`:
```python
m = {1, 2, 3}
___  # adaugă 7
print(m)
```

**Exercițiul 2.** Scrie codul care verifică dacă `a` e submulțime a lui `b` folosind metoda (nu operatorul).

### 🎯 2.4.5 Exerciții independente

**Exercițiul 1.** Determină, folosind operații pe mulțimi, elevii înscriși la exact un curs (nu la ambele).

**Exercițiul 2.** Scrie o funcție care returnează elementele comune a două liste, fără duplicate.

### ✅ 2.4.6 Verifică-ți înțelegerea

1. `a | b` reprezintă:
   a) Intersecția  b) **Reuniunea**  c) Diferența

2. `discard(x)` vs `remove(x)`:
   a) Sunt identice  b) **discard nu crapă dacă x lipsește**  c) remove nu crapă

3. Pentru a crea o mulțime vidă folosești:
   a) `{}`  b) **`set()`**  c) `[]`

4. `a <= b` verifică:
   a) **Dacă a e submulțime a lui b**  b) Dacă a e mai mare  c) Dacă sunt egale


:::verifica-cod
Scrie o funcție `este_submultime(a, b)` care returnează True dacă mulțimea `a` e submulțime a mulțimii `b`. Demo: `este_submultime({1, 2}, {1, 2, 3})` -> `True`
template: def este_submultime(a, b):
    # completeaza
    pass

print(este_submultime({1, 2}, {1, 2, 3}))
output: True
:::

# Modulul 2.5 — Modelul conceptual: șir de caractere

### 🔄 2.5.1 Recapitulare

Ai folosit șiruri de caractere (`"text"`) încă din clasa a IX-a. Acum le privim ca model conceptual: un șir e o listă particulară de caractere, dar cu o diferență majoră.

### 💡 2.5.2 Concept nou și exemplu

Un **șir de caractere** (string) e o secvență ordonată de caractere. Toate reperele listelor se aplică (acces prin poziție, slicing), dar în Python un șir e **imutabil** — nu poate fi modificat pe loc. Orice "modificare" produce un șir nou.

```python
text = "hello"
# text[0] = "H"  # EROARE! str e imutabil
nou = "H" + text[1:]   # corect: șir nou
print(nou)              # Hello
print(text[1:4])        # ell (slicing)
```


:::tip
## Sfaturi & Bune Practici Didactice
:::tip
MergeSort garantează o complexitate de O(n log n) în toate cazurile, dar folosește memorie suplimentară pentru interclasare!
:::
:::

### 🔮 2.5.3 Citește și prezice

```python
s = "informatica"
print(s[0:4])
```
Ce se afișează?

### 🤝 2.5.4 Exerciții ghidate

**Exercițiul 1.** Completează pentru a extrage ultimul caracter:
```python
s = "python"
ultim = ___  # folosește index negativ
print(ultim)
```

**Exercițiul 2.** Scrie codul care transformă primul caracter al unui șir în majusculă (fără a modifica originalul).

### 🎯 2.5.5 Exerciții independente

**Exercițiul 1.** Explică, cu un exemplu, de ce `cuvant[0] = "X"` produce eroare, dar `lista[0] = "X"` nu.

**Exercițiul 2.** Scrie o funcție care verifică dacă un șir e palindrom (se citește la fel de la cap la coadă).

### ✅ 2.5.6 Verifică-ți înțelegerea

1. Un șir de caractere în Python este:
   a) Mutable  b) **Imutabil**  c) O listă de numere

2. Pentru a "modifica" un șir, trebuie să:
   a) Folosești `s[i] = x`  b) **Creezi un șir nou**  c) Apelezi `s.modify()`

3. `s[1:4]` extrage:
   a) Caracterele 1, 2, 3  b) **Pozițiile 1, 2, 3 (exclusiv 4)**  c) Primul caracter

4. `s[-1]` accesează:
   a) Primul caracter  b) **Ultimul caracter**  c) Caracterul -1


:::verifica-cod
Scrie o funcție `inverseaza(s)` care returnează șirul `s` inversat, fără a modifica șirul original. Demo: `inverseaza("python")` -> `"nohtyp"`
template: def inverseaza(s):
    # completeaza
    pass

print(inverseaza("python"))
output: nohtyp
:::
