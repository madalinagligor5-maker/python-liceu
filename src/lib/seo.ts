import type { Metadata } from "next";

/**
 * Sursa unică pentru metadatele SEO ale paginilor.
 *
 * De ce există: în Next.js, `openGraph` și `twitter` definite în layout-ul
 * rădăcină NU se combină cu cele ale paginii — pagina care nu le redefinește
 * le moștenește întregi. Așa ajungeau ~520 de pagini să aibă og:title,
 * og:description și og:url de homepage. Orice pagină publică trebuie să-și
 * construiască metadatele prin `metadatePagina()`, care setează împreună
 * titlul, descrierea, canonical-ul, Open Graph și Twitter.
 */

export const SITE_URL = "https://www.academiapython.ro";
export const NUME_SITE = "Academia Python";
/** Imaginea Open Graph implicită, generată de src/app/og-image.png/route.tsx. */
export const IMAGINE_OG_IMPLICITA = "/og-image.png";

type OptiuniMetadate = {
  /** Titlul paginii, fără sufixul „| Academia Python" (îl adaugă title.template). */
  titlu: string;
  descriere: string;
  /** Calea canonică, de forma „/curriculum/IX". */
  cale: string;
  /** Titlu complet, folosit tel quel (fără șablon) — doar pentru homepage. */
  titluAbsolut?: boolean;
  tip?: "website" | "article";
  /** Doar pentru articole. Date „YYYY-MM-DD". */
  publicatLa?: string;
  modificatLa?: string;
  autori?: string[];
  /** Pagini care nu trebuie indexate (formulare, zone private). */
  noindex?: boolean;
  /** Canonical diferit de `cale` (ex. sublecție → modulul ei). */
  canonical?: string;
  /** false când ruta are propriul fișier opengraph-image (ex. articolele de
   *  blog): imaginea setată aici ar avea prioritate față de cea generată. */
  imagineImplicita?: boolean;
};

export function metadatePagina(o: OptiuniMetadate): Metadata {
  const titluComplet = o.titluAbsolut ? o.titlu : `${o.titlu} | ${NUME_SITE}`;
  const canonical = o.canonical ?? o.cale;
  const cuImagine = o.imagineImplicita !== false;

  return {
    title: o.titluAbsolut ? { absolute: o.titlu } : o.titlu,
    description: o.descriere,
    alternates: { canonical },
    ...(o.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: o.tip ?? "website",
      locale: "ro_RO",
      siteName: NUME_SITE,
      title: titluComplet,
      description: o.descriere,
      url: o.cale,
      ...(cuImagine
        ? { images: [{ url: IMAGINE_OG_IMPLICITA, width: 1200, height: 630, alt: NUME_SITE }] }
        : {}),
      ...(o.tip === "article"
        ? {
            publishedTime: o.publicatLa || undefined,
            modifiedTime: o.modificatLa || o.publicatLa || undefined,
            authors: o.autori,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: titluComplet,
      description: o.descriere,
      ...(cuImagine ? { images: [IMAGINE_OG_IMPLICITA] } : {}),
    },
  };
}

/**
 * Taie o descriere la ~`max` caractere, la limită de cuvânt, fără să lase
 * semne de punctuație atârnate. Folosită pentru descrierile generate din date.
 */
export function scurteaza(text: string, max = 158): string {
  const curat = text.replace(/\s+/g, " ").trim();
  if (curat.length <= max) return curat;
  const taiat = curat.slice(0, max - 1);
  const spatiu = taiat.lastIndexOf(" ");
  return `${taiat.slice(0, spatiu > 80 ? spatiu : taiat.length).replace(/[\s,;:—–-]+$/, "")}…`;
}

/** Pentru paginile private (cont, autentificare, admin, zona profesorului). */
export const FARA_INDEXARE = { index: false, follow: false } as const;
