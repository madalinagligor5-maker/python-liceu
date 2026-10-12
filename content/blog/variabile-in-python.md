---
titlu: Variabile în Python: explicații simple, tipuri de date și exemple
titlu_seo: Variabile în Python: explicații și exemple
slug: variabile-in-python
data: 2026-10-12
descriere: Ce este o variabilă în Python, cum o creezi, ce tipuri de date există (int, float, str, bool), conversii și greșeli frecvente.
---

O **variabilă** în Python este un nume care ține minte o valoare, ca o cutie cu etichetă. O creezi printr-o atribuire: scrii numele, semnul `=` și valoarea. De exemplu, `varsta = 15` pune valoarea 15 în variabila `varsta`. Mai jos găsești tot ce îți trebuie ca să folosești corect variabilele, cu exemple pe care le poți rula.

## Cum creezi o variabilă

```python
nume = "Ana"
varsta = 15
inaltime = 1.62

print(nume)
print(varsta)
print(inaltime)
```

Rezultatul:

```text
Ana
15
1.62
```

În Python nu declari tipul variabilei înainte. Tipul se stabilește automat, după valoarea pe care o primește variabila.

## Semnul `=` nu înseamnă „egal”

În matematică, `x = x + 1` e o ecuație fără soluție. În Python înseamnă: **ia valoarea curentă a lui `x`, adaugă 1 și pune rezultatul înapoi în `x`**. De aceea `=` se citește „primește” sau „atribuie”.

```python
puncte = 10
puncte = puncte + 5
print(puncte)
```

Programul afișează `15`. O formă prescurtată, cu același efect, este `puncte += 5`.

Pentru a **compara** două valori folosești `==` (două semne egal). Despre comparații afli mai multe în [ghidul despre if în Python](/blog/if-elif-else-in-python).

## Tipurile de date de bază

| Tip | Ce reține | Exemplu |
| --- | --- | --- |
| `int` | numere întregi | `varsta = 15` |
| `float` | numere cu zecimale | `media = 9.25` |
| `str` | text (șir de caractere) | `oras = "Cluj"` |
| `bool` | adevărat sau fals | `promovat = True` |

Poți afla tipul unei valori cu funcția `type()`:

```python
print(type(15))
print(type(9.25))
print(type("Cluj"))
print(type(True))
```

Rezultatul:

```text
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
```

## Reguli pentru numele variabilelor

- Pot conține litere, cifre și `_`, dar **nu pot începe cu o cifră**: `nota1` e corect, `1nota` nu.
- **Nu pot conține spații**: scrie `nota_finala`, nu `nota finala`.
- **Literele mari și mici contează**: `Varsta` și `varsta` sunt două variabile diferite.
- Nu poți folosi cuvinte rezervate ale limbajului, precum `if`, `for`, `while` sau `def`.
- Alege nume care spun ce conțin: `pret_total` e mai clar decât `x`.

Diacriticele sunt permise tehnic în nume, dar cele mai multe ghiduri de stil recomandă să le eviți. Ele sunt însă perfect în regulă în **text**, între ghilimele.

## Citirea unei valori de la tastatură

Funcția `input()` citește ce scrie utilizatorul și întoarce **întotdeauna text**. Ca să faci calcule, transformi textul în număr cu `int()` sau `float()`.

```python
nota1 = int(input("Prima notă: "))
nota2 = int(input("A doua notă: "))
media = (nota1 + nota2) / 2
print("Media este", media)
```

Dacă utilizatorul introduce 8 și 10, programul afișează `Media este 9.0`. Împărțirea cu `/` dă mereu un număr cu zecimale, chiar și când rezultatul e întreg.

## Conversii între tipuri

```python
text = "25"
numar = int(text)
print(numar + 5)

pret = 19.99
print(str(pret) + " lei")

print(int(7.9))
```

Rezultatul:

```text
30
19.99 lei
7
```

Atenție: `int(7.9)` dă `7`, nu `8`. Funcția taie partea zecimală, nu rotunjește. Pentru rotunjire folosești `round(7.9)`, care dă `8`.

## Greșeli frecvente

**Adunarea dintre text și număr:**

```python
varsta = 15
print("Am " + varsta + " ani")
```

Python oprește programul cu `TypeError`, pentru că nu poate „aduna” text cu un număr. Ai două variante corecte:

```python
varsta = 15
print("Am " + str(varsta) + " ani")
print("Am", varsta, "ani")
print(f"Am {varsta} ani")
```

Toate trei liniile afișează `Am 15 ani`. Ultima variantă se numește **f-string** și e cea mai comodă când combini text cu valori.

**Folosirea unei variabile înainte să-i dai o valoare** produce `NameError`. Verifică dacă ai scris numele exact la fel peste tot, inclusiv literele mari și mici. Mai multe despre aceste mesaje găsești în [ghidul erorilor frecvente în Python](/blog/erori-frecvente-python).

## Exercițiu: încearcă singur

Scrie un program care reține lungimea și lățimea unei camere (de exemplu 4 și 3,5 metri) și afișează aria. Rezultatul așteptat pentru aceste valori este `14.0`. Testează apoi și cu 5 și 2 (rezultat așteptat: `10`).

Poți rula codul în [laboratorul Python din browser](/lab). Dacă vrei explicații pas cu pas, cu exerciții verificate automat, variabilele sunt prima temă din modulul gratuit [Primii pași în Python](/curriculum/VII/primii-pasi-in-python).

## Întrebări frecvente

### Ce este o variabilă în Python, pe scurt?

Este un nume care păstrează o valoare în memorie, ca să o poți folosi și modifica mai târziu în program. Se creează prin atribuire, de exemplu `nota = 9`.

### Trebuie să declar tipul unei variabile în Python?

Nu. Python stabilește singur tipul după valoarea atribuită. Aceeași variabilă poate primi ulterior o valoare de alt tip, deși e o practică bună să nu schimbi tipul fără motiv.

### De ce input() îmi dă text, chiar dacă scriu un număr?

Așa funcționează `input()`: întoarce mereu un șir de caractere. Ca să faci calcule, convertești rezultatul cu `int()` pentru numere întregi sau `float()` pentru numere cu zecimale.

### Care e diferența dintre = și == în Python?

`=` atribuie o valoare unei variabile, iar `==` compară două valori și întoarce `True` sau `False`. Confuzia dintre ele este una dintre cele mai frecvente greșeli ale începătorilor.
