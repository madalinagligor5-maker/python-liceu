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

### 🎯 4.6.5 Exerciții independente

Scrie o funcție `adauga(conn, nume, telefon)` care inserează și face commit.

### ✅ 4.6.6 Verifică-ți înțelegerea

De ce ai nevoie de ambele — Connection (pentru commit/close) și Cursor (pentru execute)?

---

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

:::tip
`SELECT *` ia toate coloanele — în producție e mai bine să numeri explicit coloanele (proiecție) pentru claritate și performanță.
:::

### 🔮 4.7.3 Citește și prezice

```sql
-- Tabela Student(nume, varsta): ('Ana',17),('Bogdan',19),('Cris',17)
-- SELECT nume FROM Student ORDER BY varsta DESC, nume ASC
-- Care e primul rezultat?
```

### 🤝 4.7.4 Exerciții ghidate

Scrie o interogare care afișează numele studenților mai mari de 18 ani, ordonați alfabetic.

### 🎯 4.7.5 Exerciții independente

Folosind `sqlite3` în Python, creează tabela, inserează 3 rânduri și afișează cele ordonate.

### ✅ 4.7.6 Verifică-ți înțelegerea

Ce diferență e între `WHERE` (filtrare rânduri) și proiecția `SELECT col1, col2` (filtrare coloane)?

---

# Modulul 4.8 — SQL: funcții agregate și grupare

### 🔄 4.8.1 Recapitulare

În 4.7 ai selectat și ordonat rânduri. Acum calculezi statistici pe grupuri.

### 💡 4.8.2 Concept nou și exemplu

Funcții agregate: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`. `GROUP BY` grupează rândurile după o coloană, iar `HAVING` filtrează grupurile.

```sql
SELECT oras, COUNT(*) FROM Student GROUP BY oras;
SELECT oras, AVG(varsta) FROM Student GROUP BY oras HAVING AVG(varsta) > 17;
```

:::atentie
`WHERE` filtrează înainte de grupare; `HAVING` filtrează după grupare. Nu poți folosi `WHERE` pe o funcție agregată.
:::

### 🔮 4.8.3 Citește și prezice

```sql
-- Vanzari(oras, suma): ('A',100),('A',200),('B',50)
-- SELECT oras, SUM(suma) FROM Vanzari GROUP BY oras
-- Care e suma pentru 'A'?
```

### 🤝 4.8.4 Exerciții ghidate

Scrie o interogare care returnează numărul de studenți pe fiecare oraș.

### 🎯 4.8.5 Exerciții independente

Calculează media vârstei per oraș, dar doar pentru orașele cu minim 2 studenți.

### ✅ 4.8.6 Verifică-ți înțelegerea

De ce `HAVING COUNT(*) > 1` e permis, dar `WHERE COUNT(*) > 1` nu?

---

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

:::tip
INNER JOIN returnează doar rândurile cu potrivire în ambele tabele. LEFT JOIN păstrează toate din stânga, chiar dacă n-au potrivire.
:::

### 🔮 4.9.3 Citește și prezice

```sql
-- Student(1,'Ana'),(2,'Bogdan'); Inscriere(1,10),(2,10)
-- INNER JOIN Student-Incriere: cate randuri are rezultatul?
```

### 🤝 4.9.4 Exerciții ghidate

Scrie un JOIN care afișează numele studenților și denumirea cursurilor la care sunt înscriși.

### 🎯 4.9.5 Exerciții independente

Scrie o subinterogare care returnează studenții înscriși la un curs dat.

### ✅ 4.9.6 Verifică-ți înțelegerea

Când preferi o subinterogare în loc de JOIN (sau invers)?

---

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

:::atentie
`UPDATE`/`DELETE` fără `WHERE` modifică/toată tabela! Verifică mereu condiția înainte.
:::

### 🔮 4.10.3 Citește și prezice

```sql
-- Tabela are ('Ana',17),('Bogdan',19)
-- UPDATE Student SET varsta = varsta + 1 WHERE nume='Ana'
-- Cat are Ana acum?
```

### 🤝 4.10.4 Exerciții ghidate

Scrie cod Python care inserează 3 studenți și apoi actualizează vârsta unuia.

### 🎯 4.10.5 Exerciții independente

Șterge toate înregistrările cu vârsta mai mică de 16, folosind `cur.execute` + `commit`.

### ✅ 4.10.6 Verifică-ți înțelegerea

De ce `DELETE FROM Tabela` (fără WHERE) e periculos și cum îl refuzi dacă e accidental?

---

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

:::tip
DDL e pentru "scheletul" bazei. Schimbările DDL sunt rare, față de DML (care e zilnic).
:::

### 🔮 4.11.3 Citește și prezice

```sql
-- CREATE TABLE T(a INT); ALTER TABLE T ADD COLUMN b INT;
-- Cat coloane are T acum?
```

### 🤝 4.11.4 Exerciții ghidate

Creează tabela `Produs(id, nume, pret)` apoi adaugă coloana `stoc`.

### 🎯 4.11.5 Exerciții independente

Modifică tipul unei coloane sau șterge o coloană (dacă sistemul permite).

### ✅ 4.11.6 Verifică-ți înțelegerea

Care e diferența între DDL (`CREATE/ALTER`) și DML (`INSERT/UPDATE`)?

---

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

### 🎯 4.12.5 Exerciții independente

Creează un `SAVEPOINT` înainte de o ștergere, apoi demonstrează `ROLLBACK TO SAVEPOINT`.

### ✅ 4.12.6 Verifică-ți înțelegerea

De ce tranzacțiile sunt esențiale pentru operațiuni financiare (și nu doar `commit` simplu)?
