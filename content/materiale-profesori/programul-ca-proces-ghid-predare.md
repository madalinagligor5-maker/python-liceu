---
titlu: Programul ca proces — 6 etape pentru elevi
slug: programul-ca-proces-ghid-predare
descriere: Un cadru practic de predare pentru clasa a IX-a — analiză, proiectare, implementare, testare, depanare, revizuire — plus tehnici concrete de predicție, depanare și testare, adaptate după reperele metodologice oficiale.
tip: pdf
ciorna: true
---

## De ce contează

Elevii scriu cod mult mai ușor decât gândesc procesul din spatele lui. Acest ghid propune o rutină de 6 etape pe care o poți repeta la fiecare exercițiu mai amplu, ca elevul să nu sară direct la „scriu ceva și văd dacă merge" — sursă, în general, a codului fragil și de neînțeles a doua zi.

## Cele 6 etape și întrebarea din spatele fiecăreia

| Etapă | Întrebarea pe care o pune elevul |
|---|---|
| Analiză | Ce intră, ce trebuie să obțin, ce restricții am? |
| Proiectare | Care sunt pașii și ce structură de date aleg? |
| Implementare | Cum exprim în Python soluția proiectată? |
| Testare | Ce cazuri pot confirma sau infirma corectitudinea? |
| Depanare | Unde apare prima abatere și de ce? |
| Revizuire | Ce schimb pentru claritate sau eficiență? |

Ideea centrală: fiecare etapă are o **întrebare**, nu o „regulă de urmat" — elevul învață să și-o pună singur, nu doar să bifeze pași impuși.

## Predicția înainte de rulare

Rularea imediată a codului poate ascunde faptul că elevul nu are, de fapt, un model mental corect al ce face programul. Înainte de a apăsa Run, cere-i:
- să prezică ieșirea;
- să completeze 2-3 pași într-un tabel de trasare (valorile variabilelor, pas cu pas);
- să spună ce se întâmplă cu lista/structura de date folosită;
- să estimeze câte iterații are o buclă.

După rulare, compară explicit predicția cu rezultatul real — dacă nu coincid, acolo e discuția utilă, nu în cod.

## Depanarea ca metodă de învățare, nu ca pierdere de timp

O eroare arată exact unde modelul mental al elevului diferă de comportamentul real al programului. Clasifică-o cu elevul înainte de a o repara:

| Tip de eroare | Întrebare de diagnostic |
|---|---|
| Sintaxă | Ce regulă de scriere este încălcată? |
| Logică | Care este primul pas în care valoarea devine greșită? |
| Executare | Ce date produc eroarea și de ce? |
| Specificație | Programul rezolvă problema cerută sau doar una asemănătoare? |

Un feedback util, dat des la clasă: *„Nu rescrie programul. Urmărește valorile variabilelor până la prima abatere. Corectează doar acel pas și rulează din nou aceleași teste."* — evită reflexul de a arunca tot codul și a lua totul de la capăt.

## Atelierul de teste — testarea ca și competență, nu ca formalitate

Cere-le elevilor să găsească ei înșiși punctele slabe ale propriului program, nu doar să verifice „merge pe exemplul din enunț":

| Tip de test | Exemplu |
|---|---|
| Caz obișnuit | date care reflectă situația tipică |
| Caz limită | 0, 1, lungime minimă/maximă relevantă |
| Caz advers | date care pun la încercare o presupunere ascunsă |
| Test de regresie | testul care a găsit o eroare rămâne în set după corecție, ca să nu revină |

## Cum îl folosești rapid la oră

1. Dai enunțul — elevii răspund în scris la întrebarea de **Analiză**, înainte să deschidă editorul.
2. Discuție scurtă de **Proiectare** — ce structură de date aleg și de ce (poate fi pe tablă, în pseudocod).
3. **Implementare** individuală în editorul Python al platformei.
4. Înainte de rulare — un minut de **predicție** (măcar verbal, dacă timpul e scurt).
5. **Testare**: cer minimum un caz obișnuit + un caz limită, nu doar exemplul din enunț.
6. Dacă apare eroare — **depanare** ghidată de întrebările de mai sus, nu rescriere din zero.

---

*Adaptat, cu formulare proprie, după Repere metodologice — Informatică, clasa a IX-a, curriculum de specialitate, 2026-2027 (Ministerul Educației și Cercetării — Centrul Național pentru Curriculum și Evaluare), document oficial de sprijin metodologic, nu manual comercial.*
