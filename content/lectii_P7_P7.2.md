# Modulul P7.2 — Pippy Turtle: desene simple

**Vârsta țintă:** 7 ani | Capitolul: Python pentru copii — 7 ani (grădiniță / clasa I)
**Clasa:** P7 (Python pentru copii, 7–11 ani)

---

### 🔄 P7.2.1 Recapitulare

În modulul anterior am învățat cum să afișăm mesaje text cu ajutorul funcției print(). Acum vom învăța cum să punem un mic creion să deseneze pentru noi!

:::exemplu
## Conectează la cunoștințele anterioare
Așa cum print() scrie litere, în Python avem un modul grafic numit **turtle** (țestoasă) care poate desena linii și forme colorate.
:::

---

### 💡 P7.2.2 Concept nou și exemplu

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

## Problemă rezolvată pas cu pas

**Enunț.** Pippy merge cu țestoasa înainte de 3 ori: 100 de pași, apoi 50, apoi încă 50. Câți pași a mers în total? (Țestoasa nu poate desena aici, dar putem calcula ce va desena.)

**Ideea.** Fiecare `t.forward(...)` adaugă la drum câți pași scriem în paranteză. Ținem totalul într-o variabilă și o mărim după fiecare mers.

```python
pasi = 0
pasi = pasi + 100   # t.forward(100)
pasi = pasi + 50    # t.forward(50)
pasi = pasi + 50    # t.forward(50)
print("Țestoasa a mers", pasi, "pași")
```
Rezultatul: `Țestoasa a mers 200 pași`.

:::atentie
## Greșeli frecvente
- Uiți `import turtle` la început: Python nu știe ce e `turtle`.
- Scrii `t.forward 100` fără paranteze. Corect: `t.forward(100)`.
- Scrii `turtle.Pen` fără paranteze: creionul nu se creează. Corect: `t = turtle.Pen()`.
:::

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

**Exercițiul 1.** Țestoasa merge înainte de 3 ori câte 50 de pași. Completează adunarea și afișează câți pași a mers în total.

---


Completează spațiile punctate pentru a finaliza algoritmul:

```python
import turtle
t = turtle.___()

# Mișcă țestoasa înainte cu 50 de pași
t.___(50)
```


### 🎯 P7.2.5 Exerciții independente

**Exercițiul 1.** Pippy desenează o linie de 100 de pași, apoi una de 60 de pași. Afișează cu câți pași e mai lungă prima linie.

---

### ✅ P7.2.6 Verifică-ți înțelegerea

1. Cum aducem modulul de desenat în Python?
   a) load turtle  b) **import turtle**  c) open turtle
      > Scriem import turtle la începutul programului ca să aducem în cod micuța țestoasă care desenează pentru noi.

2. Ce face t.forward(100)?
   a) Rotește țestoasa  b) **Mută țestoasa înainte cu 100 de pași**  c) Desenează un pătrat
      > Comanda t.forward(100) spune țestoasei să meargă drept înainte, lăsând în urmă o linie de 100 de pași.

3. Cum se numește creionul creat de noi în cod?
   a) Pen  b) **t**  c) turtle
      > În exemplul nostru am scris t = turtle.Pen(), așa că am ales să-i spunem creionului nostru pe scurt t.

4. Ce face `t.left(90)`?
   a) Merge 90 de pași  b) **Întoarce țestoasa spre stânga**  c) Desenează un cerc
      > `left` înseamnă „stânga”: țestoasa se rotește pe loc, fără să deseneze.

5. Ce linie e mai lungă: `t.forward(80)` sau `t.forward(30)`?
   a) 30  b) **80**  c) Sunt la fel
      > Numărul din paranteză spune câți pași merge țestoasa: 80 e mai mult.

:::verifica-cod
Țestoasa face două linii: una de 70 de pași și una de 30 de pași. Afișează câți pași a mers în total.
template: linia1 = 70
linia2 = 30
print(___)
output: 100
:::
