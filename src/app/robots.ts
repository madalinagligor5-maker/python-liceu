import type { MetadataRoute } from "next";

const SITE_URL = "https://www.academiapython.ro";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        // Fără slash: blochează atât "/cont" (link-ul din footer, vizibil pe
        // orice pagină) cât și "/cont/..." — cu "/cont/" scăpa exact "/cont",
        // care ajungea la un 307 către /login pentru cine nu e autentificat
        // (Googlebot inclusiv), raportat în Search Console ca "Page with redirect".
        "/cont",
        "/login",
        "/inregistrare",
        "/auth/",
        // Zone protejate de middleware (src/middleware.ts), care redirecționează
        // spre /login pe orice vizitator neautentificat — nu au sens indexate.
        "/admin/",
        "/preview-dashboard",
        // Cu slash, nu bar: "/profesor" (zona de aplicație pentru profesori,
        // gatată de middleware) nu are pagină proprie la calea exactă — doar
        // "/profesor/planificari" etc. — iar "/profesor" fără slash ar bloca
        // și "/profesori" (pagina publică de prezentare), care trebuie să
        // rămână indexabilă.
        "/profesor/",
        // Pagina redirecționează la /login pentru orice vizitator
        // neautentificat (verificare proprie, nu prin middleware) — Googlebot
        // nu are niciodată sesiune, deci ar lovi mereu un redirect aici.
        "/profesor-asteptare",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
