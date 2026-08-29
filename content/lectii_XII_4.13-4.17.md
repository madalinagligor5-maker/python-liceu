# Modulul 4.13 — Modele de date pentru învățarea automată

### 🔄 4.13.1 Recapitulare

Ai lucrat cu baze de date structurate (SQL). Învățarea automată (ML) pornește tot de la date, dar le folosește altfel.

### 💡 4.13.2 Concept nou și exemplu

În ML, datele sunt de obicei un **tabel** cu:
- **caracteristici (features)**: coloanele de intrare (ex. `varsta`, `venit`).
- **țintă (target)**: ce vrem să prezicem (ex. `aprobare_credit`).

Două tipuri de învățare:
- **Supervizată**: avem exemple cu răspuns (etichetă) — învățăm să prezicem.
- **Nesupervizată**: găsim structură fără etichete (ex. grupuri).


```python
def separa_features_target(exemple, coloana_tinta):
    """Primește o listă de dicționare (exemple de antrenare) și numele
    coloanei-țintă. Returnează (lista_features, lista_target)."""
    features = []
    target = []
    for exemplu in exemple:
        target.append(exemplu[coloana_tinta])
        features.append({cheie: val for cheie, val in exemplu.items() if cheie != coloana_tinta})
    return features, target

date = [
    {"varsta": 25, "venit": 3200, "aprobare_credit": "Da"},
    {"varsta": 41, "venit": 1800, "aprobare_credit": "Nu"},
]

X, y = separa_features_target(date, "aprobare_credit")
print("Features:", X)
print("Target:", y)
```


:::tip
În Python, datele pentru ML sunt de obicei un `DataFrame` (Pandas) sau matrice NumPy — nu SQL direct.
:::

### 🔮 4.13.3 Citește și prezice

```python
# Un set de date are coloanele: varsta, venit, aprobare (Da/Nu)
# Care e caracteristica si care e tinta?
```

### 🤝 4.13.4 Exerciții ghidate

Creează un dicționar Python cu 5 exemple de învățare supervizată (features + target).


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: un exemplu din setul de date
exemplu = {"varsta": 30, "venit": 4200, "aprobare_credit": "Da"}
coloana_tinta = "aprobare_credit"

# Pasul 2: separam eticheta (target) de restul caracteristicilor
target = exemplu[___]
features = {cheie: val for cheie, val in exemplu.items() if cheie != ___}
print("Target:", ___)
```


### 🎯 4.13.5 Exerciții independente

Separă features de target într-o listă de tupluri `(features, eticheta)`.


**Exercițiul 1.** Scrie o funcție `este_supervizata(exemple)` care primește o listă de dicționare reprezentând exemple de antrenare și returnează `True` dacă fiecare dicționar conține o cheie `"eticheta"` (deci avem învățare supervizată) și `False` altfel.

**Exercițiul 2.** Extinde funcția anterioară astfel încât, atunci când datele sunt supervizate, să construiască și să afișeze separat lista de features și lista de etichete extrase dintr-un set de minimum 5 exemple.


### ✅ 4.13.6 Verifică-ți înțelegerea

1. Un magazin online vrea să grupeze automat clienții după comportamentul de cumpărare, fără să aibă etichete predefinite pentru fiecare client. Ce tip de învățare este potrivit, și de ce?
   a) Supervizată, pentru că avem coloana "target" cu grupul fiecărui client  b) **Nesupervizată, pentru că nu avem etichete și căutăm structură (grupuri) în date**  c) Supervizată, pentru că orice problemă cu multe caracteristici necesită etichete  d) Nesupervizată, pentru că datele nu conțin coloana "venit"
      > Fără o coloană de tip "target" care să arate grupul fiecărui client, algoritmul nu are ce eticheta să învețe — poate doar căuta tipare și structuri ascunse în date, ceea ce definește exact învățarea nesupervizată.

---


:::verifica-cod
Scrie o funcție `separa_features_target(exemplu, coloana_tinta)` care primește un exemplu (dicționar) și numele coloanei-țintă, și returnează perechea `(features, target)` — `features` fiind un dicționar fără coloana-țintă, `target` fiind valoarea ei. Demo: `separa_features_target({"varsta": 30, "venit": 4200, "aprobare_credit": "Da"}, "aprobare_credit")` -> `({'varsta': 30, 'venit': 4200}, 'Da')`
template: def separa_features_target(exemplu, coloana_tinta):
    # completeaza
    pass

print(separa_features_target({"varsta": 30, "venit": 4200, "aprobare_credit": "Da"}, "aprobare_credit"))
output: ({'varsta': 30, 'venit': 4200}, 'Da')
:::

# Modulul 4.14 — Pregătirea datelor (normalizare, valori lipsă)

### 🔄 4.14.1 Recapitulare

În 4.13 ai definit features și target. Dar datele reale sunt negate — trebuie curățate.

### 💡 4.14.2 Concept nou și exemplu

**Valori lipsă**: le înlocuim cu media, mediana, sau le ștergem rândul.
**Normalizarea**: aducem features la aceeași scală (ex. 0–1) ca să nu domine cele cu valori mari.
```python
# Normalizare min-max:
val_norm = (val - min) / (max - min)
```

:::atentie
Dacă antrenezi pe date normalize, trebuie să aplici aceeași transformare și la predicție. Altfel rezultatele sunt greșite.
:::


:::tip
## Greșeală frecventă: normalizare pe tot setul deodată
Nu calcula minimul și maximul pe toate datele (antrenare + test) laolaltă — asta se numește "data leakage". Calculează `min` și `max` doar pe datele de antrenare, apoi folosește aceleași valori pentru a normaliza și datele de test sau exemplele noi.
:::

### 🔮 4.14.3 Citește și prezice

```python
# Valorile: [10, 20, 30]. Normalizare min-max pentru 20?
```

### 🤝 4.14.4 Exerciții ghidate

Scrie o funcție care înlocuiește valorile lipsă (`None`) dintr-o listă cu media.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: date cu valori lipsa
note = [8, 9, None, 7, None, 10]

# Pasul 2: calculam media valorilor cunoscute
cunoscute = [n for n in note if n is not None]
media = sum(___) / len(___)

# Pasul 3: inlocuim valorile lipsa cu media
note_complete = [n if n is not None else ___ for n in note]
print("Note complete:", note_complete)
```


### 🎯 4.14.5 Exerciții independente

Scrie normalizarea min-max pentru o listă de numere.


**Exercițiul 1.** Scrie o funcție `normalizeaza(lista)` care primește o listă de numere și returnează o listă nouă în care fiecare valoare este transformată prin formula min-max `(val - min) / (max - min)`.

**Exercițiul 2.** Extinde funcția `normalizeaza` astfel încât, dacă lista de intrare conține valori `None`, acestea să fie mai întâi înlocuite cu media valorilor cunoscute, iar apoi să aplici normalizarea min-max pe lista completată.


### ✅ 4.14.6 Verifică-ți înțelegerea

1. Un set de date are `venit` (mii de lei) și `numar_copii` (0-5). Ce se întâmplă dacă antrenezi un model fără să normalizezi aceste caracteristici?
   a) **Modelul va fi dominat de `venit`, pentru că diferențele mari de scală cântăresc mai mult în calculele de distanță/optimizare**  b) Nimic, pentru că algoritmii de ML ignoră automat scala fiecărei caracteristici  c) Modelul va ignora complet `venit`, pentru că valorile prea mari sunt eliminate automat  d) Antrenarea va eșua cu eroare, pentru că `venit` și `numar_copii` trebuie să aibă aceeași unitate de măsură
      > La distanțe sau optimizare, o coloană cu valori de ordinul miilor (venitul) produce diferențe numerice mult mai mari decât una cu valori 0-5 (numărul de copii), așa că modelul acordă implicit mai multă greutate venitului doar din cauza scalei, nu pentru că ar fi realmente mai relevant.

---


:::verifica-cod
Scrie o funcție `normalizeaza_minmax(lista)` care aplică formula min-max (`(val - min) / (max - min)`) fiecărei valori din listă și returnează lista normalizată. Demo: `normalizeaza_minmax([10, 20, 30])` -> `[0.0, 0.5, 1.0]`
template: def normalizeaza_minmax(lista):
    # completeaza
    pass

print(normalizeaza_minmax([10, 20, 30]))
output: [0.0, 0.5, 1.0]
:::

# Modulul 4.15 — Învățare nesupervizată: K-means

### 🔄 4.15.1 Recapitulare

În 4.14 ai curățat datele. Acum găsim grupuri (clustere) fără etichete.

### 💡 4.15.2 Concept nou și exemplu

**K-means** împarte datele în `k` grupuri:
1. Alege `k` centroizi inițiali.
2. Atribuie fiecare punct celui mai apropiat centru.
3. Recalculaează centroizii (media punctelor din grup).
4. Repetă până se stabilizează.

```python
from sklearn.cluster import KMeans
km = KMeans(n_clusters=2, n_init=10)
km.fit(X)  # X = matrice de features
print(km.labels_)  # grupul fiecarui punct
```

:::tip
`k` trebuie ales (nu e dat de algoritm). Se încearcă mai multe valori și se alege cel mai bun (ex. cu "cot" elbow).
:::

### 🔮 4.15.3 Citește și prezice

```python
# 4 puncte pe o axa: 1, 2, 9, 10. k=2.
# Care ar fi cele 2 clustere probabil?
```

### 🤝 4.15.4 Exerciții ghidate

Folosește `KMeans` pe un set mic de 2D points și afișează `labels_`.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: date de antrenare (2 grupuri clar separate)
X = [[1, 1], [1, 2], [9, 9], [10, 10]]

# Pasul 2: cream si antrenam modelul KMeans cu 2 clustere
km = KMeans(n_clusters=___, n_init=10)
km.fit(___)

# Pasul 3: afisam eticheta atribuita fiecarui punct
print("Clustere:", km.___)
```


### 🎯 4.15.5 Exerciții independente

Calculează manual (fără sklearn) un pas de K-means pe 4 puncte cu 2 centroizi.


**Exercițiul 1.** Scrie un program Python care aplică `KMeans` cu `k=3` pe o listă de 6 puncte 2D distribuite în trei grupuri vizibil separate și afișează `labels_`.

**Exercițiul 2.** Extinde programul anterior calculând, pentru fiecare cluster, coordonatele centroidului (media punctelor din acel grup) și afișează-le formatat, semnalând printr-un mesaj dacă vreun cluster a rămas fără puncte.


### ✅ 4.15.6 Verifică-ți înțelegerea

1. Rulezi K-means pe un set de date fără să știi câte grupuri există cu adevărat. Cum procedezi corect pentru a alege `k`?
   a) Alegi `k=2` implicit, pentru că e valoarea recomandată în majoritatea cazurilor  b) **Încerci mai multe valori pentru `k`, compari rezultatele (ex. metoda "cotului") și alegi valoarea care separă cel mai bine datele**  c) Lași algoritmul să determine automat numărul optim de clustere din date  d) Alegi `k` egal cu numărul de caracteristici (coloane) din setul de date
      > Numărul de clustere k nu e dat de algoritm, ci trebuie ales de tine dinainte, prin încercări repetate și comparație (de exemplu metoda cotului) — K-means doar împarte punctele odată ce i-ai spus câte grupuri să caute.

---


:::verifica-cod
Scrie o funcție `atribuie_cluster(punct, centroizi)` care primește un punct (număr) și o listă de centroizi, și returnează indexul celui mai apropiat centroid (primul pas al unei iterații K-means: atribuirea la cel mai apropiat centru). Demo: `atribuie_cluster(3, [1, 9])` -> `0`
template: def atribuie_cluster(punct, centroizi):
    # completeaza
    pass

print(atribuie_cluster(3, [1, 9]))
output: 0
:::

# Modulul 4.16 — Învățare supervizată: regresie liniară

### 🔄 4.16.1 Recapitulare

În 4.15 ai grupat date fără etichete. Acum prezicem o valoare continuă (ex. preț).

### 💡 4.16.2 Concept nou și exemplu

**Regresia liniară** găsește o dreaptă `y = a·x + b` care se potrivește cel mai bine pe date.
```python
from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X, y)        # X = features (matrice), y = target
print(model.predict([[10]]))  # prezice y pentru x=10
```

:::tip
Regresia prezice valori *continue* (preț, temperatură). Pentru clase (Da/Nu) folosești clasificare (4.17).
:::

### 🔮 4.16.3 Citește și prezice

```python
# model a fost antrenat pe y = 2*x + 1
# model.predict([[5]]) => ?
```

### 🤝 4.16.4 Exerciții ghidate

Antrenează o regresie liniară pe datele `(x, y) = (1,3),(2,5),(3,7)` și prezice pentru `x=4`.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: date de antrenare
X = [[1], [2], [3]]
y = [3, 5, 7]

# Pasul 2: cream si antrenam modelul
model = LinearRegression()
model.fit(___, ___)

# Pasul 3: prezicem pentru x=4
predictie = model.predict([[___]])
print("Predictie:", predictie)
```


### 🎯 4.16.5 Exerciții independente

Calculează manual panta `a` pentru două puncte și folosește-o la predicție.


**Exercițiul 1.** Scrie un program Python care antrenează un `LinearRegression` pe punctele `(1,3), (2,5), (3,7), (4,9)` și afișează coeficientul `a` (`model.coef_`) și termenul liber `b` (`model.intercept_`).

**Exercițiul 2.** Extinde programul anterior citind o valoare `x` de la utilizator cu `input()`, validează că textul introdus poate fi convertit la număr, apoi afișează predicția modelului formatată cu două zecimale.


### ✅ 4.16.6 Verifică-ți înțelegerea

1. Vrei să prezici prețul de vânzare al unei case pe baza suprafeței și a numărului de camere. Ce tip de model alegi și de ce?
   a) Clasificare, pentru că prețul poate fi împărțit în categorii de tip "ieftin"/"scump"  b) **Regresie, pentru că prețul este o valoare numerică continuă, nu o categorie**  c) Regresie, pentru că regresia se folosește mereu când avem mai mult de o caracteristică (feature)  d) Clasificare, pentru că modelul trebuie să decidă "Da" sau "Nu" pentru vânzare
      > Prețul unei case poate lua orice valoare numerică pe o scală continuă, nu se încadrează în câteva categorii fixe, deci se potrivește cu regresia, care prezice exact astfel de valori numerice, spre deosebire de clasificare, care alege dintre categorii predefinite.

---


:::verifica-cod
Scrie o funcție `prezice_liniar(x, a, b)` care calculează predicția unei regresii liniare `y = a*x + b` (echivalentul lui `model.predict` dintr-un model deja antrenat). Demo: `prezice_liniar(5, 2, 1)` -> `11`
template: def prezice_liniar(x, a, b):
    # completeaza
    pass

print(prezice_liniar(5, 2, 1))
output: 11
:::

# Modulul 4.17 — Învățare supervizată: KNN și arbore de decizie

### 🔄 4.17.1 Recapitulare

În 4.16 ai folosit regresia pentru valori continue. KNN și arborele de decizie fac **clasificare** (categorii).

### 💡 4.17.2 Concept nou și exemplu

**KNN (K-nearest neighbors)**: clasifică un punct după cei mai apropiați `k` vecini (vot majoritar).
**Arbore de decizie**: pune întrebări succesive pe features (ex. "venit > 5000?") până la o decizie.

```python
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X, y)
arbore = DecisionTreeClassifier()
arbore.fit(X, y)
```

:::tip
KNN e "leneș" (memorează tot și calculează la predicție); arborele de decizie e o regulă explicită, ușor de explicat.
:::

### 🔮 4.17.3 Citește și prezice

```python
# 3 vecini cei mai apropiați au etichetele: Da, Da, Nu
# Ce prezice KNN (k=3)?
```

### 🤝 4.17.4 Exerciții ghidate

Antrenează un KNN pe un set mic și prezice eticheta unui punct nou.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: date de antrenare (features si etichete)
X = [[1, 1], [1, 2], [8, 8], [9, 9]]
y = ["A", "A", "B", "B"]

# Pasul 2: cream si antrenam clasificatorul KNN cu 3 vecini
knn = KNeighborsClassifier(n_neighbors=___)
knn.___(X, y)

# Pasul 3: prezicem eticheta unui punct nou
print("Predictie:", knn.predict([[___, ___]]))
```


### 🎯 4.17.5 Exerciții independente

Antrenează un arbore de decizie și afișează structura (sau importanța features).


**Exercițiul 1.** Scrie un program Python care antrenează un `DecisionTreeClassifier` pe un set de 6 exemple cu două features (de exemplu `venit` și `varsta`) și eticheta `aprobare` (Da/Nu), apoi afișează `feature_importances_`.

**Exercițiul 2.** Extinde programul anterior antrenând și un `KNeighborsClassifier(n_neighbors=3)` pe aceleași date, prezice eticheta pentru un punct nou cu ambele modele și afișează, formatat, dacă cele două modele sunt de acord.


### ✅ 4.17.6 Verifică-ți înțelegerea

1. Trebuie să explici unui manager, care nu știe programare, de ce un client a fost respins pentru credit. Ce model folosești ca să poți explica ușor decizia, și de ce?
   a) KNN, pentru că poți arăta exact care sunt cei mai apropiați `k` vecini folosiți la vot  b) **Arbore de decizie, pentru că poți urmări întrebările succesive (ex. "venit > 5000?") care au dus la decizia finală**  c) KNN, pentru că se antrenează mai repede și deci e mai ușor de înțeles  d) Arbore de decizie, pentru că găsește automat cei mai apropiați vecini ai fiecărui exemplu
      > Arborele de decizie ia decizia printr-un lanț de întrebări explicite pe caracteristici (de exemplu "venit > 5000?"), pe care le poți urmări pas cu pas și explica în cuvinte, spre deosebire de KNN, unde decizia vine dintr-un vot al vecinilor apropiați, fără o regulă explicabilă de citit.


:::verifica-cod
Scrie o funcție `vot_majoritar(etichete)` care primește etichetele celor mai apropiați `k` vecini și returnează eticheta majoritară (votul KNN). Demo: `vot_majoritar(["Da", "Da", "Nu"])` -> `Da`
template: def vot_majoritar(etichete):
    # completeaza
    pass

print(vot_majoritar(["Da", "Da", "Nu"]))
output: Da
:::
