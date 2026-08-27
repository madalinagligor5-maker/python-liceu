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

### 🔮 4.1.3 Citește și prezice

```python
# Daca Student are atributele (id, nume, varsta)
# si avem inregistrarea (1, "Ana", 17)
# Ce valoare are atributul 'nume'?
```

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

---


:::verifica-cod
Scrie un script scurt care demonstrează conceptul din acest modul (ex: o funcție sau o interogare). Rulează-l și confirmă output-ul.
template: # Scrie aici codul


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

### 🔮 4.2.3 Citește și prezice

```python
# Student-Curs e relatie M:N.
# Cate tabele rezulta din mapare?
# (Student, Curs, si ?)
```

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

---


:::verifica-cod
Scrie un script scurt care demonstrează conceptul din acest modul (ex: o funcție sau o interogare). Rulează-l și confirmă output-ul.
template: # Scrie aici codul


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

### 🔮 4.3.3 Citește și prezice

```python
# Entitatea Student(id, nume) si Curs(cod, denumire)
# cu relatie 1:N (un curs are multi studenti)
# In ce tabel se pune cheia externa curs_id?
```

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

---


:::verifica-cod
Scrie un script scurt care demonstrează conceptul din acest modul (ex: o funcție sau o interogare). Rulează-l și confirmă output-ul.
template: # Scrie aici codul


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
Dacă ștergi un rând referențiat de o cheie externă, baza de date va refuza (sau va șterge în cascadă, dacă e设定 așa). Asta e integritatea referențială.
:::


:::tip
## Cum recunoști rapid PK vs. FK
Cheia primară (PK) apare o singură dată pe rând și nu se repetă niciodată în tabelă — e „identitatea” rândului. Cheia externă (FK) se poate repeta de multe ori (ex. mai mulți studenți au același `curs_id`), pentru că ea exprimă o legătură către altă tabelă, nu o identitate proprie. Dacă o coloană se repetă des în date de test, e semn că e FK, nu PK.
:::

### 🔮 4.4.3 Citește și prezice

```sql
-- Tabela Student are curs_id REFERENCES Curs(id)
-- Ce se intampla daca incerci sa inserezi un Student
-- cu curs_id=99 dar Curs(id=99) nu exista?
```


```python
# Analizează codul și prezice output-ul:
x = 5
y = 10
rezultat = x + y * 2
print("Rezultat obținut:", rezultat)
```


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

---


:::verifica-cod
Scrie un script scurt care demonstrează conceptul din acest modul (ex: o funcție sau o interogare). Rulează-l și confirmă output-ul.
template: # Scrie aici codul


:::

# Modulul 4.5 — Forme normale: FN1, FN2, FN3

### 🔄 4.5.1 Recapitulare

Ai definit tabele cu chei și constrângeri (4.4). Dar cum aranjăm coloanele ca să evităm redundanța?

### 💡 4.5.2 Concept nou și exemplu

**Normalizarea** reduce redundanța și anomalii (la ștergere/actualizare):
- **FN1**: valorile dintr-o coloană sunt atomice (nu liste în aceeași celulă).
- **FN2**: e în FN1 și nu are dependențe parțiale (atributele non-cheie depind de *tota* cheia, nu doar o parte).
- **FN3**: e în FN2 și nu are dependențe transitive (un atribut non-cheie nu depinde de alt atribut non-cheie).

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

### 🔮 4.5.3 Citește și prezice

```python
# Tabela Comanda(id, produs, pret, client, adresa_client)
# client determina adresa_client (tranzitiv).
# In ce forma normala e?
```

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


:::verifica-cod
Scrie un script scurt care demonstrează conceptul din acest modul (ex: o funcție sau o interogare). Rulează-l și confirmă output-ul.
template: # Scrie aici codul


:::
