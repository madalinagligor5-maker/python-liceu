# Modulul P9.1 — Bucla for în adâncime

**Vârsta țintă:** 9 ani | Capitolul: Python pentru copii — 9 ani (clasa a III-a)
**Clasa:** P9 (Python pentru copii — ages 7-11)

---

### 🔄 P9.1.1 Recapitulare

Am folosit bucla for pentru a repeta acțiuni simple cu țestoasa sau pentru a trece prin listele de culori. Acum vom aprofunda cum putem genera secvențe de numere.

:::exemplu
## Conectează la cunoștințele anterioare
Bucla for are nevoie de o colecție pe care să o parcurgă. Dacă vrem să numărăm, folosim funcția specială **range()**.
:::

---

### 💡 P9.1.2 Concept nou si exemplu

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

### 🎯 P9.1.5 Exerciții independente

**Exercițiul 1.** Afișează indexul și valoarea din listă folosind enumerate pentru lista ["rosu", "verde"].

---

### ✅ P9.1.6 Verifică-ți înțelegerea

1. Ce numere generează range(4)?
   a) 1, 2, 3, 4  b) **0, 1, 2, 3**  c) 0, 1, 2, 3, 4

2. Ce returnează funcția enumerate()?
   a) Doar indexul  b) **Perechi de forma (index, valoare)**  c) Doar valoarea

3. Cum se termină range(5)?
   a) La 5  b) **La 4**  c) La 6

---

(by @python-pentru-copii — vârstă țintă: 9 ani)
