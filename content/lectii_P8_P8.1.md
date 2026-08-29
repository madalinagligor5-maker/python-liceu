# Modulul P8.1 — Input și conversie

**Vârsta țintă:** 8 ani | Capitolul: Python pentru copii — 8 ani (clasa a II-a)
**Clasa:** P8 (Python pentru copii — ages 7-11)

---

### 🔄 P8.1.1 Recapitulare

Până acum calculatorul doar ne-a vorbit sau ne-a desenat. Acum vom învăța cum să facem calculatorul să ne asculte și să citească ce scriem noi de la tastatură!

:::exemplu
## Conectează la cunoștințele anterioare
Am folosit variabile pentru a stoca valori fixe. Acum valoarea va veni direct de la utilizatorul programului.
:::

---

### 💡 P8.1.2 Concept nou si exemplu

Folosim funcția **input()** pentru a pune o întrebare utilizatorului. Deoarece input() primește mereu un text, dacă vrem numere, trebuie să le convertim folosind **int()** sau **float()**.

:::exemplu
## Exemplu practic: Ghicirea vârstei
```python
nume = input("Cum te cheamă? ")
varsta_text = input("Câți ani ai? ")
varsta = int(varsta_text)
print("Peste 2 ani vei avea:", varsta + 2)
```
Funcția int() transformă textul primit în număr pentru a putea face calcule matematice.
:::

---

### 🔮 P8.1.3 Citește și prezice

Uită-te la codul de mai jos și ghicește rezultatul:

```python
nr = int("5")
print(nr + 2)
```

Ce se va afișa pe ecran?

:::atentie
## Atenție
Dacă încerci să faci int("salut"), Python va da eroare deoarece cuvântul 'salut' nu poate fi transformat în număr!
:::

---

### 🤝 P8.1.4 Exerciții ghidate

**Exercițiul 1.** Convertește textul '10' într-un număr întreg și afișează-l înmulțit cu 2.

---


Completează spațiile punctate pentru a finaliza algoritmul:

```python
varsta_text = ___("Câți ani ai? ")
varsta = ___(varsta_text)

print("Peste 5 ani vei avea:", varsta + 5)
```


### 🎯 P8.1.5 Exerciții independente

**Exercițiul 1.** Convertește textul '3.14' într-un număr cu virgulă (float) și afișează-l.

---

### ✅ P8.1.6 Verifică-ți înțelegerea

1. Ce funcție folosești pentru a citi text de la tastatură?
   a) read()  b) **input()**  c) print()
      > Funcția input() este cea care pune o întrebare și așteaptă să scrii răspunsul de la tastatură.

2. Ce funcție folosești pentru a transforma textul în număr întreg?
   a) str()  b) **int()**  c) float()
      > Funcția int() ia un text și îl transformă în număr întreg, ca să putem face calcule cu el, așa cum am făcut cu vârsta.

3. Ce returnează input() în mod implicit?
   a) Un număr  b) **Un text (string)**  c) Nimic
      > Chiar dacă tastăm un număr, input() ni-l dă mereu ca text, de aceea avem nevoie de int() sau float() ca să-l transformăm.

---

(by @python-pentru-copii — vârstă țintă: 8 ani)
