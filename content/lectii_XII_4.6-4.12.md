# Modulul 4.6 — Clasele Connection și Cursor din Python

### 🔄 4.6.1 Recapitulare

Ai folosit fișiere text și liste pentru date. Pentru date structurate la scală mare, folosim o **bază de date** accesată din Python.

### 💡 4.6.2 Concept nou și exemplu

Modulul `sqlite3` (inclus în Python) permite accesul la o bază de date locală:
- **Connection**: legătura cu baza de date (`conn = sqlite3.connect("shop.db")`).
- **Cursor**: obiectul care execută interogări (`cur = conn.cursor()`).

```python
import sqlite3
conn = sqlite3.connect("test.db")
cur = conn.cursor()
cur.execute("CREATE TABLE IF NOT EXISTS Student(id INTEGER PRIMARY KEY, nume TEXT)")
conn.commit()       # salveaza modificarile
conn.close()        # inchide legatura
```

:::atentie
Orice modificare (INSERT/UPDATE/DELETE/DDL) trebuie urmată de `conn.commit()`, altfel se pierde la închidere!
:::


:::tip
## Conexiunea: deschide târziu, închide devreme
Deschide conexiunea cât mai târziu și închide-o cât mai devreme. Dacă uiți `conn.close()`, fișierul `.db` poate rămâne blocat pentru alte programe care vor să-l acceseze — cel mai sigur e să folosești `with sqlite3.connect(...) as conn:`, care închide automat conexiunea la ieșirea din bloc.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Construim o agendă în SQLite: creăm tabela, inserăm trei contacte cu parametri `?`, căutăm unul după nume și afișăm toate contactele ordonate.

**Ideea.** Conexiunea (`connect`) deschide baza, cursorul execută interogările. `executemany` inserează mai multe rânduri odată, `fetchone` aduce un rând, `fetchall` le aduce pe toate.

```python
import sqlite3
conn = sqlite3.connect(':memory:')
cur = conn.cursor()
cur.execute('CREATE TABLE Persoana(id INTEGER PRIMARY KEY, nume TEXT, telefon TEXT)')
cur.executemany('INSERT INTO Persoana(nume, telefon) VALUES (?, ?)',
                [('Mara', '0721'), ('Ion', '0733'), ('Eva', '0744')])
conn.commit()

cur.execute('SELECT telefon FROM Persoana WHERE nume = ?', ('Ion',))
print(cur.fetchone())
cur.execute('SELECT nume FROM Persoana ORDER BY nume')
print(cur.fetchall())
conn.close()
```
Rezultatul:
```text
('0733',)
[('Eva',), ('Ion',), ('Mara',)]
```

:::atentie
## Greșeli frecvente
- Uiți `conn.commit()` după modificări: la închidere, ele se pierd.
- Construiești interogarea lipind valori în text (`"... WHERE nume = '" + nume + "'"`): apar erori la ghilimele și riscul de SQL injection. Folosește `?`.
- Apelezi `fetchone()` de două ori și te miri că a doua oară primești rândul următor (sau `None`): cursorul avansează.
- Folosești `executemany` cu o listă de valori simple (`[1, 2]`) în loc de o listă de tupluri (`[(1,), (2,)]`).
:::

### 🔮 4.6.3 Citește și prezice

```python
import sqlite3
conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE T(x INTEGER)")
cur.execute("INSERT INTO T VALUES (5)")
# încă nu am apelat conn.commit()
print(cur.execute("SELECT COUNT(*) FROM T").fetchone()[0])
```

Pe aceeași conexiune, înainte de `commit`, câte rânduri vede `SELECT COUNT(*)`?


### 🤝 4.6.4 Exerciții ghidate

Creează o bază de date `agenda.db` cu tabela `Persoana(id, nume, telefon)` folosind `sqlite3`.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: deschide conexiunea si cursorul pentru agenda.db
conn = sqlite3.___("agenda.db")
cur = conn.___()

# Pasul 2: creeaza tabela Persoana daca nu exista
cur.execute("CREATE TABLE IF NOT EXISTS Persoana(id INTEGER PRIMARY KEY, nume TEXT, telefon TEXT)")

# Pasul 3: salveaza modificarile si inchide conexiunea
conn.___()
conn.___()
```


### 🎯 4.6.5 Exerciții independente

Scrie o funcție `adauga(conn, nume, telefon)` care inserează și face commit.


**Exercițiul 1.** Scrie o funcție `cauta_persoana(conn, nume)` care primește conexiunea către `agenda.db`, execută un `SELECT` pe tabela `Persoana` după nume și returnează rezultatul cu `cur.fetchone()`.

**Exercițiul 2.** Extinde programul anterior cu o funcție `sterge_persoana(conn, id)` care șterge o persoană din tabela `Persoana` după `id` și confirmă ștergerea printr-un mesaj afișat pe ecran.


### ✅ 4.6.6 Verifică-ți înțelegerea

1. Un coleg scrie `conn.execute("SELECT * FROM Student")` direct pe obiectul Connection și îi merge, așa că întreabă la ce mai folosește Cursor-ul. Care e explicația corectă a rolurilor celor două obiecte?
   a) Connection și Cursor fac exact același lucru, sunt redundante din motive istorice  b) **Connection administrează legătura cu fișierul bazei (deschidere, commit, close), iar Cursor execută interogările și ține poziția curentă în rezultate — unele driver-e oferă comod un `execute` direct pe conexiune, dar cursorul rămâne obiectul care parcurge datele**  c) Cursor administrează fișierul bazei, iar Connection doar execută interogările  d) Connection e necesar doar pentru `SELECT`, Cursor doar pentru `INSERT`/`UPDATE`
      > Connection administrează legătura cu fișierul bazei (deschidere, commit, close), iar Cursor este obiectul care execută efectiv interogările și ține poziția curentă în rezultate; faptul că unele driver-e permit `conn.execute` direct nu schimbă faptul că, sub capotă, cursorul e cel care parcurge datele.

2. Ce face `conn.commit()`?
   a) Închide conexiunea  b) **Salvează definitiv modificările făcute în tranzacția curentă**  c) Execută o interogare
      > Până la commit, modificările sunt provizorii și pot fi anulate (rollback) sau pierdute la închidere.

3. Ce întoarce `cur.fetchall()` după un SELECT?
   a) Un singur rând  b) **O listă de tupluri, câte un tuplu pentru fiecare rând**  c) Numărul de rânduri
      > Fiecare rând e un tuplu cu valorile coloanelor selectate.

4. De ce folosim `?` în `execute('... WHERE nume = ?', (nume,))`?
   a) E obligatoriu în Python  b) **Valorile sunt trimise separat de text, ceea ce previne erorile și SQL injection**  c) Face interogarea mai lentă
      > Biblioteca se ocupă de ghilimele și caractere speciale; textul interogării nu poate fi modificat de date.

---


:::verifica-cod
Scrie o funcție `executa_fara_commit(tabel, valoare)` care simulează o comandă necomisă: pornește de la o COPIE a tabelului, adaugă `valoare` la copie și o returnează — fără să modifice tabelul original (exact ce se întâmplă înainte de `conn.commit()`). Demo: pornind de la un tabel cu 3 elemente, arată câte elemente are tabelul original și câte are copia, după ce ai „inserat” un element în copie. Demo: `tabel = [1, 2, 3]
rezultat = executa_fara_commit(tabel, 99)
print(len(tabel), len(rezultat))` -> `3 4`
template: def executa_fara_commit(tabel, valoare):
    # completeaza
    pass

tabel = [1, 2, 3]
rezultat = executa_fara_commit(tabel, 99)
print(len(tabel), len(rezultat))
output: 3 4
:::

# Modulul 4.7 — SQL: interogări SELECT, proiecție, ordonare

### 🔄 4.7.1 Recapitulare

În 4.6 ai deschis o conexiune la bază. Acum interogăm datele cu `SELECT`.

### 💡 4.7.2 Concept nou și exemplu

```sql
SELECT nume, varsta FROM Student;        -- proiectie (coloane alese)
SELECT * FROM Student WHERE varsta > 18;  -- filtrare
SELECT * FROM Student ORDER BY varsta DESC;  -- ordonare
SELECT DISTINCT oras FROM Student;        -- valori unice
```

În Python: `cur.execute("SELECT ...")` urmat de `cur.fetchall()` (listă de tupluri) sau `cur.fetchone()`.


```python
import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE Student(nume TEXT, varsta INTEGER)")
cur.executemany("INSERT INTO Student VALUES (?, ?)",
                 [("Ana", 17), ("Bogdan", 19), ("Cris", 17)])
conn.commit()

cur.execute("SELECT nume FROM Student WHERE varsta > 17 ORDER BY nume")
rezultate = cur.fetchall()
print("Studenți peste 17 ani:", rezultate)
```


:::tip
`SELECT *` ia toate coloanele — în producție e mai bine să numeri explicit coloanele (proiecție) pentru claritate și performanță.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Din tabela Student afișăm numele și vârsta elevilor din Cluj, ordonați descrescător după vârstă, iar la vârstă egală alfabetic, apoi orașele distincte.

**Ideea.** Proiecția (`SELECT nume, varsta`) alege coloanele, `WHERE` alege rândurile, `ORDER BY` stabilește ordinea, iar `DISTINCT` elimină dublurile.

```python
import sqlite3
conn = sqlite3.connect(':memory:')
cur = conn.cursor()
cur.execute('CREATE TABLE Student(id INTEGER PRIMARY KEY, nume TEXT, varsta INTEGER, oras TEXT)')
cur.executemany('INSERT INTO Student(nume, varsta, oras) VALUES (?, ?, ?)', [
    ('Ana', 17, 'Cluj'), ('Bogdan', 19, 'Iasi'), ('Cris', 18, 'Cluj'),
    ('Dana', 16, 'Arad'), ('Emil', 19, 'Cluj'), ('Flavia', 18, 'Iasi')])
print(cur.execute("SELECT nume, varsta FROM Student WHERE oras = 'Cluj' ORDER BY varsta DESC, nume").fetchall())
print(cur.execute('SELECT DISTINCT oras FROM Student ORDER BY oras').fetchall())
```
Rezultatul:
```text
[('Emil', 19), ('Cris', 18), ('Ana', 17)]
[('Arad',), ('Cluj',), ('Iasi',)]
```

:::atentie
## Greșeli frecvente
- Scrii clauzele în altă ordine (`SELECT ... WHERE ... FROM`). Ordinea este `SELECT … FROM … WHERE … ORDER BY …`.
- Folosești ghilimele duble pentru texte în SQL (`WHERE oras = "Cluj"`). Standardul folosește apostrof: `'Cluj'` (SQLite le acceptă pe amândouă, alte SGBD-uri nu).
- Uiți că `ORDER BY` fără `DESC` ordonează crescător.
- Pui `DISTINCT` doar pe o coloană crezând că se aplică doar ei: se aplică întregului rând selectat.
:::

### 🔮 4.7.3 Citește și prezice

```python
import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE Student(nume TEXT, varsta INTEGER)")
conn.executemany("INSERT INTO Student VALUES (?, ?)", [("Ana", 17), ("Bogdan", 19), ("Cris", 17)])

rez = conn.execute("SELECT nume FROM Student ORDER BY varsta DESC, nume ASC").fetchall()
print(rez[0][0], rez[-1][0])
```

Ce afișează programul?


### 🤝 4.7.4 Exerciții ghidate

Scrie o interogare care afișează numele studenților mai mari de 18 ani, ordonați alfabetic.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: selecteaza numele studentilor majori, ordonati alfabetic
cur.execute("SELECT nume FROM Student ___ varsta >= 18 ORDER ___ nume")

# Pasul 2: extrage toate randurile rezultate
rezultate = cur.___()
print("Studenți majori:", ___)
```


### 🎯 4.7.5 Exerciții independente

Folosind `sqlite3` în Python, creează tabela, inserează 3 rânduri și afișează cele ordonate.


**Exercițiul 1.** Scrie o interogare SQL care selectează doar coloanele `nume` și `oras` din tabela `Student`, pentru studenții cu vârsta sub 18 ani.

**Exercițiul 2.** Folosind Python și `sqlite3`, execută interogarea de mai sus cu `cur.execute`, apoi afișează rezultatele ordonate descrescător după vârstă, folosind `cur.fetchall()`.


### ✅ 4.7.6 Verifică-ți înțelegerea

1. Un elev scrie `SELECT nume, oras WHERE varsta > 18 FROM Student` și primește eroare de sintaxă. Ce confuzie a făcut între proiecție (`SELECT col1, col2`) și filtrare (`WHERE`)?
   a) A crezut că `WHERE` alege coloanele afișate, la fel ca proiecția, de-aia l-a scris lângă lista de coloane, deși `WHERE` filtrează rândurile și trebuie să vină după `FROM`  b) **A pus `WHERE` înaintea clauzei `FROM`, nerespectând ordinea obligatorie `SELECT ... FROM ... WHERE ...`; proiecția alege coloanele, `WHERE` alege rândurile**  c) Greșeala e doar virgula dintre `nume` și `oras` — SQL ar cere spațiu simplu între coloane  d) `WHERE` și proiecția sunt interschimbabile, ordinea clauzelor nu contează atât timp cât apar toate
      > SQL impune ordinea fixă `SELECT ... FROM ... WHERE ...`: proiecția (`SELECT nume, oras`) alege coloanele afișate, iar `WHERE` filtrează rândurile și trebuie scris după `FROM`, nu lipit de lista de coloane ca și cum ar face parte din proiecție.

2. Ce face `SELECT nume, varsta FROM Student`?
   a) Șterge celelalte coloane  b) **Afișează doar coloanele nume și varsta (proiecție)**  c) Ordonează după nume
      > Proiecția alege coloanele din rezultat; tabela rămâne neschimbată.

3. Cum ordonezi descrescător după medie?
   a) `ORDER medie DOWN`  b) **`ORDER BY medie DESC`**  c) `SORT BY medie`
      > `DESC` înseamnă descrescător; implicit `ORDER BY` este crescător (`ASC`).

4. Ce întoarce `SELECT DISTINCT oras FROM Student` pentru orașele Cluj, Cluj, Iasi?
   a) Cluj, Cluj, Iasi  b) **Cluj, Iasi**  c) 2
      > `DISTINCT` păstrează fiecare valoare (rând) o singură dată.

---


:::verifica-cod
Scrie o funcție `ordoneaza_dupa_varsta(studenti)` care primește o listă de studenți (dicționare cu `nume` și `varsta`) și returnează lista de nume ordonată ca în `ORDER BY varsta DESC, nume ASC` (cei mai în vârstă primii, iar la egalitate, ordine alfabetică). Demo: `ordoneaza_dupa_varsta([{"nume": "Ana", "varsta": 17}, {"nume": "Bogdan", "varsta": 19}, {"nume": "Cris", "varsta": 17}])` -> `['Bogdan', 'Ana', 'Cris']`
template: def ordoneaza_dupa_varsta(studenti):
    # completeaza
    pass

print(ordoneaza_dupa_varsta([{"nume": "Ana", "varsta": 17}, {"nume": "Bogdan", "varsta": 19}, {"nume": "Cris", "varsta": 17}]))
output: ['Bogdan', 'Ana', 'Cris']
:::

# Modulul 4.8 — SQL: funcții agregate și grupare

### 🔄 4.8.1 Recapitulare

În 4.7 ai selectat și ordonat rânduri. Acum calculezi statistici pe grupuri.

### 💡 4.8.2 Concept nou și exemplu

Funcții agregate: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`. `GROUP BY` grupează rândurile după o coloană, iar `HAVING` filtrează grupurile.

```sql
SELECT oras, COUNT(*) FROM Student GROUP BY oras;
SELECT oras, AVG(varsta) FROM Student GROUP BY oras HAVING AVG(varsta) > 17;
```


```python
import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE Vanzari(oras TEXT, suma INTEGER)")
cur.executemany("INSERT INTO Vanzari VALUES (?, ?)",
                 [("Cluj", 100), ("Cluj", 200), ("Iasi", 50)])
conn.commit()

cur.execute("SELECT oras, SUM(suma) FROM Vanzari GROUP BY oras")
for oras, total in cur.fetchall():
    print(f"{oras}: {total} lei")
```


:::atentie
`WHERE` filtrează înainte de grupare; `HAVING` filtrează după grupare. Nu poți folosi `WHERE` pe o funcție agregată.
:::


:::tip
## Regula pentru GROUP BY
Orice coloană din `SELECT` care nu e argument al unei funcții agregate trebuie să apară și în `GROUP BY` — altfel rezultatul e ambiguu (SQLite e permisiv și alege o valoare oarecare, dar alte SGBD-uri refuză direct interogarea).
:::

## Problemă rezolvată pas cu pas

**Enunț.** Pentru fiecare oraș afișăm numărul de elevi și vârsta medie, doar pentru orașele cu cel puțin doi elevi, ordonate după numărul de elevi.

**Ideea.** `GROUP BY oras` formează câte un grup pentru fiecare oraș. `COUNT(*)` și `AVG(varsta)` se calculează pe fiecare grup, iar `HAVING` păstrează doar grupurile care ne interesează.

```python
import sqlite3
conn = sqlite3.connect(':memory:')
cur = conn.cursor()
cur.execute('CREATE TABLE Student(id INTEGER PRIMARY KEY, nume TEXT, varsta INTEGER, oras TEXT)')
cur.executemany('INSERT INTO Student(nume, varsta, oras) VALUES (?, ?, ?)', [
    ('Ana', 17, 'Cluj'), ('Bogdan', 19, 'Iasi'), ('Cris', 18, 'Cluj'),
    ('Dana', 16, 'Arad'), ('Emil', 19, 'Cluj'), ('Flavia', 18, 'Iasi')])
rez = cur.execute('''
    SELECT oras, COUNT(*), ROUND(AVG(varsta), 2)
    FROM Student
    GROUP BY oras
    HAVING COUNT(*) >= 2
    ORDER BY COUNT(*) DESC
''').fetchall()
print(rez)
```
Rezultatul: `[('Cluj', 3, 18.0), ('Iasi', 2, 18.5)]`.

:::atentie
## Greșeli frecvente
- Folosești `WHERE COUNT(*) > 1`: o funcție agregată nu poate apărea în `WHERE`. Folosește `HAVING`.
- Selectezi o coloană care nu e nici în `GROUP BY`, nici într-o funcție agregată: rezultatul e ambiguu.
- Crezi că `COUNT(coloana)` numără și valorile `NULL`. Doar `COUNT(*)` numără toate rândurile.
- Uiți că `AVG` pe numere întregi dă rezultat real (ex. 17.5) și compari greșit cu un număr întreg.
:::

### 🔮 4.8.3 Citește și prezice

```python
import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE Vanzari(oras TEXT, suma INTEGER)")
conn.executemany("INSERT INTO Vanzari VALUES (?, ?)", [("A", 100), ("A", 200), ("B", 50)])

for oras, total in conn.execute("SELECT oras, SUM(suma) FROM Vanzari GROUP BY oras ORDER BY oras"):
    print(oras, total)
```

Ce afișează programul?


### 🤝 4.8.4 Exerciții ghidate

Scrie o interogare care returnează numărul de studenți pe fiecare oraș.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: numara studentii din fiecare oras
cur.execute("SELECT oras, ___(*) FROM Student ___ BY oras")

# Pasul 2: extrage rezultatele grupate
grupuri = cur.___()
print("Studenți pe oraș:", ___)
```


### 🎯 4.8.5 Exerciții independente

Calculează media vârstei per oraș, dar doar pentru orașele cu minim 2 studenți.


**Exercițiul 1.** Scrie o interogare SQL care calculează suma vânzărilor (`SUM(suma)`) pentru fiecare oraș din tabela `Vanzari`, afișând doar orașele cu suma totală peste 100 (folosește `HAVING`).

**Exercițiul 2.** Folosind Python, execută interogarea de mai sus cu `cur.execute`, apoi afișează fiecare oraș cu totalul lui folosind un `for` care parcurge `cur.fetchall()`.


### ✅ 4.8.6 Verifică-ți înțelegerea

1. Un elev scrie `SELECT oras, COUNT(*) FROM Student WHERE COUNT(*) > 1 GROUP BY oras` și primește eroare. De ce trebuie folosit `HAVING COUNT(*) > 1` în loc de `WHERE COUNT(*) > 1`?
   a) `HAVING` și `WHERE` sunt sinonime în SQL, dar `HAVING` e sintaxa mai nouă și recomandată  b) **`WHERE` filtrează rândurile brute înainte ca `GROUP BY` să calculeze `COUNT(*)`, deci valoarea agregată încă nu există; `HAVING` filtrează grupurile după ce agregarea s-a făcut**  c) `COUNT(*)` nu poate apărea niciodată într-o condiție, indiferent de clauză  d) `WHERE` funcționează doar pe coloane text, iar `COUNT(*)` produce un număr
      > `WHERE` filtrează rândurile brute înainte ca `GROUP BY` să calculeze agregatul, deci `COUNT(*)` încă nu există în acel moment; `HAVING` acționează după gruparea și agregarea rândurilor, când valoarea `COUNT(*)` per grup e deja calculată și poate fi comparată.

2. Ce face `GROUP BY oras`?
   a) Ordonează după oraș  b) **Formează câte un grup de rânduri pentru fiecare oraș, pe care se calculează funcțiile agregate**  c) Șterge orașele duplicate
      > Fiecare grup devine un singur rând în rezultat.

3. Unde se scrie condiția pe un rezultat agregat, ca `COUNT(*) > 2`?
   a) În `WHERE`  b) **În `HAVING`**  c) În `ORDER BY`
      > `WHERE` filtrează rândurile înainte de grupare; `HAVING` filtrează grupurile după calcul.

4. Ce întoarce `SELECT MAX(varsta) FROM Student`?
   a) Toate vârstele  b) **O singură valoare: vârsta maximă**  c) Numărul de elevi
      > Fără `GROUP BY`, funcția agregată se aplică întregii tabele și dă un singur rând.

---


:::verifica-cod
Scrie o funcție `suma_pe_grup(tabel, coloana_grup, coloana_suma)` care primește un tabel (listă de dicționare) și simulează `SELECT coloana_grup, SUM(coloana_suma) FROM tabel GROUP BY coloana_grup`, returnând un dicționar grup -> sumă. Demo: `suma_pe_grup([{"oras": "A", "suma": 100}, {"oras": "A", "suma": 200}, {"oras": "B", "suma": 50}], "oras", "suma")` -> `{'A': 300, 'B': 50}`
template: def suma_pe_grup(tabel, coloana_grup, coloana_suma):
    # completeaza
    pass

print(suma_pe_grup([{"oras": "A", "suma": 100}, {"oras": "A", "suma": 200}, {"oras": "B", "suma": 50}], "oras", "suma"))
output: {'A': 300, 'B': 50}
:::

# Modulul 4.9 — SQL: JOIN și subinterogări

### 🔄 4.9.1 Recapitulare

În 4.8 ai grupat date dintr-o singură tabelă. Dar datele sunt în tabele legate.

### 💡 4.9.2 Concept nou și exemplu

**JOIN** combină rânduri din două tabele pe o condiție de potrivire:
```sql
SELECT s.nume, c.denumire
FROM Student s
JOIN Inscriere i ON s.id = i.student_id
JOIN Curs c ON i.curs_id = c.id;
```
**Subinterogare**: o interogare în interiorul alteia:
```sql
SELECT nume FROM Student
WHERE id IN (SELECT student_id FROM Inscriere WHERE curs_id = 1);
```


```python
import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE Student(id INTEGER, nume TEXT)")
cur.execute("CREATE TABLE Curs(id INTEGER, denumire TEXT)")
cur.execute("CREATE TABLE Inscriere(student_id INTEGER, curs_id INTEGER)")
cur.executemany("INSERT INTO Student VALUES (?, ?)", [(1, "Ana"), (2, "Bogdan")])
cur.execute("INSERT INTO Curs VALUES (1, 'Python')")
cur.execute("INSERT INTO Inscriere VALUES (1, 1)")
conn.commit()

cur.execute("""
    SELECT s.nume, c.denumire
    FROM Student s
    JOIN Inscriere i ON s.id = i.student_id
    JOIN Curs c ON i.curs_id = c.id
""")
print("Înscrieri:", cur.fetchall())
```


:::tip
INNER JOIN returnează doar rândurile cu potrivire în ambele tabele. LEFT JOIN păstrează toate din stânga, chiar dacă n-au potrivire.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Afișăm, pentru fiecare elev, câte cursuri urmează, inclusiv elevii fără niciun curs, și apoi cursurile la care nu e înscris nimeni.

**Ideea.** `LEFT JOIN` păstrează toți elevii; cei fără înscrieri au `NULL` la `curs_id`, iar `COUNT(i.curs_id)` nu numără `NULL`. Pentru cursurile goale folosim o subinterogare cu `NOT IN`.

```python
import sqlite3
conn = sqlite3.connect(':memory:')
cur = conn.cursor()
cur.executescript('''
CREATE TABLE Student(id INTEGER PRIMARY KEY, nume TEXT);
CREATE TABLE Curs(id INTEGER PRIMARY KEY, denumire TEXT);
CREATE TABLE Inscriere(student_id INTEGER, curs_id INTEGER);
INSERT INTO Student VALUES (1, 'Ana'), (2, 'Bogdan'), (3, 'Cris');
INSERT INTO Curs VALUES (1, 'Python'), (2, 'SQL'), (3, 'Grafică');
INSERT INTO Inscriere VALUES (1, 1), (1, 2), (2, 2);
''')
print(cur.execute('''
    SELECT s.nume, COUNT(i.curs_id)
    FROM Student s LEFT JOIN Inscriere i ON s.id = i.student_id
    GROUP BY s.id ORDER BY s.nume
''').fetchall())
print(cur.execute('SELECT denumire FROM Curs WHERE id NOT IN (SELECT curs_id FROM Inscriere)').fetchall())
```
Rezultatul:
```text
[('Ana', 2), ('Bogdan', 1), ('Cris', 0)]
[('Grafică',)]
```

:::atentie
## Greșeli frecvente
- Uiți condiția `ON` la JOIN: obții produsul cartezian (fiecare rând cu fiecare rând).
- Folosești `INNER JOIN` când ai nevoie și de rândurile fără potrivire (ex. elevi neînscriși). Atunci ai nevoie de `LEFT JOIN`.
- Scrii același nume de coloană din două tabele fără prefix (`id`): apare eroarea „ambiguous column”. Folosește aliasuri: `s.id`, `c.id`.
- La `NOT IN` cu o subinterogare care conține `NULL`, rezultatul poate fi gol. Verifică datele sau folosește `NOT EXISTS`.
:::

### 🔮 4.9.3 Citește și prezice

```python
import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE Student(id INTEGER, nume TEXT)")
conn.execute("CREATE TABLE Inscriere(student_id INTEGER, curs_id INTEGER)")
conn.executemany("INSERT INTO Student VALUES (?, ?)", [(1, "Ana"), (2, "Bogdan"), (3, "Cris")])
conn.executemany("INSERT INTO Inscriere VALUES (?, ?)", [(1, 10), (2, 10), (1, 20)])

rez = conn.execute("SELECT s.nume, i.curs_id FROM Student s JOIN Inscriere i ON s.id = i.student_id").fetchall()
print(len(rez))
```

Cris nu e înscris la niciun curs, iar Ana e înscrisă la două. Câte rânduri are rezultatul `INNER JOIN`?


### 🤝 4.9.4 Exerciții ghidate

Scrie un JOIN care afișează numele studenților și denumirea cursurilor la care sunt înscriși.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: JOIN intre Student, Inscriere si Curs
cur.execute("""
    SELECT s.nume, c.denumire
    FROM Student s
    ___ Inscriere i ON s.id = i.student_id
    ___ Curs c ON i.curs_id = c.id
""")

# Pasul 2: extrage toate perechile nume-curs
rezultate = cur.___()
print("Studenți și cursuri:", ___)
```


### 🎯 4.9.5 Exerciții independente

Scrie o subinterogare care returnează studenții înscriși la un curs dat.


**Exercițiul 1.** Scrie un `LEFT JOIN` între tabelele `Student` și `Inscriere` care afișează numele fiecărui student și `curs_id`-ul la care e înscris, păstrând și studenții care nu sunt înscriși la niciun curs.

**Exercițiul 2.** Scrie o subinterogare cu `NOT IN` care returnează numele studenților care NU sunt înscriși la cursul cu `id = 1`.


### ✅ 4.9.6 Verifică-ți înțelegerea

1. Vrei doar numele studenților înscriși la cursul cu `id=1`, fără să afișezi nimic din tabela `Curs`. Un coleg insistă că trebuie neapărat un `JOIN` între `Student` și `Inscriere`. Ce alegere e de fapt mai potrivită și de ce?
   a) `JOIN`-ul e obligatoriu oricând sunt implicate două tabele, altfel SQL nu poate compara datele  b) O subinterogare (`WHERE id IN (SELECT ...)`) e mai potrivită aici, pentru că ai nevoie de coloane din ambele tabele afișate simultan, ceea ce doar `JOIN` poate face  c) **O subinterogare (`WHERE id IN (SELECT ...)`) e mai potrivită aici, pentru că nu ai nevoie de coloane din tabela `Inscriere` în rezultat — `JOIN` ar aduce date suplimentare inutile și, dacă un student e înscris la mai multe cursuri care se potrivesc, ar duplica rândul de student**  d) Nu contează care variantă alegi, cele două produc mereu exact aceleași rânduri în orice situație
      > Cum rezultatul cerut conține doar coloane din `Student`, un `JOIN` cu `Inscriere` ar aduce date suplimentare inutile și, dacă un student e înscris la mai multe cursuri potrivite, i-ar duplica rândul; o subinterogare cu `WHERE id IN (SELECT ...)` obține exact lista de id-uri fără să afecteze structura rezultatului final.

2. Ce rânduri întoarce un INNER JOIN?
   a) Toate rândurile din ambele tabele  b) **Doar perechile de rânduri care respectă condiția ON**  c) Doar rândurile fără potrivire
      > Rândurile din stânga fără potrivire în dreapta (și invers) nu apar.

3. Ce păstrează LEFT JOIN în plus față de INNER JOIN?
   a) Nimic  b) **Rândurile din tabela din stânga fără potrivire, cu NULL în coloanele din dreapta**  c) Rândurile din dreapta fără potrivire
      > Așa poți găsi, de exemplu, elevii care nu sunt înscriși la niciun curs.

4. Ce face `WHERE id IN (SELECT student_id FROM Inscriere)`?
   a) Creează o tabelă nouă  b) **Păstrează rândurile al căror id apare în rezultatul subinterogării**  c) Șterge înscrierile
      > Subinterogarea produce o listă de valori, iar `IN` verifică apartenența.

---


:::verifica-cod
Scrie o funcție `inner_join_count(stanga, dreapta, cheie_stanga, cheie_dreapta)` care simulează un `INNER JOIN` între două tabele (liste de dicționare) și returnează câte rânduri din `stanga` au potrivire în `dreapta` (rândurile fără potrivire NU se numără, exact ca la INNER JOIN). Demo: `inner_join_count([{"id": 1, "nume": "Ana"}, {"id": 2, "nume": "Bogdan"}], [{"student_id": 1, "curs_id": 10}], "id", "student_id")` -> `1`
template: def inner_join_count(stanga, dreapta, cheie_stanga, cheie_dreapta):
    # completeaza
    pass

print(inner_join_count([{"id": 1, "nume": "Ana"}, {"id": 2, "nume": "Bogdan"}], [{"student_id": 1, "curs_id": 10}], "id", "student_id"))
output: 1
:::

# Modulul 4.10 — SQL: DML — inserare, actualizare, ștergere

### 🔄 4.10.1 Recapitulare

Până acum ai doar citit date (SELECT). DML modifică conținutul tabelelor.

### 💡 4.10.2 Concept nou și exemplu

```sql
INSERT INTO Student(nume, varsta) VALUES ('Ana', 17);
UPDATE Student SET varsta = 18 WHERE nume = 'Ana';
DELETE FROM Student WHERE varsta < 16;
```

În Python, toate se execută cu `cur.execute(...)` + `conn.commit()`.


```python
import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE Student(id INTEGER PRIMARY KEY, nume TEXT, varsta INTEGER)")

cur.execute("INSERT INTO Student(nume, varsta) VALUES (?, ?)", ("Ana", 17))
cur.execute("UPDATE Student SET varsta = ? WHERE nume = ?", (18, "Ana"))
conn.commit()

cur.execute("SELECT * FROM Student")
print("Student după actualizare:", cur.fetchall())
```


:::atentie
`UPDATE`/`DELETE` fără `WHERE` modifică/toată tabela! Verifică mereu condiția înainte.
:::


:::tip
## Parametri legați, nu concatenare
Folosește întotdeauna parametri legați — `cur.execute("... WHERE nume = ?", (nume,))` — în loc să concatenezi valori direct în string-ul SQL. Previi atât erorile de sintaxă cauzate de ghilimele sau caractere speciale, cât și atacurile de tip SQL injection.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Aplicăm pe tabela Student trei operații DML și verificăm efectul fiecăreia cu `cur.rowcount` (câte rânduri au fost afectate).

**Ideea.** `INSERT` adaugă rânduri, `UPDATE` modifică rândurile care respectă `WHERE`, `DELETE` le șterge. `rowcount` spune câte rânduri a atins ultima comandă, util ca să prinzi un `WHERE` greșit.

```python
import sqlite3
conn = sqlite3.connect(':memory:')
cur = conn.cursor()
cur.execute('CREATE TABLE Student(id INTEGER PRIMARY KEY, nume TEXT, varsta INTEGER, oras TEXT)')
cur.executemany('INSERT INTO Student(nume, varsta, oras) VALUES (?, ?, ?)', [
    ('Ana', 17, 'Cluj'), ('Bogdan', 19, 'Iasi'), ('Cris', 18, 'Cluj'),
    ('Dana', 16, 'Arad'), ('Emil', 19, 'Cluj'), ('Flavia', 18, 'Iasi')])
cur.execute("INSERT INTO Student(nume, varsta, oras) VALUES ('Gelu', 15, 'Arad')")
print('inserate:', cur.rowcount)
cur.execute("UPDATE Student SET varsta = varsta + 1 WHERE oras = 'Cluj'")
print('actualizate:', cur.rowcount)
cur.execute('DELETE FROM Student WHERE varsta < 17')
print('șterse:', cur.rowcount)
conn.commit()
print(cur.execute('SELECT COUNT(*), MIN(varsta) FROM Student').fetchone())
```
Rezultatul:
```text
inserate: 1
actualizate: 3
șterse: 2
(5, 18)
```

:::atentie
## Greșeli frecvente
- Scrii `UPDATE` sau `DELETE` fără `WHERE`: modifici sau ștergi toată tabela.
- Uiți `commit()`: modificările nu se salvează.
- Verifici efectul unui `UPDATE` citind o variabilă Python, nu baza de date: rulează un `SELECT` după modificare.
- La `INSERT` fără listă de coloane dai valorile în altă ordine decât coloanele tabelei.
:::

### 🔮 4.10.3 Citește și prezice

```python
import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE Student(nume TEXT, varsta INTEGER)")
conn.executemany("INSERT INTO Student VALUES (?, ?)", [("Ana", 17), ("Bogdan", 19)])
conn.execute("UPDATE Student SET varsta = varsta + 1 WHERE nume = 'Ana'")
print(conn.execute("SELECT varsta FROM Student ORDER BY nume").fetchall())
```

Ce afișează programul?


### 🤝 4.10.4 Exerciții ghidate

Scrie cod Python care inserează 3 studenți și apoi actualizează vârsta unuia.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: insereaza un student nou
cur.execute("INSERT INTO Student(nume, varsta) VALUES (?, ?)", ("Bogdan", 19))

# Pasul 2: actualizeaza varsta studentului
cur.execute("___ Student SET varsta = ? WHERE nume = ?", (20, "Bogdan"))

# Pasul 3: salveaza modificarile
conn.___()
```


### 🎯 4.10.5 Exerciții independente

Șterge toate înregistrările cu vârsta mai mică de 16, folosind `cur.execute` + `commit`.


**Exercițiul 1.** Scrie un program Python care inserează 3 studenți în tabela `Student` folosind `executemany`, apoi face `commit`.

**Exercițiul 2.** Extinde programul anterior cu o funcție `actualizeaza_varsta(conn, nume, varsta_noua)` care face `UPDATE` cu parametri legați și confirmă modificarea printr-un `SELECT` după nume.


### ✅ 4.10.6 Verifică-ți înțelegerea

1. Un elev rulează din greșeală `DELETE FROM Student` (fără `WHERE`) direct în consolă, apoi observă că tabela e goală. De ce s-a întâmplat asta și ce l-ar fi putut salva?
   a) Comanda e sigură implicit — SQLite ar fi trebuit să ceară confirmare automat înainte de a șterge toate rândurile  b) **Fără `WHERE`, condiția de filtrare lipsește și `DELETE` se aplică tuturor rândurilor din tabelă; singura șansă de recuperare e dacă nu s-a făcut încă `conn.commit()`, prin `conn.rollback()` — după commit, datele sunt pierdute definitiv**  c) `DELETE FROM Student` fără `WHERE` doar marchează rândurile ca șterse, dar `SELECT` tot le mai poate citi ulterior  d) Problema nu e lipsa lui `WHERE`, ci faptul că nu a folosit `DROP TABLE` în schimb
      > Fără `WHERE`, condiția de filtrare lipsește, deci `DELETE` se aplică tuturor rândurilor din tabelă; singura șansă de recuperare era înainte de `conn.commit()`, prin `conn.rollback()` — după commit, modificarea e salvată definitiv și datele nu mai pot fi recuperate.

2. Ce face `UPDATE Student SET varsta = varsta + 1` fără `WHERE`?
   a) Nimic  b) **Mărește vârsta tuturor elevilor**  c) Doar primului elev
      > Fără `WHERE`, comanda se aplică tuturor rândurilor.

3. Ce comandă adaugă un rând nou?
   a) `ADD ROW`  b) **`INSERT INTO`**  c) `UPDATE`
      > `INSERT INTO tabela(coloane) VALUES (...)` adaugă înregistrări.

4. Ce arată `cur.rowcount` după un `DELETE`?
   a) Câte rânduri au rămas  b) **Câte rânduri au fost șterse**  c) Numărul de coloane
      > E o verificare rapidă că `WHERE` a atins exact rândurile pe care le voiai.

---


:::verifica-cod
Scrie o funcție `actualizeaza_varsta(tabel, nume, delta)` care simulează `UPDATE Student SET varsta = varsta + delta WHERE nume = nume`, modificând direct rândul cu numele dat din tabel (listă de dicționare) și întorcând tabelul. Demo: `actualizeaza_varsta([{"nume": "Ana", "varsta": 17}, {"nume": "Bogdan", "varsta": 19}], "Ana", 1)` -> `[{'nume': 'Ana', 'varsta': 18}, {'nume': 'Bogdan', 'varsta': 19}]`
template: def actualizeaza_varsta(tabel, nume, delta):
    # completeaza
    pass

print(actualizeaza_varsta([{"nume": "Ana", "varsta": 17}, {"nume": "Bogdan", "varsta": 19}], "Ana", 1))
output: [{'nume': 'Ana', 'varsta': 18}, {'nume': 'Bogdan', 'varsta': 19}]
:::

# Modulul 4.11 — SQL: DDL — creare și modificare a structurii

### 🔄 4.11.1 Recapitulare

În 4.10 ai modificat datele. DDL modifică *structura* bazei (tabele, coloane).

### 💡 4.11.2 Concept nou și exemplu

```sql
CREATE TABLE Student(id INTEGER PRIMARY KEY, nume TEXT);
ALTER TABLE Student ADD COLUMN email TEXT;
DROP TABLE Student;  -- sterge tabela complet
```

`ALTER TABLE` adaugă/modifică/șterge coloane (în funcție de sistemul de gestiune a bazei de date).


```python
import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE Produs(id INTEGER PRIMARY KEY, nume TEXT, pret REAL)")
cur.execute("ALTER TABLE Produs ADD COLUMN stoc INTEGER")
conn.commit()

cur.execute("PRAGMA table_info(Produs)")
print("Coloanele tabelei Produs:", cur.fetchall())
```


:::tip
DDL e pentru "scheletul" bazei. Schimbările DDL sunt rare, față de DML (care e zilnic).
:::

## Problemă rezolvată pas cu pas

**Enunț.** Evoluăm structura tabelei Produs: adăugăm coloana `stoc` cu o valoare implicită, apoi redenumim tabela și verificăm structura după fiecare pas.

**Ideea.** DDL schimbă scheletul bazei, nu datele. `PRAGMA table_info` arată coloanele, iar `sqlite_master` arată tabelele existente. Rândurile vechi primesc valoarea `DEFAULT` a noii coloane.

```python
import sqlite3
conn = sqlite3.connect(':memory:')
conn.execute('CREATE TABLE Produs(id INTEGER PRIMARY KEY, nume TEXT, pret REAL)')
conn.execute("INSERT INTO Produs(nume, pret) VALUES ('pix', 3)")
conn.execute('ALTER TABLE Produs ADD COLUMN stoc INTEGER DEFAULT 0')
print([r[1] for r in conn.execute('PRAGMA table_info(Produs)')])
print(conn.execute('SELECT * FROM Produs').fetchall())
conn.execute('ALTER TABLE Produs RENAME TO Articol')
print([r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type = 'table'")])
```
Rezultatul:
```text
['id', 'nume', 'pret', 'stoc']
[(1, 'pix', 3.0, 0)]
['Articol']
```

:::atentie
## Greșeli frecvente
- Rulezi `DROP TABLE` crezând că golește tabela: o șterge cu totul, cu structură și date. Pentru golire folosește `DELETE FROM tabela`.
- Creezi o tabelă care există deja: apare eroare. Folosește `CREATE TABLE IF NOT EXISTS` sau `DROP TABLE IF EXISTS` înainte.
- Te aștepți ca `ALTER TABLE ... ADD COLUMN` să completeze valori în rândurile vechi: noua coloană e `NULL` (sau valoarea `DEFAULT`).
- Crezi că SQLite permite orice `ALTER`: schimbarea tipului unei coloane, de exemplu, se face recreând tabela.
:::

### 🔮 4.11.3 Citește și prezice

```python
import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE T(a INTEGER)")
conn.execute("ALTER TABLE T ADD COLUMN b INTEGER")
coloane = conn.execute("PRAGMA table_info(T)").fetchall()
print(len(coloane), [c[1] for c in coloane])
```

Ce afișează programul?


### 🤝 4.11.4 Exerciții ghidate

Creează tabela `Produs(id, nume, pret)` apoi adaugă coloana `stoc`.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: creeaza tabela Produs
cur.execute("___ TABLE Produs(id INTEGER PRIMARY KEY, nume TEXT, pret REAL)")

# Pasul 2: adauga coloana stoc
cur.execute("ALTER TABLE Produs ___ COLUMN stoc INTEGER")

# Pasul 3: salveaza modificarile de structura
conn.___()
```


### 🎯 4.11.5 Exerciții independente

Modifică tipul unei coloane sau șterge o coloană (dacă sistemul permite).


**Exercițiul 1.** Scrie cod Python care creează tabela `Produs(id, nume, pret)` și apoi adaugă coloana `stoc INTEGER` folosind `ALTER TABLE`.

**Exercițiul 2.** Extinde programul anterior cu o funcție `sterge_tabela(conn, nume_tabela)` care execută `DROP TABLE IF EXISTS` pentru tabela primită ca parametru și confirmă ștergerea printr-un mesaj.


### ✅ 4.11.6 Verifică-ți înțelegerea

1. Un elev spune: "am rulat `ALTER TABLE Produs ADD COLUMN stoc INTEGER` și apoi `INSERT INTO Produs(...) VALUES(...)` — ambele modifică tabela `Produs`, deci DDL și DML sunt același lucru." Ce e greșit în afirmația lui?
   a) Are dreptate — DDL și DML sunt denumiri diferite pentru aceeași categorie de comenzi SQL  b) **DDL (`ALTER`) modifică structura tabelei — coloanele, tipurile, existența ei — în timp ce DML (`INSERT`) modifică doar conținutul (rândurile), fără să schimbe structura; de-aia schimbările DDL sunt rare, iar DML se rulează zilnic**  c) DDL modifică doar conținutul rândurilor, iar DML modifică structura tabelei — elevul a inversat cele două categorii  d) Diferența e doar că DDL necesită `conn.commit()`, iar DML nu
      > DDL (`ALTER TABLE`) schimbă structura tabelei — coloane, tipuri, existența ei — în timp ce DML (`INSERT`) modifică doar conținutul, adăugând rânduri fără să atingă structura; de-aceea schimbările DDL sunt rare, iar comenzile DML rulează zilnic.

2. Care categorie de comenzi conține `CREATE`, `ALTER` și `DROP`?
   a) DML  b) **DDL**  c) DCL
      > DDL (Data Definition Language) definește structura: tabele, coloane, indecși.

3. Ce valoare primește o coloană nouă în rândurile existente, fără `DEFAULT`?
   a) 0  b) **NULL**  c) Un text gol
      > Coloana nu avea valori înainte, așa că rândurile vechi primesc NULL.

4. Care e diferența dintre `DELETE FROM T` și `DROP TABLE T`?
   a) Niciuna  b) **`DELETE` golește tabela, `DROP` o șterge cu totul**  c) `DROP` șterge doar un rând
      > După `DELETE`, tabela există, dar e goală; după `DROP`, tabela nu mai există.

---


:::verifica-cod
Scrie o funcție `adauga_coloana(tabel, nume_coloana, valoare_implicita)` care simulează `ALTER TABLE ... ADD COLUMN`, adăugând o nouă cheie (cu valoarea implicită dată) la fiecare rând (dicționar) din tabel. Demo: `adauga_coloana([{"id": 1, "nume": "Ana"}, {"id": 2, "nume": "Bogdan"}], "stoc", 0)` -> `[{'id': 1, 'nume': 'Ana', 'stoc': 0}, {'id': 2, 'nume': 'Bogdan', 'stoc': 0}]`
template: def adauga_coloana(tabel, nume_coloana, valoare_implicita):
    # completeaza
    pass

print(adauga_coloana([{"id": 1, "nume": "Ana"}, {"id": 2, "nume": "Bogdan"}], "stoc", 0))
output: [{'id': 1, 'nume': 'Ana', 'stoc': 0}, {'id': 2, 'nume': 'Bogdan', 'stoc': 0}]
:::

# Modulul 4.12 — SQL: DCL și TCL — drepturi și tranzacții

### 🔄 4.12.1 Recapitulare

Ai folosit DDL (4.11) și DML (4.10). Acum urmează controlul accesului și al operațiunilor multiple.

### 💡 4.12.2 Concept nou și exemplu

- **DCL (Data Control Language)**: `GRANT` / `REVOKE` — drepturi de acces pentru utilizatori.
- **TCL (Transaction Control Language)**: `COMMIT` (salvează), `ROLLBACK` (anulează), `SAVEPOINT`.

O **tranzacție** e un grup de operațiuni care trebuie să se execute integral ("toate sau nimic"):
```python
import sqlite3
conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE Cont(id INTEGER PRIMARY KEY, sold INTEGER CHECK (sold >= 0))")
cur.executemany("INSERT INTO Cont VALUES (?, ?)", [(1, 300), (2, 50)])
conn.commit()

try:
    cur.execute("UPDATE Cont SET sold = sold - 100 WHERE id=1")
    cur.execute("UPDATE Cont SET sold = sold + 100 WHERE id=2")
    conn.commit()        # ambele reușesc: modificările devin definitive
except sqlite3.Error:
    conn.rollback()      # ceva a eșuat: nimic nu se schimbă

print(cur.execute("SELECT sold FROM Cont ORDER BY id").fetchall())  # [(200,), (150,)]
```

:::tip
Tranzacțiile garantează consistența: dacă transferul de bani eșuează la jumătate, ROLLBACK anulează tot.
:::

## Problemă rezolvată pas cu pas

**Enunț.** Transfer bancar cu tranzacție: contul 1 are 100 de lei. Încercăm să transferăm 150 de lei. Constrângerea `CHECK (sold >= 0)` face al doilea pas să eșueze, iar `rollback` readuce ambele conturi la starea inițială.

**Ideea.** Ordinea pașilor e intenționat „întâi adăugăm, apoi scădem”, ca să vedem cum `rollback` anulează și pasul care reușise deja. Transferul de 30 de lei, valid, se confirmă cu `commit`.

```python
import sqlite3
conn = sqlite3.connect(':memory:')
conn.execute('CREATE TABLE Cont(id INTEGER PRIMARY KEY, sold INTEGER CHECK (sold >= 0))')
conn.executemany('INSERT INTO Cont VALUES (?, ?)', [(1, 100), (2, 50)])
conn.commit()
def transfer(sursa, dest, suma):
    try:
        conn.execute('UPDATE Cont SET sold = sold + ? WHERE id = ?', (suma, dest))
        conn.execute('UPDATE Cont SET sold = sold - ? WHERE id = ?', (suma, sursa))
        conn.commit()
        return 'reușit'
    except sqlite3.IntegrityError:
        conn.rollback()
        return 'anulat'

print(transfer(1, 2, 150), conn.execute('SELECT sold FROM Cont ORDER BY id').fetchall())
print(transfer(1, 2, 30), conn.execute('SELECT sold FROM Cont ORDER BY id').fetchall())
```
Rezultatul:
```text
anulat [(100,), (50,)]
reușit [(70,), (80,)]
```

:::atentie
## Greșeli frecvente
- Faci `commit()` după primul `UPDATE` al unui transfer: dacă al doilea eșuează, banii au dispărut deja din primul cont.
- Prinzi eroarea cu `except` dar uiți `rollback()`: modificările parțiale rămân în tranzacția deschisă.
- Crezi că `ROLLBACK` anulează și modificările deja confirmate cu `COMMIT`. Nu le anulează: după commit, ele sunt definitive.
- Confunzi DCL (`GRANT`/`REVOKE`, drepturi) cu TCL (`COMMIT`/`ROLLBACK`, tranzacții). SQLite nu are utilizatori, deci nici `GRANT`.
:::

### 🔮 4.12.3 Citește și prezice

```python
import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE Cont(id INTEGER PRIMARY KEY, sold INTEGER)")
conn.executemany("INSERT INTO Cont VALUES (?, ?)", [(1, 100), (2, 50)])
conn.commit()

conn.execute("UPDATE Cont SET sold = sold - 100 WHERE id = 1")
# al doilea UPDATE a eșuat, deci anulăm tot
conn.rollback()
print(conn.execute("SELECT sold FROM Cont ORDER BY id").fetchall())
```

Primul `UPDATE` reușise, dar tranzacția e anulată. Ce solduri rămân?


### 🤝 4.12.4 Exerciții ghidate

Scrie un transfer bancar cu `try/except` și `commit`/`rollback`.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: incearca transferul intre conturi
try:
    cur.execute("UPDATE Cont SET sold = sold - 100 WHERE id=1")
    cur.execute("UPDATE Cont SET sold = sold + 100 WHERE id=2")
    conn.___()          # salveaza tranzactia daca ambele reusesc
except:
    conn.___()          # anuleaza tot daca a esuat ceva
```


### 🎯 4.12.5 Exerciții independente

Creează un `SAVEPOINT` înainte de o ștergere, apoi demonstrează `ROLLBACK TO SAVEPOINT`.


**Exercițiul 1.** Scrie o funcție `transfer(conn, id_sursa, id_dest, suma)` care face două `UPDATE`-uri (scade `suma` din contul sursă, o adaugă în contul destinație) și face `commit` doar dacă ambele reușesc.

**Exercițiul 2.** Extinde funcția `transfer` cu un bloc `try/except` care apelează `conn.rollback()` dacă a doua actualizare eșuează, astfel încât soldul contului sursă să rămână neschimbat.


### ✅ 4.12.6 Verifică-ți înțelegerea

1. Un elev scrie un transfer bancar fără `try/except`: rulează cele două `UPDATE`-uri și apoi un singur `conn.commit()` la final. Dacă al doilea `UPDATE` eșuează (de exemplu din cauza unei erori de rețea la interogare), ce se întâmplă cu banii, și de ce e nevoie de `try/except` cu `rollback` în plus față de simplul `commit`?
   a) Nimic grav — SQLite anulează automat primul `UPDATE` dacă al doilea eșuează, chiar și fără `rollback` explicit  b) `commit()` salvează automat doar operațiile reușite, deci primul cont rămâne neschimbat oricum, iar `try/except` e doar o măsură stilistică, nu una necesară  c) **Fără `try/except`, dacă al doilea `UPDATE` eșuează, execuția se oprește cu eroare înainte de `commit()`, dar primul `UPDATE` a fost deja aplicat în tranzacția curentă; fără `rollback()` explicit acea modificare parțială poate rămâne nesalvată dar "agățată", sau poate fi confirmată din greșeală la o reconectare — tranzacția trebuie închisă explicit cu commit sau rollback pentru a garanta "totul sau nimic"**  d) Diferența nu contează, pentru că `sqlite3` face automat rollback la orice eroare, indiferent dacă exista `try/except`
      > Fără `try/except`, dacă al doilea `UPDATE` eșuează, execuția se oprește cu eroare înainte să ajungă la `conn.commit()`, dar primul `UPDATE` a fost deja aplicat în tranzacția curentă; fără un `rollback()` explicit, acea modificare parțială rămâne agățată în tranzacție, încălcând regula „totul sau nimic” pe care trebuie s-o garanteze un transfer bancar.

2. Ce înseamnă că o tranzacție e „atomică”?
   a) E foarte rapidă  b) **Toate operațiile ei se aplică împreună, sau niciuna**  c) Are o singură operație
      > Atomicitatea garantează că nu rămân modificări pe jumătate, ca la un transfer întrerupt.

3. Ce face `ROLLBACK`?
   a) Salvează modificările  b) **Anulează modificările necomise din tranzacția curentă**  c) Șterge baza de date
      > Revine la starea de după ultimul `COMMIT`.

4. Ce comenzi țin de DCL?
   a) `COMMIT` și `ROLLBACK`  b) **`GRANT` și `REVOKE`**  c) `CREATE` și `DROP`
      > DCL controlează drepturile utilizatorilor (cine poate citi sau modifica tabelele); TCL controlează tranzacțiile.

---


:::verifica-cod
Scrie o funcție `transfer(conturi, sursa, dest, suma)` care simulează un transfer bancar (dicționar id -> sold): dacă `sursa` nu are fonduri suficiente, tranzacția eșuează și `conturi` rămâne NESCHIMBAT (ca după un `ROLLBACK`); altfel scade suma din sursă și o adaugă la destinație. Demo: încearcă un transfer prea mare și arată că soldurile rămân neschimbate. Demo: `conturi = {1: 20, 2: 50}
transfer(conturi, 1, 2, 100)
print(conturi)` -> `{1: 20, 2: 50}`
template: def transfer(conturi, sursa, dest, suma):
    # completeaza
    pass

conturi = {1: 20, 2: 50}
transfer(conturi, 1, 2, 100)
print(conturi)
output: {1: 20, 2: 50}
:::
