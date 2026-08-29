# Modulul P10.1 — Condiții if/elif/else

**Vârsta țintă:** 10 ani | Capitolul: Python pentru copii — 10 ani (clasa a IV-a)
**Clasa:** P10 (Python pentru copii — ages 7-11)

---

### 🔄 P10.1.1 Recapitulare

Pentru a scrie programe inteligente, calculatorul trebuie să poată lua decizii singur. In acest modul învățăm cum să punem condiții codului nostru.

:::exemplu
## Conectează la cunoștințele anterioare
Folosim blocul `if` pentru a verifica dacă o condiție este adevărată, iar dacă nu este, putem folosi `elif` și `else`.
:::

---

### 💡 P10.1.2 Concept nou si exemplu

Folosim operatori de comparație cum ar fi **==** (egal), **>** (mai mare) sau **<** (mai mic). Putem folosi și **in** pentru a verifica dacă un element se află într-o listă.

:::exemplu
## Exemplu practic: Verificarea accesului
```python
varsta = 10
if varsta >= 12:
    print("Acces permis la filmul 12+")
elif varsta >= 8:
    print("Acces permis la filmul 8+")
else:
    print("Acces doar la desene animate")
```
Codul verifică vârsta și afișează mesajul corespunzător.
:::

---

### 🔮 P10.1.3 Citește și prezice

Uită-te la codul de mai jos și ghicește rezultatul:

```python
punctaj = 85
if punctaj >= 90:
    print("Excelent")
elif punctaj >= 80:
    print("Foarte Bine")
else:
    print("Bine")
```

Ce mesaj se va afișa pe ecran?

:::atentie
## Atenție
Fii atent la semnele de două puncte (:) de la sfârșitul liniilor cu if, elif și else!
:::

---

### 🤝 P10.1.4 Exerciții ghidate

**Exercițiul 1.** Completează condiția pentru a verifica dacă numărul este par.

---


Completează spațiile punctate pentru a finaliza algoritmul:

```python
varsta = 9

___ varsta >= 12:
    print("Acces permis la filmul 12+")
___:
    print("Acces doar la desene animate")
```


### 🎯 P10.1.5 Exerciții independente

**Exercițiul 1.** Verifică dacă culoarea 'rosu' se află în lista ["rosu", "verde"].

---

### ✅ P10.1.6 Verifică-ți înțelegerea

1. Ce operator verifică dacă două valori sunt egale?
   a) =  b) **==**  c) ===
      > Semnul == compară două valori și ne spune dacă sunt egale, spre deosebire de semnul = care doar pune o valoare într-o variabilă.

2. Când se execută instrucțiunea de pe ramura else?
   a) Când condiția if este adevărată  b) **Când toate condițiile anterioare sunt false**  c) Întotdeauna
      > Ramura else se execută abia atunci când niciuna dintre condițiile de la if și elif nu a fost adevărată.

3. Ce operator verifică dacă o valoare se află într-o listă?
   a) has  b) **in**  c) inside
      > Cuvântul in verifică rapid dacă o valoare se găsește printre elementele unei liste, fără să o cauți tu manual.

---

(by @python-pentru-copii — vârstă țintă: 10 ani)
