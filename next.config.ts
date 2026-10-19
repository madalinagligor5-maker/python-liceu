import type { NextConfig } from "next";

const SITE = "https://www.academiapython.ro";

/**
 * Headere de securitate, pe toate răspunsurile. Aceleași valori sunt și în
 * public/_headers, pentru fișierele statice servite direct de Cloudflare.
 * Fără Content-Security-Policy completă (scripturi): site-ul încarcă Google
 * Analytics, Stripe și Pyodide, iar o politică greșită ar opri plata sau
 * editorul Python. Doar `frame-ancestors`, care blochează încadrarea
 * site-ului în pagini străine (clickjacking); iframe-ul propriu pentru PDF
 * (/resurse/<clasa>/<modul>) rămâne permis prin 'self'.
 */
const HEADERE_SECURITATE = [
  // Doar HTTPS timp de un an. Fără includeSubDomains: nu știm dacă toate
  // subdomeniile (ex. cele pentru email) au HTTPS.
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  // Site-ul nu folosește camera, microfonul sau locația.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Pyodide (Python în browser, via WebAssembly) are nevoie de
  // cross-origin isolation ca să poată folosi SharedArrayBuffer.
  // Fără asta, interpretorul nu pornește pe Vercel / producție.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          // Pyodide (Python în browser via WASM) încarcă resurse de pe
          // cdn.jsdelivr.net. Cu "require-corp", acele resurse sunt blocate
          // (CDN-ul nu trimite Cross-Origin-Resource-Policy), așa că
          // interpretorul nu pornește. "credentialless" permite încărcarea
          // resurselor cross-origin fără credentiale — e setarea corectă.
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
          ...HEADERE_SECURITATE,
        ],
      },
    ];
  },
  // Forma canonică e www.academiapython.ro. Orice request pe domeniul
  // fără www e redirecționat permanent (301) pentru a evita conținut duplicat.
  async redirects() {
    return [
      // Catalogul vechi /lectii dubla /curriculum: o singură cale spre lecții.
      // Doar adresa exactă — paginile /lectii/<clasa>/... (sistemul vechi de
      // lecții folosit de panoul elevului) rămân neschimbate.
      { source: "/lectii", destination: "/curriculum", statusCode: 301 },
      // URL-urile legale vechi duc la singura formă canonică. statusCode 301
      // (nu `permanent`, care ar da 308) — cerut explicit pentru SEO.
      { source: "/termeni", destination: "/termeni-si-conditii", statusCode: 301 },
      { source: "/confidentialitate", destination: "/politica-de-confidentialitate", statusCode: 301 },
      // Două module P8 aveau în slug diacritice / un spațiu, iar URL-urile dădeau
      // 404 (inclusiv din sitemap). Slug-urile au fost corectate în
      // content/structura_curriculum.json; vechile adrese duc la cele noi.
      ...["curriculum", "exercitii", "resurse"].flatMap((sectiune) => [
        {
          source: `/${sectiune}/P8/input-intreaba-utilizatorul-si-prime%C8%99te-un-raspuns/:rest*`,
          destination: `/${sectiune}/P8/input-intreaba-utilizatorul-si-primeste-un-raspuns/:rest*`,
          statusCode: 301 as const,
        },
        {
          source: `/${sectiune}/P8/liste-de-culori-si-desene-cu-ma-mult%20mai-forme/:rest*`,
          destination: `/${sectiune}/P8/liste-de-culori-si-desene-cu-mai-multe-forme/:rest*`,
          statusCode: 301 as const,
        },
      ]),
      {
        source: "/:path*",
        has: [{ type: "host", value: "academiapython.ro" }],
        destination: `${SITE}/:path*`,
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
