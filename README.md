# PythonLiceu

Platformă educațională pentru disciplina Informatică (Python), clasele IX-XII, conform programei
oficiale de liceu. Model de acces freemium: primele 5 lecții sunt gratuite, fără cont; restul
necesită cont + abonament activ.

## Stare curentă

Implementat:

- Next.js 16 (App Router, TypeScript, Tailwind CSS v4).
- Conținutul lecțiilor citit din [`content/continut_pagina_web.json`](content/continut_pagina_web.json)
  (deocamdată un fișier **placeholder** cu 8 lecții exemplu — vezi mai jos).
- `/` — landing page cu prezentare, ce înveți pe clase, secțiune preț, FAQ.
- `/lectii` — catalog de lecții grupat pe clasă → unitate, cu badge Gratuit / 🔒 Cont.
- `/lectii/[clasa]/[unitateSlug]/[lectieSlug]` — pagina unei lecții:
  - lecțiile `gratuit: true` afișează conținutul integral (explicație, exemplu de cod, exercițiu
    interactiv cu editor + soluție, quiz cu scor);
  - lecțiile `gratuit: false` cer autentificare (redirect la `/login` dacă nu ești logat) și
    abonament activ; fără abonament activ, afișează doar un teaser (primele două fraze) și un
    paywall. Verificarea are loc **server-side**, în componenta de pagină — conținutul complet nu
    este trimis către client decât dacă utilizatorul are efectiv acces.
- Autentificare completă cu **Supabase Auth**: `/login`, `/inregistrare` (email+parolă și Google
  OAuth), `/auth/callback`, sesiune reîmprospătată prin middleware, header dinamic (afișează
  emailul utilizatorului când e logat).
- `/cont` — status abonament, dată reînnoire, buton către Stripe Customer Portal, deconectare.
- **Stripe** integrat: `/preturi` are butoane funcționale de abonare (`/api/stripe/checkout`),
  portal de facturare (`/api/stripe/portal`) și webhook (`/api/stripe/webhook`) care actualizează
  `subscription_status` în Supabase la `checkout.session.completed`,
  `customer.subscription.updated` și `customer.subscription.deleted`.
- Schema bazei de date: [`supabase/schema.sql`](supabase/schema.sql) — tabelele `users_meta` și
  `progres_lectii`, cu RLS (fiecare utilizator vede doar propriul rând) și un trigger care creează
  automat rândul din `users_meta` la înregistrare.

Neimplementat încă:

- Rularea codului Python în browser (Pyodide) — momentan exercițiile sunt doar editor + afișare
  soluție, fără execuție reală.
- Tracking de progres (`progres_lectii` există în schema SQL, dar nu e încă folosit din UI).
- SEO complet (sitemap.xml), banner cookie-uri, pagini legale reale (`/termeni`,
  `/confidentialitate` sunt momentan placeholder-e care spun explicit că trebuie redactate de un
  specialist).

## Conținutul lecțiilor

Fișierul `content/continut_pagina_web.json` este momentan un **exemplu**, cu 8 lecții (clasele IX
și X), scris manual pentru a avea o structură corectă de testat. Trebuie înlocuit cu fișierul
generat real (din `curriculum.json` + `generate_lectii.py`), păstrând exact aceeași structură de
câmpuri (vezi tipul `Lectie` din [`src/lib/content.ts`](src/lib/content.ts)).

## Rulare locală

```bash
npm install
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000). **Fără niciun fișier `.env.local`**,
platforma pornește și funcționează integral pentru lecțiile gratuite — autentificarea și plățile
afișează pur și simplu un mesaj că nu sunt configurate, în loc să dea eroare.

```bash
npm run build   # build de producție
npm run lint    # ESLint
```

## Configurare Supabase (autentificare + bază de date)

1. Creează un proiect nou pe [supabase.com](https://supabase.com).
2. În **SQL Editor**, rulează integral conținutul din [`supabase/schema.sql`](supabase/schema.sql).
3. În **Authentication -> Providers**, activează Email și (opțional) Google — pentru Google ai
   nevoie de un OAuth Client ID/Secret din Google Cloud Console.
4. În **Authentication -> URL Configuration**, adaugă `http://localhost:3000/auth/callback` (și
   ulterior URL-ul de producție) la Redirect URLs.
5. Din **Project Settings -> API**, copiază `Project URL`, `anon public key` și
   `service_role key` în `.env.local` (vezi `.env.example`).

## Configurare Stripe (plăți)

1. Din [dashboard-ul Stripe](https://dashboard.stripe.com) (mod Test), creează două produse
   recurente — plan Lunar și plan Anual — și copiază ID-ul fiecărui **Price** (`price_...`) în
   `STRIPE_PRICE_ID_LUNAR` / `STRIPE_PRICE_ID_ANUAL`.
2. Copiază cheia secretă (`Developers -> API keys`) în `STRIPE_SECRET_KEY`.
3. Pentru testare locală a webhook-ului, instalează [Stripe CLI](https://stripe.com/docs/stripe-cli)
   și rulează `stripe listen --forward-to localhost:3000/api/stripe/webhook`; CLI-ul îți dă un
   `whsec_...` pe care îl pui în `STRIPE_WEBHOOK_SECRET`. În producție, creezi endpoint-ul din
   `Developers -> Webhooks -> Add endpoint`, cu URL-ul `<domeniul-tău>/api/stripe/webhook` și
   evenimentele: `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`.
4. Vezi nota legală din promptul original despre facturare/TVA — consultă un contabil înainte de
   lansare.

## Variabile de mediu

Vezi [`.env.example`](.env.example) pentru lista completă. Copiază-l în `.env.local` și completează
valorile pe măsură ce configurezi Supabase și Stripe.

## Deploy

Proiectul este pregătit pentru deploy pe [Vercel](https://vercel.com/new) — conectează
repository-ul Git, adaugă aceleași variabile de mediu din `.env.local` în Environment Variables
din Vercel, apoi actualizează redirect URLs (Supabase) și endpoint-ul de webhook (Stripe) cu
domeniul real de producție.
