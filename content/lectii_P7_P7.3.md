# Modulul P7.3 — Desene geometrice

**Vârsta țintă:** 7 ani | Capitolul: Python pentru copii — 7 ani (grădiniță / clasa I)
**Clasa:** P7 (Python pentru copii — ages 7-11)

---

### 🔄 P7.3.1 Recapitulare

Am văzut cum putem trasa o linie dreaptă folosind țestoasa grafică. Pentru a desena forme ca pătrate sau triunghiuri, trebuie să învățăm cum să o rotim la stânga sau la dreapta.

:::exemplu
## Conectează la cunoștințele anterioare
Folosim **t.left(90)** pentru a roti țestoasa la stânga cu 90 de grade (un colț de pătrat).
:::

---

### 💡 P7.3.2 Concept nou si exemplu

Pentru a nu scrie aceleași comenzi de multe ori, în Python putem folosi o buclă **for**. Aceasta îi spune calculatorului să repete acțiunile de un număr de ori.

:::exemplu
## Exemplu practic: Desenarea unui pătrat
```python
import turtle
t = turtle.Pen()
for i in range(4):
    t.forward(50)
    t.left(90)
```
Acest cod repetă mișcarea înainte și rotația de 4 ori, formând un pătrat perfect!
:::

---

### 🔮 P7.3.3 Citește și prezice

Uită-te la codul de mai jos și prezice rezultatul:

```python
import turtle
t = turtle.Pen()
for i in range(4):
    t.forward(50)
    t.left(90)
```

Ce figură geometrică va desena creionul nostru?

:::atentie
## Atenție
Liniile de sub for trebuie lăsate un pic mai la dreapta (indentare) ca Python să știe că fac parte din repetiție.
:::

---

### 🤝 P7.3.4 Exerciții ghidate

**Exercițiul 1.** Afișează numărul de laturi ale unui pătrat (4).

---

### 🎯 P7.3.5 Exerciții independente

**Exercițiul 1.** Afișează unghiul de rotație pentru un pătrat (90).

---

### ✅ P7.3.6 Verifică-ți înțelegerea

1. Ce instrucțiune repetă acțiunile în Python?
   a) repeat  b) **for**  c) print

2. Cu ce unghi trebuie să rotim țestoasa ca să facem colțul unui pătrat?
   a) 45  b) **90**  c) 180

3. Ce înseamnă indentare?
   a) Ștergerea codului  b) **Lăsarea unui spațiu la începutul rândului**  c) Rularea programului

---

(by @python-pentru-copii — vârstă țintă: 7 ani)
