import type { Capitol, Modul } from "@/lib/curriculum";
import { esteCapitolCopii, hrefModul, numeClasa } from "@/lib/curriculum";
import { NUME_SITE, SITE_URL } from "@/lib/seo";

/**
 * Date structurate schema.org, construite DOAR din date reale ale site-ului
 * (structura curriculumului, frontmatter-ul articolelor, datele de contact
 * afișate în footer). Nu adăugăm câmpuri pe care nu le putem susține: fără
 * durată estimată (nu o afișăm nici pe pagină), fără preț pentru modulele cu
 * abonament (prețul vine din Stripe și se poate schimba), fără autori
 * persoane fizice până nu sunt definiți (vezi AUTOR_BLOG).
 */

/** Emailul de contact afișat în footer (src/components/Footer.tsx). */
const EMAIL_CONTACT = "academipython@gmail.com";
const LOGO = `${SITE_URL}/logo.png`;
const ID_ORGANIZATIE = `${SITE_URL}/#organizatie`;

const referintaOrganizatie = { "@id": ID_ORGANIZATIE };

/**
 * Autorul articolelor de blog.
 * TODO(owner): înlocuiește cu persoana care scrie articolele, de ex.
 * { "@type": "Person", name: "…", jobTitle: "…", url: "https://www.academiapython.ro/despre" }.
 * Până atunci, autorul declarat este organizația (adevărat, nu inventat).
 */
export const AUTOR_BLOG: Record<string, unknown> = {
  "@type": "EducationalOrganization",
  name: NUME_SITE,
  url: SITE_URL,
};

export function organizatie() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": ID_ORGANIZATIE,
    name: NUME_SITE,
    url: SITE_URL,
    logo: LOGO,
    email: EMAIL_CONTACT,
    description:
      "Platformă de învățare Python în limba română: Kids, gimnaziu (clasele VII–VIII), liceu (clasele IX–XII) și curs practic.",
    contactPoint: {
      "@type": "ContactPoint",
      email: EMAIL_CONTACT,
      contactType: "customer support",
      availableLanguage: "ro",
    },
  };
}

export function website() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: NUME_SITE,
    url: SITE_URL,
    inLanguage: "ro",
    publisher: referintaOrganizatie,
  };
}

function nivelEducational(clasa: string): string {
  if (esteCapitolCopii(clasa)) return `Copii, ${clasa.slice(1)} ani`;
  return clasa === "VII" || clasa === "VIII" ? `Gimnaziu, ${numeClasa(clasa)}` : `Liceu, ${numeClasa(clasa)}`;
}

/** Ofertă doar pentru conținutul gratuit (preț 0, adevărat și stabil). */
const ofertaGratuita = {
  "@type": "Offer",
  price: 0,
  priceCurrency: "RON",
  category: "Free",
};

/** Course pentru o clasă (/curriculum/<clasa>). */
export function cursClasa(capitol: Capitol, descriere: string) {
  const toateGratuite = capitol.module.every((m) => m.gratuit);
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${SITE_URL}/curriculum/${capitol.clasa}#curs`,
    name: esteCapitolCopii(capitol.clasa) ? capitol.titlu : `Informatică în Python — ${numeClasa(capitol.clasa)}: ${capitol.titlu}`,
    description: descriere,
    url: `${SITE_URL}/curriculum/${capitol.clasa}`,
    provider: { "@type": "EducationalOrganization", name: NUME_SITE, url: SITE_URL },
    educationalLevel: nivelEducational(capitol.clasa),
    inLanguage: "ro",
    isAccessibleForFree: toateGratuite,
    ...(toateGratuite ? { offers: ofertaGratuita } : {}),
    hasPart: moduleCapitol(capitol),
  };
}

function moduleCapitol(capitol: Capitol) {
  return capitol.module.map((m) => ({
    "@type": "Course",
    name: m.titlu,
    url: `${SITE_URL}${hrefModul(m)}`,
  }));
}

/** Course pentru un modul (/curriculum/<clasa>/<modul>). */
export function cursModul(modul: Modul, capitol: Capitol, descriere: string, termeni: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${SITE_URL}${hrefModul(modul)}#curs`,
    name: modul.titlu,
    description: descriere,
    url: `${SITE_URL}${hrefModul(modul)}`,
    courseCode: modul.cod,
    provider: { "@type": "EducationalOrganization", name: NUME_SITE, url: SITE_URL },
    educationalLevel: nivelEducational(capitol.clasa),
    inLanguage: "ro",
    isAccessibleForFree: modul.gratuit,
    ...(modul.gratuit ? { offers: ofertaGratuita } : {}),
    ...(termeni.length ? { teaches: termeni.join(", ") } : {}),
    isPartOf: { "@id": `${SITE_URL}/curriculum/${capitol.clasa}#curs` },
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
  };
}

/** BlogPosting pentru un articol. */
export function articolBlog(a: {
  titlu: string;
  descriere: string;
  slug: string;
  data: string;
  actualizat?: string;
  imagine: string;
}) {
  const url = `${SITE_URL}/blog/${a.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.titlu,
    description: a.descriere,
    url,
    mainEntityOfPage: url,
    image: a.imagine,
    inLanguage: "ro",
    ...(a.data ? { datePublished: a.data } : {}),
    ...(a.actualizat || a.data ? { dateModified: a.actualizat || a.data } : {}),
    author: AUTOR_BLOG,
    publisher: {
      "@type": "EducationalOrganization",
      name: NUME_SITE,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: LOGO },
    },
  };
}
