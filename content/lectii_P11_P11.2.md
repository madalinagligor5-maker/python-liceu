# Modulul P11.2 — Proiect final: jocul Bounce!

**Vârsta țintă:** 11 ani | Capitolul: Python pentru copii — 11 ani (clasa a V-a)
**Clasa:** P11 (Python pentru copii — ages 7-11)

---

### 🔄 P11.2.1 Recapitulare

Acesta este proiectul nostru final! Vom folosi tot ce am învățat până acum — bucle, condiții, liste și clase — pentru a construi un joc interactiv real în Python folosind modulul **tkinter**.

:::exemplu
## Conectează la cunoștințele anterioare
Jocul Bounce! presupune o minge care sare de pe pereți și pe care utilizatorul trebuie să o lovească folosind o paletă controlată cu mouse-ul sau tastatura.
:::

---

### 💡 P11.2.2 Concept nou si exemplu

Folosim biblioteca **tkinter** pentru a crea o fereastră grafică și un obiect de tip **Canvas** pe care putem desena cercuri și dreptunghiuri. Logica mișcării se bazează pe actualizarea coordonatelor X și Y la fiecare cadru.

:::exemplu
## Exemplu practic: Fereastra de joc
```python
from tkinter import *
tk = Tk()
tk.title("Bounce!")
canvas = Canvas(tk, width=500, height=400)
canvas.pack()
```
Acest cod creează spațiul de desenare inițial pentru jocul nostru.
:::

---

### 🔮 P11.2.3 Citește și prezice

Uită-te la codul de mai jos și gândește-te ce se întâmplă când mingea atinge marginea:

```python
directie_x = 3
# Daca atingem peretele din dreapta
atingere_dreapta = True
if atingere_dreapta:
    directie_x = -directie_x
print(directie_x)
```

Ce se întâmplă cu viteza ei pe direcția X?

:::atentie
## Atenție
Inversarea direcției (de la pozitiv la negativ și invers) face ca obiectele să ricoșeze realist la margini!
:::

---

### 🤝 P11.2.4 Exerciții ghidate

**Exercițiul 1.** Afișează viteza inițială a mingii pe axa X (3).

---


Completează spațiile punctate pentru a finaliza algoritmul:

```python
from tkinter import *
tk = Tk()
canvas = ___(tk, width=500, height=400)
canvas.___()
```


### 🎯 P11.2.5 Exerciții independente

**Exercițiul 1.** Simulează lovirea peretelui stâng: inversează viteza_x.

---

### ✅ P11.2.6 Verifică-ți înțelegerea

1. Ce modul din Python folosim pentru a crea interfața grafică a jocului Bounce!?
   a) turtle  b) **tkinter**  c) pygame
      > Jocul Bounce! folosește tkinter pentru fereastra grafică, exact modulul importat cu 'from tkinter import *' în exemplul cu fereastra de joc.

2. Ce obiect din tkinter ne permite să desenăm forme geometrice?
   a) Window  b) **Canvas**  c) Screen
      > Canvas este spațiul de desenare din tkinter pe care se pot trasa cercuri și dreptunghiuri, ca cel creat cu 'canvas = Canvas(tk, width=500, height=400)' din lecție.

3. Cum facem ca mingea să se miște în direcția opusă când atinge o margine?
   a) Oprim jocul  b) **Inversăm semnul vitezei (ex: viteza = -viteza)**  c) Schimbăm culoarea mingii
      > Când mingea atinge un perete, îi schimbăm doar semnul vitezei (viteza = -viteza), la fel cum s-a întâmplat cu directie_x în exemplul cu atingerea peretelui din dreapta.

---

(by @python-pentru-copii — vârstă țintă: 11 ani)
