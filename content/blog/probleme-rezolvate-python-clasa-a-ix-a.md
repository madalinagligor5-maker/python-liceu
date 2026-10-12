---
titlu: 10 probleme rezolvate în Python pentru clasa a IX-a (cu explicații)
titlu_seo: Probleme rezolvate Python, clasa a IX-a
slug: probleme-rezolvate-python-clasa-a-ix-a
data: 2026-10-12
descriere: 10 probleme Python rezolvate pas cu pas: cifrele unui număr, divizori, numere prime, cmmdc cu Euclid, palindrom, minim și maxim. Cu teste pentru fiecare.
---

Mai jos găsești 10 probleme clasice de algoritmică, rezolvate în Python și explicate pas cu pas. Sunt genul de exerciții care apar la începutul liceului: lucrul cu cifrele unui număr, divizori, numere prime, cel mai mare divizor comun, liste. Pentru fiecare problemă ai soluția, ideea din spate și câteva teste cu rezultatul așteptat. Încearcă întâi singur, apoi compară.

## 1. Suma cifrelor unui număr

**Cerință:** calculează suma cifrelor unui număr natural.

```python
n = 4725
suma = 0
while n > 0:
    suma += n % 10
    n = n // 10
print(suma)
```

**Idee:** `n % 10` dă ultima cifră, iar `n // 10` o „taie”. Repeți până când n devine 0.

**Teste:** 4725 → 18; 9 → 9; 1000 → 1.

## 2. Inversul unui număr (oglinditul)

**Cerință:** construiește numărul cu cifrele în ordine inversă.

```python
n = 1234
invers = 0
while n > 0:
    invers = invers * 10 + n % 10
    n = n // 10
print(invers)
```

**Idee:** la fiecare pas, „împingi” cifrele deja adunate spre stânga (înmulțire cu 10) și adaugi ultima cifră a lui n.

**Teste:** 1234 → 4321; 500 → 5 (zerourile de la final dispar); 7 → 7.

## 3. Numărul este palindrom?

**Cerință:** verifică dacă un număr se citește la fel de la stânga la dreapta și invers.

```python
n = 12321
copie = n
invers = 0
while copie > 0:
    invers = invers * 10 + copie % 10
    copie = copie // 10
if invers == n:
    print("palindrom")
else:
    print("nu este palindrom")
```

**Idee:** refolosești problema 2 și compari inversul cu numărul inițial. Lucrezi pe o **copie**, ca să nu pierzi valoarea lui n.

**Teste:** 12321 → palindrom; 1231 → nu este palindrom; 8 → palindrom.

## 4. Divizorii unui număr

**Cerință:** afișează toți divizorii unui număr natural n.

```python
n = 36
for d in range(1, n + 1):
    if n % d == 0:
        print(d, end=" ")
```

**Idee:** d este divizor dacă restul împărțirii lui n la d este 0. Parametrul `end=" "` afișează divizorii pe același rând.

**Test:** 36 → `1 2 3 4 6 9 12 18 36`.

## 5. Numărul este prim?

**Cerință:** verifică dacă n este prim (are exact doi divizori: 1 și el însuși).

```python
n = 97
prim = n >= 2
d = 2
while d * d <= n and prim:
    if n % d == 0:
        prim = False
    d += 1
print("prim" if prim else "nu este prim")
```

**Idee:** e suficient să cauți divizori până la radicalul lui n. Dacă n ar avea un divizor mai mare decât radicalul, ar avea și unul mai mic, pe care l-ai fi găsit deja.

**Teste:** 97 → prim; 1 → nu este prim; 91 → nu este prim (7 · 13); 2 → prim.

## 6. Cel mai mare divizor comun (algoritmul lui Euclid)

**Cerință:** calculează cmmdc(a, b).

```python
a = 48
b = 36
while b != 0:
    a, b = b, a % b
print(a)
```

**Idee:** cmmdc(a, b) = cmmdc(b, a % b). Când restul devine 0, rezultatul este ultimul împărțitor nenul. Python are și o funcție gata făcută, `math.gcd(48, 36)`, dar la școală se cere de obicei algoritmul.

**Teste:** (48, 36) → 12; (17, 5) → 1; (100, 75) → 25.

## 7. Cel mai mic multiplu comun

**Cerință:** calculează cmmmc(a, b).

```python
a = 4
b = 6
x, y = a, b
while y != 0:
    x, y = y, x % y
cmmmc = a * b // x
print(cmmmc)
```

**Idee:** cmmmc(a, b) = a · b / cmmdc(a, b). Refolosești algoritmul lui Euclid pe copii ale lui a și b.

**Teste:** (4, 6) → 12; (5, 7) → 35; (12, 18) → 36.

## 8. Minimul și maximul dintr-o listă, fără min() și max()

**Cerință:** găsește cea mai mică și cea mai mare valoare dintr-o listă.

```python
numere = [14, 3, 27, 8, 19]
minim = numere[0]
maxim = numere[0]
for x in numere:
    if x < minim:
        minim = x
    if x > maxim:
        maxim = x
print(minim, maxim)
```

**Idee:** pornești cu primul element ca valoare provizorie și o înlocuiești când găsești una mai mică sau mai mare.

**Teste:** [14, 3, 27, 8, 19] → 3 27; [5] → 5 5; [-2, -9, -4] → -9 -2.

## 9. Media numerelor pare dintr-o listă

**Cerință:** calculează media aritmetică a numerelor pare din listă.

```python
numere = [3, 8, 5, 12, 7, 4]
suma = 0
cate = 0
for x in numere:
    if x % 2 == 0:
        suma += x
        cate += 1
if cate > 0:
    print(round(suma / cate, 2))
else:
    print("Nu există numere pare.")
```

**Idee:** o sumă și un contor, actualizate doar pentru elementele care îndeplinesc condiția. Verifici `cate > 0` ca să nu împarți la zero.

**Teste:** [3, 8, 5, 12, 7, 4] → 8.0; [1, 3, 5] → Nu există numere pare.; [2, 3] → 2.0.

## 10. Numărul de apariții ale fiecărei cifre

**Cerință:** afișează de câte ori apare fiecare cifră într-un număr.

```python
n = 1223338
frecventa = [0] * 10
while n > 0:
    frecventa[n % 10] += 1
    n = n // 10
for cifra in range(10):
    if frecventa[cifra] > 0:
        print(cifra, frecventa[cifra])
```

**Idee:** o listă de 10 contoare, câte unul pentru fiecare cifră de la 0 la 9. Cifra curentă este chiar poziția contorului pe care îl mărești. Tehnica se numește „vector de frecvență”.

**Test:** 1223338 → `1 1`, `2 2`, `3 3`, `8 1` (fiecare pe câte un rând).

## Cum să folosești aceste probleme ca să înveți

1. Citește cerința și **scrie pe hârtie** pașii, înainte de cod.
2. Încearcă singur cel puțin 10 minute.
3. Rulează soluția ta pe **toate testele** de mai sus. Dacă unul nu iese, ai găsit o greșeală — e un lucru bun.
4. Abia apoi compară cu soluția de aici. Nu există o singură soluție corectă.
5. Revino peste câteva zile și rezolvă problema din nou, fără să te uiți.

Testele te ajută să găsești greșelile, dar nu dovedesc că o soluție e corectă pentru orice date. De aceea includ și cazuri-limită: un număr cu o singură cifră, o listă cu un singur element, numărul 1 la testul de primalitate.

Rulează soluțiile în [laboratorul Python din browser](/lab). Pe Academia Python, temele de mai sus sunt explicate pas cu pas în modulele clasei a IX-a, de exemplu [Prelucrarea cifrelor unui număr](/curriculum/IX/prelucrarea-cifrelor-unui-numar) și [Divizori, multipli, algoritmul lui Euclid](/curriculum/IX/divizori-multipli-algoritmul-lui-euclid). Primele module ale clasei a IX-a sunt gratuite: [începe aici](/curriculum/IX/ce-este-un-algoritm-etapele-elaborarii-unui-program).

## Întrebări frecvente

### Care e diferența dintre / și // în Python?

`/` face împărțirea obișnuită și dă mereu un număr cu zecimale (`7 / 2` dă `3.5`). `//` face împărțirea întreagă și păstrează doar partea întreagă (`7 // 2` dă `3`). La problemele cu cifre folosești `//`.

### Ce face operatorul % în Python?

Dă restul împărțirii. De exemplu, `17 % 5` dă `2`. E folosit pentru a afla ultima cifră a unui număr (`n % 10`) sau pentru a verifica divizibilitatea (`n % d == 0`).

### Pot folosi funcțiile gata făcute, precum math.gcd sau max?

În programe obișnuite, da. La școală sau la olimpiadă însă ți se cere adesea să scrii algoritmul singur, ca să arăți că îl înțelegi. E bine să știi ambele variante.

### De unde știu dacă soluția mea e bună, dacă diferă de cea de aici?

Rulează-o pe toate testele, inclusiv pe cazurile-limită. Dacă dă rezultatele așteptate și o poți explica pas cu pas, e o soluție validă, chiar dacă e scrisă altfel.
