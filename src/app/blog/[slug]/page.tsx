import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticolDupaSlug, getToateArticolele } from "@/lib/blog";
import ArticleJsonLd from "@/components/seo/ArticleJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

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

  return {
    title: `${titluPagina} — Academia Python`,
    description: articol.descriere,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: titluPagina,
      description: articol.descriere,
      url: `/blog/${slug}`,
      publishedTime: articol.data || undefined,
    },
  };
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <ArticleJsonLd
        titlu={articol.titluSeo || articol.titlu}
        descriere={articol.descriere}
        data={articol.data}
        slug={articol.slug}
      />
      <BreadcrumbJsonLd
        firimituri={[
          { nume: "Blog", cale: "/blog" },
          { nume: articol.titlu },
        ]}
      />
      <nav className="text-sm text-muted">
        <Link href="/blog" className="hover:text-brand">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span>{articol.titlu}</span>
      </nav>

      <article className="mt-4">
        <p className="text-xs font-medium text-muted">{formateazaData(articol.data)}</p>
        <h1 className="mt-1 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl [font-family:var(--font-fraunces)]">
          {articol.titlu}
        </h1>

        <div
          className="mt-8 max-w-[68ch] space-y-4 text-[15.5px] leading-[1.75] text-foreground/90 [&_a]:break-words [&_code]:break-words [&_li]:ml-1 [&_p+p]:mt-4"
          dangerouslySetInnerHTML={{ __html: articol.corpHtml }}
        />
      </article>

      <div className="mt-12 rounded-2xl border border-brand-border bg-brand-light/40 p-6 text-center">
        <p className="text-base font-semibold text-brand-dark">
          Vrei să încerci? Prima lecție e gratuită.
        </p>
        <p className="mt-1 text-sm text-foreground/70">
          Fără card, fără cont — începi direct din curriculum.
        </p>
        <Link
          href="/curriculum"
          className="mt-4 inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          Începe acum →
        </Link>
      </div>

      <Link href="/blog" className="mt-8 inline-block text-sm font-semibold text-brand hover:text-brand-dark">
        ← Înapoi la blog
      </Link>
    </div>
  );
}
