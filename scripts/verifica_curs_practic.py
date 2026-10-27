#!/usr/bin/env python3
"""Verifică unitățile noi din „Curs practic de Python” (content/curs-practic-uN.md).

Pentru fiecare unitate care are un fișier scripts/curs-practic/uN.json:
  1. structura: fiecare modul are cele 6 sublecții, cu codurile și iconurile corecte;
  2. exemplele de cod din lecție rulează fără erori, iar rezultatele scrise în text
     („Rezultatul: `...`, apoi `...`.”) sunt exact ce afișează codul;
  3. quiz-urile: fiecare întrebare are exact un răspuns marcat corect și o explicație;
  4. :::verifica-cod — soluția de referință produce exact `output:`;
  5. exercițiile interactive — soluția de referință produce exact expectedOutput.

Cu --scrie, copiază exercițiile (fără soluții) în content/exercitii.json și
adaugă/actualizează unitatea în content/structura_curs.json (titlurile modulelor
se iau din antetele „# Modulul CPx.y — Titlu” din lecție).
Rulare: python3 scripts/verifica_curs_practic.py [--scrie]
"""
import io
import json
import re
import sys
import unicodedata
from contextlib import redirect_stdout
from pathlib import Path

RADACINA = Path(__file__).resolve().parent.parent
DIR_SOLUTII = RADACINA / "scripts" / "curs-practic"
ICONURI = ["🔄", "💡", "🔮", "🤝", "🎯", "✅"]

erori: list[str] = []


def ruleaza(cod: str) -> str:
    """Rulează codul izolat și întoarce ce afișează."""
    tampon = io.StringIO()
    with redirect_stdout(tampon):
        exec(compile(cod, "<lectie>", "exec"), {"__name__": "__main__"})
    return tampon.getvalue()


def slug(text: str) -> str:
    fara_diacritice = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", fara_diacritice.lower()).strip("-")


def unitate_structura(info: dict, titluri: list[tuple[str, str]], sablon: list[dict]) -> dict:
    tipuri = ["recapitulare", "concept", "prezice", "ghidat", "independent", "verificare"]
    module = []
    for i, (cod, titlu) in enumerate(titluri, 1):
        sublectii = [
            {"cod": f"{cod}.{j + 1}", "titlu": s["titlu"], "descriere": s["descriere"],
             "slug": slug(s["titlu"]), "tip": tipuri[j]}
            for j, s in enumerate(sablon)
        ]
        module.append({"cod": cod, "numar": i, "titlu": titlu.replace("`", ""),
                       "slug": slug(titlu), "gratuit": False, "sublectii": sublectii})
    return {**info, "module": module}


def normalizeaza(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def prima_propozitie(text: str) -> str:
    """Textul până la primul punct aflat în afara unui `cod`."""
    in_cod = False
    for i, c in enumerate(text):
        if c == "`":
            in_cod = not in_cod
        elif c == "." and not in_cod:
            return text[:i]
    return text


def verifica_structura(cod_modul: str, corp: str) -> None:
    antete = re.findall(r"^###\s+(\S+)\s+(\S+)\s+(.+)$", corp, re.M)
    asteptat = [(ICONURI[i], f"{cod_modul}.{i + 1}") for i in range(6)]
    gasit = [(icon, cod) for icon, cod, _ in antete]
    if gasit != asteptat:
        erori.append(f"{cod_modul}: sublecții greșite {gasit}")


def verifica_exemple(cod_modul: str, corp: str) -> int:
    """Rulează blocurile ```python complete și compară cu „Rezultatul: …”."""
    n = 0
    for m in re.finditer(r"```python\n(.*?)```\n(.*?)(?=\n```|\Z)", corp, re.S):
        cod, dupa = m.group(1), m.group(2)
        if "___" in cod or "input(" in cod:
            continue
        n += 1
        try:
            iesire = ruleaza(cod)
        except Exception as e:  # noqa: BLE001 — orice eroare e o greșeală în lecție
            erori.append(f"{cod_modul}: exemplul dă {type(e).__name__}: {e}\n{cod}")
            continue
        rezultat = re.match(r"\s*Rezultatul:\s*(.+?)(?:\n\n|\Z)", dupa, re.S)
        if not rezultat:
            continue
        valori = re.findall(r"`([^`]*)`", prima_propozitie(rezultat.group(1)))
        linii = iesire.rstrip("\n").split("\n")
        if valori != linii:
            erori.append(f"{cod_modul}: textul spune {valori}, codul afișează {linii}\n{cod}")
    return n


def verifica_quiz(cod_modul: str, corp: str) -> None:
    sectiune = corp.split(f"{cod_modul}.6", 1)[-1].split(":::verifica-cod")[0]
    intrebari = re.split(r"^\d+\.\s", sectiune, flags=re.M)[1:]
    if len(intrebari) < 3:
        erori.append(f"{cod_modul}: quiz cu doar {len(intrebari)} întrebări")
    for i, q in enumerate(intrebari, 1):
        variante = re.search(r"^\s+a\).*$", q, re.M)
        if not variante:
            erori.append(f"{cod_modul} quiz {i}: fără variante a)/b)/c)")
            continue
        corecte = re.findall(r"[a-d]\)\s*\*\*", variante.group(0))
        if len(corecte) != 1:
            erori.append(f"{cod_modul} quiz {i}: {len(corecte)} răspunsuri marcate corect")
        if not re.search(r"^\s+>\s+\S", q, re.M):
            erori.append(f"{cod_modul} quiz {i}: lipsește explicația")


def verifica_cod_bloc(cod_modul: str, corp: str, solutii: dict) -> None:
    m = re.search(r":::verifica-cod\n(.*?)\n:::", corp, re.S)
    if not m:
        erori.append(f"{cod_modul}: lipsește :::verifica-cod")
        return
    bloc = m.group(1)
    template = re.search(r"^template:\s*(.*?)\n(?=output:)", bloc, re.S | re.M)
    output = re.search(r"^output:\s*(.*)$", bloc, re.M)
    if not template or not output:
        erori.append(f"{cod_modul}: :::verifica-cod fără template/output")
        return
    if "___" not in template.group(1):
        erori.append(f"{cod_modul}: template-ul :::verifica-cod nu are ___ de completat")
    solutie = solutii.get(cod_modul)
    if not solutie:
        erori.append(f"{cod_modul}: lipsește soluția pentru :::verifica-cod")
        return
    obtinut = ruleaza(solutie)
    if normalizeaza(obtinut) != normalizeaza(output.group(1)):
        erori.append(f"{cod_modul}: :::verifica-cod așteaptă {output.group(1)!r}, soluția dă {obtinut!r}")


def verifica_exercitii(exercitii: dict) -> int:
    n = 0
    for cod_sub, lista in exercitii.items():
        for ex in lista:
            n += 1
            try:
                obtinut = ruleaza(ex["solutie"])
            except Exception as e:  # noqa: BLE001
                erori.append(f"{ex['id']}: soluția dă {type(e).__name__}: {e}")
                continue
            if normalizeaza(obtinut) != normalizeaza(ex["expectedOutput"]):
                erori.append(f"{ex['id']}: așteptat {ex['expectedOutput']!r}, soluția dă {obtinut!r}")
            if not ex["id"].startswith(cod_sub + "."):
                erori.append(f"{ex['id']}: id-ul nu corespunde sublecției {cod_sub}")
    return n


def main() -> int:
    scrie = "--scrie" in sys.argv
    toate_exercitiile: dict = {}
    unitati_noi: list[dict] = []
    for fisier_solutii in sorted(DIR_SOLUTII.glob("u*.json")):
        unitate = fisier_solutii.stem  # ex. „u4”
        md = (RADACINA / "content" / f"curs-practic-{unitate}.md").read_text(encoding="utf-8")
        date = json.loads(fisier_solutii.read_text(encoding="utf-8"))
        titluri = re.findall(r"^# Modulul (CP\d+\.\d+) — (.*)$", md, flags=re.M)
        unitati_noi.append((date["unitate"], titluri))
        module = re.split(r"^# Modulul (CP\d+\.\d+) — .*$", md, flags=re.M)
        nr_exemple = 0
        for cod_modul, corp in zip(module[1::2], module[2::2]):
            verifica_structura(cod_modul, corp)
            nr_exemple += verifica_exemple(cod_modul, corp)
            verifica_quiz(cod_modul, corp)
            verifica_cod_bloc(cod_modul, corp, date["verifica_cod"])
        nr_ex = verifica_exercitii(date["exercitii"])
        toate_exercitiile.update(date["exercitii"])
        print(f"{unitate}: {len(module) // 2} module, {nr_exemple} exemple rulate, {nr_ex} exerciții verificate")

    if erori:
        print("\nERORI:")
        for e in erori:
            print(" -", e)
        return 1

    if scrie:
        cale = RADACINA / "content" / "exercitii.json"
        exercitii = json.loads(cale.read_text(encoding="utf-8"))
        for cod_sub, lista in toate_exercitiile.items():
            exercitii[cod_sub] = [{k: v for k, v in ex.items() if k != "solutie"} for ex in lista]
        cale.write_text(json.dumps(exercitii, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Exercițiile au fost scrise în {cale.relative_to(RADACINA)}")

        cale = RADACINA / "content" / "structura_curs.json"
        structura = json.loads(cale.read_text(encoding="utf-8"))
        for info, titluri in unitati_noi:
            noua = unitate_structura(info, titluri, structura["sablon_sublectii"])
            structura["unitati"] = [u for u in structura["unitati"] if u["numar"] != info["numar"]] + [noua]
        structura["unitati"].sort(key=lambda u: u["numar"])
        module_toate = [m for u in structura["unitati"] for m in u["module"]]
        structura["statistici"] = {
            "unitati": len(structura["unitati"]),
            "module": len(module_toate),
            "sublectii": sum(len(m["sublectii"]) for m in module_toate),
        }
        cale.write_text(json.dumps(structura, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Structura cursului a fost actualizată în {cale.relative_to(RADACINA)}")
    print("Totul e în regulă.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
