const SITE_URL = "https://www.academiapython.ro";

export type FirimituraBreadcrumb = {
  /** Textul exact afișat în breadcrumb-ul vizual — nu inventăm un text separat. */
  nume: string;
  /** Cale relativă (ex. "/curriculum/IX"). Omisă pentru ultimul element (pagina curentă). */
  cale?: string;
};

/**
 * Date structurate BreadcrumbList (schema.org), construite din exact aceleași
 * ancore afișate în breadcrumb-ul vizual al paginii — nu date separate/inventate.
 * Fiecare pagină cu ierarhie reală (curriculum/modul/sublecție) își construiește
 * lista de firimituri și o pasează aici.
 */
export default function BreadcrumbJsonLd({ firimituri }: { firimituri: FirimituraBreadcrumb[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: firimituri.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: f.nume,
      ...(f.cale ? { item: `${SITE_URL}${f.cale}` } : {}),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
