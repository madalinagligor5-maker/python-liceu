import type { MetadataRoute } from "next";
import { capitole, esteCapitolCopii, hrefModul } from "@/lib/curriculum";
import { toateModuleleCurs, hrefModulCurs } from "@/lib/curs";
import { exercitiiPracticeLiberAccesibile } from "@/lib/acces";
import { getToateArticolele } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo";
import { ceaMaiRecenta, dataModificareFisier, fisierContinutModul } from "@/lib/dateModificare";

/**
 * Sitemap-ul conține DOAR paginile indexabile, cu adresa canonică:
 *  - fără sublecții (curriculum și curs practic): au noindex și canonical
 *    către pagina de modul (vezi src/lib/seoModul.ts);
 *  - fără rutele blocate în robots.txt (cont, login, admin, profesor…);
 *  - fără paginile cu noindex (Kids Junior, vizualizatorul PDF);
 *  - legalele doar în forma canonică (/termeni și /confidentialitate fac 301).
 *
 * lastModified: data reală din Git a fișierului din care se generează pagina
 * (lecțiile Markdown pentru module, page.tsx pentru paginile statice) sau
 * data din frontmatter pentru articole. Lipsește când nu e cunoscută.
 */

type Intrare = MetadataRoute.Sitemap[number];

const url = (cale: string) => (cale === "/" ? SITE_URL : `${SITE_URL}${cale}`);

function pagina(cale: string, priority: number, fisiere: string[] = []): Intrare {
  const lastModified = ceaMaiRecenta(...fisiere.map(dataModificareFisier));
  return { url: url(cale), priority, ...(lastModified ? { lastModified } : {}) };
}

/** Fișierul page.tsx al unei rute statice simple. */
const pageTsx = (cale: string) => (cale === "/" ? "src/app/page.tsx" : `src/app${cale}/page.tsx`);
const statica = (cale: string, priority: number) => pagina(cale, priority, [pageTsx(cale)]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dataModul = (cod: string) => {
    const f = fisierContinutModul(cod);
    return f ? dataModificareFisier(f) : undefined;
  };

  // Curriculum: clasele de gimnaziu și liceu (VII–XII) și capitolele
  // „Python pentru copii" (P7–P11, partea publică a zonei Kids).
  const clase: Intrare[] = capitole.map((cap) => {
    const lastModified = ceaMaiRecenta(
      dataModificareFisier("src/app/curriculum/[clasa]/page.tsx"),
      ...cap.module.map((m) => dataModul(m.cod))
    );
    return {
      url: url(`/curriculum/${cap.clasa}`),
      priority: esteCapitolCopii(cap.clasa) ? 0.7 : 0.9,
      ...(lastModified ? { lastModified } : {}),
    };
  });

  const paginiModule: Intrare[] = capitole.flatMap((cap) =>
    cap.module.map((m) => {
      const lastModified = dataModul(m.cod);
      return {
        url: url(hrefModul(m)),
        priority: esteCapitolCopii(cap.clasa) ? 0.6 : 0.8,
        ...(lastModified ? { lastModified } : {}),
      };
    })
  );

  const moduleCurs: Intrare[] = toateModuleleCurs().map((m) => {
    const lastModified = dataModul(m.cod);
    return { url: url(hrefModulCurs(m)), priority: 0.7, ...(lastModified ? { lastModified } : {}) };
  });

  // Exerciții practice: doar modulele fără abonament (celelalte fac redirect
  // spre /login sau /preturi pentru un vizitator anonim, deci și pentru Google).
  const exercitii: Intrare[] = capitole.flatMap((cap) =>
    cap.module
      .filter((m) => exercitiiPracticeLiberAccesibile(m, cap.clasa))
      .map((m) => pagina(`/exercitii/${cap.clasa}/${m.slug}`, 0.5, ["content/exercitii.json"]))
  );

  const resurseClase: Intrare[] = capitole.map((cap) =>
    pagina(`/resurse/${cap.clasa}`, 0.4, ["src/app/resurse/[clasa]/page.tsx"])
  );

  const articole = await getToateArticolele();
  const blog: Intrare[] = articole.map((a) => ({
    url: url(`/blog/${a.slug}`),
    priority: 0.7,
    ...(a.actualizat || a.data ? { lastModified: new Date(a.actualizat || a.data) } : {}),
  }));
  const ultimulArticol = ceaMaiRecenta(...blog.map((b) => (b.lastModified ? new Date(b.lastModified) : undefined)));

  return [
    statica("/", 1),
    statica("/curriculum", 0.9),
    ...clase,
    ...paginiModule,
    statica("/start", 0.8),
    statica("/preturi", 0.6),
    statica("/lab", 0.6),
    { url: url("/blog"), priority: 0.7, ...(ultimulArticol ? { lastModified: ultimulArticol } : {}) },
    ...blog,
    statica("/curs-practic", 0.8),
    ...moduleCurs,
    statica("/curs-practic/preturi", 0.6),
    statica("/kids", 0.7),
    ...[1, 2, 3].map((n) => pagina(`/kids/aventura/${n}`, 0.5, ["src/app/kids/aventura/[nivelId]/page.tsx"])),
    statica("/kids/fise-print", 0.5),
    statica("/profesori", 0.6),
    statica("/despre", 0.5),
    statica("/exercitii", 0.5),
    ...exercitii,
    statica("/resurse", 0.5),
    ...resurseClase,
    statica("/tombola", 0.3),
    statica("/termeni-si-conditii", 0.2),
    statica("/politica-de-confidentialitate", 0.2),
    statica("/politica-de-rambursare", 0.2),
  ];
}
