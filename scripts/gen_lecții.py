#!/usr/bin/env python3
"""Generează fișierele Markdown ale lecțiilor Python pentru copii din structura_curriculum.json."""
import json, os, sys

ROOT = r"C:\Users\Mada\Desktop\site web python"
CONTENT = os.path.join(ROOT, "content")
STRUCTURA = os.path.join(CONTENT, "structura_curriculum.json")

def icoana(tip):
    return {
        "recapitulare": "🔄",
        "concept": "💡",
        "prezice": "🔮",
        "ghidat": "🤝",
        "independent": "🎯",
        "verificare": "✅",
    }[tip]

def gen_recapitulare(sub):
    return f"""### {icoana(sub['tip'])} {sub['cod']} {sub['titlu']}

{sub['descriere']}.

:::exemplu
## Conectează la cunoștințele anterioare
Relatează-le la ceea ce ai deja văzut în modulul anterior. Adaptă exemplele la vârsta și contextul de vârstă din titlul capitolului.
:::
"""

def gen_concept(sub, virsta):
    return f"""### {icoana(sub['tip'])} {sub['cod']} {sub['titlu']}

**Ce e {sub['titlu'].lower()}:** {sub['descriere']}.

:::exemplu
## Exemplu practic: {sub['titlu']}
Ilustrează conceptul cu un exemplu clar și pas cu pas, adaptat la vârsta {virsta} ani.
:::
"""

def gen_prezice(sub, virsta):
    return f"""### {icoana(sub['tip'])} {sub['cod']} {sub['titlu']}

Uită-te la codul de mai jos, **fără să-l rulezi**, și gândește-te ce va afișa calculatorul:

```python
# Adaptat pentru vârsta {virsta} ani — lasă spațiu de predicție
print("..." )
```

Ce crezi că vei vedea pe ecran? Scrie predicția ta pe o foaie de hârtie, apoi verifică mai departe.

:::atentie
## Atenție — ceva de reținut la vârsta {virsta} ani
Hint suplimentar pentru anumiți concepte.
:::
"""

def gen_ghidat(sub, virsta):
    return f"""### {icoana(sub['tip'])} {sub['cod']} {sub['titlu']}

**Exercițiul 1.** Completează codul pentru a rezolva problema:

```python
# Completează partea lipsă:
# ...

# La vârsta {virsta} ani, focus pe înțelegere, nu pe sintaxă complexă
```

*Indiciu: Relatează la exemplul din concept.*
"""

def gen_independent(sub, virsta):
    return f"""### {icoana(sub['tip'])} {sub['cod']} {sub['titlu']}

**Exercițiul 1.** Încearcă singur acest exercițiu — folosește ce-ai învățat în modulul acesta.

**Exercițiul 2.** Mai încearcă unul diferit — creează ceva propriu la vârsta {virsta} ani!
"""

def gen_verificare(sub, virsta):
    return f"""### {icoana(sub['tip'])} {sub['cod']} {sub['titlu']}

1. Întrebare de verificare despre {sub['titlu'].lower()}:
   a) Opțiune 1  b) **Opțiune corectă**  c) Opțiune 3

2. Altă întrebare de verificare:
   a) Opțiune 1  b) **Opțiune corectă**  c) Opțiune 3

3. Mai o întrebare:
   a) **Opțiune corectă**  b) Opțiune 2  c) Opțiune 3

---

(by @python-pentru-copii — vârstă țintă: {virsta} ani)
"""

def gen_subsectie(sub, virsta):
    tip = sub["tip"]
    if tip == "recapitulare":
        return gen_recapitulare(sub)
    elif tip == "concept":
        return gen_concept(sub, virsta)
    elif tip == "prezice":
        return gen_prezice(sub, virsta)
    elif tip == "ghidat":
        return gen_ghidat(sub, virsta)
    elif tip == "independent":
        return gen_independent(sub, virsta)
    elif tip == "verificare":
        return gen_verificare(sub, virsta)
    else:
        raise ValueError(f"Tip necunoscut: {tip}")

def main():
    with open(STRUCTURA, "r", encoding="utf-8") as f:
        data = json.load(f)

    nume_capitole = {}
    for capitol in data["capitole"]:
        nume_capitole[capitol["clasa"]] = capitol["titlu"]

    fisiere_scrise = 0
    for capitol in data["capitole"]:
        clasa = capitol["clasa"]
        virsta = capitol["virsta"]
        numar = capitol["numar"]
        for modul in capitol["module"]:
            cod_modul = modul["cod"]
            titlu_modul = modul["titlu"]
            fisier_nume = f"lectii_{clasa}_{cod_modul}.md"
            cale = os.path.join(CONTENT, fisier_nume)

            lines = [
                f"# Modulul {cod_modul} — {titlu_modul}",
                "",
                f"**Vârsta țintă:** {virsta} ani | Capitolul: {nume_capitole[clasa]}",
                f"**Clasa:** {clasa} (Python pentru copii — ages 7-11)",
                "",
                "---",
                "",
            ]

            for sub in modul["sublectii"]:
                lines.append(gen_subsectie(sub, virsta))
                lines.append("---")
                lines.append("")

            with open(cale, "w", encoding="utf-8") as fout:
                fout.write("\n".join(lines).rstrip() + "\n")

            fisiere_scrise += 1
            print(f"Scris: {fisier_nume}")

    # Statistici
    total_module = sum(len(c["module"]) for c in data["capitole"])
    total_sublectii = sum(
        len(m["sublectii"]) for c in data["capitole"] for m in c["module"]
    )
    stats = {
        "capitole": len(data["capitole"]),
        "module": total_module,
        "sublectii": total_sublectii,
    }
    print(f"\nStatistici: {stats['capitole']} capitole, {stats['module']} module, {stats['sublectii']} subexerciții")
    print(f"Total fisiere scrise: {fisiere_scrise}")

if __name__ == "__main__":
    main()
