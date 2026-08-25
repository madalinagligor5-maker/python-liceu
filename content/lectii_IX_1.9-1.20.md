# Modulul 1.9 — Conversia numerelor intre baze de numeratie

### 🔄 1.9.1 Recapitulare

Ai folosit până acum numere în baza 10 (zecimală) fără să te gândești la asta: cifrele 0–9, iar poziția fiecăreia înseamnă o putere a lui 10. Calculatorul, însă, lucrează în bază 2 (binară). În acest modul învățăm să trecem un număr dintr-o bază în alta.

### 💡 1.9.2 Concept nou și exemplu

Un număr în bază `b` este scris cu cifre de la `0` la `b-1`. Valoarea lui este suma `cifră × b^poziție`.

**Din zecimal în altă bază (metoda împărțirilor repetate):**
Împarți numărul la bază, notezi restul (e o cifră), continui cu câtul, până câtul devine 0. Cifrele rezultate se citesc de jos în sus.

```python
def in_baza(n, b):
    if n == 0:
        return "0"
    cifre = ""
    while n > 0:
        cifre = str(n % b) + cifre
        n = n // b
    return cifre

print(in_baza(13, 2))   # 1101  (13 în binar)
print(in_baza(255, 16)) # 11111111 -> de fapt 255 = FF in hex, dar cu cifre 0-9: 255 = "11111111"?? atentie!
```

**Atenție:** exemplele de mai sus pentru bază 16 ar trebui să folosească literele A–F. O versiune corectă:

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


:::tip
## Sfaturi & Bune Practici Didactice
:::tip
În Python, primul element dintr-o listă se află la indicele 0, iar ultimul element poate fi accesat direct cu indicele negativ -1!
:::
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

2. La conversia din zecimal în altă bază prin împărțiri repetate, cifrele se citesc:
   a) De sus în jos  b) **De jos în sus**  c) În ordine oarecare

3. Ce valoare are `din_baza("101", 2)`?
   a) 3  b) **5**  c) 101

4. În baza 16, cifra care urmează după 9 este:
   a) 10  b) **A**  c) 0


:::verifica-cod
Scrie o funcție `salut(nume)` care afișează un salut personalizat. Demo: `salut('Ana')` -> `Salut, Ana!`
template: def salut(nume):
    # completeaza
    pass

salut('Ana')
output: Salut, Ana!
:::

# Modulul 1.10 — Ciurul lui Eratostene si exponentiere rapida

### 🔄 1.10.1 Recapitulare

Ai învățat să verifici dacă un număr este divizor al altuia (1.8) și să parcurgi intervale cu `for`. Acum folosim parcurgerea pentru a găsi toate numerele prime dintr-un interval — o problemă frecventă la olimpiade.

### 💡 1.10.2 Concept nou și exemplu

Un număr **prim** are exact doi divizori: 1 și el însuși. **Ciurul lui Eratostene** găsește toate numerele prime până la `n`:
1. Marchezi toate numerele de la 2 la `n` ca fiind prime.
2. Pentru fiecare număr `p` nescris ca neprim, elimini toate multiplii lui `p`.
3. Rămân primele neradiate.

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


:::tip
## Sfaturi & Bune Practici Didactice
:::tip
Căutarea secvențială parcurge fiecare element pe rând; dacă lista este ordonată, căutarea binară este mult mai rapidă (complexitate O(log n))!
:::
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

2. În ciurul lui Eratostene, începem eliminarea multiplilor de la:
   a) `p`  b) **`p * p`**  c) `2 * p`

3. Exponențierea rapidă reduce timpul de la O(e) la:
   a) O(e²)  b) **O(log e)**  c) O(1)

4. `putere_rapida(2, 10)` returnează:
   a) 100  b) **1024**  c) 20


:::verifica-cod
Scrie o funcție `salut(nume)` care afișează un salut personalizat. Demo: `salut('Ana')` -> `Salut, Ana!`
template: def salut(nume):
    # completeaza
    pass

salut('Ana')
output: Salut, Ana!
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


:::tip
## Sfaturi & Bune Practici Didactice
:::atentie
La determinarea minimului sau maximului, inițializează variabila de sprijin cu primul element din listă (v[0]), nu cu 0 sau o valoare arbitrară!
:::
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

2. Ce face `__init__`?
   a) Șterge obiectul  b) **Se apelează la crearea obiectului**  c) Calculează ceva

3. Ce înseamnă `self`?
   a) Clasa  b) **Obiectul curent**  c) O variabilă globală

4. `p = Punct(3, 4)` creează:
   a) O clasă  b) **O instanță (obiect)**  c) O funcție


:::verifica-cod
Scrie o funcție `salut(nume)` care afișează un salut personalizat. Demo: `salut('Ana')` -> `Salut, Ana!`
template: def salut(nume):
    # completeaza
    pass

salut('Ana')
output: Salut, Ana!
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


:::tip
## Sfaturi & Bune Practici Didactice
:::tip
Bubble Sort compară și schimbă elementele adiacente la fiecare pas, în timp ce Selection Sort caută minimul din restul tabloului și îl plasează la poziția curentă!
:::
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

2. Ce face `mainloop()`?
   a) Închide fereastra  b) **Ține fereastra deschisă și așteaptă evenimente**  c) Creează widget-uri

3. Ce argument primește `Button` pentru a ști ce să execute la click?
   a) `text`  b) **`command`**  c) `pack`

4. `pack()` servește la:
   a) **Aranjarea widget-ului în fereastră**  b) Închiderea ferestrei  c) Citirea input-ului


:::verifica-cod
Scrie o funcție `salut(nume)` care afișează un salut personalizat. Demo: `salut('Ana')` -> `Salut, Ana!`
template: def salut(nume):
    # completeaza
    pass

salut('Ana')
output: Salut, Ana!
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
tk.Label(f, text="Nume:").grid(row=0, column=0)
tk.Entry(f).grid(row=0, column=1)
tk.Label(f, text="Vârsta:").grid(row=1, column=0)
tk.Entry(f).grid(row=1, column=1)
```


:::tip
## Sfaturi & Bune Practici Didactice
:::atentie
La matrice (liste de liste), primul indice reprezintă linia, iar al doilea indice reprezintă coloana: matrice[linie][coloana]!
:::
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

2. Cu ce legi o funcție de o tastă?
   a) `command`  b) **`bind`**  c) `grid`

3. În `grid(row=1, column=0)`, textul apare:
   a) Coloana 1, rândul 0  b) **Rândul 1, coloana 0**  c) Centrat

4. `f.bind("<Key>", func)` apelează `func`:
   a) La click  b) **La orice tastă**  c) La închiderea ferestrei


:::verifica-cod
Scrie o funcție `salut(nume)` care afișează un salut personalizat. Demo: `salut('Ana')` -> `Salut, Ana!`
template: def salut(nume):
    # completeaza
    pass

salut('Ana')
output: Salut, Ana!
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


:::tip
## Sfaturi & Bune Practici Didactice
:::tip
Pe diagonala principală a unei matrice pătratice n x n avem i == j, iar pe diagonala secundară i + j == n - 1!
:::
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

2. Ce face modul `"w"`?
   a) Adaugă la sfârșit  b) **Șterge și scrie de la început**  c) Doar citește

3. De ce e recomandat `with open(...) as f`?
   a) E mai scurt  b) **Închide fișierul automat**  c) Permite citirea binară

4. `f.read()` citește:
   a) O linie  b) **Tot conținutul**  c) Primul caracter


:::verifica-cod
Scrie o funcție `salut(nume)` care afișează un salut personalizat. Demo: `salut('Ana')` -> `Salut, Ana!`
template: def salut(nume):
    # completeaza
    pass

salut('Ana')
output: Salut, Ana!
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


:::tip
## Sfaturi & Bune Practici Didactice
:::tip
În Python șirurile de caractere sunt imutabile. Orice metodă de tipul .upper() sau .replace() returnează un șir nou fără a modifica șirul original!
:::
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

2. Într-o coadă, primul servit este:
   a) **Cel mai recent adăugat** (greșit — e invers)  b) **Cel mai vechi adăugat**  c) Cel mai mare

3. `stiva.pop()` returnează:
   a) Primul element  b) **Ultimul element adăugat**  c) Lista goală

4. Pentru coadă în Python folosim:
   a) `list` cu `pop()`  b) **`deque` cu `popleft()`**  c) `set`


:::verifica-cod
Scrie o funcție `salut(nume)` care afișează un salut personalizat. Demo: `salut('Ana')` -> `Salut, Ana!`
template: def salut(nume):
    # completeaza
    pass

salut('Ana')
output: Salut, Ana!
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


:::tip
## Sfaturi & Bune Practici Didactice
:::tip
Metoda .find() returnează -1 dacă subșirul nu este găsit, spre deosebire de .index() care aruncă o eroare ValueError!
:::
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

2. `L[1:3]` este un:
   a) Element  b) **Slice (sublistă)**  c) Index negativ

3. Ce face `L.append(x)`?
   a) Inserează la început  b) **Adaugă la sfârșit**  c) Șterge x

4. `5 in L` returnează:
   a) Poziția lui 5  b) **True/False dacă 5 e în listă**  c) Numărul de apariții


:::verifica-cod
Scrie o funcție `salut(nume)` care afișează un salut personalizat. Demo: `salut('Ana')` -> `Salut, Ana!`
template: def salut(nume):
    # completeaza
    pass

salut('Ana')
output: Salut, Ana!
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


:::tip
## Sfaturi & Bune Practici Didactice
:::tip
Metoda .split() fără parametri împarte textul după orice spațiu alb (spații, tab-uri, newline) și elimină spațiile libere multiple automat!
:::
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

2. Diferența între `sort()` și `sorted()`:
   a) Nu există  b) **`sort()` modifică lista, `sorted()` întoarce listă nouă**  c) `sorted()` e mai rapid

3. `L.reverse()`:
   a) Sortează  b) **Inversează ordinea elementelor**  c) Șterge ultimul

4. O căutare liniară are complexitate:
   a) O(1)  b) **O(n)**  c) O(log n)


:::verifica-cod
Scrie o funcție `salut(nume)` care afișează un salut personalizat. Demo: `salut('Ana')` -> `Salut, Ana!`
template: def salut(nume):
    # completeaza
    pass

salut('Ana')
output: Salut, Ana!
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


:::tip
## Sfaturi & Bune Practici Didactice
:::atentie
O funcție oprește executarea imediat ce întâlnește instrucțiunea return. Codul scris după return în același bloc nu va fi executat niciodată!
:::
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

**Exercițiul 2.** Generează toate numerele de 2 cifre (de la 10 la 99) care sunt pare.

### 🎯 1.18.5 Exerciții independente

**Exercițiul 1.** Generează toate numerele de 3 cifre care au cifrele în ordine strict crescătoare.

**Exercițiul 2.** Scrie toate șirurile binare de lungime 4 (ex. 0000, 0001, ... 1111).

### ✅ 1.18.6 Verifică-ți înțelegerea

1. O buclă `for` în interiorul alteia generează:
   a) O singură valoare  b) **Toate combinațiile**  c) O listă sortată

2. `for i in range(3): for j in range(3):` produce de câte ori corpul interior?
   a) 3  b) **9**  c) 6

3. List comprehension-ul `[(x, y) for x in range(2) for y in range(2)]` are:
   a) 2 elemente  b) **4 elemente**  c) 1 element

4. Generarea sistematică e utilă pentru:
   a) Sortare  b) **A testa toate variantele posibile**  c) Citirea fișierelor


:::verifica-cod
Scrie o funcție `salut(nume)` care afișează un salut personalizat. Demo: `salut('Ana')` -> `Salut, Ana!`
template: def salut(nume):
    # completeaza
    pass

salut('Ana')
output: Salut, Ana!
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


:::tip
## Sfaturi & Bune Practici Didactice
:::tip
În Python, obiectele mutabile (cum sunt listele) transmise ca parametri la funcții pot fi modificate direct în interiorul funcției!
:::
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

2. Complexitatea selecției minimului e:
   a) O(n)  b) **O(n²)**  c) O(log n)

3. După primul pas pe `[5, 2, 9, 1]`, primul element devine:
   a) 5  b) **1**  c) 2

4. Interschimbarea `L[i], L[minim] = ...` se numește:
   a) Atribuire  b) **Swap**  c) Append


:::verifica-cod
Scrie o funcție `salut(nume)` care afișează un salut personalizat. Demo: `salut('Ana')` -> `Salut, Ana!`
template: def salut(nume):
    # completeaza
    pass

salut('Ana')
output: Salut, Ana!
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


:::tip
## Sfaturi & Bune Practici Didactice
:::atentie
Modificarea unei variabile globale în interiorul unei funcții necesită cuvântul cheie global; altfel, Python va crea o variabilă locală nouă cu același nume!
:::
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

2. Bubble sort are complexitate:
   a) O(n)  b) **O(n²)**  c) O(log n)

3. Counting sort e eficient când:
   a) Valorile sunt mari și dispersate  b) **Valorile sunt mici și într-un interval cunoscut**  c) Lista e deja sortată

4. `freq[x] += 1` în counting sort:
   a) Adaugă x la rezultat  b) **Numără o apariție a lui x**  c) Șterge x


:::verifica-cod
Scrie o funcție `salut(nume)` care afișează un salut personalizat. Demo: `salut('Ana')` -> `Salut, Ana!`
template: def salut(nume):
    # completeaza
    pass

salut('Ana')
output: Salut, Ana!
:::
