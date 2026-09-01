import { promises as fs } from "fs";
import path from "path";
import { parseazaFrontmatter, randeazaMarkdown } from "@/lib/blog";

/**
 * Loader pentru secțiunea „Materiale" din zona de profesor — după modelul
 * „un fișier = o unitate de conținut" deja folosit la blog și planificări:
 * fiecare resursă e un fișier .md în content/materiale-profesori/, descoperit
 * cu fs.readdir (nu o listă hardcodată), ca un material nou să însemne doar
 * "adaugă un fișier", nu "modifică și componenta".
 *
 * Două tipuri de material:
 *  - "link": trimite direct la un URL (intern sau extern) — ex. exemplul de
 *    planificare deja generată, care e chiar endpoint-ul de PDF existent.
 *  - "pdf": are corp propriu în Markdown, afișat pe pagină și descărcabil ca
 *    PDF prin /api/profesor-pdf/material/[slug] (aceeași infrastructură din
 *    Sarcina 2, nu o metodă nouă).
 */

export type MaterialProfesor = {
  titlu: string;
  slug: string;
  descriere: string;
  tip: "link" | "pdf";
  href?: string; // doar pentru tip "link"
  ciorna: boolean;
};

export type MaterialProfesorComplet = MaterialProfesor & {
  corpHtml: string;
  corpText: string;
};

const DIR = path.join(process.cwd(), "content", "materiale-profesori");

let cache: MaterialProfesorComplet[] | null = null;

async function incarcaToate(): Promise<MaterialProfesorComplet[]> {
  if (cache) return cache;

  let fisiere: string[] = [];
  try {
    fisiere = (await fs.readdir(DIR)).filter((f) => f.endsWith(".md"));
  } catch {
    cache = [];
    return cache;
  }

  const materiale: MaterialProfesorComplet[] = [];
  for (const fisier of fisiere) {
    const raw = await fs.readFile(path.join(DIR, fisier), "utf-8");
    const { meta, corp } = parseazaFrontmatter(raw);
    if (!meta.slug || !meta.titlu) continue;
    materiale.push({
      titlu: meta.titlu,
      slug: meta.slug,
      descriere: meta.descriere ?? "",
      tip: meta.tip === "link" ? "link" : "pdf",
      href: meta.href || undefined,
      ciorna: meta.ciorna === "true",
      corpHtml: randeazaMarkdown(corp),
      corpText: corp,
    });
  }

  materiale.sort((a, b) => a.titlu.localeCompare(b.titlu, "ro"));
  cache = materiale;
  return cache;
}

export async function getToateMaterialele(): Promise<MaterialProfesor[]> {
  const toate = await incarcaToate();
  return toate.map(({ titlu, slug, descriere, tip, href, ciorna }) => ({
    titlu,
    slug,
    descriere,
    tip,
    href,
    ciorna,
  }));
}

export async function getMaterialDupaSlug(slug: string): Promise<MaterialProfesorComplet | undefined> {
  const toate = await incarcaToate();
  return toate.find((m) => m.slug === slug);
}
