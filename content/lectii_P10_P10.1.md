# Modulul P10.1 — Condiții if/elif/else

**Vârsta țintă:** 10 ani | Capitolul: Python pentru copii — 10 ani (clasa a IV-a)
**Clasa:** P10 (Python pentru copii, 7–11 ani)

---

### 🔄 P10.1.1 Recapitulare

Pentru a scrie programe inteligente, calculatorul trebuie să poată lua decizii singur. In acest modul învățăm cum să punem condiții codului nostru.

:::exemplu
## Conectează la cunoștințele anterioare
Folosim blocul `if` pentru a verifica dacă o condiție este adevărată, iar dacă nu este, putem folosi `elif` și `else`.
:::

---

### 💡 P10.1.2 Concept nou și exemplu

Folosim operatori de comparație cum ar fi **==** (egal), **>** (mai mare) sau **<** (mai mic). Putem folosi și **in** pentru a verifica dacă un element se află într-o listă.

:::exemplu
## Exemplu practic: Verificarea accesului
```python
varsta = 10
if varsta >= 12:
    print("Acces permis la filmul 12+")
elif varsta >= 8:
    print("Acces permis la filmul 8+")
else:
    print("Acces doar la desene animate")
```
Codul verifică vârsta și afișează mesajul corespunzător.
:::

---

## Problemă rezolvată pas cu pas

**Enunț.** Un parc de distracții are reguli: sub 6 ani intri gratuit, de la 6 la 13 ani biletul costă 15 lei, iar de la 14 ani, 25 de lei. Calculăm prețul pentru o familie cu vârstele 4, 9 și 40.

**Ideea.** Pentru fiecare vârstă alegem prețul cu `if`/`elif`/`else`, verificând de la cea mai mică vârstă la cea mai mare, și adunăm prețurile.

```python
def pret_bilet(varsta):
    if varsta < 6:
        return 0
    elif varsta <= 13:
        return 15
    else:
        return 25

total = 0
for v in [4, 9, 40]:
    print(v, "ani:", pret_bilet(v), "lei")
    total += pret_bilet(v)
print("Total:", total, "lei")
```
Rezultatul:
```text
4 ani: 0 lei
9 ani: 15 lei
40 ani: 25 lei
Total: 40 lei
```

:::atentie
## Greșeli frecvente
- Scrii `if x = 5:` în loc de `if x == 5:`.
- Pui `elif` după `else`: `else` trebuie să fie mereu ultimul.
- Scrii `if 3 < x < 8` corect, dar `if x > 3 and < 8` greșit: fiecare comparație are nevoie de ambele părți.
:::

### 🔮 P10.1.3 Citește și prezice

Uită-te la codul de mai jos și ghicește rezultatul:

```python
punctaj = 85
if punctaj >= 90:
    print("Excelent")
elif punctaj >= 80:
    print("Foarte Bine")
else:
    print("Bine")
```

Ce mesaj se va afișa pe ecran?

:::atentie
## Atenție
Fii atent la semnele de două puncte (:) de la sfârșitul liniilor cu if, elif și else!
:::

---

### 🤝 P10.1.4 Exerciții ghidate

**Exercițiul 1.** Completează condiția pentru a verifica dacă numărul este par.

---


Completează spațiile punctate pentru a finaliza algoritmul:

```python
varsta = 9

___ varsta >= 12:
    print("Acces permis la filmul 12+")
___:
    print("Acces doar la desene animate")
```


### 🎯 P10.1.5 Exerciții independente

**Exercițiul 1.** Verifică dacă culoarea 'rosu' se află în lista ["rosu", "verde"].

---

### ✅ P10.1.6 Verifică-ți înțelegerea

1. Ce operator verifică dacă două valori sunt egale?
   a) =  b) **==**  c) ===
      > Semnul == compară două valori și ne spune dacă sunt egale, spre deosebire de semnul = care doar pune o valoare într-o variabilă.

2. Când se execută instrucțiunea de pe ramura else?
   a) Când condiția if este adevărată  b) **Când toate condițiile anterioare sunt false**  c) Întotdeauna
      > Ramura else se execută abia atunci când niciuna dintre condițiile de la if și elif nu a fost adevărată.

3. Ce operator verifică dacă o valoare se află într-o listă?
   a) has  b) **in**  c) inside
      > Cuvântul in verifică rapid dacă o valoare se găsește printre elementele unei liste, fără să o cauți tu manual.

4. Ce întoarce `5 != 5`?
   a) True  b) **False**  c) 5
      > `!=` înseamnă „diferit”; 5 nu e diferit de 5.

5. Ce afișează `print("b" in ["a", "b"])`?
   a) False  b) **True**  c) b
      > `in` verifică dacă elementul se găsește în listă.

:::verifica-cod
Afișează „Vacanță!” dacă luna e 7 sau 8, altfel „Școală”. Luna este 8.
template: luna = 8
if ___:
    print("Vacanță!")
else:
    print("Școală")
output: Vacanță!
:::
