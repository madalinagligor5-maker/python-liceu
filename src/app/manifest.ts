import type { MetadataRoute } from "next";

// Manifestul aplicației web: numele, culorile și iconițele folosite când site-ul
// e salvat pe ecranul principal al telefonului. Iconițele sunt generate din
// public/logo.png (fundal alb, ca logo-ul).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Academia Python",
    short_name: "Academia Python",
    description: "Lecții de Informatică în Python pentru clasele VII–XII, cu exerciții direct în browser.",
    lang: "ro",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F5EE",
    theme_color: "#172033",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
