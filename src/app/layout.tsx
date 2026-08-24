import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeaderConditional from "@/components/HeaderConditional";
import NewsletterPopup from "@/components/NewsletterPopup";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.academiapython.ro"),
  title: {
    default: "Academia Python — Învață Python pentru liceu, clasele IX-XII",
    template: "%s — Academia Python",
  },
  description:
    "Platformă educațională pentru disciplina Informatică (Python), conform programei oficiale de liceu. Drum de învățare vizual, exerciții interactive în browser, primele 3 module gratuite.",
  keywords: [
    "Python liceu",
    "informatică liceu",
    "Python clasa a IX-a",
    "Python clasa a X-a",
    "Python clasa a XI-a",
    "Python clasa a XII-a",
    "pregătire bacalaureat informatică",
    "programe liceale informatică 2026",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://www.academiapython.ro",
    siteName: "Academia Python",
    title: "Academia Python — Învață Python pentru liceu, clasele IX-XII",
    description:
      "Învață Python direct în browser, fără instalări. Lecții interactive pe clasele IX–XII, conform programei de Informatică.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Academia Python — învață Python pentru liceu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Academia Python — Învață Python pentru liceu, clasele IX-XII",
    description:
      "Învață Python direct în browser, fără instalări. Lecții interactive pe clasele IX–XII.",
    images: ["/og-image.png"],
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
        "Platformă de învățare Python pentru liceu, clasele IX–XII, conform programei de Informatică.",
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
        courseWorkload: "PT528H",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "RON",
        price: "199.00",
        availability: "https://schema.org/InStock",
        url: "https://www.academiapython.ro/preturi",
      },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ro"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background">
        <HeaderConditional>
          <Header />
        </HeaderConditional>
        <main className="flex-1">{children}</main>
        <HeaderConditional>
          <Footer />
        </HeaderConditional>
        <NewsletterPopup />
      </body>
    </html>
  );
}
