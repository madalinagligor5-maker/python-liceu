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
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
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
