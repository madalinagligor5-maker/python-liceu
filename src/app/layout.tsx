import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeaderConditional from "@/components/HeaderConditional";
import UrmarireEvenimente from "@/components/UrmarireEvenimente";
import ConsimtamantCookie from "@/components/ConsimtamantCookie";
import { getUtilizatorCurent } from "@/lib/subscription";
import { IMAGINE_OG_IMPLICITA, NUME_SITE, SITE_URL } from "@/lib/seo";

const GA_ID = "G-F0158XN3VT";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin", "latin-ext"],
});

// Fontul monospace e folosit doar în blocurile de cod: nu-l preîncărcăm pe
// fiecare pagină (display: "swap", implicit în next/font, afișează textul
// imediat cu fontul de rezervă până se descarcă).
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  preload: false,
});

// Valorile de aici sunt doar rezerva pentru rutele fără metadate proprii.
// Fiecare pagină publică își setează titlul, descrierea, canonical-ul, Open
// Graph și Twitter prin metadatePagina() (src/lib/seo.ts). Intenționat fără
// `alternates.canonical` aici: moștenit, trimitea paginile fără canonical
// propriu (ex. /kids/junior) spre homepage. Fără `keywords`: Google le ignoră.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Academia Python",
    template: `%s | ${NUME_SITE}`,
  },
  description:
    "Informatică în Python pentru clasele VII–XII, conform programei oficiale. Exerciții în browser; gimnaziul e gratuit, la fel primele 3 module de liceu.",
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: NUME_SITE,
    images: [{ url: IMAGINE_OG_IMPLICITA, width: 1200, height: 630, alt: NUME_SITE }],
  },
  twitter: {
    card: "summary_large_image",
    images: [IMAGINE_OG_IMPLICITA],
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { user } = await getUtilizatorCurent();
  const esteAutentificat = Boolean(user);

  return (
    <html
      lang="ro"
      className={`${fraunces.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* Fără JavaScript, IntersectionObserver (ScrollReveal.tsx) nu rulează
            niciodată, deci .is-visible nu se adaugă și conținutul .reveal ar
            rămâne permanent la opacity: 0 — invizibil pentru cine navighează
            cu JS dezactivat, deși nu a cerut explicit mișcare redusă. */}
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col bg-background">
        <a
          href="#continut"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100000] focus:rounded-lg focus:bg-amber-400 focus:px-4 focus:py-2 focus:font-bold focus:text-slate-950"
        >
          Sari la conținut
        </a>
        <HeaderConditional esteAutentificat={esteAutentificat}>
          <Header />
        </HeaderConditional>
        <UrmarireEvenimente />
        <main id="continut" tabIndex={-1} className="flex-1 focus:outline-none">{children}</main>
        <HeaderConditional esteAutentificat={esteAutentificat}>
          <Footer />
        </HeaderConditional>
        <ConsimtamantCookie gaId={GA_ID} activ={process.env.NODE_ENV === "production"} />
      </body>
    </html>
  );
}
