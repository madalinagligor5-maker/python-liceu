# Curs practic de Python — Unitatea 3: Colecții de date

Modulele CP3.1–CP3.4. Același șablon de 6 pași ca unitățile anterioare.

---

# Modulul CP3.1 — Liste

### 🔄 CP3.1.1 Recapitulare

Cu buclele `for` și `while` repeți aceeași operație de mai multe ori. Până acum valorile erau însă împrăștiate în variabile separate: `pret1`, `pret2`, `pret3`. Când ai 50 de prețuri, ai nevoie de un singur loc în care să le ții pe toate, în ordine. Acesta este **lista**.

### 💡 CP3.1.2 Concept nou și exemplu

O listă se scrie între paranteze drepte, cu elementele separate prin virgulă. Pozițiile (indicii) încep de la **0**.

```python
cos = ["pâine", "lapte", "mere"]
print(cos[0])
print(cos[-1])
print(len(cos))
```

Rezultatul:

```text
pâine
mere
3
```

`cos[-1]` înseamnă ultimul element, iar `len()` dă numărul de elemente.

Listele se pot modifica:

```python
cos = ["pâine", "lapte"]
cos.append("ouă")        # adaugă la final
cos.insert(0, "cafea")   # inserează pe poziția 0
cos.remove("lapte")      # șterge după valoare
print(cos)
```

Programul afișează `['cafea', 'pâine', 'ouă']`.

Funcțiile `sum()`, `min()`, `max()` și `sorted()` lucrează direct pe liste de numere:

```python
cheltuieli = [120, 45, 300, 80]
print(sum(cheltuieli))
print(max(cheltuieli))
print(sorted(cheltuieli))
```

Rezultatul: `545`, apoi `300`, apoi `[45, 80, 120, 300]`.

:::atentie
## Indicii încep de la 0
Primul element e `lista[0]`, nu `lista[1]`. O listă cu 3 elemente are indicii 0, 1 și 2; `lista[3]` produce `IndexError: list index out of range`.
:::

:::exemplu
## Filtrarea unei liste
Construiești o listă nouă doar cu elementele care te interesează: pornești cu `mari = []`, parcurgi lista cu `for` și faci `mari.append(x)` doar când `x > 100`. Pentru `[120, 45, 300, 80]` rezultă `[120, 300]`.
:::

### 🔮 CP3.1.3 Citește și prezice

Fără să rulezi codul, scrie ce crezi că afișează:

```python
note = [7, 9, 10, 8]
note.append(6)
print(len(note), note[1], note[-1])
```

### 🤝 CP3.1.4 Exerciții ghidate

**Exercițiul 1.** Completează linia ca programul să afișeze al doilea element din listă.

```python
orase = ["Cluj", "Iași", "Brașov"]
print(orase[___])
```

**Exercițiul 2.** Pentru lista de cheltuieli `[120, 45, 300, 80]`, afișează suma lor.

### 🎯 CP3.1.5 Exerciții independente

**Exercițiul 1.** Pentru lista de note `[9, 7, 10, 8, 6]`, afișează media, rotunjită la două zecimale.

**Exercițiul 2 (mini-proiect de închidere).** Din lista de vânzări zilnice `[230, 180, 410, 95, 320, 150, 275]`, afișează câte zile au avut vânzări de peste 200 de lei.

### ✅ CP3.1.6 Verifică-ți înțelegerea

1. Ce afișează `print(["a", "b", "c"][0])`?
   a) `b`  b) `c`  c) **`a`**
      > Indicii unei liste încep de la 0, deci primul element are indicele 0.

2. Ce face metoda `append()`?
   a) Șterge ultimul element  b) **Adaugă un element la finalul listei**  c) Sortează lista
      > `append(x)` adaugă valoarea `x` la sfârșitul listei, mărind lungimea ei cu 1.

3. Ce întoarce `len([4, 8, 15, 16])`?
   a) 3  b) 16  c) **4**
      > `len()` numără elementele listei, nu le adună și nu întoarce cel mai mare element.

4. Ce dă `lista[-1]`?
   a) **Ultimul element**  b) O eroare  c) Primul element
      > Indicii negativi numără de la final: `-1` e ultimul element, `-2` penultimul.

:::verifica-cod
Calculează și afișează cea mai mare valoare din lista de prețuri. Rezultatul așteptat este 89.
template: preturi = [45, 89, 12, 60]
print(___(preturi))
output: 89
:::

---

# Modulul CP3.2 — Șiruri de caractere (stringuri)

### 🔄 CP3.2.1 Recapitulare

Ai învățat că o listă păstrează valori în ordine, accesibile prin indici. Un text în Python — un **șir de caractere** sau **string** — funcționează asemănător: e o secvență de caractere, fiecare pe poziția lui. Diferența: un string nu poate fi modificat pe loc; fiecare operație produce un string nou.

### 💡 CP3.2.2 Concept nou și exemplu

Indexarea și decuparea (slicing) funcționează ca la liste:

```python
cod = "RO-2026-CLJ"
print(cod[0:2])
print(cod[3:7])
print(cod[-3:])
print(len(cod))
```

Rezultatul:

```text
RO
2026
CLJ
11
```

Metodele de text cele mai utile în practică:

```python
nume = "  maria POPESCU  "
curat = nume.strip()
print(curat.title())
print(curat.upper())
print("pop" in curat.lower())
```

Rezultatul: `Maria Popescu`, `MARIA POPESCU`, `True`.

`split()` împarte un text în bucăți, iar `join()` le lipește înapoi:

```python
linie = "pâine;lapte;mere"
produse = linie.split(";")
print(produse)
print(", ".join(produse))
```

Rezultatul: `['pâine', 'lapte', 'mere']`, apoi `pâine, lapte, mere`.

Pentru a combina text cu valori, cel mai comod e un **f-string**:

```python
produs = "laptop"
pret = 3499.5
print(f"Produs: {produs}, preț: {pret} lei")
```

:::atentie
## Stringurile nu se modifică pe loc
`nume.upper()` nu schimbă variabila `nume`, ci întoarce un string nou. Ca să păstrezi rezultatul, îl atribui: `nume = nume.upper()`.
:::

:::exemplu
## Curățarea datelor introduse de oameni
Adresele de email vin adesea cu spații și litere mari amestecate: `"  Ana.Pop@Exemplu.RO "`. `email.strip().lower()` dă `ana.pop@exemplu.ro`, o formă pe care o poți compara sigur cu alte adrese.
:::

### 🔮 CP3.2.3 Citește și prezice

Fără să rulezi codul, scrie ce crezi că afișează:

```python
text = "Python"
print(text[0], text[-1], text[1:4])
```

### 🤝 CP3.2.4 Exerciții ghidate

**Exercițiul 1.** Completează metoda ca textul să fie afișat cu majuscule.

```python
mesaj = "comanda a fost trimisă"
print(mesaj.___())
```

**Exercițiul 2.** Din adresa `"ana.pop@exemplu.ro"`, afișează doar partea de după `@`.

### 🎯 CP3.2.5 Exerciții independente

**Exercițiul 1.** Numără câte cuvinte are propoziția `"Python e un limbaj ușor de învățat"`.

**Exercițiul 2 (mini-proiect de închidere).** Pornind de la `"  ion IONESCU "`, afișează numele curățat, cu fiecare cuvânt cu inițială mare: `Ion Ionescu`.

### ✅ CP3.2.6 Verifică-ți înțelegerea

1. Ce afișează `print("Cluj"[1])`?
   a) `C`  b) **`l`**  c) `u`
      > Indicii încep de la 0, deci poziția 1 e al doilea caracter, `l`.

2. Ce face `"  text  ".strip()`?
   a) **Elimină spațiile de la început și de la sfârșit**  b) Șterge toate spațiile din text  c) Împarte textul în cuvinte
      > `strip()` elimină doar spațiile (și caracterele invizibile) de la capete; spațiile dintre cuvinte rămân.

3. Ce întoarce `"a,b,c".split(",")`?
   a) `"abc"`  b) `3`  c) **`['a', 'b', 'c']`**
      > `split(sep)` împarte textul la fiecare separator și întoarce o listă cu bucățile.

4. După `nume = "ana"` și `nume.upper()`, ce valoare are `nume`?
   a) `"ANA"`  b) **`"ana"`**  c) O eroare
      > Stringurile nu se modifică pe loc: `upper()` întoarce un text nou, iar `nume` rămâne neschimbat dacă nu reatribui rezultatul.

:::verifica-cod
Afișează numărul de caractere al cuvântului „programare”. Rezultatul așteptat este 10.
template: cuvant = "programare"
print(___(cuvant))
output: 10
:::

---

# Modulul CP3.3 — Dicționare

### 🔄 CP3.3.1 Recapitulare

Listele păstrează valori în ordine și le găsești după poziție. Uneori însă vrei să găsești o valoare după un **nume**: prețul unui produs după denumirea lui, numărul de telefon al unei persoane după numele ei. Pentru asta Python are **dicționarul**.

### 💡 CP3.3.2 Concept nou și exemplu

Un dicționar păstrează perechi **cheie: valoare**, între acolade.

```python
preturi = {"pâine": 5, "lapte": 8, "mere": 12}
print(preturi["lapte"])
preturi["ouă"] = 15        # adaugă o pereche nouă
preturi["pâine"] = 6       # modifică o valoare existentă
print(len(preturi))
```

Programul afișează `8`, apoi `4`.

Pentru a parcurge un dicționar folosești `.items()`, care dă pe rând cheia și valoarea:

```python
stoc = {"tricouri": 40, "pantaloni": 15, "geci": 3}
for produs, bucati in stoc.items():
    if bucati < 10:
        print("De comandat:", produs)
```

Programul afișează `De comandat: geci`.

Dacă nu ești sigur că o cheie există, folosește `.get()`, care întoarce o valoare implicită în loc de eroare:

```python
preturi = {"pâine": 5, "lapte": 8}
print(preturi.get("cafea", 0))
print("lapte" in preturi)
```

Rezultatul: `0`, apoi `True`.

:::atentie
## Cheia inexistentă
`preturi["cafea"]` pentru o cheie care nu există oprește programul cu `KeyError`. Verifică înainte cu `in` sau folosește `preturi.get("cafea", 0)`.
:::

:::exemplu
## Numărarea aparițiilor
Un dicționar e ideal pentru a număra: pornești cu `frecventa = {}` și, pentru fiecare cuvânt, scrii `frecventa[cuvant] = frecventa.get(cuvant, 0) + 1`. Pentru lista `["da", "nu", "da", "da"]` rezultă `{'da': 3, 'nu': 1}`.
:::

### 🔮 CP3.3.3 Citește și prezice

Fără să rulezi codul, scrie ce crezi că afișează:

```python
varste = {"Ana": 31, "Mihai": 27}
varste["Ioana"] = 35
varste["Ana"] = 32
print(len(varste), varste["Ana"])
```

### 🤝 CP3.3.4 Exerciții ghidate

**Exercițiul 1.** Completează cheia ca programul să afișeze prețul merelor.

```python
preturi = {"pâine": 5, "lapte": 8, "mere": 12}
print(preturi[___])
```

**Exercițiul 2.** Pentru dicționarul `{"ianuarie": 1200, "februarie": 950, "martie": 1380}`, afișează totalul cheltuielilor pe cele trei luni.

### 🎯 CP3.3.5 Exerciții independente

**Exercițiul 1.** Calculează valoarea totală a unui coș, știind prețurile `{"pâine": 5, "lapte": 8, "mere": 12}` și cantitățile `{"pâine": 2, "lapte": 1, "mere": 3}`.

**Exercițiul 2 (mini-proiect de închidere).** Numără de câte ori apare fiecare cuvânt în propoziția `"da nu da poate da nu"` și afișează de câte ori apare cuvântul `da`.

### ✅ CP3.3.6 Verifică-ți înțelegerea

1. Cum accesezi valoarea asociată cheii `"lapte"` din dicționarul `preturi`?
   a) `preturi[1]`  b) `preturi.lapte`  c) **`preturi["lapte"]`**
      > Valorile dintr-un dicționar se accesează după cheie, între paranteze drepte, nu după poziție.

2. Ce se întâmplă la `d["x"] = 5` dacă cheia `"x"` există deja?
   a) **Valoarea veche este înlocuită cu 5**  b) Apare o eroare  c) Se adaugă a doua cheie `"x"`
      > Cheile unui dicționar sunt unice: o atribuire pe o cheie existentă îi înlocuiește valoarea.

3. Ce întoarce `{"a": 1}.get("b", 0)`?
   a) O eroare `KeyError`  b) **0**  c) `None`
      > `get(cheie, implicit)` întoarce valoarea implicită când cheia nu există, fără să oprească programul.

4. Ce dă `.items()` într-o buclă `for`?
   a) **Perechi cheie–valoare**  b) Doar cheile  c) Doar valorile
      > `for cheie, valoare in d.items():` primește la fiecare pas atât cheia, cât și valoarea ei.

:::verifica-cod
Afișează prețul cafelei din dicționar. Rezultatul așteptat este 18.
template: preturi = {"ceai": 9, "cafea": 18}
print(preturi[___])
output: 18
:::

---

# Modulul CP3.4 — Tupluri și mulțimi (seturi)

### 🔄 CP3.4.1 Recapitulare

Ai lucrat cu liste (valori în ordine, modificabile) și cu dicționare (perechi cheie–valoare). Python mai are două colecții des folosite: **tuplul**, pentru grupuri fixe de valori care nu trebuie să se schimbe, și **mulțimea** (setul), pentru valori unice, fără dubluri.

### 💡 CP3.4.2 Concept nou și exemplu

Un **tuplu** se scrie între paranteze rotunde și nu poate fi modificat după ce a fost creat. E potrivit pentru date care merg mereu împreună, cum ar fi coordonatele unui punct sau o dată calendaristică.

```python
locatie = (46.77, 23.59)
lat, lon = locatie
print("Latitudine:", lat)
print("Longitudine:", lon)
```

Linia `lat, lon = locatie` se numește **despachetare**: fiecare valoare din tuplu ajunge în variabila ei.

O **mulțime** (set) se scrie între acolade și păstrează fiecare valoare o singură dată. E cel mai simplu mod de a elimina dublurile:

```python
orase_comenzi = ["Cluj", "Iași", "Cluj", "Brașov", "Iași"]
orase_unice = set(orase_comenzi)
print(len(orase_unice))
print(sorted(orase_unice))
```

Rezultatul: `3`, apoi `['Brașov', 'Cluj', 'Iași']`.

Mulțimile au și operații utile pentru comparații:

```python
clienti_ianuarie = {"Ana", "Mihai", "Ioana"}
clienti_februarie = {"Mihai", "Radu"}
print(clienti_ianuarie & clienti_februarie)
print(sorted(clienti_ianuarie | clienti_februarie))
print(sorted(clienti_ianuarie - clienti_februarie))
```

Rezultatul:

```text
{'Mihai'}
['Ana', 'Ioana', 'Mihai', 'Radu']
['Ana', 'Ioana']
```

`&` dă elementele comune, `|` reunește tot, iar `-` păstrează ce e doar în prima mulțime.

:::atentie
## Mulțimile nu au ordine
O mulțime nu păstrează ordinea elementelor și nu are indici: `orase_unice[0]` dă eroare. Când ai nevoie de o ordine, transformă mulțimea într-o listă sortată cu `sorted()`.
:::

:::exemplu
## Tuplu sau listă?
Folosește o **listă** când colecția se schimbă (un coș de cumpărături) și un **tuplu** când valorile formează un întreg fix (ziua, luna și anul unei date). Un tuplu modificat din greșeală produce o eroare, ceea ce te protejează de greșeli.
:::

### 🔮 CP3.4.3 Citește și prezice

Fără să rulezi codul, scrie ce crezi că afișează:

```python
numere = [3, 1, 3, 2, 1, 3]
print(len(numere), len(set(numere)))
```

### 🤝 CP3.4.4 Exerciții ghidate

**Exercițiul 1.** Completează linia ca să afișezi câte valori distincte are lista.

```python
coduri = ["A1", "B2", "A1", "C3", "B2"]
print(len(___(coduri)))
```

**Exercițiul 2.** Despachetează tuplul `(2026, 10, 12)` în variabilele `an`, `luna`, `zi` și afișează doar anul.

### 🎯 CP3.4.5 Exerciții independente

**Exercițiul 1.** Pentru două liste de abonați la newsletter, `["ana", "radu", "ioana"]` și `["radu", "mihai", "ana"]`, afișează câți abonați apar în ambele liste.

**Exercițiul 2 (mini-proiect de închidere).** Din lista de etichete `["python", "date", "python", "web", "date", "ai"]`, afișează etichetele unice, sortate alfabetic, separate prin virgulă și spațiu.

### ✅ CP3.4.6 Verifică-ți înțelegerea

1. Care e diferența principală dintre o listă și un tuplu?
   a) Tuplul poate avea doar numere  b) Lista nu are ordine  c) **Tuplul nu poate fi modificat după creare**
      > Un tuplu e imutabil: după creare nu poți adăuga, șterge sau înlocui elemente; lista se poate modifica.

2. Ce dă `len(set([1, 1, 2, 2, 2]))`?
   a) 5  b) **2**  c) 1
      > O mulțime păstrează fiecare valoare o singură dată, deci rămân doar 1 și 2.

3. Ce face operatorul `&` între două mulțimi?
   a) Le reunește  b) Păstrează elementele din prima, fără cele din a doua  c) **Păstrează elementele comune**
      > `&` este intersecția: rezultatul conține doar elementele care apar în ambele mulțimi.

4. Ce se întâmplă la `a, b = (5, 9)`?
   a) **`a` primește 5, iar `b` primește 9**  b) Apare o eroare  c) `a` primește tot tuplul
      > Despachetarea atribuie fiecare element din tuplu variabilei de pe aceeași poziție.

:::verifica-cod
Afișează câte produse distincte apar în lista de comenzi. Rezultatul așteptat este 3.
template: comenzi = ["mere", "pere", "mere", "prune", "pere"]
print(len(___(comenzi)))
output: 3
:::
