# Modulul P7.2 — Pippy Turtle: desene simple

**Vârsta țintă:** 7 ani | Capitolul: Python pentru copii — 7 ani (grădiniță / clasa I)
**Clasa:** P7 (Python pentru copii — ages 7-11)

---

### 🔄 P7.2.1 Recapitulare

În modulul anterior am învățat cum să afișăm mesaje text cu ajutorul funcției print(). Acum vom învăța cum să punem un mic creion să deseneze pentru noi!

:::exemplu
## Conectează la cunoștințele anterioare
Așa cum print() scrie litere, în Python avem un modul grafic numit **turtle** (țestoasă) care poate desena linii și forme colorate.
:::

---

### 💡 P7.2.2 Concept nou si exemplu

Folosim **import turtle** pentru a aduce creionul pe ecran. Apoi creăm o țestoasă cu **t = turtle.Pen()** și o mișcăm înainte cu **t.forward(100)**.

:::exemplu
## Exemplu practic: Desenează o linie
```python
import turtle
t = turtle.Pen()
t.forward(100)
```
Țestoasa va lăsa în urmă o linie dreaptă de 100 de pași.
:::

---

### 🔮 P7.2.3 Citește și prezice

Uită-te la codul de mai jos și încearcă să ghicești ce se întâmplă:

```python
import turtle
t = turtle.Pen()
t.forward(100)
```

Ce crezi că vei vedea pe ecran? Scrie predicția ta pe o foaie de hârtie, apoi verifică.

:::atentie
## Atenție — ceva de reținut
Pentru a desena, trebuie mereu să scriem numele țestoasei urmat de punct și acțiune (de exemplu, t.forward).
:::

---

### 🤝 P7.2.4 Exerciții ghidate

**Exercițiul 1.** Afișează cuvântul 'turtle' pe ecran pentru a demonstra că știi cum se numește modulul.

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


### 🎯 P7.2.5 Exerciții independente

**Exercițiul 1.** Afișează culoarea preferată a lui Pippy: 'verde'.

---

### ✅ P7.2.6 Verifică-ți înțelegerea

1. Cum aducem modulul de desenat în Python?
   a) load turtle  b) **import turtle**  c) open turtle

2. Ce face t.forward(100)?
   a) Rotește țestoasa  b) **Mută țestoasa înainte cu 100 de pași**  c) Desenează un pătrat

3. Cum se numește creionul creat de noi în cod?
   a) Pen  b) **t**  c) turtle

---

(by @python-pentru-copii — vârstă țintă: 7 ani)
