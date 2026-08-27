# Modulul 4.18 — Introducere în rețele neuronale

### 🔄 4.18.1 Recapitulare

Ai văzut KNN și arborele de decizie (4.17) — două moduri de a clasifica un exemplu nou pe baza unor reguli sau a unor vecini apropiați. Rețelele neuronale rezolvă aceeași problemă (clasificare, dar și predicție de valori continue) printr-un mecanism diferit, inspirat vag de neuronii biologici — dar mecanismul lor real e pură aritmetică, nu magie, și e exact ce înveți în acest modul.

### 💡 4.18.2 Concept nou și exemplu

Un **neuron artificial** primește mai multe numere de intrare, fiecare cu propria lui **greutate** (weight) — un număr care spune „cât de important e" acel input pentru decizia neuronului. Neuronul face trei lucruri, în ordine:

1. Înmulțește fiecare intrare cu greutatea ei.
2. Adună toate produsele — asta se numește **produs scalar** (dot product) între vectorul de intrări și vectorul de greutăți. Nu e altceva decât „înmulțește pe rând, apoi adună tot" — o singură idee, nu o formulă nouă de memorat.
3. Adaugă o **valoare de prag** (bias) — un număr fix care „împinge" rezultatul în sus sau în jos, independent de intrări.

Rezultatul acestor trei pași se numește **suma ponderată** (weighted sum). Exemplu calculat de mână: intrări `x1=2, x2=3`, greutăți `w1=0.5, w2=-1`, bias `b=1`.

```
suma = (2 × 0.5) + (3 × -1) + 1
     = 1 + (-3) + 1
     = -1
```

Observă: intrarea `x2` avea greutate negativă, deci a *scăzut* din rezultat, nu a adunat — o greutate negativă înseamnă „acest input împinge decizia în direcția opusă".

```python
def suma_ponderata(intrari, greutati, bias):
    total = 0
    for x, w in zip(intrari, greutati):
        total += x * w
    return total + bias

x = [2, 3]
w = [0.5, -1]
b = 1
print(suma_ponderata(x, w, b))
```

Suma ponderată singură nu e încă răspunsul final — trece printr-o **funcție de activare**, care decide ce iese din neuron. Cea mai simplă e funcția treaptă: ieșire `1` dacă suma > 0, altfel `0`. O funcție mai des folosită e **sigmoid**, care „strânge" orice număr real într-o valoare între 0 și 1 (interpretabilă ca o probabilitate):

```
sigmoid(z) = 1 / (1 + e^(-z))
```

Pentru `z = 0`, sigmoid dă exact `0.5` (echilibru perfect). Pentru `z` mare și pozitiv, sigmoid se apropie de `1`; pentru `z` mare și negativ, se apropie de `0`.

```python
import math

def sigmoid(z):
    return 1 / (1 + math.exp(-z))

print(sigmoid(0))   # 0.5
print(sigmoid(2))   # ~0.88 — z pozitiv, ieșire aproape de 1
print(sigmoid(-2))  # ~0.12 — z negativ, ieșire aproape de 0
```

O rețea neuronală reală înlănțuie mulți astfel de neuroni pe mai multe straturi, iar **învățarea** înseamnă ajustarea treptată a greutăților și a bias-urilor, ca ieșirea rețelei să se apropie de răspunsul corect pe datele de antrenare — exact tehnica pe care ai văzut-o cu gradient descent, dacă ai urmărit modulele de regresie (4.16). Un singur neuron, ca cel de mai sus, e blocul de construcție din spatele oricărei rețele — de asta contează să înțelegi exact ce calculează.

:::atentie
## O sumă ponderată NU e o sumă simplă
`suma_ponderata([2, 3], [0.5, -1], 1)` nu e `2 + 3 + 1 = 6`. Fiecare intrare contribuie proporțional cu greutatea ei — o greutate mică sau negativă poate face ca un input mare să conteze puțin sau deloc. Dacă uiți înmulțirea și doar aduni intrările, rezultatul e complet greșit.
:::

:::tip
## De ce are neuronul nevoie de bias?
Fără bias, un neuron cu toate intrările 0 dă mereu suma ponderată 0, indiferent de greutăți (orice număr × 0 = 0). Bias-ul e singurul termen care poate „porni" neuronul chiar și când toate intrările sunt zero — de asta e un parametru separat, învățat la fel ca greutățile.
:::

### 🔮 4.18.3 Citește și prezice

```python
import math

def suma_ponderata(intrari, greutati, bias):
    total = 0
    for x, w in zip(intrari, greutati):
        total += x * w
    return total + bias

x = [1, 4]
w = [2, 0.5]
b = -3

z = suma_ponderata(x, w, b)
print(z)
print("activat" if z > 0 else "neactivat")
```

Calculează manual suma ponderată înainte să rulezi codul: `(1 × 2) + (4 × 0.5) + (-3)`. E pozitivă sau negativă? Neuronul se „activează" (cu funcția treaptă) sau nu?

### 🤝 4.18.4 Exerciții ghidate

Completează funcția care calculează ieșirea unui neuron cu 2 intrări, folosind aceeași idee ca în exemplul de mai sus (produs scalar + bias):

```python
# Pasul 1: definim intrarile, greutatile si bias-ul
x1, x2 = 3, 5
w1, w2 = -0.5, 1.2
bias = 0.4

# Pasul 2: calculam suma ponderata (produsul scalar + bias)
suma = ___

print("Suma ponderata:", suma)
```

### 🎯 4.18.5 Exerciții independente

**Exercițiul 1.** Scrie o funcție `sigmoid(z)` care aplică formula `1 / (1 + e^(-z))` (folosește `math.exp`) și testeaz-o pentru `z = 0`, `z = 3` și `z = -3`, afișând fiecare rezultat rotunjit la 3 zecimale.

**Exercițiul 2.** Scrie o funcție `neuron(intrari, greutati, bias)` care calculează suma ponderată (ca `suma_ponderata` din exemplu) și apoi aplică `sigmoid` peste rezultat, întorcând valoarea finală. Testeaz-o cu intrările `[1, 2, 3]`, greutățile `[0.2, -0.1, 0.4]` și bias `0.1`, apoi afișează dacă neuronul „se activează" (ieșire peste 0.5) sau nu.

### ✅ 4.18.6 Verifică-ți înțelegerea

1. Un neuron are o singură intrare `x`, greutate `w = 0`, bias `b = 5`. Ce se întâmplă cu suma ponderată, indiferent ce valoare are `x`?
   a) Suma ponderată e mereu 0, pentru că orice e înmulțit cu greutatea 0  b) **Suma ponderată e mereu 5 — bias-ul rămâne, dar contribuția lui `x` dispare complet, pentru că orice număr înmulțit cu 0 e 0**  c) Suma ponderată variază odată cu `x`, la fel ca la orice altă greutate  d) Neuronul aruncă o eroare, pentru că nu poți avea o greutate 0

---


:::verifica-cod
Scrie o funcție `neuron_prag(intrari, greutati, bias)` care calculează suma ponderată (produs scalar + bias) și returnează `1` dacă suma e strict pozitivă, altfel `0` (funcția de activare treaptă). Demo: `neuron_prag([2, -1], [3, 4], -1)` -> `1`
template: def neuron_prag(intrari, greutati, bias):
    # completeaza
    pass

print(neuron_prag([2, -1], [3, 4], -1))
output: 1
:::

# Modulul 4.19 — Biblioteca Matplotlib: vizualizarea datelor

### 🔄 4.19.1 Recapitulare

În 4.18 ai calculat ieșirea unui neuron ca un singur număr. Dar când ai zeci sau sute de rezultate — scoruri de antrenare, distribuții de date — un șir de numere e greu de interpretat dintr-o privire. Ai nevoie să *vezi* datele, nu doar să le calculezi.

### 💡 4.19.2 Concept nou și exemplu

`matplotlib.pyplot` e biblioteca standard Python pentru grafice — desenează linii, puncte (scatter) sau bare direct dintr-o listă de numere:

```python
import matplotlib.pyplot as plt

luni = ["Ian", "Feb", "Mar", "Apr", "Mai"]
vanzari = [120, 135, 128, 160, 175]

plt.plot(luni, vanzari)       # grafic de linie
plt.bar(luni, vanzari)        # grafic de bare
plt.title("Vânzări lunare")
plt.xlabel("Luna")
plt.ylabel("Vânzări")
plt.show()
```

Fiecare tip de grafic „spune" altceva: un **grafic de linie** arată o evoluție în timp (crește? scade? oscilează?); un **grafic de bare** compară valori între categorii separate; un **scatter** arată dacă există o relație între două caracteristici (ex. înălțime vs. greutate).

Editorul din această platformă rulează Python direct în browser, dar nu are o fereastră grafică unde `plt.show()` să deseneze o imagine — exact ca într-un server fără ecran. Ca să tot poți „vedea" un grafic fără o fereastră grafică, poți desena unul simplificat direct în text, cu caractere — o tehnică veche, dar care te obligă să înțelegi exact ce reprezintă fiecare bară, pentru că o construiești tu, caracter cu caracter:

```python
vanzari = [120, 135, 128, 160, 175]
maxim = max(vanzari)

for v in vanzari:
    lungime = round(v / maxim * 20)  # scalăm la maximum 20 caractere
    print("█" * lungime, v)
```

Acest cod produce un grafic de bare orizontal, în text — fiecare linie e proporțională cu valoarea ei, exact ca într-un `plt.bar()` real, doar desenat cu caractere în loc de pixeli.

:::exemplu
## De la matplotlib real la varianta din editor
Codul cu `matplotlib.pyplot` de mai sus e exact ce ai scrie într-un mediu Python normal (Jupyter, VS Code) ca să obții un grafic vizual adevărat. Varianta cu `"█" * lungime` nu înlocuiește matplotlib — e un mod de a exersa *aceeași idee* (proporția dintre valori, comparație vizuală) direct în acest editor, care afișează doar text.
:::

### 🔮 4.19.3 Citește și prezice

```python
valori = [4, 9, 2, 7]
maxim = max(valori)

for v in valori:
    lungime = round(v / maxim * 10)
    print("█" * lungime, v)
```

Care linie va fi cea mai lungă? Care va fi cea mai scurtă? Cu cât e mai scurtă linia lui `2` față de linia lui `9`, proporțional?

### 🤝 4.19.4 Exerciții ghidate

Completează codul care desenează un grafic de bare în text pentru orele de somn din 4 nopți:

```python
# Pasul 1: datele
ore_somn = [6, 8, 7, 5]
maxim = max(ore_somn)

# Pasul 2: pentru fiecare valoare, calculam lungimea barei (scalata la 15 caractere)
for ore in ore_somn:
    lungime = round(ore / ___ * 15)
    print("█" * ___, ore)
```

### 🎯 4.19.5 Exerciții independente

**Exercițiul 1.** Scrie o funcție `grafic_bare(valori, scala=20)` care primește o listă de numere și afișează un grafic de bare în text (fiecare linie: bara proporțională + valoarea numerică), folosind aceeași idee ca în exemplu (scalare la valoarea maximă din listă).

**Exercițiul 2.** Extinde funcția `grafic_bare` astfel încât să primească și o listă de etichete (`etichete`, de aceeași lungime ca `valori`) și să afișeze fiecare etichetă înaintea barei ei (ex. `"Lun  ████████ 8"`). Testeaz-o cu etichetele zilelor săptămânii și un set de valori la alegere.

### ✅ 4.19.6 Verifică-ți înțelegerea

1. Vrei să afli dacă există o relație între orele de studiu și nota obținută la un test, pe baza a 30 de elevi. Ce tip de grafic alegi, și de ce?
   a) Grafic de linie, pentru că timpul trece de la un elev la altul  b) Grafic de bare, pentru că fiecare elev e o categorie separată  c) **Scatter (puncte), pentru că vrei să vezi dacă cele două caracteristici numerice (ore, notă) variază împreună**  d) Niciunul — relațiile între caracteristici nu se pot vizualiza, doar se calculează

---


:::verifica-cod
Scrie o funcție `bara_text(valoare, maxim, scala)` care returnează un șir de caractere `"█"` proporțional cu `valoare` raportat la `maxim` (rotunjit la `scala` caractere maxim). Demo: `bara_text(5, 10, 10)` -> `'█████'`
template: def bara_text(valoare, maxim, scala):
    # completeaza
    pass

print(bara_text(5, 10, 10))
output: █████
:::

# Modulul 4.20 — Biblioteca Pandas: DataFrame și statistici descriptive

### 🔄 4.20.1 Recapitulare

În 4.19 ai vizualizat numere individuale. De obicei, datele reale vin în tabele — mai multe caracteristici, pentru mai multe exemple deodată. Ai mai lucrat cu tabele de date sub formă de listă de dicționare (4.13) — Pandas e biblioteca standard care organizează exact acest tip de date.

### 💡 4.20.2 Concept nou și exemplu

`DataFrame` e structura centrală din Pandas — un tabel cu rânduri și coloane, ca o foaie de calcul, construit de obicei dintr-un dicționar unde fiecare cheie e o coloană:

```python
import pandas as pd

df = pd.DataFrame({
    "nume": ["Ana", "Bogdan", "Carla"],
    "varsta": [17, 19, 18],
})
print(df["varsta"].mean())    # media coloanei varsta
print(df.describe())          # rezumat: count, mean, std, min, max
```

Aceeași structură — un dicționar unde fiecare cheie e o „coloană" și valoarea e lista completă a acelei coloane — poate fi reprezentată direct în Python, fără nicio bibliotecă, cu ce știi deja din 4.13:

```python
tabel = {
    "nume": ["Ana", "Bogdan", "Carla"],
    "varsta": [17, 19, 18],
}

varste = tabel["varsta"]
medie = sum(varste) / len(varste)
print("Media varstelor:", medie)
```

Statisticile descriptive de bază sunt patru numere care rezumă o coloană întreagă:
- **medie** (`mean`): suma valorilor împărțită la câte sunt.
- **minim/maxim** (`min`/`max`): cea mai mică, respectiv cea mai mare valoare.
- **abaterea standard** (`std`): cât de „împrăștiate" sunt valorile față de medie — o abatere mică înseamnă valori apropiate una de alta, o abatere mare înseamnă valori foarte diferite. Formula: calculezi cât de departe e fiecare valoare de medie, ridici la pătrat (ca să elimini semnul), faci media acelor pătrate, apoi extragi rădăcina pătrată.

```python
import math

varste = [17, 19, 18]
medie = sum(varste) / len(varste)
diferente_patrat = [(v - medie) ** 2 for v in varste]
abatere = math.sqrt(sum(diferente_patrat) / len(diferente_patrat))
print("Abaterea standard:", round(abatere, 2))
```

:::tip
## De ce Pandas, dacă poți face asta cu liste și dicționare?
Pentru un tabel cu 3 rânduri, ca mai sus, diferența nu se simte. Dar Pandas citește direct fișiere CSV cu mii de rânduri, filtrează, grupează și calculează aceste statistici pe coloane întregi într-o singură linie, optimizat intern — codul din listă/dicționar de mai sus e util ca să înțelegi *ce calculează* Pandas pe dinăuntru, nu ca înlocuitor pentru el la scară mare.
:::

### 🔮 4.20.3 Citește și prezice

```python
note = [8, 9, 10, 7]
medie = sum(note) / len(note)
print(medie)

diferente_patrat = [(n - medie) ** 2 for n in note]
print(diferente_patrat)
```

Care e media celor 4 note? Care notă e cea mai departe de medie — și deci va avea cel mai mare termen în lista `diferente_patrat`?

### 🤝 4.20.4 Exerciții ghidate

Completează codul care calculează media și maximul unei coloane dintr-un tabel reprezentat ca dicționar:

```python
# Pasul 1: tabelul de date
tabel = {"nota": [8, 10, 6, 9]}

# Pasul 2: extragem coloana si calculam media
coloana = tabel["nota"]
medie = sum(coloana) / ___

# Pasul 3: calculam maximul
maxim = ___(coloana)

print("Media:", medie, "| Maxim:", maxim)
```

### 🎯 4.20.5 Exerciții independente

**Exercițiul 1.** Scrie o funcție `descrie(coloana)` care primește o listă de numere și returnează un dicționar cu cheile `"count"`, `"mean"`, `"min"`, `"max"` (ca un mini `describe()`), calculate fără nicio bibliotecă.

**Exercițiul 2.** Extinde funcția `descrie` să includă și `"std"` (abaterea standard, cu formula din exemplu). Testeaz-o pe un tabel reprezentat ca dicționar cu cel puțin 2 coloane numerice, afișând rezultatul pentru fiecare coloană separat.

### ✅ 4.20.6 Verifică-ți înțelegerea

1. O coloană cu notele `[10, 10, 10, 10]` și o coloană cu notele `[2, 10, 5, 15]` au aceeași medie (aproximativ). Ce le diferențiază, din punct de vedere statistic?
   a) Nimic — dacă media e la fel, coloanele sunt echivalente pentru orice analiză  b) **Abaterea standard: prima coloană are abatere 0 (toate valorile identice), a doua are abatere mare (valori foarte împrăștiate)**  c) Numărul de valori (`count`), care diferă mereu când mediile sunt apropiate  d) Maximul, care e mereu egal cu media înmulțită cu numărul de valori

---


:::verifica-cod
Scrie o funcție `medie_coloana(tabel, nume_coloana)` care primește un tabel (dicționar de liste) și numele unei coloane, și returnează media acelei coloane. Demo: `medie_coloana({"nota": [8, 10, 6]}, "nota")` -> `8.0`
template: def medie_coloana(tabel, nume_coloana):
    # completeaza
    pass

print(medie_coloana({"nota": [8, 10, 6]}, "nota"))
output: 8.0
:::

# Modulul 4.21 — Biblioteca Scikit-learn: antrenare, predicție, evaluare

### 🔄 4.21.1 Recapitulare

Ai folosit deja modele de clasificare (KNN, arbore de decizie — 4.17) și regresie (4.16), fiecare cu propriul cod de antrenare. Scikit-learn unifică toate aceste modele sub un flux de lucru identic — dacă înțelegi fluxul, știi să folosești orice model din bibliotecă, nu doar unul.

### 💡 4.21.2 Concept nou și exemplu

Fluxul standard scikit-learn are mereu aceiași 4 pași, indiferent de model:

```python
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = KNeighborsClassifier(n_neighbors=3)
model.fit(X_train, y_train)             # antrenare
predictii = model.predict(X_test)       # predicție
print(accuracy_score(y_test, predictii))  # evaluare
```

Cel mai important pas conceptual e primul: **de ce împărțim datele în train/test?** Dacă evaluezi modelul pe aceleași date pe care l-ai antrenat, un model care doar „memorează" fiecare exemplu (fără să învețe un tipar general) ar obține scor perfect — dar ar eșua complet pe un exemplu nou, nemaivăzut. Testarea pe date separate, nefolosite la antrenare, e singurul mod corect de a ști dacă modelul chiar a *învățat* ceva, sau doar a memorat.

Poți construi manual acest flux, cu tot ce știi deja: `random` pentru amestecarea și separarea datelor, și un clasificator simplu scris de mână — de exemplu, cel mai apropiat vecin (1-NN): pentru un exemplu nou, găsești exemplul din setul de antrenare cel mai apropiat (distanța cea mai mică) și îi copiezi eticheta.

```python
import random

def imparte_train_test(X, y, procent_test=0.2):
    indici = list(range(len(X)))
    random.shuffle(indici)
    nr_test = round(len(X) * procent_test)
    test_idx = indici[:nr_test]
    train_idx = indici[nr_test:]
    X_train = [X[i] for i in train_idx]
    y_train = [y[i] for i in train_idx]
    X_test = [X[i] for i in test_idx]
    y_test = [y[i] for i in test_idx]
    return X_train, X_test, y_train, y_test

def distanta(a, b):
    return sum((ai - bi) ** 2 for ai, bi in zip(a, b)) ** 0.5

def prezice_1nn(exemplu, X_train, y_train):
    cel_mai_apropiat = min(range(len(X_train)), key=lambda i: distanta(exemplu, X_train[i]))
    return y_train[cel_mai_apropiat]

def acuratete(X_test, y_test, X_train, y_train):
    corecte = 0
    for x, y_real in zip(X_test, y_test):
        if prezice_1nn(x, X_train, y_train) == y_real:
            corecte += 1
    return corecte / len(y_test)
```

:::atentie
## Data leakage: capcana clasică
Dacă normalizezi sau alegi caracteristici (features) folosind INFORMAȚII din setul de test, „scurgi" informație din test înapoi în antrenare — modelul pare mai bun decât e de fapt. Regula simplă: orice decizie luată pe baza datelor (normalizare, alegere de parametri) se ia STRICT pe setul de antrenare, niciodată uitându-te la setul de test.
:::

### 🔮 4.21.3 Citește și prezice

```python
def distanta(a, b):
    return sum((ai - bi) ** 2 for ai, bi in zip(a, b)) ** 0.5

exemplu_nou = [5, 5]
X_train = [[1, 1], [2, 2], [8, 8], [9, 9]]
y_train = ["A", "A", "B", "B"]

distante = [distanta(exemplu_nou, x) for x in X_train]
print(distante)
```

Care punct din `X_train` e cel mai aproape de `[5, 5]`? Ce etichetă ar primi `exemplu_nou` de la un clasificator 1-NN?

### 🤝 4.21.4 Exerciții ghidate

Completează funcția care calculează acuratețea unui set de predicții față de etichetele reale:

```python
# Pasul 1: predictiile modelului si etichetele reale
predictii = ["Da", "Nu", "Da", "Da"]
reale =     ["Da", "Nu", "Nu", "Da"]

# Pasul 2: numaram cate predictii sunt corecte
corecte = 0
for p, r in zip(predictii, reale):
    if p == ___:
        corecte += 1

# Pasul 3: acuratetea e procentul de predictii corecte
acuratete = corecte / ___
print("Acuratete:", acuratete)
```

### 🎯 4.21.5 Exerciții independente

**Exercițiul 1.** Scrie o funcție `distanta(a, b)` care calculează distanța euclidiană între două puncte reprezentate ca liste de numere (formula: rădăcina pătrată a sumei pătratelor diferențelor pe fiecare dimensiune), apoi o funcție `cel_mai_apropiat(exemplu, X)` care returnează indexul celui mai apropiat punct din lista `X`.

**Exercițiul 2.** Folosind funcțiile de la exercițiul anterior, scrie un clasificator 1-NN complet: o funcție `prezice(exemplu, X_train, y_train)` care întoarce eticheta celui mai apropiat vecin, apoi testeaz-o pe un set de minimum 6 puncte de antrenare (2 grupuri clar separate) și 2 exemple noi.

### ✅ 4.21.6 Verifică-ți înțelegerea

1. Antrenezi un model pe 100 de exemple și îl testezi tot pe acele 100 de exemple, obținând acuratețe 100%. Ce concluzie e corectă?
   a) Modelul e excelent și va avea performanță la fel de bună pe exemple noi  b) **Nu poți ști dacă modelul a învățat un tipar general sau doar a memorat exemplele — acuratețea trebuie măsurată pe date nefolosite la antrenare**  c) Acuratețea de 100% e imposibilă și indică o eroare în cod  d) Modelul e prea simplu, pentru că a obținut scor maxim

---


:::verifica-cod
Scrie o funcție `acuratete(predictii, reale)` care primește două liste de aceeași lungime (predicții și etichete reale) și returnează proporția de predicții corecte (un număr între 0 și 1). Demo: `acuratete(["A","B","A"], ["A","A","A"])` -> `0.6666666666666666`
template: def acuratete(predictii, reale):
    # completeaza
    pass

print(acuratete(["A","B","A"], ["A","A","A"]))
output: 0.6666666666666666
:::

# Modulul 4.22 — Biblioteca NumPy: operații cu matrici

### 🔄 4.22.1 Recapitulare

Ai organizat date în tabele (Pandas, 4.20) și ai antrenat modele (4.21). Sub capota oricărui model ML stau calcule cu **matrici** — tabele de numere pe care le aduni, le înmulțești, le transformi. NumPy e biblioteca standard pentru asta, dar ideea de matrice o poți construi și înțelege direct cu liste de liste.

### 💡 4.22.2 Concept nou și exemplu

O **matrice** e pur și simplu un tabel de numere, cu linii și coloane. În NumPy, se reprezintă ca `ndarray` și operațiile se aplică pe toată matricea deodată (vectorizat, fără loop explicit):

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print(a + b)            # [5 7 9] — element cu element
m = np.array([[1, 2], [3, 4]])
print(m.sum(axis=0))    # suma pe coloane
print(m.sum(axis=1))    # suma pe linii
```

Fără NumPy, aceeași matrice e o listă de liste, iar orice operație se face explicit, cu bucle — mai lung de scris, dar exact aceleași reguli matematice, vizibile pas cu pas:

```python
m = [[1, 2], [3, 4]]

# suma pe fiecare linie
sume_linii = [sum(linie) for linie in m]
print("Suma pe linii:", sume_linii)

# suma pe fiecare coloana: parcurgem coloana i din fiecare linie
nr_coloane = len(m[0])
sume_coloane = [sum(linie[i] for linie in m) for i in range(nr_coloane)]
print("Suma pe coloane:", sume_coloane)
```

Cea mai importantă operație pentru ML e **înmulțirea de matrici** (`np.dot` sau `@`) — NU înmulțire element cu element. Pentru două matrici, elementul de pe linia `i`, coloana `j` din rezultat e produsul scalar dintre linia `i` a primei matrici și coloana `j` a celei de-a doua (exact ideea de „produs scalar" din 4.18, aplicată acum unei linii întregi față de o coloană întreagă, nu doar doi vectori izolați):

```python
import numpy as np
a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])
print(np.dot(a, b))
# [[1*5+2*7, 1*6+2*8], [3*5+4*7, 3*6+4*8]] = [[19, 22], [43, 50]]
```

```python
def inmultire_matrici(a, b):
    rezultat = []
    for linie in a:
        linie_noua = []
        for j in range(len(b[0])):
            coloana = [rand[j] for rand in b]
            produs_scalar = sum(x * y for x, y in zip(linie, coloana))
            linie_noua.append(produs_scalar)
        rezultat.append(linie_noua)
    return rezultat

a = [[1, 2], [3, 4]]
b = [[5, 6], [7, 8]]
print(inmultire_matrici(a, b))
```

:::tip
## De ce NumPy e ~100x mai rapid
Codul `inmultire_matrici` de mai sus rulează bucle Python obișnuite — pentru matrici mari (mii de linii), asta devine lent. NumPy face aceleași înmulțiri și adunări, dar în cod C compilat, executat vectorizat (pe blocuri întregi de memorie deodată), nu element cu element interpretat de Python. Rezultatul matematic e identic — diferența e doar viteza.
:::

### 🔮 4.22.3 Citește și prezice

```python
m = [[2, 4], [6, 8]]
sume_linii = [sum(linie) for linie in m]
print(sume_linii)

nr_coloane = len(m[0])
sume_coloane = [sum(linie[i] for linie in m) for i in range(nr_coloane)]
print(sume_coloane)
```

Calculează manual: care e suma primei linii? Dar a primei coloane? Verifică-ți răspunsul rulând codul.

### 🤝 4.22.4 Exerciții ghidate

Completează codul care calculează suma pe linii a unei matrici 2×3:

```python
# Pasul 1: matricea (2 linii, 3 coloane)
m = [[1, 2, 3], [4, 5, 6]]

# Pasul 2: pentru fiecare linie, calculam suma elementelor ei
sume_linii = [sum(linie) for linie in ___]

print("Suma pe linii:", sume_linii)
```

### 🎯 4.22.5 Exerciții independente

**Exercițiul 1.** Scrie o funcție `aduna_matrici(a, b)` care primește două matrici (liste de liste) de aceleași dimensiuni și returnează o matrice nouă, cu suma element cu element. Testeaz-o pe două matrici 2×2 la alegere.

**Exercițiul 2.** Scrie o funcție `inmulteste_matrici(a, b)` care implementează înmulțirea de matrici (ca în exemplu), folosind produsul scalar între fiecare linie a lui `a` și fiecare coloană a lui `b`. Testeaz-o pe o matrice 2×2 înmulțită cu alta 2×2 și verifică manual (pe hârtie) că rezultatul e corect pentru cel puțin un element.

### ✅ 4.22.6 Verifică-ți înțelegerea

1. Ai două matrici pătratice m1 și m2. Ce diferență e între înmulțirea element cu element și înmulțirea de matrici (`np.dot`)?
   a) Sunt exact aceeași operație, doar scrise diferit  b) **Element cu element înmulțește valorile aflate pe aceeași poziție; `np.dot` calculează, pentru fiecare poziție din rezultat, produsul scalar dintre o linie din prima matrice și o coloană din a doua**  c) Înmulțirea element cu element funcționează doar pentru matrici pătratice, `np.dot` funcționează pentru orice formă  d) `np.dot` e doar o altă denumire pentru adunarea de matrici

---


:::verifica-cod
Scrie o funcție `suma_pe_coloane(m)` care primește o matrice (listă de liste, toate liniile de aceeași lungime) și returnează o listă cu suma fiecărei coloane. Demo: `suma_pe_coloane([[1,2],[3,4]])` -> `[4, 6]`
template: def suma_pe_coloane(m):
    # completeaza
    pass

print(suma_pe_coloane([[1,2],[3,4]]))
output: [4, 6]
:::
