import type { NextConfig } from "next";

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
};

export default nextConfig;
