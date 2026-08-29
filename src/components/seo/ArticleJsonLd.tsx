const SITE_URL = "https://www.academiapython.ro";

/** Date structurate Article, populate strict din frontmatter-ul articolului
 *  (titlu/data/descriere) — nu date suplimentare inventate. */
export default function ArticleJsonLd({
  titlu,
  descriere,
  data,
  slug,
}: {
  titlu: string;
  descriere: string;
  data: string;
  slug: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: titlu,
    description: descriere,
    ...(data ? { datePublished: data } : {}),
    url: `${SITE_URL}/blog/${slug}`,
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
    inLanguage: "ro",
    author: {
      "@type": "EducationalOrganization",
      name: "Academia Python",
      url: SITE_URL,
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: "Academia Python",
      url: SITE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
