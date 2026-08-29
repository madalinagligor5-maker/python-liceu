# Conținut lecții — Capitolul 1 (Clasa a IX-a), Modulele 1.1–1.8

Respectă exact structura de pe `academiapython.ro/curriculum/IX` — 6 sublecții per modul, aceleași etichete/iconuri. Gata de copiat în locul textului „în pregătire".

---

# Modulul 1.1 — Ce este un algoritm? Etapele elaborării unui program

### 🔄 1.1.1 Recapitulare

Nu ai încă o lecție anterioară pe platformă — dar ai deja experiență cu algoritmi, chiar dacă nu i-ai numit așa. De câte ori urmezi o rețetă de gătit, montezi un mobilier după instrucțiuni sau explici cuiva drumul spre casa ta, dai de fapt o succesiune de pași clari, în ordine. Exact asta e un algoritm. Gândește-te un minut: cum ai explica unui robot, pas cu pas, cum se face un ceai?

:::exemplu
## Exemple de algoritmi din viața de zi cu zi
- O rețetă de gătit (pași în ordine: fierbi apa, pui plicu, lași 3 minute).
- Montarea unui mobilier după instrucțiuni.
- Explicarea drumului spre casă cuiva.
Toate sunt succesiuni de pași clari, executați în ordine — adică algoritmi.
:::

### 💡 1.1.2 Concept nou și exemplu

Înainte de algoritmi, ai nevoie de două „cărămizi" de bază, pe care le vei folosi în fiecare exemplu de-acum înainte: **variabilele** și `print()`.

O **variabilă** e un nume care ține minte o valoare, ca o cutie etichetată. O creezi printr-o **atribuire**: scrii numele variabilei, semnul `=`, apoi valoarea. **`print()`** afișează pe ecran ce îi dai ca argument între paranteze.

```python
varsta = 15      # atribuire: variabila "varsta" ține minte valoarea 15
nume = "Ana"      # atribuire: variabila "nume" ține minte textul "Ana"

print(varsta)     # afișează: 15
print(nume)       # afișează: Ana
```

:::atentie
## Semnul `=` nu înseamnă „egal", ci „atribuie"
`varsta = 15` nu e o ecuație matematică — înseamnă „pune valoarea 15 în cutia numită varsta". De asta poți scrie și `varsta = varsta + 1` (ia valoarea curentă, adaugă 1, pune rezultatul înapoi în aceeași cutie) — sau, mai scurt, `varsta += 1` (fac exact același lucru).
:::

Cu aceste două unelte — variabile și `print()` — poți urmări exemplul de mai jos, care arată cele 4 etape ale elaborării unui program.

Un **algoritm** este o succesiune finită de pași, clari și fără ambiguitate, care rezolvă o problemă. Un **program** este un algoritm scris într-un limbaj pe care îl înțelege calculatorul — la noi, **Python**.

Orice program trece prin patru etape de elaborare:

:::tip
## 1. Analiză
Înțelegem problema în detaliu. Identificăm ce date primim (date de intrare) și ce rezultate dorim să obținem (date de ieșire).
*Cod model:* `nota1 = 8`, `nota2 = 10` (datele cunoscute din problemă).
:::

:::tip
## 2. Proiectare
Construim algoritmul. Stabilim succesiunea logică de pași clari care transformă datele de intrare în rezultate finale.
*Cod model:* `media = (nota1 + nota2) / 2` (formula matematică a mediei).
:::

:::tip
## 3. Implementare
Scriem efectiv algoritmul într-un limbaj de programare real. Traducem pașii proiectați în instrucțiuni de cod Python.
*Cod model:* Scrierea liniilor de cod în editor, atribuind valorile variabilelor.
:::

:::tip
## 4. Testare
Rulăm codul scris cu diverse seturi de date pentru a verifica dacă rezultatele returnate sunt 100% corecte.
*Cod model:* `print("Media este:", media)` (afișarea rezultatului pe ecran).
:::

:::atentie
## Atenție — ce NU este un algoritm corect
- „Dacă plouă, stai acasă sau mergi la film" — **lipsă de claritate** (nu știi ce să alegi exact).
- „Afișează numerele pare" — **lipsă de finitudine** (dacă nu spui unde se oprește, rulează la infinit).
Un algoritm corect are mereu claritate (pași exacți) și finitudine (se oprește garantat).
:::

```python
# Exemplu complet de program cu cele 4 etape
# Analiză: avem notele 8 și 10. Proiectare: adunăm și împărțim la 2.
nota1 = 8
nota2 = 10
media = (nota1 + nota2) / 2

# Implementare & Testare: afișăm valoarea obținută
print("Media notelor este:", media)
```

Observă: primele două linii sunt comentarii (încep cu `#`) — nu sunt executate, dar arată gândirea din spatele codului. E o obișnuință bună: comentează *de ce* faci un pas, nu doar *ce* face linia.

### 🔮 1.1.3 Citește și prezice

Uită-te la codul de mai jos, **fără să-l rulezi**, și scrie pe hârtie ce crezi că va afișa:

```python
pret = 20
reducere = 5
pret_final = pret - reducere

print("Prețul final este:", pret_final)
```

Ai scris predicția? Verific-o singur, mental, apoi treci mai departe — vei putea rula cod direct în platformă în curând.

### 🤝 1.1.4 Exerciții ghidate

**Exercițiul 1.** Vrei un algoritm care calculează aria unui dreptunghi. Completează pașii lipsă:

```python
# Pasul 1: citim lungimea și lățimea
lungime = 6
latime = 3

# Pasul 2: calculăm aria (lungime x lățime)
aria = ___  # completează aici

# Pasul 3: afișăm rezultatul
print("Aria este:", ___)  # completează aici
```
*Indiciu: aria unui dreptunghi = lungime × lățime.*

**Exercițiul 2.** Scrie, în ordine, cele 4 etape ale elaborării unui program, pentru problema: „calculează prețul total pentru 3 produse cu prețuri diferite". Nu scrie cod încă — doar descrie fiecare etapă într-o propoziție.

### 🎯 1.1.5 Exerciții independente

**Exercițiul 1.** Scrie un program Python care calculează și afișează media a trei note: 7, 9 și 10.

**Exercițiul 2.** Scrie un program care calculează perimetrul unui pătrat, știind latura acestuia (alege tu o valoare pentru latură).

### ✅ 1.1.6 Verifică-ți înțelegerea

1. Care este prima etapă în elaborarea unui program?
   a) Scrierea codului  b) **Înțelegerea problemei (analiza)**  c) Testarea programului
      > Fiecare program pornește de la etapa de analiză, în care înțelegi problema și stabilești ce date primești și ce rezultate vrei să obții — abia apoi urmează proiectarea, implementarea și testarea.

2. Ce este un algoritm?
   a) Un limbaj de programare  b) **O succesiune de pași care rezolvă o problemă**  c) Un mesaj de eroare
      > Un algoritm este definit ca o succesiune finită de pași, clari și fără ambiguitate, care rezolvă o problemă — nu ține de un limbaj anume, ci de logica pașilor în sine.

3. La ce etapă verificăm dacă programul dă rezultate corecte pentru mai multe exemple?
   a) Analiză  b) Proiectare  c) **Testare**
      > Verificarea rezultatelor pe mai multe seturi de date se face la etapa de testare, ultima din cele patru, unde rulezi codul scris ca să confirmi că răspunsurile sunt 100% corecte.

4. Ce fac liniile care încep cu `#` într-un program Python?
   a) **Sunt comentarii, nu se execută**  b) Opresc programul  c) Afișează un mesaj de eroare
      > Liniile care încep cu `#` sunt comentarii: Python le ignoră complet la execuție, ele existând doar ca să explice gândirea din spatele codului pentru cine citește programul.

---


:::verifica-cod
Scrie un mic program care calculează și afișează prețul total pentru 2 produse, cunoscând prețul fiecăruia. Demo: preț 12 și preț 15 -> total 27.
template: pret1 = 12
pret2 = 15
total = ___

print("Total:", total)
output: Total: 27
:::

# Modulul 1.2 — Reprezentarea algoritmilor: scheme logice, pseudocod, cod

### 🔄 1.2.1 Recapitulare

În modulul trecut ai văzut cele 4 etape ale elaborării unui program. La etapa de **proiectare**, ai nevoie de un mod de a „desena" sau „scrie" algoritmul înainte de a-l transforma în cod Python. Îți amintești care era etapa de proiectare?

### 💡 1.2.2 Concept nou și exemplu

Un algoritm poate fi reprezentat în trei moduri, de la cel mai vizual la cel mai precis:

- **Schemă logică** — un desen cu forme (dreptunghi = acțiune, romb = decizie) legate prin săgeți, care arată fluxul pașilor.
- **Pseudocod** — pașii scriși în limbaj natural, dar structurat, apropiat de sintaxa unui limbaj de programare, fără reguli stricte.
- **Cod** — algoritmul scris exact, într-un limbaj de programare (Python), pe care calculatorul îl poate rula.

Înainte de exemplu, iată sintaxa exactă a celor mai folosite structuri de control în Python — le vei recunoaște de-acum în orice modul.

**Decizie (`if` / `elif` / `else`)** — execută un bloc de cod doar dacă o condiție e adevărată:
```python
if conditie:
    # cod dacă e adevărată
elif alta_conditie:
    # cod dacă prima e falsă, dar asta e adevărată (opțional, poți avea mai multe elif)
else:
    # cod dacă niciuna nu e adevărată (opțional)
```
Observă: după `if`/`elif`/`else` pui întotdeauna două puncte `:`, iar codul de dedesubt e **indentat** (mutat la dreapta cu spații) — indentarea, nu acoladele, marchează ce aparține blocului respectiv.

**Buclă `for`** — repetă un bloc de cod de un număr cunoscut de ori (de obicei cu `range`):
```python
for i in range(5):   # i ia pe rând valorile 0, 1, 2, 3, 4
    print(i)
```

**Buclă `while`** — repetă un bloc de cod cât timp o condiție rămâne adevărată:
```python
contor = 0
while contor < 5:
    print(contor)
    contor += 1   # fără linia asta, bucla nu s-ar mai opri niciodată
```

:::tip
## Recunoști tiparul?
Toate cele trei (`if`, `for`, `while`) urmează aceeași regulă: cuvântul cheie, apoi condiția sau intervalul, apoi două puncte `:`, apoi codul indentat dedesubt.
:::

Aceeași problemă („e numărul par sau impar?"), în cele trei forme:

*Schemă logică (descriere):* start → citește n → n % 2 == 0? → dacă da: afișează „par" → dacă nu: afișează „impar" → stop.

*Pseudocod:*
```
citește n
dacă n % 2 == 0 atunci
    afișează "par"
altfel
    afișează "impar"
```

*Cod Python:*
```python
n = 7

if n % 2 == 0:
    print("par")
else:
    print("impar")
```

Observă cât de aproape e pseudocodul de codul Python — de asta pseudocodul e o etapă utilă de proiectare: gândești logica, fără să te lupți încă cu sintaxa exactă.

:::atentie
## Nu confunda cele trei forme
- **Schema logică** se desenează (forme + săgeți), nu se scrie cod.
- **Pseudocodul** nu rulează — e doar un plan în limbaj apropiat de programare.
- Doar **codul Python** se execută efectiv pe calculator.
:::

### 🔮 1.2.3 Citește și prezice

Ai acest pseudocod:
```
citește varsta
dacă varsta >= 18 atunci
    afișează "major"
altfel
    afișează "minor"
```
Și codul Python echivalent, cu `varsta = 16`:
```python
varsta = 16

if varsta >= 18:
    print("major")
else:
    print("minor")
```
Ce crezi că se afișează? Scrie predicția înainte să citești mai departe.

:::tip
## Cum faci o predicție bună
Citește codul de sus în jos, ca calculatorul. Urmărește ce valoare are fiecare variabilă la fiecare linie și ce se trimite la `print`. Nu ghici — urmărește pașii.
:::

### 🤝 1.2.4 Exerciții ghidate

**Exercițiul 1.** Transformă acest pseudocod în cod Python:
```
citește temperatura
dacă temperatura > 30 atunci
    afișează "zi caniculară"
altfel
    afișează "temperatură normală"
```
```python
temperatura = 33

# completează aici codul Python echivalent
```

**Exercițiul 2.** Scrie pseudocodul (nu codul!) pentru: „dacă un elev are media peste 9, primește calificativul Excelent, altfel primește Bine".


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Pasul 1: declarare date
pret_produs = 15
taxa_transport = 5

# Pasul 2: calcul
cost_total = pret_produs + taxa_transport  # Completează variabilele
print("Cost total:", cost_total)
```


### 🎯 1.2.5 Exerciții independente

**Exercițiul 1.** Scrie pseudocodul *și* codul Python pentru: „citește un număr; dacă e mai mare decât 100, afișează 'mare', altfel afișează 'mic'".

**Exercițiul 2.** Descrie în cuvinte (ca pentru o schemă logică) pașii unui algoritm care verifică dacă un elev a promovat un examen (nota minimă de trecere este 5).

### ✅ 1.2.6 Verifică-ți înțelegerea

1. Care reprezentare a unui algoritm folosește forme geometrice și săgeți?
   a) **Schema logică**  b) Pseudocodul  c) Codul Python
      > Schema logică este singura din cele trei reprezentări care folosește un desen cu forme geometrice (dreptunghi pentru acțiune, romb pentru decizie) legate prin săgeți.

2. De ce e util pseudocodul înainte de a scrie cod?
   a) Pentru că e obligatoriu în Python  b) **Pentru că te lasă să gândești logica, fără reguli stricte de sintaxă**  c) Pentru că rulează mai repede
      > Pseudocodul e util pentru că te lasă să gândești logica pașilor fără să te lupți încă cu sintaxa exactă a unui limbaj, fiind doar un plan apropiat de programare care nu rulează.

3. Care dintre aceste trei este singura formă pe care o poate rula direct calculatorul?
   a) Schema logică  b) Pseudocodul  c) **Codul**
      > Dintre cele trei forme, doar codul Python se execută efectiv pe calculator — schema logică se desenează, iar pseudocodul rămâne doar un plan în limbaj natural.

4. Ce simbol reprezintă, de obicei, o decizie într-o schemă logică?
   a) Dreptunghi  b) **Romb**  c) Cerc
      > În schema logică, rombul este simbolul folosit convențional pentru o decizie (o întrebare cu ramificație da/nu), spre deosebire de dreptunghi, care marchează o acțiune simplă.

---


:::verifica-cod
Scrie un mic program care verifică dacă o notă este de trecere (mai mare sau egală cu 5) și afișează mesajul corespunzător. Demo: nota 6 -> „Promovat".
template: nota = 6

if nota >= 5:
    print(___)
else:
    print("Corigent")
output: Promovat
:::

# Modulul 1.3 — Eficiența unui algoritm — noțiuni de bază

### 🔄 1.3.1 Recapitulare

Ai învățat că poți reprezenta același algoritm în trei moduri (schemă, pseudocod, cod). Dar pentru aceeași problemă pot exista mai mulți algoritmi diferiți, care ajung la același rezultat. Ce crezi, contează *cum* rezolvi o problemă, atâta timp cât rezultatul e corect?

### 💡 1.3.2 Concept nou și exemplu

Da, contează. Un algoritm poate fi corect, dar **lent** sau **consumator de memorie**. **Eficiența** unui algoritm se măsoară din două puncte de vedere:

- **Timp** — câte operații face algoritmul până termină.
- **Memorie** — câte date reține algoritmul în timpul execuției.

Pentru a compara eficiența „la modul general" (nu doar pe un exemplu mic), informaticienii folosesc **notația O** (spus „O mare"), care arată cum crește timpul de execuție atunci când datele de intrare cresc. Nu intrăm în detalii matematice acum — reține doar ideea: un algoritm „O(n)" devine de două ori mai lent dacă dublezi datele, unul „O(n²)" devine de patru ori mai lent.

Exemplu — verificăm dacă un număr e prim, în două variante:

```python
# Varianta 1: verificăm toți divizorii posibili, până la n-1 (mai lent)
n = 29
prim = True
for i in range(2, n):
    if n % i == 0:
        prim = False
print(prim)
```

```python
# Varianta 2: e suficient să verificăm până la radical din n (mult mai rapid pentru n mare)
import math
n = 29
prim = True
for i in range(2, int(math.sqrt(n)) + 1):
    if n % i == 0:
        prim = False
print(prim)
```

Ambele dau același rezultat corect, dar pentru un număr foarte mare (ex. un milion), varianta 2 termină aproape instant, iar varianta 1 durează vizibil mai mult.

:::tip
## Ce reții despre eficiență
Nu e nevoie să știi acum notația O matematică. Ideea importantă: pentru aceeași problemă, un algoritm mai inteligent termină mai repede și folosește mai puțină memorie. Când ai două soluții care dau același rezultat, alege-o pe cea care face mai puțini pași.
:::

### 🔮 1.3.3 Citește și prezice

```python
n = 100000

# varianta A
count_a = 0
for i in range(n):
    count_a += 1

# varianta B
count_b = n

print(count_a == count_b)
```
Ambele variante calculează aceeași valoare — dar una face o buclă de 100.000 de pași, cealaltă face un singur pas. Care crezi că e mai eficientă? Ce se afișează?

### 🤝 1.3.4 Exerciții ghidate

**Exercițiul 1.** Ai două variante pentru a calcula suma primelor n numere naturale. Completează a doua variantă, mult mai eficientă (formula lui Gauss: `n*(n+1)/2`):

```python
n = 1000

# varianta 1: buclă, O(n)
suma1 = 0
for i in range(1, n + 1):
    suma1 += i

# varianta 2: formulă directă, O(1) — completează
suma2 = ___

print(suma1 == suma2)
```

**Exercițiul 2.** Explică, într-o propoziție, de ce varianta cu formulă e mai eficientă decât varianta cu buclă, indiferent cât de mare e n.

### 🎯 1.3.5 Exerciții independente

**Exercițiul 1.** Scrie două variante de cod care verifică dacă un număr `n` este par: una care folosește o buclă care numără din 2 în 2 până la n (ineficientă, doar ca exercițiu), și una care folosește direct `n % 2 == 0`. Compară-le.

**Exercițiul 2.** Pentru problema „găsește cel mai mare număr dintr-o listă de 10 numere", explică (în cuvinte) de ce ar fi ineficient să compari fiecare număr cu fiecare alt număr din listă, față de a parcurge lista o singură dată, reținând maximul găsit până acum.

### ✅ 1.3.6 Verifică-ți înțelegerea

1. Din ce două puncte de vedere măsurăm eficiența unui algoritm?
   a) Culoare și mărime  b) **Timp și memorie**  c) Lungimea codului și numărul de comentarii
      > Eficiența unui algoritm se măsoară prin timp (câte operații face până termină) și memorie (câte date reține pe parcurs) — nu prin aspecte precum lungimea codului sau stilul lui.

2. Ce arată, informal, notația O?
   a) Numărul exact de secunde de execuție  b) **Cum crește timpul de execuție când cresc datele de intrare**  c) Numărul de erori din program
      > Notația O arată, informal, cum crește timpul de execuție pe măsură ce cresc datele de intrare — de exemplu un algoritm O(n) devine de două ori mai lent dacă dublezi datele, nu îți dă un număr exact de secunde.

3. Dintre doi algoritmi corecți care rezolvă aceeași problemă, care e de preferat, în general?
   a) Cel mai lung ca și cod  b) **Cel mai eficient (timp/memorie), dacă rezultatul e la fel de corect**  c) Nu contează, oricare
      > Dacă rezultatul e la fel de corect, algoritmul mai eficient (care face mai puțini pași sau folosește mai puțină memorie) e de preferat, așa cum se vede în exemplul cu verificarea numărului prim până la n-1 față de până la radical din n.

4. De ce varianta cu formulă directă e mai eficientă decât o buclă, pentru suma primelor n numere?
   a) Are mai multe linii de cod  b) **Face un singur calcul, indiferent cât de mare e n**  c) Folosește mai multă memorie
      > Formula lui Gauss face un singur calcul, indiferent cât de mare e n, spre deosebire de o buclă care parcurge fiecare număr de la 1 la n și face n pași — de aceea rămâne rapidă chiar și pentru valori mari ale lui n.

---


:::verifica-cod
Scrie o funcție `salut(nume)` care afișează un salut personalizat. Demo: `salut('Ana')` -> `Salut, Ana!`
template: def salut(nume):
    # completeaza
    pass

salut('Ana')
output: Salut, Ana!
:::

# Modulul 1.4 — Subprograme (funcții): definire și apel

### 🔄 1.4.1 Recapitulare

Ai văzut că eficiența contează și că poți compara moduri diferite de a rezolva aceeași problemă. Dar dacă vrei să refolosești aceeași bucată de cod, în locuri diferite ale programului, fără să o copiezi de fiecare dată? Ai idee cum s-ar putea face asta?

### 💡 1.4.2 Concept nou și exemplu

Un **subprogram** (numit **funcție** în Python) este o bucată de cod căreia îi dai un nume, o scrii o singură dată, și o **apelezi** (folosești) de câte ori ai nevoie. O funcție are:

- **antet** — numele funcției și lista de **parametri** (datele pe care le primește);
- **corp** — pașii pe care îi execută;
- (opțional) `return` — valoarea pe care o „întoarce" înapoi, ca rezultat.

```python
def calculeaza_media(nota1, nota2):
    media = (nota1 + nota2) / 2
    return media

# apelul funcției — o "chemăm" cu valori concrete
rezultat = calculeaza_media(8, 10)
print("Media este:", rezultat)

# o putem apela din nou, cu alte valori, fără să rescriem logica
print("Altă medie:", calculeaza_media(6, 7))
```

Observă: `nota1` și `nota2` sunt parametrii — locuri libere pe care le completezi cu valori reale (8 și 10) atunci când apelezi funcția.

:::exemplu
## De ce folosim funcții
În loc să copiezi de 10 ori aceeași formulă în program, o scrii o dată într-o funcție și o „chemi" (apelezi) ori de câte ori ai nevoie, cu alte numere. Codul e mai scurt, mai ușor de citit și, dacă găsești o greșeală, o corectezi într-un singur loc.
:::

### 🔮 1.4.3 Citește și prezice

```python
def dubleaza(x):
    return x * 2

a = dubleaza(5)
b = dubleaza(a)

print(a, b)
```
Ce crezi că se afișează? (Indiciu: `b` folosește rezultatul lui `a`.)

### 🤝 1.4.4 Exerciții ghidate

**Exercițiul 1.** Completează funcția care calculează aria unui cerc (formula: `3.14 * raza * raza`):

```python
def aria_cerc(raza):
    aria = ___  # completează formula
    return aria

print(aria_cerc(5))
```

**Exercițiul 2.** Ai această funcție:
```python
def cub(numar):
    return numar ** 3
```
Scrie codul care apelează funcția pentru numărul 4 și afișează rezultatul.

### 🎯 1.4.5 Exerciții independente

**Exercițiul 1.** Scrie o funcție `converteste_in_celsius(fahrenheit)` care primește o temperatură în grade Fahrenheit și întoarce echivalentul în grade Celsius (formula: `(F - 32) * 5 / 9`). Apeleaz-o pentru valoarea 98.

**Exercițiul 2.** Scrie o funcție `perimetru_dreptunghi(lungime, latime)` care întoarce perimetrul unui dreptunghi, apoi apeleaz-o pentru două perechi diferite de valori.

### ✅ 1.4.6 Verifică-ți înțelegerea

1. Cum se numește o „bucată de cod cu nume, care poate fi apelată de mai multe ori"?
   a) Variabilă  b) **Funcție (subprogram)**  c) Comentariu
      > O bucată de cod cu nume, scrisă o dată și apelabilă de câte ori ai nevoie, se numește funcție (sau subprogram) — exact rolul descris pentru `calculeaza_media` din exemplu.

2. Ce cuvânt cheie folosim, în Python, pentru a defini o funcție?
   a) `function`  b) **`def`**  c) `func`
      > În Python, o funcție se definește cu cuvântul cheie `def`, urmat de nume, paranteze cu parametri și două puncte, ca în `def calculeaza_media(nota1, nota2):`.

3. Ce face instrucțiunea `return` într-o funcție?
   a) Oprește tot programul  b) **Întoarce o valoare, ca rezultat al funcției**  c) Șterge funcția
      > Instrucțiunea `return` întoarce o valoare din funcție, ca rezultat al ei — de exemplu `return media` face ca apelul funcției să aibă valoarea calculată, folosibilă mai departe în program.

4. În `def calculeaza_media(nota1, nota2):`, ce sunt `nota1` și `nota2`?
   a) Rezultate  b) **Parametri**  c) Comentarii
      > `nota1` și `nota2` sunt parametrii funcției — locurile libere din antet care se completează cu valori reale (ca 8 și 10) în momentul apelului.

---


:::verifica-cod
Scrie o funcție `salut(nume)` care afișează un salut personalizat. Demo: `salut('Ana')` -> `Salut, Ana!`
template: def salut(nume):
    # completeaza
    pass

salut('Ana')
output: Salut, Ana!
:::

# Modulul 1.5 — Variabile locale și globale, transmiterea prin parametri

### 🔄 1.5.1 Recapitulare

Ai învățat să scrii funcții cu parametri. Parametrii, ca `nota1` din exemplul trecut, „trăiesc" doar cât timp rulează funcția. Ce crezi că se întâmplă dacă încerci să folosești o variabilă definită *în interiorul* unei funcții, *în afara* ei?

### 💡 1.5.2 Concept nou și exemplu

O **variabilă locală** este definită în interiorul unei funcții și există doar acolo — dispare când funcția se termină. O **variabilă globală** este definită în afara oricărei funcții și poate fi *citită* de oriunde din program.

```python
scor_total = 0  # variabilă globală

def calculeaza_bonus(scor):
    bonus = scor * 2   # 'bonus' e variabilă locală — există doar aici
    return bonus

rezultat = calculeaza_bonus(10)
print(rezultat)       # funcționează: 20
print(scor_total)     # funcționează: 0, variabila globală e vizibilă peste tot

# print(bonus)         # EROARE! 'bonus' nu există în afara funcției
```

O greșeală frecventă: elevii cred că o variabilă locală „rămâne" după ce funcția se termină. Nu rămâne — memoria ei se eliberează.

:::atentie
## Capcană: variabila locală nu supraviețuiește
O variabilă creată în interiorul unei funcții dispare când funcția se termină. Dacă vrei să o folosești în altă parte, fie o întorci cu `return`, fie o faci globală. Altfel, încercarea de a o citi în afara funcției dă eroare.
:::


:::tip
## Sfaturi & Bune Practici Didactice
:::tip
Întotdeauna acordă atenție diferenței dintre operatorul de atribuire (=) și cel de egalitate (==). Folosirea greșită în condiții poate duce la erori de sintaxă sau comportament neașteptat!
:::
:::

### 🔮 1.5.3 Citește și prezice

```python
x = 10

def schimba(x):
    x = 99
    print("în funcție, x este:", x)

schimba(x)
print("în afara funcției, x este:", x)
```
Se schimbă valoarea lui `x` din afara funcției, sau nu? Scrie predicția, apoi verifică logica.

### 🤝 1.5.4 Exerciții ghidate

**Exercițiul 1.** Explică (fără cod), ce se va afișa în ultimele două linii ale exemplului de mai sus, și de ce.

**Exercițiul 2.** Completează funcția, având grijă ca variabila `dublu` să rămână locală:
```python
def dubleaza_si_afiseaza(numar):
    ___ = numar * 2  # completează numele variabilei locale
    print("Dublul este:", dublu)

dubleaza_si_afiseaza(7)
```

### 🎯 1.5.5 Exerciții independente

**Exercițiul 1.** Scrie o funcție `calculeaza_tva(pret)` care calculează TVA-ul (19% din preț) într-o variabilă locală și îl întoarce cu `return`. Apeleaz-o și afișează rezultatul într-o variabilă globală numită `tva_produs`.

**Exercițiul 2.** Explică, în cuvintele tale, diferența dintre o variabilă locală și una globală, folosind un exemplu propriu (nu din lecție).

### ✅ 1.5.6 Verifică-ți înțelegerea

1. O variabilă definită în interiorul unei funcții este:
   a) Globală  b) **Locală**  c) Constantă
      > O variabilă definită în interiorul unei funcții, cum e `bonus` din exemplu, este locală — există doar cât timp rulează funcția respectivă.

2. Ce se întâmplă cu o variabilă locală după ce funcția se termină?
   a) Rămâne disponibilă peste tot  b) **Este eliberată din memorie, nu mai există**  c) Devine automat globală
      > După ce funcția se termină, variabila ei locală este eliberată din memorie și nu mai există — de aceea încercarea de a o folosi în afara funcției dă eroare.

3. O variabilă globală poate fi citită:
   a) Doar în funcția în care a fost creată  b) **De oriunde din program**  c) Niciodată
      > O variabilă globală, definită în afara oricărei funcții, poate fi citită de oriunde din program, așa cum `scor_total` rămâne accesibilă și după ce funcția `calculeaza_bonus` s-a terminat.

4. De ce apare eroare dacă încerci să folosești, în afara funcției, o variabilă creată în interiorul ei?
   a) Pentru că variabilele locale au nume interzise  b) **Pentru că variabila locală nu mai există în afara funcției**  c) Pentru că Python nu permite variabile în funcții
      > Eroarea apare pentru că variabila locală nu supraviețuiește ieșirii din funcție — memoria ei se eliberează automat, deci numele ei pur și simplu nu mai există în restul programului.

---


:::verifica-cod
Scrie o funcție `salut(nume)` care afișează un salut personalizat. Demo: `salut('Ana')` -> `Salut, Ana!`
template: def salut(nume):
    # completeaza
    pass

salut('Ana')
output: Salut, Ana!
:::

# Modulul 1.6 — Funcții predefinite pentru calcule și pentru colecții

### 🔄 1.6.1 Recapitulare

Ai învățat să-ți scrii propriile funcții. Dar nu trebuie să „reinventezi roata" de fiecare dată — Python vine deja cu multe funcții gata scrise. Poți ghici numele vreuneia pe care ai folosit-o deja fără să știi că era o funcție predefinită?

### 💡 1.6.2 Concept nou și exemplu

Ai folosit deja o funcție predefinită: `print()`. Python are multe altele, gata de utilizat, fără să le mai scrii tu:

**Pentru calcule:**
```python
print(abs(-7))       # valoare absolută -> 7
print(round(3.756, 2))  # rotunjire la 2 zecimale -> 3.76
print(pow(2, 10))    # ridicare la putere -> 1024

import math
print(math.sqrt(81)) # radical -> 9.0
```

**Pentru colecții (liste):**
```python
note = [8, 9, 10, 7, 6]

print(len(note))     # câte elemente are lista -> 5
print(min(note))     # cea mai mică valoare -> 6
print(max(note))     # cea mai mare valoare -> 10
print(sum(note))     # suma valorilor -> 40
```

Combinate, aceste funcții îți economisesc mult cod: media notelor devine `sum(note) / len(note)`, în loc să scrii tu o buclă care adună fiecare notă.

:::tip
## Nu reinventa roata
Înainte să scrii o buclă sau un calcul de mână, întreabă-te: nu există deja o funcție predefinită pentru asta? `len`, `min`, `max`, `sum`, `abs`, `round`, `pow` și cele din `math` rezolvă de obicei problema mai scurt și mai sigur.
:::

### 🔮 1.6.3 Citește și prezice

```python
preturi = [15, 22, 8, 40, 12]

total = sum(preturi)
cel_mai_scump = max(preturi)
medie = round(total / len(preturi), 1)

print(total, cel_mai_scump, medie)
```
Ce trei valori crezi că se afișează?

### 🤝 1.6.4 Exerciții ghidate

**Exercițiul 1.** Completează, folosind funcțiile predefinite potrivite:
```python
temperaturi = [21, 19, 25, 30, 18]

cea_mai_mica = ___(temperaturi)
cea_mai_mare = ___(temperaturi)
numar_zile = ___(temperaturi)

print(cea_mai_mica, cea_mai_mare, numar_zile)
```

**Exercițiul 2.** Folosind `round()` și `math.sqrt()`, afișează radicalul din 50, rotunjit la 3 zecimale.

### 🎯 1.6.5 Exerciții independente

**Exercițiul 1.** Ai lista `varste = [14, 15, 16, 15, 14, 17]`. Afișează vârsta minimă, maximă și media vârstelor (rotunjită la o zecimală), folosind doar funcții predefinite.

**Exercițiul 2.** Scrie un program care citește (declari direct în cod) trei numere negative, într-o listă, și afișează suma valorilor lor absolute, folosind `abs()` și `sum()`.

### ✅ 1.6.6 Verifică-ți înțelegerea

1. Ce întoarce funcția `len(lista)`?
   a) Cea mai mare valoare  b) **Numărul de elemente din listă**  c) Suma elementelor
      > `len(lista)` întoarce numărul de elemente din listă, ca în exemplul cu `note`, unde `len(note)` dă 5 pentru o listă cu cinci note.

2. Ce face `abs(-12)`?
   a) Întoarce -12  b) **Întoarce 12**  c) Dă eroare
      > `abs()` întoarce valoarea absolută a numărului, deci `abs(-12)` elimină semnul minus și dă 12, la fel cum `abs(-7)` dă 7 în exemplul din lecție.

3. Ce trebuie să imporți ca să folosești `math.sqrt()`?
   a) Nimic, e implicit disponibilă  b) **Modulul `math`, cu `import math`**  c) Modulul `numbers`
      > Pentru a folosi `math.sqrt()` trebuie mai întâi să imporți modulul `math` cu `import math`, spre deosebire de funcții ca `print` sau `len`, disponibile fără import.

4. Care e cea mai rapidă cale de a calcula media unei liste de numere, folosind funcții predefinite?
   a) O buclă care adună manual  b) **`sum(lista) / len(lista)`**  c) `max(lista) - min(lista)`
      > Cea mai rapidă cale de a calcula media, folosind funcții predefinite, este `sum(lista) / len(lista)` — adunarea directă a valorilor împărțită la numărul lor, fără să scrii tu o buclă care adună manual.

---


:::verifica-cod
Scrie o funcție `salut(nume)` care afișează un salut personalizat. Demo: `salut('Ana')` -> `Salut, Ana!`
template: def salut(nume):
    # completeaza
    pass

salut('Ana')
output: Salut, Ana!
:::

# Modulul 1.7 — Prelucrarea cifrelor unui număr

### 🔄 1.7.1 Recapitulare

Ai folosit funcții predefinite pentru calcule și colecții. Acum lucrăm cu ceva mai specific: cifrele individuale ale unui număr. Cum ai extrage, tu, ultima cifră a numărului prezent, doar folosind operații matematice (fără liste)?

### 💡 1.7.2 Concept nou și exemplu

Doi operatori sunt cheia pentru a lucra cu cifrele unui număr:

- `%` (**modulo**) — restul împărțirii; `n % 10` dă **ultima cifră** a lui `n`.
- `//` (**împărțire întreagă**) — `n // 10` **elimină** ultima cifră a lui `n`.

```python
n = 47

ultima_cifra = n % 10        # 47 % 10 -> 7
n_fara_ultima = n // 10      # 47 // 10 -> 4

print("Ultima cifră:", ultima_cifra)
print("Numărul fără ultima cifră:", n_fara_ultima)
```

Combinând cele două operații într-o buclă `while`, poți parcurge **toate** cifrele unui număr, una câte una:

:::exemplu
## Cum extrageai cifrele „de mână"
Pentru 4739: `4739 % 10 = 9` (ultima), apoi `4739 // 10 = 473` (fără ultima). Apoi `473 % 10 = 3`, `473 // 10 = 47`... și tot așa până rămâne 0. Bucla face exact asta, automat.
:::

```python
n = 4739
suma_cifrelor = 0

while n > 0:
    cifra = n % 10          # extragem ultima cifră
    suma_cifrelor += cifra  # o adăugăm la sumă
    n = n // 10             # eliminăm ultima cifră

print("Suma cifrelor este:", suma_cifrelor)
```

### 🔮 1.7.3 Citește și prezice

```python
n = 128
numar_inversat = 0

while n > 0:
    cifra = n % 10
    numar_inversat = numar_inversat * 10 + cifra
    n = n // 10

print(numar_inversat)
```
Ce număr crezi că se afișează? (Indiciu: fiecare cifră extrasă e „mutată" la finalul noului număr.)

### 🤝 1.7.4 Exerciții ghidate

**Exercițiul 1.** Completează programul care numără câte cifre are un număr:
```python
n = 25873
numar_cifre = 0

while n > 0:
    numar_cifre = numar_cifre + ___  # completează
    n = n ___ 10  # completează operatorul

print("Numărul are", numar_cifre, "cifre")
```

**Exercițiul 2.** Explică, pas cu pas, ce se întâmplă cu variabila `n` la fiecare iterație a buclei de mai sus, pentru `n = 137`.

### 🎯 1.7.5 Exerciții independente

**Exercițiul 1.** Scrie un program care determină cea mai mare cifră dintr-un număr dat (de exemplu, pentru 4839, răspunsul e 9).

**Exercițiul 2.** Scrie un program care verifică dacă un număr este palindrom (se citește la fel din ambele direcții, de exemplu 1221), folosind tehnica numărului inversat din secțiunea „Citește și prezice".

### ✅ 1.7.6 Verifică-ți înțelegerea

1. Ce operator obții ultima cifră a unui număr întreg?
   a) `//`  b) **`%`**  c) `*`
      > Operatorul `%` (modulo) dă restul împărțirii la 10, iar restul împărțirii unui număr la 10 este exact ultima lui cifră, ca în exemplul `47 % 10` care dă 7.

2. Ce face operatorul `//` aplicat unui număr și lui 10?
   a) Dă ultima cifră  b) **Elimină ultima cifră**  c) Dublează numărul
      > Împărțirea întreagă `//` la 10 elimină ultima cifră a numărului, păstrând restul cifrelor — de exemplu `47 // 10` dă 4, adică numărul fără ultima cifră.

3. Care e condiția potrivită într-o buclă `while` care parcurge toate cifrele unui număr pozitiv `n`?
   a) `while n == 0`  b) **`while n > 0`**  c) `while n < 10`
      > Bucla trebuie să continue cât timp mai există cifre de extras, adică atâta timp cât `n` e strict pozitiv, deci `while n > 0` este condiția potrivită pentru un număr pozitiv `n`.

4. La fiecare pas al buclei `n = n // 10`, ce se întâmplă cu numărul de cifre rămase?
   a) Crește  b) **Scade cu una**  c) Rămâne la fel
      > La fiecare pas, `n = n // 10` elimină ultima cifră a numărului curent, deci numărul de cifre rămase scade cu una la fiecare iterație, până când `n` ajunge 0.

---


:::verifica-cod
Scrie o funcție `salut(nume)` care afișează un salut personalizat. Demo: `salut('Ana')` -> `Salut, Ana!`
template: def salut(nume):
    # completeaza
    pass

salut('Ana')
output: Salut, Ana!
:::

# Modulul 1.8 — Divizori, multipli, algoritmul lui Euclid

### 🔄 1.8.1 Recapitulare

Ai învățat să extragi cifrele unui număr cu `%` și `//`. Aceiași doi operatori sunt cheia și pentru acest modul — dar de data asta îi folosim pentru a răspunde la întrebarea: „se împarte exact un număr la altul?"

### 💡 1.8.2 Concept nou și exemplu

Un număr `d` este **divizor** al lui `n` dacă `n % d == 0` (împărțirea nu lasă rest). Dacă `d` este divizor al lui `n`, atunci `n` este **multiplu** al lui `d`.

```python
n = 36

print(36 % 4 == 0)   # True -> 4 este divizor al lui 36
print(36 % 5 == 0)   # False -> 5 nu este divizor al lui 36
```

Putem afla **toți divizorii** unui număr, parcurgând valorile posibile:

```python
n = 36
divizori = []

for d in range(1, n + 1):
    if n % d == 0:
        divizori.append(d)

print(divizori)   # [1, 2, 3, 4, 6, 9, 12, 18, 36]
```

**Cel mai mare divizor comun (cmmdc)** a două numere se poate calcula eficient cu **algoritmul lui Euclid**, în două variante clasice:

```python
# Varianta 1: prin scăderi repetate
def cmmdc_scaderi(a, b):
    while a != b:
        if a > b:
            a = a - b
        else:
            b = b - a
    return a

print(cmmdc_scaderi(48, 18))  # 6
```

```python
# Varianta 2: prin împărțiri repetate (mult mai rapidă)
def cmmdc_impartiri(a, b):
    while b != 0:
        a, b = b, a % b
    return a

print(cmmdc_impartiri(48, 18))  # 6
```

Varianta cu împărțiri e cea folosită în practică — vezi legătura cu modulul despre eficiența algoritmilor (1.3): face mult mai puțini pași decât varianta cu scăderi, mai ales pentru numere mari.


:::tip
## Sfaturi & Bune Practici Didactice
:::atentie
Asigură-te că buclele while au o condiție de oprire clară care se modifică la fiecare pas, altfel algoritmul va intra într-o buclă infinită!
:::
:::

### 🔮 1.8.3 Citește și prezice

```python
def cmmdc(a, b):
    while b != 0:
        a, b = b, a % b
    return a

rezultat = cmmdc(100, 75)
print(rezultat)
```
Ce număr crezi că se afișează? (Indiciu: e cel mai mare număr care împarte exact atât 100, cât și 75.)

### 🤝 1.8.4 Exerciții ghidate

**Exercițiul 1.** Completează programul care numără câți divizori are un număr:
```python
n = 28
numar_divizori = 0

for d in range(1, n + 1):
    if n % ___ == 0:  # completează
        numar_divizori += 1

print(numar_divizori)
```

**Exercițiul 2.** Folosind funcția `cmmdc_impartiri` de mai sus, calculează cel mai mic multiplu comun (cmmmc) a două numere, știind formula: `cmmmc(a, b) = a * b / cmmdc(a, b)`.

### 🎯 1.8.5 Exerciții independente

**Exercițiul 1.** Scrie un program care verifică dacă un număr este **perfect** (suma divizorilor săi, exceptând numărul însuși, este egală cu numărul — de exemplu 6 = 1 + 2 + 3).

**Exercițiul 2.** Scrie o funcție `sunt_prietene(a, b)` care verifică dacă două numere sunt „prietene", adică au același cmmdc cu un al treilea număr dat de tine (exercițiu de aplicare liberă a funcției `cmmdc_impartiri`).

### ✅ 1.8.6 Verifică-ți înțelegerea

1. Ce condiție verifică dacă `d` este divizor al lui `n`?
   a) `n // d == 0`  b) **`n % d == 0`**  c) `d % n == 0`
      > Un număr `d` este divizor al lui `n` exact atunci când împărțirea nu lasă rest, adică `n % d == 0`, conform definiției date direct în lecție.

2. Dacă 4 este divizor al lui 20, atunci putem spune că:
   a) 4 este multiplu al lui 20  b) **20 este multiplu al lui 4**  c) 20 este divizor al lui 4
      > Dacă `d` este divizor al lui `n`, atunci `n` este multiplu al lui `d` — deci din „4 este divizor al lui 20” rezultă că 20 este multiplu al lui 4.

3. Care variantă a algoritmului lui Euclid este mai eficientă pentru numere mari?
   a) **Prin împărțiri repetate**  b) Prin scăderi repetate  c) Sunt identice ca viteză
      > Varianta prin împărțiri repetate e mult mai rapidă pentru numere mari, pentru că la fiecare pas reduce numerele prin restul împărțirii, în loc să le scadă unul din altul de multe ori, ca varianta prin scăderi.

4. În algoritmul lui Euclid prin împărțiri, când se oprește bucla `while b != 0`?
   a) Când `a` devine 0  b) **Când `b` devine 0**  c) Când `a` și `b` sunt egale
      > Bucla `while b != 0` se oprește când `b` devine 0, moment în care valoarea rămasă în `a` este chiar cel mai mare divizor comun, returnat de funcție.


:::verifica-cod
Scrie o funcție `salut(nume)` care afișează un salut personalizat. Demo: `salut('Ana')` -> `Salut, Ana!`
template: def salut(nume):
    # completeaza
    pass

salut('Ana')
output: Salut, Ana!
:::
