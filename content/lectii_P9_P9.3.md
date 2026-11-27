# Modulul P9.3 — Funcții simple

**Vârsta țintă:** 9 ani | Capitolul: Python pentru copii — 9 ani (clasa a III-a)
**Clasa:** P9 (Python pentru copii, 7–11 ani)

---

### 🔄 P9.3.1 Recapitulare

Până acum am folosit funcții gata create în Python (cum ar fi print(), len() sau range()). Acum este momentul să învățăm cum să ne creăm propriile noastre funcții personalizate!

:::exemplu
## Conectează la cunoștințele anterioare
O funcție este o cutie cu cod pe care o putem folosi ori de câte ori avem nevoie, fără să scriem aceleași rânduri de cod de mai multe ori.
:::

---

### 💡 P9.3.2 Concept nou și exemplu

Definim o funcție folosind cuvântul cheie **def**, urmat de numele funcției și paranteze. Putem trimite date în funcție prin parametri și putem primi înapoi un rezultat folosind **return**.

:::exemplu
## Exemplu practic: Funcția de dublare
```python
def dublu(numar):
    rezultat = numar * 2
    return rezultat

print(dublu(5))
print(dublu(10))
```
Acest program definește funcția 'dublu' și o apelează, afișând 10 și apoi 20.
:::

---

## Problemă rezolvată pas cu pas

**Enunț.** Facem o funcție `perimetru(latura)` pentru un pătrat și o folosim pentru trei pătrate diferite, apoi adunăm rezultatele.

**Ideea.** Scriem calculul o singură dată, în funcție. `return` dă rezultatul înapoi, așa că îl putem afișa sau aduna cu alte rezultate.

```python
def perimetru(latura):
    return 4 * latura

print(perimetru(2))
print(perimetru(5))
total = perimetru(2) + perimetru(5) + perimetru(10)
print("Total:", total)
```
Rezultatul:
```text
8
20
Total: 68
```

:::atentie
## Greșeli frecvente
- Definești funcția, dar uiți s-o apelezi: nu se întâmplă nimic.
- Folosești `print` în funcție în loc de `return` și apoi vrei să faci socoteli cu rezultatul: primești `None`.
- Uiți parantezele la apel: `print(dublu)` afișează funcția, nu rezultatul. Corect: `print(dublu(5))`.
:::

### 🔮 P9.3.3 Citește și prezice

Uită-te la codul de mai jos și prezice ce va afișa:

```python
def dublu(x):
    return x * 2

print(dublu(10))
```

Ce se va afișa?

:::atentie
## Atenție
Codul din interiorul funcției trebuie să fie indentat (lăsat mai la dreapta) ca Python să știe că aparține acelei funcții!
:::

---

### 🤝 P9.3.4 Exerciții ghidate

**Exercițiul 1.** Definește o funcție numită saluta care returnează 'Salut!' și apeleaz-o.

---


Completează spațiile punctate pentru a finaliza algoritmul:

```python
___ triplu(numar):
    rezultat = numar * 3
    ___ rezultat

print(triplu(4))
```


### 🎯 P9.3.5 Exerciții independente

**Exercițiul 1.** Definește o funcție numită adunare(a, b) care returnează suma lor.

---

### ✅ P9.3.6 Verifică-ți înțelegerea

1. Cu ce cuvânt cheie definim o funcție în Python?
   a) function  b) **def**  c) create
      > În Python, orice funcție nouă se pornește cu cuvântul def, urmat de numele ei și de paranteze.

2. Ce comandă trimite rezultatul înapoi din funcție?
   a) send  b) **return**  c) print
      > return este cel care scoate rezultatul din funcție și îl trimite înapoi acolo unde a fost apelată funcția.

3. Cum se numesc variabilele din parantezele unei funcții?
   a) Valori  b) **Parametri**  c) Obiecte
      > Variabilele scrise între paranteze, prin care trimitem date către funcție, se numesc parametri.

4. Ce afișează `def f(x): return x + 1` urmat de `print(f(f(1)))`?
   a) 2  b) **3**  c) 1
      > f(1) = 2, apoi f(2) = 3.

5. Ce primești dintr-o funcție care nu are `return`?
   a) 0  b) **None**  c) Eroare
      > Fără `return`, funcția întoarce valoarea specială `None`.

:::verifica-cod
Scrie funcția `jumatate(n)` care întoarce jumătatea lui n (cu `/`) și afișează `jumatate(9)`.
template: def jumatate(n):
    return ___

print(jumatate(9))
output: 4.5
:::
