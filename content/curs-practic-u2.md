# Curs practic de Python — Unitatea 2: Structuri de control

Modulele CP2.1–CP2.3. Același șablon de 6 pași ca Unitatea 1.

---

# Modulul CP2.1 — Decizii: if / elif / else

### 🔄 CP2.1.1 Recapitulare

În modulul anterior ai folosit operatori relaționali și logici: `varsta >= 18` sau `pret > 100 and in_stoc` dau `True` sau `False`. Până acum doar afișai aceste valori. Azi programul tău începe să **ia decizii** pe baza lor: face un lucru dacă o condiție e adevărată și altceva dacă nu e.

### 💡 CP2.1.2 Concept nou și exemplu

Instrucțiunea `if` execută un bloc de cod doar dacă o condiție e adevărată. Blocul se recunoaște după **retragere** (indentare): liniile care aparțin de `if` încep cu 4 spații.

```python
pret = 120

if pret > 100:
    print("Se aplică reducerea de 10%.")
    pret = pret * 0.9

print("Preț de plată:", pret)
```

Programul afișează `Se aplică reducerea de 10%.` și apoi `Preț de plată: 108.0`. Dacă schimbi `pret = 80`, prima linie nu se mai afișează, iar prețul rămâne 80.

Cu `else` alegi între două variante, iar cu `elif` („else if”) adaugi oricâte variante intermediare. Python verifică condițiile **de sus în jos** și execută doar prima ramură adevărată.

```python
consum_kwh = 230

if consum_kwh <= 100:
    categorie = "consum redus"
elif consum_kwh <= 300:
    categorie = "consum mediu"
else:
    categorie = "consum ridicat"

print("Categoria ta:", categorie)
```

Programul afișează `Categoria ta: consum mediu`.

:::atentie
## Două puncte și retragere
Linia cu `if`, `elif` sau `else` se termină mereu cu `:`. Liniile din bloc sunt retrase cu același număr de spații (de obicei 4). Dacă uiți `:`, primești `SyntaxError`; dacă retragerea nu e consecventă, primești `IndentationError`.
:::

:::exemplu
## Ordinea condițiilor contează
Dacă la exemplul cu consumul ai pune întâi `elif consum_kwh <= 300`, un consum de 50 kWh ar intra și el în „consum mediu”, pentru că Python se oprește la prima condiție adevărată. Pune întâi condiția cea mai strictă.
:::

### 🔮 CP2.1.3 Citește și prezice

Uită-te la codul de mai jos, **fără să-l rulezi**, și scrie ce crezi că afișează:

```python
ora = 14

if ora < 12:
    print("Bună dimineața")
elif ora < 18:
    print("Bună ziua")
else:
    print("Bună seara")
```

Ai notat predicția? Gândește-te: care este prima condiție adevărată pentru ora 14?

### 🤝 CP2.1.4 Exerciții ghidate

**Exercițiul 1.** Completează condiția astfel încât programul să afișeze „Livrare gratuită” pentru comenzile de cel puțin 150 de lei.

```python
total = 175
if total ___ 150:
    print("Livrare gratuită")
else:
    print("Livrare: 15 lei")
```

**Exercițiul 2.** Scrie un program care afișează „par” dacă numărul 42 este par și „impar” altfel.

### 🎯 CP2.1.5 Exerciții independente

**Exercițiul 1.** O parolă e acceptată doar dacă are cel puțin 8 caractere. Pentru parola `"python2026"`, afișează „Parolă acceptată” sau „Parolă prea scurtă”.

**Exercițiul 2 (mini-proiect de închidere).** Un calculator de bacșiș: pentru o notă de 240 de lei și o evaluare a serviciului de la 1 la 5 (aici 4), bacșișul este 5% pentru evaluări 1–2, 10% pentru 3–4 și 15% pentru 5. Afișează bacșișul.

### ✅ CP2.1.6 Verifică-ți înțelegerea

1. Ce caracter încheie linia unei instrucțiuni `if`?
   a) **`:`**  b) `;`  c) `.`
      > Linia cu `if`, `elif` sau `else` se termină cu două puncte; fără ele, Python raportează o eroare de sintaxă.

2. Câte ramuri dintr-un șir `if` / `elif` / `else` se execută cel mult?
   a) Toate cele adevărate  b) Niciuna  c) **Una singură**
      > Python verifică condițiile în ordine și execută doar prima ramură adevărată; dacă niciuna nu e adevărată, se execută `else`.

3. Cum știe Python ce linii aparțin de un `if`?
   a) După acolade  b) **După retragerea (indentarea) liniilor**  c) După cuvântul `end`
      > În Python, blocul unei instrucțiuni este marcat prin retragere, de obicei 4 spații; nu există acolade sau `end`.

4. Ce afișează codul `x = 5` urmat de `if x > 10: print("mare")` pe un rând și `print("gata")` pe următorul, fără retragere?
   a) `mare` și `gata`  b) nimic  c) **doar `gata`**
      > Condiția `5 > 10` e falsă, deci blocul lui `if` e sărit; `print("gata")` nu ține de `if`, așa că se execută oricum.

:::verifica-cod
Completează condiția: pentru o temperatură de 30 de grade, programul trebuie să afișeze „Cald”, iar sub 25 de grade „Plăcut”.
template: temperatura = 30
if temperatura ___ 25:
    print("Cald")
else:
    print("Plăcut")
output: Cald
:::

---

# Modulul CP2.2 — Bucla for

### 🔄 CP2.2.1 Recapitulare

Cu `if` programul tău alege ce face. Multe sarcini reale cer însă **repetare**: să aplici aceeași regulă pentru fiecare produs dintr-un coș, pentru fiecare lună dintr-un an sau pentru fiecare rând dintr-un fișier. Bucla `for` face exact asta, fără să copiezi aceleași linii de mai multe ori.

### 💡 CP2.2.2 Concept nou și exemplu

`for` parcurge pe rând elementele unei secvențe. Cea mai simplă secvență de numere o produce `range()`.

```python
for luna in range(1, 4):
    print("Luna", luna)
```

Rezultatul:

```text
Luna 1
Luna 2
Luna 3
```

`range(1, 4)` produce 1, 2, 3 — **valoarea de oprire nu e inclusă**. Alte forme: `range(5)` dă 0…4, iar `range(0, 20, 5)` dă 0, 5, 10, 15.

Un tipar foarte des folosit este **acumulatorul**: o variabilă pornește de la 0 și crește la fiecare pas.

```python
economii = 0
for luna in range(1, 13):
    economii = economii + 250
print("Economii după un an:", economii)
```

Programul afișează `Economii după un an: 3000`.

`for` poate parcurge direct și o listă sau un text:

```python
for oras in ["Cluj", "Iași", "Brașov"]:
    print("Livrăm în", oras)
```

:::atentie
## Inițializează înainte de buclă
`economii = 0` trebuie scris **înainte** de `for`. Dacă îl muți în interiorul buclei, variabila revine la 0 la fiecare pas și rezultatul final va fi doar 250.
:::

:::exemplu
## Dobândă compusă, pas cu pas
Un depozit de 1000 de lei cu dobândă de 5% pe an: `suma = 1000`, apoi de 3 ori `suma = suma * 1.05`. După 3 ani, `round(suma, 2)` dă `1157.63`. Bucla face calculul pentru oricâți ani, schimbând un singur număr.
:::

### 🔮 CP2.2.3 Citește și prezice

Fără să rulezi codul, scrie ce crezi că afișează:

```python
total = 0
for i in range(1, 5):
    total = total + i
print(total)
```

Ce valori ia `i`? Adună-le pe hârtie.

### 🤝 CP2.2.4 Exerciții ghidate

**Exercițiul 1.** Completează `range` ca programul să afișeze numerele de la 1 la 5.

```python
for i in range(1, ___):
    print(i)
```

**Exercițiul 2.** Calculează suma prețurilor dintr-un coș: 12.5, 30 și 7.5 lei, folosind o buclă `for`.

### 🎯 CP2.2.5 Exerciții independente

**Exercițiul 1.** Afișează câte numere de la 1 la 100 se împart exact la 7.

**Exercițiul 2 (mini-proiect de închidere).** Un plan de economisire: pornești cu 500 de lei și adaugi 200 de lei în fiecare lună, timp de 12 luni. Afișează suma finală.

### ✅ CP2.2.6 Verifică-ți înțelegerea

1. Ce numere produce `range(2, 6)`?
   a) **2, 3, 4, 5**  b) 2, 3, 4, 5, 6  c) 3, 4, 5, 6
      > `range(start, stop)` începe de la `start` și se oprește înainte de `stop`, deci 6 nu e inclus.

2. Ce afișează `for x in range(3): print(x)`?
   a) 1, 2, 3  b) **0, 1, 2**  c) 0, 1, 2, 3
      > Cu un singur argument, `range` pornește de la 0 și se oprește înainte de valoarea dată.

3. Unde trebuie inițializată variabila care adună valorile într-o buclă?
   a) **Înainte de buclă**  b) În interiorul buclei  c) După buclă
      > Dacă o inițializezi în buclă, revine la valoarea de start la fiecare pas și pierzi sumele anterioare.

4. Ce poate parcurge o buclă `for`?
   a) Doar numere produse de `range`  b) Doar liste  c) **Orice secvență: `range`, liste, texte**
      > `for` parcurge element cu element orice secvență: numerele unui `range`, elementele unei liste sau caracterele unui text.

:::verifica-cod
Calculează suma numerelor de la 1 la 10 folosind o buclă for. Rezultatul așteptat este 55.
template: suma = 0
for i in range(1, ___):
    suma = suma + i
print(suma)
output: 55
:::

---

# Modulul CP2.3 — Bucla while, break și continue

### 🔄 CP2.3.1 Recapitulare

Bucla `for` e ideală când știi dinainte ce parcurgi: 12 luni, 3 produse, numerele de la 1 la 100. Uneori însă nu știi câți pași vor fi: „repetă până se termină stocul” sau „până când suma depășește un prag”. Pentru astfel de situații folosești `while`.

### 💡 CP2.3.2 Concept nou și exemplu

`while` repetă un bloc **cât timp** o condiție rămâne adevărată. Condiția se verifică înainte de fiecare repetare.

```python
suma = 1000
ani = 0

while suma < 2000:
    suma = suma * 1.07
    ani = ani + 1

print("Suma se dublează după", ani, "ani")
```

Programul afișează `Suma se dublează după 11 ani` (o creștere de 7% pe an). Nu știai dinainte câți ani vor fi — de aceea `while` e alegerea potrivită.

Două instrucțiuni controlează bucla din interior:

- `break` **oprește** bucla imediat;
- `continue` **sare** peste restul pasului curent și trece la următorul.

```python
for comanda in [120, 0, 75, -5, 300]:
    if comanda <= 0:
        continue
    if comanda > 250:
        print("Comandă prea mare, oprim verificarea.")
        break
    print("Comandă validă:", comanda)
```

Rezultatul:

```text
Comandă validă: 120
Comandă validă: 75
Comandă prea mare, oprim verificarea.
```

:::atentie
## Bucla care nu se oprește
Dacă în interiorul lui `while` nu modifici nimic din condiție, bucla rulează la nesfârșit. De exemplu, `while suma < 2000:` fără `suma = suma * 1.07`. În editorul cursului, execuția se oprește automat după câteva secunde, iar butonul „Oprește” o întrerupe imediat.
:::

:::exemplu
## Contorul de încercări
Un tipar util: `incercari = 0`, apoi `while incercari < 3:` și `incercari += 1` la fiecare pas. Așa limitezi, de exemplu, numărul de încercări pentru o parolă.
:::

### 🔮 CP2.3.3 Citește și prezice

Fără să rulezi codul, scrie ce crezi că afișează:

```python
n = 1
while n < 50:
    n = n * 3
print(n)
```

Urmărește pe hârtie valorile lui `n`: 1, apoi 3, apoi…

### 🤝 CP2.3.4 Exerciții ghidate

**Exercițiul 1.** Completează condiția ca bucla să afișeze numerele 1, 2, 3, 4, 5.

```python
i = 1
while i ___ 5:
    print(i)
    i = i + 1
```

**Exercițiul 2.** Un stoc de 20 de bucăți scade cu 6 bucăți la fiecare livrare. Folosind `while`, afișează câte livrări complete se pot face.

### 🎯 CP2.3.5 Exerciții independente

**Exercițiul 1.** Pentru lista de temperaturi `[18, 21, 24, 27, 31, 22]`, afișează prima temperatură mai mare de 25 de grade și oprește căutarea cu `break`.

**Exercițiul 2 (mini-proiect de închidere).** Un credit de 1000 de lei se rambursează cu 150 de lei pe lună. Afișează în câte luni se achită integral (ultima rată poate fi mai mică).

### ✅ CP2.3.6 Verifică-ți înțelegerea

1. Când se oprește o buclă `while`?
   a) După exact 10 pași  b) **Când condiția devine falsă**  c) Niciodată
      > `while` verifică condiția înainte de fiecare pas și se oprește când aceasta devine falsă (sau la un `break`).

2. Ce face `break`?
   a) Sare la pasul următor  b) Repornește bucla  c) **Oprește imediat bucla**
      > `break` iese imediat din buclă; programul continuă cu prima instrucțiune de după ea.

3. Ce face `continue`?
   a) **Sare peste restul pasului curent și trece la următorul**  b) Oprește programul  c) Repetă același pas
      > `continue` abandonează doar pasul curent; bucla merge mai departe cu următorul element sau cu următoarea verificare a condiției.

4. Care e cauza cea mai frecventă a unei bucle `while` infinite?
   a) Lipsa lui `break`  b) **Condiția nu se schimbă niciodată în interiorul buclei**  c) Folosirea lui `range`
      > Dacă nicio instrucțiune din buclă nu modifică valorile din condiție, condiția rămâne mereu adevărată și bucla nu se termină.

:::verifica-cod
Folosind while, numără câte dublări sunt necesare ca numărul 1 să ajungă cel puțin la 100. Rezultatul așteptat este 7.
template: numar = 1
pasi = 0
while numar ___ 100:
    numar = numar * 2
    pasi = pasi + 1
print(pasi)
output: 7
:::
