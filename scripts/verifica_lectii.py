#!/usr/bin/env python3
"""Verifică lecțiile de școală (content/lectii_*.md): gimnaziu, liceu IX–XII, Python pentru copii.

Pentru fiecare modul:
  1. exemplele ```python complete rulează fără erori (cele care cer `input()`, au
     `___` de completat sau folosesc biblioteci grafice/absente sunt sărite), iar
     rezultatele scrise în text („Rezultatul: `...`” sau „Rezultatul:” + bloc
     ```text) sunt exact ce afișează codul;
  2. :::verifica-cod — nu se repetă același enunț în mai multe module, iar
     soluția de referință (scripts/lectii/solutii.json, cheia = codul modulului)
     produce exact `output:`;
  3. exercițiile de cod din content/exercitii.json care au soluție de referință
     în solutii.json (cheia = id-ul exercițiului) produc exact expectedOutput.

  4. exercițiile practice din scripts/lectii/practice.json — soluția produce
     exact expectedOutput; cu --scrie, ele sunt copiate fără soluții în
     content/exercitii-practice.json.

Rulare: python3 scripts/verifica_lectii.py [--scrie]
"""
import importlib.util
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

RADACINA = Path(__file__).resolve().parent.parent
_spec = importlib.util.spec_from_file_location("vcp", RADACINA / "scripts" / "verifica_curs_practic.py")
vcp = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(vcp)

SOLUTII = RADACINA / "scripts" / "lectii" / "solutii.json"
# Exercițiile practice (pagina /exercitii/<clasa>/<modul>), cu soluții; --scrie
# le copiază fără soluții în content/exercitii-practice.json, citit de site.
PRACTICE = RADACINA / "scripts" / "lectii" / "practice.json"
PRACTICE_SITE = RADACINA / "content" / "exercitii-practice.json"
# Exemple care nu pot rula aici: ferestre grafice sau citire de la tastatură.
SARITE = re.compile(r"input\(|___|(?<![\w])__(?![\w])|import turtle|from turtle|tkinter|Tk\(\)|\.mainloop\(")


def verifica_rezultat(cod: str, cod_ex: str, iesire: str, dupa: str, urmeaza: str) -> None:
    """Compară ce afișează exemplul cu „Rezultatul:” scris imediat după el."""
    linii = iesire.rstrip("\n").split("\n")
    if re.fullmatch(r"\s*Rezultatul( afișat)?:\s*", dupa):
        bloc = re.match(r"\n```text\n(.*?)\n?```", urmeaza, re.S)
        if bloc and bloc.group(1).split("\n") != linii:
            vcp.erori.append(f"{cod}: blocul de rezultat spune {bloc.group(1).splitlines()}, codul afișează {linii}\n{cod_ex}")
        return
    rezultat = re.match(r"\s*Rezultatul:\s*(.+?)(?:\n\n|\Z)", dupa, re.S)
    if rezultat:
        valori = re.findall(r"`([^`]*)`", vcp.prima_propozitie(rezultat.group(1)))
        if valori and valori != linii:
            vcp.erori.append(f"{cod}: textul spune {valori}, codul afișează {linii}\n{cod_ex}")


def main() -> int:
    solutii = json.loads(SOLUTII.read_text(encoding="utf-8")) if SOLUTII.exists() else {}
    exercitii = json.loads((RADACINA / "content" / "exercitii.json").read_text(encoding="utf-8"))
    enunturi: dict[str, list[str]] = defaultdict(list)
    nr_exemple = nr_sarite = nr_verifica = 0

    for fisier in sorted((RADACINA / "content").glob("lectii_*.md")):
        md = fisier.read_text(encoding="utf-8")
        module = re.split(r"^# Modulul (\S+) — .*$", md, flags=re.M)
        for cod, corp in zip(module[1::2], module[2::2]):
            anterioare: list[str] = []  # exemplele de dinainte: unele continuă codul lor
            # Exemplele: aceeași regulă ca la Cursul practic, dar sărim ce nu poate rula aici.
            for m in re.finditer(r"```python\n(.*?)```\n(.*?)(?=\n```|\Z)", corp, re.S):
                cod_ex = m.group(1)
                if SARITE.search(cod_ex):
                    nr_sarite += 1
                    continue
                try:
                    try:
                        iesire = vcp.ruleaza(cod_ex)
                    except NameError:
                        # Fragment care folosește o funcție sau o clasă definită într-un
                        # exemplu anterior din același modul: îl rulăm împreună cu ele și
                        # păstrăm doar ce afișează fragmentul.
                        inainte = vcp.ruleaza("\n".join(anterioare))
                        iesire = vcp.ruleaza("\n".join(anterioare) + "\n" + cod_ex)[len(inainte):]
                except ModuleNotFoundError:
                    nr_sarite += 1
                    continue
                except Exception as e:  # noqa: BLE001 — orice eroare e o greșeală în lecție
                    vcp.erori.append(f"{cod}: exemplul dă {type(e).__name__}: {e}\n{cod_ex}")
                    continue
                nr_exemple += 1
                anterioare.append(cod_ex)
                verifica_rezultat(cod, cod_ex, iesire, m.group(2), corp[m.end():])

            for bloc in re.findall(r":::verifica-cod\n(.*?)\n:::", corp, re.S):
                enunt = bloc.split("template:")[0].strip()
                enunturi[enunt].append(cod)
                output = re.search(r"^output:\s*(.*)$", bloc, re.M | re.S)
                solutie = solutii.get(cod)
                if solutie and output:
                    nr_verifica += 1
                    obtinut = vcp.ruleaza(solutie)
                    if vcp.normalizeaza(obtinut) != vcp.normalizeaza(output.group(1)):
                        vcp.erori.append(f"{cod}: :::verifica-cod așteaptă {output.group(1)!r}, soluția dă {obtinut!r}")

    for enunt, coduri in enunturi.items():
        if len(coduri) > 1:
            vcp.erori.append(f"același :::verifica-cod în {len(coduri)} module ({', '.join(coduri)}): {enunt[:70]}…")

    nr_ex = 0
    for lista in exercitii.values():
        for ex in lista:
            solutie = solutii.get(ex.get("id", ""))
            if not solutie or ex.get("tip") != "cod":
                continue
            nr_ex += 1
            try:
                obtinut = vcp.ruleaza(solutie)
            except Exception as e:  # noqa: BLE001
                vcp.erori.append(f"{ex['id']}: soluția dă {type(e).__name__}: {e}")
                continue
            if vcp.normalizeaza(obtinut) != vcp.normalizeaza(ex["expectedOutput"]):
                vcp.erori.append(f"{ex['id']}: așteptat {ex['expectedOutput']!r}, soluția dă {obtinut!r}")

    practice = json.loads(PRACTICE.read_text(encoding="utf-8")) if PRACTICE.exists() else {}
    nr_practice = 0
    for cod, lista in practice.items():
        for i, ex in enumerate(lista, 1):
            nr_practice += 1
            try:
                obtinut = vcp.ruleaza(ex["solutie"])
            except Exception as e:  # noqa: BLE001
                vcp.erori.append(f"practice {cod} #{i}: soluția dă {type(e).__name__}: {e}")
                continue
            if vcp.normalizeaza(obtinut) != vcp.normalizeaza(ex["expectedOutput"]):
                vcp.erori.append(f"practice {cod} #{i}: așteptat {ex['expectedOutput']!r}, soluția dă {obtinut!r}")

    print(f"{nr_practice} exerciții practice verificate")
    # Se scriu doar dacă toate exercițiile practice sunt corecte (independent de
    # celelalte verificări), ca site-ul să nu primească un exercițiu greșit.
    if "--scrie" in sys.argv and not any(e.startswith("practice ") for e in vcp.erori):
        fara_solutii = {cod: [{k: v for k, v in ex.items() if k != "solutie"} for ex in lista] for cod, lista in practice.items()}
        PRACTICE_SITE.write_text(json.dumps(fara_solutii, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Exercițiile practice au fost scrise în {PRACTICE_SITE.relative_to(RADACINA)}")
    print(f"{nr_exemple} exemple rulate ({nr_sarite} sărite), {nr_verifica} :::verifica-cod și {nr_ex} exerciții verificate")
    if vcp.erori:
        print("\nERORI:")
        for e in vcp.erori:
            print(" -", e)
        return 1
    print("Totul e în regulă.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
