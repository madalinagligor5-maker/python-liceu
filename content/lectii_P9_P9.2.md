# Modulul P9.2 — Variabile și expresii

**Vârsta țintă:** 9 ani | Capitolul: Python pentru copii — 9 ani (clasa a III-a)
**Clasa:** P9 (Python pentru copii, 7–11 ani)

---

### 🔄 P9.2.1 Recapitulare

Fiecare variabilă din programul nostru păstrează o valoare pe care o putem modifica pe parcurs. Acum vom vedea cum putem modifica variabilele mai rapid și cum să formatăm textele.

:::exemplu
## Conectează la cunoștințele anterioare
Am folosit `scor = scor + 5`. Python are o modalitate mai scurtă de a scrie acest lucru: `scor += 5`.
:::

---

### 💡 P9.2.2 Concept nou și exemplu

Operatorul **+=** adaugă o valoare la o variabilă existentă. De asemenea, putem folosi **f-string-uri** (stringuri formatate cu caracterul f la început: **f"Scor: {scor}"**) pentru a insera variabile direct în text.

:::exemplu
## Exemplu practic: Actualizarea scorului
```python
scor = 10
scor += 5
nume = "Pippy"
print(f"Jucătorul {nume} are scorul {scor}")
```
Acest cod adaugă 5 la scor și folosește f-string-ul pentru a scrie 'Jucătorul Pippy are scorul 15'.
:::

---

## Problemă rezolvată pas cu pas

**Enunț.** Un joc dă 10 puncte pentru fiecare stea strânsă și scade 3 puncte la fiecare greșeală. Pippy strânge 4 stele și face 2 greșeli. Afișăm scorul după fiecare pas și la final.

**Ideea.** Pornim de la 0 și folosim `+=` și `-=` ca să modificăm scorul. Un f-string pune valoarea scorului direct în mesaj.

```python
scor = 0
for stea in range(4):
    scor += 10
print(f"După stele: {scor}")
for greseala in range(2):
    scor -= 3
print(f"Scor final: {scor} puncte")
```
Rezultatul:
```text
După stele: 40
Scor final: 34 puncte
```

:::atentie
## Greșeli frecvente
- Uiți litera `f` în fața ghilimelelor: se afișează chiar `{scor}`, nu valoarea.
- Scrii `scor =+ 5` în loc de `scor += 5`: `=+ 5` pune scorul la 5.
- Folosești o variabilă în `+=` înainte să-i dai o valoare de pornire: `NameError`.
:::

### 🔮 P9.2.3 Citește și prezice

Uită-te la codul de mai jos și ghicește rezultatul:

```python
nume = "Pippy"
mesaj = f"Salut, {nume}!"
print(mesaj)
```

Ce se va afișa?

:::atentie
## Atenție
F-string-urile funcționează doar dacă pui litera 'f' chiar înainte de ghilimelele de început!
:::

---

### 🤝 P9.2.4 Exerciții ghidate

**Exercițiul 1.** Adună 5 la variabila scor folosind operatorul += și afișează scorul.

---


Completează spațiile punctate pentru a finaliza algoritmul:

```python
scor = 10
scor ___ 5   # adaugă 5 la scor folosind operatorul scurt

print(f"Scorul este {___}")
```


### 🎯 P9.2.5 Exerciții independente

**Exercițiul 1.** Folosește un f-string pentru a afișa 'Scor: 20' din variabila scor = 20.

---

### ✅ P9.2.6 Verifică-ți înțelegerea

1. Ce face operatorul +=?
   a) Scade valoarea  b) **Adaugă o valoare la variabilă**  c) Șterge variabila
      > Operatorul += este o prescurtare prin care Python adună o valoare la variabilă, ca și cum ai scrie scor = scor + 5.

2. Cum marcăm un f-string în Python?
   a) Punem f la sfârșit  b) **Punem litera f la începutul ghilimelelor**  c) Îl scriem cu litere mari
      > Ca Python să știe că vrei un f-string, trebuie să pui litera f exact înainte de ghilimele, altfel textul dintre acolade nu se mai calculează.

3. Ce se pune între acolade {} într-un f-string?
   a) Comentarii  b) **Variabile sau expresii Python**  c) Litere mari
      > Între acolade {} punem o variabilă sau o mică expresie Python, iar rezultatul ei apare direct în text.

4. După `x = 7` și `x += 3`, cât e `x`?
   a) 3  b) **10**  c) 73
      > `x += 3` înseamnă `x = x + 3`.

5. Ce afișează `nume = "Ia"` / `print(f"Hei, {nume}!")`?
   a) Hei, {nume}!  b) **Hei, Ia!**  c) Hei, nume!
      > f-string-ul înlocuiește `{nume}` cu valoarea variabilei.

:::verifica-cod
Pippy are 3 vieți și mai câștigă 2. Folosește `+=` și un f-string ca să afișezi „Vieți: 5”.
template: vieti = 3
vieti ___ 2
print(f"Vieți: {vieti}")
output: Vieți: 5
:::
