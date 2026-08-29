import type { Metadata } from "next";
import Link from "next/link";
import { getToateArticolele } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Academia Python",
  description:
    "Ghiduri Python, noutăți despre programa de Informatică la liceu și materiale utile pentru elevii care se pregătesc pentru Bacalaureat.",
  alternates: { canonical: "/blog" },
};

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

export default async function BlogPage() {
  const articole = await getToateArticolele();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">Blog</p>
      <h1 className="mt-1 text-3xl font-extrabold text-foreground sm:text-4xl [font-family:var(--font-fraunces)]">
        Ghiduri și noutăți
      </h1>
      <p className="mt-2 text-sm text-muted">
        Articole despre programa de Informatică, Bacalaureat și Python pentru liceu.
      </p>

      {articole.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-foreground/60">
            Nu există încă niciun articol publicat. Revino în curând.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {articole.map((articol) => (
            <Link
              key={articol.slug}
              href={`/blog/${articol.slug}`}
              className="block rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:border-brand/40 hover:shadow-md sm:p-6"
            >
              <p className="text-xs font-medium text-muted">{formateazaData(articol.data)}</p>
              <h2 className="mt-1 text-lg font-bold text-foreground sm:text-xl [font-family:var(--font-fraunces)]">
                {articol.titlu}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                {articol.descriere}
              </p>
              <span className="mt-3 inline-block text-sm font-semibold text-brand">
                Citește articolul →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
