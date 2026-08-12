"""Generator pentru structura curriculara (capitole -> module -> sublectii).

Sursa: Structura_lectii_Python_Liceu.md (Ordinul 4.370/2026, Anexele 8-11).
Ruleaza: python scripts/genereaza_structura.py
Scrie:   content/structura_curriculum.json

Sablonul de 6 sublectii este identic la fiecare modul, deci se genereaza,
nu se scrie de mana de 88 de ori.
"""

import json
import pathlib
import re
import unicodedata

SUBLECTII = [
    ("Recapitulare", "Leaga lectia de ce s-a invatat deja."),
    ("Concept nou si exemplu", "Explicatie pas cu pas si un exemplu de cod comentat."),
    ("Citeste si prezice", "Citesti un fragment de cod si anticipezi rezultatul."),
    ("Exercitii ghidate", "Probleme rezolvate partial, cu indicii."),
    ("Exercitii independente", "Probleme de rezolvat singur, fara sprijin."),
    ("Verifica-ti intelegerea", "3-5 intrebari scurte inainte de modulul urmator."),
]

CAPITOLE = [
    {
        "numar": 1,
        "clasa": "IX",
        "titlu": "Fundamentele programarii in Python",
        "module": [
            "Ce este un algoritm? Etapele elaborarii unui program",
            "Reprezentarea algoritmilor: scheme logice, pseudocod, cod",
            "Eficienta unui algoritm - notiuni de baza",
            "Subprograme (functii): definire si apel",
            "Variabile locale si globale, transmiterea prin parametri",
            "Functii predefinite pentru calcule si pentru colectii",
            "Prelucrarea cifrelor unui numar",
            "Divizori, multipli, algoritmul lui Euclid",
            "Conversia numerelor intre baze de numeratie",
            "Ciurul lui Eratostene si exponentiere rapida",
            "Introducere in programarea orientata pe obiecte",
            "tkinter: fereastra principala si widget-uri de baza",
            "tkinter: gestionarea plasarii si a evenimentelor",
            "Fisiere text: deschidere, citire, scriere, inchidere",
            "Modelul conceptual lista: stiva, coada, acces direct/secvential",
            "Clasa list: operatori de baza",
            "Clasa list: metode (căutare, inserare, stergere, sortare)",
            "Generarea sistematica a secventelor de valori",
            "Sortare: selectia minimului",
            "Sortare: metoda bulelor si lista de frecvente",
        ],
    },
    {
        "numar": 2,
        "clasa": "X",
        "titlu": "Structuri de date fundamentale",
        "module": [
            "Cautarea binara",
            "Interclasarea a doua liste ordonate",
            "Modelul conceptual multime",
            "Clasa set: operatori si metode",
            "Modelul conceptual sir de caractere",
            "Clasa str: indexare, slicing, concatenare, comparare",
            "Clasa str: metode de căutare, inlocuire, separare",
            "Criptare simpla: substitutie si cifrul lui Cezar",
            "Cifrul Vigenere",
            "Suma de control (algoritmul lui Fletcher)",
            "Modelul conceptual dictionar",
            "Clasa dict: acces si metode uzuale",
            "Modelul conceptual tuplu",
            "Clasa tuple: operatori si metode",
            "Modelul conceptual mixt (liste de liste, liste de dictionare)",
            "Elemente de limbaj pentru modele mixte",
            "Subprograme recursive",
            "Metoda Divide et impera",
            "Sortare prin interclasare si sortare rapida (quicksort)",
            "Algoritmi de umplere (Flood Fill)",
            "Metoda Greedy",
        ],
    },
    {
        "numar": 3,
        "clasa": "XI",
        "titlu": "Structuri de date complexe si POO",
        "module": [
            "Liste inlantuite: concept si tipuri",
            "Liste inlantuite: operatii de baza (adaugare, eliminare)",
            "Backtracking: principiu si conditii",
            "Backtracking: probleme clasice (permutari, regine)",
            "Backtracking generalizat",
            "Programare dinamica",
            "Modelul conceptual graf: concepte de baza",
            "Reprezentarea grafurilor (matrice, liste de adiacenta)",
            "Tipuri de grafuri (complet, conex, ponderat, hamiltonian, eulerian)",
            "Parcurgerea grafurilor: BFS",
            "Parcurgerea grafurilor: DFS",
            "Matricea drumurilor - algoritmul Roy-Warshall",
            "Drumuri de cost minim - algoritmul lui Dijkstra",
            "Drumuri de cost minim - algoritmul Roy-Floyd",
            "Arbore de acoperire minim - algoritmul lui Prim",
            "Arbore de acoperire minim - algoritmul lui Kruskal",
            "Modelul conceptual arbore: concepte de baza",
            "Arbori binari si arbori binari de căutare",
            "Heap (ansamblu)",
            "Parcurgerea arborilor: preordine, inordine, postordine",
            "Cautare si inserare intr-un arbore binar de căutare",
            "Modelul conceptual obiectual: clase, obiecte, mostenire",
            "POO in Python: sintaxa class si constructorul",
            "POO in Python: niveluri de acces si clase derivate",
            "Paradigme de programare",
        ],
    },
    {
        "numar": 4,
        "clasa": "XII",
        "titlu": "Baze de date si invatare automata",
        "module": [
            "Modelul entitate-relatie: entitati si atribute",
            "Modelul entitate-relatie: relatii si cardinalitate",
            "Diagrama ERD si maparea la modelul fizic",
            "Chei primare, chei externe, constrangeri de integritate",
            "Forme normale: FN1, FN2, FN3",
            "Clasele Connection si Cursor din Python",
            "SQL: interogari SELECT, proiectie, ordonare",
            "SQL: functii agregate si grupare",
            "SQL: JOIN si subinterogari",
            "SQL: DML - inserare, actualizare, stergere",
            "SQL: DDL - creare si modificare a structurii",
            "SQL: DCL si TCL - drepturi si tranzactii",
            "Modele de date pentru invatarea automata",
            "Pregatirea datelor (normalizare, valori lipsa)",
            "Invatare nesupervizata: K-means",
            "Invatare supervizata: regresie liniara",
            "Invatare supervizata: KNN si arbore de decizie",
            "Introducere in retele neuronale",
            "Biblioteca Matplotlib: vizualizarea datelor",
            "Biblioteca Pandas: DataFrame si statistici descriptive",
            "Biblioteca Scikit-learn: antrenare, predictie, evaluare",
            "Biblioteca NumPy: operatii cu matrici",
        ],
    },
]

# Primele module ale clasei a IX-a sunt libere, ca un elev nou sa poata incepe
# fara cont. Restul cer abonament (aceeasi regula ca la lectiile existente).
MODULE_GRATUITE = 3


def slug(text: str) -> str:
    """Slug ASCII, stabil: folosit in URL-uri, deci nu trebuie sa se schimbe."""
    fara_diacritice = "".join(
        c for c in unicodedata.normalize("NFKD", text) if not unicodedata.combining(c)
    )
    s = fara_diacritice.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def main() -> None:
    radacina = pathlib.Path(__file__).resolve().parent.parent
    capitole = []
    total_module = 0
    total_sublectii = 0

    for cap in CAPITOLE:
        module = []
        for i, titlu in enumerate(cap["module"], start=1):
            cod = f"{cap['numar']}.{i}"
            sublectii = [
                {
                    "cod": f"{cod}.{j}",
                    "titlu": t,
                    "descriere": d,
                    "slug": slug(t),
                    "tip": tip,
                }
                for j, ((t, d), tip) in enumerate(
                    zip(
                        SUBLECTII,
                        [
                            "recapitulare",
                            "concept",
                            "prezice",
                            "ghidat",
                            "independent",
                            "verificare",
                        ],
                    ),
                    start=1,
                )
            ]
            module.append(
                {
                    "cod": cod,
                    "numar": i,
                    "titlu": titlu,
                    "slug": slug(titlu),
                    "clasa": cap["clasa"],
                    "gratuit": cap["clasa"] == "IX" and i <= MODULE_GRATUITE,
                    "sublectii": sublectii,
                }
            )
            total_module += 1
            total_sublectii += len(sublectii)

        capitole.append(
            {
                "numar": cap["numar"],
                "clasa": cap["clasa"],
                "titlu": cap["titlu"],
                "slug": slug(cap["titlu"]),
                "module": module,
            }
        )

    date = {
        "sursa": "Ordinul 4.370/2026, Anexele 8-11",
        "sablon_sublectii": [{"titlu": t, "descriere": d} for t, d in SUBLECTII],
        "capitole": capitole,
        "statistici": {
            "capitole": len(capitole),
            "module": total_module,
            "sublectii": total_sublectii,
        },
    }

    iesire = radacina / "content" / "structura_curriculum.json"
    iesire.write_text(
        json.dumps(date, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    print(f"scris {iesire.relative_to(radacina)}")
    print(f"capitole: {len(capitole)} | module: {total_module} | sublectii: {total_sublectii}")

    # verificare de unicitate a slug-urilor in cadrul aceleiasi clase
    for c in capitole:
        sluguri = [m["slug"] for m in c["module"]]
        dubluri = {s for s in sluguri if sluguri.count(s) > 1}
        if dubluri:
            raise SystemExit(f"slug duplicat in clasa {c['clasa']}: {dubluri}")
    print("slug-uri unice: OK")


if __name__ == "__main__":
    main()
