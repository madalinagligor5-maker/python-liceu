"""Verificari structurale pentru migrarea SQL.

NU inlocuieste rularea pe o baza Postgres reala (nu exista psql/docker in acest
mediu). Prinde insa clasele de greseli care ar face migrarea sa cada la Run:
$$ nebalansati, dependente in ordine gresita, statement-uri ne-idempotente si
capcana logica a trigger-ului de protectie.
"""
import pathlib
import re
import sys

base = pathlib.Path(__file__).parent
erori: list[str] = []
info: list[str] = []

for nume in ("schema.sql", "migrare-progresie.sql"):
    text = (base / nume).read_text(encoding="utf-8")

    # 1) corpuri de functii inchise corect
    if text.count("$$") % 2 != 0:
        erori.append(f"{nume}: numar impar de $$ ({text.count('$$')})")

    # 2) fiecare begin de plpgsql are end; (ignoram "end if"/"end loop")
    corpuri = re.findall(r"\$\$(.*?)\$\$", text, flags=re.S)
    for i, c in enumerate(corpuri):
        nb = len(re.findall(r"\bbegin\b", c))
        ne = len(re.findall(r"\bend\s*;", c))
        if nb != ne:
            erori.append(f"{nume}: corp #{i+1} are {nb} begin vs {ne} 'end;'")

    # 3) ordinea dependentelor: nivel_din_xp definita inainte de apel
    i_def = text.find("function public.nivel_din_xp")
    i_apel = text.find("public.nivel_din_xp(xp_total)")
    if i_def != -1 and i_apel != -1 and i_def > i_apel:
        erori.append(f"{nume}: nivel_din_xp apelata inainte de definire")

    # 4) trigger-ul nu se poate baza doar pe auth.role(): ar bloca XP-ul legitim,
    #    fiindca auth.role() ramane 'authenticated' si in security definer.
    if "protejeaza_coloane_sensibile" in text and "app.scriere_progres" not in text:
        erori.append(f"{nume}: trigger fara flag de sesiune -> blocheaza XP legitim")

    # 5) idempotenta: orice create policy are drop policy corespunzator
    for pol in re.findall(r'create policy "([^"]+)"', text):
        if f'drop policy if exists "{pol}"' not in text and nume == "migrare-progresie.sql":
            erori.append(f"{nume}: politica {pol!r} nu e idempotenta (lipsa drop)")

    # 6) coloanele noi folosite de aplicatie exista in migrare
    if nume == "migrare-progresie.sql":
        for col in ("xp_total", "streak_zile", "ultima_activitate", "clasa"):
            if f"add column if not exists {col}" not in text:
                erori.append(f"{nume}: lipseste coloana {col}")
        for tab in ("insigne_utilizator", "provocari_zilnice"):
            if f"create table if not exists public.{tab}" not in text:
                erori.append(f"{nume}: lipseste tabela {tab}")
        if "grant execute on function public.finalizeaza_lectie" not in text:
            erori.append(f"{nume}: RPC-ul nu are grant pentru authenticated")

    info.append(f"{nume}: {len(corpuri)} corpuri de functii, {text.count(';')} statement-uri")

for i in info:
    print(i)

if erori:
    print("\nPROBLEME:")
    for e in erori:
        print(" -", e)
    sys.exit(1)

print("\nToate verificarile structurale au trecut.")
print("ATENTIE: nevalidat pe Postgres real - rularea in Supabase SQL Editor ramane necesara.")
