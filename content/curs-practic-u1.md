# Conținut lecții — Curs practic de Python, Unitatea 1 (Modulele CP1.1–CP1.3)

Respectă exact structura de pe `academiapython.ro/curs-practic` — 6 sublecții per modul, aceleași etichete/iconuri ca la liceu/gimnaziu. Curs de sine stătător, separat de traseul școlar, pentru orice persoană care vrea să învețe Python de la zero.

---

# Modulul CP1.1 — Ce e programarea și de ce Python

### 🔄 CP1.1.1 Recapitulare

Nu ai nevoie de nicio experiență anterioară de programare pentru acest curs — pornim chiar de la început. Ai folosit vreodată o rețetă de gătit sau instrucțiunile de montaj ale unui mobilier? Amândouă sunt liste de pași preciși, executați în ordine. Un program face exact același lucru, doar că cel care „urmează pașii" e un calculator, nu o persoană.

### 💡 CP1.1.2 Concept nou și exemplu

Un **program** e o listă de instrucțiuni precise, pe care calculatorul le execută exact în ordinea în care sunt scrise — nu ghicește intenția, face exact ce scrie. Python e un limbaj **interpretat**: codul se execută linie cu linie, fără un pas separat de „compilare", ceea ce face ciclul scriere→testare foarte rapid — ideal pentru un prim limbaj.

```python
print("Salut, lume!")
```

:::exemplu
## Prima ta linie de cod
`print()` este o funcție predefinită care afișează pe ecran ce îi dai ca argument, între paranteze. Aceasta e, tradițional, prima linie de cod scrisă de orice programator la început de drum.
:::

Cel mai simplu mod de a începe: instalezi Python de pe python.org (bifează opțiunea „Add to PATH" la instalare, pe Windows) și folosești un editor precum **VS Code** sau, pentru un start și mai simplu, **Thonny**.

:::atentie
## `print(Salut)` nu e `print("Salut")`
Dacă uiți ghilimelele în jurul textului, Python nu îl mai tratează ca text (`str`), ci caută o variabilă numită `Salut` — care nu există încă, deci primești o eroare. Ghilimelele sunt ce spune Python „asta e text simplu, nu cod de căutat".
:::

### 🔮 CP1.1.3 Citește și prezice

Uită-te la codul de mai jos, **fără să-l rulezi**, și scrie pe hârtie ce crezi că se afișează:

```python
print("Python e distractiv!")
print("Python")
```

Ai scris predicția? Verific-o singur, mental: câte linii se afișează, și ce conține fiecare? Acest ciclu — **prezice → rulează → verifică** — e cel mai eficient mod de a învăța cod, mult mai eficient decât să citești pasiv teorie.

### 🤝 CP1.1.4 Exerciții ghidate

**Exercițiul 1.** Instalează Python și un editor, apoi rulează codul din secțiunea de teorie.

**Exercițiul 2.** Completează programul ca să afișeze numele tău pe o linie și un mesaj de bun venit pe alta:

```python
print("Numele meu este ___")
print("Bine ai venit la cursul de Python!")
```

### 🎯 CP1.1.5 Exerciții independente

**Exercițiul 1.** Scrie un program care afișează, pe linii separate, trei lucruri pe care vrei să le înveți să le automatizezi cu Python până la finalul cursului.

**Exercițiul 2 (mini-proiect de închidere).** Scrie un program de „prezentare" cu cel puțin 4 linii de `print()`, care să includă numele tău, o pasiune și un motiv pentru care vrei să înveți Python.

### ✅ CP1.1.6 Verifică-ți înțelegerea

1. Ce face funcția `print()`?
   a) Citește o valoare de la tastatură  b) **Afișează pe ecran ce îi dai ca argument**  c) Oprește programul
      > `print()` este funcția predefinită folosită pentru a afișa text sau valori pe ecran — exact argumentul primit între paranteze.

2. Ce înseamnă că Python e un limbaj „interpretat"?
   a) **Codul se execută linie cu linie, fără compilare separată**  b) Codul nu poate fi rulat niciodată  c) Codul se scrie doar în engleză
      > Fiind interpretat, Python execută fiecare linie pe măsură ce o citește, fără un pas separat de compilare a întregului program — ciclul scriere→testare devine foarte rapid.

3. Ce se întâmplă dacă scrii `print(Salut)` în loc de `print("Salut")`?
   a) Se afișează „Salut"  b) **Python caută o variabilă numită `Salut`, care nu există, și dă eroare**  c) Nu se întâmplă nimic
      > Fără ghilimele, Python tratează `Salut` ca pe numele unei variabile, nu ca text — iar cum nicio variabilă cu acel nume nu a fost creată, apare o eroare.

4. Care e cel mai eficient mod de a învăța un fragment nou de cod, conform acestui modul?
   a) Doar citirea teoriei, fără să rulezi nimic  b) **Ciclul prezice → rulează → verifică**  c) Memorarea codului pe de rost
      > Anticiparea rezultatului înainte de rulare, urmată de verificare, ajută la construirea unui model mental corect al codului — mult mai eficient decât citirea pasivă.

:::verifica-cod
Scrie un program care afișează exact textul „Python e primul meu limbaj de programare!". Demo: rulat, afișează exact acel text.
template: mesaj = ___
print(mesaj)
output: Python e primul meu limbaj de programare!
:::

---

# Modulul CP1.2 — Variabile și tipuri de date

### 🔄 CP1.2.1 Recapitulare

În modulul trecut ai scris primele linii de cod cu `print()`, afișând direct un text fix. Azi înveți cum să **reții** o valoare, ca s-o refolosești mai departe în program — fără să o retastezi de fiecare dată.

### 💡 CP1.2.2 Concept nou și exemplu

O **variabilă** e un nume atașat unei valori aflate în memorie. Python stabilește tipul automat, la prima atribuire — nu trebuie declarat dinainte:

```python
nume = "Maria"        # str -- text
varsta = 29            # int -- numar intreg
inaltime = 1.68         # float -- numar cu virgula
este_student = False    # bool -- adevarat/fals
```

:::exemplu
## Cele 4 tipuri de bază
`str` ține text (între ghilimele), `int` numere întregi, `float` numere cu virgulă (zecimale), `bool` doar `True`/`False`. Funcția `type()` îți arată tipul curent al unei valori — foarte util când nu ești sigur de ce un calcul nu funcționează cum te aștepți.
:::

Funcția `input()` citește întotdeauna text (`str`), chiar dacă utilizatorul tastează un număr — de aceea, când ai nevoie de un număr, trebuie convertit explicit cu `int()` sau `float()`:

```python
varsta = int(input("Câți ani ai? "))
print("Peste 10 ani vei avea", varsta + 10, "ani")
```

:::atentie
## `input()` întoarce mereu text
`input("Vârsta: ") + 5` produce o eroare (nu poți aduna text cu un număr), nu rezultatul așteptat. Trebuie mai întâi convertit: `int(input("Vârsta: ")) + 5`. Aceasta e cea mai comună capcană pentru un începător.
:::

### 🔮 CP1.2.3 Citește și prezice

Uită-te la codul de mai jos, **fără să-l rulezi**, și scrie ce crezi că se afișează:

```python
a = "2"
b = "3"
print(a + b)
```

Ai scris predicția? Verific-o mental: `a` și `b` sunt text sau numere? Ce face `+` între două texte?

### 🤝 CP1.2.4 Exerciții ghidate

**Exercițiul 1.** Creează variabile pentru numele, vârsta și orașul tău, apoi completează linia care le afișează pe toate într-o propoziție:

```python
nume = "Ana"
varsta = 25
oras = "Cluj"
print("Mă numesc", ___, ", am", varsta, "ani și locuiesc în", oras)
```

**Exercițiul 2.** Scrie un program care citește două numere de la tastatură (cu `int(input(...))`) și afișează suma lor.

### 🎯 CP1.2.5 Exerciții independente

**Exercițiul 1.** Scrie un program care citește două numere de la tastatură și afișează suma, diferența și produsul lor.

**Exercițiul 2 (mini-proiect de închidere).** Un „calculator de IMC" — citește greutatea (kg) și înălțimea (m) și calculează indicele de masă corporală (`greutate / inaltime ** 2`).

### ✅ CP1.2.6 Verifică-ți înțelegerea

1. Ce tip de date întoarce întotdeauna funcția `input()`?
   a) `int`  b) **`str` (text)**  c) `bool`
      > `input()` citește mereu ce se tastează ca text — dacă vrei să calculezi cu rezultatul, trebuie să-l convertești explicit cu `int()` sau `float()`.

2. Ce se afișează la `print("2" + "3")`?
   a) `5`  b) **`23`**  c) Eroare
      > Ambele valori sunt text (`str`), iar `+` între texte le lipește unul de altul, nu le adună aritmetic — rezultă textul `"23"`.

3. Ce face funcția `type()`?
   a) Convertește o valoare la text  b) **Arată tipul curent al unei valori**  c) Șterge o variabilă
      > `type()` întoarce tipul de date al valorii date ca argument — util pentru a înțelege de ce un calcul nu se comportă cum te aștepți.

4. De ce trebuie să scrii `int(input(...))` când vrei un număr de la utilizator?
   a) Nu e nevoie, `input()` întoarce deja un număr  b) **Pentru că `input()` întoarce mereu text, iar `int()` îl convertește în număr întreg**  c) Ca să afișezi rezultatul mai frumos
      > `input()` întoarce întotdeauna `str`; pentru a folosi valoarea în calcule numerice, trebuie convertită explicit cu `int()` (sau `float()`, pentru zecimale).

:::verifica-cod
Scrie un program care creează variabilele `pret` (10) și `cantitate` (3), calculează totalul și îl afișează. Demo: pret 10, cantitate 3 -> total 30.
template: pret = 10
cantitate = 3
total = ___
print(total)
output: 30
:::

---

# Modulul CP1.3 — Operatori și expresii

### 🔄 CP1.3.1 Recapitulare

Ai învățat deja variabilele și cele 4 tipuri de bază de date. Azi combini valori între ele folosind **operatori** — instrumentele cu care faci calcule, comparații și decizii logice în Python.

### 💡 CP1.3.2 Concept nou și exemplu

**Operatori aritmetici**: `+`, `-`, `*`, `/` (împărțire reală, întotdeauna cu rezultat `float`), `//` (împărțire întreagă), `%` (rest), `**` (ridicare la putere).

```python
print(7 / 2)    # 3.5
print(7 // 2)   # 3
print(7 % 2)    # 1
print(2 ** 10)  # 1024
```

**Operatori relaționali** (compară două valori și întorc `True`/`False`): `==`, `!=`, `<`, `>`, `<=`, `>=`.

:::atentie
## `==` nu e `=`
`=` atribuie o valoare unei variabile (`nota = 8`). `==` compară egalitatea a două valori și întoarce `True`/`False` (`nota == 8`). Se aseamănă vizual, dar sunt lucruri complet diferite — confuzia lor e una dintre cele mai frecvente greșeli de început.
:::

**Operatori logici** (combină mai multe condiții): `and` (ambele trebuie să fie adevărate), `or` (cel puțin una), `not` (neagă).

```python
varsta = 20
are_permis = True
print(varsta >= 18 and are_permis)   # True
```

:::exemplu
## Ordinea de evaluare contează
`2 + 3 * 4` dă `14`, nu `20` — Python face întâi înmulțirea (`3 * 4 = 12`), apoi adunarea. Ca la matematica obișnuită: dacă vrei altă ordine, folosești paranteze: `(2 + 3) * 4` dă `20`.
:::

### 🔮 CP1.3.3 Citește și prezice

Uită-te la codul de mai jos, **fără să-l rulezi**, și scrie ce crezi că se afișează:

```python
print(10 % 3)
print(10 // 3)
```

Verifică-ți predicția mental: care e restul, și care e câtul întreg al împărțirii lui 10 la 3?

### 🤝 CP1.3.4 Exerciții ghidate

**Exercițiul 1.** Fără să rulezi codul, scrie pe hârtie ce crezi că afișează fiecare expresie, apoi verifică rulând-o: `10 % 3`, `2 ** 0.5`, `10 // 3`.

**Exercițiul 2.** Completează condiția care verifică dacă un număr e mai mare sau egal cu 18:

```python
varsta = 20
print(varsta ___ 18)
```

### 🎯 CP1.3.5 Exerciții independente

**Exercițiul 1.** Scrie un program care citește un an de la tastatură și afișează dacă e bisect (divizibil cu 4, dar dacă e divizibil cu 100 trebuie să fie și divizibil cu 400).

**Exercițiul 2 (mini-proiect de închidere).** Un „verificator de reduceri" — citește prețul unui produs și afișează `True` dacă prețul depășește 100 de lei (caz în care s-ar aplica o reducere de 20%), altfel `False`.

### ✅ CP1.3.6 Verifică-ți înțelegerea

1. Ce se afișează la `print(7 / 2)`?
   a) `3`  b) **`3.5`**  c) `4`
      > `/` face întotdeauna împărțire reală, cu rezultat `float` — chiar dacă împărțirea ar fi exactă, rezultatul rămâne zecimal.

2. Ce se afișează la `print(7 // 2)`?
   a) `3.5`  b) **`3`**  c) `1`
      > `//` este împărțirea întreagă — păstrează doar câtul întreg, tăind partea zecimală.

3. Ce se afișează la `print(2 + 3 * 4)`?
   a) `20`  b) **`14`**  c) `24`
      > Înmulțirea are prioritate mai mare decât adunarea — Python calculează întâi `3 * 4 = 12`, apoi adaugă `2`, rezultând `14`.

4. Ce diferență e între `=` și `==`?
   a) Nicio diferență, sunt interschimbabile  b) **`=` atribuie o valoare, `==` compară egalitatea**  c) `==` atribuie, `=` compară
      > `=` pune o valoare într-o variabilă (atribuire); `==` verifică dacă două valori sunt egale și întoarce `True`/`False` — o confuzie tipică de început, mai ales în condiții `if`.

:::verifica-cod
Scrie un program care calculează restul împărțirii lui 17 la 5 și îl afișează. Demo: rezultatul așteptat e 2.
template: rest = ___
print(rest)
output: 2
:::
