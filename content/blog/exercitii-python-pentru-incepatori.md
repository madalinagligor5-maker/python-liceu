---
titlu: 15 exerciții Python pentru începători, cu rezolvări explicate
titlu_seo: Exerciții Python pentru începători, cu rezolvări
slug: exercitii-python-pentru-incepatori
data: 2026-11-17
descriere: 15 exerciții Python pentru începători, de la print și variabile la if, for, while, liste, stringuri și funcții. Fiecare are rezolvare, explicație și rezultat.
---

Cel mai repede înveți Python scriind cod, nu doar citind. Mai jos ai 15 exerciții pentru începători, în ordinea în care apar de obicei noțiunile: afișare și variabile, decizii cu `if`, bucle `for` și `while`, stringuri, liste, dicționare și funcții. Fiecare are cerința, o rezolvare, ideea din spate și rezultatul pe care trebuie să-l obții.

Cum să lucrezi cu ele: citește cerința, încearcă singur în [laboratorul Python online](/lab) și abia apoi deschide rezolvarea. Dacă te blochezi la o noțiune, ghidurile despre [variabile](/blog/variabile-in-python), [if, elif, else](/blog/if-elif-else-in-python), [bucla for](/blog/bucla-for-si-range-in-python), [liste](/blog/liste-in-python) și [funcții](/blog/functii-in-python) o explică de la zero.

## Afișare și variabile

### 1. Prezintă-te

**Cerință:** salvează numele și vârsta ta în două variabile și afișează o propoziție cu ele.

```python
nume = "Ana"
varsta = 15
print("Mă numesc", nume, "și am", varsta, "ani.")
```

**Idee:** `print` primește mai multe valori separate prin virgulă și pune automat câte un spațiu între ele.

**Rezultat:** `Mă numesc Ana și am 15 ani.`

### 2. Aria și perimetrul unui dreptunghi

**Cerință:** pentru un dreptunghi cu lungimea 8 și lățimea 5, calculează aria și perimetrul.

```python
lungime = 8
latime = 5
aria = lungime * latime
perimetrul = 2 * (lungime + latime)
print("Aria:", aria)
print("Perimetrul:", perimetrul)
```

**Idee:** fiecare rezultat intermediar primește o variabilă cu nume clar. Parantezele contează: fără ele, `2 * lungime + latime` ar da 21, nu 26.

**Rezultat:** `Aria: 40` și `Perimetrul: 26`.

### 3. Câte ore și minute?

**Cerință:** transformă 135 de minute în ore și minute.

```python
minute_total = 135
ore = minute_total // 60
minute = minute_total % 60
print(ore, "ore și", minute, "minute")
```

**Idee:** `//` este împărțirea întreagă (câtul), iar `%` dă restul. Perechea aceasta apare în foarte multe probleme.

**Rezultat:** `2 ore și 15 minute`

### 4. Media a trei note, cu două zecimale

**Cerință:** calculează media notelor 9, 8 și 10 și afișeaz-o cu două zecimale.

```python
n1 = 9
n2 = 8
n3 = 10
media = (n1 + n2 + n3) / 3
print(f"Media: {media:.2f}")
```

**Idee:** `/` dă mereu un număr cu zecimale. În f-string, `:.2f` rotunjește afișarea la două zecimale.

**Rezultat:** `Media: 9.00`

**Varianta cu date de la tastatură:** `n1 = int(input())` și la fel pentru celelalte. `input()` întoarce text, de aceea îl transformi în număr cu `int()`.

## Decizii cu if

### 5. Par sau impar

**Cerință:** afișează dacă numărul 17 este par sau impar.

```python
n = 17
if n % 2 == 0:
    print(n, "este par")
else:
    print(n, "este impar")
```

**Idee:** un număr e par dacă restul împărțirii la 2 este 0. Atenție la `==` (comparație), nu `=` (atribuire).

**Rezultat:** `17 este impar`

### 6. Cel mai mare dintre trei numere

**Cerință:** afișează cel mai mare dintre numerele 12, 45 și 30, fără funcția `max`.

```python
a = 12
b = 45
c = 30
maxim = a
if b > maxim:
    maxim = b
if c > maxim:
    maxim = c
print("Maximul este", maxim)
```

**Idee:** pornești de la presupunerea că primul e cel mai mare și o corectezi când găsești ceva mai mare. Același tipar merge pentru o listă întreagă.

**Rezultat:** `Maximul este 45`

### 7. Calificativul

**Cerință:** pentru un punctaj între 0 și 100, afișează: „Foarte bine” de la 90 în sus, „Bine” de la 70, „Suficient” de la 50, altfel „Insuficient”.

```python
punctaj = 76
if punctaj >= 90:
    print("Foarte bine")
elif punctaj >= 70:
    print("Bine")
elif punctaj >= 50:
    print("Suficient")
else:
    print("Insuficient")
```

**Idee:** condițiile se verifică de sus în jos și se execută doar prima adevărată. De aceea pragurile merg de la cel mai mare la cel mai mic.

**Rezultat:** `Bine`

## Bucle for și while

### 8. Tabla înmulțirii cu 7

**Cerință:** afișează tabla înmulțirii cu 7, de la 7 × 1 la 7 × 10.

```python
for i in range(1, 11):
    print(7, "x", i, "=", 7 * i)
```

**Idee:** `range(1, 11)` dă numerele de la 1 la 10. Ultima valoare din `range` nu este inclusă.

**Rezultat:** zece rânduri, de la `7 x 1 = 7` până la `7 x 10 = 70`.

### 9. Suma numerelor de la 1 la 100

**Cerință:** calculează suma 1 + 2 + … + 100.

```python
suma = 0
for i in range(1, 101):
    suma = suma + i
print(suma)
```

**Idee:** variabila `suma` pornește de la 0 și „adună” la fiecare pas. Poți verifica rezultatul cu formula lui Gauss: 100 · 101 / 2.

**Rezultat:** `5050`

### 10. Numără cifrele unui număr

**Cerință:** află câte cifre are numărul 90210.

```python
n = 90210
cifre = 0
while n > 0:
    cifre = cifre + 1
    n = n // 10
print(cifre)
```

**Idee:** `n // 10` taie ultima cifră. Numeri de câte ori poți tăia până când n ajunge la 0. Bucla `while` se folosește când nu știi dinainte de câte ori se repetă.

**Rezultat:** `5`

## Stringuri

### 11. Câte vocale are un cuvânt?

**Cerință:** numără vocalele din cuvântul „programare”.

```python
cuvant = "programare"
vocale = 0
for litera in cuvant:
    if litera in "aeiou":
        vocale = vocale + 1
print(vocale)
```

**Idee:** un `for` poate parcurge un string literă cu literă. Operatorul `in` verifică dacă litera se află printre vocale.

**Rezultat:** `4`

### 12. Este palindrom?

**Cerință:** verifică dacă un cuvânt se citește la fel de la stânga la dreapta și invers.

```python
cuvant = "cojoc"
if cuvant == cuvant[::-1]:
    print(cuvant, "este palindrom")
else:
    print(cuvant, "nu este palindrom")
```

**Idee:** `cuvant[::-1]` construiește stringul inversat. Dacă e identic cu originalul, cuvântul e palindrom.

**Rezultat:** `cojoc este palindrom`

## Liste și dicționare

### 13. Media notelor dintr-o listă și notele peste medie

**Cerință:** pentru lista de note de mai jos, afișează media și notele mai mari decât media.

```python
note = [7, 10, 8, 9, 6, 10]
media = sum(note) / len(note)
print(f"Media: {media:.2f}")
peste = []
for nota in note:
    if nota > media:
        peste.append(nota)
print("Peste medie:", peste)
```

**Idee:** `sum` și `len` dau suma și numărul elementelor. Lista `peste` pornește goală și se umple cu `append`.

**Rezultat:** `Media: 8.33` și `Peste medie: [10, 9, 10]`

### 14. De câte ori apare fiecare literă?

**Cerință:** numără de câte ori apare fiecare literă în cuvântul „banana”.

```python
cuvant = "banana"
frecventa = {}
for litera in cuvant:
    if litera in frecventa:
        frecventa[litera] = frecventa[litera] + 1
    else:
        frecventa[litera] = 1
print(frecventa)
```

**Idee:** dicționarul leagă fiecare literă (cheia) de numărul de apariții (valoarea). Prima dată când vezi o literă o adaugi cu 1, apoi doar crești valoarea.

**Rezultat:** `{'b': 1, 'a': 3, 'n': 2}`

## Funcții

### 15. Funcția care verifică dacă un număr e prim

**Cerință:** scrie o funcție `este_prim(n)` care întoarce `True` dacă n e prim și `False` altfel, apoi afișează numerele prime până la 30.

```python
def este_prim(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d = d + 1
    return True

prime = []
for x in range(1, 31):
    if este_prim(x):
        prime.append(x)
print(prime)
```

**Idee:** e suficient să cauți divizori până la radicalul lui n (adică cât timp `d * d <= n`). Imediat ce găsești unul, `return False` oprește funcția.

**Rezultat:** `[2, 3, 5, 7, 11, 13, 17, 19, 23, 29]`

## Ce urmează după aceste exerciții

Dacă le-ai rezolvat singur pe majoritatea, ai bazele: variabile, decizii, bucle, liste și funcții. Pasul următor sunt problemele cu algoritmi clasici, ca cele din [probleme rezolvate pentru clasa a IX-a](/blog/probleme-rezolvate-python-clasa-a-ix-a). Dacă vrei să înveți în ordine, cu lecții scurte și exerciții verificate automat, [alege un traseu](/start): elevii pot urma materia clasei lor, iar adulții și începătorii de orice vârstă pot lua [cursul practic de Python](/curs-practic), al cărui prim modul e gratuit.

## Întrebări frecvente

### Unde pot rula aceste exerciții fără să instalez Python?

În [laboratorul Python online](/lab) de pe acest site: lipești codul și apeși pe rulare. Codul se execută direct în browser.

### Ce fac dacă rezolvarea mea e diferită de cea de aici?

E în regulă: aproape orice problemă are mai multe rezolvări corecte. Verifică dacă obții același rezultat și pentru alte valori decât cele din exemplu, de exemplu 0, numere negative sau un cuvânt de o literă.

### Cât de des ar trebui să exersez?

Contează mai mult regularitatea decât durata: câteva exerciții în fiecare zi te ajută mai mult decât multe exerciții o dată pe săptămână.
