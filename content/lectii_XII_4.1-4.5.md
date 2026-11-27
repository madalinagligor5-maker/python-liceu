# Modulul 4.1 — Modelul entitate-relație: entități și atribute

### 🔄 4.1.1 Recapitulare

Ai modelat date cu liste, dicționare, clase Python. În bazele de date relaționale, datele se organizează altfel — prin **entități** și **relații**.

### 💡 4.1.2 Concept nou și exemplu

**Modelul Entitate-Relație (ER)** descrie o bază de date înainte de a o implementa:
- **Entitate**: un obiect din lumea reală despre care stocăm date (ex. `Student`, `Curs`).
- **Atribut**: o proprietate a entității (ex. `Student` are `nume`, `varsta`).
- **Cheie**: atributul care identifică unic o entitate (ex. `CNP` sau `id`).

Exemplu conceptual (nu cod Python, ci model):
```
Student(id, nume, varsta)
Curs(cod, denumire, credite)
```


```python
# Modelăm entitatea Student ca dicționar Python,
# cu atributele si cheia stabilite in modelul ER
student = {
    "id": 1,          # cheie primara - identifica unic entitatea
    "nume": "Ana",
    "varsta": 17
}

def afiseaza_entitate(entitate):
    for atribut, valoare in entitate.items():
        print(f"{atribut}: {valoare}")

afiseaza_entitate(student)
```


:::tip
O entitate = o "tabelă" în SQL; un atribut = o "coloană"; o înregistrare = un "rând".
:::

## Problemă rezolvată pas cu pas

**Enunț.** Avem o listă de elevi. Verificăm care atribut poate fi cheie: unul a cărui valoare nu se repetă la nicio înregistrare.

**Ideea.** Un atribut e candidat la cheie dacă numărul de valori distincte este egal cu numărul de înregistrări. Folosim o mulțime pentru fiecare atribut.

```python
elevi = [
    {'cnp': '501', 'nume': 'Ana', 'clasa': '12A'},
    {'cnp': '502', 'nume': 'Dan', 'clasa': '12A'},
    {'cnp': '503', 'nume': 'Ana', 'clasa': '12B'},
]
for atribut in elevi[0]:
    valori = {e[atribut] for e in elevi}
    print(atribut, 'cheie posibilă' if len(valori) == len(elevi) else 'se repetă')
```
Rezultatul:
```text
cnp cheie posibilă
nume se repetă
clasa se repetă
```

:::atentie
## Greșeli frecvente
- Alegi drept cheie un atribut care se poate repeta (ex. numele): doi elevi cu același nume devin imposibil de deosebit.
- Pui în aceeași entitate date despre lucruri diferite (ex. datele autorului în fiecare carte). Fiecare entitate descrie un singur tip de obiect.
- Confunzi entitatea (tipul, ex. `Student`) cu o înregistrare concretă (Ana, 17 ani).
- Pui într-un atribut o valoare compusă (ex. „Cluj, România”). Un atribut ar trebui să conțină o singură informație.
:::

### 🔮 4.1.3 Citește și prezice

```python
student = {"id": 1, "nume": "Ana", "varsta": 17}
print(student["nume"])
```

Ce afișează programul?


### 🤝 4.1.4 Exerciții ghidate

Definește în Python (ca dicționar) o entitate `Carte` cu atributele `isbn`, `titlu`, `autor`, `an`.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: declarare entitate Carte, cu atribute si cheie
carte = {
    "isbn": "978-973-0",
    "titlu": "Ion",
    "autor": "L. Rebreanu",
    "an": 1920
}

# Pasul 2: afisam cheia si un atribut al entitatii
print("Cheie (isbn):", carte[___])
print("Atribut (titlu):", carte[___])
```


### 🎯 4.1.5 Exerciții independente

Scrie o listă de dicționare care să reprezinte 3 cărți, fiecare cu cele 4 atribute.


**Exercițiul 1.** Scrie o funcție `gaseste_dupa_isbn(carti, isbn)` care primește lista de cărți și un ISBN și returnează dicționarul cărții cu acel ISBN (sau `None` dacă nu există).

**Exercițiul 2.** Extinde funcția anterioară cu o entitate `Autor(id, nume, tara)` separată și afișează, pentru fiecare carte, numele autorului preluat din lista de autori (nu doar stocat direct ca text în `Carte`).


### ✅ 4.1.6 Verifică-ți înțelegerea

1. Într-un tabel `Student` fără nicio coloană-cheie, pot exista două rânduri identice (Ana, 17). De ce este asta o problemă reală, nu doar o chestiune de stil?
   a) pentru că bazele de date interzic prin proiectare rândurile identice  b) **pentru că, fără o valoare unică pe rând, nu poți referi/actualiza/șterge o singură entitate fără ambiguitate**  c) pentru că duplicatele ocupă prea mult spațiu de stocare  d) pentru că interogările SQL devin mai lente, dar rezultatul rămâne corect
      > Cheia identifică unic fiecare rând — fără ea, două înregistrări identice (Ana, 17) devin indistinguibile, deci nu ai cum să spui bazei de date „actualizează exact acest rând” sau „șterge exact acest rând” fără riscul de a lovi și duplicatul.

2. Ce corespunde unei entități când o transformăm într-o bază de date relațională?
   a) Un rând  b) **Un tabel**  c) O valoare
      > Entitatea devine tabel, atributele devin coloane, iar fiecare înregistrare devine un rând.

3. Care atribut e cel mai potrivit drept cheie pentru entitatea `Elev`?
   a) Numele  b) Clasa  c) **Un cod unic (CNP sau id)**
      > Numele și clasa se pot repeta; o cheie trebuie să fie unică pentru fiecare înregistrare.

4. Entitatea `Carte(isbn, titlu, autor, an)` are câte atribute?
   a) 1  b) 3  c) **4**
      > Atributele sunt isbn, titlu, autor și an; isbn poate fi folosit și drept cheie.

---


:::verifica-cod
Scrie o funcție `este_cheie_unica(entitati, cheie)` care primește o listă de entități (dicționare) și numele câmpului-cheie, și returnează `True` dacă valoarea acelui câmp e unică pe fiecare entitate (nu se repetă), altfel `False`. Demo: `este_cheie_unica([{"id": 1, "nume": "Ana"}, {"id": 1, "nume": "Bogdan"}], "id")` -> `False`
template: def este_cheie_unica(entitati, cheie):
    # completeaza
    pass

print(este_cheie_unica([{"id": 1, "nume": "Ana"}, {"id": 1, "nume": "Bogdan"}], "id"))
output: False
:::

# Modulul 4.2 — Modelul entitate-relație: relații și cardinalitate

### 🔄 4.2.1 Recapitulare

În 4.1 ai definit entități izolate. Dar datele reale sunt legate între ele.

### 💡 4.2.2 Concept nou și exemplu

**Relația** leagă entități (ex. `Student` **urmează** `Curs`). **Cardinalitatea** spune câte instanțe sunt implicate:
- **1:1** — un student are un singur buletin.
- **1:N** — un profesor predă mulți studenți.
- **M:N** — un student urmează multe cursuri, un curs are mulți studenți.

Relațiile M:N se rezolva printr-o **tabelă asociativă** (ex. `Inscriere(student_id, curs_id)`).


```python
# Simulam relatia M:N Student-Curs printr-o tabela asociativa,
# reprezentata ca lista de perechi (student_id, curs_id)
inscrieri = [
    (1, "IA"),   # studentul 1 e inscris la cursul IA
    (1, "BD"),   # studentul 1 e inscris si la cursul BD
    (2, "BD"),   # studentul 2 e inscris la cursul BD
]

def cursuri_ale_studentului(inscrieri, student_id):
    return [curs for (sid, curs) in inscrieri if sid == student_id]

print("Cursurile studentului 1:", cursuri_ale_studentului(inscrieri, 1))
```


:::tip
Cardinalitatea M:N nu se poate pune direct ca cheie externă într-o singură tabelă — de aia folosim tabela asociativă.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Elevii participă la cercuri (relație M:N), iar legăturile sunt într-o tabelă asociativă. Afișăm, pentru fiecare cerc, elevii înscriși și cercul cel mai căutat.

**Ideea.** Tabela asociativă are câte un rând pentru fiecare pereche (elev, cerc). Grupăm rândurile după cerc ca să vedem relația din partea cealaltă.

```python
elevi = {1: 'Ana', 2: 'Dan', 3: 'Eva'}
cercuri = {'R': 'Robotică', 'S': 'Șah'}
inscrieri = [(1, 'R'), (2, 'R'), (2, 'S'), (3, 'R')]
pe_cerc = {}
for elev, cerc in inscrieri:
    pe_cerc.setdefault(cerc, []).append(elevi[elev])
for cerc, nume in pe_cerc.items():
    print(cercuri[cerc], nume)
print('cel mai căutat:', cercuri[max(pe_cerc, key=lambda c: len(pe_cerc[c]))])
```
Rezultatul:
```text
Robotică ['Ana', 'Dan', 'Eva']
Șah ['Dan']
cel mai căutat: Robotică
```

:::atentie
## Greșeli frecvente
- Pui cheia externă în partea „1” a unei relații 1:N (ex. o listă de cărți în tabela Autor). Cheia externă merge în partea „N” (fiecare carte reține autorul).
- Modelezi o relație M:N cu o singură cheie externă: un student ar putea fi înscris la un singur curs. Ai nevoie de o tabelă asociativă.
- Confunzi cardinalitatea cu numărul de înregistrări: 1:N spune câte legături poate avea o înregistrare, nu câte rânduri are tabela.
- Uiți că o tabelă asociativă poate avea și atribute proprii (ex. nota studentului la acel curs).
:::

### 🔮 4.2.3 Citește și prezice

```python
entitati_relatie_mn = ["Student", "Curs", "Inscriere"]
print(len(entitati_relatie_mn))
```

Ce afișează programul?


### 🤝 4.2.4 Exerciții ghidate

Modelați relația 1:N "Un autor scrie multe cărți" cu două tabele (`Autor`, `Carte`).


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: relatia 1:N "Un autor scrie multe carti"
autori = {1: "Rebreanu", 2: "Eminescu"}
carti = [
    {"titlu": "Ion", "autor_id": 1},
    {"titlu": "Pădurea spânzuraților", "autor_id": 1},
    {"titlu": "Luceafărul", "autor_id": 2},
]

# Pasul 2: gasim toate cartile scrise de autorul cu id 1
carti_autor = [c["titlu"] for c in ___ if c[___] == 1]
print("Cărțile autorului 1:", carti_autor)
```


### 🎯 4.2.5 Exerciții independente

Modelați relația M:N "Studenți — Proiecte" cu o tabelă asociativă.


**Exercițiul 1.** Scrie un program Python care, pornind de la o listă de tabele asociative `(student_id, proiect_id)`, afișează pentru fiecare student lista proiectelor la care participă.

**Exercițiul 2.** Extinde programul anterior cu o funcție `colegi_de_proiect(inscrieri, student_id)` care returnează toți ceilalți studenți care participă la cel puțin un proiect comun cu studentul dat.


### ✅ 4.2.6 Verifică-ți înțelegerea

1. Vrei să modelezi relația M:N Student–Curs punând o coloană `curs_id` direct în tabela `Student`. De ce eșuează abordarea asta când un student urmează mai multe cursuri?
   a) **pentru că o coloană poate ține o singură valoare pe rând, deci nu poți stoca simultan mai multe `curs_id` pentru același student fără să încalci atomicitatea datelor**  b) pentru că SQL limitează o tabelă la o singură cheie externă  c) pentru că ar trebui adăugat și `student_id` în `Curs`, iar cele două chei externe s-ar contrazice reciproc  d) pentru că interogările ar deveni mai lente, dar structura ar rămâne corectă
      > O coloană dintr-un rând ține o singură valoare (atomicitate), deci `curs_id` din `Student` poate reține un singur curs pe rând; pentru M:N ai nevoie de o tabelă asociativă (`Inscriere`) care poate avea câte un rând separat pentru fiecare pereche student-curs.

2. Relația „o clasă are mulți elevi, un elev e într-o singură clasă” este de tip:
   a) 1:1  b) **1:N**  c) M:N
      > O clasă are mai mulți elevi (N), dar fiecare elev aparține unei singure clase (1).

3. În relația 1:N Autor–Carte, unde se pune cheia externă?
   a) În Autor  b) **În Carte (`autor_id`)**  c) În ambele
      > Fiecare carte reține un singur autor; dacă am pune cărțile în Autor, o celulă ar trebui să conțină mai multe valori.

4. Câte tabele obții din relația M:N Student–Curs?
   a) 2  b) **3**  c) 4
      > Student, Curs și tabela asociativă (de exemplu `Inscriere`), care leagă perechile.

---


:::verifica-cod
Scrie o funcție `numara_pe_curs(inscrieri, curs)` care primește tabela asociativă (listă de perechi `(student_id, curs)`) și numele unui curs, și returnează câți studenți sunt înscriși la el. Demo: `numara_pe_curs([(1, "IA"), (1, "BD"), (2, "BD"), (3, "BD")], "BD")` -> `3`
template: def numara_pe_curs(inscrieri, curs):
    # completeaza
    pass

print(numara_pe_curs([(1, "IA"), (1, "BD"), (2, "BD"), (3, "BD")], "BD"))
output: 3
:::

# Modulul 4.3 — Diagrama ERD și maparea la modelul fizic

### 🔄 4.3.1 Recapitulare

În 4.1–4.2 ai modelat entități și relații conceptual. Acum le desenezi și le transformi în tabele SQL.

### 💡 4.3.2 Concept nou și exemplu

**ERD (Entity-Relationship Diagram)** e desenul: dreptunghiuri pentru entități, romburi pentru relații, linii pentru legături, cu cardinalitățile pe linii.

**Maparea la modelul fizic** (SQL):
- Entitate → `CREATE TABLE`
- Atribut → coloană
- Cheie primară → `PRIMARY KEY`
- Relație 1:N → cheie externă în tabela "N"
- Relație M:N → tabelă nouă cu două chei externe


```python
# Generam automat instructiunile CREATE TABLE
# pornind de la o descriere simpla a entitatilor (mapare ERD -> SQL)
entitati = {
    "Student": {"id": "INTEGER PRIMARY KEY", "nume": "TEXT NOT NULL"},
    "Curs": {"cod": "TEXT PRIMARY KEY", "denumire": "TEXT NOT NULL"},
}

def genereaza_create_table(nume_tabel, coloane):
    linii = ", ".join(f"{col} {tip}" for col, tip in coloane.items())
    return f"CREATE TABLE {nume_tabel} ({linii});"

for tabel, coloane in entitati.items():
    print(genereaza_create_table(tabel, coloane))
```


:::tip
La mapare, ordinalitatea contează: pentru 1:N, cheia externă merge în partea "N" (cea cu multe).
:::

## Problemă rezolvată pas cu pas

**Enunț.** Mapăm la tabele SQL modelul Student – Inscriere – Curs (M:N) și verificăm în SQLite că structura acceptă datele.

**Ideea.** Fiecare entitate devine `CREATE TABLE`, iar relația M:N devine tabela `Inscriere` cu cheie primară compusă din cele două chei externe.

```python
import sqlite3
conn = sqlite3.connect(':memory:')
conn.executescript('''
CREATE TABLE Student(id INTEGER PRIMARY KEY, nume TEXT NOT NULL);
CREATE TABLE Curs(cod TEXT PRIMARY KEY, denumire TEXT NOT NULL);
CREATE TABLE Inscriere(
    student_id INTEGER REFERENCES Student(id),
    curs_cod TEXT REFERENCES Curs(cod),
    PRIMARY KEY (student_id, curs_cod)
);
INSERT INTO Student VALUES (1, 'Ana'), (2, 'Dan');
INSERT INTO Curs VALUES ('BD', 'Baze de date'), ('IA', 'Inteligență artificială');
INSERT INTO Inscriere VALUES (1, 'BD'), (1, 'IA'), (2, 'BD');
''')
print([r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")])
print(conn.execute('SELECT COUNT(*) FROM Inscriere').fetchone()[0])
```
Rezultatul:
```text
['Curs', 'Inscriere', 'Student']
3
```

:::atentie
## Greșeli frecvente
- În relația 1:N pui cheia externă în tabela „1”.
- Pentru M:N creezi doar două tabele. Ai nevoie de a treia, asociativă, cu două chei externe.
- Cheia externă are alt tip decât cheia primară la care se referă (ex. TEXT vs INTEGER): legăturile nu se mai potrivesc.
- Creezi întâi tabela cu cheia externă, apoi tabela la care se referă: în multe SGBD-uri apare eroare. Creează întâi tabela referită.
:::

### 🔮 4.3.3 Citește și prezice

```python
import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE Curs(cod TEXT PRIMARY KEY, denumire TEXT)")
conn.execute("CREATE TABLE Student(id INTEGER PRIMARY KEY, nume TEXT, curs_cod TEXT REFERENCES Curs(cod))")

for tabel in ["Curs", "Student"]:
    chei_externe = conn.execute(f"PRAGMA foreign_key_list({tabel})").fetchall()
    print(tabel, len(chei_externe))
```

Un curs are mulți studenți (relație 1:N). `PRAGMA foreign_key_list` întoarce cheile externe ale unui tabel. Ce se afișează?


### 🤝 4.3.4 Exerciții ghidate

Scrie instrucțiunile `CREATE TABLE` pentru `Student` și `Curs` cu relația 1:N.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: relatia 1:N Student-Curs, cheia externa merge in tabela "N"
create_student = "CREATE TABLE Student (id INTEGER PRIMARY KEY, nume TEXT)"
create_curs = "CREATE TABLE Curs (cod TEXT PRIMARY KEY, denumire TEXT)"

# Pasul 2: adaugam cheia externa curs_id in tabela Student (partea "N")
create_student_fk = ___ + ", curs_id TEXT REFERENCES ___(cod))"
print(create_student_fk)
```


### 🎯 4.3.5 Exerciții independente

Scrie `CREATE TABLE` pentru o relație M:N cu tabelă asociativă `Inscriere`.


**Exercițiul 1.** Scrie o funcție Python `genereaza_erd_text(entitati, relatii)` care primește un dicționar de entități (nume tabel -> listă coloane) și o listă de relații 1:N, apoi afișează schema textuală a fiecărei tabele cu cheia externă corect plasată în partea "N".

**Exercițiul 2.** Extinde funcția anterioară pentru a trata și o relație M:N: pentru fiecare relație M:N primită ca parametru, generează automat tabela asociativă (cu cele două chei externe) și afișeaz-o alături de restul tabelelor.


### ✅ 4.3.6 Verifică-ți înțelegerea

1. La maparea unei relații M:N Student–Curs la SQL apare o a treia tabelă (ex. `Inscriere`), pe lângă `Student` și `Curs`. Ce rol joacă exact această tabelă suplimentară?
   a) **ține câte o pereche (`student_id`, `curs_id`) pentru fiecare combinație reală care există, transformând relația M:N în două relații 1:N prin chei externe**  b) stochează o copie completă a datelor din `Student` și `Curs`, pentru viteză  c) înlocuiește tabela `Curs`, care devine redundantă odată creată tabela asociativă  d) există doar din motive de audit/logging și nu are rol structural în relație
      > Tabela asociativă nu duplică date, ci ține câte o pereche (`student_id`, `curs_id`) pentru fiecare combinație reală — practic descompune o singură relație M:N în două relații 1:N (Student→Inscriere și Curs→Inscriere), legate prin chei externe.

2. În ERD, ce formă au de obicei entitățile?
   a) Romburi  b) **Dreptunghiuri**  c) Cercuri
      > Dreptunghiurile sunt entitățile, romburile relațiile, iar liniile arată legăturile și cardinalitățile.

3. Ce devine un atribut la maparea în SQL?
   a) Un tabel  b) **O coloană**  c) O cheie externă, întotdeauna
      > Fiecare atribut al entității devine o coloană a tabelului ei.

4. Ce cheie primară are, de obicei, o tabelă asociativă?
   a) Niciuna  b) **Perechea celor două chei externe**  c) Un text liber
      > Perechea (student_id, curs_cod) e unică: un student nu se înscrie de două ori la același curs.

---


:::verifica-cod
Scrie o funcție `genereaza_fk(tabela_n, coloana_fk, tabel_referit, coloana_referita="id")` care generează textul unei instrucțiuni `ALTER TABLE` ce adaugă o cheie externă în tabela din partea „N” a unei relații 1:N. Demo: `genereaza_fk("Student", "curs_id", "Curs", "cod")` -> `ALTER TABLE Student ADD COLUMN curs_id REFERENCES Curs(cod)`
template: def genereaza_fk(tabela_n, coloana_fk, tabel_referit, coloana_referita="id"):
    # completeaza
    pass

print(genereaza_fk("Student", "curs_id", "Curs", "cod"))
output: ALTER TABLE Student ADD COLUMN curs_id REFERENCES Curs(cod)
:::

# Modulul 4.4 — Chei primare, chei externe, constrângeri de integritate

### 🔄 4.4.1 Recapitulare

În 4.3 ai mapat entități în tabele. Acum definim regulile care țin datele consistente.

### 💡 4.4.2 Concept nou și exemplu

- **Cheia primară (PK)**: identifică unic fiecare rând (`PRIMARY KEY`).
- **Cheia externă (FK)**: referă o cheie primară dintr-o altă tabelă (`FOREIGN KEY ... REFERENCES`).
- **Constrângeri de integritate**: reguli care păstrează corectitudinea:
  - integritatea referențială (un FK trebuie să existe ca PK)
  - `NOT NULL`, `UNIQUE`, `CHECK`

```sql
CREATE TABLE Student (
    id INTEGER PRIMARY KEY,
    nume TEXT NOT NULL,
    curs_id INTEGER REFERENCES Curs(id)
);
```


```python
# Simulam integritatea referentiala inainte de a trimite un INSERT la baza de date
studenti_existenti = {1: "Ana", 2: "Radu"}
cursuri_existente = {"BD", "IA"}

def poate_insera_student(id_student, curs_id, studenti, cursuri):
    if id_student in studenti:
        print(f"Eroare: id {id_student} exista deja (incalca PRIMARY KEY)")
        return False
    if curs_id not in cursuri:
        print(f"Eroare: cursul '{curs_id}' nu exista (incalca FOREIGN KEY)")
        return False
    return True

print(poate_insera_student(3, "BD", studenti_existenti, cursuri_existente))
print(poate_insera_student(1, "BD", studenti_existenti, cursuri_existente))
```


:::atentie
Dacă ștergi un rând referențiat de o cheie externă, baza de date va refuza (sau va șterge în cascadă, dacă așa a fost definită cheia). Asta e integritatea referențială.
:::


:::tip
## Cum recunoști rapid PK vs. FK
Cheia primară (PK) apare o singură dată pe rând și nu se repetă niciodată în tabelă — e „identitatea” rândului. Cheia externă (FK) se poate repeta de multe ori (ex. mai mulți studenți au același `curs_id`), pentru că ea exprimă o legătură către altă tabelă, nu o identitate proprie. Dacă o coloană se repetă des în date de test, e semn că e FK, nu PK.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Testăm în SQLite trei constrângeri: cheia primară, cheia externă și `CHECK`. Încercăm inserări greșite și afișăm ce le-a respins.

**Ideea.** Fiecare inserare greșită aruncă `sqlite3.IntegrityError`, iar mesajul spune ce constrângere a fost încălcată. Cheile externe se activează cu `PRAGMA foreign_keys = ON`.

```python
import sqlite3
conn = sqlite3.connect(':memory:')
conn.execute('PRAGMA foreign_keys = ON')
conn.execute('CREATE TABLE Clasa(id INTEGER PRIMARY KEY)')
conn.execute('CREATE TABLE Elev(id INTEGER PRIMARY KEY, varsta INTEGER CHECK (varsta >= 0), clasa_id INTEGER REFERENCES Clasa(id))')
conn.execute('INSERT INTO Clasa VALUES (1)')
conn.execute('INSERT INTO Elev VALUES (1, 17, 1)')
for rand in [(1, 18, 1), (2, -5, 1), (3, 16, 99)]:
    try:
        conn.execute('INSERT INTO Elev VALUES (?, ?, ?)', rand)
        print(rand, 'acceptat')
    except sqlite3.IntegrityError as e:
        print(rand, '->', e)
```
Rezultatul:
```text
(1, 18, 1) -> UNIQUE constraint failed: Elev.id
(2, -5, 1) -> CHECK constraint failed: varsta >= 0
(3, 16, 99) -> FOREIGN KEY constraint failed
```

:::atentie
## Greșeli frecvente
- Crezi că SQLite verifică automat cheile externe. În SQLite trebuie activate cu `PRAGMA foreign_keys = ON`.
- Pui `NOT NULL` pe o coloană opțională (ex. al doilea prenume) și nu mai poți insera date reale.
- Scrii condiția `CHECK` invers (ex. `CHECK (varsta < 0)`) și respingi exact datele corecte.
- Ștergi un rând referit de alte tabele fără să te gândești la ce se întâmplă cu rândurile care îl referă (`ON DELETE`).
:::

### 🔮 4.4.3 Citește și prezice

```python
import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("PRAGMA foreign_keys = ON")
conn.execute("CREATE TABLE Curs(id INTEGER PRIMARY KEY)")
conn.execute("CREATE TABLE Student(id INTEGER PRIMARY KEY, curs_id INTEGER REFERENCES Curs(id))")
conn.execute("INSERT INTO Curs VALUES (1)")

try:
    conn.execute("INSERT INTO Student VALUES (1, 99)")
    print("Inserat")
except sqlite3.IntegrityError as e:
    print("Refuzat:", e)
```

Cursul cu id-ul 99 nu există. Ce se întâmplă la inserarea studentului?


### 🤝 4.4.4 Exerciții ghidate

Scrie `CREATE TABLE` pentru `Comanda(id, data, client_id REFERENCES Client(id))` cu constrângeri.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: clientii existenti (cheile lor primare)
clienti_existenti = {1, 2, 3}

# Pasul 2: validam o comanda noua inainte de INSERT
def valideaza_comanda(client_id, clienti):
    if client_id not in ___:
        return False  # incalca FOREIGN KEY (client_id inexistent)
    return True

print("Comanda cu client_id=2:", valideaza_comanda(2, ___))
print("Comanda cu client_id=99:", valideaza_comanda(99, clienti_existenti))
```


### 🎯 4.4.5 Exerciții independente

Adaugă o constrângere `CHECK` care să nu permită vârsta negativă la `Student`.


**Exercițiul 1.** Scrie o funcție Python `valideaza_student(student)` care verifică, înainte de un `INSERT`, dacă vârsta este un număr pozitiv și dacă numele nu este gol — echivalentul aplicației pentru constrângerile `CHECK` și `NOT NULL`.

**Exercițiul 2.** Extinde funcția anterioară cu `valideaza_comanda(comanda, clienti_existenti)`, care refuză comanda dacă `client_id` nu se regăsește în mulțimea clienților existenți (simulând integritatea referențială a unei chei externe), și afișează un mesaj de eroare clar pentru fiecare caz respins.


### ✅ 4.4.6 Verifică-ți înțelegerea

1. O comandă are `client_id=99`, dar în tabela `Client` nu există niciun rând cu `id=99`. Ce spune integritatea referențială despre această situație și cum reacționează, de regulă, o bază de date relațională?
   a) **este o încălcare a constrângerii FOREIGN KEY — inserarea este refuzată (sau se aplică regula ON DELETE/UPDATE definită), pentru că un FK trebuie să indice mereu spre un rând existent**  b) nu este o problemă — coloanele FK pot conține orice valoare, indiferent dacă există sau nu în tabela referită  c) este permis temporar, atâta timp cât clientul 99 este adăugat până la sfârșitul zilei  d) este o eroare de sintaxă SQL, nu una legată de integritatea datelor
      > O cheie externă trebuie să indice mereu spre un rând existent în tabela referită; `client_id=99` fără un rând `Client(id=99)` încalcă integritatea referențială, iar baza de date refuză inserarea (sau aplică regula ON DELETE/UPDATE stabilită), exact cum arată exemplul cu `poate_insera_student`.

2. Ce garantează cheia primară?
   a) Că valoarea e pozitivă  b) **Că fiecare rând are o valoare unică și nenulă de identificare**  c) Că tabela e sortată
      > Cheia primară identifică unic fiecare rând; două rânduri nu pot avea aceeași valoare a cheii.

3. Ce constrângere folosești ca un preț să nu fie negativ?
   a) `UNIQUE`  b) **`CHECK (pret >= 0)`**  c) `NOT NULL`
      > `CHECK` verifică o condiție la fiecare inserare sau actualizare.

4. Ce valoare poate apărea de mai multe ori într-o tabelă: cheia primară sau o cheie externă?
   a) Cheia primară  b) **Cheia externă**  c) Niciuna
      > Mai mulți elevi pot avea același `clasa_id`; cheia primară în schimb e unică.

---


:::verifica-cod
Scrie o funcție `valideaza_insert(id_nou, curs_id, studenti_existenti, cursuri_existente)` care returnează `False` dacă `id_nou` există deja (încalcă PRIMARY KEY) sau dacă `curs_id` nu e în `cursuri_existente` (încalcă FOREIGN KEY), altfel `True`. Demo: `valideaza_insert(1, "BD", {1: "Ana", 2: "Radu"}, {"BD", "IA"})` -> `False`
template: def valideaza_insert(id_nou, curs_id, studenti_existenti, cursuri_existente):
    # completeaza
    pass

print(valideaza_insert(1, "BD", {1: "Ana", 2: "Radu"}, {"BD", "IA"}))
output: False
:::

# Modulul 4.5 — Forme normale: FN1, FN2, FN3

### 🔄 4.5.1 Recapitulare

Ai definit tabele cu chei și constrângeri (4.4). Dar cum aranjăm coloanele ca să evităm redundanța?

### 💡 4.5.2 Concept nou și exemplu

**Normalizarea** reduce redundanța și anomalii (la ștergere/actualizare):
- **FN1**: valorile dintr-o coloană sunt atomice (nu liste în aceeași celulă).
- **FN2**: e în FN1 și nu are dependențe parțiale (atributele non-cheie depind de *toată* cheia, nu doar o parte).
- **FN3**: e în FN2 și nu are dependențe tranzitive (un atribut non-cheie nu depinde de alt atribut non-cheie).

Exemplu FN3 încălcat: `Student(id, nume, oras, tara)` — `tara` depinde de `oras`, nu direct de `id`. Se separă în `Oras(id, nume, tara)`.


```python
# Tabela nenormalizata: 'oras' si 'tara' depind de 'oras', nu direct de 'id' (incalca FN3)
studenti = [
    {"id": 1, "nume": "Ana", "oras": "Cluj", "tara": "România"},
    {"id": 2, "nume": "Radu", "oras": "Cluj", "tara": "România"},
]

def normalizeaza_fn3(studenti):
    # extragem dependenta tranzitiva oras -> tara intr-o tabela separata
    orase = {s["oras"]: s["tara"] for s in studenti}
    studenti_fn3 = [{"id": s["id"], "nume": s["nume"], "oras": s["oras"]} for s in studenti]
    return studenti_fn3, orase

studenti_fn3, tabela_oras = normalizeaza_fn3(studenti)
print("Student:", studenti_fn3)
print("Oras:", tabela_oras)
```


:::tip
Regula practică: fiecare tabelă descrie un singur tip de lucru. Dacă o coloană depinde de altceva decât cheia, mut-o în alt tabel.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Tabela Comenzi repetă numele și orașul clientului la fiecare comandă. Arătăm anomalia de actualizare, apoi normalizăm datele în Client și Comanda.

**Ideea.** Orașul depinde de client, nu de comandă (dependență tranzitivă). Mutăm clientul într-o tabelă separată, iar comenzile păstrează doar `client_id`. Orașul se schimbă astfel într-un singur loc.

```python
comenzi = [
    {'id': 1, 'client': 'Ana', 'oras': 'Cluj', 'produs': 'carte'},
    {'id': 2, 'client': 'Ana', 'oras': 'Cluj', 'produs': 'pix'},
    {'id': 3, 'client': 'Dan', 'oras': 'Iasi', 'produs': 'caiet'},
]
comenzi[0]['oras'] = 'Brasov'   # actualizare făcută doar într-un loc
print(sorted({c['oras'] for c in comenzi if c['client'] == 'Ana'}))

clienti = {}
for c in comenzi:
    clienti.setdefault(c['client'], c['oras'])
fn3 = [{'id': c['id'], 'client': c['client'], 'produs': c['produs']} for c in comenzi]
print(clienti)
print(fn3[1])
```
Rezultatul:
```text
['Brasov', 'Cluj']
{'Ana': 'Brasov', 'Dan': 'Iasi'}
{'id': 2, 'client': 'Ana', 'produs': 'pix'}
```

:::atentie
## Greșeli frecvente
- Crezi că normalizarea înseamnă „cât mai multe tabele”. Separi doar datele care depind de altceva decât cheia.
- Lași într-o celulă o listă de valori (ex. „mate, info”): tabela nu e nici în FN1.
- Uiți să păstrezi cheia externă când muți date într-o tabelă nouă: pierzi legătura dintre ele.
- Confunzi dependența parțială (FN2, apare doar la chei compuse) cu dependența tranzitivă (FN3, prin alt atribut non-cheie).
:::

### 🔮 4.5.3 Citește și prezice

```python
def verifica_fn3(are_dependenta_tranzitiva):
    return "FN3 incălcat" if are_dependenta_tranzitiva else "FN3 respectat"

print(verifica_fn3(True))
```

Ce afișează programul?


### 🤝 4.5.4 Exerciții ghidate

Identifică încălcarea FN1 într-un tabel care ține o listă de telefoane într-o singură celulă.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: un tabel cu incalcare FN1 - o celula tine o lista de telefoane
persoane = [
    {"id": 1, "nume": "Ana", "telefoane": "0722111, 0733222"},
]

# Pasul 2: aducem la FN1 - despartim lista intr-un rand separat per telefon
telefoane_fn1 = []
for p in persoane:
    for tel in p[___].split(", "):
        telefoane_fn1.append({"persoana_id": p[___], "telefon": tel})

print(telefoane_fn1)
```


### 🎯 4.5.5 Exerciții independente

Normalizează la FN3 tabelul `Angajat(id, nume, dept, locatie_dept)`.


**Exercițiul 1.** Scrie o funcție Python `normalizeaza_fn1(persoane)` care primește o listă de persoane cu un câmp `telefoane` ce conține mai multe numere separate prin virgulă și returnează o listă nouă cu câte un rând pentru fiecare telefon (atomicitate FN1).

**Exercițiul 2.** Scrie o funcție `normalizeaza_fn3(angajati)` pentru tabelul `Angajat(id, nume, dept, locatie_dept)`, care separă dependența tranzitivă `dept -> locatie_dept` într-o tabelă `Departament(dept, locatie_dept)` și returnează cele două tabele rezultate.


### ✅ 4.5.6 Verifică-ți înțelegerea

1. Într-un tabel nenormalizat, orașul unui client apare repetat în 5 rânduri diferite (câte unul pentru fiecare comandă a lui). De ce previne normalizarea (separarea într-o tabelă `Client` aparte) anomalia de actualizare din acest exemplu?
   a) **pentru că, odată extrasă informația redundantă într-un singur loc, orașul se modifică o singură dată — nu mai există copii multiple care pot rămâne, din greșeală, neactualizate și inconsistente între ele**  b) pentru că normalizarea șterge automat rândurile vechi la fiecare UPDATE  c) pentru că tabelele normalizate rulează interogările SELECT mai rapid, indiferent de UPDATE  d) pentru că normalizarea previne complet posibilitatea oricărei erori de introducere a datelor (typos)
      > Când orașul e ținut o singură dată, într-o tabelă `Client` separată, iar comenzile doar referă acel rând prin cheie externă, un UPDATE modifică o singură valoare; când orașul era copiat pe fiecare comandă, un UPDATE parțial putea lăsa unele copii vechi, neactualizate, ducând la date inconsistente între ele.

2. Ce cere forma normală 1 (FN1)?
   a) Să existe o cheie externă  b) **Fiecare celulă să conțină o singură valoare (atomică)**  c) Să nu existe tabele asociative
      > O celulă cu „0722…, 0733…” încalcă FN1; fiecare telefon trebuie pus pe un rând separat.

3. Ce anomalie apare când aceeași informație e copiată în multe rânduri?
   a) Mai multă viteză  b) **La actualizare, unele copii pot rămâne vechi**  c) Nicio problemă
      > Dacă orașul unui client apare în 5 comenzi și îl schimbi doar într-una, datele devin contradictorii.

4. `Angajat(id, nume, dept, locatie_dept)`: ce încalcă?
   a) FN1  b) **FN3: locatie_dept depinde de dept, nu de id**  c) Nimic
      > E o dependență tranzitivă id → dept → locatie_dept; se separă tabela `Departament(dept, locatie)`.

---


:::verifica-cod
Scrie o funcție `tabela_oras(studenti)` care primește o listă de studenți (dicționare cu `oras` și `tara`) și extrage dependența tranzitivă `oras -> tara` într-un dicționar separat, fără duplicate (aducerea la FN3 din exemplu). Demo: `tabela_oras([{"oras": "Cluj", "tara": "România"}, {"oras": "Cluj", "tara": "România"}, {"oras": "Iasi", "tara": "România"}])` -> `{'Cluj': 'România', 'Iasi': 'România'}`
template: def tabela_oras(studenti):
    # completeaza
    pass

print(tabela_oras([{"oras": "Cluj", "tara": "România"}, {"oras": "Cluj", "tara": "România"}, {"oras": "Iasi", "tara": "România"}]))
output: {'Cluj': 'România', 'Iasi': 'România'}
:::
