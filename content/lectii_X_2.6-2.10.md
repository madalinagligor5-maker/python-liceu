# Modulul 2.6 — Clasa str: metode de căutare, înlocuire, separare

### 🔄 2.6.1 Recapitulare

În modulul 2.5 ai văzut că șirurile sunt imutabile și cum se accesează. Acum metodele uzuale care returnează șiruri noi.

### 💡 2.6.2 Concept nou și exemplu

```python
text = "Informatica este utila"
cuvinte = text.split(" ")             # ['Informatica', 'este', 'utila']
nou = text.replace("utila", "distractiva")
poz = text.find("este")               # 13 (prima apariție)
print(cuvinte, nou, poz)
```

Operatori: `in` (apartenență subșir), `+` (concatenare), `*` (repetare), comparare lexicografică. Metode: `find()`, `index()`, `replace()`, `split()`, `join()`, `strip()`, `upper()`/`lower()`.

**Atenție:** `replace()`/`upper()` etc. returnează un șir nou — nu modifică originalul!


:::tip
## find() vs. index(): nu le confunda
`text.find("x")` returnează **-1** dacă subșirul lipsește, în timp ce `text.index("x")` aruncă `ValueError` în aceeași situație. Dacă vrei doar să testezi apartenența, folosește operatorul `in` (mai clar); dacă ai nevoie de poziție și ești sigur că subșirul există, `index()` e mai sigur pentru că nu ascunde o eroare de logică sub un -1 trecut cu vederea. Și nu uita: `replace()`, `split()`, `strip()`, `upper()`/`lower()` nu modifică șirul pe care le apelezi — dacă nu reții rezultatul într-o variabilă (`text = text.strip()`), efectul se pierde.
:::

### 🔮 2.6.3 Citește și prezice

```python
text = "abc-def-ghi"
print(text.split("-"))
```
Ce se afișează?

### 🤝 2.6.4 Exerciții ghidate

**Exercițiul 1.** Completează pentru a număra de câte ori apare "ana" într-un text:
```python
text = "ana are ana"
___  # metoda care numără aparițiile unui subșir
```

**Exercițiul 2.** Scrie codul care unește o listă de cuvinte într-un șir, separate prin virgulă.

### 🎯 2.6.5 Exerciții independente

**Exercițiul 1.** Numără cuvintele distincte dintr-un text folosind `split()` și o mulțime.

**Exercițiul 2.** Scrie o funcție care înlocuiește toate vocalele dintr-un șir cu `*`.

### ✅ 2.6.6 Verifică-ți înțelegerea

1. `split(" ")` pe "a b c" returnează:
   a) "abc"  b) **['a', 'b', 'c']**  c) ['a b c']
      > split(" ") taie textul la fiecare spațiu și întoarce o listă cu bucățile rezultate, deci "a b c" devine lista ['a', 'b', 'c'], nu un singur șir.

2. `replace()` modifică șirul original?
   a) Da  b) **Nu, returnează un șir nou**  c) Doar dacă e atribuit
      > replace(), ca toate metodele de șiruri, nu poate modifica șirul original pentru că șirurile sunt imutabile în Python — ea construiește și întoarce un șir nou, care trebuie reținut într-o variabilă ca să nu se piardă.

3. `text.find("x")` când "x" lipsește returnează:
   a) 0  b) **-1**  c) None
      > find() este gândită să nu arunce eroare când subșirul lipsește, așa că întoarce -1 ca semnal de "nu a fost găsit"; pentru o eroare explicită în acest caz s-ar folosi index().

4. `",".join(["a","b"])` produce:
   a) "ab"  b) **"a,b"**  c) "[a,b]"
      > join() lipește elementele listei folosind șirul din stânga ca separator între ele, deci ",".join(["a","b"]) pune o virgulă între "a" și "b", rezultând "a,b".


:::verifica-cod
Scrie o funcție `numara_aparitii(text, sub)` care returnează de câte ori apare `sub` în `text`. Demo: `numara_aparitii("ana are ana", "ana")` -> `2`
template: def numara_aparitii(text, sub):
    # completeaza
    pass

print(numara_aparitii("ana are ana", "ana"))
output: 2
:::

# Modulul 2.7 — Clasa str: indexare, slicing, concatenare, comparare

### 🔄 2.7.1 Recapitulare

Revizuim rapid operațiile de bază cu șiruri înainte de a trece la criptare.

### 💡 2.7.2 Concept nou și exemplu

```python
a = "abc"; b = "def"
print(a + b)          # abcdef (concatenare)
print(a * 2)          # abcabc (repetare)
print(a[0])           # a
print(a[0:2])         # ab (slicing)
print("abc" < "abd")  # True (comparare lexicografică)
print("a" in "racheta")  # True
```


:::tip
## Slicing nu aruncă niciodată IndexError
Dacă accesezi `a[10]` pe un șir cu 3 caractere, primești o eroare (`IndexError`). Dar `a[0:10]` pe același șir nu dă eroare — Python taie automat la lungimea disponibilă și returnează ce există, chiar și un șir gol dacă indicii sunt complet în afara intervalului. Reține și că indicii negativi numără de la coadă (`a[-1]` e ultimul caracter), iar comparațiile de tip `"abc" < "abd"` sunt lexicografice și sensibile la majuscule/minuscule — în ASCII literele mari sunt „mai mici" decât cele mici, deci `"Z" < "a"` este `True`.
:::

### 🔮 2.7.3 Citește și prezice

```python
s = "programare"
print(s[3:7])
```
Ce se afișează?

### 🤝 2.7.4 Exerciții ghidate

**Exercițiul 1.** Completează pentru a extrage literele de pe pozițiile pare:
```python
s = "abcdef"
___  # slicing cu pas 2
```

**Exercițiul 2.** Scrie codul care verifică dacă un șir începe cu "RO".

### 🎯 2.7.5 Exerciții independente

**Exercițiul 1.** Scrie o funcție care returnează șirul cu caracterele în ordine inversă (fără a folosi `reversed`).

**Exercițiul 2.** Compară două șiruri ignorând majusculele/minusculele.

### ✅ 2.7.6 Verifică-ți înțelegerea

1. `"a" * 3` produce:
   a) "a3"  b) **"aaa"**  c) Eroare
      > Operatorul * repetă șirul de atâtea ori cât indică numărul din dreapta, deci "a" * 3 lipește litera "a" de trei ori consecutiv, producând "aaa".

2. Slicing-ul `s[1:4]` este:
   a) Inclusiv la capăt  b) **Exclusiv la capăt**  c) Tot șirul
      > La slicing, capătul din dreapta indicelui (aici 4) nu este inclus în rezultat — s[1:4] ia doar pozițiile 1, 2 și 3, exact ca la liste.

3. `"abc" < "abd"` este:
   a) False  b) **True**  c) Eroare
      > Comparațiile între șiruri sunt lexicografice: se compară litera cu litera până la prima diferență, iar acolo 'c' < 'd', deci "abc" este mai mic decât "abd" și rezultatul e True.

4. `"x" in "examen"` este:
   a) **True**  b) False  c) None
      > Operatorul in verifică apartenența unui subșir în alt șir, iar litera "x" chiar apare în cuvântul "examen" (prima literă), deci expresia e True.


:::verifica-cod
Scrie o funcție `este_palindrom(s)` care returnează True dacă șirul `s` citit invers (cu slicing) este identic cu originalul. Demo: `este_palindrom("abcba")` -> `True`
template: def este_palindrom(s):
    # completeaza
    pass

print(este_palindrom("abcba"))
output: True
:::

# Modulul 2.8 — Criptare simplă: substituție și cifrul lui Cezar

### 🔄 2.8.1 Recapitulare

Criptarea protejează un mesaj transformându-l într-unul ilizibil fără cheie. Cifrul lui Cezar e cel mai simplu.

### 💡 2.8.2 Concept nou și exemplu

Cifrul lui **Cezar** deplasează fiecare literă cu un număr fix de poziții în alfabet.

```python
def cezar(text, deplasare):
    rez = ""
    for c in text:
        if c.isalpha():
            baza = ord('A') if c.isupper() else ord('a')
            rez += chr((ord(c) - baza + deplasare) % 26 + baza)
        else:
            rez += c
    return rez

print(cezar("ABC", 3))   # DEF
print(cezar("xyz", 1))   # yza
```

**Eroare frecventă:** omiterea `% 26` → literele trec de Z și produc caractere invalide.


:::tip
## De ce alegem `baza` în funcție de majusculă
Formula `chr((ord(c) - baza + deplasare) % 26 + baza)` funcționează doar dacă `baza` e chiar litera de start a alfabetului cu aceeași capitalizare ca `c` (`'A'` pentru majuscule, `'a'` pentru minuscule). Dacă folosești mereu `ord('a')`, majusculele se transformă greșit — de exemplu 'A' + 3 ar deveni un caracter din altă zonă ASCII, nu 'D'. Testează mereu cifrul cu text care conține și majuscule, și minuscule, și caractere non-alfabetice (spații, cifre, punctuație) — acestea trebuie să rămână neschimbate, exact cum se întâmplă în ramura `else` a buclei.
:::

### 🔮 2.8.3 Citește și prezice

```python
def cezar(text, deplasare):
    rez = ""
    for c in text:
        if c.isalpha():
            baza = ord('a')
            rez += chr((ord(c) - baza + deplasare) % 26 + baza)
        else:
            rez += c
    return rez

print(cezar("abc", 2))
```
Ce se afișează?

### 🤝 2.8.4 Exerciții ghidate

**Exercițiul 1.** Completează funcția de decriptare (deplasare negativă):
```python
def decriptare_cezar(text, deplasare):
    return ___  # refolosește cezar cu deplasare opusă
```

**Exercițiul 2.** Scrie o funcție care forțează toate cele 26 de deplasări (spargerea prin forță brută).

### 🎯 2.8.5 Exerciții independente

**Exercițiul 1.** Implementează cifrul cu substituție monoalfabetică (o cheie de tip dicționar literă→literă).

**Exercițiul 2.** Criptează doar spațiile și semnele de punctuație rămân neschimbate (ca la Cezar).

### ✅ 2.8.6 Verifică-ți înțelegerea

1. Cifrul lui Cezar cu deplasare 1 transformă "a" în:
   a) "a"  b) **"b"**  c) "z"
      > Cu deplasare 1, fiecare literă avansează cu o poziție în alfabet, iar 'a' este prima literă, deci ea devine următoarea literă din alfabet, 'b'.

2. Operatorul `% 26` servește la:
   a) A număra literele  b) **A menține rezultatul în alfabet (0-25)**  c) A șterge caractere
      > Fără % 26 o literă care trece de 'z' după deplasare ar produce un cod ASCII din afara alfabetului; restul împărțirii la 26 aduce rezultatul înapoi ciclic în intervalul 0-25, echivalent cu a "reveni" la 'a' după 'z'.

3. Decriptarea se face cu:
   a) **Deplasare negativă**  b) O altă literă  c) Fără cheie
      > Cifrul lui Cezar se inversează aplicând aceeași funcție cu deplasarea opusă (negativă), pentru că a deplasa o literă înainte cu n și apoi cu -n o readuce exact la poziția inițială.

4. Caracterele non-litere (spații, cifre):
   a) Se criptează și ele  b) **Rămân neschimbate**  c) Se șterg
      > Ramura else din funcția cezar() copiază neschimbat orice caracter care nu trece testul c.isalpha(), deci spațiile, cifrele și semnele de punctuație ies identice din criptare.


:::verifica-cod
Scrie o funcție `deplaseaza_litera(c, deplasare)` care deplasează ciclic o literă mică din alfabet cu `deplasare` poziții (folosește % 26). Demo: `deplaseaza_litera('a', 3)` -> `d`
template: def deplaseaza_litera(c, deplasare):
    # completeaza
    pass

print(deplaseaza_litera('a', 3))
output: d
:::

# Modulul 2.9 — Cifrul Vigenère

### 🔄 2.9.1 Recapitulare

Cezar e ușor de spart (doar 26 de chei). Vigenère folosește o cheie de cuvânt → deplasare diferită per literă.

### 💡 2.9.2 Concept nou și exemplu

```python
def vigenere(text, cheie):
    rez = ""
    i = 0
    for c in text:
        if c.isalpha():
            baza = ord('a') if c.islower() else ord('A')
            depl = ord((cheie[i % len(cheie)]).lower()) - ord('a')
            rez += chr((ord(c) - baza + depl) % 26 + baza)
            i += 1
        else:
            rez += c
    return rez

print(vigenere("criptare", "cheie"))
```

**Eroare frecventă:** uitarea ciclării cheii (`i % len(cheie)`) când mesajul e mai lung.


:::tip
## `i` numără doar literele, nu toate caracterele
Contorul `i` din `vigenere()` avansează exclusiv în interiorul lui `if c.isalpha():` — dacă l-ai incrementa la fiecare caracter (inclusiv spații sau punctuație), litera cheii folosită s-ar decala greșit față de literele reale ale mesajului. De asta un text cu spații criptat corect trebuie testat mereu: dacă cheia "pare" să nu se cicleze corect, prima suspiciune e că `i` a fost mutat în afara `if`-ului. Și nu uita `% len(cheie)` — fără el, indexarea `cheie[i]` produce `IndexError` de îndată ce mesajul depășește lungimea cheii.
:::

### 🔮 2.9.3 Citește și prezice

```python
def vigenere(text, cheie):
    rez = ""
    i = 0
    for c in text:
        if c.isalpha():
            baza = ord('a')
            depl = ord(cheie[i % len(cheie)]) - ord('a')
            rez += chr((ord(c) - baza + depl) % 26 + baza)
            i += 1
        else:
            rez += c
    return rez

print(vigenere("aaaa", "ab"))
```
Prima literă criptată e 'a'+'a'='a'. A doua e 'a'+'b'='b'. Ce se afișează?

### 🤝 2.9.4 Exerciții ghidate

**Exercițiul 1.** Completează decriptarea Vigenère (deplasare opusă):
```python
def decriptare_vigenere(text, cheie):
    rez = ""
    i = 0
    for c in text:
        if c.isalpha():
            baza = ord('a')
            depl = ord(cheie[i % len(cheie)]) - ord('a')
            rez += chr((ord(c) - baza - depl) % 26 + baza)
            i += 1
        else:
            rez += c
    return rez
```

**Exercițiul 2.** Testează că `decriptare_vigenere(vigenere(t, k), k) == t` pentru un text dat.


Completează spațiile punctate pentru a finaliza algoritmul:

```python
# Criptăm un mesaj cu cheia "cifru" și verificăm decriptarea
mesaj = "atac"
cheie = "cifru"

criptat = ___(mesaj, ___)              # apelează vigenere() cu mesajul și cheia
decriptat = decriptare_vigenere(___, ___)  # decriptează folosind aceeași cheie

print("Criptat:", criptat)
print("Decriptare corectă:", decriptat == ___)  # trebuie să fie True
```


### 🎯 2.9.5 Exerciții independente

**Exercițiul 1.** Implementează Vigenère folosind `cezar()` din modulul 2.8 ca "piesă" reutilizabilă.

**Exercițiul 2.** Scrie o funcție care găsește lungimea cheii prin analiza frecvenței (opțional, avansat).

### ✅ 2.9.6 Verifică-ți înțelegerea

1. Vigenère folosește:
   a) O singură deplasare  b) **O cheie de cuvânt (deplasări diferite)**  c) Numere aleatoare
      > Spre deosebire de Cezar, care are o singură deplasare fixă, Vigenère folosește o cheie formată din mai multe litere, iar fiecare literă a cheii dă o deplasare diferită literei corespunzătoare din mesaj.

2. Dacă cheia e mai scurtă decât mesajul:
   a) Eroare  b) **Se repetă ciclic**  c) Se trunchiază
      > Indexarea cheie[i % len(cheie)] face ca, atunci când i depășește lungimea cheii, indexul să revină la început, deci cheia se repetă ciclic pe toată lungimea mesajului.

3. Vigenère e mai sigur decât Cezar pentru că:
   a) E mai lung  b) **Aceeași literă se criptează diferit**  c) Folosește majuscule
      > Pentru că deplasarea depinde de litera curentă din cheie, aceeași literă din mesaj poate fi criptată diferit de fiecare dată, spre deosebire de Cezar unde o literă dă mereu același rezultat — ceea ce face frecvența literelor mai greu de analizat.

4. Decriptarea Vigenère folosește:
   a) **Deplasare negativă per literă**  b) O altă cheie  c) Forță brută
      > Decriptarea Vigenère scade aceeași deplasare calculată din litera cheii, în loc s-o adune, exact cum decriptare_vigenere() folosește '- depl' acolo unde vigenere() folosește '+ depl'.


:::verifica-cod
Scrie o funcție `deplasare_din_litera(litera)` care returnează deplasarea numerică asociată unei litere de cheie Vigenère (ex: 'a' -> 0, 'b' -> 1). Demo: `deplasare_din_litera('c')` -> `2`
template: def deplasare_din_litera(litera):
    # completeaza
    pass

print(deplasare_din_litera('c'))
output: 2
:::

# Modulul 2.10 — Suma de control (algoritmul lui Fletcher)

### 🔄 2.10.1 Recapitulare

Cum știm că un fișier transmis prin rețea n-a fost alterat? O sumă de control verifică integritatea.

### 💡 2.10.2 Concept nou și exemplu

Algoritmul lui **Fletcher** calculează două sume care depind de toate octeții datelor; la destinație se recalculează și se compară.

```python
def fletcher(data):
    sum1 = sum2 = 0
    for octet in data:
        sum1 = (sum1 + octet) % 255
        sum2 = (sum2 + sum1) % 255
    return (sum2 << 8) | sum1

print(fletcher([72, 101, 108, 108, 111]))  # "Hello"
```

Dacă un octet se schimbă, suma se schimbă → datele au fost alterate.


:::tip
## Checksum nu înseamnă criptare
Fletcher **detectează** alterări, dar nu ascunde conținutul — oricine poate recalcula suma pornind de la date, deci nu folosi un checksum ca metodă de securitate (pentru asta ai nevoie de criptare, ca Vigenère, sau de funcții hash criptografice). Observă și de ce `sum2` există: dacă ai folosi doar `sum1` (o simplă sumă a octeților), doi octeți care își schimbă locul între ei (de exemplu `[10, 20]` devine `[20, 10]`) ar produce aceeași sumă, deci eroarea ar trece neobservată. `sum2` acumulează sumele parțiale ale lui `sum1`, ceea ce face suma sensibilă și la *ordinea* octeților, nu doar la valorile lor.
:::

### 🔮 2.10.3 Citește și prezice

```python
def fletcher(data):
    sum1 = sum2 = 0
    for octet in data:
        sum1 = (sum1 + octet) % 255
        sum2 = (sum2 + sum1) % 255
    return (sum2 << 8) | sum1

print(fletcher([1, 2, 3]))
```
Ce valoare (numerică) se afișează? (Calcul: sum1=6, sum2=1+3+6=10, rezultat=10·256+6=2566.)

### 🤝 2.10.4 Exerciții ghidate

**Exercițiul 1.** Completează pentru a verifica dacă două seturi de date au aceeași sumă:
```python
def verifica(a, b):
    return ___ == fletcher(b)  # completează
```

**Exercițiul 2.** Scrie o funcție care simulează o eroare (schimbă un octet) și arată că Fletcher o detectează.

### 🎯 2.10.5 Exerciții independente

**Exercițiul 1.** Compară Fletcher cu o simplă sumă (fără sum2) — ce vulnerabilitate are suma simplă?

**Exercițiul 2.** Implementează un checksum simplu pentru un șir de caractere (folosește `ord()`).

### ✅ 2.10.6 Verifică-ți înțelegerea

1. O sumă de control servește la:
   a) Criptare  b) **Verificarea integrității datelor**  c) Compresie
      > Fletcher recalculează o valoare care depinde de toți octeții datelor; dacă datele au fost alterate în transmisie, suma recalculată la destinație nu mai coincide cu cea originală, semnalând problema.

2. Dacă un octet se schimbă, suma Fletcher:
   a) Rămâne aceeași  b) **Se schimbă**  c) Devine 0
      > sum1 și sum2 se calculează cumulativ din fiecare octet parcurs, deci schimbarea unui singur octet modifică lanțul de calcule de la acel punct înainte, iar suma finală iese diferită.

3. Fletcher folosește:
   a) O singură sumă  b) **Două sume (sum1, sum2)**  c) Trei sume
      > Algoritmul ține două acumulatoare, sum1 (suma octeților) și sum2 (suma parțialelor lui sum1); a doua sumă face ca rezultatul să depindă și de ordinea octeților, nu doar de valorile lor, ceea ce o sumă simplă nu ar detecta.

4. La destinație se:
   a) Calculează o nouă cheie  b) **Recalculează și compară suma**  c) Șterge datele
      > La destinatar se rulează din nou fletcher() pe datele primite și se compară rezultatul cu suma transmisă odată cu datele — dacă nu coincid, înseamnă că ceva s-a alterat pe drum.


:::verifica-cod
Scrie o funcție `suma_octeti(data)` care calculează `sum1` din algoritmul Fletcher: suma tuturor octeților, modulo 255. Demo: `suma_octeti([10, 20, 30])` -> `60`
template: def suma_octeti(data):
    # completeaza
    pass

print(suma_octeti([10, 20, 30]))
output: 60
:::
