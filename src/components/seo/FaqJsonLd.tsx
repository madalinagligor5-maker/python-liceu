/** Date structurate FAQPage — DOAR pentru o secțiune de întrebări/răspunsuri
 *  reală, deja afișată pe pagină (ex. FAQ-ul de pe homepage). Nu inventăm
 *  întrebări noi doar ca să umplem schema; itemii vin din același array
 *  folosit la randarea vizuală a secțiunii. */
export default function FaqJsonLd({
  intrebari,
}: {
  intrebari: { intrebare: string; raspuns: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: intrebari.map((i) => ({
      "@type": "Question",
      name: i.intrebare,
      acceptedAnswer: {
        "@type": "Answer",
        text: i.raspuns,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
