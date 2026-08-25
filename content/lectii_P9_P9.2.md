# Modulul P9.2 — Variabile și expresii

**Vârsta țintă:** 9 ani | Capitolul: Python pentru copii — 9 ani (clasa a III-a)
**Clasa:** P9 (Python pentru copii — ages 7-11)

---

### 🔄 P9.2.1 Recapitulare

Fiecare variabilă din programul nostru păstrează o valoare pe care o putem modifica pe parcurs. Acum vom vedea cum putem modifica variabilele mai rapid și cum să formatăm textele.

:::exemplu
## Conectează la cunoștințele anterioare
Am folosit `scor = scor + 5`. Python are o modalitate mai scurtă de a scrie acest lucru: `scor += 5`.
:::

---

### 💡 P9.2.2 Concept nou si exemplu

Operatorul **+=** adaugă o valoare la o variabilă existentă. De asemenea, putem folosi **f-string-uri** (stringuri formatate cu caracterul f la început: **f"Scor: {scor}"**) pentru a insera variabile direct în text.

:::exemplu
## Exemplu practic: Actualizarea scorului
```python
scor = 10
scor += 5
nume = "Pippy"
print(f"Jucătorul {nume} are scorul {scor}")
```
Acest cod adaugă 5 la scor și folosește f-string-ul pentru a scrie 'Jucătorul Pippy are scorul 15'.
:::

---

### 🔮 P9.2.3 Citește și prezice

Uită-te la codul de mai jos și ghicește rezultatul:

```python
nume = "Pippy"
mesaj = f"Salut, {nume}!"
print(mesaj)
```

Ce se va afișa?

:::atentie
## Atenție
F-string-urile funcționează doar dacă pui litera 'f' chiar înainte de ghilimelele de început!
:::

---

### 🤝 P9.2.4 Exerciții ghidate

**Exercițiul 1.** Adună 5 la variabila scor folosind operatorul += și afișează scorul.

---


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: declarare date
val1 = 15
val2 = 30

# Pasul 2: calcul
total = ___ + ___  # Completează variabilele
print("Total:", ___)
```


### 🎯 P9.2.5 Exerciții independente

**Exercițiul 1.** Folosește un f-string pentru a afișa 'Scor: 20' din variabila scor = 20.

---

### ✅ P9.2.6 Verifică-ți înțelegerea

1. Ce face operatorul +=?
   a) Scade valoarea  b) **Adaugă o valoare la variabilă**  c) Șterge variabila

2. Cum marcăm un f-string în Python?
   a) Punem f la sfârșit  b) **Punem litera f la începutul ghilimelelor**  c) Îl scriem cu litere mari

3. Ce se pune între acolade {} într-un f-string?
   a) Comentarii  b) **Variabile sau expresii Python**  c) Litere mari

---

(by @python-pentru-copii — vârstă țintă: 9 ani)
