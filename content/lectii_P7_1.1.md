# Modulul P7.1 — Ce este Python? Primul meu program (7 ani / clasa I)

### 🔄 P7.1.1 Recapitulare

Nu ai încă o lecție anterioară pe platformă — dar oricum folosești calculatorul zilnic: deschizi jocuri, scrii texte, clipești pe pictograme. Ce se întâmplă de fapt în spate? Calculatorul execută serii de instrucțiuni pe care le primește de la tine. Exact asta e programarea: spune calculatorului ce să facă, pas cu pas. Gândește-te: cum „spui" calculatorului să deschidă o aplicație? Sau să afișeze un text pe ecran?

:::exemplu
## Cum „vorbești" cu calculatorul în zilele noastre
- Apasă pe iconiță → calculatorul deschide programul.
- Scrii ceva într-un câmp de text → calculatorul afișează literele pe ecran.
- Apasă butonul „Salvează" → calculatorul păstrează ce ai scris într-un fișier.

Fiecare acțiune e de fapt o comandă pe care calculatorul o înțelege și o execută.
:::

### 💡 P7.1.2 Concept nou și exemplu

**Python** este un limbaj de programare — un mod de a vorbi cu calculatorul într-un limbaj pe care atât o persoană, cât și calculatorul îl înțeleg. Denumirea vine de la show-ul de comedie britanic *Monty Python's Flying Circus* (nu de la python-ul deşteapător — ceea ce face Programarea să fie chiar amuzantă).

**IDLE** este instrumentul pe care îl folosim să scriem și să rulăm codul Python. Oferește două feluri de lucru:
- **Python Shell** (fereastra cu `>>>`) — aici scriem o comandă, apăsăm Enter, și calculatorul răspunde imediat.
- **Editor de programe** — aici scriem programe mai lungi, le salvăm în fișiere `.py` și le rulăm.

:::tip
## Sfaturi & Bune Practici pentru Începători
IDLE este mediul gratuit inclus direct la instalarea limbajului Python. Este cel mai simplu mod de a rula primele tale linii de cod fără nicio configurare complicată!
:::

#### Cum instalăm Python (pași simpli, Windows)

1. Mergi pe [python.org](https://www.python.org/) în browser.
2. La meniul **Downloads**, alege versiunea **Python 3** (cea mai recentă).
3. Descarcă și rulează instalatorul (la Windows, dublu-click pe fișierul descărcat).
4. După instalare, vei găsi iconița **IDLE** în Start Menu sau pe Desktop.

> **Notă:** Dacă Python e deja instalat pe calculatorul familial, mergi direct la pasul 4 — deschide IDLE și hai la treabă!

#### Primul program: „Salut!"

Când deschizi IDLE, vei vedea ceva de felul ăsta:

```
>>>
```

Asta e **prompt-ul** (`>>>`) — calculatorul te întreabă ce vrei să faci. Scrie prima ta comandă:

```python
>>> print("Salut!")
```

Apasă **Enter**. Vei vedea:

```
Salut!
>>>
```

**Ce s-a întâmplat?**
- `print()` e o **funcție** — un comandă specială care afișează ceva pe ecran.
- Ce este înăuntrul parantezelor (`"Salut!"`) se numește **string** — un șir de litere cuprinse între ghilimele.
- Calculatorul a luat comanda, a afișat textul și aşteaptă următoarea comandă (prompt-ul `>>>` a reapărut).

🎉 **Felicitări! Ai scris primul tău program Python!**

### 🔮 P7.1.3 Citește și prezice

Uită-te la următorul program, **fără să-l rulezi**, și gândește-te ce va afișa calculatorul:

```python
print("Ce zici?")
print("Am scris")
print("un program")
print("în Python!")
```

Ce crezi că vei vedea pe ecran? Scrie predicția ta pe o foaie de hârtie sau în notebookul tău, apoi verifică mai departe — chiar pe platformă vei putea rula codul direct.

:::atentie
## Atenție — ghilimelele contează!
- `print(Salut!)` → **eroare** deoarece producătorii de ghilimele lipsesc.
- `print("Salut!")` → **corect** — ghilimelele spune calculatorului că e text, nu o comandă.
- `print('Salut!')` → **de asemenea corect** — se pot folosi și ghilimele simples, dar trebuie să fie de același tip la început și la sfârșit.
:::

### 🤝 P7.1.4 Exerciții ghidate

**Exercițiul 1.** Scrie un program care afișează un mesaj de salut personalizat. Completare codul:

```python
print("Numele meu este ________")
print("Am început să învăț Python!")
```

*Indicii: Înlocuiește ________ cu numele tău, cuprinse între ghilimele.*

### 🎯 P7.1.5 Exerciții independente

**Exercițiul 1.** Scrie un program care afișează 4 rânduri, fiecare cu un mesaj diferit despre tine:
- Un rând cu numele tău.
- Un rând cu vârsta ta.
- Un rând cu ceva pe care o faci pasionat.
- Un rând cu ce vrei să înveți.

### ✅ P7.1.6 Verifică-ți înțelegerea

1. Ce face funcția `print()` în Python?
   a) Salvează un fișier  b) **Afișează ceva pe ecran**  c) Întreabă utilizatorul pentru date

2. De ce trebuie să învelim textul în ghilimele când folosim `print()`?
   a) **Pentru că Python trebuie să știe că e text, nu o comandă**  b) Nu e nevoie de ghilimele  c) Pentru că astfel programul merge mai repede

3. Care este simbolul care aparține întotdeauna după `print` când vrem să afișăm ceva?
   a) Virgula (,)  b) Punctul (.)  c) **Paranteza rotundă: ()**

4. Ce se întâmplă când scriem `print( Salut! )` fără ghilimele?
   a) Programul afișează „Salut!"  b) **Apare o eroare deoarece Python nu înțelege ce e „Salut!" fără ghilimele**
   c) Nimic, programul merge fără probleme

---
