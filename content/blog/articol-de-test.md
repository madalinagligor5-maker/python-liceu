---
titlu: Articol de test — șterge după verificare
slug: articol-de-test
data: 2026-08-29
descriere: Articol folosit doar ca să dovedească faptul că pipeline-ul de blog (fișier .md → listă → pagină proprie) funcționează de la un capăt la altul.
---

Acesta e un **articol de test**, nu un articol real de blog. A fost creat doar ca să confirme că pipeline-ul complet funcționează: un fișier `.md` nou din `content/blog/` ajunge automat în lista de pe `/blog` și la adresa lui proprie, fără nicio modificare de cod.

## De ce există acest fișier

Ca să testăm elementele de bază pe care trebuie să le suporte randarea unui articol adevărat:

- listă neordonată, cu **bold** și *italic* în interiorul unui element;
- un link către [pagina de curriculum](/curriculum);
- un bloc de cod, la fel ca în restul platformei.

Și o listă numerotată:

1. Se scrie fișierul `.md` în `content/blog/`.
2. Se repornește (sau reîncarcă) serverul de dezvoltare.
3. Articolul apare automat pe `/blog` și pe `/blog/articol-de-test`.

### Un exemplu de cod

```python
print("Dacă vezi acest bloc formatat corect, randarea Markdown funcționează.")
```

Acest articol trebuie șters (sau înlocuit cu conținutul real, verificat, despre schimbarea de programă la Bacalaureat) înainte ca site-ul să fie considerat gata de publicare.
