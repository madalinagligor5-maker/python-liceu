# Modulul P10.2 — Bucla while și break/continue

**Vârsta țintă:** 10 ani | Capitolul: Python pentru copii — 10 ani (clasa a IV-a)
**Clasa:** P10 (Python pentru copii, 7–11 ani)

---

### 🔄 P10.2.1 Recapitulare

Bucla for rulează de un număr fix de ori. Dar ce facem dacă vrem să repetăm o acțiune până când se întâmplă ceva (de exemplu, un jucător pierde toate viețile)? Folosim bucla **while**.

:::exemplu
## Conectează la cunoștințele anterioare
Bucla while continuă să ruleze atâta timp cât o condiție este Adevărată (True).
:::

---

### 💡 P10.2.2 Concept nou și exemplu

Putem controla cursul buclelor folosind **break** (oprește imediat bucla) și **continue** (sare peste pasul curent și trece la următorul).

:::exemplu
## Exemplu practic: Numărătoare cu oprire
```python
numar = 1
while numar <= 5:
    if numar == 3:
        print("Am găsit 3! Oprim bucla.")
        break
    print("Numar:", numar)
    numar += 1
```
Acest program se va opri când 'numar' devine 3 datorită instrucțiunii break.
:::

---

## Problemă rezolvată pas cu pas

**Enunț.** Pippy caută prima cutie care conține o cheie, într-un șir de cutii. Sare peste cutiile goale și se oprește imediat ce găsește cheia.

**Ideea.** Parcurgem cutiile cu `for`. Dacă o cutie e goală, `continue` trece la următoarea. Când găsim cheia, o anunțăm și `break` oprește căutarea; cutiile de după nu mai sunt deschise.

```python
cutii = ["gol", "minge", "gol", "cheie", "carte"]
for i, continut in enumerate(cutii, 1):
    if continut == "gol":
        continue
    print("Cutia", i, "are:", continut)
    if continut == "cheie":
        print("Am găsit cheia!")
        break
```
Rezultatul:
```text
Cutia 2 are: minge
Cutia 4 are: cheie
Am găsit cheia!
```

:::atentie
## Greșeli frecvente
- Uiți să mărești contorul în `while`: bucla nu se mai oprește.
- Confunzi `break` (oprește toată bucla) cu `continue` (sare doar peste pasul curent).
- Pui `continue` înainte de `contor += 1` într-un `while`: contorul nu mai crește și bucla se blochează.
:::

### 🔮 P10.2.3 Citește și prezice

Uită-te la codul de mai jos și prezice rezultatul:

```python
numar = 1
while numar < 4:
    numar += 1
print(numar)
```

Ce se va afișa la final?

:::atentie
## Atenție
Dacă uiți să modifici variabila din interiorul buclei while (de exemplu, uitând numar += 1), bucla va rula la nesfârșit (buclă infinită)!
:::

---

### 🤝 P10.2.4 Exerciții ghidate

**Exercițiul 1.** Folosește break pentru a opri bucla când i ajunge la 2.

---


Completează spațiile punctate pentru a finaliza algoritmul:

```python
numar = 1
___ numar <= 5:
    if numar == 3:
        ___
    print("Numar:", numar)
    numar += 1
```


### 🎯 P10.2.5 Exerciții independente

**Exercițiul 1.** Folosește continue pentru a sări peste afișarea numărului 2.

---

### ✅ P10.2.6 Verifică-ți înțelegerea

1. Când rulează o buclă while?
   a) O singură dată  b) **Cât timp condiția ei este adevărată**  c) Până dă eroare
      > Bucla while continuă să repete instrucțiunile atâta timp cât condiția ei rămâne adevărată, apoi se oprește.

2. Ce face instrucțiunea break?
   a) Repornește calculatorul  b) **Oprește imediat execuția buclei**  c) Sare la următorul pas
      > break îi spune buclei să se oprească imediat, chiar dacă mai erau pași de făcut.

3. Cum evităm o buclă infinită?
   a) Folosind print  b) **Modificând condiția în interiorul buclei ca să devină falsă la un moment dat**  c) Închizând editorul
      > Ca bucla while să nu ruleze la nesfârșit, trebuie să modifici în interiorul ei ceva care să facă, la un moment dat, condiția falsă.

4. Ce afișează `for i in range(5): if i == 3: break; print(i)` (pe rânduri separate)?
   a) 0 1 2 3  b) **0 1 2**  c) 3 4
      > La i = 3, `break` oprește bucla înainte de `print`.

5. De câte ori se afișează „hei” în `n = 0` / `while n < 3: print("hei"); n += 1`?
   a) 2  b) **3**  c) La nesfârșit
      > n ia valorile 0, 1, 2; la 3 condiția e falsă.

:::verifica-cod
Afișează numerele de la 1 la 6, sărind peste 4, folosind `continue`.
template: for i in range(1, 7):
    if i == 4:
        ___
    print(i)
output: 1
2
3
5
6
:::
