# Modulul P8.3 — Listă de culori și for simplu

**Vârsta țintă:** 8 ani | Capitolul: Python pentru copii — 8 ani (clasa a II-a)
**Clasa:** P8 (Python pentru copii, 7–11 ani)

---

### 🔄 P8.3.1 Recapitulare

Până acum am stocat în variabile doar valori unice (un singur text sau un singur număr). În Python putem grupa mai multe valori întro structură numită **listă**.

:::exemplu
## Conectează la cunoștințele anterioare
O listă se scrie folosind paranteze pătrate, iar elementele sunt separate prin virgulă, ca o listă de cumpărături!
:::

---

### 💡 P8.3.2 Concept nou și exemplu

Creăm o listă cu **culori = ["rosu", "verde", "albastru"]**. Putem parcurge lista element cu element folosind o buclă **for** sau putem alege o valoare aleatorie folosind **random.choice()**.

:::exemplu
## Exemplu practic: Alegerea unei culori la întâmplare
```python
import random
culori = ["rosu", "verde", "albastru"]
culoare_aleasa = random.choice(culori)
print("Culoarea norocoasă este:", culoare_aleasa)
```
Acest cod folosește modulul random pentru a extrage o culoare din lista noastră.
:::

---

## Problemă rezolvată pas cu pas

**Enunț.** Pippy are o listă de cumpărături. Adaugă „lapte”, afișează câte lucruri sunt de cumpărat și apoi fiecare lucru pe rândul lui, numerotat.

**Ideea.** `append` pune un element nou la sfârșitul listei. `len` ne spune câte elemente sunt. Cu `for` luăm elementele pe rând, iar un contor ține numărul de ordine.

```python
cumparaturi = ["pâine", "mere", "ouă"]
cumparaturi.append("lapte")
print("De cumpărat:", len(cumparaturi), "lucruri")
nr = 1
for lucru in cumparaturi:
    print(nr, lucru)
    nr = nr + 1
```
Rezultatul:
```text
De cumpărat: 4 lucruri
1 pâine
2 mere
3 ouă
4 lapte
```

:::atentie
## Greșeli frecvente
- Crezi că primul element dintr-o listă e `lista[1]`. Ca la texte, numărăm de la 0.
- Uiți virgulele dintre elemente: `["rosu" "verde"]` lipește cele două texte într-unul singur.
- Scrii `lista.append("galben")` și apoi te aștepți la o listă nouă: `append` schimbă chiar lista ta.
:::

### 🔮 P8.3.3 Citește și prezice

Uită-te la codul de mai jos și ghicește ce va afișa calculatorul:

```python
culori = ["rosu", "verde", "albastru"]
print(len(culori))
```

Câte elemente sunt în lista noastră de culori?

:::atentie
## Atenție
Nu uita să scrii `import random` la începutul programului dacă vrei să folosești funcția de alegere la întâmplare!
:::

---

### 🤝 P8.3.4 Exerciții ghidate

**Exercițiul 1.** Afișează prima culoare din listă: rosu, verde, albastru.

---


Completează spațiile punctate pentru a finaliza algoritmul:

```python
import random
culori = ["rosu", "verde", "albastru"]

# Alege o culoare la întâmplare din listă
culoare_aleasa = random.___(___)
print(culoare_aleasa)
```


### 🎯 P8.3.5 Exerciții independente

**Exercițiul 1.** Adaugă culoarea 'galben' în listă folosind append și afișează lungimea noii liste.

---

### ✅ P8.3.6 Verifică-ți înțelegerea

1. Cum se scrie o listă în Python?
   a) {1, 2}  b) **[1, 2, 3]**  c) (1, 2)
      > O listă se scrie cu paranteze pătrate, cu elementele despărțite prin virgulă, ca lista noastră de culori.

2. Ce funcție folosești pentru a alege un element aleatoriu dintr-o listă?
   a) random.rand()  b) **random.choice()**  c) random.select()
      > random.choice() este funcția care alege singură un element la întâmplare dintr-o listă, ca atunci când am ales o culoare norocoasă.

3. Cum adaugi un element la sfârșitul unei liste?
   a) add()  b) **append()**  c) push()
      > Metoda append() adaugă un element nou chiar la finalul listei, așa cum am adăugat culoarea galben.

4. Ce afișează `print(["a", "b", "c"][2])`?
   a) b  b) **c**  c) Eroare
      > Pozițiile sunt 0, 1, 2; la poziția 2 e "c".

5. Câte elemente are lista după `L = [1, 2]` și `L.append(3)`?
   a) 2  b) **3**  c) 1
      > `append` adaugă un element la final.

:::verifica-cod
Adaugă „pisică” în lista de animale și afișează lista întreagă.
template: animale = ["câine", "pește"]
animale.___("pisică")
print(animale)
output: ['câine', 'pește', 'pisică']
:::
