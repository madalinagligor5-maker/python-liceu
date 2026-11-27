# Modulul P8.2 — Stringuri și manipulare

**Vârsta țintă:** 8 ani | Capitolul: Python pentru copii — 8 ani (clasa a II-a)
**Clasa:** P8 (Python pentru copii, 7–11 ani)

---

### 🔄 P8.2.1 Recapitulare

Textele în programare sunt numite **stringuri**. Le-am folosit deja în print() și input(). Acum vom vedea cum putem măsura un text sau cum putem accesa litere din el.

:::exemplu
## Conectează la cunoștințele anterioare
Un string este o succesiune de caractere înconjurate de ghilimele simple sau duble.
:::

---

### 💡 P8.2.2 Concept nou și exemplu

Putem afla lungimea unui text folosind funcția **len()**. De asemenea, putem lua prima literă folosind parantezele pătrate **[0]** sau putem transforma textul în litere mari cu **.upper()**.

:::exemplu
## Exemplu practic: Joaca cu literele
```python
mesaj = "Python"
print("Lungime:", len(mesaj))
print("Prima litera:", mesaj[0])
print("Litere mari:", mesaj.upper())
```
Acest program va afișa lungimea 6, prima literă 'P' și textul 'PYTHON'.
:::

---

## Problemă rezolvată pas cu pas

**Enunț.** Vrem un „nume de cod” pentru un spion: prima și ultima literă din nume, cu litere mari, plus lungimea numelui.

**Ideea.** Prima literă e la poziția 0, iar ultima la poziția `len(nume) - 1` (sau, mai simplu, `[-1]`). Le lipim cu `+` și le facem mari cu `.upper()`.

```python
nume = "pippy"
cod_secret = (nume[0] + nume[-1]).upper()
print("Nume de cod:", cod_secret + str(len(nume)))
```
Rezultatul: `Nume de cod: PY5`.

:::atentie
## Greșeli frecvente
- Crezi că prima literă e la poziția 1. În Python numărăm de la 0: `cuvant[0]` e prima literă.
- Ceri o poziție prea mare: „Pippy” are 5 litere, deci ultima e `[4]`; `[5]` dă eroare.
- Uiți parantezele la `.upper`: se scrie `text.upper()`.
:::

### 🔮 P8.2.3 Citește și prezice

Uită-te la codul de mai jos și prezice ce se afișează:

```python
mesaj = "Python"
print(mesaj[0] + mesaj[1])
```

Ce se va afișa pe ecran?

:::atentie
## Atenție
În programare, numărătoarea pozițiilor (indexarea) începe mereu de la 0, nu de la 1!
:::

---

### 🤝 P8.2.4 Exerciții ghidate

**Exercițiul 1.** Afișează lungimea textului 'Pippy'.

---


Completează spațiile punctate pentru a finaliza algoritmul:

```python
mesaj = "Pippy"

# Află lungimea textului și prima literă
lungime = ___(mesaj)
prima_litera = mesaj[___]
print(lungime, prima_litera)
```


### 🎯 P8.2.5 Exerciții independente

**Exercițiul 1.** Convertește textul 'pippy' în litere mari (UPPERCASE) și afișează-l.

---

### ✅ P8.2.6 Verifică-ți înțelegerea

1. Cum aflăm lungimea unui text în Python?
   a) size()  b) **len()**  c) count()
      > Funcția len() numără câte caractere are un text, exact cum am aflat că 'Python' are 6 litere.

2. De la ce număr începe indexarea caracterelor într-un text?
   a) 1  b) **0**  c) -1
      > În Python numărătoarea literelor unui text începe mereu de la 0, nu de la 1, așa cum am reținut la atenție.

3. Ce face metoda .upper()?
   a) Șterge textul  b) **Transformă textul în litere mari**  c) Pune textul la sfârșit
      > Metoda .upper() transformă toate literele textului în litere mari, exact cum 'Python' devine 'PYTHON'.

4. Ce afișează `print("soare"[1])`?
   a) s  b) **o**  c) a
      > Numărăm de la 0: s e la 0, o e la 1.

5. Ce afișează `print(len("ana are"))`?
   a) 6  b) **7**  c) 2
      > Se numără și spațiul: a-n-a-spațiu-a-r-e = 7.

:::verifica-cod
Afișează ultima literă din cuvântul „robot”, folosind poziția -1.
template: cuvant = "robot"
print(cuvant[___])
output: t
:::
