# Conținut lecții — Curs practic de Python, Unitatea 6 (Modulele CP6.1–CP6.4)

Respectă exact structura de pe `academiapython.ro/curs-practic` — 6 sublecții per modul, aceleași etichete/iconuri ca în unitățile anterioare. Unitatea 6 introduce programarea orientată pe obiecte: cum grupezi datele și funcțiile care lucrează cu ele într-un singur „obiect”.

---

# Modulul CP6.1 — Clase și obiecte

### 🔄 CP6.1.1 Recapitulare

Ai reprezentat până acum un produs ca dicționar, `{"nume": "cafea", "pret": 18}`, și ai scris funcții separate care lucrează cu el. Pe măsură ce programul crește, devine greu de urmărit ce funcție merge cu ce date. Clasele rezolvă exact asta: pun la un loc datele și operațiile lor.

### 💡 CP6.1.2 Concept nou și exemplu

O **clasă** este un șablon, iar un **obiect** este un exemplar concret construit după acel șablon. Clasa `Produs` descrie ce are orice produs. Obiectele `cafea` și `ceai` sunt produse concrete.

```python
class Produs:
    def __init__(self, nume, pret):
        self.nume = nume
        self.pret = pret

cafea = Produs("cafea", 18)
ceai = Produs("ceai", 9)
print(cafea.nume, cafea.pret)
print(ceai.pret + cafea.pret)
```

Rezultatul: `cafea 18`, apoi `27`.

`__init__` este metoda care pregătește fiecare obiect nou, imediat ce îl creezi. `self` înseamnă „obiectul acesta”: `self.nume = nume` salvează numele în obiectul care tocmai se construiește. Valorile salvate astfel se numesc **atribute** și se citesc cu punct: `cafea.nume`.

Atributele pot fi modificate după creare, iar fiecare obiect își păstrează propriile valori:

```python
class ContBancar:
    def __init__(self, titular, sold=0):
        self.titular = titular
        self.sold = sold

cont_ana = ContBancar("Ana", 500)
cont_radu = ContBancar("Radu")
cont_ana.sold = cont_ana.sold + 100
print(cont_ana.sold, cont_radu.sold)
```

Rezultatul: `600 0`. Modificarea contului Anei nu atinge contul lui Radu.

:::exemplu
## Clasele pe care le-ai folosit deja
Fără să știi, ai lucrat tot timpul cu obiecte: `"text"` este un obiect al clasei `str`, iar `[1, 2]` unul al clasei `list`. `type("text")` îți arată `<class 'str'>`. Acum înveți să-ți creezi propriile clase.
:::

:::atentie
## Nu uita `self`
Orice metodă dintr-o clasă primește ca prim parametru `self`. Dacă scrii `def __init__(nume, pret):`, Python va pune obiectul în `nume` și vei primi o eroare de tipul „takes 2 positional arguments but 3 were given”.
:::

### 🔮 CP6.1.3 Citește și prezice

Fără să rulezi codul, scrie ce afișează:

```python
class Elev:
    def __init__(self, nume, nota):
        self.nume = nume
        self.nota = nota

a = Elev("Ioana", 9)
b = Elev("Dan", 7)
b.nota = 8
print(a.nota + b.nota)
print(b.nume)
```

### 🤝 CP6.1.4 Exerciții ghidate

**Exercițiul 1.** Completează constructorul, ca atributul `titlu` să fie salvat în obiect. Programul trebuie să afișeze `Ion`.

```python
class Carte:
    def __init__(self, titlu):
        ___ = titlu

c = Carte("Ion")
print(c.titlu)
```

**Exercițiul 2.** Creează clasa `Oras` cu atributele `nume` și `populatie`. Creează obiectul pentru Iași, cu populația 271692, și afișează `Iași 271692`.

### 🎯 CP6.1.5 Exerciții independente

**Exercițiul 1.** Creează clasa `Dreptunghi` cu atributele `lungime` și `latime`. Creează un dreptunghi 6 × 4 și afișează aria lui, calculată din atribute.

**Exercițiul 2 (mini-proiect de închidere).** Creează clasa `Produs` (nume, pret, cantitate). Pune trei produse într-o listă: pâine (5 lei, 2 buc.), lapte (8 lei, 1 buc.) și mere (12 lei, 3 buc.). Calculează și afișează valoarea totală a coșului.

### ✅ CP6.1.6 Verifică-ți înțelegerea

1. Ce este o clasă?
   a) O variabilă specială  b) **Un șablon după care se construiesc obiecte**  c) O listă de funcții
      > Clasa descrie ce date și ce operații are fiecare obiect. Obiectele sunt exemplare concrete ale clasei.

2. Când rulează metoda `__init__`?
   a) Doar dacă o apelezi tu explicit  b) **Automat, la crearea fiecărui obiect nou**  c) La finalul programului
      > `Produs("cafea", 18)` creează obiectul și apelează automat `__init__`, ca să-i pregătească atributele.

3. Ce înseamnă `self` într-o metodă?
   a) Clasa însăși  b) **Obiectul pentru care se execută metoda**  c) Primul argument dat de utilizator
      > `self` este obiectul curent. Prin el, metoda citește și modifică atributele exemplarului respectiv.

4. Două obiecte create din aceeași clasă…
   a) au mereu aceleași valori  b) **își păstrează fiecare propriile valori ale atributelor**  c) nu pot exista simultan
      > Fiecare obiect are atributele lui. Modificarea unuia nu îl afectează pe celălalt.

:::verifica-cod
Completează crearea obiectului, ca programul să afișeze exact Rex.
template: class Caine:
    def __init__(self, nume):
        self.nume = nume

c = Caine(___)
print(c.nume)
output: Rex
:::

---

# Modulul CP6.2 — Metode și reprezentarea obiectelor

### 🔄 CP6.2.1 Recapitulare

Ai creat clase cu atribute, ca `Produs` cu `nume` și `pret`. Dar operațiile, de pildă calculul prețului cu reducere, le-ai scris tot în afara clasei. Pasul următor este să muți comportamentul în clasă, sub formă de **metode**.

### 💡 CP6.2.2 Concept nou și exemplu

O **metodă** este o funcție definită în interiorul clasei. Primește `self`, deci are acces direct la atributele obiectului.

```python
class ContBancar:
    def __init__(self, titular, sold=0):
        self.titular = titular
        self.sold = sold

    def depune(self, suma):
        self.sold += suma

    def retrage(self, suma):
        if suma > self.sold:
            return False
        self.sold -= suma
        return True

cont = ContBancar("Ana", 100)
cont.depune(50)
print(cont.retrage(500))
print(cont.retrage(30), cont.sold)
```

Rezultatul: `False`, apoi `True 120`. Contul nu permite retragerea mai multor bani decât are: regula stă în clasă, nu împrăștiată prin program.

Ce afișează `print(cont)`? Implicit, ceva greu de citit, ca `<__main__.ContBancar object at 0x7f…>`. Metoda specială `__str__` îi spune lui Python cum să transforme obiectul în text:

```python
class Produs:
    def __init__(self, nume, pret):
        self.nume = nume
        self.pret = pret

    def __str__(self):
        return f"{self.nume} ({self.pret} lei)"

    def pret_redus(self, procent):
        return round(self.pret * (1 - procent / 100), 2)

p = Produs("Căști", 150)
print(p)
print(p.pret_redus(20))
```

Rezultatul: `Căști (150 lei)`, apoi `120.0`.

:::exemplu
## Metode cu nume speciale
Metodele care încep și se termină cu două liniuțe (`__init__`, `__str__`, `__len__`) sunt apelate automat de Python în situații anume. De exemplu, dacă definești `__len__`, funcția `len(obiect)` va funcționa și pentru obiectele tale.
:::

:::atentie
## `__str__` trebuie să întoarcă text
`__str__` trebuie să facă `return` unui `str`. Dacă scrii `print(...)` în loc de `return`, sau întorci un număr, `print(obiect)` dă eroarea `TypeError: __str__ returned non-string`.
:::

### 🔮 CP6.2.3 Citește și prezice

Fără să rulezi codul, scrie ce afișează:

```python
class Contor:
    def __init__(self):
        self.valoare = 0

    def creste(self):
        self.valoare += 1

c = Contor()
c.creste()
c.creste()
c.creste()
print(c.valoare)
```

### 🤝 CP6.2.4 Exerciții ghidate

**Exercițiul 1.** Completează metoda `arie`, ca programul să afișeze `24`.

```python
class Dreptunghi:
    def __init__(self, l, L):
        self.l = l
        self.L = L

    def arie(self):
        return ___

print(Dreptunghi(4, 6).arie())
```

**Exercițiul 2.** Adaugă clasei `Elev` (cu atributele `nume` și `nota`) metoda `__str__`, care întoarce textul `Ana: 9`. Creează eleva Ana cu nota 9 și afișeaz-o cu `print`.

### 🎯 CP6.2.5 Exerciții independente

**Exercițiul 1.** Creează clasa `Termometru` cu atributul `celsius` și metoda `fahrenheit()`, care întoarce `celsius * 9 / 5 + 32`. Afișează rezultatul pentru 25 de grade Celsius.

**Exercițiul 2 (mini-proiect de închidere).** Creează clasa `Cos` cu o listă `produse` (inițial goală), metoda `adauga(nume, pret)` și metoda `total()`. Adaugă pâine (5), lapte (8) și cafea (18), apoi afișează pe rânduri separate numărul de produse și totalul.

### ✅ CP6.2.6 Verifică-ți înțelegerea

1. Ce este o metodă?
   a) Un atribut numeric  b) **O funcție definită în interiorul unei clase**  c) Un alt nume pentru obiect
      > Metodele sunt funcții care aparțin clasei și lucrează cu atributele obiectului prin `self`.

2. Cum apelezi metoda `depune` pentru obiectul `cont`?
   a) `depune(cont, 50)`  b) **`cont.depune(50)`**  c) `ContBancar.depune(50)`
      > Apelul se face prin obiect, cu punct. Python pune automat obiectul în parametrul `self`.

3. La ce folosește metoda `__str__`?
   a) La compararea obiectelor  b) **La afișarea obiectului ca text, de exemplu cu `print`**  c) La crearea obiectului
      > `print(obiect)` și `str(obiect)` folosesc textul întors de `__str__`.

4. De ce e util să pui regula „nu poți retrage mai mult decât ai” în metoda `retrage`?
   a) Rulează mai repede  b) **Regula se aplică mereu, oriunde se face o retragere**  c) Altfel Python dă eroare
      > Când regula stă în clasă, nicio parte a programului nu o poate ocoli din greșeală.

:::verifica-cod
Completează metoda ca să întoarcă dublul valorii. Programul trebuie să afișeze 14.
template: class Numar:
    def __init__(self, valoare):
        self.valoare = valoare

    def dublu(self):
        return ___

print(Numar(7).dublu())
output: 14
:::

---

# Modulul CP6.3 — Moștenire

### 🔄 CP6.3.1 Recapitulare

Știi să creezi clase cu atribute și metode. Uneori însă ai mai multe clase foarte asemănătoare: un angajat cu normă întreagă și un colaborator au amândoi nume și un venit, dar venitul se calculează diferit. Ca să nu copiezi același cod de două ori, Python îți permite ca o clasă să **moștenească** de la alta.

### 💡 CP6.3.2 Concept nou și exemplu

O **clasă copil** preia automat atributele și metodele **clasei părinte**. O declari scriind părintele între paranteze: `class Copil(Parinte):`.

```python
class Animal:
    def __init__(self, nume):
        self.nume = nume

    def prezinta(self):
        return f"Sunt {self.nume}"

class Caine(Animal):
    def sunet(self):
        return "Ham!"

rex = Caine("Rex")
print(rex.prezinta())
print(rex.sunet())
```

Rezultatul: `Sunt Rex`, apoi `Ham!`. `Caine` nu are propriul `__init__` sau `prezinta`: le moștenește de la `Animal`.

Clasa copil poate **suprascrie** o metodă, adică își poate scrie propria versiune. Cu `super()` apelezi versiunea părintelui, ca să nu repeți codul:

```python
class Angajat:
    def __init__(self, nume, salariu):
        self.nume = nume
        self.salariu = salariu

    def venit_anual(self):
        return self.salariu * 12

class Manager(Angajat):
    def __init__(self, nume, salariu, bonus):
        super().__init__(nume, salariu)
        self.bonus = bonus

    def venit_anual(self):
        return super().venit_anual() + self.bonus

echipa = [Angajat("Ana", 5000), Manager("Radu", 7000, 10000)]
for persoana in echipa:
    print(persoana.nume, persoana.venit_anual())
```

Rezultatul: `Ana 60000`, apoi `Radu 94000`. Bucla apelează aceeași metodă, `venit_anual()`, iar fiecare obiect răspunde după propria clasă.

`isinstance(obiect, Clasa)` verifică dacă un obiect este de tipul clasei sau al unui copil al ei: `isinstance(Manager("X", 1, 1), Angajat)` este `True`.

:::exemplu
## Când merită moștenirea
Folosește moștenirea când poți spune „un X este un Y”: un manager este un angajat, un câine este un animal. Dacă relația este „un X are un Y” (o mașină are un motor), pune obiectul ca atribut, nu moșteni.
:::

:::atentie
## Nu uita `super().__init__`
Dacă clasa copil își definește propriul `__init__` și nu apelează `super().__init__(...)`, atributele setate de părinte, ca `self.nume`, nu mai există. Apare eroarea `AttributeError` la prima folosire.
:::

### 🔮 CP6.3.3 Citește și prezice

Fără să rulezi codul, scrie ce afișează:

```python
class Forma:
    def arie(self):
        return 0

class Patrat(Forma):
    def __init__(self, latura):
        self.latura = latura

    def arie(self):
        return self.latura ** 2

forme = [Forma(), Patrat(3)]
print([f.arie() for f in forme])
print(isinstance(forme[1], Forma))
```

### 🤝 CP6.3.4 Exerciții ghidate

**Exercițiul 1.** Completează declarația clasei, ca `Pisica` să moștenească de la `Animal`. Programul trebuie să afișeze `Sunt Mia`.

```python
class Animal:
    def __init__(self, nume):
        self.nume = nume

    def prezinta(self):
        return f"Sunt {self.nume}"

class Pisica(___):
    pass

print(Pisica("Mia").prezinta())
```

**Exercițiul 2.** Clasa `Vehicul` are metoda `roti()`, care întoarce `4`. Creează clasa copil `Bicicleta`, care suprascrie `roti()` și întoarce `2`. Afișează pe același rând numărul de roți pentru un vehicul și pentru o bicicletă.

### 🎯 CP6.3.5 Exerciții independente

**Exercițiul 1.** Creează clasa `Cont` (titular, sold) și clasa copil `ContEconomii`, care are în plus `dobanda` (în procente) și metoda `aplica_dobanda()`, care adaugă dobânda la sold. Pentru un cont de economii cu 1000 de lei și 5% dobândă, aplică dobânda și afișează soldul.

**Exercițiul 2 (mini-proiect de închidere).** Creează clasa `Forma` cu metoda `arie()`, care întoarce 0, și clasele copil `Dreptunghi(l, L)` și `Cerc(r)`. Pentru cerc, aria este `3.14 * r * r`. Pentru lista `[Dreptunghi(2, 5), Cerc(1), Dreptunghi(3, 3)]`, afișează suma ariilor, rotunjită la 2 zecimale.

### ✅ CP6.3.6 Verifică-ți înțelegerea

1. Ce înseamnă `class Caine(Animal):`?
   a) `Caine` și `Animal` sunt aceeași clasă  b) **`Caine` moștenește atributele și metodele lui `Animal`**  c) `Animal` moștenește de la `Caine`
      > Clasa dintre paranteze este părintele. `Caine` primește tot ce are `Animal` și poate adăuga lucruri noi.

2. Ce face `super().__init__(nume, salariu)`?
   a) Creează un obiect nou  b) **Apelează constructorul clasei părinte**  c) Șterge atributele vechi
      > `super()` îți dă acces la versiunea părintelui, ca să refolosești codul lui în loc să-l copiezi.

3. Ce înseamnă să suprascrii o metodă?
   a) S-o ștergi  b) **Să scrii în clasa copil o versiune proprie, cu același nume**  c) S-o redenumești
      > Când copilul definește o metodă cu același nume, obiectele lui folosesc versiunea copilului.

4. Ce întoarce `isinstance(Manager("Ion", 1, 1), Angajat)`, dacă `Manager` moștenește de la `Angajat`?
   a) `False`  b) **`True`**  c) Eroare
      > Un obiect al clasei copil este și de tipul clasei părinte, deci `isinstance` întoarce `True`.

:::verifica-cod
Completează apelul către metoda părintelui, ca programul să afișeze exact Salut, Ana!
template: class Persoana:
    def salut(self):
        return "Salut"

class Eleva(Persoana):
    def salut(self):
        return ___ + ", Ana!"

print(Eleva().salut())
output: Salut, Ana!
:::

---

# Modulul CP6.4 — Proiect: aplicație de gestiune a unei biblioteci

### 🔄 CP6.4.1 Recapitulare

În această unitate ai învățat clase, metode, `__str__` și moștenire. În unitățile anterioare ai lucrat cu liste, dicționare, excepții și fișiere JSON. În acest modul le pui pe toate cap la cap într-o aplicație mică, dar completă: evidența cărților unei biblioteci.

### 💡 CP6.4.2 Concept nou și exemplu

Un program mai mare se construiește din clase mici, fiecare cu o singură responsabilitate. Pentru bibliotecă avem nevoie de două: `Carte` (o carte și starea ei) și `Biblioteca` (colecția de cărți și regulile de împrumut).

```python
class Carte:
    def __init__(self, titlu, autor):
        self.titlu = titlu
        self.autor = autor
        self.imprumutata = False

    def __str__(self):
        stare = "împrumutată" if self.imprumutata else "disponibilă"
        return f"{self.titlu} de {self.autor} ({stare})"


class Biblioteca:
    def __init__(self):
        self.carti = []

    def adauga(self, carte):
        self.carti.append(carte)

    def cauta(self, titlu):
        for carte in self.carti:
            if carte.titlu == titlu:
                return carte
        raise KeyError(titlu)

    def imprumuta(self, titlu):
        carte = self.cauta(titlu)
        if carte.imprumutata:
            return False
        carte.imprumutata = True
        return True

    def disponibile(self):
        return [c.titlu for c in self.carti if not c.imprumutata]


b = Biblioteca()
b.adauga(Carte("Ion", "Liviu Rebreanu"))
b.adauga(Carte("Enigma Otiliei", "George Călinescu"))
print(b.imprumuta("Ion"))
print(b.imprumuta("Ion"))
print(b.disponibile())
print(b.cauta("Ion"))
```

Rezultatul: `True`, `False`, `['Enigma Otiliei']`, apoi `Ion de Liviu Rebreanu (împrumutată)`. A doua încercare de împrumut eșuează, pentru că regula stă în metoda `imprumuta`.

`raise KeyError(titlu)` **ridică** o excepție, ca în modulul CP5.1, dar de data asta din codul tău. Cine folosește clasa poate s-o trateze cu `try` / `except`:

```python
class Biblioteca:
    def __init__(self):
        self.carti = []

    def cauta(self, titlu):
        for carte in self.carti:
            if carte.titlu == titlu:
                return carte
        raise KeyError(titlu)

try:
    Biblioteca().cauta("Moromeții")
except KeyError as e:
    print("Nu există cartea", e)
```

Rezultatul: `Nu există cartea 'Moromeții'`.

Ca datele să rămână salvate între rulări, transformi obiectele în dicționare și le scrii în JSON, cu ce ai învățat în CP5.3:

```python
import json

carti = [{"titlu": "Ion", "autor": "Liviu Rebreanu", "imprumutata": True}]
with open("biblioteca.json", "w", encoding="utf-8") as f:
    json.dump(carti, f, ensure_ascii=False)
with open("biblioteca.json", encoding="utf-8") as f:
    print(json.load(f)[0]["titlu"])
```

Rezultatul: `Ion`.

:::exemplu
## O singură responsabilitate pe clasă
`Carte` știe doar despre o carte. `Biblioteca` știe doar cum se gestionează colecția. Când vrei să adaugi „data returnării”, știi exact unde: în `Carte` și în `imprumuta`. Așa rămâne codul ușor de modificat.
:::

:::atentie
## Nu modifica lista pe care o parcurgi
Dacă ștergi elemente din `self.carti` în timp ce o parcurgi cu `for`, unele elemente sunt sărite. Construiește o listă nouă, de exemplu `[c for c in self.carti if c.titlu != titlu]`, și pune-o în locul celei vechi.
:::

### 🔮 CP6.4.3 Citește și prezice

Fără să rulezi codul, scrie ce afișează:

```python
class Stoc:
    def __init__(self):
        self.produse = {}

    def adauga(self, nume, cantitate):
        self.produse[nume] = self.produse.get(nume, 0) + cantitate

s = Stoc()
s.adauga("mere", 5)
s.adauga("pere", 2)
s.adauga("mere", 3)
print(s.produse)
print(sum(s.produse.values()))
```

### 🤝 CP6.4.4 Exerciții ghidate

**Exercițiul 1.** Completează metoda `numar_carti`, ca programul să afișeze `2`.

```python
class Biblioteca:
    def __init__(self):
        self.carti = []

    def adauga(self, titlu):
        self.carti.append(titlu)

    def numar_carti(self):
        return ___

b = Biblioteca()
b.adauga("Ion")
b.adauga("Baltagul")
print(b.numar_carti())
```

**Exercițiul 2.** Creează clasa `ListaSarcini` cu metodele `adauga(sarcina)` și `bifeaza(sarcina)`. Bifarea mută sarcina din lista `de_facut` în lista `facute`. Adaugă `cumpărături`, `teme` și `sport`, bifează `teme`, apoi afișează lista `de_facut`.

### 🎯 CP6.4.5 Exerciții independente

**Exercițiul 1.** Pornind de la clasa `ContBancar` (titular, sold), adaugă metoda `transfera(alt_cont, suma)`, care mută banii dintr-un cont în altul doar dacă soldul ajunge. Ana are 300 de lei, Radu 100. După un transfer de 120 de lei de la Ana la Radu, afișează cele două solduri pe același rând.

**Exercițiul 2 (mini-proiect de închidere).** Creează clasele `Carte` (titlu, pret) și `Librarie` (o listă de cărți). `Librarie` are metodele `adauga(carte)`, `valoare_totala()` și `cea_mai_scumpa()`, ultima întorcând titlul. Adaugă cărțile Ion (45 de lei), Baltagul (30) și Maitreyi (52), apoi afișează, pe rânduri separate, valoarea totală și titlul celei mai scumpe cărți.

### ✅ CP6.4.6 Verifică-ți înțelegerea

1. Ce face `raise KeyError(titlu)`?
   a) Afișează un mesaj  b) **Ridică o excepție din codul tău, pe care apelantul o poate trata**  c) Oprește definitiv Python
      > `raise` produce o excepție exact ca cele generate de Python. Cine apelează metoda o poate prinde cu `try` / `except`.

2. De ce am împărțit aplicația în clasele `Carte` și `Biblioteca`?
   a) Python cere minimum două clase  b) **Fiecare clasă are o singură responsabilitate, deci codul e mai ușor de modificat**  c) Ca să ruleze mai repede
      > O clasă care face un singur lucru e mai ușor de înțeles, de testat și de extins.

3. Cum salvezi obiectele într-un fișier JSON?
   a) Direct, cu `json.dump(obiect)`  b) **Le transformi întâi în dicționare, apoi le scrii cu `json.dump`**  c) JSON nu poate salva date
      > JSON cunoaște dicționare, liste, texte și numere, nu clasele tale. Le transformi în dicționare înainte de salvare.

4. Ce se poate întâmpla dacă ștergi elemente dintr-o listă în timp ce o parcurgi cu `for`?
   a) Nimic  b) **Unele elemente sunt sărite**  c) Lista se dublează
      > Ștergerea mută elementele rămase, iar bucla trece peste unele dintre ele. Construiește o listă nouă în loc.

:::verifica-cod
Completează condiția din listă, ca programul să afișeze doar titlurile cărților disponibile: ['Baltagul'].
template: carti = [("Ion", True), ("Baltagul", False)]
disponibile = [titlu for titlu, imprumutata in carti if ___]
print(disponibile)
output: ['Baltagul']
:::
