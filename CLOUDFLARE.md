# Mutarea academiapython.ro pe Cloudflare

Codul e pregătit să ruleze pe **Cloudflare Workers** prin adaptorul oficial [OpenNext](https://opennext.js.org/cloudflare). Rulează în continuare identic și pe Vercel, deci mutarea se poate face fără întrerupere: pornești site-ul pe Cloudflare, îl testezi și abia apoi muți domeniul.

Pașii de mai jos se fac **în contul tău Cloudflare și la firma de la care ai cumpărat domeniul**. Din codul proiectului nu am acces acolo.

## Ce s-a schimbat în cod (și de ce)

| Schimbare | De ce |
|---|---|
| Next.js 16.3 → 16.4.2 | adaptorul Cloudflare cere minimum 16.4.1 |
| `src/proxy.ts` → `src/middleware.ts` | `proxy` rulează doar pe Node.js; `middleware` rulează pe edge, suportat oficial pe Cloudflare |
| Lecțiile, blogul, exercițiile etc. se citesc dintr-un pachet generat la build (`scripts/genereaza-continut.mjs`, `src/lib/fisiereContinut.ts`) | pe Cloudflare Workers nu există sistem de fișiere |
| Stripe folosește `fetch` și verificarea asincronă a webhook-ului | pe Workers nu există modulele `http`/`crypto` din Node |
| `wrangler.jsonc`, `open-next.config.ts`, `public/_headers` | configurația Worker-ului; `_headers` păstrează izolarea cerută de Python în browser (Pyodide) |
| scripturi noi: `npm run cf:build`, `cf:preview`, `cf:deploy`; `npm run build` face build-ul Cloudflare când rulează în Workers Builds | build, test local și deploy pentru Cloudflare |

Am testat local în runtime-ul Cloudflare (`npm run cf:preview`):
- **Pagini:** toate cele 1.100 de pagini răspund identic ca pe Node (status, titlu, descriere, H1, canonical, Open Graph, date structurate).
- **PDF:** fișa PDF iese identică cu cea de pe Node.
- **Generate la build:** imaginile Open Graph și sitemap-ul.
- **Redirecturi și middleware:** redirecturile 301 merg, iar middleware-ul trimite la login paginile protejate.
- **Stripe:** webhook-ul acceptă evenimentul cu semnătură corectă și îl respinge pe cel cu semnătură greșită.
- **Python în browser:** rulează (`crossOriginIsolated: true`).

**Netestat de aici**, pentru că nu am acces la internet și la conturile tale: autentificarea cu Supabase real, plata cu Stripe real și optimizarea imaginilor prin Cloudflare Images pe contul tău. Le verifici la pasul 4.

## Costuri
- **Workers Paid: 5 $/lună — recomandat.**
  - Worker-ul are acum ~2,7 MB comprimat, deci încape și în limita de 3 MB a planului gratuit.
  - Pe planul gratuit însă fiecare cerere are voie la doar 10 ms de procesor. Randarea unei pagini Next.js (lecții, cont, dashboard) poate depăși limita, iar atunci vizitatorul vede eroarea Cloudflare 1102. Pe Workers Paid limita e de 30 s.
- **Cloudflare Images** (pentru `next/image`): are un nivel gratuit lunar. Verifică limitele actuale în dashboard → Images.
- **Vercel:** după mutare îl poți închide. Planul gratuit (Hobby) nu permite oricum utilizare comercială.

## Pasul 1. Cont și plan
1. Creează un cont pe [dash.cloudflare.com](https://dash.cloudflare.com) (sau intră în cel existent).
2. **Workers & Pages → Plans** → activează **Workers Paid**.

## Pasul 2. Creează Worker-ul din GitHub
1. **Workers & Pages → Create → Workers → Import a repository** → conectează GitHub și alege `madalinagligor5-maker/python-liceu`.
2. Setări de build (Worker → **Settings → Build**):
   - **Project name:** `python-liceu` (trebuie să fie identic cu `name` din `wrangler.jsonc`, altfel build-ul pică imediat)
   - **Production branch:** `main`
   - **Build command:** `npm run cf:build`
   - **Deploy command:** `npx wrangler deploy`
   - Dacă au rămas comenzile implicite (`npm run build` + `npx wrangler deploy`), merge și așa: în Workers Builds, `npm run build` face automat build-ul complet pentru Cloudflare (`scripts/build.mjs`, după variabila `WORKERS_CI=1` setată de Cloudflare). Dacă în logul de build vezi doar `next build`, fără „OpenNext build complete”, setează explicit comanda de mai sus.
3. **Înainte de primul build**, adaugă variabilele de la pasul 3. Altfel site-ul se construiește fără Supabase și apare „Autentificarea nu este configurată”.

## Pasul 3. Variabile de mediu
Ia valorile din Vercel → Settings → Environment Variables (aceleași ca acum).

**Build variables** (Worker → Settings → Build → Variables and secrets). Sunt necesare la build, pentru că intră în codul din browser:

| Variabilă | Tip |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | text |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | text |

**Runtime** (Worker → Settings → Variables and Secrets). Pune-le pe toate, inclusiv pe cele două de mai sus încă o dată:

| Variabilă | Tip |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | text |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | text |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** |
| `STRIPE_SECRET_KEY` | **Secret** |
| `STRIPE_WEBHOOK_SECRET` | **Secret** |
| `STRIPE_PRICE_ID_LUNAR`, `STRIPE_PRICE_ID_ANUAL` | text |
| `STRIPE_PRICE_ID_CURS_LUNAR`, `STRIPE_PRICE_ID_CURS_ANUAL` | text |
| `GEMINI_API_KEY` | **Secret** |
| `RESEND_API_KEY` | **Secret** |
| `RESEND_FROM_EMAIL`, `ADMIN_EMAIL` | text |

După ce le adaugi, pornește din nou build-ul: Deployments → **Retry build**.

> **Important.** Cele două `NEXT_PUBLIC_SUPABASE_…` trebuie puse în **ambele** locuri: la Build și la Runtime. Fără ele la Build, pagina de login arată „Autentificarea nu este configurată”, chiar dacă există la Runtime. Variabilele de la Runtime puse din dashboard rămân la fiecare deploy (`keep_vars` în `wrangler.jsonc`).

## Pasul 4. Testează pe adresa temporară (înainte să muți domeniul)
După deploy, Worker-ul are o adresă de forma `https://python-liceu.<contul-tău>.workers.dev`.

1. În **Supabase → Authentication → URL Configuration → Redirect URLs**, adaugă temporar `https://python-liceu.<contul-tău>.workers.dev/auth/callback**`.
2. Verifică pe adresa temporară:
   - [ ] homepage, `/curriculum`, o lecție, un articol de blog;
   - [ ] **Rulează codul** în `/lab` (Python în browser);
   - [ ] o fișă PDF (`/resurse/IX` → o fișă);
   - [ ] creare cont, confirmare email, autentificare, „Ai uitat parola?”;
   - [ ] contul tău de admin (`/admin/profesori`) și zona de profesor;
   - [ ] o plată de test cu Stripe în **modul test**. Webhook-ul de producție rămâne pe domeniu, așa că pentru test adaugă în Stripe → Developers → Webhooks un endpoint temporar `https://python-liceu.<contul-tău>.workers.dev/api/stripe/webhook`. Atenție: are alt secret de semnare.
3. Dacă ceva nu merge, Worker → **Observability / Logs** arată eroarea. Trimite-mi-o și o repar.

## Pasul 5. Mută domeniul
1. **Cloudflare → Add a site → `academiapython.ro`** (planul Free e suficient pentru domeniu).
   - Cloudflare importă înregistrările DNS existente. Verifică să fie toate, mai ales cele pentru **email**: MX, TXT/SPF, DKIM pentru Resend. Fără ele nu mai pleacă și nu mai vin emailuri.
2. La firma de la care ai cumpărat domeniul, schimbă **nameserverele** cu cele două primite de la Cloudflare. Propagarea durează de la câteva minute la 24 de ore.
3. Când domeniul apare „Active” în Cloudflare: **Worker → Settings → Domains & Routes → Add → Custom domain**:
   - `www.academiapython.ro`
   - `academiapython.ro`. Redirecționarea spre `www` (301) o face deja codul.
   - Cloudflare creează singur înregistrările DNS și certificatul SSL. Dacă îți spune că există deja înregistrări spre Vercel (A `76.76.21.21` sau CNAME `cname.vercel-dns.com`), șterge-le întâi.
4. Verifică `https://www.academiapython.ro` și `https://academiapython.ro`. A doua trebuie să ducă pe prima.

## Pasul 6. După mutare
- [ ] **Stripe:** URL-ul webhook-ului de producție rămâne același (`https://www.academiapython.ro/api/stripe/webhook`), deci nu trebuie schimbat. Șterge endpoint-ul temporar de la pasul 4. În Stripe → Webhooks, la endpoint-ul de producție, verifică primele livrări după mutare: trebuie să apară cu 200.
- [ ] **Supabase:** scoate URL-ul temporar `workers.dev` din Redirect URLs.
- [ ] **Google Search Console:** nu e nimic de schimbat (același domeniu). Retrimite sitemap-ul, dacă vrei.
- [ ] **Vercel:** păstrează proiectul câteva zile, ca plan de rezervă. Ca să revii, refaci înregistrările DNS spre Vercel. Apoi scoate domeniul din proiectul Vercel și oprește deploy-urile automate (sau șterge proiectul).

## Lucru zilnic după mutare
- Orice push pe `main` → Cloudflare face build și deploy automat (Workers Builds).
- Test local al variantei Cloudflare: `npm run cf:preview` (pune variabilele într-un fișier `.dev.vars`, care e ignorat de Git).
- `npm run dev` merge ca până acum. După modificări în `content/`, repornește-l, ca să se regenereze pachetul de conținut.
- **Datele din sitemap (`lastmod`)** se calculează din istoricul Git. Dacă Cloudflare clonează repository-ul fără istoric complet, unele pagini apar fără dată. Nu e o eroare, doar mai puțină informație pentru Google.

## Riscuri și limitări cunoscute
- **`src/middleware.ts` produce la build avertismentul „middleware is deprecated, use proxy”.** E așteptat: pe Next 16, `middleware` e varianta recomandată pentru edge, iar Next o păstrează funcțională.
- **Cache-ul paginilor e „read-only”** (`staticAssetsIncrementalCache`): paginile statice se generează doar la build. Site-ul nu folosește revalidare periodică (ISR), deci nu contează acum. Dacă pe viitor folosești `revalidate`, trebuie trecut pe cache R2 (vezi comentariul din `open-next.config.ts`).
- **Limita Worker-ului:** 3 MB comprimat pe planul gratuit, 10 MB pe Workers Paid (acum ~2,7 MB). Conținutul din `content/` intră în Worker, împărțit pe pachete (`scripts/genereaza-continut.mjs`), așa că va crește încet odată cu lecțiile noi. Imaginile de previzualizare se generează la build (`scripts/genereaza-og.mjs`), nu în Worker.
