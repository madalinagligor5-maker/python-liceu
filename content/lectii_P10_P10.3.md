# Modulul P10.3 — Funcții mai complexe

**Vârsta țintă:** 10 ani | Capitolul: Python pentru copii — 10 ani (clasa a IV-a)
**Clasa:** P10 (Python pentru copii, 7–11 ani)

---

### 🔄 P10.3.1 Recapitulare

Am învățat să definim funcții simple. In acest modul, vom vedea cum putem folosi variabile globale și locale și cum să definim valori implicite pentru parametrii funcției.

:::exemplu
## Conectează la cunoștințele anterioare
Uneori vrem ca o funcție să funcționeze chiar dacă uităm să îi dăm o valoare la apelare. Pentru asta folosim valori predefinite.
:::

---

### 💡 P10.3.2 Concept nou și exemplu

Parametrii pot avea valori implicite, de exemplu: **def saluta(nume="Prieten"):**. Dacă apelăm `saluta()`, se va folosi valoarea implicită 'Prieten'.

:::exemplu
## Exemplu practic: Funcții cu valori implicite
```python
def calculeaza_pret(pret, reducere=0):
    return pret - reducere

print("Preț normal:", calculeaza_pret(100))
print("Preț redus:", calculeaza_pret(100, 15))
```
Prima apelare folosește reducerea implicită 0. A doua folosește reducerea 15 oferită la apel.
:::

---

## Problemă rezolvată pas cu pas

**Enunț.** Facem o funcție care pregătește o pizza: dimensiunea e obligatorie, iar toppingul implicit e „brânză”. Comandăm trei pizze diferite.

**Ideea.** Parametrul `topping="brânză"` are o valoare de rezervă. Dacă la apel nu spunem toppingul, se folosește brânza; dacă îl spunem, se folosește ce am cerut.

```python
def pizza(marime, topping="brânză"):
    return f"Pizza {marime} cu {topping}"

print(pizza("mică"))
print(pizza("mare", "ciuperci"))
print(pizza(topping="ananas", marime="medie"))
```
Rezultatul:
```text
Pizza mică cu brânză
Pizza mare cu ciuperci
Pizza medie cu ananas
```

:::atentie
## Greșeli frecvente
- Pui parametrul cu valoare implicită înaintea celui fără: `def f(a=1, b)` dă eroare. Cei cu valoare implicită stau la sfârșit.
- Folosești în afara funcției o variabilă creată în interiorul ei: e locală și nu există acolo.
- Crezi că valoarea implicită se folosește mereu. Ea se folosește doar când nu dai acel argument la apel.
:::

### 🔮 P10.3.3 Citește și prezice

Uită-te la codul de mai jos și ghicește ce va afișa:

```python
def saluta(nume="Copil"):
    print("Salut " + nume)

saluta()
```

Ce se va afișa?

:::atentie
## Atenție
Variabilele create în interiorul unei funcții sunt locale și pot fi folosite doar în acea funcție!
:::

---

### 🤝 P10.3.4 Exerciții ghidate

**Exercițiul 1.** Definește o funcție care saluta cu valoare implicită 'Pippy'.

---


Completează spațiile punctate pentru a finaliza algoritmul:

```python
def calculeaza_pret(pret, reducere=___):
    return pret - reducere

print(calculeaza_pret(___))   # folosește reducerea implicită
```


### 🎯 P10.3.5 Exerciții independente

**Exercițiul 1.** Creează o funcție putere(baza, exponent=2) care returnează baza ridicată la exponent.

---

### ✅ P10.3.6 Verifică-ți înțelegerea

1. Ce se întâmplă dacă o funcție are un parametru cu valoare implicită și nu oferim acea valoare la apel?
   a) Dă eroare  b) **Folosește valoarea implicită**  c) Returnează None
      > Dacă nu oferi o valoare la apel, Python folosește automat valoarea implicită scrisă în definiția funcției.

2. Unde pot fi folosite variabilele definite în interiorul unei funcții?
   a) Oriunde în program  b) **Doar în interiorul acelei funcții**  c) În alte fișiere
      > O variabilă creată în interiorul unei funcții este locală, adică trăiește doar acolo și dispare când funcția se termină.

3. Cum definim o valoare implicită pentru un parametru?
   a) def f(x : 10)  b) **def f(x=10)**  c) def f(x == 10)
      > O valoare implicită se scrie direct în paranteze, cu semnul =, ca în def f(x=10).

4. Ce afișează `def f(x, y=10): return x + y` și `print(f(1))`?
   a) 1  b) **11**  c) Eroare
      > y nu e dat, deci ia valoarea implicită 10: 1 + 10 = 11.

5. Și `print(f(1, 2))`?
   a) 11  b) **3**  c) 12
      > Acum y primește 2, deci 1 + 2 = 3.

:::verifica-cod
Scrie `inmultire(a, b=2)` care întoarce a·b. Afișează `inmultire(7)`, adică 7 înmulțit cu valoarea implicită.
template: def inmultire(a, b=___):
    return a * b

print(inmultire(7))
output: 14
:::
