# Modulul 2.11 — Modelul conceptual: dicționar

### 🔄 2.11.1 Recapitulare

Ai folosit liste (poziție→valoare) și mulțimi (apartenență). Ce faci când vrei "etichetă→informație" (nume→notă)?

### 💡 2.11.2 Concept nou și exemplu

Un **dicționar** asociază fiecărei **chei** o **valoare**. Accesul se face prin cheie, nu prin poziție. Modelul e potrivit când datele au structură de tip "etichetă → info".

```python
note = {"Ana": 9, "Bogdan": 7}
note["Cristina"] = 10
print(note["Ana"])          # 9
print("Ion" in note)        # False
```


:::tip
## Sfaturi & Bune Practici Didactice
Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.
:::

### 🔮 2.11.3 Citește și prezice

```python
d = {"a": 1, "b": 2}
d["c"] = 3
print(len(d))
```
Ce se afișează?

### 🤝 2.11.4 Exerciții ghidate

**Exercițiul 1.** Completează pentru a adăuga o pereche cheie-valoare:
```python
d = {"x": 10}
___ = 20  # adaugă "y" -> 20
print(d)
```

**Exercițiul 2.** Scrie codul care afișează toate cheile unui dicționar.

### 🎯 2.11.5 Exerciții independente

**Exercițiul 1.** Construiește un dicționar care asociază fiecărei litere frecvența ei într-un text.

**Exercițiul 2.** Scrie o funcție care inversează un dicționar (valorile devin chei).

### ✅ 2.11.6 Verifică-ți înțelegerea

1. Un dicționar asociază:
   a) Poziție → valoare  b) **Cheie → valoare**  c) Valoare → cheie

2. Accesul la o cheie inexistentă (`d["x"]`) produce:
   a) None  b) **KeyError**  c) 0

3. `"ana" in dictionar` verifică:
   a) **Dacă "ana" e o cheie**  b) Dacă "ana" e o valoare  c) Lungimea

4. Când alegi un dicționar în loc de listă?
   a) Mereu  b) **Când datele au o structură etichetă→info**  c) Niciodată


:::verifica-cod
Scrie o funcție `este_par(x)` care returnează True dacă x e par. Demo: `este_par(4)` -> `True`
template: def este_par(x):
    # completeaza
    pass

print(este_par(4))
output: True
:::

# Modulul 2.12 — Clasa dict: acces și metode uzuale

### 🔄 2.12.1 Recapitulare

În modulul 2.11 ai văzut modelul conceptual. Acum clasa `dict` din Python.

### 💡 2.12.2 Concept nou și exemplu

```python
note = {"Ana": 9, "Bogdan": 7}
print(note.get("Ion", 0))     # 0 (valoare implicită, fără eroare)
for nume, nota in note.items():
    print(nume, nota)
print(note.keys())            # dict_keys(['Ana', 'Bogdan'])
print(note.values())          # dict_values([9, 7])
```

Metode: `.get()`, `.keys()`, `.values()`, `.items()`, `in` (verifică cheia).


:::tip
## Sfaturi & Bune Practici Didactice
Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.
:::

### 🔮 2.12.3 Citește și prezice

```python
d = {"a": 1, "b": 2}
print(d.get("c", -1))
```
Ce se afișează?

### 🤝 2.12.4 Exerciții ghidate

**Exercițiul 1.** Completează pentru a accesa sigur o cheie cu valoare implicită:
```python
d = {"x": 5}
val = ___  # folosește .get() cu implicit 0
```

**Exercițiul 2.** Scrie codul care afișează toate perechile (cheie, valoare) dintr-un dicționar.

### 🎯 2.12.5 Exerciții independente

**Exercițiul 1.** Construiește `cuvânt→număr de apariții` pentru un text folosind `.get(cuvant, 0) + 1`.

**Exercițiul 2.** Scrie o funcție care îmbină două dicționare (valorile se adună dacă cheia e comună).

### ✅ 2.12.6 Verifică-ți înțelegerea

1. `dictionar.get("Ion", 0)` când "Ion" lipsește returnează:
   a) KeyError  b) **0**  c) None

2. `for k, v in d.items()` iterează peste:
   a) Doar chei  b) **Perechi (cheie, valoare)**  c) Doar valori

3. `in` pe un dicționar verifică:
   a) Valorile  b) **Cheile**  c) Lungimea

4. `.values()` returnează:
   a) Cheile  b) **Valorile**  c) Perechile


:::verifica-cod
Scrie o funcție `este_par(x)` care returnează True dacă x e par. Demo: `este_par(4)` -> `True`
template: def este_par(x):
    # completeaza
    pass

print(este_par(4))
output: True
:::

# Modulul 2.13 — Modelul conceptual: tuplu

### 🔄 2.13.1 Recapitulare

Ai folosit liste (mutabile). Dar ce faci cu date care nu trebuie modificate (coordonatele unui punct)?

### 💡 2.13.2 Concept nou și exemplu

Un **tuplu** e o listă **imutabilă** — o secvență ordonată ce nu se poate modifica după creare. Util pentru valori eterogene strâns legate.

```python
punct = (3, 5)
x, y = punct          # despachetare
print(punct[0])       # 3
# punct[0] = 1        # EROARE! tuplu e imutabil
```

Tuplurile pot fi chei de dicționar (listele nu pot).


:::tip
## Sfaturi & Bune Practici Didactice
Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.
:::

### 🔮 2.13.3 Citește și prezice

```python
p = (1, 2, 3)
a, b, c = p
print(b)
```
Ce se afișează?

### 🤝 2.13.4 Exerciții ghidate

**Exercițiul 1.** Completează pentru a extrage x și y dintr-un tuplu:
```python
punct = (10, 20)
___ = punct  # despachetare
print(x, y)
```

**Exercițiul 2.** Scrie codul care creează un tuplu cu 3 valori și îl afișează.

### 🎯 2.13.5 Exerciții independente

**Exercițiul 1.** Reprezintă o listă de puncte 2D ca listă de tupluri și calculează distanța între primele două.

**Exercițiul 2.** Folosește un tuplu ca cheie de dicționar (ex. coordonate→culoare).

### ✅ 2.13.6 Verifică-ți înțelegerea

1. Un tuplu este:
   a) Mutable  b) **Imutabil**  c) O mulțime

2. `x, y = punct` se numește:
   a) Indexare  b) **Despachetare**  c) Concatenare

3. Un tuplu poate fi cheie de dicționar?
   a) **Da**  b) Nu  c) Doar dacă e gol

4. `punct[0] = 1` produce:
   a) Modificare  b) **Eroare (imutabil)**  c) Nothing


:::verifica-cod
Scrie o funcție `este_par(x)` care returnează True dacă x e par. Demo: `este_par(4)` -> `True`
template: def este_par(x):
    # completeaza
    pass

print(este_par(4))
output: True
:::

# Modulul 2.14 — Clasa tuple: operatori și metode

### 🔄 2.14.1 Recapitulare

În modulul 2.13 ai văzut modelul conceptual. Acum clasa `tuple`.

### 💡 2.14.2 Concept nou și exemplu

```python
punct = (3, 5)
print(punct.count(3))   # 1 (numără aparițiile)
print(punct.index(5))   # 1 (poziția)
print(punct + (7,))     # (3, 5, 7) (concatenare)
print((1,) * 3)         # (1, 1, 1) (repetare)
```

Operatori: acces prin index, `in`, `+` (concatenare), `*` (repetare). Metode: `count()`, `index()`.

**Atenție:** un tuplu cu un singur element se scrie `(1,)` — virgula e obligatorie!


:::tip
## Sfaturi & Bune Practici Didactice
Verifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.
:::

### 🔮 2.14.3 Citește și prezice

```python
t = (1, 2, 3, 2)
print(t.count(2))
```
Ce se afișează?

### 🤝 2.14.4 Exerciții ghidate

**Exercițiul 1.** Completează pentru a crea un tuplu cu un singur element:
```python
singur = ___  # tuplu cu valoarea 5
```

**Exercițiul 2.** Scrie codul care concatenează două tupluri.

### 🎯 2.14.5 Exerciții independente

**Exercițiul 1.** Reprezintă o listă de note ca listă de tupluri `(nume, nota)` și sorteaz-o descrescător după notă.

**Exercițiul 2.** Scrie o funcție care returnează tuplul cu valoarea minimă și maximă dintr-o listă.

### ✅ 2.14.6 Verifică-ți înțelegerea

1. Un tuplu cu un element se scrie:
   a) `(5)`  b) **`(5,)`**  c) `[5]`

2. `t.count(x)` returnează:
   a) Poziția lui x  b) **Numărul de apariții ale lui x**  c) Lungimea

3. `(1, 2) + (3,)` produce:
   a) `(1, 23)`  b) **`(1, 2, 3)`**  c) Eroare

4. `t.index(x)` returnează:
   a) **Prima poziție a lui x**  b) Numărul de apariții  c) True/False


:::verifica-cod
Scrie o funcție `este_par(x)` care returnează True dacă x e par. Demo: `este_par(4)` -> `True`
template: def este_par(x):
    # completeaza
    pass

print(este_par(4))
output: True
:::
