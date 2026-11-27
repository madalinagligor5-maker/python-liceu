# Modulul P11.3 — Pregătire Python liceu

**Vârsta țintă:** 11 ani | Capitolul: Python pentru copii — 11 ani (clasa a V-a)
**Clasa:** P11 (Python pentru copii, 7–11 ani)

---

### 🔄 P11.3.1 Recapitulare

Felicitări! Ai finalizat întregul curriculum pentru copii. În acest ultim modul, vom face legătura dintre bazele distractive ale programării și algoritmii de nivel liceal.

:::exemplu
## Conectează la cunoștințele anterioare
Conceptele pe care le-ai învățat — variabile, bucle, condiții și structuri de date — stau la baza a tot ce vei studia la informatică în clasele IX-XII!
:::

---

### 💡 P11.3.2 Concept nou și exemplu

La liceu vei lucra mai mult cu date structurate și cu eficiența algoritmilor. Vei scrie algoritmi de sortare, căutare și prelucrare a listelor (vectorilor).

:::exemplu
## Exemplu practic: Prelucrarea notelor
```python
note = [8, 9, 10, 7, 9]
media = sum(note) / len(note)
print(f"Media elevului este: {media}")
```
Folosim funcții încorporate cum ar fi `sum` și `len` pentru a calcula media, tehnici folosite frecvent în problemele de liceu.
:::

---

## Problemă rezolvată pas cu pas

**Enunț.** Avem notele unui elev la informatică. Aflăm media, cea mai mare și cea mai mică notă, câte note de 10 are și ordonăm notele crescător — exact problemele pe care le vei rezolva la liceu.

**Ideea.** Python are funcții gata făcute: `sum`, `len`, `max`, `min`, `sorted`, iar `.count` numără aparițiile. La liceu vei învăța și cum funcționează ele pe dinăuntru.

```python
note = [9, 7, 10, 8, 10, 6]
print("Media:", round(sum(note) / len(note), 2))
print("Maxim:", max(note), "| Minim:", min(note))
print("Note de 10:", note.count(10))
print("Ordonate:", sorted(note))
```
Rezultatul:
```text
Media: 8.33
Maxim: 10 | Minim: 6
Note de 10: 2
Ordonate: [6, 7, 8, 9, 10, 10]
```

:::atentie
## Greșeli frecvente
- Calculezi media împărțind la un număr scris de mână (ex. 5) în loc de `len(lista)`: dacă lista se schimbă, media e greșită.
- Cauți maximul pornind de la 0 într-o listă cu numere negative.
- Modifici o listă în timp ce o parcurgi cu `for`: pot fi sărite elemente. Construiește o listă nouă.
:::

### 🔮 P11.3.3 Citește și prezice

Uită-te la codul de mai jos și prezice ce se afișează:

```python
numere = [1, 2, 3]
numere.append(4)
print(numere)
```

Ce va afișa calculatorul?

:::atentie
## Atenție
Fii organizat în scrierea codului! Un cod curat și bine comentat este mult mai ușor de corectat la școală sau la concursuri.
:::

---

### 🤝 P11.3.4 Exerciții ghidate

**Exercițiul 1.** Găsește elementul maxim dintr-o listă.

---


Completează spațiile punctate pentru a finaliza algoritmul:

```python
note = [8, 9, 10, 7]

media = ___(note) / ___(note)
print(f"Media elevului este: {media}")
```


### 🎯 P11.3.5 Exerciții independente

**Exercițiul 1.** Calculează suma notelor dintr-o listă.

---

### ✅ P11.3.6 Verifică-ți înțelegerea

1. Ce face funcția sum() aplicată unei liste?
   a) Numără elementele  b) **Calculează suma tuturor elementelor**  c) Găsește cel mai mare element
      > sum() adună toate valorile dintr-o listă, așa cum se vede în exemplul cu notele elevului, unde sum(note) calculează totalul notelor înainte de a-l împărți la numărul lor.

2. Care dintre următoarele este un concept studiat și la copii și la liceu?
   a) Doar print  b) **Variabile, bucle for/while și structuri decizionale**  c) Doar desenele cu țestoase
      > Variabilele, buclele for/while și structurile decizionale sunt exact acele baze învățate în anii de Python pentru copii pe care le vei regăsi și la algoritmii de liceu, cum spune lecția.

3. De ce este important să comentăm codul?
   a) Ca să meargă mai repede  b) **Ca să fie mai ușor de înțeles și de corectat**  c) Nu este recomandat să comentăm
      > Un cod comentat și organizat este mai ușor de citit, de înțeles și de corectat, fie la teme, fie la concursuri, exact cum recomandă lecția în caseta de atenție.

4. Ce afișează `print(sorted([3, 1, 2]))`?
   a) [3, 1, 2]  b) **[1, 2, 3]**  c) [3, 2, 1]
      > `sorted` întoarce o listă nouă, ordonată crescător.

5. Ce afișează `print([5, 2, 5].count(5))`?
   a) 1  b) **2**  c) 5
      > `count` numără de câte ori apare valoarea 5.

:::verifica-cod
Afișează cea mai mică valoare din lista de timpi ai unei curse, folosind o funcție gata făcută.
template: timpi = [12.5, 11.8, 13.1, 12.0]
print(___)
output: 11.8
:::
