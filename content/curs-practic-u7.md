# Conținut lecții — Curs practic de Python, Unitatea 7 (Modulele CP7.1–CP7.4)

Respectă exact structura de pe `academiapython.ro/curs-practic` — 6 sublecții per modul, aceleași etichete/iconuri ca în unitățile anterioare. Unitatea 7 te pregătește pentru Python „din lumea reală”: cod scurt și clar, prelucrare de text, programe rulate pe calculatorul tău și un proiect final care folosește tot ce ai învățat.

---

# Modulul CP7.1 — List și dict comprehensions

### 🔄 CP7.1.1 Recapitulare

Ai construit de multe ori liste noi cu o buclă: pornești cu `rezultat = []`, parcurgi elementele și adaugi cu `append`. Tiparul acesta e atât de des întâlnit, încât Python are o scriere specială, mai scurtă și mai ușor de citit: **comprehension**. Ai văzut-o deja, în treacăt, în proiectul de bibliotecă.

### 💡 CP7.1.2 Concept nou și exemplu

O **list comprehension** construiește o listă nouă într-o singură linie: `[expresie for element in colecție]`.

```python
preturi = [10, 25, 40]
cu_tva = [round(p * 1.19, 2) for p in preturi]
print(cu_tva)
```

Rezultatul: `[11.9, 29.75, 47.6]`. E echivalentul unei bucle `for` cu `append`, dar într-o singură linie.

Poți adăuga o condiție la final, ca să păstrezi doar unele elemente:

```python
note = [4, 9, 7, 3, 10, 6]
promovate = [n for n in note if n >= 5]
print(promovate)
print(len(promovate))
```

Rezultatul: `[9, 7, 10, 6]`, apoi `4`.

O **dict comprehension** construiește un dicționar: `{cheie: valoare for element in colecție}`.

```python
produse = ["cafea", "ceai", "suc"]
lungimi = {p: len(p) for p in produse}
print(lungimi)

preturi = {"cafea": 18, "ceai": 9, "suc": 7}
reduse = {p: pret * 0.9 for p, pret in preturi.items() if pret > 8}
print(reduse)
```

Rezultatul: `{'cafea': 5, 'ceai': 4, 'suc': 3}`, apoi `{'cafea': 16.2, 'ceai': 8.1}`.

:::exemplu
## Funcții care primesc comprehensions
`sum(p for p in preturi if p > 10)` adună direct prețurile peste 10, fără să construiască o listă intermediară. La fel funcționează `max`, `min`, `any` și `all`: `any(n < 5 for n in note)` îți spune dacă există cel puțin o notă sub 5.
:::

:::atentie
## Nu exagera
O comprehension trebuie să rămână ușor de citit. Dacă ai nevoie de mai multe condiții, de calcule în mai mulți pași sau de mesaje afișate, scrie o buclă `for` obișnuită. Codul clar e mai valoros decât codul scurt.
:::

### 🔮 CP7.1.3 Citește și prezice

Fără să rulezi codul, scrie ce afișează:

```python
numere = [1, 2, 3, 4, 5, 6]
patrate_pare = [n * n for n in numere if n % 2 == 0]
print(patrate_pare)
print({n: n * 10 for n in numere if n > 4})
```

### 🤝 CP7.1.4 Exerciții ghidate

**Exercițiul 1.** Completează comprehension-ul ca programul să afișeze lista cu dublul fiecărui număr: `[2, 4, 6]`.

```python
numere = [1, 2, 3]
print([___ for n in numere])
```

**Exercițiul 2.** Din lista de orașe `["Cluj", "Iași", "Brașov", "Arad"]`, construiește cu o comprehension lista orașelor cu mai mult de 4 litere și afișeaz-o.

### 🎯 CP7.1.5 Exerciții independente

**Exercițiul 1.** Pentru lista de nume `["ana", "radu", "ioana"]`, construiește lista cu numele scrise cu inițială mare (folosește `.capitalize()`) și afișeaz-o.

**Exercițiul 2 (mini-proiect de închidere).** Ai notele `{"Ana": 9, "Radu": 4, "Ioana": 7, "Dan": 3}`. Construiește cu o dict comprehension dicționarul elevilor cu notă de cel puțin 5 și afișează-l. Apoi afișează, pe rândul următor, câți elevi sunt corigenți, folosind `sum` și o condiție.

### ✅ CP7.1.6 Verifică-ți înțelegerea

1. Ce produce `[x + 1 for x in [1, 2, 3]]`?
   a) `[1, 2, 3]`  b) **`[2, 3, 4]`**  c) `6`
      > Expresia `x + 1` se aplică fiecărui element, iar rezultatele formează o listă nouă.

2. Unde se pune condiția într-o list comprehension cu filtru?
   a) Înainte de `for`  b) **La final, după `for ... in ...`**  c) Între paranteze separate
      > Forma este `[expresie for element in colecție if condiție]`.

3. Ce construiește `{c: len(c) for c in ["a", "bb"]}`?
   a) O listă  b) **Un dicționar `{'a': 1, 'bb': 2}`**  c) O mulțime
      > Acoladele cu `cheie: valoare` construiesc un dicționar.

4. Când e mai bine să scrii o buclă `for` obișnuită în loc de o comprehension?
   a) Niciodată  b) **Când logica are mai mulți pași și comprehension-ul ar deveni greu de citit**  c) Mereu, comprehension-urile sunt greșite
      > Comprehension-urile sunt pentru transformări simple. Pentru logică mai complicată, o buclă e mai clară.

:::verifica-cod
Completează condiția, ca programul să afișeze doar numerele pozitive: [3, 8].
template: numere = [-2, 3, -5, 8]
print([n for n in numere if ___])
output: [3, 8]
:::

---

# Modulul CP7.2 — Lucrul cu text

### 🔄 CP7.2.1 Recapitulare

Ai lucrat cu stringuri încă din unitatea a treia: indexare, `len`, `upper`, `split`. În practică, mare parte din datele reale sunt text: nume, adrese, mesaje, rânduri din fișiere. Modulul acesta adună cele mai utile unelte pentru a curăța, a căuta și a formata text.

### 💡 CP7.2.2 Concept nou și exemplu

Datele introduse de oameni sunt rareori curate: spații în plus, litere mari amestecate. Metodele de string le pun în ordine:

```python
email = "  Ana.Pop@Exemplu.RO  "
curat = email.strip().lower()
print(curat)
print(curat.endswith(".ro"))
print(curat.replace("exemplu", "firma"))
```

Rezultatul: `ana.pop@exemplu.ro`, `True`, apoi `ana.pop@firma.ro`.

`split` desparte textul în bucăți, iar `join` le lipește la loc:

```python
rand = "Ana;Pop;Cluj"
prenume, nume, oras = rand.split(";")
print(nume, prenume)
print(" - ".join([oras, nume]))
```

Rezultatul: `Pop Ana`, apoi `Cluj - Pop`.

**f-string-urile** au și opțiuni de formatare, scrise după două puncte: numărul de zecimale, aliniere, separatorul de mii.

```python
pret = 1234.5
print(f"{pret:.2f} lei")
print(f"{pret:,.0f}")
print(f"|{'cafea':<8}|{18:>5}|")
```

Rezultatul: `1234.50 lei`, `1,234`, apoi `|cafea   |   18|`. `<8` aliniază la stânga pe 8 caractere, iar `>5` la dreapta pe 5.

Pentru căutări după tipare, de exemplu „toate numerele de telefon dintr-un text”, Python are modulul `re` (expresii regulate):

```python
import re

mesaj = "Sunați la 0722123456 sau la 0744987654."
telefoane = re.findall(r"07\d{8}", mesaj)
print(telefoane)
```

Rezultatul: `['0722123456', '0744987654']`. `\d{8}` înseamnă „exact 8 cifre”.

:::exemplu
## Numără cuvintele
`text.lower().split()` îți dă lista cuvintelor. Cu un dicționar sau cu `collections.Counter(cuvinte).most_common(3)` afli imediat cele mai frecvente trei cuvinte dintr-un text.
:::

:::atentie
## Stringurile nu se modifică pe loc
`email.strip()` nu schimbă variabila `email`, ci întoarce un text nou. Dacă vrei să păstrezi rezultatul, scrie `email = email.strip()`. Uitarea acestei atribuiri e una dintre cele mai frecvente greșeli.
:::

### 🔮 CP7.2.3 Citește și prezice

Fără să rulezi codul, scrie ce afișează:

```python
nume = "  maria IONESCU "
nume.strip()
print(len(nume))
curat = nume.strip().title()
print(curat)
```

### 🤝 CP7.2.4 Exerciții ghidate

**Exercițiul 1.** Completează metoda care elimină spațiile de la capete, ca programul să afișeze `[Ana]`.

```python
nume = "   Ana  "
print(f"[{nume.___()}]")
```

**Exercițiul 2.** Pentru textul `"mere,pere,prune"`, afișează fructele pe un singur rând, separate prin ` | `, folosind `split` și `join`.

### 🎯 CP7.2.5 Exerciții independente

**Exercițiul 1.** Afișează prețul `49.9` cu exact două zecimale, urmat de ` lei`: `49.90 lei`.

**Exercițiul 2 (mini-proiect de închidere).** Din textul `"Comenzi: #1023 livrată, #1024 în curs, #1030 anulată"`, extrage cu `re.findall` numerele comenzilor (doar cifrele de după `#`) și afișează-le separate prin virgulă și spațiu.

### ✅ CP7.2.6 Verifică-ți înțelegerea

1. Ce face `"  Text ".strip()`?
   a) Transformă în litere mici  b) **Elimină spațiile de la începutul și de la finalul textului**  c) Șterge toate spațiile
      > `strip()` curăță doar capetele. Spațiile din interior rămân.

2. Ce afișează `f"{3.14159:.2f}"`?
   a) `3.14159`  b) **`3.14`**  c) `3`
      > `.2f` formatează numărul cu exact două zecimale.

3. Ce întoarce `"a-b-c".split("-")`?
   a) `"abc"`  b) **`['a', 'b', 'c']`**  c) `['a-b-c']`
      > `split` desparte textul la fiecare separator și întoarce o listă.

4. După `email.strip()`, fără atribuire, variabila `email`…
   a) **rămâne neschimbată**  b) nu mai are spații  c) devine goală
      > Stringurile nu pot fi modificate. Metodele întorc un text nou, pe care trebuie să-l salvezi.

:::verifica-cod
Completează metoda care transformă textul în litere mari, ca programul să afișeze exact PYTHON.
template: limbaj = "python"
print(limbaj.___())
output: PYTHON
:::

---

# Modulul CP7.3 — Python pe calculatorul tău: scripturi, pachete și medii virtuale

### 🔄 CP7.3.1 Recapitulare

Până acum ai rulat codul în editorul din browser al cursului. Ai folosit și module din biblioteca standard, ca `json`, `csv` și `datetime`. Pasul următor e să scrii programe pe calculatorul tău și să folosești miile de pachete create de comunitatea Python, de la grafice la analiză de date și automatizări.

### 💡 CP7.3.2 Concept nou și exemplu

**Un script** e un fișier `.py` pe care îl rulezi din terminal cu `python nume.py` (pe Windows uneori `py nume.py`). Când programul tău are funcții pe care vrei să le refolosești și din alte fișiere, pui codul „de pornire” sub `if __name__ == "__main__":`:

```python
def salut(nume):
    return f"Salut, {nume}!"

def main():
    print(salut("lume"))

if __name__ == "__main__":
    main()
```

Rezultatul: `Salut, lume!`. Când rulezi fișierul direct, `__name__` este `"__main__"`, deci `main()` pornește. Când alt fișier face `import` din el, `main()` nu mai rulează singur, iar funcția `salut` poate fi folosită liber.

**Pachetele externe** se instalează cu `pip`, din terminal (nu din cod):

- `python -m venv .venv` creează un **mediu virtual**, adică un folder separat cu pachetele acestui proiect;
- `.venv\Scripts\activate` (Windows) sau `source .venv/bin/activate` (macOS/Linux) îl activează;
- `pip install requests` instalează pachetul `requests`;
- `pip freeze > requirements.txt` salvează lista pachetelor, ca altcineva să le instaleze la fel, cu `pip install -r requirements.txt`.

Un fișier `requirements.txt` e un simplu fișier text, câte un pachet pe rând. Poți să-l citești ca orice alt fișier:

```python
with open("requirements.txt", "w", encoding="utf-8") as f:
    f.write("requests==2.32.3\npandas==2.2.3\n")

with open("requirements.txt", encoding="utf-8") as f:
    pachete = [rand.split("==")[0] for rand in f if rand.strip()]
print(pachete)
```

Rezultatul: `['requests', 'pandas']`.

Câteva pachete foarte folosite, ca să știi ce să cauți: `requests` (descarcă date de pe internet), `pandas` (tabele și analiză de date), `matplotlib` (grafice), `openpyxl` (fișiere Excel), `flask` (site-uri web mici).

:::exemplu
## Un mediu virtual pentru fiecare proiect
Fiecare proiect își are propriul `.venv`. Așa, dacă un proiect are nevoie de `pandas` 2.2 și altul de o versiune mai veche, nu se încurcă între ele. Dacă ceva nu mai merge, ștergi folderul `.venv` și îl creezi din nou din `requirements.txt`.
:::

:::atentie
## `pip install` se scrie în terminal, nu în cod
`pip install requests` este o comandă pentru terminal. Scrisă într-un fișier `.py`, dă `SyntaxError`. În editorul din browser al acestui curs nu poți instala pachete: acolo ai doar biblioteca standard.
:::

### 🔮 CP7.3.3 Citește și prezice

Fără să rulezi codul, scrie ce afișează:

```python
def aduna(a, b):
    return a + b

print(__name__)
if __name__ == "__main__":
    print(aduna(2, 3))
```

### 🤝 CP7.3.4 Exerciții ghidate

**Exercițiul 1.** Completează condiția ca funcția `main` să ruleze când fișierul e pornit direct. Programul trebuie să afișeze `Pornit`.

```python
def main():
    print("Pornit")

if __name__ == ___:
    main()
```

**Exercițiul 2.** Scrie fișierul `requirements.txt` cu rândurile `flask==3.0.3` și `requests==2.32.3`, apoi citește-l și afișează câte pachete conține.

### 🎯 CP7.3.5 Exerciții independente

**Exercițiul 1.** Scrie funcția `versiune(rand)`, care primește un rând de forma `"pandas==2.2.3"` și întoarce doar versiunea (`2.2.3`). Afișează rezultatul pentru `"flask==3.0.3"`.

**Exercițiul 2 (mini-proiect de închidere).** Scrie un script cu o funcție `main()` pornită prin `if __name__ == "__main__":`. Ea transformă lista de rânduri `["requests==2.32.3", "pandas==2.2.3"]` într-un dicționar `{pachet: versiune}` și îl afișează.

### ✅ CP7.3.6 Verifică-ți înțelegerea

1. La ce folosește un mediu virtual (`venv`)?
   a) Face programul mai rapid  b) **Ține separat pachetele fiecărui proiect**  c) Înlocuiește Python
      > Fiecare proiect are propriile pachete și versiuni, fără să le încurce pe ale altor proiecte.

2. Unde scrii comanda `pip install requests`?
   a) Într-un fișier `.py`  b) **În terminal**  c) În `requirements.txt`, care o rulează singur
      > `pip` este un program separat, rulat din terminal. În cod, comanda dă eroare de sintaxă.

3. Ce conține de obicei `requirements.txt`?
   a) Codul programului  b) **Lista pachetelor necesare, cu versiunile lor**  c) Parolele proiectului
      > Fișierul permite reinstalarea exactă a pachetelor cu `pip install -r requirements.txt`.

4. Ce se întâmplă cu codul de sub `if __name__ == "__main__":` când fișierul e importat din alt program?
   a) Rulează de două ori  b) **Nu rulează**  c) Dă eroare
      > La import, `__name__` are numele modulului, nu `"__main__"`, deci blocul nu se execută.

:::verifica-cod
Completează metoda care desparte rândul la „==”, ca programul să afișeze exact requests.
template: rand = "requests==2.32.3"
print(rand.___("==")[0])
output: requests
:::

---

# Modulul CP7.4 — Proiect final: analizor de cheltuieli

### 🔄 CP7.4.1 Recapitulare

Ai parcurs tot cursul: variabile, decizii și bucle, colecții, funcții, erori, fișiere CSV și JSON, clase și prelucrare de text. Proiectul final le leagă pe toate într-un program util pe bune: citește cheltuielile tale dintr-un fișier, le grupează pe categorii și scrie un raport.

### 💡 CP7.4.2 Concept nou și exemplu

Un proiect real se construiește în pași mici, fiecare verificat înainte de următorul. Planul nostru:

- **citire**: datele vin dintr-un CSV cu coloanele `data`, `categorie`, `suma`;
- **validare**: rândurile cu sume greșite sunt raportate, nu opresc programul;
- **calcul**: totaluri pe categorie și categoria cu cele mai mari cheltuieli;
- **raport**: un tabel aliniat și un fișier JSON cu rezultatele.

**Pasul 1: date de test și citire sigură.**

```python
import csv

with open("cheltuieli.csv", "w", encoding="utf-8", newline="") as f:
    f.write("data,categorie,suma\n")
    f.write("2026-10-01,mâncare,120.5\n")
    f.write("2026-10-03,transport,45\n")
    f.write("2026-10-05,mâncare,80\n")
    f.write("2026-10-07,distracție,abc\n")
    f.write("2026-10-09,transport,30\n")

def citeste_cheltuieli(cale):
    valide, erori = [], []
    with open(cale, encoding="utf-8", newline="") as f:
        for numar, rand in enumerate(csv.DictReader(f), start=2):
            try:
                valide.append((rand["categorie"], float(rand["suma"])))
            except ValueError:
                erori.append(numar)
    return valide, erori

valide, erori = citeste_cheltuieli("cheltuieli.csv")
print(len(valide), erori)
```

Rezultatul: `4 [5]`. Rândul 5 din fișier are suma „abc”: e raportat, iar programul merge mai departe.

**Pasul 2: totaluri pe categorie, cu o clasă care ține logica la un loc.**

```python
class Raport:
    def __init__(self, cheltuieli):
        self.totaluri = {}
        for categorie, suma in cheltuieli:
            self.totaluri[categorie] = self.totaluri.get(categorie, 0) + suma

    def total(self):
        return sum(self.totaluri.values())

    def cea_mai_mare(self):
        return max(self.totaluri, key=self.totaluri.get)

    def tabel(self):
        linii = [f"{c:<12}{s:>10.2f}" for c, s in sorted(self.totaluri.items())]
        linii.append(f"{'TOTAL':<12}{self.total():>10.2f}")
        return "\n".join(linii)

r = Raport([("mâncare", 120.5), ("transport", 45), ("mâncare", 80), ("transport", 30)])
print(r.cea_mai_mare())
print(r.total())
```

Rezultatul: `mâncare`, apoi `275.5`. `max(self.totaluri, key=self.totaluri.get)` alege cheia cu cea mai mare valoare, cum ai învățat în CP4.4.

**Pasul 3: salvarea rezultatelor în JSON.**

```python
import json

totaluri = {"mâncare": 200.5, "transport": 75.0}
with open("raport.json", "w", encoding="utf-8") as f:
    json.dump({"totaluri": totaluri, "total": sum(totaluri.values())}, f, ensure_ascii=False)
with open("raport.json", encoding="utf-8") as f:
    print(json.load(f)["total"])
```

Rezultatul: `275.5`. Programul final pune cei trei pași într-o funcție `main()` și o pornește cu `if __name__ == "__main__":`.

:::exemplu
## Cum îl duci mai departe
Idei de extindere, fiecare un exercițiu bun: un buget pe categorie și avertisment la depășire; totaluri pe luni (`data[:7]` îți dă „2026-10”); un grafic cu `matplotlib`, pe calculatorul tău; citirea extrasului de cont exportat de bancă în CSV.
:::

:::atentie
## Testează cu date „murdare”
Un program care merge doar pe date perfecte se strică la primul fișier real. Pune intenționat în datele de test un rând greșit, ca „abc” la sumă, și verifică dacă programul îl raportează frumos, în loc să se oprească.
:::

### 🔮 CP7.4.3 Citește și prezice

Fără să rulezi codul, scrie ce afișează:

```python
cheltuieli = [("cafea", 18), ("carte", 45), ("cafea", 12)]
totaluri = {}
for categorie, suma in cheltuieli:
    totaluri[categorie] = totaluri.get(categorie, 0) + suma
print(totaluri)
print(max(totaluri, key=totaluri.get))
```

### 🤝 CP7.4.4 Exerciții ghidate

**Exercițiul 1.** Completează linia care adună suma la totalul categoriei, ca programul să afișeze `{'mâncare': 200, 'transport': 45}`.

```python
cheltuieli = [("mâncare", 120), ("transport", 45), ("mâncare", 80)]
totaluri = {}
for categorie, suma in cheltuieli:
    totaluri[categorie] = ___
print(totaluri)
```

**Exercițiul 2.** Pentru sumele text `["12.5", "x", "30", "7.5"]`, adună doar valorile valide (folosește `try` / `except ValueError`) și afișează pe rânduri separate totalul și numărul de valori invalide.

### 🎯 CP7.4.5 Exerciții independente

**Exercițiul 1.** Pentru totalurile `{"mâncare": 200.5, "transport": 75}`, afișează fiecare categorie pe câte un rând, aliniată la stânga pe 10 caractere, urmată de sumă cu două zecimale, aliniată la dreapta pe 8 caractere. Categoriile apar în ordine alfabetică.

**Exercițiul 2 (mini-proiect de închidere).** Scrie fișierul `luna.csv` cu antetul `data,categorie,suma` și rândurile `2026-10-02,facturi,310`, `2026-10-04,mâncare,95.5`, `2026-10-11,facturi,90` și `2026-10-15,mâncare,abc`. Citește-l, ignoră rândurile cu sume invalide și afișează, pe rânduri separate, categoria cu cele mai mari cheltuieli și totalul ei.

### ✅ CP7.4.6 Verifică-ți înțelegerea

1. De ce raportăm rândurile cu sume invalide în loc să lăsăm programul să se oprească?
   a) E obligatoriu în Python  b) **Datele reale au greșeli, iar programul trebuie să le trateze și să continue**  c) Ca să fie codul mai lung
      > Un program robust își face treaba cu datele bune și îți spune clar unde sunt cele greșite.

2. Ce face `max(totaluri, key=totaluri.get)`?
   a) Întoarce cea mai mare sumă  b) **Întoarce categoria (cheia) cu cea mai mare sumă**  c) Sortează dicționarul
      > Parcurgerea unui dicționar dă cheile, iar `key=totaluri.get` le compară după valori.

3. Ce înseamnă `f"{s:>10.2f}"`?
   a) Textul `s` repetat de 10 ori  b) **Numărul `s` cu 2 zecimale, aliniat la dreapta pe 10 caractere**  c) Primele 10 caractere din `s`
      > `>10` aliniază la dreapta pe 10 caractere, iar `.2f` formatează cu două zecimale.

4. De ce împărțim proiectul în pași mici (citire, calcul, raport)?
   a) Python nu acceptă programe lungi  b) **Fiecare pas se poate verifica și repara separat**  c) Ca să ruleze mai repede
      > Pașii mici, testați pe rând, fac greșelile ușor de găsit și programul ușor de extins.

:::verifica-cod
Completează valoarea implicită din get, ca prima apariție a unei categorii să pornească de la zero. Programul trebuie să afișeze exact {'carte': 45}.
template: totaluri = {}
totaluri["carte"] = totaluri.get("carte", ___) + 45
print(totaluri)
output: {'carte': 45}
:::
