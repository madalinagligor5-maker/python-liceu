import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticolDupaSlug, getToateArticolele } from "@/lib/blog";
import JsonLd from "@/components/seo/JsonLd";
import { articolBlog } from "@/lib/dateStructurate";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { metadatePagina, SITE_URL } from "@/lib/seo";

type Params = { slug: string };

export async function generateStaticParams() {
  const articole = await getToateArticolele();
  return articole.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const articol = await getArticolDupaSlug(slug);
  if (!articol) return {};

  const titluPagina = articol.titluSeo || articol.titlu;

  return metadatePagina({
    titlu: titluPagina,
    descriere: articol.descriere,
    cale: `/blog/${articol.slug}`,
    tip: "article",
    publicatLa: articol.data,
    modificatLa: articol.actualizat,
    imagineImplicita: false,
  });
}

function formateazaData(data: string): string {
  if (!data) return "";
  const d = new Date(`${data}T00:00:00`);
  if (Number.isNaN(d.getTime())) return data;
  return new Intl.DateTimeFormat("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export default async function ArticolBlogPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const articol = await getArticolDupaSlug(slug);

  if (!articol) notFound();

  // Articole similare: celelalte articole, cele mai recente întâi.
  const altele = (await getToateArticolele()).filter((a) => a.slug !== articol.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <JsonLd
        date={articolBlog({
          titlu: articol.titluSeo || articol.titlu,
          descriere: articol.descriere,
          slug: articol.slug,
          data: articol.data,
          actualizat: articol.actualizat,
          imagine: `${SITE_URL}/blog/${articol.slug}/opengraph-image`,
        })}
      />
      {articol.intrebariFrecvente.length > 0 && <FaqJsonLd intrebari={articol.intrebariFrecvente} />}
      <BreadcrumbJsonLd
        firimituri={[
          { nume: "Blog", cale: "/blog" },
          { nume: articol.titlu },
        ]}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-foreground/70">
        <Link href="/blog" className="hover:text-brand">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span>{articol.titlu}</span>
      </nav>

      <article className="mt-4">
        <p className="text-xs font-medium text-foreground/70">
          {formateazaData(articol.data)}
          {articol.actualizat && articol.actualizat !== articol.data && (
            <> · actualizat {formateazaData(articol.actualizat)}</>
          )}
          {" "}· {articol.minuteCitire} min de citit
        </p>
        <h1 className="mt-1 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl [font-family:var(--font-fraunces)]">
          {articol.titlu}
        </h1>

        {articol.cuprins.length >= 3 && (
          <nav aria-label="Cuprins" className="mt-6 rounded-2xl border border-border bg-white p-4">
            <p className="text-sm font-bold text-foreground">Cuprins</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
              {articol.cuprins.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className="text-brand-dark underline-offset-2 hover:underline">
                    {c.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div
          className="mt-8 max-w-[68ch] space-y-4 text-[15.5px] leading-[1.75] text-foreground/90 [&_a]:break-words [&_code]:break-words [&_li]:ml-1 [&_p+p]:mt-4"
          dangerouslySetInnerHTML={{ __html: articol.corpHtml }}
        />
      </article>

      <div className="mt-12 rounded-2xl border border-brand-border bg-brand-light/40 p-6 text-center">
        <p className="text-base font-semibold text-brand-dark">
          Încearcă direct: prima lecție e gratuită.
        </p>
        <p className="mt-1 text-sm text-foreground/70">
          Fără cont, fără card, fără instalare — scrii cod în browser și vezi imediat rezultatul.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/start"
            className="rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-amber-500"
          >
            Începe gratuit →
          </Link>
          <Link
            href="/lab"
            className="rounded-lg border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-amber-400"
          >
            Deschide laboratorul Python
          </Link>
        </div>
      </div>

      {altele.length > 0 && (
        <section className="mt-12" aria-labelledby="articole-similare">
          <h2 id="articole-similare" className="text-lg font-bold text-foreground">Citește și</h2>
          <ul className="mt-3 space-y-3">
            {altele.map((a) => (
              <li key={a.slug}>
                <Link href={`/blog/${a.slug}`} className="block rounded-xl border border-border bg-white p-4 hover:border-brand/40">
                  <span className="font-semibold text-foreground">{a.titlu}</span>
                  <span className="mt-1 block text-sm text-foreground/70">{a.descriere}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link href="/blog" className="mt-8 inline-block text-sm font-semibold text-brand-dark hover:text-brand">
        ← Înapoi la blog
      </Link>
    </div>
  );
}
