import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getModulContinut } from "@/lib/sublectii";
import {
  capitole,
  getCapitol,
  getModul,
  hrefModul,
  ICOANE_SUBLECTIE,
  modulAnterior,
  modulUrmator,
} from "@/lib/curriculum";

type Params = { clasa: string; modulSlug: string };

export function generateStaticParams() {
  return capitole.flatMap((c) =>
    c.module.map((m) => ({ clasa: c.clasa, modulSlug: m.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { clasa, modulSlug } = await params;
  const modul = getModul(clasa, modulSlug);
  if (!modul) return {};

  return {
    title: `${modul.cod} ${modul.titlu} — Academia Python`,
    description: `Modul pentru clasa a ${clasa}-a, structurat în 6 sublecții: recapitulare, concept nou, citește și prezice, exerciții ghidate, exerciții independente, verificare.`,
  };
}

export default async function ModulPage({ params }: { params: Promise<Params> }) {
  const { clasa, modulSlug } = await params;
  const modul = getModul(clasa, modulSlug);
  const capitol = getCapitol(clasa);

  if (!modul || !capitol) notFound();

  const anterior = modulAnterior(clasa, modulSlug);
  const urmator = modulUrmator(clasa, modulSlug);

  const modulC = await getModulContinut(modul.cod);
  const areContinut = Boolean(modulC && modulC.sublectii.length > 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav className="text-sm text-muted">
        <Link href="/curriculum" className="hover:text-brand">
          Curriculum
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/curriculum/${clasa}`} className="hover:text-brand">
          Clasa a {clasa}-a
        </Link>
        <span className="mx-2">/</span>
        <span>Modulul {modul.numar}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          Modulul {modul.cod}
        </p>
        {modul.gratuit ? (
          <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-bold text-success">
            gratuit
          </span>
        ) : (
          <span className="rounded-full bg-brand-light px-2 py-0.5 text-[11px] font-bold text-brand-dark">
            necesită abonament
          </span>
        )}
      </div>

      <h1 className="mt-1 text-3xl font-extrabold leading-tight text-foreground">
        {modul.titlu}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {capitol.titlu} · 6 sublecții
      </p>

      {!areContinut && (
        <p className="mt-6 rounded-2xl border border-brand-border bg-brand-light/50 p-4 text-sm text-brand-dark">
          Structura modulului este pregătită. Conținutul sublecțiilor (explicații,
          exemple de cod, exerciții) va fi adăugat pas cu pas.
        </p>
      )}

      <ol className="mt-6 space-y-3">
        {modul.sublectii.map((s, i) => {
          const href = `/curriculum/${clasa}/${modul.slug}/${s.cod}`;
          const conteaza = areContinut;
          return (
            <li
              key={s.cod}
              className="flex items-start gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-lg">
                <span aria-hidden="true">{ICOANE_SUBLECTIE[s.tip]}</span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-muted">
                  {s.cod} · Pasul {i + 1} din 6
                </p>
                <p className="mt-0.5 font-semibold text-foreground">{s.titlu}</p>
                <p className="mt-1 text-sm text-muted">{s.descriere}</p>
              </div>
              {conteaza ? (
                <Link
                  href={href}
                  className="self-center rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-white hover:bg-brand-dark"
                >
                  Deschide →
                </Link>
              ) : (
                <span className="self-center rounded-full bg-surface px-2 py-1 text-[11px] font-semibold text-locked">
                  în pregătire
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <nav className="mt-10 flex flex-wrap justify-between gap-3 border-t border-border pt-6">
        {anterior ? (
          <Link
            href={hrefModul(anterior)}
            className="max-w-[45%] text-sm font-semibold text-brand hover:text-brand-dark"
          >
            ← {anterior.cod} {anterior.titlu}
          </Link>
        ) : (
          <span />
        )}
        {urmator && (
          <Link
            href={hrefModul(urmator)}
            className="max-w-[45%] text-right text-sm font-semibold text-brand hover:text-brand-dark"
          >
            {urmator.cod} {urmator.titlu} →
          </Link>
        )}
      </nav>
    </div>
  );
}
