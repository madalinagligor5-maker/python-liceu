import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { capitole, getCapitol, hrefModul, ICOANE_SUBLECTIE } from "@/lib/curriculum";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

type Params = { clasa: string };

export function generateStaticParams() {
  return capitole.map((c) => ({ clasa: c.clasa }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { clasa } = await params;
  const capitol = getCapitol(clasa);
  if (!capitol) return {};

  return {
    title: `Clasa a ${clasa}-a: ${capitol.titlu} — Academia Python`,
    description: `${capitol.module.length} module pentru clasa a ${clasa}-a, conform programei oficiale de Informatică.`,
    alternates: { canonical: `/curriculum/${clasa}` },
  };
}

export default async function CapitolPage({ params }: { params: Promise<Params> }) {
  const { clasa } = await params;
  const capitol = getCapitol(clasa);

  if (!capitol) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <BreadcrumbJsonLd
        firimituri={[
          { nume: "Curriculum", cale: "/curriculum" },
          { nume: `Clasa a ${capitol.clasa}-a` },
        ]}
      />
      <nav className="text-sm text-muted">
        <Link href="/curriculum" className="hover:text-brand">
          Curriculum
        </Link>
        <span className="mx-2">/</span>
        <span>Clasa a {capitol.clasa}-a</span>
      </nav>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand">
        Capitolul {capitol.numar}
      </p>
      <h1 className="mt-1 text-3xl font-extrabold text-foreground sm:text-4xl">
        {capitol.titlu}
      </h1>
      <p className="mt-2 text-sm text-muted">
        Clasa a {capitol.clasa}-a · {capitol.module.length} module ·{" "}
        {capitol.module.length * 6} sublecții
      </p>

      {capitol.clasa === "IX" && (
        <p className="mt-3 text-xs text-muted">
          Programa de mai jos reflectă schimbarea recentă la Informatică —{" "}
          <Link href="/blog/schimbari-bacalaureat-informatica-python-2030" className="font-semibold text-brand hover:underline">
            află ce se schimbă la Bacalaureatul de Informatică și de ce
          </Link>
          .
        </p>
      )}

      <nav aria-label="Alte clase" className="mt-6 flex flex-wrap gap-2">
        {capitole.map((c) => (
          <Link
            key={c.clasa}
            href={`/curriculum/${c.clasa}`}
            aria-current={c.clasa === capitol.clasa ? "page" : undefined}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              c.clasa === capitol.clasa
                ? "bg-brand text-white"
                : "border border-border bg-white text-foreground/70 hover:text-brand"
            }`}
          >
            Clasa {c.clasa}
          </Link>
        ))}
      </nav>

      <ol className="mt-8 space-y-3">
        {capitol.module.map((m) => (
          <li key={m.cod}>
            <Link
              href={hrefModul(m)}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm transition hover:border-brand/40 hover:shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-sm font-bold text-brand-dark">
                {m.numar}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">{m.titlu}</span>
                  {m.gratuit ? (
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-bold text-success">
                      gratuit
                    </span>
                  ) : m.numar <= 5 ? (
                    <span className="rounded-full bg-brand-light px-2 py-0.5 text-[11px] font-bold text-brand-dark">
                      acces deschis
                    </span>
                  ) : (
                    <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-bold text-locked">
                      necesită abonament
                    </span>
                  )}
                </span>
                <span className="mt-1 flex flex-wrap gap-1.5">
                  {m.sublectii.map((s) => (
                    <span
                      key={s.cod}
                      className="rounded-full bg-surface px-2 py-0.5 text-[11px] text-muted"
                      title={s.titlu}
                    >
                      {ICOANE_SUBLECTIE[s.tip]} {s.titlu}
                    </span>
                  ))}
                </span>
              </span>

              <span
                className="self-center text-brand opacity-0 transition group-hover:opacity-100"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
