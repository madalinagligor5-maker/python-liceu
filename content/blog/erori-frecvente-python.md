---
titlu: Erori frecvente în Python și cum le repari (SyntaxError, IndentationError, NameError și altele)
titlu_seo: Erori frecvente în Python și cum le repari
slug: erori-frecvente-python
data: 2026-10-12
descriere: Cum citești un mesaj de eroare Python și cum repari SyntaxError, IndentationError, NameError, TypeError, ValueError, IndexError și ZeroDivisionError.
---

Un mesaj de eroare în Python nu înseamnă că ai stricat ceva: Python îți spune **ce** nu a înțeles și **unde**. Citește întâi ultima linie a mesajului — conține tipul erorii, de exemplu `NameError` — apoi caută numărul liniei, scris ca `line 3`. Mai jos găsești cele mai frecvente erori ale începătorilor, cu exemple și soluția pentru fiecare.

## Cum citești un mesaj de eroare

```text
Traceback (most recent call last):
  File "main.py", line 3, in <module>
    print(medie)
NameError: name 'medie' is not defined. Did you mean: 'media'?
```

- `line 3` — linia unde s-a oprit programul;
- `print(medie)` — instrucțiunea care a produs eroarea;
- `NameError` — tipul erorii;
- textul de după — explicația. Versiunile recente de Python îți sugerează chiar și numele corect.

Uneori greșeala reală este pe linia **dinainte**, mai ales la paranteze sau ghilimele neînchise. Dacă linia indicată pare corectă, uită-te și deasupra ei.

## SyntaxError: Python nu poate citi codul

Apare când codul nu respectă regulile de scriere ale limbajului. Programul nici nu pornește.

```python
if nota >= 5
    print("Promovat")
```

Lipsesc cele două puncte de după condiție. Forma corectă este `if nota >= 5:`.

Cauze des întâlnite:

- lipsesc `:` după `if`, `elif`, `else`, `for`, `while` sau `def`;
- paranteze sau ghilimele neînchise: `print("Salut)`;
- `=` în loc de `==` într-o condiție: `if x = 3:`;
- cuvinte cheie scrise greșit: `esle` în loc de `else`.

## IndentationError: retragere greșită

În Python, retragerea (indentarea) arată ce instrucțiuni aparțin unui bloc. Dacă lipsește sau e inconsecventă, apare `IndentationError`.

```python
for i in range(3):
print(i)
```

Linia `print(i)` trebuie retrasă cu 4 spații sub `for`. Folosește mereu **același** număr de spații într-un bloc și nu amesteca taburi cu spații. În editorul de pe Academia Python, tasta Tab adaugă direct 4 spații.

## NameError: un nume necunoscut

Folosești o variabilă sau o funcție pe care Python nu o cunoaște.

```python
media = 9
print(Media)
```

Python face diferența între litere mari și mici: `Media` și `media` sunt nume diferite. Alte cauze frecvente:

- folosești variabila **înainte** să-i dai o valoare;
- ai scris greșit numele unei funcții: `pirnt` în loc de `print`;
- ai uitat ghilimelele la un text: `print(Salut)` caută o variabilă numită `Salut`.

## TypeError: tipuri care nu se potrivesc

```python
varsta = 15
print("Am " + varsta + " ani")
```

Nu poți aduna text cu un număr. Soluții: `print("Am", varsta, "ani")`, `print("Am " + str(varsta) + " ani")` sau un f-string, `print(f"Am {varsta} ani")`.

Aceeași eroare apare când faci calcule cu rezultatul lui `input()`, care este mereu text:

```python
an = input("Anul nașterii: ")
print(2026 - an)
```

Convertește valoarea citită: `an = int(input("Anul nașterii: "))`. Detalii în [ghidul despre variabile și tipuri de date](/blog/variabile-in-python).

## ValueError: valoare nepotrivită

Tipul e corect, dar valoarea nu poate fi folosită. Cel mai des, la conversii:

```python
numar = int("doisprezece")
```

`int()` poate converti doar text care arată ca un număr întreg, de exemplu `"12"`. Atenție și la `int("7.5")`, care tot dă `ValueError`: pentru zecimale folosește `float("7.5")`.

## IndexError: poziție care nu există

```python
note = [9, 7, 10]
print(note[3])
```

Lista are 3 elemente, pe pozițiile 0, 1 și 2. Poziția 3 nu există. Ultimul element este `note[-1]` sau `note[len(note) - 1]`. Vezi [ghidul despre liste](/blog/liste-in-python).

## ZeroDivisionError: împărțire la zero

```python
note = []
media = sum(note) / len(note)
```

Lista e goală, deci `len(note)` este 0. Verifică înainte de a împărți:

```python
note = []
if len(note) > 0:
    print(sum(note) / len(note))
else:
    print("Nu există note.")
```

Programul afișează `Nu există note.`.

## Când programul nu dă eroare, dar rezultatul e greșit

Cele mai greu de găsit sunt **erorile de logică**: programul rulează fără mesaj, dar răspunsul nu e cel bun.

```python
nota1 = 8
nota2 = 10
media = nota1 + nota2 / 2
print(media)
```

Programul afișează `13.0`, nu `9.0`. Împărțirea se face înaintea adunării, așa că trebuie paranteze: `(nota1 + nota2) / 2`.

Erorile de logică le găsești prin **testare**: alegi câteva date pentru care știi răspunsul (8 și 10 → 9; 5 și 5 → 5; 7 și 8 → 7,5) și compari cu ce afișează programul.

## Bucla care nu se mai oprește

O buclă `while` a cărei condiție rămâne mereu adevărată rulează la nesfârșit:

```python
i = 1
while i <= 5:
    print(i)
```

Lipsește `i += 1` din interiorul buclei. În editorul Academia Python, execuția se oprește automat după câteva secunde, iar butonul „Oprește” o întrerupe imediat, fără să blocheze pagina.

## Un obicei care te ajută

Când primești o eroare: (1) citește ultima linie, (2) mergi la linia indicată și la cea de deasupra, (3) schimbă un singur lucru, (4) rulează din nou. Mesajele de eroare ale Python sunt foarte precise; cu exercițiu, ajungi să le înțelegi dintr-o privire.

Exersează în [laboratorul Python din browser](/lab): în editorul de acolo, mesajele de eroare au și o explicație în română. Dacă abia începi, vezi și [cum înveți Python de la zero](/blog/cum-inveti-python-de-la-zero).

## Întrebări frecvente

### Ce înseamnă Traceback în Python?

Este raportul pe care Python îl afișează când programul se oprește din cauza unei erori. Arată pașii care au dus la eroare, linia exactă și, la final, tipul erorii cu o explicație.

### De ce primesc IndentationError deși codul pare aliniat?

Cel mai probabil ai amestecat taburi cu spații sau ai un număr diferit de spații în același bloc. Șterge retragerea liniilor afectate și scrie-o din nou, folosind doar spații, de obicei 4.

### Care e diferența dintre SyntaxError și celelalte erori?

`SyntaxError` apare înainte ca programul să pornească, pentru că Python nu poate citi codul. Celelalte erori, precum `NameError` sau `TypeError`, apar în timpul rulării, când se ajunge la linia cu problema.

### Cum îmi dau seama dacă programul e corect, dacă nu dă nicio eroare?

Testează-l cu date pentru care știi dinainte rezultatul și compară. Alege teste variate, inclusiv cazuri-limită, cum ar fi valori egale, zero sau o listă goală.
