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
## Sfaturi & Bune Practici Didactice
Deschide conexiunea cât mai târziu și închide-o cât mai devreme. Dacă uiți `conn.close()`, fișierul `.db` poate rămâne blocat pentru alte programe care vor să-l acceseze — cel mai sigur e să folosești `with sqlite3.connect(...) as conn:`, care închide automat conexiunea la ieșirea din bloc.
:::

### 🔮 4.6.3 Citește și prezice

```python
import sqlite3
conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE T(x INTEGER)")
cur.execute("INSERT INTO T VALUES (5)")
# Cat are T inainte de commit? (count)
```

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

De ce ai nevoie de ambele — Connection (pentru commit/close) și Cursor (pentru execute)?

---


:::verifica-cod
Scrie un script scurt care demonstrează conceptul din acest modul (ex: o funcție sau o interogare). Rulează-l și confirmă output-ul.
template: # Scrie aici codul


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

### 🔮 4.7.3 Citește și prezice

```sql
-- Tabela Student(nume, varsta): ('Ana',17),('Bogdan',19),('Cris',17)
-- SELECT nume FROM Student ORDER BY varsta DESC, nume ASC
-- Care e primul rezultat?
```


```python
# Analizează codul și prezice output-ul:
x = 5
y = 10
rezultat = x + y * 2
print("Rezultat obținut:", rezultat)
```


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

Ce diferență e între `WHERE` (filtrare rânduri) și proiecția `SELECT col1, col2` (filtrare coloane)?

---


:::verifica-cod
Scrie un script scurt care demonstrează conceptul din acest modul (ex: o funcție sau o interogare). Rulează-l și confirmă output-ul.
template: # Scrie aici codul


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
## Sfaturi & Bune Practici Didactice
Orice coloană din `SELECT` care nu e argument al unei funcții agregate trebuie să apară și în `GROUP BY` — altfel rezultatul e ambiguu (SQLite e permisiv și alege o valoare oarecare, dar alte SGBD-uri refuză direct interogarea).
:::

### 🔮 4.8.3 Citește și prezice

```sql
-- Vanzari(oras, suma): ('A',100),('A',200),('B',50)
-- SELECT oras, SUM(suma) FROM Vanzari GROUP BY oras
-- Care e suma pentru 'A'?
```


```python
# Analizează codul și prezice output-ul:
x = 5
y = 10
rezultat = x + y * 2
print("Rezultat obținut:", rezultat)
```


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

De ce `HAVING COUNT(*) > 1` e permis, dar `WHERE COUNT(*) > 1` nu?

---


:::verifica-cod
Scrie un script scurt care demonstrează conceptul din acest modul (ex: o funcție sau o interogare). Rulează-l și confirmă output-ul.
template: # Scrie aici codul


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

### 🔮 4.9.3 Citește și prezice

```sql
-- Student(1,'Ana'),(2,'Bogdan'); Inscriere(1,10),(2,10)
-- INNER JOIN Student-Incriere: cate randuri are rezultatul?
```


```python
# Analizează codul și prezice output-ul:
x = 5
y = 10
rezultat = x + y * 2
print("Rezultat obținut:", rezultat)
```


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

Când preferi o subinterogare în loc de JOIN (sau invers)?

---


:::verifica-cod
Scrie un script scurt care demonstrează conceptul din acest modul (ex: o funcție sau o interogare). Rulează-l și confirmă output-ul.
template: # Scrie aici codul


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
## Sfaturi & Bune Practici Didactice
Folosește întotdeauna parametri legați — `cur.execute("... WHERE nume = ?", (nume,))` — în loc să concatenezi valori direct în string-ul SQL. Previi atât erorile de sintaxă cauzate de ghilimele sau caractere speciale, cât și atacurile de tip SQL injection.
:::

### 🔮 4.10.3 Citește și prezice

```sql
-- Tabela are ('Ana',17),('Bogdan',19)
-- UPDATE Student SET varsta = varsta + 1 WHERE nume='Ana'
-- Cat are Ana acum?
```


```python
# Analizează codul și prezice output-ul:
x = 5
y = 10
rezultat = x + y * 2
print("Rezultat obținut:", rezultat)
```


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

De ce `DELETE FROM Tabela` (fără WHERE) e periculos și cum îl refuzi dacă e accidental?

---


:::verifica-cod
Scrie un script scurt care demonstrează conceptul din acest modul (ex: o funcție sau o interogare). Rulează-l și confirmă output-ul.
template: # Scrie aici codul


:::

# Modulul 4.11 — SQL: DDL — creare și modificare a structurii

### 🔄 4.11.1 Recapitulare

În 4.10 ai modificat datele. DDL modifică *structura* bazei (tabrole, coloane).

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

### 🔮 4.11.3 Citește și prezice

```sql
-- CREATE TABLE T(a INT); ALTER TABLE T ADD COLUMN b INT;
-- Cat coloane are T acum?
```


```python
# Analizează codul și prezice output-ul:
x = 5
y = 10
rezultat = x + y * 2
print("Rezultat obținut:", rezultat)
```


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

Care e diferența între DDL (`CREATE/ALTER`) și DML (`INSERT/UPDATE`)?

---


:::verifica-cod
Scrie un script scurt care demonstrează conceptul din acest modul (ex: o funcție sau o interogare). Rulează-l și confirmă output-ul.
template: # Scrie aici codul


:::

# Modulul 4.12 — SQL: DCL și TCL — drepturi și tranzacții

### 🔄 4.12.1 Recapitulare

Ai folosit DDL (4.11) și DML (4.10). Acum_controlul accesului și al operațiunilor multiple.

### 💡 4.12.2 Concept nou și exemplu

- **DCL (Data Control Language)**: `GRANT` / `REVOKE` — drepturi de acces pentru utilizatori.
- **TCL (Transaction Control Language)**: `COMMIT` (salvează), `ROLLBACK` (anulează), `SAVEPOINT`.

O **tranzacție** e un grup de operațiuni care trebuie să se execute integral ("toate sau nimic"):
```python
try:
    cur.execute("UPDATE Cont SET sold = sold - 100 WHERE id=1")
    cur.execute("UPDATE Cont SET sold = sold + 100 WHERE id=2")
    conn.commit()        # ambele reusesc
except:
    conn.rollback()      # nimic nu se schimba
```

:::tip
Tranzacțiile garantează consistența: dacă transferul de bani eșuează la jumătate, ROLLBACK anulează tot.
:::

### 🔮 4.12.3 Citește și prezice

```python
# Transfer 100 de la contul 1 la 2.
# Daca a 2-a UPDATE da eroare, ce face ROLLBACK?
```

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

De ce tranzacțiile sunt esențiale pentru operațiuni financiare (și nu doar `commit` simplu)?


:::verifica-cod
Scrie un script scurt care demonstrează conceptul din acest modul (ex: o funcție sau o interogare). Rulează-l și confirmă output-ul.
template: # Scrie aici codul


:::
