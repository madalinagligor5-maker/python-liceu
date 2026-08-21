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

### 🎯 4.1.5 Exerciții independente

Scrie o listă de dicționare care să reprezinte 3 cărți, fiecare cu cele 4 atribute.

### ✅ 4.1.6 Verifică-ți înțelegerea

De ce fiecare entitate are nevoie de o cheie (atribut care identifică unic)?

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

### 🎯 4.2.5 Exerciții independente

Modelați relația M:N "Studenți — Proiecte" cu o tabelă asociativă.

### ✅ 4.2.6 Verifică-ți înțelegerea

De ce o relație M:N nu poate fi reprezentată doar prin chei externe într-una din tabele?

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

### 🎯 4.3.5 Exerciții independente

Scrie `CREATE TABLE` pentru o relație M:N cu tabelă asociativă `Inscriere`.

### ✅ 4.3.6 Verifică-ți înțelegerea

De ce la maparea M:N rezultă o tabelă suplimentară față de cele două entități?

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

:::atentie
Dacă ștergi un rând referențiat de o cheie externă, baza de date va refuza (sau va șterge în cascadă, dacă e设定 așa). Asta e integritatea referențială.
:::

### 🔮 4.4.3 Citește și prezice

```sql
-- Tabela Student are curs_id REFERENCES Curs(id)
-- Ce se intampla daca incerci sa inserezi un Student
-- cu curs_id=99 dar Curs(id=99) nu exista?
```

### 🤝 4.4.4 Exerciții ghidate

Scrie `CREATE TABLE` pentru `Comanda(id, data, client_id REFERENCES Client(id))` cu constrângeri.

### 🎯 4.4.5 Exerciții independente

Adaugă o constrângere `CHECK` care să nu permită vârsta negativă la `Student`.

### ✅ 4.4.6 Verifică-ți înțelegerea

De ce e utilă integritatea referențială și ce se întâmplă dacă e încălcată?

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

### 🎯 4.5.5 Exerciții independente

Normalizează la FN3 tabelul `Angajat(id, nume, dept, locatie_dept)`.

### ✅ 4.5.6 Verifică-ți înțelegerea

De ce normalizarea previne anomalii la actualizare (ex. schimbi orașul unui client în 5 rânduri)?


:::verifica-cod
Scrie un script scurt care demonstrează conceptul din acest modul (ex: o funcție sau o interogare). Rulează-l și confirmă output-ul.
template: # Scrie aici codul


:::
