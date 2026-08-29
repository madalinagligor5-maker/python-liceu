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
:::tip
Folosește blocul with open(...) as f: pentru a lucra cu fișiere — garantează închiderea automată a fișierului chiar dacă apar erori!
:::
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
      > Structura de bază a unui dicționar leagă fiecare cheie de o valoare (nu de o poziție numerică precum la liste), iar accesul se face mereu prin cheie, ca în note["Ana"].

2. Accesul la o cheie inexistentă (`d["x"]`) produce:
   a) None  b) **KeyError**  c) 0
      > Când ceri o cheie care nu există în dicționar, Python nu întoarce o valoare implicită ci oprește execuția cu excepția KeyError, tocmai pentru a semnala clar că acea etichetă lipsește.

3. `"ana" in dictionar` verifică:
   a) **Dacă "ana" e o cheie**  b) Dacă "ana" e o valoare  c) Lungimea
      > Operatorul in aplicat unui dicționar caută valoarea în mulțimea cheilor, nu în valorile asociate, deci "ana" in dictionar întreabă dacă "ana" e o cheie existentă.

4. Când alegi un dicționar în loc de listă?
   a) Mereu  b) **Când datele au o structură etichetă→info**  c) Niciodată
      > Dicționarul este potrivit exact atunci când datele au natura etichetă→informație (ca nume→notă), pentru că oferă acces direct prin acea etichetă, spre deosebire de o listă unde ai avea nevoie de poziție.


:::verifica-cod
Scrie o funcție `contine_cheia(d, cheie)` care returnează True dacă `cheie` există în dicționarul `d`. Demo: `contine_cheia({"Ana": 9}, "Ana")` -> `True`
template: def contine_cheia(d, cheie):
    # completeaza
    pass

print(contine_cheia({"Ana": 9}, "Ana"))
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
:::atentie
Metoda f.readline() include caracterul de linie nouă '\n' la finalul fiecărei linii. Folosește .strip() pentru a-l elimina!
:::
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
      > Metoda get() este construită să evite eroarea KeyError: dacă cheia lipsește, întoarce automat valoarea implicită dată ca al doilea argument, aici 0, în loc să oprească programul.

2. `for k, v in d.items()` iterează peste:
   a) Doar chei  b) **Perechi (cheie, valoare)**  c) Doar valori
      > items() întoarce fiecare intrare din dicționar ca o pereche (cheie, valoare), motiv pentru care bucla for k, v in d.items() poate despacheta simultan ambele variabile la fiecare pas.

3. `in` pe un dicționar verifică:
   a) Valorile  b) **Cheile**  c) Lungimea
      > La fel ca la accesarea directă cu paranteze pătrate, operatorul in verifică apartenența printre chei, nu printre valorile asociate lor.

4. `.values()` returnează:
   a) Cheile  b) **Valorile**  c) Perechile
      > values() este metoda dedicată extragerii doar a informațiilor asociate cheilor, fără chei; pentru chei există keys(), iar pentru perechi există items().


:::verifica-cod
Scrie o funcție `suma_valori(d)` care returnează suma tuturor valorilor dintr-un dicționar, folosind `.values()`. Demo: `suma_valori({"a": 2, "b": 3})` -> `5`
template: def suma_valori(d):
    # completeaza
    pass

print(suma_valori({"a": 2, "b": 3}))
output: 5
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
:::tip
Cheile dintr-un dicționar Python trebuie să fie de tip imutabil (str, int, tuple) și sunt unice. Accesarea unei chei inexistente aruncă KeyError — folosește .get(cheie)!
:::
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
      > Un tuplu este definit explicit ca o secvență imutabilă — odată creat, elementele lui nu se mai pot schimba, așa cum arată și eroarea produsă de punct[0] = 1.

2. `x, y = punct` se numește:
   a) Indexare  b) **Despachetare**  c) Concatenare
      > Scrierea x, y = punct extrage simultan elementele tuplului în variabile separate, operație numită despachetare, spre deosebire de indexare care extrage un singur element.

3. Un tuplu poate fi cheie de dicționar?
   a) **Da**  b) Nu  c) Doar dacă e gol
      > Cheile unui dicționar trebuie să fie de tip imutabil, iar tuplul îndeplinește această condiție (spre deosebire de listă, care e mutabilă și deci nu poate fi cheie), motiv pentru care poate fi folosit direct ca cheie.

4. `punct[0] = 1` produce:
   a) Modificare  b) **Eroare (imutabil)**  c) Nothing
      > Pentru că tuplul este imutabil, orice încercare de a atribui o valoare unei poziții din el, ca punct[0] = 1, este respinsă de Python cu o eroare, nu executată.


:::verifica-cod
Scrie o funcție `suma_coordonate(punct)` care despachetează un tuplu `(x, y)` și returnează suma `x + y`. Demo: `suma_coordonate((3, 5))` -> `8`
template: def suma_coordonate(punct):
    # completeaza
    pass

print(suma_coordonate((3, 5)))
output: 8
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
:::tip
Seturile (set) stochează doar elemente unice și neordonate, oferind operații rapide O(1) de verificare a apartenenței cu operatorul in!
:::
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
      > Fără virgulă, (5) este doar numărul 5 între paranteze, nu un tuplu; virgula din (5,) este cea care îi spune lui Python că e vorba de o secvență cu un singur element.

2. `t.count(x)` returnează:
   a) Poziția lui x  b) **Numărul de apariții ale lui x**  c) Lungimea
      > Metoda count() parcurge tuplul și numără de câte ori apare exact valoarea căutată, exact cum punct.count(3) arată câte poziții conțin valoarea 3.

3. `(1, 2) + (3,)` produce:
   a) `(1, 23)`  b) **`(1, 2, 3)`**  c) Eroare
      > Operatorul + lipește cele două tupluri unul după altul, formând un tuplu nou care conține toate elementele din primul urmate de toate din al doilea: (1, 2) + (3,) devine (1, 2, 3).

4. `t.index(x)` returnează:
   a) **Prima poziție a lui x**  b) Numărul de apariții  c) True/False
      > index() este metoda care caută prima apariție a unei valori și întoarce poziția ei în tuplu, spre deosebire de count() care numără câte apariții există.


:::verifica-cod
Scrie o funcție `numara_aparitii(t, x)` care returnează de câte ori apare `x` în tuplul `t`, folosind `.count()`. Demo: `numara_aparitii((1, 2, 2, 3), 2)` -> `2`
template: def numara_aparitii(t, x):
    # completeaza
    pass

print(numara_aparitii((1, 2, 2, 3), 2))
output: 2
:::
