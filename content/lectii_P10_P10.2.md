# Modulul P10.2 — Bucla while și break/continue

**Vârsta țintă:** 10 ani | Capitolul: Python pentru copii — 10 ani (clasa a IV-a)
**Clasa:** P10 (Python pentru copii — ages 7-11)

---

### 🔄 P10.2.1 Recapitulare

Bucla for rulează de un număr fix de ori. Dar ce facem dacă vrem să repetăm o acțiune până când se întâmplă ceva (de exemplu, un jucător pierde toate viețile)? Folosim bucla **while**.

:::exemplu
## Conectează la cunoștințele anterioare
Bucla while continuă să ruleze atâta timp cât o condiție este Adevărată (True).
:::

---

### 💡 P10.2.2 Concept nou si exemplu

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
# Pasul 1: declarare date
val1 = 15
val2 = 30

# Pasul 2: calcul
total = ___ + ___  # Completează variabilele
print("Total:", ___)
```


### 🎯 P10.2.5 Exerciții independente

**Exercițiul 1.** Folosește continue pentru a sări peste afișarea numărului 2.

---

### ✅ P10.2.6 Verifică-ți înțelegerea

1. Când rulează o buclă while?
   a) O singură dată  b) **Cât timp condiția ei este adevărată**  c) Până dă eroare

2. Ce face instrucțiunea break?
   a) Repornește calculatorul  b) **Oprește imediat execuția buclei**  c) Sare la următorul pas

3. Cum evităm o buclă infinită?
   a) Folosind print  b) **Modificând condiția în interiorul buclei ca să devină falsă la un moment dat**  c) Închizând editorul

---

(by @python-pentru-copii — vârstă țintă: 10 ani)
