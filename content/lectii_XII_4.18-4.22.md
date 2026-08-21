# Modulul 4.18 — Introducere în rețele neuronale

### 🔄 4.18.1 Recapitulare

Ai folosit KNN și arbori de decizie (4.17). Rețelele neuronale sunt un model mai complex, inspirat de creier.

### 💡 4.18.2 Concept nou și exemplu

O **rețea neuronală** are:
- **neuroni** organizați pe straturi (intrare → ascunse → ieșire)
- fiecare conexiune are o **greutate** (weight)
- un neuron calculează o sumă ponderată + o funcție de activare (ex. sigmoid)

Învățarea = ajustarea greutăților ca să minimizeze eroarea de predicție.

```python
from sklearn.neural_network import MLPClassifier
nn = MLPClassifier(hidden_layer_sizes=(10,), max_iter=500)
nn.fit(X, y)
```

:::tip
Rețelele neuronale excelează la date complexe (imagini, sunet), dar au nevoie de multă date și sunt "cutii negre" (greu de explicat).
:::

### 🔮 4.18.3 Citește și prezice

```python
# Un neuron cu intrarea x=2, greutate w=3, bias b=1
# si activare liniara: iesire = w*x + b
# Care e iesirea?
```

### 🤝 4.18.4 Exerciții ghidate

Calculează manual ieșirea unui neuron cu 2 intrări, 2 greutăți și bias.

### 🎯 4.18.5 Exerciții independente

Antrenează un `MLPClassifier` pe un set mic și raportează acuratețea.

### ✅ 4.18.6 Verifică-ți înțelegerea

De ce rețelele neuronale sunt considerate "cutii negre" față de arborele de decizie?

---

# Modulul 4.19 — Biblioteca Matplotlib: vizualizarea datelor

### 🔄 4.19.1 Recapitulare

Ai antrenat modele ML (4.15–4.18). Ca să le înțelegi, trebuie să *vezi* datele.

### 💡 4.19.2 Concept nou și exemplu

`matplotlib.pyplot` desenează grafice:
```python
import matplotlib.pyplot as plt
plt.plot([1, 2, 3], [2, 4, 6])   # linie
plt.scatter([1, 2, 3], [2, 4, 6]) # puncte
plt.bar(['A','B'], [10, 20])      # bara
plt.title("Grafic"); plt.xlabel("x"); plt.show()
```

:::tip
`plt.show()` deschide fereastra. În notebooks/servicii web folosești `plt.savefig()` în loc, ca să nu blocheze.
:::

### 🔮 4.19.3 Citește și prezice

```python
import matplotlib.pyplot as plt
plt.plot([0,1,2], [3,1,4])
# Ce forma are graficul (crescator/descrescator/mix)?
```

### 🤝 4.19.4 Exerciții ghidate

Desenează un grafic cu linie pentru vânzările a 5 luni.

### 🎯 4.19.5 Exerciții independente

Folosește `scatter` pentru a vizualiza 2 features ale unui set de date.

### ✅ 4.19.6 Verifică-ți înțelegerea

De ce vizualizarea e importantă înainte de a alege un model ML?

---

# Modulul 4.20 — Biblioteca Pandas: DataFrame și statistici descriptive

### 🔄 4.20.1 Recapitulare

Ai desenat cu Matplotlib (4.19). Pandas organizează datele într-o structură ușor de manipulat.

### 💡 4.20.2 Concept nou și exemplu

`DataFrame` e un tabel cu rânduri și coloane (ca o foaie Excel):
```python
import pandas as pd
df = pd.DataFrame({'nume': ['Ana','Bogdan'], 'varsta': [17,19]})
print(df['varsta'].mean())   # statistici
print(df.describe())         # rezumat: count, mean, std, min, max
```

Statistici descriptive: `mean`, `median`, `std`, `min`, `max`, `count`.

:::tip
Pandas e coloana vertebrală a ML-ului în Python: încărci CSV, cureți, transformi, apoi dai la sklearn.
:::

### 🔮 4.20.3 Citește și prezice

```python
import pandas as pd
df = pd.DataFrame({'x':[1,2,3,4]})
# Cat e df['x'].mean()?
```

### 🤝 4.20.4 Exerciții ghidate

Creează un DataFrame cu 3 coloane și afișează `describe()`.

### 🎯 4.20.5 Exerciții independente

Încarcă un CSV (`pd.read_csv`) și calculează media pe o coloană.

### ✅ 4.20.6 Verifică-ți înțelegerea

De ce DataFrame e mai util decât o listă de dicționare pentru date cu multe coloane?

---

# Modulul 4.21 — Biblioteca Scikit-learn: antrenare, predicție, evaluare

### 🔄 4.21.1 Recapitulare

Ai folosit Pandas (4.20) și Matplotlib (4.19). Scikit-learn unifică antrenarea modelelor.

### 💡 4.21.2 Concept nou și exemplu

Fluxul standard sklearn:
```python
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model.fit(X_train, y_train)
pred = model.predict(X_test)
print(accuracy_score(y_test, pred))  # cat de bine a mers
```

:::tip
Întotdeauna împarți în train/test ca să evaluezi pe date *nemaivăzute* — altfel modelul "memorează" și scorul e fals.
:::

### 🔮 4.21.3 Citește și prezice

```python
# 100 exemple, test_size=0.2
# Cate exempla sunt in setul de test?
```

### 🤝 4.21.4 Exerciții ghidate

Împarte un set în train/test și antrenează un model, raportând acuratețea.

### 🎯 4.21.5 Exerciții independente

Folosește `cross_val_score` pentru o evaluare mai robustă.

### ✅ 4.21.6 Verifică-ți înțelegerea

De ce e greșit să evaluezi modelul pe aceleași date pe care l-ai antrenat?

---

# Modulul 4.22 — Biblioteca NumPy: operații cu matrici

### 🔄 4.22.1 Recapitulare

Ai folosit Pandas (4.20) pentru tabele. NumPy e fundamentul — operăază cu matrici (arrays) rapide.

### 💡 4.22.2 Concept nou și exemplu

`ndarray` e o matrice multidimensională, cu operații vectorizate (fără loop-uri):
```python
import numpy as np
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print(a + b)          # [5 7 9]  (element cu element)
print(a * 2)          # [2 4 6]
m = np.array([[1,2],[3,4]])
print(m.sum(axis=0))  # suma pe coloane
```

ML-ul folosește NumPy pentru calcule matriciale (matricea de features, greutăți).

:::tip
NumPy e de ~100x mai rapid decât listele Python pentru calcule pe multe numere, pentru că e în C sub capotă.
:::

### 🔮 4.22.3 Citește și prezice

```python
import numpy as np
a = np.array([1, 2, 3])
print(a * a)  # inmultire element cu element
```

### 🤝 4.22.4 Exerciții ghidate

Creează o matrice 2×2 și calculează suma pe linii și coloane.

### 🎯 4.22.5 Exerciții independente

Înmulțește două matrici cu `np.dot` și verifică rezultatul.

### ✅ 4.22.6 Verifică-ți înțelegerea

De ce NumPy e mai rapid decât listele Python pentru operații matematice?
