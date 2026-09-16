# Conținut lecții — Clasa a VII-a (gimnaziu), Modulele VII.1–VII.3

Respectă exact structura de pe `academiapython.ro/curriculum/VII` — 6 sublecții per modul, aceleași etichete/iconuri ca la liceu. Continuă firul de la clasa a VI-a (mediul grafic-interactiv, cel mai adesea Scratch) și pregătește tranziția la clasa a IX-a.

---

# Modulul VII.1 — Primii pași în Python

### 🔄 VII.1.1 Recapitulare

Ai construit deja algoritmi cu blocuri, în Scratch — ai pus blocuri unul sub altul, ai folosit variabile-cutie sub formă de bloc, ai afișat mesaje pe scenă. Tot ce ai învățat acolo rămâne valabil. Singurul lucru care se schimbă acum e „unealta”: în loc să tragi blocuri cu mouse-ul, scrii aceleași idei ca text, într-un limbaj de programare real — **Python**. Gândește-te un minut: ce bloc din Scratch foloseai ca să afișezi un mesaj pe scenă? Exact acela va deveni azi o singură linie de cod.

### 💡 VII.1.2 Concept nou și exemplu

Un program Python e o listă de instrucțiuni pe care calculatorul le execută în ordine, de sus în jos — exact ca o secvență de blocuri în Scratch, puse unul sub altul. Recomandăm mediul **Thonny** (gratuit, interfață simplă, potrivit pentru gimnaziu).

```python
print("Salut, lume!")

nume = "Ana"
varsta = 13
print("Mă numesc", nume, "și am", varsta, "ani")
```

:::exemplu
## Ce face fiecare linie
`print("Salut, lume!")` afișează exact textul dintre ghilimele. Liniile `nume = "Ana"` și `varsta = 13` creează două variabile. Ultima linie afișează mai multe valori deodată, despărțite prin virgulă.
:::

O **variabilă** e o „cutie” cu un nume, în care ținem o valoare — exact ca variabila din Scratch, doar că aici o creezi scriind numele, semnul `=`, apoi valoarea (o **atribuire**). În Python nu trebuie anunțat dinainte ce tip de date va ține o variabilă — tipul se stabilește automat, la prima atribuire: `int` (numere întregi), `float` (numere cu virgulă), `str` (text, între ghilimele), `bool` (adevărat/fals).

Pentru a citi o valoare de la tastatură folosim `input()`, care întoarce întotdeauna text — dacă vrem un număr, trebuie convertit explicit:

```python
varsta = int(input("Câți ani ai? "))
print("Peste 5 ani vei avea", varsta + 5, "ani")
```

:::atentie
## `"7" + "3"` nu e 10
Dacă uiți să convertești rezultatul lui `input()` cu `int()` sau `float()`, Python tratează valoarea ca text — iar `+` între două texte le lipește unul de altul, nu le adună. Așa că `"7" + "3"` devine `"73"`, nu `10`. De asta scriem mereu `int(input(...))` când vrem să calculăm cu un număr citit.
:::

### 🔮 VII.1.3 Citește și prezice

Uită-te la codul de mai jos, **fără să-l rulezi**, și scrie pe hârtie ce crezi că se afișează:

```python
nume = "Byte"
scor = 7
scor = scor + 1

print(nume, "are scorul", scor)
```

Ai scris predicția? Verific-o singur, mental: ce valoare are `scor` chiar înainte de ultima linie? Vei putea rula cod direct în platformă în curând.

### 🤝 VII.1.4 Exerciții ghidate

**Exercițiul 1.** Completează programul căruia îi lipsesc ghilimelele și o variabilă, ca să afișeze corect numele și clasa unui elev:

```python
nume = Maria      # lipsesc ghilimelele
clasa = "a VII-a"
print("Elevul", ___, "este în", clasa)  # completează aici
```

**Exercițiul 2.** Scrie un program care citește vârsta elevului de la tastatură (cu `int(input(...))`) și afișează câți ani mai are până la 18 ani.

### 🎯 VII.1.5 Exerciții independente

**Exercițiul 1.** Scrie un „cartonaș de joc” care citește trei caracteristici ale unui personaj (nume, putere, viteză) și le afișează într-un format clar, pe linii separate.

**Exercițiul 2.** Scrie un program care citește prețul unui produs și cantitatea cumpărată, apoi afișează prețul total.

### ✅ VII.1.6 Verifică-ți înțelegerea

1. Ce se afișează la `print(7 + 3)`?
   a) `7 + 3`  b) **`10`**  c) Eroare
      > `7` și `3` sunt numere, deci `+` le adună matematic — rezultatul e `10`.

2. Ce se afișează la `print("7" + "3")`?
   a) `10`  b) **`73`**  c) Eroare
      > Când ambele valori sunt text (`str`), `+` le lipește una de alta, nu le adună — rezultă textul `"73"`.

3. Ce întoarce întotdeauna funcția `input()`, indiferent ce scrie utilizatorul?
   a) Un număr întreg  b) **Text (`str`)**  c) O listă
      > `input()` citește mereu ce se tastează ca text — dacă vrei să calculezi cu rezultatul, trebuie să-l convertești explicit cu `int()` sau `float()`.

4. Ce e o variabilă?
   a) Un mesaj de eroare  b) O comandă care oprește programul  c) **Un nume care ține minte o valoare**
      > O variabilă e ca o cutie etichetată: are un nume, și prin atribuire (`=`) punem o valoare în ea, pe care o putem folosi mai departe în program.

:::verifica-cod
Scrie un mic program care citește numele unui elev de la tastatură și afișează „Bine ai venit, <nume>!”. Demo: se introduce „Ana” -> se afișează „Bine ai venit, Ana!”.
template: nume = input("Cum te cheamă? ")
mesaj = ___

print(mesaj)
output: Bine ai venit, Ana!
:::

---

# Modulul VII.2 — De la Scratch la Python: secvențial și alternativ

### 🔄 VII.2.1 Recapitulare

În modulul trecut ai scris primele programe Python: variabile, `print()` și `input()`, toate executate în ordine, de sus în jos — o **structură secvențială**, ca un lanț de blocuri Scratch puse unul sub altul. Azi înveți cum ia un program o **decizie**.

### 💡 VII.2.2 Concept nou și exemplu

Structura **alternativă** ia o decizie: dacă o condiție e adevărată, se execută o ramură de cod, altfel alta — exact ca blocul „if... then... else” din Scratch.

```python
nota = float(input("Introdu nota: "))

if nota >= 9:
    print("Foarte bine!")
elif nota >= 7:
    print("Bine.")
else:
    print("Mai exersează.")
```

:::exemplu
## Cum „citește” Python acest cod
Python verifică prima condiție (`nota >= 9`). Dacă e adevărată, execută doar acea ramură și sare peste restul. Dacă e falsă, trece la `elif` și verifică din nou. Dacă niciuna nu e adevărată, execută `else`. Doar o singură ramură se execută, niciodată mai multe.
:::

Condițiile folosesc **operatori relaționali** (`==`, `!=`, `<`, `>`, `<=`, `>=`) și, atunci când e nevoie de mai multe condiții deodată, **operatori logici** (`and`, `or`, `not`).

:::atentie
## `=` nu e `==`
`=` atribuie o valoare unei variabile (`nota = 8`). `==` compară două valori și întoarce `Adevărat`/`Fals` (`nota == 8`). Dacă scrii din greșeală `if nota = 8:` în loc de `if nota == 8:`, Python nu te lasă să rulezi programul — e o eroare de sintaxă, nu doar o greșeală de logică.
:::

Nu uita nici cele două puncte (`:`) după `if`/`elif`/`else`, și indentarea (spațiile de la începutul liniei) — Python „citește” spațiile ca să știe ce cod aparține fiecărei ramuri.

### 🔮 VII.2.3 Citește și prezice

Uită-te la codul de mai jos, **fără să-l rulezi**, și scrie ce crezi că se afișează pentru `numar = 4`:

```python
numar = 4

if numar % 2 == 0:
    print("Par")
else:
    print("Impar")
```

Verifică-ți predicția mental: ce rest dă împărțirea lui 4 la 2?

### 🤝 VII.2.4 Exerciții ghidate

**Exercițiul 1.** Completează codul lacunar care clasifică o notă în „promovat”/„nepromovat”:

```python
nota = float(input("Introdu nota: "))

if nota >= ___:
    print("Promovat")
else:
    print(___)
```

**Exercițiul 2.** Scrie un program care citește un număr și afișează dacă e pozitiv, negativ sau zero (foloseste `if`/`elif`/`else`).

### 🎯 VII.2.5 Exerciții independente

**Exercițiul 1.** Scrie un program care citește un număr și afișează dacă e par sau impar.

**Exercițiul 2.** Scrie un „calculator de bacșiș” cu mai multe praguri (de exemplu, reducere diferită în funcție de suma totală a notei de plată), folosind `if`/`elif`/`else` înlănțuite.

### ✅ VII.2.6 Verifică-ți înțelegerea

1. Câte ramuri dintr-un `if`/`elif`/`else` se execută la o singură rulare?
   a) **Doar una**  b) Toate  c) Niciuna
      > Python verifică condițiile în ordine și execută prima ramură a cărei condiție e adevărată, apoi sare peste tot restul — nu se execută niciodată mai multe ramuri deodată.

2. Ce semn folosim ca să *comparăm* dacă două valori sunt egale?
   a) `=`  b) **`==`**  c) `!=`
      > Un singur `=` atribuie o valoare unei variabile; `==` compară două valori și întoarce `Adevărat` sau `Fals`.

3. Ce se întâmplă dacă uiți cele două puncte (`:`) după `if`?
   a) Programul rulează normal  b) **Python dă eroare de sintaxă**  c) Se ignoră condiția
      > Python cere obligatoriu `:` la finalul liniei cu `if`/`elif`/`else` — fără el, programul nu poate rula deloc.

4. Ce operator logic folosim ca să cerem ca *ambele* condiții să fie adevărate deodată?
   a) `or`  b) **`and`**  c) `not`
      > `and` întoarce `Adevărat` doar dacă amândouă condițiile din stânga și din dreapta lui sunt adevărate; `or` e suficient ca una singură să fie adevărată.

:::verifica-cod
Scrie un program care citește vârsta unei persoane și afișează „Minor” dacă are sub 18 ani, altfel „Major”. Demo: vârsta 15 -> „Minor”.
template: varsta = int(input("Câți ani ai? "))
mesaj = ___

print(mesaj)
output: Minor
:::

---

# Modulul VII.3 — Structura repetitivă și combinarea celor trei structuri

### 🔄 VII.3.1 Recapitulare

Ai văzut deja structura secvențială (pași în ordine) și structura alternativă (o decizie, cu `if`/`elif`/`else`). Azi cunoști a treia structură fundamentală — cea care **repetă** un grup de instrucțiuni — și înveți cum se combină toate trei, exact cum cere programa pentru clasa a VII-a.

### 💡 VII.3.2 Concept nou și exemplu

Structura **repetitivă cu contor** (echivalentul blocului Scratch „repeat 10”) se scrie în Python cu `for` și `range()`:

```python
for i in range(1, 11):
    print(i, "x 5 =", i * 5)
```

:::exemplu
## Ce face `range(1, 11)`
Generează numerele de la 1 până la 10 inclusiv — 11 nu e inclus. La fiecare pas al buclei, `i` ia pe rând valoarea 1, apoi 2, ..., apoi 10, iar linia indentată de sub `for` se execută o dată pentru fiecare valoare.
:::

Structura **repetitivă condiționată** (echivalentul „repeat until”/„forever if”) se scrie cu `while`, și se repetă cât timp o condiție rămâne adevărată:

```python
raspuns = ""
while raspuns != "python":
    raspuns = input("Care e parola? ")
print("Acces permis!")
```

Cele trei structuri se **combină**: în interiorul unei bucle putem avea o decizie (`if`), iar în interiorul unei decizii, o altă buclă — exact cerința programei.

```python
for i in range(1, 11):
    if i % 2 == 0:
        print(i, "este par")
```

:::atentie
## `range(1, 10)` nu ajunge la 10
Limita de sus dintr-un `range()` nu e inclusă niciodată — `range(1, 10)` generează 1, 2, ..., 9, dar nu și 10. Dacă vrei să incluzi și 10, scrie `range(1, 11)`. E o greșeală frecventă, numită „off-by-one” (greșeală cu o unitate).
:::

### 🔮 VII.3.3 Citește și prezice

Uită-te la codul de mai jos, **fără să-l rulezi**, și scrie câte linii se afișează:

```python
for i in range(1, 6):
    if i % 2 == 0:
        print(i)
```

Verifică-ți predicția mental: care numere din 1 până în 5 sunt pare?

### 🤝 VII.3.4 Exerciții ghidate

**Exercițiul 1.** Completează bucla `for` care afișează numerele de la 1 la 10:

```python
for i in range(1, ___):
    print(i)
```

**Exercițiul 2.** Scrie un program cu `while` care cere un număr de la utilizator până când acesta introduce 0.

### 🎯 VII.3.5 Exerciții independente

**Exercițiul 1.** Scrie un program care citește două numere `a` și `b` și afișează toate numerele pare din intervalul `[a, b]`.

**Exercițiul 2.** Varianta simplificată a jocului „FizzBuzz”: pentru numerele de la 1 la 30, afișează „Bâzz” dacă numărul e multiplu de 5, „Fizz” dacă e multiplu de 3, și numărul însuși altfel.

### ✅ VII.3.6 Verifică-ți înțelegerea

1. Câte numere generează `range(1, 5)`?
   a) 5  b) **4**  c) 6
      > `range(1, 5)` generează 1, 2, 3, 4 — limita de sus (5) nu e niciodată inclusă, deci sunt exact 4 numere.

2. Care structură repetitivă alegem când știm dinainte de câte ori se repetă ceva?
   a) **`for`**  b) `while`  c) `if`
      > `for` cu `range()` e potrivit când numărul de repetări e cunoscut dinainte (ex. „repetă de 10 ori”); `while` se folosește când nu știm dinainte câte repetări vor fi, ci depinde de o condiție.

3. Ce se întâmplă dacă, într-o buclă `while`, uiți să actualizezi variabila din condiție?
   a) Bucla se oprește automat după 10 pași  b) **Bucla rulează la infinit**  c) Python dă eroare imediat
      > Dacă variabila verificată în condiția `while` nu se schimbă niciodată, condiția rămâne mereu adevărată și bucla nu se mai oprește — o buclă infinită.

4. Poate un `if` să existe în interiorul unei bucle `for`?
   a) Nu, niciodată  b) **Da, structurile se pot combina**  c) Doar în interiorul unui `while`
      > Cele trei structuri fundamentale se pot combina liber — un `if` poate fi în interiorul unui `for`, care la rândul lui poate fi în interiorul unui alt `if`, exact cum cere programa pentru clasa a VII-a.

:::verifica-cod
Scrie un program care afișează, folosind o buclă `for`, toate numerele pare de la 2 la 10 inclusiv. Demo: se afișează 2, 4, 6, 8, 10, fiecare pe rândul lui.
template: for i in range(2, 11):
    if ___:
        print(i)
output: 2
4
6
8
10
:::
