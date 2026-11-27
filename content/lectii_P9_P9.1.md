# Modulul P9.1 — Bucla for în adâncime

**Vârsta țintă:** 9 ani | Capitolul: Python pentru copii — 9 ani (clasa a III-a)
**Clasa:** P9 (Python pentru copii, 7–11 ani)

---

### 🔄 P9.1.1 Recapitulare

Am folosit bucla for pentru a repeta acțiuni simple cu țestoasa sau pentru a trece prin listele de culori. Acum vom aprofunda cum putem genera secvențe de numere.

:::exemplu
## Conectează la cunoștințele anterioare
Bucla for are nevoie de o colecție pe care să o parcurgă. Dacă vrem să numărăm, folosim funcția specială **range()**.
:::

---

### 💡 P9.1.2 Concept nou și exemplu

Funcția **range(stop)** generează numere de la 0 până la stop (fără stop). Putem folosi și **enumerate()** pentru a obține atât indexul (poziția) cât și valoarea unui element dintr-o listă.

:::exemplu
## Exemplu practic: Numărătoarea și enumerarea
```python
for i in range(3):
    print("Număr:", i)

fructe = ["măr", "banană"]
for index, fruct in enumerate(fructe):
    print(f"La poziția {index} avem: {fruct}")
```
Acest cod va afișa numerele 0, 1, 2 și apoi fructele cu pozițiile lor 0 și 1.
:::

---

## Problemă rezolvată pas cu pas

**Enunț.** Facem clasamentul unui concurs: concurenții sunt deja în ordine. Afișăm locul fiecăruia, începând de la 1, și suma numerelor de la 1 la 10.

**Ideea.** `enumerate(lista, 1)` dă perechi (loc, nume) începând numărătoarea de la 1. Pentru sumă, `range(1, 11)` dă numerele 1…10, pe care le adunăm într-o variabilă.

```python
concurenti = ["Ana", "Dan", "Ema"]
for loc, nume in enumerate(concurenti, 1):
    print(f"Locul {loc}: {nume}")

suma = 0
for n in range(1, 11):
    suma += n
print("Suma 1..10 =", suma)
```
Rezultatul:
```text
Locul 1: Ana
Locul 2: Dan
Locul 3: Ema
Suma 1..10 = 55
```

:::atentie
## Greșeli frecvente
- Crezi că `range(5)` ajunge la 5. Se oprește la 4: dă 0, 1, 2, 3, 4.
- La `enumerate` inversezi perechea: întâi vine poziția, apoi valoarea (`for poz, val in enumerate(...)`).
- Vrei să numeri de la 1 și scrii `range(5)`: folosește `range(1, 6)`.
:::

### 🔮 P9.1.3 Citește și prezice

Uită-te la codul de mai jos și ghicește rezultatul:

```python
suma = 0
for i in range(3):
    suma += i
print(suma)
```

Ce se va afișa la final?

:::atentie
## Atenție
Funcția range(3) generează numerele 0, 1 și 2. Ea se oprește întotdeauna înainte de numărul limită!
:::

---

### 🤝 P9.1.4 Exerciții ghidate

**Exercițiul 1.** Folosește range pentru a afișa numerele de la 0 la 2.

---


Completează spațiile punctate pentru a finaliza algoritmul:

```python
fructe = ["măr", "banană", "pară"]

for index, fruct in ___(fructe):
    print(f"La poziția {index} avem: {___}")
```


### 🎯 P9.1.5 Exerciții independente

**Exercițiul 1.** Afișează indexul și valoarea din listă folosind enumerate pentru lista ["rosu", "verde"].

---

### ✅ P9.1.6 Verifică-ți înțelegerea

1. Ce numere generează range(4)?
   a) 1, 2, 3, 4  b) **0, 1, 2, 3**  c) 0, 1, 2, 3, 4
      > range(4) pornește mereu de la 0 și se oprește chiar înainte de 4, așa că numerele sunt 0, 1, 2, 3.

2. Ce returnează funcția enumerate()?
   a) Doar indexul  b) **Perechi de forma (index, valoare)**  c) Doar valoarea
      > enumerate() te ajută să afli deodată și locul unde stă un fruct în listă, și fructul în sine, ca o pereche (index, valoare).

3. Cum se termină range(5)?
   a) La 5  b) **La 4**  c) La 6
      > range(5) se oprește exact înainte de numărul limită, deci ultimul număr afișat este 4, nu 5.

4. Ce numere dă `range(2, 6)`?
   a) 2, 3, 4, 5, 6  b) **2, 3, 4, 5**  c) 3, 4, 5, 6
      > Pornește de la 2 și se oprește înainte de 6.

5. Ce dă `range(0, 10, 3)`?
   a) 0, 3, 6, 9, 12  b) **0, 3, 6, 9**  c) 3, 6, 9
      > Al treilea număr e pasul: din 3 în 3, fără să ajungă la 10.

:::verifica-cod
Afișează numerele pare de la 2 la 10 folosind `range` cu pasul 2.
template: for n in range(2, 11, ___):
    print(n)
output: 2
4
6
8
10
:::
