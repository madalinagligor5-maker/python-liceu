# Modulul P7.3 — Desene geometrice

**Vârsta țintă:** 7 ani | Capitolul: Python pentru copii — 7 ani (grădiniță / clasa I)
**Clasa:** P7 (Python pentru copii, 7–11 ani)

---

### 🔄 P7.3.1 Recapitulare

Am văzut cum putem trasa o linie dreaptă folosind țestoasa grafică. Pentru a desena forme ca pătrate sau triunghiuri, trebuie să învățăm cum să o rotim la stânga sau la dreapta.

:::exemplu
## Conectează la cunoștințele anterioare
Folosim **t.left(90)** pentru a roti țestoasa la stânga cu 90 de grade (un colț de pătrat).
:::

---

### 💡 P7.3.2 Concept nou și exemplu

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

## Problemă rezolvată pas cu pas

**Enunț.** Vrem să desenăm un triunghi cu laturi egale. Câte laturi are, de câte grade se întoarce țestoasa după fiecare latură și ce comenzi dă? (Țestoasa nu poate desena aici, dar putem calcula ce va desena.)

**Ideea.** Ca să se întoarcă de unde a plecat, țestoasa se rotește în total 360 de grade. La un triunghi sunt 3 rotiri, deci fiecare are 360 : 3 = 120 de grade. Bucla `for` repetă aceleași două comenzi de 3 ori.

```python
laturi = 3
unghi = 360 // laturi
for i in range(laturi):
    print("înainte 100, stânga", unghi)
```
Rezultatul:
```text
înainte 100, stânga 120
înainte 100, stânga 120
înainte 100, stânga 120
```

:::atentie
## Greșeli frecvente
- Nu lași spațiu în fața liniilor din `for`: Python nu știe ce trebuie repetat.
- Uiți `:` la finalul liniei cu `for`.
- Scrii `range(3)` când vrei un pătrat: pătratul are 4 laturi, deci `range(4)`.
:::

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

**Exercițiul 1.** Fără desen: repetă de 4 ori comanda pentru o latură de pătrat, „înainte 50, stânga 90”, cu o buclă `for`.

---


Completează spațiile punctate pentru a finaliza algoritmul:

```python
import turtle
t = turtle.Pen()

# Repetă de 4 ori: mergi înainte și rotește pentru a desena un pătrat
for i in range(___):
    t.forward(50)
    t.___(90)
```


### 🎯 P7.3.5 Exerciții independente

**Exercițiul 1.** Ca să deseneze un triunghi, țestoasa se întoarce de 3 ori și face în total 360 de grade. Afișează câte grade are o singură întoarcere.

---

### ✅ P7.3.6 Verifică-ți înțelegerea

1. Ce instrucțiune repetă acțiunile în Python?
   a) repeat  b) **for**  c) print
      > Bucla for este cea care repetă aceleași comenzi de mai multe ori, ca să nu le scriem noi de fiecare dată.

2. Cu ce unghi trebuie să rotim țestoasa ca să facem colțul unui pătrat?
   a) 45  b) **90**  c) 180
      > Un pătrat are colțuri drepte, iar pentru fiecare colț rotim țestoasa exact 90 de grade, cum am văzut la desenarea pătratului.

3. Ce înseamnă indentare?
   a) Ștergerea codului  b) **Lăsarea unui spațiu la începutul rândului**  c) Rularea programului
      > Indentarea înseamnă să lași un mic spațiu la începutul rândului, ca Python să înțeleagă ce comenzi fac parte din repetiție.

4. De câte ori se repetă codul din `for i in range(5):`?
   a) 4  b) **5**  c) 6
      > `range(5)` înseamnă de 5 ori.

5. Ce figură desenează: `for i in range(4): t.forward(50); t.left(90)`?
   a) Triunghi  b) **Pătrat**  c) Cerc
      > 4 laturi egale și 4 întoarceri de 90 de grade fac un pătrat.

:::verifica-cod
Repetă de 3 ori mesajul „Hip hip ura!”, folosind o buclă `for`.
template: for i in range(___):
    print("Hip hip ura!")
output: Hip hip ura!
Hip hip ura!
Hip hip ura!
:::
