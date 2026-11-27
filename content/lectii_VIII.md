# Conținut lecții — Clasa a VIII-a (gimnaziu), Modulele VIII.1–VIII.2

Respectă exact structura de pe `academiapython.ro/curriculum/VIII` — 6 sublecții per modul, aceleași etichete/iconuri ca la liceu. Continuă firul de la clasa a VII-a (cele trei structuri fundamentale de control) și pregătește direct tranziția la clasa a IX-a, unde algoritmii de bază pe șiruri de valori sunt presupuși deja cunoscuți.

---

# Modulul VIII.1 — Șiruri de valori: identificare și generare

### 🔄 VIII.1.1 Recapitulare

În clasa a VII-a ai învățat cele trei structuri fundamentale — secvențială, alternativă, repetitivă — și cum se combină. Structura repetitivă, în particular, e cheia modulului de azi: de fiecare dată când o buclă generează, pas cu pas, o serie de valori care respectă o regulă, obții un **șir de valori**.

### 💡 VIII.1.2 Concept nou și exemplu

Un **șir de valori** e o succesiune de numere care respectă o regulă — poate fi o proprietate (toate numerele pare dintr-un interval) sau o formulă de recurență (fiecare termen depinde de cel/cei anteriori, ca la șirul lui Fibonacci: `f(n) = f(n-1) + f(n-2)`).

```python
# Numerele de două cifre divizibile cu 3
for n in range(10, 100):
    if n % 3 == 0:
        print(n)
```

:::exemplu
## De unde vine acest șir
Bucla `for` parcurge, pe rând, fiecare număr de la 10 la 99. Condiția `if n % 3 == 0` verifică, la fiecare pas, dacă numărul curent respectă regula (restul împărțirii la 3 e zero). Doar numerele care trec testul sunt afișate — restul sunt pur și simplu sărite.
:::

Alteori, șirul nu se filtrează dintr-un interval, ci se **construiește** termen cu termen, pornind de la valori inițiale:

```python
# Șirul lui Fibonacci, primii 10 termeni
a, b = 0, 1
for _ in range(10):
    print(a)
    a, b = b, a + b
```

:::atentie
## Inițializarea termenilor contează
La un șir de recurență (ca Fibonacci), primii termeni (`a, b = 0, 1`) nu sunt aleși la întâmplare — sunt chiar definiția șirului. Dacă îi schimbi, obții un alt șir, cu aceeași regulă de calcul dar cu alte valori. Verifică mereu, înainte de a scrie codul, care sunt exact primii termeni ceruți de problemă.
:::

## Problemă rezolvată pas cu pas

**Enunț.** O progresie aritmetică pornește de la 5 și crește cu 3 la fiecare pas. Afișăm primii 8 termeni și verificăm suma lor cu formula S = n·(a₁ + aₙ) / 2.

**Ideea.** Construim termenii unul câte unul, adunând rația. Suma o calculăm în timp ce generăm, apoi o comparăm cu formula, ca verificare.

```python
termen = 5
ratie = 3
suma = 0
for i in range(8):
    print(termen, end=" ")
    suma += termen
    ultimul = termen
    termen += ratie
print()
print("Suma:", suma, "| Formula:", 8 * (5 + ultimul) // 2)
```
Rezultatul:
```text
5 8 11 14 17 20 23 26 
Suma: 124 | Formula: 124
```

:::atentie
## Greșeli frecvente
- Pornești `range` de la 0 când șirul cere numere de la 1 sau de două cifre (de la 10).
- La Fibonacci actualizezi `a` și `b` pe rânduri separate (`a = b`, apoi `b = a + b`) și pierzi vechea valoare a lui `a`. Scrie `a, b = b, a + b`.
- Numeri termenii greșit: afișezi un termen în plus sau în minus. Verifică pe primii 3 termeni, de mână.
- Confunzi „primii n termeni” cu „termenii mai mici decât n”: primul caz cere `for`, al doilea, de obicei, `while`.
:::

### 🔮 VIII.1.3 Citește și prezice

Uită-te la codul de mai jos, **fără să-l rulezi**, și scrie pe hârtie primii 5 termeni pe care crezi că îi afișează:

```python
a, b = 1, 1
for _ in range(5):
    print(a)
    a, b = b, a + b
```

Verifică-ți predicția mental, pas cu pas: la fiecare iterație, ce valoare are `a` chiar înainte de `print(a)`?

### 🤝 VIII.1.4 Exerciții ghidate

**Exercițiul 1.** Completează codul care generează primele 10 numere pare:

```python
for i in range(1, ___):
    print(___)
```

**Exercițiul 2.** O plantă crește 2 cm pe săptămână. Scrie un program care afișează înălțimea ei în fiecare din primele 10 săptămâni, pornind de la 0 cm.

### 🎯 VIII.1.5 Exerciții independente

**Exercițiul 1.** Generează șirul lui Fibonacci pentru primii `n` termeni, unde `n` e citit de la tastatură.

**Exercițiul 2.** Generează șirul numerelor de trei cifre divizibile atât cu 3, cât și cu 5.

### ✅ VIII.1.6 Verifică-ți înțelegerea

1. Ce este un șir de valori?
   a) Un singur număr  b) **O succesiune de numere care respectă o regulă**  c) Un mesaj de eroare
      > Un șir de valori e definit tocmai prin regula pe care o respectă fiecare termen — fie o proprietate (ex. „toate numerele pare”), fie o formulă de recurență care leagă un termen de cei anteriori.

2. La șirul lui Fibonacci, de ce contează valorile inițiale ale lui `a` și `b`?
   a) Nu contează, șirul iese la fel oricum  b) **Pentru că definesc primii termeni ai șirului**  c) Doar pentru viteza programului
      > Formula `f(n) = f(n-1) + f(n-2)` are nevoie de doi termeni de pornire ca să poată calcula restul — schimbarea lor produce un cu totul alt șir de numere.

3. Ce diferență există între „a genera un șir cu o regulă” și „a citi un șir de la tastatură”?
   a) Sunt exact același lucru  b) **La generare, valorile se calculează; la citire, valorile vin de la utilizator**  c) Generarea funcționează doar cu `while`
      > La generare, codul calculează singur fiecare termen după o regulă (fără input); la citire, valorile sunt introduse de la tastatură, una câte una — asta e tema modulului următor.

4. Care e regula șirului 2, 4, 8, 16, 32, ...?
   a) Se adună 2 la fiecare pas  b) **Fiecare termen e dublul celui anterior**  c) Se scade 2 la fiecare pas
      > Fiecare termen din acest șir se obține înmulțind termenul anterior cu 2 — de la 2 la 4, de la 4 la 8, și tot așa.

5. Care e al 6-lea termen al șirului 1, 1, 2, 3, 5, …?
   a) 7  b) **8**  c) 6
      > Fiecare termen e suma celor doi dinainte: 3 + 5 = 8.

6. Ce șir generează `for n in range(3, 20, 4): print(n)`?
   a) 3, 4, 5, …  b) **3, 7, 11, 15, 19**  c) 4, 8, 12, 16
      > Pornește de la 3 și adună 4 până depășește limita 20 (exclusă).

:::verifica-cod
Scrie un program care afișează, folosind o buclă `for`, primele 5 puteri ale lui 2, pornind de la 2^0. Demo: se afișează 1, 2, 4, 8, 16, fiecare pe rândul lui.
template: putere = 1
for _ in range(5):
    print(putere)
    putere = ___
output: 1
2
4
8
16
:::

---

# Modulul VIII.2 — Algoritmi de prelucrare a șirurilor de valori

### 🔄 VIII.2.1 Recapitulare

În modulul trecut ai generat șiruri de valori direct cu bucla — codul calcula singur fiecare termen. Azi înveți ce se întâmplă când șirul **nu îl generezi tu**, ci vine de la utilizator, valoare cu valoare — și cum extragi informații utile din el (câte sunt, cât e suma, care e cel mai mare).

### 💡 VIII.2.2 Concept nou și exemplu

Când numărul de valori nu e fix dinainte, se citește întâi `n` (câte valori urmează), apoi se parcurg valorile una câte una într-o buclă, actualizând la fiecare pas o variabilă „acumulator”:

```python
n = int(input("Câte numere introduci? "))
suma = 0
maxim = None

for i in range(n):
    x = int(input("Numărul " + str(i + 1) + ": "))
    suma += x
    if maxim is None or x > maxim:
        maxim = x

print("Suma este", suma)
print("Cel mai mare număr este", maxim)
```

:::exemplu
## Cum funcționează „acumulatorul”
`suma` pornește de la 0 — o „cutie goală” în care adunăm, la fiecare pas al buclei, numărul citit (`suma += x`). `maxim` pornește de la `None` (adică „încă nu știm”) și, la fiecare pas, se actualizează doar dacă numărul curent e mai mare decât ce aveam deja reținut.
:::

:::atentie
## De ce `maxim` nu pornește de la 0
Dacă toate numerele citite sunt negative, un `maxim` care pornește de la 0 ar rămâne greșit la 0 — pentru că niciun număr negativ nu trece testul „e mai mare decât 0”. De asta inițializăm `maxim` cu **prima valoare citită** (aici, folosind `None` ca semnal „încă nu am citit nimic”), nu cu 0.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Temperaturile unei săptămâni sunt -2, 3, 7, -5, 4, 0, 6. Aflăm temperatura maximă și minimă, ziua (numărul ei) în care a fost cel mai frig și câte zile au avut temperaturi negative.

**Ideea.** Parcurgem o singură dată șirul. Maximul și minimul pornesc de la primul element, nu de la 0. Ținem minte și poziția minimului, iar un contor numără valorile negative.

```python
temp = [-2, 3, 7, -5, 4, 0, 6]
maxim = minim = temp[0]
zi_minim = 1
negative = 0
for i in range(len(temp)):
    t = temp[i]
    if t > maxim:
        maxim = t
    if t < minim:
        minim = t
        zi_minim = i + 1
    if t < 0:
        negative += 1
print("Maxim:", maxim, "| Minim:", minim, "în ziua", zi_minim)
print("Zile cu temperaturi negative:", negative)
```
Rezultatul:
```text
Maxim: 7 | Minim: -5 în ziua 4
Zile cu temperaturi negative: 2
```

:::atentie
## Greșeli frecvente
- Pornești `maxim` de la 0: dacă toate valorile sunt negative, rezultatul e greșit.
- Împarți suma la un număr fix în loc de numărul real de valori (`len(numere)` sau contorul).
- Calculezi media într-un șir fără elemente: apare împărțire la zero. Verifică întâi că ai cel puțin o valoare.
- Numeri cu `contor = contor + 1` în afara lui `if`: numeri toate valorile, nu doar pe cele care respectă condiția.
:::

### 🔮 VIII.2.3 Citește și prezice

Uită-te la codul de mai jos, **fără să-l rulezi**, și scrie ce crezi că se afișează pentru numerele 3, 7, 2:

```python
numere = [3, 7, 2]
suma = 0
for x in numere:
    suma += x

print("Suma este", suma)
print("Media este", suma / len(numere))
```

Ai scris predicția? Verific-o mental: cât fac 3 + 7 + 2, și cât e media celor trei numere?

### 🤝 VIII.2.4 Exerciții ghidate

**Exercițiul 1.** Completează algoritmul care numără câte din valorile citite sunt pozitive:

```python
n = int(input("Câte numere introduci? "))
contor = 0

for i in range(n):
    x = int(input("Numărul: "))
    if ___:
        contor += 1

print("Numere pozitive:", contor)
```

**Exercițiul 2.** Scrie un program care citește `n` numere și afișează cel mai mic dintre ele (folosește același model ca la `maxim`, dar invers).

### 🎯 VIII.2.5 Exerciții independente

**Exercițiul 1.** Citește `n` numere și afișează suma și media lor.

**Exercițiul 2.** Citește `n` numere și afișează cel mai mare număr **par** dintre cele citite (combină structura alternativă, repetitivă și acumularea într-un singur algoritm).

### ✅ VIII.2.6 Verifică-ți înțelegerea

1. Cu ce valoare trebuie inițializat un acumulator folosit pentru sumă?
   a) Cu prima valoare citită  b) **Cu 0**  c) Cu 1
      > Suma pornește corect de la 0, pentru că adunarea a 0 cu orice număr nu schimbă rezultatul — e „elementul neutru” pentru adunare.

2. De ce inițializăm variabila `maxim` cu prima valoare citită, și nu cu 0?
   a) Nu contează cu ce pornește  b) **Pentru că, dacă toate valorile sunt negative, un `maxim` pornit de la 0 ar rămâne greșit**  c) Pentru că Python obligă la asta
      > Un maxim pornit de la 0 „ar câștiga” în fața oricărui număr negativ fără să fie comparat corect — de aceea maximul se inițializează fie cu prima valoare citită, fie cu `None`, ca semnal că încă n-a fost stabilit.

3. Câte citiri de la tastatură face codul de mai sus, dacă `n` este 5?
   a) 4  b) 6  c) **Exact 5**
      > Bucla `for i in range(n)` se execută de exact `n` ori — pentru `n = 5`, se citesc exact 5 numere, nici mai puține, nici mai multe.

4. Ce s-ar întâmpla dacă inițializăm un acumulator pentru **produs** cu 0, în loc de 1?
   a) Nu se schimbă nimic  b) **Rezultatul final ar fi întotdeauna 0**  c) Programul ar da eroare
      > Orice număr înmulțit cu 0 rămâne 0 — dacă produsul pornește de la 0, rezultatul final e mereu 0, indiferent ce valori sunt înmulțite pe parcurs. De aceea produsul se inițializează cu 1, „elementul neutru” pentru înmulțire.

5. Cu ce valoare pornește o variabilă în care calculezi un produs?
   a) 0  b) **1**  c) None
      > Dacă ar porni de la 0, orice înmulțire ar da tot 0.

6. Ce valoare are `contor` după ce parcurgi [4, -1, 6, -3] numărând valorile pozitive?
   a) 4  b) **2**  c) 1
      > Doar 4 și 6 sunt pozitive.

:::verifica-cod
Scrie un program care citește 3 numere de la tastatură și afișează suma lor. Demo: se introduc 4, 5, 6 -> se afișează 15.
template: suma = 0
for i in range(3):
    x = int(input("Numărul: "))
    suma = ___

print("Suma este", suma)
output: Suma este 15
:::
