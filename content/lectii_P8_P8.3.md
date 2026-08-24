# Modulul P8.3 — Listă de culori și for simplu

**Vârsta țintă:** 8 ani | Capitolul: Python pentru copii — 8 ani (clasa a II-a)
**Clasa:** P8 (Python pentru copii — ages 7-11)

---

### 🔄 P8.3.1 Recapitulare

Până acum am stocat în variabile doar valori unice (un singur text sau un singur număr). În Python putem grupa mai multe valori întro structură numită **listă**.

:::exemplu
## Conectează la cunoștințele anterioare
O listă se scrie folosind paranteze pătrate, iar elementele sunt separate prin virgulă, ca o listă de cumpărături!
:::

---

### 💡 P8.3.2 Concept nou si exemplu

Creăm o listă cu **culori = ["rosu", "verde", "albastru"]**. Putem parcurge lista element cu element folosind o buclă **for** sau putem alege o valoare aleatorie folosind **random.choice()**.

:::exemplu
## Exemplu practic: Alegerea unei culori la întâmplare
```python
import random
culori = ["rosu", "verde", "albastru"]
culoare_aleasa = random.choice(culori)
print("Culoarea norocoasă este:", culoare_aleasa)
```
Acest cod folosește modulul random pentru a extrage o culoare din lista noastră.
:::

---

### 🔮 P8.3.3 Citește și prezice

Uită-te la codul de mai jos și ghicește ce va afișa calculatorul:

```python
culori = ["rosu", "verde", "albastru"]
print(len(culori))
```

Câte elemente sunt în lista noastră de culori?

:::atentie
## Atenție
Nu uita să scrii `import random` la începutul programului dacă vrei să folosești funcția de alegere la întâmplare!
:::

---

### 🤝 P8.3.4 Exerciții ghidate

**Exercițiul 1.** Afișează prima culoare din listă: rosu, verde, albastru.

---

### 🎯 P8.3.5 Exerciții independente

**Exercițiul 1.** Adaugă culoarea 'galben' în listă folosind append și afișează lungimea noii liste.

---

### ✅ P8.3.6 Verifică-ți înțelegerea

1. Cum se scrie o listă în Python?
   a) {1, 2}  b) **[1, 2, 3]**  c) (1, 2)

2. Ce funcție folosești pentru a alege un element aleatoriu dintr-o listă?
   a) random.rand()  b) **random.choice()**  c) random.select()

3. Cum adaugi un element la sfârșitul unei liste?
   a) add()  b) **append()**  c) push()

---

(by @python-pentru-copii — vârstă țintă: 8 ani)
