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

## Problemă rezolvată pas cu pas

**Enunț.** Pornim de la un set de exemple pentru o problemă de clasificare (va promova elevul?). Separăm caracteristicile de țintă și numărăm câte exemple are fiecare clasă.

**Ideea.** Fiecare exemplu e un dicționar. Ținta e o coloană anume, restul sunt caracteristici. Distribuția claselor ne arată dacă setul e echilibrat.

```python
date = [
    {'ore_studiu': 10, 'absente': 2, 'promovat': 'Da'},
    {'ore_studiu': 2, 'absente': 9, 'promovat': 'Nu'},
    {'ore_studiu': 7, 'absente': 4, 'promovat': 'Da'},
    {'ore_studiu': 8, 'absente': 1, 'promovat': 'Da'},
]
X = [[d['ore_studiu'], d['absente']] for d in date]
y = [d['promovat'] for d in date]
print(X)
print({c: y.count(c) for c in sorted(set(y))})
```
Rezultatul:
```text
[[10, 2], [2, 9], [7, 4], [8, 1]]
{'Da': 3, 'Nu': 1}
```

:::atentie
## Greșeli frecvente
- Lași coloana-țintă printre caracteristici: modelul „vede” răspunsul și pare perfect, dar nu a învățat nimic.
- Folosești ca dată de intrare o coloană care nu e disponibilă în momentul predicției (ex. „a returnat creditul”, când vrei să decizi acordarea creditului).
- Crezi că orice problemă are nevoie de etichete. Pentru grupare (clustering) nu există țintă.
- Confunzi regresia (țintă numerică continuă) cu clasificarea (țintă din câteva categorii).
:::

### 🔮 4.13.3 Citește și prezice

```python
coloane = ["varsta", "venit", "aprobare"]
tinta = "aprobare"
features = [c for c in coloane if c != tinta]
print(",".join(features) + "=features; " + tinta + "=target")
```

Ce afișează programul?


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

2. Ce e „ținta” (target) într-o problemă supervizată?
   a) Prima coloană din tabel  b) **Valoarea pe care modelul trebuie să învețe s-o prezică**  c) Numărul de exemple
      > Ținta e răspunsul cunoscut din exemplele de antrenare, de exemplu „aprobat / respins”.

3. Prezicerea temperaturii de mâine este o problemă de:
   a) Clasificare  b) **Regresie**  c) Grupare
      > Temperatura e o valoare numerică continuă, deci e regresie.

4. Gruparea clienților fără etichete este învățare:
   a) Supervizată  b) **Nesupervizată**  c) Prin regresie
      > Fără etichete, algoritmul caută singur structura din date.

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

În 4.13 ai definit features și target. Dar datele reale sunt „murdare” (valori lipsă, scări diferite) și trebuie curățate.

### 💡 4.14.2 Concept nou și exemplu

**Valori lipsă**: le înlocuim cu media, mediana, sau le ștergem rândul.
**Normalizarea**: aducem features la aceeași scală (ex. 0–1) ca să nu domine cele cu valori mari.
```python
# Normalizare min-max: val_norm = (val - minim) / (maxim - minim)
valori = [10, 20, 30, 50]
minim, maxim = min(valori), max(valori)
print([(val - minim) / (maxim - minim) for val in valori])  # [0.0, 0.25, 0.5, 1.0]
```

:::atentie
Dacă antrenezi pe date normalizate, trebuie să aplici aceeași transformare și la predicție. Altfel rezultatele sunt greșite.
:::


:::tip
## Greșeală frecventă: normalizare pe tot setul deodată
Nu calcula minimul și maximul pe toate datele (antrenare + test) laolaltă — asta se numește "data leakage". Calculează `min` și `max` doar pe datele de antrenare, apoi folosește aceleași valori pentru a normaliza și datele de test sau exemplele noi.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Pregătim două coloane pentru un model: completăm valorile lipsă din `venit` cu media și normalizăm ambele coloane în intervalul [0, 1].

**Ideea.** Întâi completăm golurile (altfel min/max ar fi afectate de None), apoi aplicăm (v - min) / (max - min) pe fiecare coloană, separat, ca să aibă aceeași scală.

```python
venit = [3000, None, 5000, 4000, None]
varsta = [20, 35, 50, 30, 45]
cunoscute = [v for v in venit if v is not None]
media = sum(cunoscute) / len(cunoscute)
venit = [v if v is not None else media for v in venit]

def normalizeaza(col):
    mn, mx = min(col), max(col)
    return [round((v - mn) / (mx - mn), 2) for v in col]

print(normalizeaza(venit))
print(normalizeaza(varsta))
```
Rezultatul:
```text
[0.0, 0.5, 1.0, 0.5, 0.5]
[0.0, 0.5, 1.0, 0.33, 0.83]
```

:::atentie
## Greșeli frecvente
- Calculezi media pe valori care conțin `None`: `sum` dă eroare. Filtrează întâi valorile lipsă.
- Normalizezi o coloană în care toate valorile sunt egale: max - min = 0 și apare împărțire la zero.
- Calculezi minimul și maximul pe toate datele (antrenare + test): informația din test „se scurge” în antrenare.
- Normalizezi la antrenare, dar uiți să aplici aceeași transformare datelor noi la predicție.
:::

### 🔮 4.14.3 Citește și prezice

```python
valori = [10, 20, 30]
val_norm = (20 - min(valori)) / (max(valori) - min(valori))
print(val_norm)
```

Ce afișează programul?


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

2. În ce interval aduce valorile normalizarea min-max?
   a) [-1, 1]  b) **[0, 1]**  c) [0, 100]
      > Minimul devine 0, maximul devine 1, iar restul se așază proporțional între ele.

3. Cu ce înlocuiești de obicei o valoare numerică lipsă, dacă nu ștergi rândul?
   a) Cu 0, întotdeauna  b) **Cu media sau mediana coloanei**  c) Cu o valoare aleatoare
      > Media sau mediana păstrează coloana apropiată de distribuția ei reală; 0 ar putea distorsiona datele.

4. De ce normalizăm caracteristicile?
   a) Ca să ocupe mai puțină memorie  b) **Ca o caracteristică cu valori mari să nu domine calculele de distanță**  c) Ca să sortăm datele
      > Fără normalizare, venitul (mii de lei) ar conta mult mai mult decât vârsta (zeci de ani) doar din cauza scalei.

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
3. Recalculează centroizii (media punctelor din grup).
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

## Problemă rezolvată pas cu pas

**Enunț.** Implementăm K-means de la zero pe 6 puncte 2D, cu k = 2, pornind de la doi centroizi aleși, și afișăm grupul fiecărui punct și centroizii finali.

**Ideea.** Repetăm doi pași: fiecare punct merge la cel mai apropiat centroid, apoi fiecare centroid se mută în media punctelor din grupul lui. După câteva iterații, grupurile nu se mai schimbă.

```python
def dist(a, b):
    return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5

def kmeans(puncte, centroizi, pasi=10):
    for _ in range(pasi):
        grupuri = [[] for _ in centroizi]
        for p in puncte:
            k = min(range(len(centroizi)), key=lambda i: dist(p, centroizi[i]))
            grupuri[k].append(p)
        centroizi = [[sum(c) / len(g) for c in zip(*g)] if g else centroizi[i] for i, g in enumerate(grupuri)]
    eticheta = [min(range(len(centroizi)), key=lambda i: dist(p, centroizi[i])) for p in puncte]
    return eticheta, centroizi

puncte = [[1, 1], [1.5, 2], [2, 1], [8, 8], [9, 8.5], [8.5, 9.5]]
etichete, centroizi = kmeans(puncte, [[1, 1], [9, 8.5]])
print(etichete)
print([[round(c, 2) for c in ct] for ct in centroizi])
```
Rezultatul:
```text
[0, 0, 0, 1, 1, 1]
[[1.5, 1.33], [8.5, 8.67]]
```

:::atentie
## Greșeli frecvente
- Alegi k la întâmplare și tragi concluzii: încearcă mai multe valori și compară cât de compacte sunt grupurile.
- Nu normalizezi datele: o caracteristică cu valori mari determină singură grupurile.
- Te oprești după o singură iterație: centroizii încă se mișcă. Repetă până nu se mai schimbă atribuirile.
- Crezi că etichetele 0, 1, 2 au o semnificație. Ele sunt doar nume de grupuri; la o altă rulare pot fi permutate.
:::

### 🔮 4.15.3 Citește și prezice

```python
puncte = [1, 2, 9, 10]
centroizi = [min(puncte), max(puncte)]
clustere = {0: [], 1: []}
for p in puncte:
    idx = 0 if abs(p - centroizi[0]) <= abs(p - centroizi[1]) else 1
    clustere[idx].append(p)
print(f"[{','.join(map(str, clustere[0]))}] si [{','.join(map(str, clustere[1]))}]")
```

Ce afișează programul?


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

2. Ce reprezintă un centroid în K-means?
   a) Primul punct din grup  b) **Media (centrul) punctelor din grup**  c) Punctul cel mai îndepărtat
      > După fiecare atribuire, centroidul se mută în media coordonatelor punctelor din grupul lui.

3. Cine alege numărul de grupuri k?
   a) Algoritmul, automat  b) **Utilizatorul, înainte de rulare**  c) Numărul de coloane
      > K-means nu știe singur câte grupuri există; k se alege, de exemplu, cu metoda „cotului”.

4. Când se oprește K-means?
   a) După o iterație  b) **Când atribuirile (și centroizii) nu se mai schimbă**  c) Când toate punctele sunt în același grup
      > Atunci algoritmul a ajuns într-o stare stabilă.

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

## Problemă rezolvată pas cu pas

**Enunț.** Calculăm de mână dreapta de regresie y = a·x + b pentru prețul unor apartamente în funcție de suprafață (metoda celor mai mici pătrate), apoi prezicem prețul unui apartament de 70 m².

**Ideea.** Panta e a = Σ(x - x̄)(y - ȳ) / Σ(x - x̄)², iar termenul liber e b = ȳ - a·x̄. Așa face și `LinearRegression` din scikit-learn, în spatele codului.

```python
mp = [40, 50, 60, 80, 100]
pret = [62, 75, 88, 114, 140]
mx, my = sum(mp) / len(mp), sum(pret) / len(pret)
a = sum((x - mx) * (y - my) for x, y in zip(mp, pret)) / sum((x - mx) ** 2 for x in mp)
b = my - a * mx
print(round(a, 2), round(b, 2))
print(round(a * 70 + b, 1))
```
Rezultatul:
```text
1.3 10.0
101.0
```

:::atentie
## Greșeli frecvente
- Folosești regresia liniară pentru o țintă cu categorii (Da/Nu). Pentru categorii ai nevoie de clasificare.
- Faci predicții mult în afara intervalului de antrenare (extrapolare): dreapta poate da valori absurde (ex. prețuri negative).
- Uiți termenul liber b și forțezi dreapta să treacă prin origine.
- Evaluezi modelul doar pe datele de antrenare. Folosește date pe care modelul nu le-a văzut.
:::

### 🔮 4.16.3 Citește și prezice

```python
def model_predict(x):
    return 2 * x + 1

print(model_predict(5))
```

Ce afișează programul?


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

2. Ce prezice regresia liniară?
   a) O categorie  b) **O valoare numerică, după o relație de forma y = a·x + b**  c) Un grup de puncte
      > Regresia potrivește o dreaptă prin date și o folosește pentru valori noi.

3. Dacă modelul e y = 2x + 1, ce prezice pentru x = 5?
   a) 10  b) **11**  c) 7
      > 2 · 5 + 1 = 11.

4. Ce înseamnă panta a = 1.3 (lei pe m²) în problema rezolvată?
   a) Prețul unui apartament  b) **Cu cât crește prețul pentru fiecare metru pătrat în plus**  c) Eroarea modelului
      > Panta arată schimbarea lui y când x crește cu o unitate.

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

## Problemă rezolvată pas cu pas

**Enunț.** Implementăm KNN de la zero: clasificăm un fruct nou după greutate și diametru, comparând cu fructe cunoscute, pentru k = 3.

**Ideea.** Calculăm distanța de la fructul nou la fiecare exemplu, sortăm crescător, păstrăm primii k vecini și alegem eticheta care apare cel mai des printre ei.

```python
exemple = [([150, 7.0], 'măr'), ([170, 7.5], 'măr'), ([140, 6.8], 'măr'),
           ([120, 6.0], 'lămâie'), ([110, 5.8], 'lămâie'), ([130, 6.2], 'lămâie')]
nou = [145, 6.9]

def dist(a, b):
    return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5

vecini = sorted(exemple, key=lambda e: dist(e[0], nou))[:3]
etichete = [e[1] for e in vecini]
print(etichete)
print(max(set(etichete), key=etichete.count))
```
Rezultatul:
```text
['măr', 'măr', 'lămâie']
măr
```

:::atentie
## Greșeli frecvente
- Alegi un k par la KNN cu două clase: pot apărea egalități la vot. Un k impar le evită.
- Nu normalizezi caracteristicile înainte de KNN: distanțele sunt dominate de coloana cu valori mari.
- Lași arborele de decizie să crească fără limită: învață pe de rost exemplele (overfitting) și greșește pe date noi.
- Crezi că KNN „învață” un model la antrenare. El doar memorează exemplele; tot calculul se face la predicție.
:::

### 🔮 4.17.3 Citește și prezice

```python
vecini = ["Da", "Da", "Nu"]
predictie = max(set(vecini), key=vecini.count)
print(predictie)
```

Ce afișează programul?


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

2. Cum decide KNN eticheta unui punct nou?
   a) Alege eticheta primului exemplu  b) **Prin votul celor mai apropiați k vecini**  c) Prin media tuturor etichetelor
      > Eticheta majoritară printre cei k vecini cei mai apropiați devine predicția.

3. Ce avantaj are arborele de decizie?
   a) E mereu cel mai precis  b) **Decizia lui se poate explica prin întrebări simple (ex. venit > 5000?)**  c) Nu are nevoie de date
      > Fiecare drum de la rădăcină la o frunză e o regulă pe care o poți citi.

4. Cei 3 vecini au etichetele Da, Nu, Da. Ce prezice KNN cu k = 3?
   a) Nu  b) **Da**  c) Egalitate
      > „Da” are 2 voturi din 3.

---


:::verifica-cod
Scrie o funcție `vot_majoritar(etichete)` care primește etichetele celor mai apropiați `k` vecini și returnează eticheta majoritară (votul KNN). Demo: `vot_majoritar(["Da", "Da", "Nu"])` -> `Da`
template: def vot_majoritar(etichete):
    # completeaza
    pass

print(vot_majoritar(["Da", "Da", "Nu"]))
output: Da
:::
