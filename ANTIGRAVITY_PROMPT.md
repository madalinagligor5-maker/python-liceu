# Lucru în curs: Integrare Python pentru copii (P7–P11) în Academia Python

## Context proiect
- **Repo:** `C:\Users\Mada\Desktop\site web python` (Next.js 16.3.1 + Tailwind v4 + TS, nume npm `python-liceu`)
- **Build:** `npm run build` trece curat (exit 0), 49 de pagini statice generate.
- **Hosting:** Vercel — `https://python-liceu.vercel.app`
- **GitHub:** `https://github.com/madalinagligor5-maker/python-liceu` (remote `origin`, branch `main`)
- **Discuții anterioare:** userul comunică în română; vrea rezultate concrete; nu plătește instrumente; verifică pe producție.

## Ce se cere
Integrarea curricularului **„Python pentru copii”** (vârste 7–11 ani), adaptat din două PDF-uri de bază:
- `C:\Users\Mada\Downloads\teach_your-kids-to-code-a-parent-friendly-guide-to-python-programming__2015_.pdf`
- `C:\Users\Mada\Downloads\Python for Kids - A Playful Introduction to Programming [Briggs 2012-12-22].pdf`

Structura ar trebui să aibă:
- **5 capitolule** pe vârste: P7 (7 ani), P8 (8 ani), P9 (9 ani), P10 (10 ani), P11 (11 ani)
- **15 module** (3 per vârstă)
- **90 subexerciții** (6 per modul, formulare fixă)

## Ce e GATA (făcut de mine)

### 1. Structura curricularului — `content/structura_curriculum.json`
Fișierul e complet: 5 capitole, 15 module, 90 subexerciții. Statisticile sunt prezente (`"statistici": { "capitole": 5, "module": 15, "sublectii": 90 }`). Contine câmpuri noi: `virsta`, `descriere`, `clasa` pe Capitol și Modul.

### 2. Tipurile TypeScript — `src/lib/curriculum.ts`
Paches:
- `Structura.statistici` e devenit **optional** (`statistici?: ...`) — tratat cu `?? 0` în UI.
- `Capitol` are câmpuri noi opționale: `descriere?`, `virsta?`.
- `Modul` are câmpuri noi opționale: `virsta?`, `clasa?`.

### 3. Parser Markdown — `src/lib/markdownMini.ts`
Patch: regex-ul de recunoaștere a modulului schimbat de la `/^# Modulul (\d+\.\d+)/` la `/^# Modulul (\S+\.\S+)/` pentru a accepta coduri cu litere (ex. `P7.1`).

### 4. Fișierele de lecții — `content/lectii_P*.md`
Generat de scriptul `scripts/gen_lecții.py` (adică eu l-am scris și run-at). Sunt **15 fișiere**, fiecare cu 6 subexerciții în formă fixă:
```
content/
├── lectii_P7_P7.1.md
├── lectii_P7_P7.2.md
├── lectii_P7_P7.3.md
├── lectii_P8_P8.1.md
├── lectii_P8_P8.2.md
├── lectii_P8_P8.3.md
├── lectii_P9_P9.1.md
├── lectii_P9_P9.2.md
├── lectii_P9_P9.3.md
├── lectii_P10_P10.1.md
├── lectii_P10_P10.2.md
├── lectii_P10_P10.3.md
├── lectii_P11_P11.1.md
├── lectii_P11_P11.2.md
└── lectii_P11_P11.3.md
```

Fiecare fișier are scaffold-ul 6 subexerciții cu placeholder-uri (conținut generic, nu adaptat din PDF-uri). Exemplu structură:
- `### 🔄 P7.1.1 Recapitulare` → placeholder
- `### 💡 P7.1.2 Concept nou și exemplu` → placeholder
- `### 🔮 P7.1.3 Citește și prezice` → placeholder (bloc code Python)
- `### 🤝 P7.1.4 Exerciții ghidate` → placeholder
- `### 🧠 P7.1.5 Exerciții independente` → placeholder
- `### ✅ P7.1.6 Verificare înțelegere` → placeholder

### 5. Listă sublecții — `src/lib/sublectii.ts`
Adăugați toți cei 15 fișiere `lectii_P*` în array-ul `fisiere`.

### 6. Pagină curriculum — `src/app/curriculum/page.tsx`
Tratarea `structura.statistici` optional (`stats?.capitole ?? 0`).

### 7. Build trece — `npm run build`
Exit 0, fără erori de tip.

## Ce RAMÂNE DE FACUT

### Prioritate 1: Conținut real (PLACEHOLDER → MATERIAL)
Cele 15 fișiere `.md` au scaffold-uri cu placeholder-uri, nu conținut real din PDF-uri. Trebuie populate:

**P7 (7 ani) — P7.1, P7.2, P7.3**
- **P7.1 — Ce este Python? Primul program:** `print()`, IDLE, primiți un output. Adaptat din *Teach Your Kids to Code* cap. 1 și *Python for Kids* cap. 1.
- **P7.2 — Pmily Turtle: desene simple:** `import turtle`, `forward()`, `left()`, `right()`, culori. Din *Python for Kids* cap. 2 + *Teach Your Kids to Code* cap. 3.
- **P7.3 — Desene geometrice:** pătrat, triunghi, bucla `for` simplă. Din *Python for Kids* cap. 3 + *Teach Your Kids to Code* cap. 4.

**P8 (8 ani) — P8.1, P8.2, P8.3**
- **P8.1 — Input și conversie:** `input()`, `int()`, `float()`. Din *Python for Kids* cap. 2.
- **P8.2 — Stringuri și manipulare:** `len()`, `upper()`, `lower()`, slicing. Din *Python for Kids* cap. 6.
- **P8.3 — Listă de culori și for simplu:** `for ... in ...`, `range()`, `random.choice()`. Din *Python for Kids* cap. 3 + cap. 7.

**P9 (9 ani) — P9.1, P9.2, P9.3**
- **P9.1 — Bucla `for` în adâncime:** `range()`, `enumerate()`, `zip()`. Din *Python for Kids* cap. 7.
- **P9.2 — Variabile și expresii:** `+=`, `-=`, formate string `f"{...}"`. Din *Python for Kids* cap. 5 + cap. 6.
- **P9.3 — Funcții simple:** `def`, parametri, `return`. Din *Python for Kids* cap. 6.

**P10 (10 ani) — P10.1, P10.2, P10.3**
- **P10.1 — Condiții `if/elif/else`:** operatori de comparație, `in`, `not`. Din *Python for Kids* cap. 6.
- **P10.2 — Bucla `while` și `break/continue`:** Din *Python for Kids* cap. 7 + cap. 9.
- **P10.3 — Funcții mai complexe:** scope, argumente default, `*args/**kwargs` simplificate. Din *Python for Kids* cap. 6 + cap. 10.

**P11 (11 ani) — P11.1, P11.2, P11.3**
- **P11.1 — Clase și obiecte:** `__init__`, metode, `self`, `class`. Din *Python for Kids* cap. 8.
- **P11.2 — Proiect final: jocul Bounce!** tkinter + clase, joc complet. Din *Python for Kids* cap. 13 + cap. 14.
- **P11.3 — Pregătire Python liceu:** legătura cu clasele IX-XII (programe, tipuri, structuri de date). Din *Python for Kids* cap. 10, 11 + capitolele IX-XII existente.

**Reguli de adaptare:**
- Fiecare subexercițiu urmează formatul fix (6 tipuri: Recapitulare, Concept+Exemplu, Citește+Prezice, Exerciții ghidable, Exerciții independente, Verificare).
- Codul e adaptat la vârsta din titlu — pentru P7 e foarte simplu, pentru P11 e joc complet.
- La „Citește și prezice” — codul trebuie să fie rulabil, cu predicție reală posibilă.
- La „Exerciții independente” — întrebări cu răspuns verificabil (nu doar „scrie cod”).
- Nu adăuga text static — fiecare exercițiu e interactiv (elevul scrie, se verifică automat pe platformă).

### Prioritate 2: Statistici în JSON
Din moment ce `structura_curriculum.json` are statisticile, asigură-te că sunt corecte:
```json
"statistici": {
  "capitole": 5,
  "module": 15,
  "sublectii": 90
}
```

### Prioritate 3: Verificare
După ce conținutul e populat, rescrie build-ul și verifică pe Vercel:
```bash
cd "/c/Users/Mada/Desktop/site web python"
npm run build
git add .
git commit -m "Populează 15 module P7–P11 cu conținut din PDF-uri"
git push origin main
```
Verifică pe `https://python-liceu.vercel.app/curriculum/P7` și subrațele că conținutul apare corect (fără placeholder-uri).

## Ceea ce e important de reținut despre proiect
- **Rute curriculu:** `/curriculum` → sumar, `/curriculum/[clasa]` → capitol, `/curriculum/[clasa]/[modulSlug]` → modul, `/curriculum/[clasa]/[modulSlug]/[sublectieCod]` → sublecție.
- **Părți plată:** Stripe + Supabase, rute `/api/checkout`, `/api/portal`, `/api/stripe/webhook`. Nu expune `.env.local` (are credențiale reale).
- **PWA anterioră:** `C:\Users\Mada\starea-mea` — Next.js 16.3.1 + Tailwind v4; build necesită `--webpack` (Turbopack nu suportă win32).
- **PDF-uri de bază:** la `C:\Users\Mada\Downloads\` — `teach_your-kids-to-code...pdf` (10.9 MB) și `Python for Kids...pdf` (13.4 MB).
- **User preferă:** pași mici când e frustrată; verificare reală pe producție; rezultate concrete (nu doar „teorie”); fără instrumente plătite.

## Formatul fișierelor .md (template)
Fiecare fișier de lecție are acest șablon:

```markdown
# Modulul P7.1 — Ce este Python? Primul meu program

**Vârsta țintă:** 7 ani | Capitolul: Python pentru copii — 7 ani (grădiniță / clasa I)
**Clasa:** P7 (Python pentru copii — ages 7-11)

---

### 🔄 P7.1.1 Recapitulare

[conținut: ce știe deja elevul, legat de modul anterior, adaptat la vârsta 7 ani]

:::exemplu
## Conectează la cunoștințele anterioare
[exemplu concret care leagă de ceea ce a văzut în modulul anterior]
:::

---

### 💡 P7.1.2 Concept nou și exemplu

[conținut: ce e conceptul nou, explicat pas cu pas, adaptat la vârsta 7 ani]

:::exemplu
## Exemplu practic: [nume concept]
[exemplu clar, pas cu pas, adaptat la vârsta 7 ani]
:::

---

### 🔮 P7.1.3 Citește și prezice

Uită-te la codul de mai jos, **fără să-l rulezi**, și gândește-te ce va afișa calculatorul:

```python
# Adaptat pentru vârsta 7 ani — lasă spațiu de predicție
print("...")
```

Ce crezi că vei vedea pe ecran? Scrie predicția ta pe o foaie de hârtie, apoi verifică mai departe.

:::atentie
## Atenție — ceva de reținut la vârsta 7 ani
[Hint suplimentar, doar dacă e necesar]
:::

---

### 🤝 P7.1.4 Exerciții ghidate

**Exercițiul 1.** [enunț concret cu răspuns verificabil]

**Exercițiul 2.** [enunț concret]

**Exercițiul 3.** [enunț concret]

---

### 🧠 P7.1.5 Exerciții independente

**Exercițiul 1.** [enunț fără ghidaj — elevul rezolvă singur]

**Exercițiul 2.** [enunț]

**Exercițiul 3.** [enunț]

---

### ✅ P7.1.6 Verificare înțelegere

[3 întrebări cu răspuns scurt verificabil, adaptate la vârsta 7 ani]
```

## Link-uri de verificare (după push pe Vercel)
| Ce vrei să vezi | Adresă |
|---|---|
| Sumar curriculum | `https://python-liceu.vercel.app/curriculum` |
| Capitol P7 (7 ani) | `https://python-liceu.vercel.app/curriculum/P7` |
| Modul P7.1 | `https://python-liceu.vercel.app/curriculum/P7/ce-este-python-primul-meu-program` |
| Sublecție P7.1.1 | `https://python-liceu.vercel.app/curriculum/P7/ce-este-python-primul-meu-program/P7.1.1` |
| Despre / înregistrare | `https://python-liceu.vercel.app/despre` |
| Prețuri | `https://python-liceu.vercel.app/preturi` |
