# Modulul P10.3 — Funcții mai complexe

**Vârsta țintă:** 10 ani | Capitolul: Python pentru copii — 10 ani (clasa a IV-a)
**Clasa:** P10 (Python pentru copii — ages 7-11)

---

### 🔄 P10.3.1 Recapitulare

Am învățat să definim funcții simple. In acest modul, vom vedea cum putem folosi variabile globale și locale și cum să definim valori implicite pentru parametrii funcției.

:::exemplu
## Conectează la cunoștințele anterioare
Uneori vrem ca o funcție să funcționeze chiar dacă uităm să îi dăm o valoare la apelare. Pentru asta folosim valori predefinite.
:::

---

### 💡 P10.3.2 Concept nou si exemplu

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

---

(by @python-pentru-copii — vârstă țintă: 10 ani)
