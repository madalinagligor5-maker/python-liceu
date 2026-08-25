# Modulul P8.2 — Stringuri și manipulare

**Vârsta țintă:** 8 ani | Capitolul: Python pentru copii — 8 ani (clasa a II-a)
**Clasa:** P8 (Python pentru copii — ages 7-11)

---

### 🔄 P8.2.1 Recapitulare

Textele în programare sunt numite **stringuri**. Le-am folosit deja în print() și input(). Acum vom vedea cum putem măsura un text sau cum putem accesa litere din el.

:::exemplu
## Conectează la cunoștințele anterioare
Un string este o succesiune de caractere înconjurate de ghilimele simple sau duble.
:::

---

### 💡 P8.2.2 Concept nou si exemplu

Putem afla lungimea unui text folosind funcția **len()**. De asemenea, putem lua prima literă folosind parantezele pătrate **[0]** sau putem transforma textul în litere mari cu **.upper()**.

:::exemplu
## Exemplu practic: Joaca cu literele
```python
mesaj = "Python"
print("Lungime:", len(mesaj))
print("Prima litera:", mesaj[0])
print("Litere mari:", mesaj.upper())
```
Acest program va afișa lungimea 6, prima literă 'P' și textul 'PYTHON'.
:::

---

### 🔮 P8.2.3 Citește și prezice

Uită-te la codul de mai jos și prezice ce se afișează:

```python
mesaj = "Python"
print(mesaj[0] + mesaj[1])
```

Ce se va afișa pe ecran?

:::atentie
## Atenție
În programare, numărătoarea pozițiilor (indexarea) începe mereu de la 0, nu de la 1!
:::

---

### 🤝 P8.2.4 Exerciții ghidate

**Exercițiul 1.** Afișează lungimea textului 'Pippy'.

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


### 🎯 P8.2.5 Exerciții independente

**Exercițiul 1.** Convertește textul 'pippy' în litere mari (UPPERCASE) și afișează-l.

---

### ✅ P8.2.6 Verifică-ți înțelegerea

1. Cum aflăm lungimea unui text în Python?
   a) size()  b) **len()**  c) count()

2. De la ce număr începe indexarea caracterelor într-un text?
   a) 1  b) **0**  c) -1

3. Ce face metoda .upper()?
   a) Șterge textul  b) **Transformă textul în litere mari**  c) Pune textul la sfârșit

---

(by @python-pentru-copii — vârstă țintă: 8 ani)
