# Modulul P11.1 — Clase și obiecte

**Vârsta țintă:** 11 ani | Capitolul: Python pentru copii — 11 ani (clasa a V-a)
**Clasa:** P11 (Python pentru copii — ages 7-11)

---

### 🔄 P11.1.1 Recapitulare

Până acum am structurat datele în liste sau stringuri. Programarea Orientată pe Obiecte (OOP) ne permite să creăm propriile noastre tipuri de date complexe, modelând obiecte din viața reală.

:::exemplu
## Conectează la cunoștințele anterioare
O clasă este ca o schiță sau o matriță (de exemplu schița unei case), iar obiectul este casa construită după acea schiță.
:::

---

### 💡 P11.1.2 Concept nou si exemplu

Definim o clasă folosind cuvântul cheie **class**. Metoda specială **__init__** inițializează proprietățile noului obiect. Cuvântul cheie **self** se referă la obiectul curent.

:::exemplu
## Exemplu practic: Clasa Jucărie
```python
class Jucarie:
    def __init__(self, nume, culoare):
        self.nume = nume
        self.culoare = culoare

robot = Jucarie("Pippy", "verde")
print(robot.nume)
print(robot.culoare)
```
Acest cod creează un obiect de tip Jucarie numit robot, cu proprietățile nume și culoare.
:::

---

### 🔮 P11.1.3 Citește și prezice

Uită-te la codul de mai jos și prezice ce se întâmplă:

```python
class Animal:
    def __init__(self, nume):
        self.nume = nume

c = Animal("Pippy")
print(c.nume)
```

Ce se va afișa la rulare?

:::atentie
## Atenție
Fiecare funcție definită în interiorul unei clase trebuie să aibă ca prim parametru cuvântul cheie `self`!
:::

---

### 🤝 P11.1.4 Exerciții ghidate

**Exercițiul 1.** Completează clasa Robot pentru a afișa numele robotului.

---


Completează spațiile punctate pentru a finaliza algoritmul:

```python
class Robot:
    def __init__(___, nume):
        ___.nume = nume

r = Robot("Pippy")
print(r.nume)
```


### 🎯 P11.1.5 Exerciții independente

**Exercițiul 1.** Adaugă o metodă saluta în clasa Robot care returnează 'Salut din clasa Robot!'.

---

### ✅ P11.1.6 Verifică-ți înțelegerea

1. Ce este o clasă?
   a) O funcție simplă  b) **O schiță/matriță pentru crearea de obiecte**  c) O listă de numere

2. Cum se numește prima metodă apelată la crearea unui obiect?
   a) __start__  b) **__init__**  c) __new__

3. Ce reprezintă self într-o clasă?
   a) Tipul clasei  b) **Instanța curentă a obiectului**  c) Un parametru opțional

---

(by @python-pentru-copii — vârstă țintă: 11 ani)
