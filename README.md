# Academia Python

Platformă educațională pentru disciplina **Informatică (Python)**, clasele IX-XII și Ciclul Primar (Academia Kids), conform programei oficiale de liceu. Model de acces freemium: primele 5 module din clasa a IX-a și toate lecțiile din Academia Kids sunt 100% gratuite; restul conținutului necesită cont și abonament activ.

---

## 🚀 Stare curentă

Platforma este complet funcțională și lansată pe producție (`python-liceu.vercel.app` / `academiapython.ro`):

### 1. Conținut Didactic & Curriculum
- **618 sublecții reale** organizate pe 6 pași metodologici: `Recapitulare`, `Concept nou și exemplu`, `Citește și prezice`, `Exerciții ghidate`, `Exerciții independente`, `Verifică-ți înțelegerea`.
- Module acoperind clasele **IX, X, XI, XII** (inclusiv modul de Machine Learning & Data Science în XII) și **Academia Kids** (Blockly + Python).

### 2. Rularea Codului Python (Pyodide)
- Execuție reală Python 3.11 direct în browser via WebAssembly (Pyodide), integrată în `src/components/PythonEditor.tsx` și `LaboratorConsolidare.tsx`, fără dependențe de server.

### 3. Gamification & Spaced Repetition (Sistem Leitner)
- Sistem de XP, streak-uri zilnice, nivele dinamice și insigne.
- **Recapitulare Spațiată (Spaced Repetition)**: Algoritm Leitner (3, 7, 21, 45 zile) alimentat de Supabase SQL (`supabase/migrare-recapitulare-spatiata.sql`) pentru consolidarea periodică a conceptele anterioare.

### 4. Evaluare Inteligentă AI (Google Gemini)
- Feedback didactic instantaneu și explicații de sintaxă linie cu linie prin Google Gemini 1.5 Flash (`src/app/actions/ai-evaluation.ts`).
- Limită de 3 evaluări/zi pentru conturile gratuite și 15/zi pentru abonamentele Premium.

### 5. Autentificare & Plăți Stripe
- Autentificare **Supabase Auth** (Email + Parolă, Google OAuth) cu sitemap dinamic, RLS (Row Level Security) pe toate tabelele și sigurețe server-side.
- Integration completă **Stripe** (Checkout, Customer Portal, Webhook automat) cu **Garanție Comercială Necondiționată de Rambursare în 14 Zile** (`/politica-de-rambursare`).

### 6. Pagini Legale & Conformitate ANPC
- Pagini legale complete în limba română (`/termeni-si-conditii`, `/politica-de-confidentialitate`, `/politica-de-rambursare`), cu date de identificare P.F.A., CUI, link-uri oficiale ANPC & SAL / SOL.

---

## 🛠️ Ce Mai e de Făcut (Roadmap Continuu)

- [x] Audit pedagogic automatizat (`node scripts/audit_module.mjs`) pentru verificarea calității conținutului pe 99 de module non-ML.
- [x] Sistem de recapitulare spațiată Leitner pe backend Supabase.
- [x] Teste automate E2E cu Playwright pentru fluxurile critice (`npm run test:e2e`).
- [ ] Extindere teste vizuale de regresiune UI pe mai multe rezoluții de mobil.

---

## 💻 Rulare Locală & Testare

```bash
# Instalare dependențe
npm install

# Rulare server de dezvoltare
npm run dev

# Rulare teste de calitate pedagogică
node scripts/audit_module.mjs

# Rulare teste automate E2E (Playwright)
npm run test:e2e

# Rulare linter & verificare A11y
npm run lint

# Build de producție
npm run build
```

---

## 🔑 Variabile de Mediu (Exemplu `.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://proiectul-tau.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=cheie_anonima
SUPABASE_SERVICE_ROLE_KEY=cheie_service_role

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_LUNAR=price_...
STRIPE_PRICE_ID_ANUAL=price_...

GEMINI_API_KEY=cheie_api_gemini
```

---

## 🌐 Deploy (Vercel)

Proiectul este configurat pentru deploy automat pe Vercel din ramura `main` a repository-ului `github.com/madalinagligor5-maker/python-liceu`.
