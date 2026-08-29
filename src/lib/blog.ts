import { promises as fs } from "fs";
import path from "path";

/**
 * Loader + parser pentru articolele de blog — independent de
 * markdownMini.ts/sublectii.ts (acelea sunt construite strict pentru
 * structura rigidă a unei sublecții și nu trebuie atinse).
 *
 * Fiecare articol e un fișier `.md` în content/blog/, cu un bloc de
 * metadate (frontmatter) la început:
 *
 *   ---
 *   titlu: ...
 *   slug: ...
 *   data: 2026-08-26
 *   descriere: ...
 *   ---
 *   corpul articolului, Markdown obișnuit
 *
 * Fișierele sunt descoperite cu fs.readdir (nu o listă hardcodată) — un
 * articol nou înseamnă doar "adaugă un fișier", nu "modifică și codul".
 */

export type ArticolBlogRezumat = {
  titlu: string;
  /** Titlu separat pentru <title>/SEO, dacă diferă de titlul afișat (H1) —
   *  opțional, din frontmatter "titlu_seo"; dacă lipsește, se folosește `titlu`. */
  titluSeo?: string;
  slug: string;
  data: string; // "YYYY-MM-DD", ca text — suficient pentru sortare și afișare
  descriere: string;
};

export type ArticolBlog = ArticolBlogRezumat & {
  corpHtml: string;
};

const DIR_BLOG = path.join(process.cwd(), "content", "blog");

let cache: ArticolBlog[] | null = null;

/** Scapă caractere HTML periculoase — totul trece prin asta înainte de a
 *  deveni markup, ca articolele să nu poată injecta HTML brut. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Markdown inline: linkuri, **bold**, *italic*, `cod` — pe text deja
 *  scăpat de HTML, ca formatarea să nu poată reintroduce markup brut. */
function inline(text: string): string {
  let out = escapeHtml(text);

  // [text](url) — înaintea bold/italic, ca parantezele/asteriscurile din
  // interiorul linkului să nu fie interpretate greșit.
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, txt: string, url: string) => {
    const urlCurat = url.trim();
    // Doar linkuri http(s), relative sau ancore — nu javascript:/data:.
    const eSigur = /^(https?:\/\/|\/|#)/i.test(urlCurat);
    const href = eSigur ? urlCurat : "#";
    const extern = /^https?:\/\//i.test(urlCurat);
    const relAttr = extern ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${href}" class="text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark"${relAttr}>${txt}</a>`;
  });

  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>");
  out = out.replace(
    /`([^`]+)`/g,
    '<code class="rounded bg-black/5 px-1.5 py-0.5 font-mono text-[0.9em]">$1</code>'
  );

  return out;
}

/** Randează corpul Markdown al unui articol în HTML — headinguri #/##/###,
 *  paragrafe, liste (ordonate/neordonate), blocuri de cod, link-uri. */
function randeazaMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const linie = lines[i];

    if (linie.trim() === "") {
      i++;
      continue;
    }

    // Bloc de cod ```lang ... ```
    if (linie.trimStart().startsWith("```")) {
      i++;
      const cod: string[] = [];
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        cod.push(lines[i]);
        i++;
      }
      i++; // sări ``` de închidere
      out.push(
        `<pre class="rounded-xl bg-[#1e1b3a] p-4 overflow-x-auto shadow-depth-md"><code class="font-mono text-sm text-white leading-relaxed">${escapeHtml(
          cod.join("\n")
        )}</code></pre>`
      );
      continue;
    }

    // Citat: linii consecutive care încep cu ">"
    if (linie.trim().startsWith(">")) {
      const citat: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        citat.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      out.push(
        `<blockquote class="my-4 border-l-4 border-brand bg-brand-light/30 py-2 pl-4 italic text-foreground/80">${citat
          .filter((l) => l.trim() !== "")
          .map((l) => `<p>${inline(l)}</p>`)
          .join("")}</blockquote>`
      );
      continue;
    }

    // Heading # / ## / ###
    const hMatch = linie.match(/^(#{1,3})\s+(.+)$/);
    if (hMatch) {
      const nivel = hMatch[1].length;
      const clasa =
        nivel === 1
          ? "mt-10 text-2xl font-extrabold text-foreground [font-family:var(--font-fraunces)]"
          : nivel === 2
            ? "mt-8 text-xl font-bold text-foreground [font-family:var(--font-fraunces)]"
            : "mt-6 text-lg font-bold text-foreground";
      out.push(`<h${nivel} class="${clasa}">${inline(hMatch[2].trim())}</h${nivel}>`);
      i++;
      continue;
    }

    // Listă (- sau 1.)
    if (/^\s*([-*]|\d+\.)\s+/.test(linie)) {
      const ordonata = /^\s*\d+\.\s+/.test(linie);
      const itemi: string[] = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        const m = lines[i].match(/^\s*(?:[-*]|\d+\.)\s+(.*)$/);
        if (m) itemi.push(`<li>${inline(m[1])}</li>`);
        i++;
      }
      const tag = ordonata ? "ol" : "ul";
      const clasaLista = ordonata ? "list-decimal" : "list-disc";
      out.push(`<${tag} class="${clasaLista} pl-6 space-y-1.5">${itemi.join("")}</${tag}>`);
      continue;
    }

    // Tabel Markdown: | col | col |  urmat de un rând separator | --- | --- |
    if (
      linie.trim().startsWith("|") &&
      i + 1 < lines.length &&
      /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(lines[i + 1])
    ) {
      const impartRand = (l: string) =>
        l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
      const antet = impartRand(linie);
      i += 2; // sari rândul de separare
      const randuri: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        randuri.push(impartRand(lines[i]));
        i++;
      }
      const thead = `<thead><tr>${antet
        .map(
          (c) =>
            `<th class="border-b-2 border-brand-border bg-brand-light/40 px-3 py-2 text-left font-bold text-foreground">${inline(c)}</th>`
        )
        .join("")}</tr></thead>`;
      const tbody = `<tbody>${randuri
        .map(
          (r) =>
            `<tr>${r
              .map((c) => `<td class="border-b border-border px-3 py-2 align-top">${inline(c)}</td>`)
              .join("")}</tr>`
        )
        .join("")}</tbody>`;
      out.push(
        `<div class="overflow-x-auto rounded-xl border border-border shadow-depth-sm"><table class="w-full text-sm">${thead}${tbody}</table></div>`
      );
      continue;
    }

    // Paragraf — linii consecutive nevide, unite cu spațiu.
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trimStart().startsWith("```") &&
      !/^#{1,3}\s+/.test(lines[i]) &&
      !/^\s*([-*]|\d+\.)\s+/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    out.push(`<p>${inline(para.join(" "))}</p>`);
  }

  return out.join("\n");
}

function parseazaFrontmatter(raw: string): { meta: Record<string, string>; corp: string } {
  const normalizat = raw.replace(/\r\n/g, "\n");
  const match = normalizat.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, corp: normalizat };

  const [, blocMeta, corp] = match;
  const meta: Record<string, string> = {};
  for (const linie of blocMeta.split("\n")) {
    const m = linie.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (m) meta[m[1]] = m[2].trim();
  }
  return { meta, corp };
}

async function incarcaToate(): Promise<ArticolBlog[]> {
  if (cache) return cache;

  let fisiere: string[] = [];
  try {
    fisiere = (await fs.readdir(DIR_BLOG)).filter((f) => f.endsWith(".md"));
  } catch {
    // Directorul poate lipsi dacă nu există încă niciun articol.
    cache = [];
    return cache;
  }

  const articole: ArticolBlog[] = [];
  for (const fisier of fisiere) {
    const raw = await fs.readFile(path.join(DIR_BLOG, fisier), "utf-8");
    const { meta, corp } = parseazaFrontmatter(raw);
    if (!meta.slug || !meta.titlu) continue; // frontmatter incomplet — sărit
    articole.push({
      titlu: meta.titlu,
      titluSeo: meta.titlu_seo || undefined,
      slug: meta.slug,
      data: meta.data ?? "",
      descriere: meta.descriere ?? "",
      corpHtml: randeazaMarkdown(corp),
    });
  }

  articole.sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));

  cache = articole;
  return cache;
}

/** Lista articolelor pentru pagina /blog — fără corpul complet. */
export async function getToateArticolele(): Promise<ArticolBlogRezumat[]> {
  const toate = await incarcaToate();
  return toate.map((articol) => ({
    titlu: articol.titlu,
    titluSeo: articol.titluSeo,
    slug: articol.slug,
    data: articol.data,
    descriere: articol.descriere,
  }));
}

/** Un articol complet (cu HTML randat) pentru pagina /blog/[slug]. */
export async function getArticolDupaSlug(slug: string): Promise<ArticolBlog | undefined> {
  const toate = await incarcaToate();
  return toate.find((a) => a.slug === slug);
}
