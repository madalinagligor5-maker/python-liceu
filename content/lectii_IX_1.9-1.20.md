# Modulul 1.9 — Conversia numerelor intre baze de numeratie

### 🔄 1.9.1 Recapitulare

Ai folosit până acum numere în baza 10 (zecimală) fără să te gândești la asta: cifrele 0–9, iar poziția fiecăreia înseamnă o putere a lui 10. Calculatorul, însă, lucrează în bază 2 (binară). În acest modul învățăm să trecem un număr dintr-o bază în alta.

### 💡 1.9.2 Concept nou și exemplu

Un număr în bază `b` este scris cu cifre de la `0` la `b-1`. Valoarea lui este suma `cifră × b^poziție`.

**Din zecimal în altă bază (metoda împărțirilor repetate):**
Împarți numărul la bază, notezi restul (e o cifră), continui cu câtul, până câtul devine 0. Cifrele rezultate se citesc de jos în sus.

Pentru bazele mai mari decât 10 avem nevoie de cifre noi: în baza 16, valorile 10–15 se scriu cu literele A–F. Funcția de mai jos merge pentru orice bază de la 2 la 16:

```python
def in_baza(n, b):
    if n == 0:
        return "0"
    simboluri = "0123456789ABCDEF"
    cifre = ""
    while n > 0:
        cifre = simboluri[n % b] + cifre
        n = n // b
    return cifre

print(in_baza(255, 16))  # FF
print(in_baza(13, 2))    # 1101
```

**Din altă bază în zecimal:** înmulțești fiecare cifră cu puterea bazei corespunzătoare și aduni.

```python
def din_baza(sir, b):
    total = 0
    for i, c in enumerate(reversed(sir)):
        total += int(c) * (b ** i)
    return total

print(din_baza("1101", 2))  # 13
```

## Problemă rezolvată pas cu pas

**Enunț.** Verificăm conversiile noastre cu funcțiile gata făcute din Python: `bin`, `hex` și `int(sir, baza)`.

**Ideea.** `bin(n)` și `hex(n)` întorc reprezentarea cu prefixele `0b` și `0x`; `int('1101', 2)` face conversia inversă. Le folosim doar ca să ne verificăm algoritmul.

```python
print(bin(13), hex(255), int('1101', 2), int('ff', 16))
```
Rezultatul: `0b1101 0xff 13 255`.

:::atentie
## Greșeli frecvente
- Citești resturile în ordinea în care le-ai obținut. Cifrele se citesc **invers**: ultimul rest e prima cifră.
- La baza 16 scrii restul 11 ca „11”. În hexazecimal, valorile 10–15 se scriu cu literele A–F.
- Uiți cazul n = 0: bucla `while n > 0` nu se execută, iar funcția întoarce un șir gol în loc de „0”.
- La trecerea în baza 10 numeri pozițiile de la stânga. Poziția 0 este ultima cifră (cea din dreapta).
:::

### 🔮 1.9.3 Citește și prezice

```python
def din_baza(sir, b):
    total = 0
    for i, c in enumerate(reversed(sir)):
        total += int(c) * (b ** i)
    return total

rezultat = din_baza("1010", 2)
print(rezultat)
```
Ce număr se afișează? (E scrisul lui 1010 în binar, trecut în zecimal.)

### 🤝 1.9.4 Exerciții ghidate

**Exercițiul 1.** Completează funcția care convertește un număr zecimal în binar (doar cu 0 și 1), folosind împărțirile repetate:
```python
def in_binar(n):
    sir = ""
    while n > 0:
        sir = str(n % 2) + sir
        n = n // ___
    return sir

print(in_binar(10))  # 1010
```

**Exercițiul 2.** Folosind funcția `din_baza` de mai sus, scrie o funcție `in_baza_zece(sir)` care presupune că `sir` e binar și întoarce valoarea zecimală.

### 🎯 1.9.5 Exerciții independente

**Exercițiul 1.** Scrie un program care convertește un număr zecimal în hexadecimal (bază 16, cu cifre 0–9 și A–F).

**Exercițiul 2.** Scrie un program care primește un șir binar (ex. "1101") și îl afișează în hexadecimal.

### ✅ 1.9.6 Verifică-ți înțelegerea

1. În ce bază lucrează calculatorul în mod natural?
   a) 10  b) **2**  c) 16
      > Toată electronica digitală se bazează pe stări de tip întrerupător (curent/fără curent), care se reprezintă natural prin doar două valori, 0 și 1, deci baza 2.

2. La conversia din zecimal în altă bază prin împărțiri repetate, cifrele se citesc:
   a) De sus în jos  b) **De jos în sus**  c) În ordine oarecare
      > La împărțiri repetate, primul rest obținut este cifra cea mai puțin semnificativă, deci cifrele apar pe rând de la ultima spre prima poziție — adică se citesc de jos în sus, cum construiește și `in_baza` cu `cifre = str(n % b) + cifre`.

3. Ce valoare are `din_baza("101", 2)`?
   a) 3  b) **5**  c) 101
      > "101" în binar înseamnă 1×2² + 0×2¹ + 1×2⁰ = 4 + 0 + 1 = 5, exact calculul făcut de `din_baza` prin înmulțirea fiecărei cifre cu puterea bazei corespunzătoare.

4. În baza 16, cifra care urmează după 9 este:
   a) 10  b) **A**  c) 0
      > În hexazecimal cifrele merg de la 0 la 15, iar pentru valorile 10-15 se folosesc literele A-F, deci după cifra 9 urmează litera A (valoarea 10), conform șirului `simboluri = "0123456789ABCDEF"`.


:::verifica-cod
Completează funcția care trece numărul n din baza 10 în baza 2. Programul afișează `in_binar(19)`.
template: def in_binar(n):
    sir = ''
    while n > 0:
        sir = str(___) + sir
        n = n // 2
    return sir

print(in_binar(19))
output: 10011
:::

# Modulul 1.10 — Ciurul lui Eratostene si exponentiere rapida

### 🔄 1.10.1 Recapitulare

Ai învățat să verifici dacă un număr este divizor al altuia (1.8) și să parcurgi intervale cu `for`. Acum folosim parcurgerea pentru a găsi toate numerele prime dintr-un interval — o problemă frecventă la olimpiade.

### 💡 1.10.2 Concept nou și exemplu

Un număr **prim** are exact doi divizori: 1 și el însuși. **Ciurul lui Eratostene** găsește toate numerele prime până la `n`:
1. Marchezi toate numerele de la 2 la `n` ca fiind prime.
2. Pentru fiecare număr `p` rămas marcat ca prim, tai (marchezi ca neprime) toți multiplii lui `p`.
3. Numerele care rămân netăiate sunt prime.

```python
def ciur(n):
    este_prim = [True] * (n + 1)
    este_prim[0] = este_prim[1] = False
    for p in range(2, int(n ** 0.5) + 1):
        if este_prim[p]:
            for m in range(p * p, n + 1, p):
                este_prim[m] = False
    return [i for i in range(2, n + 1) if este_prim[i]]

print(ciur(30))  # [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
```

**Exponențierea rapidă** calculează `b^e` în timp logaritmic, folosind dublarea exponenților:
```python
def putere_rapida(b, e):
    rez = 1
    while e > 0:
        if e % 2 == 1:
            rez *= b
        b *= b
        e //= 2
    return rez

print(putere_rapida(2, 10))  # 1024
```

## Problemă rezolvată pas cu pas

**Enunț.** Câte numere prime sunt mai mici decât 1000, și care este cel mai mare dintre ele? Folosim ciurul o singură dată și răspundem la ambele întrebări.

**Ideea.** După ciur, lista `este_prim` ne spune pentru fiecare număr dacă e prim. Construim lista primelor și folosim `len` și ultimul element.

```python
n = 999
este_prim = [True] * (n + 1)
este_prim[0] = este_prim[1] = False
for p in range(2, int(n ** 0.5) + 1):
    if este_prim[p]:
        for m in range(p * p, n + 1, p):
            este_prim[m] = False

prime = [i for i in range(n + 1) if este_prim[i]]
print(len(prime), prime[-1])
```
Rezultatul: `168 997`.

:::atentie
## Greșeli frecvente
- Consideri 1 număr prim. Un număr prim are **exact doi** divizori, iar 1 are unul singur.
- Lista `este_prim` are lungimea n în loc de n + 1, iar `este_prim[n]` dă `IndexError`.
- Pornești tăierea multiplilor de la 2·p. Rezultatul e corect, dar algoritmul face pași inutili: se poate porni de la p·p.
- La exponențierea rapidă uiți `e //= 2`, iar bucla nu se mai oprește.
:::

### 🔮 1.10.3 Citește și prezice

```python
def ciur(n):
    este_prim = [True] * (n + 1)
    este_prim[0] = este_prim[1] = False
    for p in range(2, int(n ** 0.5) + 1):
        if este_prim[p]:
            for m in range(p * p, n + 1, p):
                este_prim[m] = False
    return [i for i in range(2, n + 1) if este_prim[i]]

rezultat = ciur(20)
print(len(rezultat))
```
Câte numere prime sunt între 2 și 20? (Numără câte elemente sunt în listă.)

### 🤝 1.10.4 Exerciții ghidate

**Exercițiul 1.** Completează condiția care verifică dacă un număr `x` este prim (testează divizorii de la 2 la radical din x):
```python
def este_prim(x):
    if x < 2:
        return False
    for d in range(2, int(x ** 0.5) + 1):
        if x % ___ == 0:
            return False
    return True

print(este_prim(17))  # True
```

**Exercițiul 2.** Folosind `putere_rapida` de mai sus, calculează `3^13`.

### 🎯 1.10.5 Exerciții independente

**Exercițiul 1.** Scrie un program care afișează toate numerele prime gemene (p, p+2 ambele prime) până la 100.

**Exercițiul 2.** Scrie o funcție care calculează ultima cifră a lui `2^n` pentru `n` mare, folosind exponențierea rapidă (observă periodicitatea).

### ✅ 1.10.6 Verifică-ți înțelegerea

1. Un număr prim are:
   a) Un singur divizor  b) **Exact doi divizori (1 și el însuși)**  c) Trei divizori
      > Prin definiție, un număr prim se împarte exact doar la 1 și la el însuși, deci are întotdeauna exact doi divizori.

2. În ciurul lui Eratostene, începem eliminarea multiplilor de la:
   a) `p`  b) **`p * p`**  c) `2 * p`
      > Multiplii lui `p` mai mici decât `p*p` (adică `2p, 3p, ..., (p-1)p`) au deja fost eliminați de un divizor mai mic decât `p` la un pas anterior, așa că ciurul pornește eliminarea direct de la `p*p`, ca în bucla `range(p * p, n + 1, p)`.

3. Exponențierea rapidă reduce timpul de la O(e) la:
   a) O(e²)  b) **O(log e)**  c) O(1)
      > Fiindcă la fiecare pas exponentul se înjumătățește (`e //= 2`), numărul de pași necesari e proporțional cu logaritmul lui `e`, nu cu `e` însuși — de aici trecerea de la O(e) la O(log e).

4. `putere_rapida(2, 10)` returnează:
   a) 100  b) **1024**  c) 20
      > 2 ridicat la puterea 10 este 1024, iar `putere_rapida` calculează exact această valoare prin dublări succesive ale bazei, așa cum arată și exemplul din lecție.


:::verifica-cod
Completează exponențierea rapidă: când exponentul e impar, înmulțim rezultatul cu baza. Programul afișează 3 la puterea 20.
template: def putere(b, e):
    rez = 1
    while e > 0:
        if e % 2 == 1:
            rez = ___
        b = b * b
        e = e // 2
    return rez

print(putere(3, 20))
output: 3486784401
:::

# Modulul 1.11 — Introducere in programarea orientata pe obiecte

### 🔄 1.11.1 Recapitulare

Ai definit funcții (1.4) și le-ai apelat cu parametri. Când avem multe date legate între ele (ex. un punct are x și y), e mai clar să le grupăm într-un **obiect**.

### 💡 1.11.2 Concept nou și exemplu

O **clasă** e un șablon; un **obiect** (instanță) e o copie concretă. Atributele țin date, metodele sunt funcții ale obiectului.

```python
class Punct:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def distanta_origine(self):
        return (self.x ** 2 + self.y ** 2) ** 0.5

p = Punct(3, 4)
print(p.x, p.y)            # 3 4
print(p.distanta_origine()) # 5.0
```

`__init__` e constructorul — se apelează automat la crearea obiectului. `self` referă la obiectul curent.

## Problemă rezolvată pas cu pas

**Enunț.** Modelăm un dreptunghi ca obiect: constructorul primește laturile, iar metodele întorc aria și perimetrul. Creăm două dreptunghiuri și îl afișăm pe cel cu aria mai mare.

**Ideea.** Fiecare obiect își păstrează propriile laturi în `self`. Aceeași metodă `arie()` dă rezultate diferite pentru obiecte diferite.

```python
class Dreptunghi:
    def __init__(self, lungime, latime):
        self.lungime = lungime
        self.latime = latime

    def arie(self):
        return self.lungime * self.latime

    def perimetru(self):
        return 2 * (self.lungime + self.latime)

d1 = Dreptunghi(6, 4)
d2 = Dreptunghi(5, 5)
mare = d1 if d1.arie() > d2.arie() else d2
print(mare.arie(), mare.perimetru())
```
Rezultatul: `25 20`.

:::atentie
## Greșeli frecvente
- Uiți `self` ca prim parametru al unei metode: la apel apare `TypeError` (metoda primește mai multe argumente decât așteaptă).
- Scrii `x = x` în constructor în loc de `self.x = x`: valoarea nu se păstrează în obiect.
- Apelezi metoda fără paranteze (`p.arie` în loc de `p.arie()`): primești metoda însăși, nu rezultatul.
- Confunzi clasa cu obiectul: `Punct.x` nu există, `x` aparține fiecărui obiect creat (`p.x`).
:::

### 🔮 1.11.3 Citește și prezice

```python
class Persoana:
    def __init__(self, nume, varsta):
        self.nume = nume
        self.varsta = varsta

    def salut(self):
        return "Salut, " + self.nume

p = Persoana("Ana", 16)
mesaj = p.salut()
print(mesaj)
```
Ce se afișează?

### 🤝 1.11.4 Exerciții ghidate

**Exercițiul 1.** Completează clasa `Cerc` care are atributul `raza` și metoda `arie()`:
```python
import math

class Cerc:
    def __init__(self, raza):
        self.___ = raza

    def arie(self):
        return math.pi * self.raza ** 2

c = Cerc(2)
print(round(c.arie(), 2))  # 12.57
```

**Exercițiul 2.** Adaugă metoda `perimetru()` la clasa `Cerc` (formula `2 * pi * raza`).

### 🎯 1.11.5 Exerciții independente

**Exercițiul 1.** Creează clasa `Student` cu atribute `nume`, `note` (listă) și metoda `medie()` care calculează media notelor.

**Exercițiul 2.** Creează clasa `ContBancar` cu `sold` și metodele `deposeaza(sumă)` și `retrage(sumă)` (nu permite retragerea dacă nu e suficient).

### ✅ 1.11.6 Verifică-ți înțelegerea

1. Ce este o clasă?
   a) Un obiect concret  b) **Un șablon pentru obiecte**  c) O funcție
      > O clasă descrie doar structura (ce atribute și metode vor avea obiectele), fără să fie ea însăși un obiect concret — de aceea e numită șablon, iar instanțele sunt copiile concrete create după acel șablon.

2. Ce face `__init__`?
   a) Șterge obiectul  b) **Se apelează la crearea obiectului**  c) Calculează ceva
      > `__init__` este constructorul: Python îl apelează automat imediat ce scrii `Punct(3, 4)`, pentru a inițializa atributele noului obiect (`self.x`, `self.y`).

3. Ce înseamnă `self`?
   a) Clasa  b) **Obiectul curent**  c) O variabilă globală
      > În interiorul unei metode, `self` este parametrul prin care obiectul curent își accesează propriile atribute, de exemplu `self.x` din exemplul cu `Punct`, nu clasa în sine și nici o variabilă globală.

4. `p = Punct(3, 4)` creează:
   a) O clasă  b) **O instanță (obiect)**  c) O funcție
      > Apelul `Punct(3, 4)` invocă `__init__` și produce un obiect concret cu `x=3` și `y=4` — o instanță a clasei `Punct`, nu clasa în sine.


:::verifica-cod
Completează constructorul clasei `Elev`, ca metoda `prezentare()` să afișeze numele și clasa.
template: class Elev:
    def __init__(self, nume, clasa):
        self.nume = nume
        ___ = clasa

    def prezentare(self):
        print(self.nume, self.clasa)

Elev('Ana', 'IX').prezentare()
output: Ana IX
:::

# Modulul 1.12 — tkinter: fereastra principala si widget-uri de baza

### 🔄 1.12.1 Recapitulare

Până acum tot codul a rulat în consolă. Tkinter ne lasă să facem ferestre cu butoane și text — o aplicație cu interfață grafică (GUI).

### 💡 1.12.2 Concept nou și exemplu

`Tk()` creează fereastra, `Label`/`Button`/`Entry` sunt widget-uri, `pack()`/`grid()` le aranjează, `mainloop()` ține fereastra deschisă.

```python
import tkinter as tk

fereastra = tk.Tk()
fereastra.title("Salut")
fereastra.geometry("300x150")

eticheta = tk.Label(fereastra, text="Apasă butonul")
eticheta.pack()

def la_click():
    eticheta.config(text="Ai apăsat!")

buton = tk.Button(fereastra, text="Apasă", command=la_click)
buton.pack()

fereastra.mainloop()
```

## Problemă rezolvată pas cu pas

**Enunț.** Programele cu ferestre nu rulează în browser, dar logica lor da. Separăm calculul de interfață: funcția `calculeaza_dublu(text)` primește ce a scris utilizatorul și întoarce textul de afișat în etichetă. Butonul doar o apelează.

**Ideea.** Testăm funcția fără fereastră, cu câteva valori. În aplicația reală, `command` apelează o funcție care face `eticheta.config(text=calculeaza_dublu(intrare.get()))`.

```python
def calculeaza_dublu(text):
    if not text.strip().isdigit():
        return 'Introdu un număr întreg'
    return 'Dublul este ' + str(int(text) * 2)

print(calculeaza_dublu('21'))
print(calculeaza_dublu('abc'))
```
Rezultatul:
```text
Dublul este 42
Introdu un număr întreg
```

:::atentie
## Greșeli frecvente
- Uiți `fereastra.mainloop()` la final: fereastra se deschide și se închide imediat.
- Scrii `command=la_click()` (cu paranteze): funcția se execută o singură dată, la pornire, nu la fiecare apăsare. Corect este `command=la_click`.
- Creezi widget-ul, dar uiți `pack()` sau `grid()`: el există, dar nu apare în fereastră.
- Folosești textul unui `Entry` ca număr fără conversie: `entry.get()` întoarce text, deci ai nevoie de `int(...)` sau `float(...)`.
:::

### 🔮 1.12.3 Citește și prezice

```python
import tkinter as tk

f = tk.Tk()
l = tk.Label(f, text="Salut")
l.pack()
f.mainloop()
```
Ce apare pe ecran când rulezi acest cod?

### 🤝 1.12.4 Exerciții ghidate

**Exercițiul 1.** Completează ca să creezi o fereastră cu un buton care schimbă textul etichetei:
```python
import tkinter as tk

f = tk.Tk()
eticheta = tk.Label(f, text="Început")
eticheta.pack()

def schimba():
    eticheta.config(text="___")  # completează textul nou

tk.Button(f, text="Schimbă", command=___).pack()
f.mainloop()
```

**Exercițiul 2.** Adaugă un `Entry` (câmp de text) și un buton care afișează ce ai scris în etichetă.

### 🎯 1.12.5 Exerciții independente

**Exercițiul 1.** Fă o aplicație cu un câmp de intrare și un buton „Calculează" care afișează dublul numărului introdus.

**Exercițiul 2.** Fă o fereastră cu 3 butoane de culori care schimbă culoarea de fundal a etichetei.

### ✅ 1.12.6 Verifică-ți înțelegerea

1. Ce creează `tk.Tk()`?
   a) Un buton  b) **Fereastra principală**  c) O etichetă
      > `tk.Tk()` construiește fereastra principală a aplicației, cea peste care apoi se adaugă widget-uri precum `Label` sau `Button`.

2. Ce face `mainloop()`?
   a) Închide fereastra  b) **Ține fereastra deschisă și așteaptă evenimente**  c) Creează widget-uri
      > `mainloop()` pornește bucla de evenimente a interfeței: fereastra rămâne deschisă și ascultă continuu click-uri, taste etc., altfel programul s-ar închide instant după crearea widget-urilor.

3. Ce argument primește `Button` pentru a ști ce să execute la click?
   a) `text`  b) **`command`**  c) `pack`
      > Parametrul `command` primit de `Button` indică funcția care trebuie apelată automat când se dă click pe el, exact ca `command=la_click` din exemplu.

4. `pack()` servește la:
   a) **Aranjarea widget-ului în fereastră**  b) Închiderea ferestrei  c) Citirea input-ului
      > `pack()` este metoda care poziționează efectiv widget-ul în interiorul ferestrei — fără ea, widget-ul e creat dar nu apare vizual pe ecran.


:::verifica-cod
Funcția apelată de un buton „Salută” primește numele scris în câmp și întoarce mesajul afișat în etichetă. Completeaz-o, ca pentru numele „Ioana” programul să afișeze `Bună, Ioana!`.
template: def mesaj_salut(nume):
    return ___

print(mesaj_salut('Ioana'))
output: Bună, Ioana!
:::

# Modulul 1.13 — tkinter: gestionarea plasarii si a evenimentelor

### 🔄 1.13.1 Recapitulare

Ai învățat widget-urile de bază (1.12). Acum învățăm să le aranjăm precis și să reacționăm la tastatură, nu doar la click.

### 💡 1.13.2 Concept nou și exemplu

`grid()` plasează widget-urile într-un tabel (rând/coloană), mai precis decât `pack()`. Evenimentele se leagă cu `bind`:

```python
import tkinter as tk

f = tk.Tk()

def la_tasta(e):
    print("Ai apăsat:", e.keysym)

f.bind("<Key>", la_tasta)
label = tk.Label(f, text="Apasă o tastă")
label.grid(row=0, column=0)
f.mainloop()
```

```python
# Exemplu grid cu 2 coloane
import tkinter as tk
f = tk.Tk()
tk.Label(f, text="Nume:").grid(row=0, column=0)
tk.Entry(f).grid(row=0, column=1)
tk.Label(f, text="Vârsta:").grid(row=1, column=0)
tk.Entry(f).grid(row=1, column=1)
```

## Problemă rezolvată pas cu pas

**Enunț.** Un formular are etichetele pe coloana 0 și câmpurile pe coloana 1. Calculăm automat pozițiile din `grid`, apoi le verificăm fără fereastră.

**Ideea.** Câmpul cu indicele i se află pe rândul i. Eticheta lui stă în coloana 0, iar `Entry` în coloana 1. În aplicație, fiecare pereche devine `Label(...).grid(row=i, column=0)` și `Entry(...).grid(row=i, column=1)`.

```python
campuri = ['Nume', 'Prenume', 'Vârsta']

for i, camp in enumerate(campuri):
    print(camp, '-> rând', i, ', etichetă pe coloana 0, câmp pe coloana 1')
```
Rezultatul:
```text
Nume -> rând 0 , etichetă pe coloana 0, câmp pe coloana 1
Prenume -> rând 1 , etichetă pe coloana 0, câmp pe coloana 1
Vârsta -> rând 2 , etichetă pe coloana 0, câmp pe coloana 1
```

:::atentie
## Greșeli frecvente
- Folosești `pack()` și `grid()` în același container: tkinter se blochează sau afișează o eroare. Alege o singură metodă pentru fiecare fereastră sau `Frame`.
- Funcția legată cu `bind` nu primește parametrul pentru eveniment: scrie `def la_tasta(e):`, chiar dacă nu folosești `e`.
- Numeri rândurile și coloanele de la 1. În `grid`, primul rând și prima coloană au numărul 0.
- Scrii evenimentul greșit: `"Key"` în loc de `"<Key>"`, sau `"<Click>"` în loc de `"<Button-1>"`.
:::

### 🔮 1.13.3 Citește și prezice

```python
import tkinter as tk
f = tk.Tk()
tk.Label(f, text="A").grid(row=0, column=0)
tk.Label(f, text="B").grid(row=0, column=1)
tk.Label(f, text="C").grid(row=1, column=0)
f.mainloop()
```
Unde apare textul „C" în fereastră?

### 🤝 1.13.4 Exerciții ghidate

**Exercițiul 1.** Completează plasarea cu `grid` pentru un formular (nume pe rândul 0, vârstă pe rândul 1):
```python
import tkinter as tk
f = tk.Tk()
tk.Label(f, text="Nume:").___(row=0, column=0)
tk.Entry(f).___(row=0, column=1)
tk.Label(f, text="Vârsta:").grid(row=1, column=0)
tk.Entry(f).grid(row=1, column=1)
f.mainloop()
```

**Exercițiul 2.** Leagă un eveniment de tastatură care afișează tasta apăsată într-o etichetă.

### 🎯 1.13.5 Exerciții independente

**Exercițiul 1.** Fă o fereastră cu un Entry și un Label; la fiecare tastare, Label-ul arată lungimea textului introdus.

**Exercițiul 2.** Creează o mini-calculatoare cu butoane 0–9 și `+`, `-`, `=` aranjate în grid.

### ✅ 1.13.6 Verifică-ți înțelegerea

1. Ce avantaj are `grid()` față de `pack()`?
   a) E mai rapid  b) **Permite aranjare pe rânduri și coloane**  c) Nu necesită `mainloop()`
      > Spre deosebire de `pack()`, care doar înșiruie widget-urile, `grid()` te lasă să specifici explicit `row` și `column`, deci poți aranja widget-uri într-un tabel precis.

2. Cu ce legi o funcție de o tastă?
   a) `command`  b) **`bind`**  c) `grid`
      > `bind` asociază un eveniment (ca apăsarea unei taste, `"<Key>"`) cu o funcție care va fi apelată automat când acel eveniment are loc, ca în `f.bind("<Key>", la_tasta)`.

3. În `grid(row=1, column=0)`, textul apare:
   a) Coloana 1, rândul 0  b) **Rândul 1, coloana 0**  c) Centrat
      > În `grid(row=1, column=0)`, primul parametru numit e `row`, deci widget-ul se plasează pe rândul 1, coloana 0, nu invers.

4. `f.bind("<Key>", func)` apelează `func`:
   a) La click  b) **La orice tastă**  c) La închiderea ferestrei
      > Evenimentul `"<Key>"` din tkinter se declanșează la apăsarea oricărei taste de pe tastatură, nu doar la una anume, spre deosebire de `command`, care e legat de click pe buton.


:::verifica-cod
La fiecare tastă, eticheta arată câte caractere a scris utilizatorul. Completează funcția apelată de eveniment, ca pentru textul „python” să întoarcă „6 caractere”.
template: def text_lungime(text):
    return ___

print(text_lungime('python'))
output: 6 caractere
:::

# Modulul 1.14 — Fisiere text: deschidere, citire, scriere, inchidere

### 🔄 1.14.1 Recapitulare

Până acum datele dispar la închiderea programului. Fișierele le păstrează — le putem citi și scrie informații permanent.

### 💡 1.14.2 Concept nou și exemplu

`open(nume, "r")` deschide pentru citire, `"w"` pentru scriere (șterge), `"a"` pentru adăugare. Mereu închizi cu `.close()` sau folosește `with` (se închide automat).

```python
# Scriere
with open("note.txt", "w", encoding="utf-8") as f:
    f.write("Ana\n")
    f.write("9\n")

# Citire
with open("note.txt", "r", encoding="utf-8") as f:
    continut = f.read()
print(continut)

# Citire linie cu linie
with open("note.txt", "r", encoding="utf-8") as f:
    for linie in f:
        print(linie.strip())
```

## Problemă rezolvată pas cu pas

**Enunț.** Fișierul `note.txt` conține pe fiecare linie numele unui elev și nota lui, separate prin spațiu. Scriem fișierul, apoi îl citim și afișăm media notelor și elevul cu nota cea mai mare.

**Ideea.** La citire, `linie.split()` împarte rândul în nume și notă, iar nota trebuie convertită cu `int`. Ținem minte suma, numărul de elevi și cel mai bun elev găsit până acum.

```python
with open('note.txt', 'w', encoding='utf-8') as f:
    f.write('Ana 9\nMihai 7\nIoana 10\nDan 8\n')

suma, nr = 0, 0
best_nume, best_nota = '', -1
with open('note.txt', 'r', encoding='utf-8') as f:
    for linie in f:
        nume, nota = linie.split()
        nota = int(nota)
        suma += nota
        nr += 1
        if nota > best_nota:
            best_nume, best_nota = nume, nota

print(suma / nr, best_nume)
```
Rezultatul: `8.5 Ioana`.

:::atentie
## Greșeli frecvente
- Deschizi cu `"w"` un fișier la care voiai să adaugi: tot conținutul vechi se șterge. Pentru adăugare folosește `"a"`.
- Uiți `\n` la `write`: liniile se lipesc una de alta (`write` nu trece singur la rând nou, spre deosebire de `print`).
- Folosești liniile citite ca numere fără conversie și fără `strip()`: `'7\n' + 1` dă eroare. Scrie `int(linie)` sau `int(linie.strip())`.
- Citești de două ori același fișier deschis: după `f.read()`, un al doilea `f.read()` întoarce șirul gol.
:::

### 🔮 1.14.3 Citește și prezice

```python
with open("test.txt", "w", encoding="utf-8") as f:
    f.write("Salut")
    f.write("Lume")

with open("test.txt", "r", encoding="utf-8") as f:
    text = f.read()
print(text)
```
Ce se va afișa? (Atentie: cele două write-uri nu au spațiu între ele.)

### 🤝 1.14.4 Exerciții ghidate

**Exercițiul 1.** Completează ca să scrii numele într-un fișier și să-l citești înapoi:
```python
with open("nume.txt", "w", encoding="utf-8") as f:
    f.write("___")  # scrie numele tău

with open("nume.txt", "r", encoding="utf-8") as f:
    print(f.___())  # citește tot
```

**Exercițiul 2.** Scrie un program care citește un fișier linie cu linie și numără câte linii are.

### 🎯 1.14.5 Exerciții independente

**Exercițiul 1.** Scrie un program care copiază conținutul unui fișier `a.txt` în `b.txt`.

**Exercițiul 2.** Scrie un program care citește numere dintr-un fișier (câte unul pe linie) și afișează suma lor.

### ✅ 1.14.6 Verifică-ți înțelegerea

1. Cu ce deschizi un fișier pentru citire?
   a) `open(f, "w")`  b) **`open(f, "r")`**  c) `open(f, "a")`
      > Modul `"r"` (read) transmis lui `open()` deschide fișierul strict pentru citire, ca în exemplul `open("note.txt", "r", ...)`.

2. Ce face modul `"w"`?
   a) Adaugă la sfârșit  b) **Șterge și scrie de la început**  c) Doar citește
      > Modul `"w"` (write) golește conținutul existent al fișierului și începe scrierea de la zero, spre deosebire de `"a"` care adaugă la sfârșit fără să șteargă ce era deja acolo.

3. De ce e recomandat `with open(...) as f`?
   a) E mai scurt  b) **Închide fișierul automat**  c) Permite citirea binară
      > `with open(...) as f` garantează că fișierul se închide automat la ieșirea din blocul `with`, chiar dacă apare o eroare pe parcurs, eliminând riscul de a uita `.close()`.

4. `f.read()` citește:
   a) O linie  b) **Tot conținutul**  c) Primul caracter
      > `f.read()` citește dintr-o dată tot conținutul fișierului într-un singur șir de caractere, spre deosebire de parcurgerea linie cu linie din exemplul `for linie in f`.


:::verifica-cod
Programul scrie trei numere în fișier, câte unul pe linie, apoi le citește și le adună. Completează conversia, ca programul să afișeze suma lor.
template: with open('numere.txt', 'w', encoding='utf-8') as f:
    f.write('12\n30\n8\n')

s = 0
with open('numere.txt', encoding='utf-8') as f:
    for linie in f:
        s += ___
print(s)
output: 50
:::

# Modulul 1.15 — Modelul conceptual lista: stiva, coada, acces direct/secvential

### 🔄 1.15.1 Recapitulare

Ai folosit liste (`[ ]`) în mai multe module. Acum le privim ca **structuri de date** cu reguli clare de acces.

### 💡 1.15.2 Concept nou și exemplu

- **Listă:** acces direct la orice element prin index (`L[0]`, `L[2]`).
- **Stivă (stack):** LIFO — ultimul intră, primul iese (`append` / `pop`).
- **Coadă (queue):** FIFO — primul intră, primul iese (`append` la coadă, `pop(0)` la ieșire).

```python
# Stiva
stiva = []
stiva.append(1)
stiva.append(2)
stiva.append(3)
print(stiva.pop())  # 3 (ultimul adăugat)

# Coada
from collections import deque
coada = deque()
coada.append("A")
coada.append("B")
print(coada.popleft())  # A (primul adăugat)
```

## Problemă rezolvată pas cu pas

**Enunț.** Verificăm dacă parantezele dintr-o expresie sunt închise corect, de exemplu `(a+[b*c])-{d}`. Este o aplicație clasică a stivei.

**Ideea.** Fiecare paranteză deschisă intră în stivă. La o paranteză închisă, vârful stivei trebuie să fie perechea ei. La final, stiva trebuie să fie goală.

```python
def echilibrat(expr):
    pereche = {')': '(', ']': '[', '}': '{'}
    stiva = []
    for c in expr:
        if c in '([{':
            stiva.append(c)
        elif c in ')]}':
            if not stiva or stiva.pop() != pereche[c]:
                return False
    return not stiva

print(echilibrat('(a+[b*c])-{d}'), echilibrat('(a+b]'))
```
Rezultatul: `True False`.

:::atentie
## Greșeli frecvente
- Folosești `lista.pop(0)` pentru o coadă mare: e lent, pentru că toate celelalte elemente se mută cu o poziție. `deque.popleft()` e rapid.
- Scoți dintr-o stivă sau coadă goală: `pop()` dă `IndexError`. Verifică întâi `if stiva:`.
- Pui elementele în stivă la un capăt și le scoți de la celălalt: obții o coadă, nu o stivă.
- Confunzi „vârful stivei” cu primul element al listei. Vârful e **ultimul** element: `stiva[-1]`.
:::

### 🔮 1.15.3 Citește și prezice

```python
stiva = []
stiva.append(10)
stiva.append(20)
stiva.append(30)
print(stiva.pop())
print(stiva.pop())
```
Ce se afișează pe cele două linii?

### 🤝 1.15.4 Exerciții ghidate

**Exercițiul 1.** Completează o coadă folosind `deque` și afișează elementele în ordinea ieșirii:
```python
from collections import deque
c = deque()
c.append("X")
c.append("Y")
c.append("Z")
print(c.___())  # primul care iese
print(c.___())
```

**Exercițiul 2.** Simulează o stivă: adaugă 5 numere, apoi golește-o afișând elementele.

### 🎯 1.15.5 Exerciții independente

**Exercițiul 1.** Scrie o funcție `este_palindrom_stiva(sir)` care folosește o stivă pentru a verifica dacă un șir e palindrom.

**Exercițiul 2.** Simulează o coadă de așteptare: clienții vin (se adaugă) și sunt serviți în ordinea venirii.

### ✅ 1.15.6 Verifică-ți înțelegerea

1. Ce înseamnă LIFO (stivă)?
   a) Primul intră, primul iese  b) **Ultimul intră, primul iese**  c) Ordonat crescător
      > LIFO înseamnă "Last In, First Out" — elementul adăugat ultimul este primul scos, exact comportamentul stivei ilustrat de `append`/`pop` pe aceeași parte a listei.

2. Într-o coadă, primul servit este:
   a) Cel mai recent adăugat  b) **Cel mai vechi adăugat**  c) Cel mai mare
      > Coada respectă regula FIFO: clientul care a intrat primul este și primul care iese, comportament redat de `coada.append("A")` urmat de `coada.popleft()` care scoate exact acel "A".

3. `stiva.pop()` returnează:
   a) Primul element  b) **Ultimul element adăugat**  c) Lista goală
      > `pop()` fără argument scoate și întoarce ultimul element adăugat în listă, adică vârful stivei, exact ca în exemplul unde `stiva.pop()` întoarce 3 (ultimul introdus).

4. Pentru coadă în Python folosim:
   a) `list` cu `pop()`  b) **`deque` cu `popleft()`**  c) `set`
      > Pentru coadă se preferă `deque` cu `popleft()`, pentru că scoate eficient elementul din capătul opus adăugării, comportamentul FIFO cerut — spre deosebire de `list.pop()`, care ar scoate elementul greșit (ultimul, nu primul).


:::verifica-cod
Inversează un cuvânt cu o stivă: pui fiecare literă în stivă, apoi le scoți pe rând. Completează instrucțiunea care scoate din stivă.
template: cuvant = 'stiva'
stiva = list(cuvant)
invers = ''
while stiva:
    invers += ___
print(invers)
output: avits
:::

# Modulul 1.16 — Clasa list: operatori de baza

### 🔄 1.16.1 Recapitulare

Ai folosit liste la aproape fiecare modul. Acum le studiem sistematic — operatorii și metodele de bază.

### 💡 1.16.2 Concept nou și exemplu

```python
L = [3, 1, 4, 1, 5]

print(len(L))        # 5
print(L[0])          # 3  (primul)
print(L[-1])         # 5  (ultimul)
print(L[1:3])        # [1, 4]  (slice)
print(L + [9])       # [3, 1, 4, 1, 5, 9]
print(4 in L)        # True
print(L * 2)         # [3, 1, 4, 1, 5, 3, 1, 4, 1, 5]

L.append(7)          # adaugă la sfârșit
L.insert(0, 99)      # inserează la poziția 0
L.remove(1)          # șterge prima apariție a lui 1
L.pop()              # șterge ultimul
L.index(5)           # pozitia lui 5
L.count(1)           # de câte ori apare 1
```

## Problemă rezolvată pas cu pas

**Enunț.** Observăm diferența dintre a da încă un nume unei liste și a o copia.

**Ideea.** `B = L` nu creează o listă nouă: `B` e un alt nume pentru aceeași listă, așa că modificarea prin `B` se vede și în `L`. `C = L[:]` creează o copie separată.

```python
L = [1, 2, 3]
B = L
C = L[:]
B.append(4)
C.append(99)
print(L, C)
```
Rezultatul: `[1, 2, 3, 4] [1, 2, 3, 99]`.

:::atentie
## Greșeli frecvente
- Accesezi `L[len(L)]`: ultimul indice este `len(L) - 1`, altfel apare `IndexError`.
- Crezi că `L[1:3]` conține și elementul de pe poziția 3. Capătul din dreapta al unei felii nu este inclus.
- Copiezi o listă cu `B = L`: ambele nume arată spre **aceeași** listă. Pentru o copie scrie `B = L[:]`.
- Folosești `L * 2` crezând că dublezi valorile. De fapt repeți lista: `[1, 2] * 2` dă `[1, 2, 1, 2]`.
:::

### 🔮 1.16.3 Citește și prezice

```python
L = [10, 20, 30, 40]
print(L[-1])
print(L[1:3])
print(20 in L)
```
Ce se afișează pe fiecare linie?

### 🤝 1.16.4 Exerciții ghidate

**Exercițiul 1.** Completează pentru a adăuga 99 la începutul listei și a șterge ultimul element:
```python
L = [1, 2, 3]
L.___(0, 99)   # inserează 99 pe poziția 0
L.___()        # șterge ultimul
print(L)
```

**Exercițiul 2.** Folosind `L.count(x)`, numără câte apariții are valoarea 5 într-o listă dată.

### 🎯 1.16.5 Exerciții independente

**Exercițiul 1.** Scrie un program care primește o listă și o afișează inversată (fără a folosi `reversed` — folosește slice-uri).

**Exercițiul 2.** Scrie un program care elimină toate elementele egale cu o valoare dată dintr-o listă.

### ✅ 1.16.6 Verifică-ți înțelegerea

1. Ce returnează `L[-1]`?
   a) Primul element  b) **Ultimul element**  c) Lista întreagă
      > Indicele `-1` numără pozițiile de la coadă spre început, deci `L[-1]` accesează întotdeauna ultimul element din listă.

2. `L[1:3]` este un:
   a) Element  b) **Slice (sublistă)**  c) Index negativ
      > `L[1:3]` extrage un fragment din listă (elementele de la indicele 1 până la 3 exclusiv), rezultatul fiind el însuși o listă, deci un slice, nu un singur element.

3. Ce face `L.append(x)`?
   a) Inserează la început  b) **Adaugă la sfârșit**  c) Șterge x
      > `append(x)` inserează valoarea `x` chiar la finalul listei existente, fără să modifice restul elementelor, spre deosebire de `insert(0, x)` care ar adăuga la început.

4. `5 in L` returnează:
   a) Poziția lui 5  b) **True/False dacă 5 e în listă**  c) Numărul de apariții
      > Operatorul `in` testează apartenența și întoarce o valoare logică — `True` dacă 5 se află printre elementele listei, `False` altfel — nu poziția și nici numărul de apariții.


:::verifica-cod
Completează felia (slice-ul) care păstrează din listă doar elementele de pe pozițiile 2, 3 și 4.
template: L = [10, 20, 30, 40, 50, 60]
print(L[___])
output: [30, 40, 50]
:::

# Modulul 1.17 — Clasa list: metode (căutare, inserare, stergere, sortare)

### 🔄 1.17.1 Recapitulare

Modulul anterior a acoperit operatorii. Acum aprofundăm căutarea, inserarea la poziție, ștergerea și sortarea.

### 💡 1.17.2 Concept nou și exemplu

```python
L = [5, 2, 8, 1, 9]

L.sort()             # sortează crescător, modifică lista: [1, 2, 5, 8, 9]
L.sort(reverse=True) # descrescător

sorted_L = sorted(L) # nouă listă sortată, L rămâne neschimbată

L.reverse()          # inversează ordinea

# Căutare liniară
def cauta(L, x):
    for i in range(len(L)):
        if L[i] == x:
            return i
    return -1

print(cauta([5, 2, 8], 8))  # 2
```

## Problemă rezolvată pas cu pas

**Enunț.** Avem elevii unei clase ca perechi (nume, medie). Afișăm clasamentul descrescător după medie, iar la medii egale în ordine alfabetică.

**Ideea.** `sorted` primește o funcție `key` care spune după ce comparăm. Cheia `(-medie, nume)` ordonează întâi descrescător după medie, apoi crescător după nume.

```python
elevi = [('Mara', 9.5), ('Andrei', 8.75), ('Bianca', 9.5), ('Ion', 7.0)]

clasament = sorted(elevi, key=lambda e: (-e[1], e[0]))
for loc, (nume, medie) in enumerate(clasament, start=1):
    print(loc, nume, medie)
```
Rezultatul:
```text
1 Bianca 9.5
2 Mara 9.5
3 Andrei 8.75
4 Ion 7.0
```

:::atentie
## Greșeli frecvente
- Scrii `L = L.sort()`: `sort()` modifică lista și întoarce `None`, deci rămâi cu `L = None`. Scrie doar `L.sort()` sau `L = sorted(L)`.
- Ștergi elemente dintr-o listă în timp ce o parcurgi cu `for`: unele elemente sunt sărite. Construiește o listă nouă.
- `L.remove(x)` șterge doar **prima** apariție a lui x și dă eroare dacă x lipsește.
- `L.index(x)` dă `ValueError` când x nu există. Verifică întâi cu `x in L`.
:::

### 🔮 1.17.3 Citește și prezice

```python
L = [3, 1, 4, 1, 5]
L.sort()
print(L)
L.reverse()
print(L)
```
Ce se afișează pe cele două linii?

### 🤝 1.17.4 Exerciții ghidate

**Exercițiul 1.** Completează o căutare care întoarce toate pozițiile unei valori:
```python
def pozitii(L, x):
    rez = []
    for i in range(len(L)):
        if L[i] == ___:
            rez.append(___)
    return rez

print(pozitii([1, 5, 1, 5], 5))  # [1, 3]
```

**Exercițiul 2.** Sortează o listă descrescător folosind `sort(reverse=True)`.

### 🎯 1.17.5 Exerciții independente

**Exercițiul 1.** Scrie o funcție `sterge_toate(L, x)` care șterge toate aparițiile lui `x` dintr-o listă (atentie la modificarea listei în timpul parcursului — folosește o listă nouă).

**Exercițiul 2.** Scrie o funcție care sortează o listă de tupluri `(nume, nota)` după notă descrescător.

### ✅ 1.17.6 Verifică-ți înțelegerea

1. Ce face `L.sort()`?
   a) Creează listă nouă  b) **Sortează lista pe loc (în place)**  c) Inversează ordinea
      > `L.sort()` rearanjează elementele direct în lista `L` ("în place"), fără să creeze o listă nouă — de aceea nu returnează nimic util, doar modifică lista originală.

2. Diferența între `sort()` și `sorted()`:
   a) Nu există  b) **`sort()` modifică lista, `sorted()` întoarce listă nouă**  c) `sorted()` e mai rapid
      > `sort()` modifică lista existentă și nu întoarce nimic, în timp ce `sorted()` lasă lista originală neatinsă și construiește o listă nouă sortată, ca în exemplul `sorted_L = sorted(L)`.

3. `L.reverse()`:
   a) Sortează  b) **Inversează ordinea elementelor**  c) Șterge ultimul
      > `reverse()` doar schimbă ordinea curentă a elementelor (le pune invers), fără a le sorta după valoare, spre deosebire de `sort()`.

4. O căutare liniară are complexitate:
   a) O(1)  b) **O(n)**  c) O(log n)
      > Căutarea liniară verifică elementele unul câte unul, deci în cel mai rău caz parcurge toate cele `n` elemente, ceea ce dă o complexitate O(n), la fel ca în funcția `cauta` din lecție.


:::verifica-cod
Completează căutarea liniară care întoarce poziția primei apariții a lui x sau -1 dacă x lipsește. Programul afișează rezultatele pentru 9 și 4.
template: def cauta(L, x):
    for i in range(len(L)):
        if L[i] == x:
            return ___
    return -1

print(cauta([3, 9, 2, 9], 9), cauta([3, 9, 2, 9], 4))
output: 1 -1
:::

# Modulul 1.18 — Generarea sistematica a secventelor de valori

### 🔄 1.18.1 Recapitulare

Ai generat multe liste manual. Acum învățăm să generăm **toate combinațiile** posibile cu bucle — o tehnică esențială la probleme de tip „toate variantele".

### 💡 1.18.2 Concept nou și exemplu

```python
# Toate perechile (i, j) cu i, j în 0..2
for i in range(3):
    for j in range(3):
        print(i, j)

# Toate numerele de 3 cifre cu cifrele 1,2,3
for a in [1, 2, 3]:
    for b in [1, 2, 3]:
        for c in [1, 2, 3]:
            print(a, b, c)

# Combinări cu range și condiții
perechi = [(x, y) for x in range(5) for y in range(5) if x < y]
print(perechi)
```

## Problemă rezolvată pas cu pas

**Enunț.** Câte numere de 3 cifre au suma cifrelor egală cu 10? Le generăm sistematic, cifră cu cifră.

**Ideea.** Prima cifră ia valori de la 1 la 9, celelalte de la 0 la 9. Trei bucle imbricate parcurg toate cele 900 de numere, iar noi numărăm doar ce respectă condiția.

```python
nr = 0
for a in range(1, 10):
    for b in range(10):
        for c in range(10):
            if a + b + c == 10:
                nr += 1
print(nr)
```
Rezultatul: `54`.

:::atentie
## Greșeli frecvente
- Folosești aceeași variabilă în ambele bucle (`for i ...: for i ...`): bucla interioară strică valoarea celei exterioare.
- Generezi și perechea (a, b), și perechea (b, a) când ordinea nu contează. Pornește bucla interioară de la `a + 1`.
- Pentru numere de 3 cifre lași prima cifră să fie 0: rezultatul e de fapt un număr de 2 cifre. Prima cifră începe de la 1.
- Numărul de combinații crește foarte repede: 3 bucle de câte 100 de valori înseamnă un milion de pași.
:::

### 🔮 1.18.3 Citește și prezice

```python
total = 0
for i in range(1, 4):
    for j in range(1, 4):
        total += i * j
print(total)
```
Ce valoare se afișează? (E suma tuturor produselor i*j pentru i,j în 1,2,3.)

### 🤝 1.18.4 Exerciții ghidate

**Exercițiul 1.** Completează pentru a afișa toate perechile (a, b) cu a < b, a, b ∈ {1,2,3,4}:
```python
for a in range(1, 5):
    for b in range(___, 5):
        print(a, b)
```

**Exercițiul 2.** Parcurge numerele de 2 cifre (de la 10 la 99) și afișează câte dintre ele sunt pare și care este suma lor.

### 🎯 1.18.5 Exerciții independente

**Exercițiul 1.** Generează toate numerele de 3 cifre care au cifrele în ordine strict crescătoare.

**Exercițiul 2.** Scrie toate șirurile binare de lungime 4 (ex. 0000, 0001, ... 1111).

### ✅ 1.18.6 Verifică-ți înțelegerea

1. O buclă `for` în interiorul alteia generează:
   a) O singură valoare  b) **Toate combinațiile**  c) O listă sortată
      > Fiecare valoare a buclei exterioare se combină pe rând cu fiecare valoare a buclei interioare, deci imbricarea generează toate combinațiile posibile de perechi (i, j), nu doar una singură.

2. `for i in range(3): for j in range(3):` produce de câte ori corpul interior?
   a) 3  b) **9**  c) 6
      > Bucla interioară `for j in range(3)` rulează complet (3 execuții) pentru fiecare din cele 3 valori ale lui `i`, deci corpul interior se execută de 3 × 3 = 9 ori.

3. List comprehension-ul `[(x, y) for x in range(2) for y in range(2)]` are:
   a) 2 elemente  b) **4 elemente**  c) 1 element
      > Fiecare din cele 2 valori posibile ale lui `x` se combină cu fiecare din cele 2 valori ale lui `y`, deci rezultă 2 × 2 = 4 perechi (x, y).

4. Generarea sistematică e utilă pentru:
   a) Sortare  b) **A testa toate variantele posibile**  c) Citirea fișierelor
      > Bucle imbricate generează sistematic fiecare combinație posibilă de valori, exact ceea ce e necesar la probleme unde trebuie verificate toate variantele posibile, nu doar câteva alese la întâmplare.


:::verifica-cod
Completează limitele buclei interioare, ca programul să numere perechile (a, b) cu 1 ≤ a < b ≤ 5.
template: nr = 0
for a in range(1, 6):
    for b in range(___, 6):
        nr += 1
print(nr)
output: 10
:::

# Modulul 1.19 — Sortare: selectia minimului

### 🔄 1.19.1 Recapitulare

Ai folosit `L.sort()` (1.17) fără să știi cum funcționează. Acum implementăm o sortare de la zero — algoritmul **Selecția minimului**.

### 💡 1.19.2 Concept nou și exemplu

Ideea: la fiecare pas, găsești cel mai mic element din restul nesortat și îl pui la locul corect.

```python
def selectie_minim(L):
    n = len(L)
    for i in range(n):
        minim = i
        for j in range(i + 1, n):
            if L[j] < L[minim]:
                minim = j
        L[i], L[minim] = L[minim], L[i]
    return L

print(selectie_minim([5, 2, 9, 1, 5, 6]))  # [1, 2, 5, 5, 6, 9]
```

Complexitate: O(n²) — pentru fiecare poziție parcurgem restul.

## Problemă rezolvată pas cu pas

**Enunț.** Urmărim pas cu pas selecția minimului pe lista [29, 10, 14, 37, 13], afișând lista după fiecare pas.

**Ideea.** La pasul i căutăm poziția minimului în porțiunea L[i:] și îl aducem pe poziția i. După fiecare pas, primele i + 1 elemente sunt la locul lor definitiv.

```python
L = [29, 10, 14, 37, 13]
n = len(L)
for i in range(n - 1):
    p = i
    for j in range(i + 1, n):
        if L[j] < L[p]:
            p = j
    L[i], L[p] = L[p], L[i]
    print('pasul', i + 1, L)
```
Rezultatul:
```text
pasul 1 [10, 29, 14, 37, 13]
pasul 2 [10, 13, 14, 37, 29]
pasul 3 [10, 13, 14, 37, 29]
pasul 4 [10, 13, 14, 29, 37]
```

:::atentie
## Greșeli frecvente
- Interschimbi în bucla interioară, la fiecare element mai mic găsit. Algoritmul tot sortează, dar face mult mai multe interschimbări. Interschimbarea se face o singură dată, după bucla interioară.
- Pornești bucla interioară de la 0 în loc de `i + 1` și compari cu elemente deja așezate.
- Reții valoarea minimă, dar nu și **poziția** ei: atunci nu știi ce element să interschimbi.
- Uiți că funcția modifică lista primită. Dacă ai nevoie de original, sortează o copie: `selectie(L[:])`.
:::

### 🔮 1.19.3 Citește și prezice

```python
def selectie_minim(L):
    n = len(L)
    for i in range(n):
        minim = i
        for j in range(i + 1, n):
            if L[j] < L[minim]:
                minim = j
        L[i], L[minim] = L[minim], L[i]
    return L

rez = selectie_minim([3, 1, 2])
print(rez)
```
Ce listă se afișează?

### 🤝 1.19.4 Exerciții ghidate

**Exercițiul 1.** Completează bucla interioară care găsește poziția minimului:
```python
def selectie_minim(L):
    n = len(L)
    for i in range(n):
        minim = i
        for j in range(___, n):
            if L[j] < L[minim]:
                minim = ___
        L[i], L[minim] = L[minim], L[i]
    return L
```

**Exercițiul 2.** Numără câte comparări face selecția minimului pentru o listă de 5 elemente (scrie un contor în interiorul `if`).

### 🎯 1.19.5 Exerciții independente

**Exercițiul 1.** Scrie o variantă care sortează descrescător (găsește maximul, nu minimul).

**Exercițiul 2.** Implementează o funcție care întoarce și lista de poziții unde au avut loc interschimbările.

### ✅ 1.19.6 Verifică-ți înțelegerea

1. Ce face selecția minimului la fiecare pas?
   a) Schimbă primele două  b) **Pune minimul restului la poziția curentă**  c) Sortează recursiv
      > La fiecare pas `i`, algoritmul caută cea mai mică valoare din porțiunea nesortată rămasă (de la `i` încolo) și o interschimbă la poziția `i`, așezând astfel minimul exact acolo unde trebuie să fie.

2. Complexitatea selecției minimului e:
   a) O(n)  b) **O(n²)**  c) O(log n)
      > Pentru fiecare din cele n poziții exterioare se parcurge din nou restul listei pentru a găsi minimul, deci numărul total de comparații crește proporțional cu n², adică O(n²).

3. După primul pas pe `[5, 2, 9, 1]`, primul element devine:
   a) 5  b) **1**  c) 2
      > Cel mai mic element din `[5, 2, 9, 1]` este 1, iar algoritmul îl interschimbă la poziția 0 chiar la primul pas, deci primul element devine 1.

4. Interschimbarea `L[i], L[minim] = ...` se numește:
   a) Atribuire  b) **Swap**  c) Append
      > Interschimbarea a două valori între ele, ca în `L[i], L[minim] = L[minim], L[i]`, poartă numele de swap — se schimbă locul, nu se face doar o simplă atribuire de la o singură sursă.


:::verifica-cod
Completează condiția ca selecția să sorteze **descrescător** (aducând la fiecare pas maximul pe poziția curentă).
template: L = [4, 9, 1, 7]
for i in range(len(L)):
    p = i
    for j in range(i + 1, len(L)):
        if L[j] ___ L[p]:
            p = j
    L[i], L[p] = L[p], L[i]
print(L)
output: [9, 7, 4, 1]
:::

# Modulul 1.20 — Sortare: metoda bulelor si lista de frecvente

### 🔄 1.20.1 Recapitulare

Ai implementat selecția minimului (1.19). Mai există o metodă simplă și vizuală: **metoda bulelor** (bubble sort). Și o tehnică complet diferită: **sortarea prin numărare (counting sort)**.

### 💡 1.20.2 Concept nou și exemplu

**Metoda bulelor:** comparezi elementele alăturate și le interschimbi dacă sunt în ordine greșită; cel mai mare „plutește" la capăt.

```python
def bubble(L):
    n = len(L)
    for i in range(n):
        for j in range(0, n - i - 1):
            if L[j] > L[j + 1]:
                L[j], L[j + 1] = L[j + 1], L[j]
    return L

print(bubble([5, 1, 4, 2, 8]))  # [1, 2, 4, 5, 8]
```

**Lista de frecvențe (counting sort) pentru valori mici:** numeri de câte ori apare fiecare valoare, apoi reconstruiești.

```python
def counting_sort(lista, max_val):
    freq = [0] * (max_val + 1)
    for x in lista:
        freq[x] += 1
    rez = []
    for val in range(max_val + 1):
        rez.extend([val] * freq[val])
    return rez

print(counting_sort([2, 3, 2, 1, 3], 3))  # [1, 2, 2, 3, 3]
```

## Problemă rezolvată pas cu pas

**Enunț.** Avem notele de la o lucrare (de la 1 la 10). Afișăm câți elevi au luat fiecare notă care apare și nota cea mai frecventă, folosind o listă de frecvențe.

**Ideea.** `frecv[nota]` numără aparițiile fiecărei note. Parcurgând lista de frecvențe în ordine, obținem automat notele sortate crescător.

```python
note = [7, 9, 10, 7, 8, 9, 7, 5, 10, 9, 7]
frecv = [0] * 11
for n in note:
    frecv[n] += 1

for nota in range(1, 11):
    if frecv[nota] > 0:
        print(nota, frecv[nota])
print('cea mai frecventă:', frecv.index(max(frecv)))
```
Rezultatul:
```text
5 1
7 4
8 1
9 3
10 2
cea mai frecventă: 7
```

:::atentie
## Greșeli frecvente
- Bucla interioară merge până la `n` în loc de `n - i - 1`: `L[j + 1]` iese din listă (`IndexError`).
- Folosești `>=` în loc de `>`: interschimbi și elemente egale, deci faci pași inutili și schimbi ordinea elementelor egale.
- La lista de frecvențe, dimensiunea e prea mică: pentru valori până la 10 ai nevoie de `[0] * 11` (indicii 0–10).
- Folosești lista de frecvențe pentru valori uriașe sau negative. Metoda e bună doar pentru valori mici, naturale.
:::

### 🔮 1.20.3 Citește și prezice

```python
def bubble(L):
    n = len(L)
    for i in range(n):
        for j in range(0, n - i - 1):
            if L[j] > L[j + 1]:
                L[j], L[j + 1] = L[j + 1], L[j]
    return L

rez = bubble([3, 2, 1])
print(rez)
```
Ce listă se afișează?

### 🤝 1.20.4 Exerciții ghidate

**Exercițiul 1.** Completează condiția de interschimbare din bubble sort:
```python
def bubble(L):
    n = len(L)
    for i in range(n):
        for j in range(0, n - i - 1):
            if L[j] ___ L[j + 1]:   # interschimbă dacă sunt în ordine greșită
                L[j], L[j + 1] = L[j + 1], L[j]
    return L
```

**Exercițiul 2.** Scrie `counting_sort` pentru o listă de note (valori 1–10).

### 🎯 1.20.5 Exerciții independente

**Exercițiul 1.** Adaugă o condiție de oprire timpurie la bubble sort (dacă o tură trece fără nicio interschimbare, lista e sortată).

**Exercițiul 2.** Folosește lista de frecvențe pentru a afla care e cea mai frecventă valoare dintr-o listă.

### ✅ 1.20.6 Verifică-ți înțelegerea

1. Ce „plutește" la capăt în bubble sort?
   a) Minimul  b) **Maximul**  c) Elementul din mijloc
      > La fiecare tură, comparațiile succesive între vecini împing progresiv cea mai mare valoare rămasă spre capătul din dreapta, motiv pentru care se spune că maximul "plutește" la capăt.

2. Bubble sort are complexitate:
   a) O(n)  b) **O(n²)**  c) O(log n)
      > Pentru fiecare din cele n ture se compară din nou aproape toate perechile alăturate, ceea ce înseamnă tot n operații repetate de n ori, deci O(n²), la fel ca la selecția minimului.

3. Counting sort e eficient când:
   a) Valorile sunt mari și dispersate  b) **Valorile sunt mici și într-un interval cunoscut**  c) Lista e deja sortată
      > Counting sort funcționează eficient doar când valorile sunt mici și încap într-un interval cunoscut, pentru că se construiește un tablou de frecvențe indexat direct de acele valori (`freq = [0] * (max_val + 1)`).

4. `freq[x] += 1` în counting sort:
   a) Adaugă x la rezultat  b) **Numără o apariție a lui x**  c) Șterge x
      > Linia `freq[x] += 1` incrementează contorul de la poziția `x`, numărând astfel o nouă apariție a valorii `x` în lista de intrare, fără să adauge nimic direct la rezultatul final.


:::verifica-cod
Completează bubble sort cu oprire timpurie: dacă într-o trecere nu s-a făcut nicio interschimbare, lista e deja sortată și ne oprim.
template: L = [3, 1, 2, 4, 5]
n = len(L)
for i in range(n):
    schimbat = False
    for j in range(n - i - 1):
        if L[j] > L[j + 1]:
            L[j], L[j + 1] = L[j + 1], L[j]
            schimbat = True
    if not schimbat:
        ___
print(L, i)
output: [1, 2, 3, 4, 5] 1
:::
