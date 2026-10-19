# SEO_CHANGELOG — academiapython.ro

Ramura `seo-tehnic`, 11 commit-uri peste `main` (câte unul pe sarcină). Next.js 16.3, App Router.
Toate verificările de mai jos au rulat local pe build-ul de producție (`next build` + `next start`).

## Rezumat: înainte → după

Măsurat cu un crawler local care pornește de la homepage și de la sitemap (1.100 de URL-uri):

| Verificare | Înainte | După |
|---|---|---|
| URL-uri în sitemap | 399 (cu 14 adrese care dădeau 404) | 196 = exact paginile indexabile |
| Pagini indexabile lipsă din sitemap | 150+ (profesori, resurse, exerciții, Kids…) | 0 |
| Linkuri interne rupte (404) | 16 (două module P8) | 0 |
| `og:title` / `og:url` de homepage pe alte pagini | 523 | 0 |
| `meta keywords` | pe 535 de pagini | 0 |
| Canonical greșit (spre homepage) | `/kids/junior`, `/login`, `/inregistrare` | 0 |
| Descrieri duplicate | 110 (descrierea homepage-ului) + 108 module cu șablon identic | 0 |
| Titluri duplicate | 2 grupuri | 0 |
| Pagini indexabile fără exact un H1 | 6 | 0 |
| Imagine Open Graph | `/og-image.png` lipsea (404 la fiecare distribuire) | generată la build + imagine proprie pe fiecare articol |
| Date structurate | Organization + Course cu preț pe toate cele 535 de pagini | pe tip de pagină, 0 erori de validare |

Lighthouse mobil (local, aceeași mașină, o rulare per pagină):

| Pagina | Performanță | LCP | TBT | CLS | Greutate |
|---|---|---|---|---|---|
| `/` | 68 → **85** | 4,3 s → 4,3 s | 710 → 50 ms | 0 → 0 | 924 → 544 KiB |
| `/curriculum/IX/ce-este-un-algoritm-…` | 87 → **94** | 4,1 → 3,0 s | 40 → 60 ms | 0 → 0 | 923 → 540 KiB |
| `/blog/variabile-in-python` | 87 → 87 | 4,1 → 3,9 s | 50 → 80 ms | 0 → 0,004 | 921 → 538 KiB |
| `/lab` | 72 → **88** | 5,7 → 3,9 s | 80 → 30 ms | 0,159 → **0** | 912 → 528 KiB |

Accesibilitate 95–97, Best practices 100, SEO 100 atât înainte, cât și după. Lighthouse local, fără rețea reală, e orientativ: după deploy, măsoară din nou cu PageSpeed Insights.

## Ce s-a schimbat, pe sarcini

### 1. Sitemap complet (`ec68395`)
- `src/app/sitemap.ts` conține homepage, `/curriculum`, clasele VII–XII și capitolele „Python pentru copii”, toate cele 108 module, blogul cu cele 11 articole, cursul practic (10 module), Kids, `/profesori`, `/despre`, `/lab`, `/start`, prețurile, exercițiile și resursele publice, plus legalele în forma canonică.
- Sublecțiile, paginile private și cele cu noindex sunt excluse.
- `lastModified` e real:
  - pentru module: data ultimului commit Git al fișierului Markdown cu lecțiile;
  - pentru paginile statice: data din Git a fișierului lor `page.tsx`;
  - pentru articole: data din frontmatter.
- Într-o clonă Git shallow (cum face Vercel implicit), un fișier neatins în istoricul disponibil nu primește o dată falsă: pagina lui apare fără `lastmod` (`src/lib/dateModificare.ts`). Vezi checklist-ul, `VERCEL_DEEP_CLONE`.
- Priorități: homepage 1.0, curriculum și clase 0.9, module 0.8, blog 0.7, prețuri și lab 0.6, legale 0.2.
- `robots.txt` indică în continuare `https://www.academiapython.ro/sitemap.xml`.
- **Verificare:** `curl localhost:3000/sitemap.xml`. Crawler-ul a confirmat 196 de URL-uri în sitemap = 196 de pagini indexabile.

### 2. URL-uri legale unificate (`1034e04`)
- `/termeni` → `/termeni-si-conditii` și `/confidentialitate` → `/politica-de-confidentialitate`, cu redirect **301** în `next.config.ts`. Înainte erau pagini care făceau redirect 307 (temporar).
- Footerul folosea deja URL-urile canonice; în cod nu mai există niciun link spre formele vechi.

### Reparație separată: două module P8 care dădeau 404 (`8f5a724`)
- Slug-urile `input-intreaba-utilizatorul-si-primește-un-raspuns` și `liste-de-culori-si-desene-cu-ma-mult mai-forme` (cu diacritice și un spațiu) nu se potriveau cu ruta. Au fost corectate în `content/structura_curriculum.json`.
- Vechile adrese fac 301 spre cele noi, pentru `/curriculum`, `/exercitii` și `/resurse`.

### 3. Modulele devin paginile principale, sublecțiile primesc noindex (`e50759a`)
- **Titlu modul:** „`<Titlu modul>` — Informatică clasa a `<X>`-a | Academia Python”. Pentru capitolele Kids: „— Python pentru copii de N ani”.
- **Descriere:** unică, de 140–160 de caractere pe toate cele 108 module (`src/lib/seoModul.ts`).
- **Conținut unic pe pagina de modul**, generat din datele existente și pentru modulele cu abonament:
  - temele lecției (titlurile din pasul „Concept nou”);
  - termenii Python (cuvinte cheie, funcții, metode din explicații și exemple);
  - nivelul recomandat și regimul de acces.
  - Existau deja: cerințele, pașii, modulul anterior și cel următor, breadcrumbs.
- **Intro și rezultate de învățare scrise de un om:** în `content/module-seo.json` (gol, `TODO(owner)`). Se afișează automat când le completezi.
- **Sublecțiile** (curriculum și curs practic): `robots: noindex, follow`, canonical spre modul, titlu „`<Pas>` — `<Modul>` (clasa a X-a)”. Rămân accesibile normal; breadcrumbs vizuale existau deja.

### 4. Metadate unice pe fiecare pagină (`c014697`)
- **Helper comun:** `src/lib/seo.ts` → `metadatePagina()` setează împreună titlul, descrierea, canonical-ul, Open Graph (title, description, url, type, imagine) și Twitter. Toate paginile publice îl folosesc.
- **Layout rădăcină:**
  - am scos `keywords`;
  - am scos `canonical: "/"` moștenit;
  - `title.template` e acum `%s | Academia Python`.
- **Homepage:**
  - titlu: „Python pentru elevi: Informatică VII–XII | Academia Python” (58 de caractere);
  - descriere de 150 de caractere, cu „informatică”, „Python”, „clasele VII–XII”, „gratuit”.
- **Articole:**
  - `og:type = article`, cu `publishedTime` și `modifiedTime`;
  - imagine OG generată din titlul articolului (`src/app/blog/[slug]/opengraph-image.tsx`).
- **Imaginea OG implicită** se servește la `/og-image.png`, generată la build din `src/app/og-image.png/route.tsx`. Fonturile Fraunces și Hanken Grotesk sunt incluse în `assets/og-fonturi/`, cu licența OFL, inclusiv subsetul pentru ș și ț.
- **noindex pe paginile private și de aplicație:**
  - cont, login, înregistrare, resetare parolă, admin, profesor, profesor-așteptare;
  - vizualizatorul PDF;
  - Kids Junior.
- **Titluri mai descriptive:** `/lab` („Compilator Python online…”), `/preturi`, `/exercitii`, `/resurse`.
- **Bug corectat:** „clasa a vii-a” → „clasa a VII-a” (`numeClasaInText`), inclusiv în textul vizibil „Materia din …”.

### 5–6. Layout, `/curriculum`, homepage (`9342887`)
- **Header și footer:** erau deja aceleași pe tot site-ul (layout rădăcină). Crawler-ul a confirmat același HTML pe homepage, curriculum, lecții și blog; doar zona Kids are o variantă de header, intenționat.
- **Mențiunile „IX–XII”** care au rămas se referă strict la liceu, deci sunt corecte.
- **`/curriculum`:**
  - bloc separat pentru gimnaziu (VII–VIII), cu linkuri spre fiecare modul. Rezumatul de liceu rămâne legat de programa lui, cum cere comentariul din cod;
  - titlu și descriere noi; canonical exista deja.
- **Homepage:**
  - H1 neschimbat, cu subtitlul „Informatică pentru gimnaziu și liceu, clasele VII–XII” imediat sub el;
  - secțiune nouă cu câte un H2 pentru gimnaziu, liceu, curs practic, Kids, profesori și blog, cu linkuri explicite spre `/curriculum/VII` … `/curriculum/XII` și spre articolele de pornire. Textele vin din `src/lib/trasee.ts`.
  - H2 pentru „Întrebări frecvente” exista deja.

### 7. Date structurate JSON-LD (`c4d0726`)
- **Ce am scos:** blocul injectat pe fiecare pagină de layout (`EducationalOrganization` + `Course` cu prețul de 350 lei).
- **Homepage:** `EducationalOrganization` (logo, emailul din footer) + `WebSite`.
- **Clase:** `Course` pe fiecare clasă (cu modulele ca `hasPart`).
- **Module:** `Course` pe fiecare modul, cu `courseCode`, `educationalLevel`, `inLanguage: ro`, `isAccessibleForFree` și termenii Python ca `teaches`.
- **Ofertă de preț:** doar pentru conținutul gratuit (0 RON).
- **Articole:** `BlogPosting` (`headline`, `datePublished`, `dateModified`, `author`, `publisher` cu logo, `image`).
- **`FAQPage`:** pe homepage și pe cele 10 articole care au secțiunea de întrebări, cu exact textul afișat.
- **`BreadcrumbList`:** pe clase, module, sublecții și articole.
- **Componente:** `src/components/seo/JsonLd.tsx` și constructorii din `src/lib/dateStructurate.ts`.
- **Verificare:** pe toate cele 196 de pagini, JSON valid, câmpurile cerute prezente, textul FAQ identic cu cel vizibil, 0 erori. După deploy, verifică și cu [Rich Results Test](https://search.google.com/test/rich-results).
- **Ce lipsește intenționat:** durata cursului și prețul abonamentului. Fără ele, Google nu afișează rezultatul îmbogățit „Course info”, dar nu le inventăm (vezi TODO).

### 8. Blog (`e9ec9a1`)
- **Bloc „Scris de”** pe fiecare articol, din `src/lib/autori.ts`. Până completezi persoana: „Echipa Academia Python” (`TODO(owner)`).
- **Datele afișate:** „Publicat pe … · Ultima actualizare: …”.
- **Articolul despre Bacalaureat:** secțiune „Surse oficiale” cu documentele exact cum sunt citate (OMEC 6930/19.12.2025, Ordinul 4.370/2026, Monitorul Oficial 591 bis/20.VII.2026) și link spre edu.ro.
  - N-am putut verifica adresele exacte ale ordinelor, pentru că mediul de lucru nu are acces la internet. Rămân `TODO(owner)`.
- **Legături interne pe subiect** (`src/lib/legaturiBlog.ts`):
  - un bloc nou „Lecția potrivită pe platformă” pe fiecare articol;
  - „Citește și” pune întâi articolele înrudite ca subiect.
  - Fiecare articol trimite acum spre cel puțin un modul și cel puțin alte 3 articole.
- **Paginare pe `/blog`:** nu e necesară încă (11 articole).

### 9. Diacritice (`2a737a8`)
- **`/curriculum` și datele modulelor/pașilor:** în codul actual, titlurile aveau deja diacritice corecte („Fundamentele programării”, „Citește și prezice”, „Verifică-ți înțelegerea”…). Șirurile din audit apăreau doar în `content/planificari/*.json`.
- **`content/planificari/*.json`:** titlurile sincronizate cu structura curriculumului (55 de module).
- **Mesajul „Trebuie să fii autentificat…”** al asistentului AI.
- **Verificare:** scanarea textului vizibil al tuturor celor 196 de pagini din sitemap nu mai găsește cuvinte românești fără diacritice. Cele rămase în raport („scrii”, „rulezi”, „acesta”) sunt corecte așa.
- **Necorectate (raportate):** vezi „Diacritice rămase” mai jos.

### 10. Performanță (`09c11c7`)
- **Logo:** `width/height` 40 în loc de 1254. `next/image` cere acum 48 sau 96 px, nu varianta de 3840 px (~100 KB). `priority` doar în header; `alt=""`, pentru că logo-ul stă mereu lângă numele scris.
- **Favicon:** `src/app/icon.png` de la 1254 px / 311 KB la 192 px / 15 KB.
- **Pyodide:** se încărca deja doar la prima rulare de cod (`ruleazaPython` creează worker-ul la click; `preincarcaPython` nu e apelat nicăieri). Confirmat: niciun fișier `pyodide` la încărcarea paginilor.
- **Încărcare leneșă:** asistentul AI demo de pe homepage se încarcă după hidratare (`next/dynamic`, `ssr: false`), cu placeholder de aceeași înălțime.
  - Editorul nu l-am făcut leneș: e în hero, iar încărcarea leneșă ar înrăutăți LCP-ul și ar produce salt de layout.
  - Componentele client sunt oricum împărțite pe rute în App Router; partea grea e Pyodide, care se încarcă deja la cerere.
- **Fonturi:**
  - `next/font` folosește implicit `display: swap`;
  - JetBrains Mono (doar pentru cod) nu mai e preîncărcat pe fiecare pagină.
- **`/lab`:** placeholder-ul are înălțimea editorului (CLS 0,159 → 0).
- **`alt`:** toate imaginile aveau deja texte descriptive.

### 11. Verificare tehnică (`7d243ca`)
- **H1 unic:**
  - `/kids/aventura/1–3` au primit H1 și titluri/descrieri unice pe nivel;
  - `/kids/fise-print` are acum un singur H1.
- **404:** `src/app/not-found.tsx`, cu linkuri utile; Next adaugă `noindex`.
- **Eroare 500:** `src/app/error.tsx`, cu `noindex`, buton „Încearcă din nou” și linkuri.
- **Redirecturi:** `academiapython.ro` → `www.academiapython.ro` și `/lectii` → `/curriculum` sunt acum **301** (erau 308).
- **Cursul practic:** modulele au titluri și descrieri unice.
- **Rezultat final:**
  - 0 linkuri interne rupte, 0 erori 5xx;
  - fiecare pagină indexabilă are exact un H1, `lang="ro"` și un singur canonical, spre ea însăși;
  - nicio pagină privată nu e indexabilă și niciuna nu apare în sitemap.

## Unde auditul nu se potrivea cu codul (decizii)
- Mai multe constatări din audit nu se regăseau în codul de pe `main`. Este foarte probabil ca auditul să fi fost făcut pe un deploy mai vechi sau dintr-un cache:
  - sitemap-ul includea deja blogul și modulele;
  - header-ul și footer-ul erau deja comune;
  - `/curriculum` avea canonical și diacritice;
  - date schema.org existau.
  - **Verifică în Vercel → Deployments că domeniul de producție rulează ultimul commit de pe `main`.**
- **Sublecții noindex.** Inclusiv cele din modulele gratuite, care înainte erau indexabile. Pagina modulului le preia rolul.
  - Se poate reveni pe module gratuite, dacă Search Console arată că pierzi trafic pe ele: în `generateMetadata` din pagina de sublecție.
- **Temele și termenii Python pe modulele cu abonament.** Codul vechi nu citea deloc conținutul plătit fără acces. Acum pagina modulului afișează titlurile temelor și cuvintele-cheie, nu explicațiile sau exercițiile.
  - Dacă nu vrei asta, condiționează `conceptC` de `areAcces` în `src/app/curriculum/[clasa]/[modulSlug]/page.tsx`.
- **Kids Junior și vizualizatorul PDF au noindex.** Sunt pagini de aplicație (joc, PDF într-un iframe), fără text de indexat. Paginile indexabile pentru ele sunt `/kids` și `/resurse/<clasa>`.

## Diacritice rămase (necorectate)
- **Fișele PDF** (`src/lib/resursePdfContent.ts`, `src/app/api/pdf/…`, `src/app/api/profesor-pdf/…`, `src/lib/pdfProfesor.ts`): elimină intenționat diacriticele (`curataDiacritice`), pentru că fontul Helvetica din pdfkit nu are ș/ț.
  - Repararea cere încorporarea unui font TTF în PDF-uri: o sarcină separată, care nu ține de SEO, fiindcă PDF-urile se servesc prin `/api/`, blocat în robots.txt.
- **Câmpul `_nota`** din `content/planificari/*.json`: text intern, neafișat.

## TODO(owner): informații sau decizii de la tine
1. **Autorul articolelor** (`src/lib/autori.ts`): numele, rolul și 1–2 propoziții despre experiență (și, opțional, un autor per articol). Apare pe articole și în datele structurate (`Person`).
2. **Adresele oficiale ale ordinelor citate** în articolul despre Bacalaureat (`src/lib/legaturiBlog.ts`, câmpul `url`): OMEC 6930/19.12.2025, Ordinul 4.370/2026, Monitorul Oficial 591 bis/20.VII.2026 (de exemplu de pe edu.ro sau legislatie.just.ro).
3. **Texte unice pentru module** (`content/module-seo.json`): `intro` (2–3 propoziții) și `rezultate` (3–5 rezultate de învățare) pentru modulele importante. Începe cu cele gratuite și cu primele module din fiecare clasă.
4. **Rezultatul îmbogățit „Course info” în Google** cere durata (ore) și prețul pe fiecare curs. Dacă vrei să apară, decide ce afișăm (de exemplu „2 ore pe modul”, cum apare în planificări) și prețul abonamentului.
5. **Imagini:** o imagine OG proprie pentru homepage, dacă vrei alta decât cea generată din text. Opțional, imagini pentru articole.
6. **`test.txt`** din rădăcina proiectului (conține doar „SalutLume”): nu e creat de mine și nu e inclus în commit-uri. Șterge-l dacă nu-ți trebuie.
7. **Linkuri care se repetă pe module:** decide dacă vrei să păstrezi indexabile sublecțiile din modulele gratuite (vezi „Decizii”).

## Checklist în afara codului
- [ ] **Deploy:** după merge pe `main`, verifică în Vercel că deploy-ul de producție a reușit și că `https://www.academiapython.ro/og-image.png` și `/sitemap.xml` se deschid.
- [ ] **Vercel → Settings → Environment Variables:** adaugă `VERCEL_DEEP_CLONE=true`, ca `lastmod` din sitemap să aibă data reală pe toate paginile (altfel paginile neatinse recent apar fără `lastmod`).
- [ ] **Vercel → Domains:** confirmă că `academiapython.ro` (fără www) redirecționează spre `www.academiapython.ro`.
- [ ] **Google Search Console:**
  - adaugă proprietatea de tip Domeniu `academiapython.ro` (verificare prin DNS TXT);
  - Sitemaps → trimite `https://www.academiapython.ro/sitemap.xml`;
  - URL Inspection → cere indexarea pentru homepage, `/curriculum`, `/curriculum/IX`, câteva module și articole.
- [ ] **Bing Webmaster Tools:** importă proprietatea din Search Console (sau verifică prin DNS) și trimite același sitemap.
- [ ] **Rich Results Test** pe homepage, un modul și un articol de blog.
- [ ] **PageSpeed Insights** (mobil) pe aceleași 4 pagini ca mai sus, pentru valori reale, cu rețea.
- [ ] **După 1–2 săptămâni, în Search Console:**
  - Pages: paginile indexate ar trebui să conveargă spre cele ~196 din sitemap;
  - sublecțiile apar la „Excluded by noindex” (normal);
  - verifică dacă mai apar 404 vechi;
  - Enhancements: Breadcrumbs, FAQ;
  - Performance: interogările pentru module și articole.
- [ ] **Distribuie un link pe WhatsApp/Facebook** și verifică previzualizarea (sau [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)).

## Cum se verifică local
```bash
npm run build && npm run start
curl -s localhost:3000/sitemap.xml | grep -c "<url>"                    # 196
curl -s localhost:3000/curriculum/IX/ce-este-un-algoritm-etapele-elaborarii-unui-program/1.1.1 | grep -o '<meta name="robots"[^>]*>'   # noindex, follow
curl -sI localhost:3000/termeni | head -3                                 # 301 -> /termeni-si-conditii
curl -s localhost:3000/og-image.png -o og.png && file og.png              # PNG 1200x630
```
