# Conținut lecții — Curs practic de Python, Unitatea 5 (Modulele CP5.1–CP5.4)

Respectă exact structura de pe `academiapython.ro/curs-practic` — 6 sublecții per modul, aceleași etichete/iconuri ca în unitățile anterioare. Unitatea 5 te învață să scrii programe care nu se opresc la prima greșeală, care lucrează cu fișiere și care folosesc bibliotecile gata făcute ale lui Python.

---

# Modulul CP5.1 — Erori și excepții: try / except

### 🔄 CP5.1.1 Recapitulare

Ai întâlnit deja erori: `NameError` când o variabilă nu există, `KeyError` când o cheie lipsește dintr-un dicționar. Până acum, orice eroare oprea programul. În practică însă, datele vin de la oameni și de la fișiere, iar acolo greșelile sunt inevitabile: cineva scrie „zece” în loc de „10”. Un program bun nu se oprește, ci tratează eroarea și continuă.

### 💡 CP5.1.2 Concept nou și exemplu

O eroare apărută în timpul rulării se numește **excepție**. Cu `try` / `except` îi spui lui Python: „încearcă codul acesta; dacă apare excepția X, fă altceva în loc să te oprești”.

```python
text = "zece"
try:
    numar = int(text)
    print("Ai introdus", numar)
except ValueError:
    print("Nu este un număr valid.")
print("Programul continuă.")
```

Rezultatul: `Nu este un număr valid.`, apoi `Programul continuă.`. `int("zece")` produce un `ValueError`, așa că Python sare direct în blocul `except`.

Poți trata separat mai multe tipuri de erori și poți folosi `else` (rulează doar dacă nu a fost nicio eroare) și `finally` (rulează mereu):

```python
def imparte(a, b):
    try:
        rezultat = a / b
    except ZeroDivisionError:
        return "Nu se poate împărți la zero."
    except TypeError:
        return "Ambele valori trebuie să fie numere."
    else:
        return rezultat
    finally:
        print("Calcul încercat.")

print(imparte(10, 4))
print(imparte(5, 0))
```

Rezultatul: `Calcul încercat.`, `2.5`, `Calcul încercat.`, apoi `Nu se poate împărți la zero.`. Mesajul din `finally` apare înaintea rezultatului, pentru că se execută înainte ca funcția să se întoarcă.

Erorile cele mai întâlnite:

- `ValueError`: valoare de tip corect, dar invalidă, ca la `int("abc")`;
- `TypeError`: operație pe tipuri nepotrivite, ca `"3" + 4`;
- `ZeroDivisionError`: împărțire la zero;
- `KeyError` / `IndexError`: cheie inexistentă / poziție în afara listei;
- `FileNotFoundError`: fișierul cerut nu există.

:::exemplu
## Citire sigură de la utilizator
Un tipar foarte des folosit: repeți citirea până primești un număr valid. `while True:` cu `try: varsta = int(input(...))`, `break` la succes și un mesaj prietenos în `except ValueError:`.
:::

:::atentie
## Nu „înghiți” toate erorile
`except:` fără un tip anume prinde orice, inclusiv greșelile tale de scriere a codului, și le ascunde. Prinde doar excepțiile pe care le aștepți (`except ValueError:`), ca restul să rămână vizibile și să le poți repara.
:::

### 🔮 CP5.1.3 Citește și prezice

Fără să rulezi codul, scrie ce afișează:

```python
valori = ["7", "x", "3"]
total = 0
for v in valori:
    try:
        total += int(v)
    except ValueError:
        print("sar peste", v)
print(total)
```

### 🤝 CP5.1.4 Exerciții ghidate

**Exercițiul 1.** Completează tipul excepției, ca programul să afișeze mesajul prietenos în loc să se oprească.

```python
try:
    print(10 / 0)
except ___:
    print("Împărțire la zero!")
```

**Exercițiul 2.** Pentru lista `["12", "abc", "5"]`, transformă fiecare element în număr cu `int()`. Pentru elementele invalide, afișează `invalid`. Pentru cele valide, afișează numărul.

### 🎯 CP5.1.5 Exerciții independente

**Exercițiul 1.** Scrie funcția `numar_sigur(text)`, care întoarce `int(text)` sau `0` dacă textul nu e un număr. Afișează suma pentru `numar_sigur("40") + numar_sigur("doi") + numar_sigur("2")`.

**Exercițiul 2 (mini-proiect de închidere).** Ai stocul `{"mere": 10, "pere": 4}` și comenzile `["mere", "kiwi", "pere"]`. Pentru fiecare comandă, afișează stocul produsului sau, dacă produsul nu există, mesajul `kiwi: indisponibil`. Folosește `try` / `except KeyError`.

### ✅ CP5.1.6 Verifică-ți înțelegerea

1. Ce excepție produce `int("abc")`?
   a) `TypeError`  b) **`ValueError`**  c) `KeyError`
      > Tipul (`str`) e acceptat de `int`, dar valoarea „abc” nu poate fi transformată în număr, deci apare `ValueError`.

2. Când rulează blocul `finally`?
   a) Doar dacă a apărut o eroare  b) Doar dacă nu a apărut nicio eroare  c) **Mereu, la final**
      > `finally` se execută indiferent dacă a apărut sau nu o excepție. E locul potrivit pentru „curățenie”, de exemplu închiderea unei conexiuni.

3. De ce nu e bine să scrii `except:` fără tip?
   a) E mai lent  b) **Ascunde și greșelile din cod pe care nu le așteptai**  c) Nu e permis de Python
      > Un `except` gol prinde orice excepție, inclusiv greșeli de programare, care ar trebui să rămână vizibile.

4. Ce face blocul `else` dintr-un `try`?
   a) Rulează când apare o eroare  b) **Rulează doar dacă blocul `try` s-a terminat fără eroare**  c) Înlocuiește `except`
      > `else` conține codul care trebuie să ruleze doar după un `try` reușit.

:::verifica-cod
Completează tipul excepției, ca programul să afișeze exact „Cheie lipsă”.
template: preturi = {"ceai": 9}
try:
    print(preturi["cafea"])
except ___:
    print("Cheie lipsă")
output: Cheie lipsă
:::

---

# Modulul CP5.2 — Fișiere text: citire și scriere

### 🔄 CP5.2.1 Recapitulare

Toate datele cu care ai lucrat până acum dispăreau când programul se termina. Ca să păstrezi o listă de cumpărături, un jurnal sau rezultatele unui calcul, trebuie să le salvezi într-un **fișier**. Ai învățat și `try` / `except`, care te ajută când un fișier lipsește.

### 💡 CP5.2.2 Concept nou și exemplu

Un fișier se deschide cu `open(nume, mod)`. Cel mai sigur mod este cu `with`, care închide automat fișierul la final, chiar dacă apare o eroare. Modurile principale sunt `"w"` (scriere, șterge conținutul vechi), `"a"` (adăugare la final) și `"r"` (citire).

```python
with open("note.txt", "w", encoding="utf-8") as f:
    f.write("Ana 9\n")
    f.write("Radu 7\n")

with open("note.txt", "r", encoding="utf-8") as f:
    continut = f.read()
print(continut.strip())
```

Rezultatul: `Ana 9`, apoi `Radu 7`. `\n` înseamnă „rând nou”: `write` nu îl adaugă singur. `encoding="utf-8"` asigură că diacriticele se salvează și se citesc corect.

De cele mai multe ori citești fișierul rând cu rând, cu un `for`:

```python
with open("cumparaturi.txt", "w", encoding="utf-8") as f:
    f.write("lapte\npâine\nouă\n")

with open("cumparaturi.txt", encoding="utf-8") as f:
    for numar, rand in enumerate(f, start=1):
        print(numar, rand.strip())
```

Rezultatul: `1 lapte`, `2 pâine`, apoi `3 ouă`. `strip()` elimină `\n` de la finalul fiecărui rând, iar `enumerate` numerotează rândurile.

Modul `"a"` adaugă la finalul fișierului, fără să șteargă ce există:

```python
with open("jurnal.txt", "w", encoding="utf-8") as f:
    f.write("luni: start\n")
with open("jurnal.txt", "a", encoding="utf-8") as f:
    f.write("marți: progres\n")
with open("jurnal.txt", encoding="utf-8") as f:
    print(len(f.readlines()))
```

Rezultatul: `2`.

:::exemplu
## Unde ajunge fișierul?
Un nume simplu, ca `"note.txt"`, creează fișierul în folderul din care rulezi programul. În editorul din browser al acestui curs, fișierele trăiesc doar cât e deschisă pagina: perfect pentru exersare.
:::

:::atentie
## `"w"` șterge tot
Deschiderea cu `"w"` golește imediat fișierul, chiar înainte să scrii ceva. Dacă vrei să păstrezi ce era acolo și doar să adaugi, folosește `"a"`. Iar citirea unui fișier inexistent dă `FileNotFoundError`: prinde-l cu `try` / `except` când nu ești sigur că fișierul există.
:::

### 🔮 CP5.2.3 Citește și prezice

Fără să rulezi codul, scrie ce afișează:

```python
with open("t.txt", "w", encoding="utf-8") as f:
    f.write("unu\n")
with open("t.txt", "w", encoding="utf-8") as f:
    f.write("doi\n")
with open("t.txt", encoding="utf-8") as f:
    print(f.read().strip())
```

### 🤝 CP5.2.4 Exerciții ghidate

**Exercițiul 1.** Completează modul de deschidere, ca al doilea rând să fie adăugat, nu să-l înlocuiască pe primul. Programul trebuie să afișeze `2`.

```python
with open("lista.txt", "w", encoding="utf-8") as f:
    f.write("primul\n")
with open("lista.txt", ___, encoding="utf-8") as f:
    f.write("al doilea\n")
with open("lista.txt", encoding="utf-8") as f:
    print(len(f.readlines()))
```

**Exercițiul 2.** Scrie în fișierul `orase.txt` orașele `Cluj`, `Iași` și `Arad`, câte unul pe rând. Apoi citește fișierul și afișează orașele pe un singur rând, separate prin virgulă și spațiu.

### 🎯 CP5.2.5 Exerciții independente

**Exercițiul 1.** Scrie în fișierul `cheltuieli.txt` sumele `120`, `45` și `80`, câte una pe rând. Apoi citește fișierul și afișează totalul cheltuielilor.

**Exercițiul 2 (mini-proiect de închidere).** Scrie funcția `citeste_sigur(nume)`, care întoarce conținutul fișierului sau textul `Fișierul nu există.` dacă fișierul lipsește. Apelează funcția pentru fișierul `lipsa.txt`, care nu există, și afișează rezultatul.

### ✅ CP5.2.6 Verifică-ți înțelegerea

1. Ce face modul `"a"` la deschiderea unui fișier?
   a) Șterge conținutul  b) **Adaugă la final, păstrând ce exista**  c) Deschide doar pentru citire
      > `"a"` vine de la „append”: textul nou se scrie după conținutul existent.

2. De ce folosim `with open(...) as f:`?
   a) E singura metodă care merge  b) **Închide automat fișierul la final**  c) Citește mai repede
      > Blocul `with` garantează închiderea fișierului, chiar dacă apare o eroare în interior.

3. Ce excepție apare la citirea unui fișier care nu există?
   a) `KeyError`  b) `ValueError`  c) **`FileNotFoundError`**
      > Deschiderea în modul `"r"` a unui fișier inexistent produce `FileNotFoundError`.

4. De ce folosim `.strip()` pe rândurile citite?
   a) Ca să transformăm textul în număr  b) **Ca să eliminăm `\n` și spațiile de la capete**  c) Ca să sortăm rândurile
      > Fiecare rând citit se termină cu `\n`. `strip()` îl elimină, ca textul să fie curat.

:::verifica-cod
Completează modul de deschidere, ca fișierul să fie citit. Programul trebuie să afișeze exact „Salut din fișier”.
template: with open("mesaj.txt", "w", encoding="utf-8") as f:
    f.write("Salut din fișier")
with open("mesaj.txt", ___, encoding="utf-8") as f:
    print(f.read())
output: Salut din fișier
:::

---

# Modulul CP5.3 — Fișiere CSV și JSON

### 🔄 CP5.3.1 Recapitulare

Știi să scrii și să citești fișiere text rând cu rând. Dar datele reale au structură: un tabel cu produse și prețuri, setările unei aplicații. Pentru ele există două formate foarte folosite: **CSV** (tabele, exact ce exportă Excel) și **JSON** (date organizate ca dicționare și liste, folosit de aproape toate aplicațiile web).

### 💡 CP5.3.2 Concept nou și exemplu

Un fișier **CSV** („valori separate prin virgulă”) are câte o înregistrare pe rând, iar coloanele sunt separate prin virgulă. Modulul `csv` din Python îl citește corect, chiar și când un câmp conține virgule între ghilimele. `csv.DictReader` îți dă fiecare rând ca un dicționar, cu cheile luate din primul rând, cel de antet.

```python
import csv

with open("produse.csv", "w", encoding="utf-8", newline="") as f:
    f.write("produs,pret,cantitate\n")
    f.write("cafea,18,2\n")
    f.write("ceai,9,3\n")

total = 0
with open("produse.csv", encoding="utf-8", newline="") as f:
    for rand in csv.DictReader(f):
        total += float(rand["pret"]) * int(rand["cantitate"])
print(total)
```

Rezultatul: `63.0`. Din CSV, orice valoare vine ca text, de aceea folosim `float()` și `int()` înainte de calcul.

Pentru scriere folosești `csv.writer`:

```python
import csv

with open("raport.csv", "w", encoding="utf-8", newline="") as f:
    scriitor = csv.writer(f)
    scriitor.writerow(["luna", "total"])
    scriitor.writerow(["ianuarie", 1200])
with open("raport.csv", encoding="utf-8") as f:
    print(f.read().splitlines())
```

Rezultatul: `['luna,total', 'ianuarie,1200']`.

**JSON** păstrează direct structuri Python: dicționare, liste, texte, numere, `True`/`False`. `json.dump` scrie, `json.load` citește:

```python
import json

setari = {"tema": "întunecată", "limba": "ro", "notificari": True}
with open("setari.json", "w", encoding="utf-8") as f:
    json.dump(setari, f, ensure_ascii=False)

with open("setari.json", encoding="utf-8") as f:
    citite = json.load(f)
print(citite["tema"], citite["notificari"])
```

Rezultatul: `întunecată True`. `ensure_ascii=False` păstrează diacriticele ca atare în fișier.

:::exemplu
## Text JSON fără fișier
`json.dumps(obiect)` transformă un dicționar în text JSON, iar `json.loads(text)` face invers. Le vei folosi des când primești date de la un site sau trimiți date unui serviciu online.
:::

:::atentie
## `newline=""` la CSV
Pe Windows, fără `newline=""` la deschiderea unui CSV, apar rânduri goale între înregistrări. Pune-l mereu când lucrezi cu modulul `csv`.
:::

### 🔮 CP5.3.3 Citește și prezice

Fără să rulezi codul, scrie ce afișează:

```python
import json

date = json.loads('{"nume": "Ana", "note": [9, 10, 8]}')
print(date["nume"], len(date["note"]))
print(max(date["note"]))
```

### 🤝 CP5.3.4 Exerciții ghidate

**Exercițiul 1.** Completează funcția care transformă textul JSON într-un dicționar, ca programul să afișeze `Cluj`.

```python
import json

text = '{"oras": "Cluj", "populatie": 286598}'
date = json.___(text)
print(date["oras"])
```

**Exercițiul 2.** Scrie fișierul CSV `elevi.csv` cu antetul `nume,nota` și rândurile `Ana,9`, `Radu,7` și `Ioana,10`. Citește-l cu `csv.DictReader` și afișează media notelor.

### 🎯 CP5.3.5 Exerciții independente

**Exercițiul 1.** Salvează lista `["pix", "caiet", "riglă"]` în fișierul `rechizite.json` cu `json.dump`, apoi citește-o înapoi cu `json.load` și afișează câte elemente are.

**Exercițiul 2 (mini-proiect de închidere).** Scrie fișierul `vanzari.csv` cu antetul `produs,suma` și rândurile `carte,45`, `pix,5`, `carte,30` și `caiet,12`. Citește-l și afișează totalul vânzărilor pentru `carte`.

### ✅ CP5.3.6 Verifică-ți înțelegerea

1. Ce întoarce `csv.DictReader` pentru fiecare rând?
   a) O listă de numere  b) **Un dicționar cu cheile din antet**  c) Un singur text
      > `DictReader` folosește primul rând ca nume de coloane, așa că fiecare înregistrare devine un dicționar.

2. Ce tip au valorile citite dintr-un CSV?
   a) Numere, automat  b) **Text (`str`), le transformi tu cu `int()` sau `float()`**  c) Depinde de Excel
      > CSV-ul e un fișier text. Python nu ghicește tipurile, așa că valorile vin mereu ca text.

3. Care e diferența dintre `json.load` și `json.loads`?
   a) Nu există diferență  b) **`load` citește dintr-un fișier, `loads` dintr-un text**  c) `loads` e mai nou
      > „s”-ul de la final vine de la „string”: `loads` primește direct un text JSON.

4. Ce face `ensure_ascii=False` la `json.dump`?
   a) Comprimă fișierul  b) **Păstrează diacriticele ca atare în fișier**  c) Verifică dacă JSON-ul e corect
      > Implicit, caracterele non-ASCII sunt scrise ca coduri (`ț`). Cu `ensure_ascii=False`, „ț” rămâne „ț”.

:::verifica-cod
Completează funcția din modulul json care transformă dicționarul în text. Programul trebuie să afișeze exact {"a": 1}.
template: import json
print(json.___({"a": 1}))
output: {"a": 1}
:::

---

# Modulul CP5.4 — Module și biblioteca standard

### 🔄 CP5.4.1 Recapitulare

În modulul anterior ai scris `import csv` și `import json`: ai folosit cod gata făcut, care vine odată cu Python. Colecția aceasta se numește **biblioteca standard** și conține sute de module pentru calcule, date calendaristice, numere aleatoare, texte și multe altele. Înainte să scrii ceva de la zero, merită să verifici dacă există deja.

### 💡 CP5.4.2 Concept nou și exemplu

Un **modul** este un fișier cu funcții gata scrise. Îl aduci în program cu `import`. Ai trei variante:

```python
import math
from math import sqrt
import statistics as st

print(math.pi > 3.14)
print(sqrt(81))
print(st.mean([4, 8, 6]))
```

Rezultatul: `True`, `9.0`, apoi `6`. `import math` aduce tot modulul, deci scrii `math.pi`. `from math import sqrt` aduce doar funcția, pe care o folosești direct. `as st` îi dă modulului un nume mai scurt.

**`math`** are funcții matematice: `sqrt` (radical), `ceil` (rotunjire în sus), `floor` (rotunjire în jos):

```python
import math

print(math.ceil(7 / 2))
print(math.floor(7 / 2))
```

Rezultatul: `4`, apoi `3`. `ceil` e util, de exemplu, ca să afli câte cutii îți trebuie pentru 7 sticle, dacă într-o cutie încap 2.

**`random`** alege la întâmplare. `random.seed(...)` fixează alegerile, ca să obții de fiecare dată același rezultat: util la testare.

```python
import random

random.seed(1)
zar = random.randint(1, 6)
print(1 <= zar <= 6)
print(random.choice(["da"]))
```

Rezultatul: `True`, apoi `da`.

**`datetime`** lucrează cu date calendaristice și intervale:

```python
from datetime import date, timedelta

inscriere = date(2026, 11, 27)
expirare = inscriere + timedelta(days=30)
print(expirare)
print((expirare - inscriere).days)
print(inscriere.strftime("%d.%m.%Y"))
```

Rezultatul: `2026-12-27`, `30`, apoi `27.11.2026`. `strftime` formatează data, iar `%d.%m.%Y` înseamnă zi.lună.an.

:::exemplu
## Data de azi
`date.today()` îți dă data curentă, iar `datetime.now()` data și ora. Rezultatul diferă de la o zi la alta, de aceea în exerciții folosim date fixe, ca verificarea să fie aceeași pentru toată lumea.
:::

:::atentie
## Nu-ți numi fișierul ca un modul
Dacă salvezi programul ca `random.py` sau `math.py`, `import random` va încărca fișierul tău în locul modulului standard, iar `random.randint` nu va mai exista. Alege nume proprii, ca `joc_zaruri.py`.
:::

### 🔮 CP5.4.3 Citește și prezice

Fără să rulezi codul, scrie ce afișează:

```python
import math
from datetime import date

print(math.ceil(10 / 3))
zi = date(2026, 1, 31)
print(zi.month, zi.day)
```

### 🤝 CP5.4.4 Exerciții ghidate

**Exercițiul 1.** Completează importul, ca programul să afișeze radicalul lui 144.

```python
from math import ___

print(sqrt(144))
```

**Exercițiul 2.** Câte autobuze de câte 40 de locuri sunt necesare pentru 130 de elevi? Folosește `math.ceil` și afișează rezultatul.

### 🎯 CP5.4.5 Exerciții independente

**Exercițiul 1.** Un abonament începe pe 15 ianuarie 2026 și durează 365 de zile. Afișează data de expirare în formatul `zi.lună.an`, de exemplu `15.01.2027`.

**Exercițiul 2 (mini-proiect de închidere).** Folosește modulul `statistics` ca să afișezi, pe rânduri separate, media și mediana timpilor de livrare `[2, 5, 3, 3, 7]` (în zile).

### ✅ CP5.4.6 Verifică-ți înțelegerea

1. După `from math import sqrt`, cum calculezi radicalul lui 16?
   a) `math.sqrt(16)`  b) **`sqrt(16)`**  c) `math(sqrt, 16)`
      > `from ... import` aduce funcția direct, deci o apelezi fără prefixul `math.`.

2. Ce întoarce `math.ceil(4.1)`?
   a) `4`  b) **`5`**  c) `4.1`
      > `ceil` rotunjește mereu în sus, la următorul număr întreg.

3. De ce folosim `random.seed(...)` la testare?
   a) Ca numerele să fie mai mari  b) **Ca alegerile „aleatoare” să fie aceleași la fiecare rulare**  c) E obligatoriu înainte de `randint`
      > Cu aceeași valoare de pornire, `random` produce aceeași secvență, așa că rezultatul poate fi verificat.

4. Ce se întâmplă dacă îți salvezi programul ca `random.py`?
   a) Nimic  b) **`import random` îți încarcă fișierul tău în locul modulului standard**  c) Python îl redenumește automat
      > Python caută întâi în folderul curent, așa că fișierul tău „ascunde” modulul standard cu același nume.

:::verifica-cod
Completează funcția din modulul math care rotunjește în jos. Programul trebuie să afișeze 7.
template: import math
print(math.___(7.9))
output: 7
:::
