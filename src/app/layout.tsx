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

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
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

// Date structurate JSON-LD (schema.org) pentru rezultate îmbogățite în căutări.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      name: "Academia Python",
      url: "https://www.academiapython.ro",
      description:
        "Platformă de învățare Python în limba română: Kids, gimnaziu, liceu (clasele IX–XII) și curs practic.",
      sameAs: ["https://www.academiapython.ro"],
    },
    {
      "@type": "Course",
      name: "Informatică cu Python — clasele IX–XII",
      description:
        "Curs complet de Informatică (Python) structurat pe clasele IX–XII: 4 capitole, 88 module, 528 sublecții, cu exerciții interactive și verificare a înțelegerii.",
      provider: {
        "@type": "EducationalOrganization",
        name: "Academia Python",
        url: "https://www.academiapython.ro",
      },
      educationalLevel: "Liceu (IX–XII)",
      teaches: ["Programare Python", "Algoritmi", "Structuri de date", "Baze de date", "Învățare automată"],
      inLanguage: "ro",
      isAccessibleForFree: true,
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "RON",
        // Trebuie să coincidă cu prețul anual afișat pe /preturi (src/lib/oferta.ts).
        price: "350.00",
        availability: "https://schema.org/InStock",
        url: "https://www.academiapython.ro/preturi",
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
