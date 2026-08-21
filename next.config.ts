import type { NextConfig } from "next";

const SITE = "https://www.academiapython.ro";

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
        ],
      },
    ];
  },
  // Forma canonică e www.academiapython.ro. Orice request pe domeniul
  // fără www e redirecționat permanent (301) pentru a evita conținut duplicat.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "academiapython.ro" }],
        destination: `${SITE}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
