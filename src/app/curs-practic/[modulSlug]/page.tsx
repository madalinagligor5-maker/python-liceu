import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getModulContinutCurs } from "@/lib/cursSublectii";
import {
  unitati,
  getModulCurs,
  getUnitatePentruModul,
  hrefModulCurs,
  modulCursAnterior,
  modulCursUrmator,
} from "@/lib/curs";
import { ICOANE_SUBLECTIE } from "@/lib/curriculum";
import { getUtilizatorCurent, areAbonamentCursActiv } from "@/lib/subscription";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

type Params = { modulSlug: string };

export function generateStaticParams() {
  return unitati.flatMap((u) => u.module.map((m) => ({ modulSlug: m.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { modulSlug } = await params;
  const modul = getModulCurs(modulSlug);
  if (!modul) return {};

  return {
    title: `${modul.cod} ${modul.titlu}`,
    description: `Modul din Cursul practic de Python, structurat în 6 sublecții: recapitulare, concept nou, citește și prezice, exerciții ghidate, exerciții independente, verificare.`,
    alternates: { canonical: `/curs-practic/${modulSlug}` },
  };
}

export default async function ModulCursPage({ params }: { params: Promise<Params> }) {
  const { modulSlug } = await params;
  const modul = getModulCurs(modulSlug);
  const unitate = modul ? getUnitatePentruModul(modul.cod) : undefined;

  if (!modul || !unitate) notFound();

  const { meta } = await getUtilizatorCurent();
  const areAcces = modul.gratuit || areAbonamentCursActiv(meta);

  const anterior = modulCursAnterior(modulSlug);
  const urmator = modulCursUrmator(modulSlug);

  const modulC = await getModulContinutCurs(modul.cod);
  const areContinut = Boolean(modulC && modulC.sublectii.length > 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <BreadcrumbJsonLd
        firimituri={[
          { nume: "Curs practic", cale: "/curs-practic" },
          { nume: unitate.titlu, cale: "/curs-practic" },
          { nume: `Modulul ${modul.numar}` },
        ]}
      />
      <nav className="text-sm text-muted">
        <Link href="/curs-practic" className="hover:text-brand">
          Curs practic
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
            gratuit — preview
          </span>
        ) : (
          <span className="rounded-full bg-brand-light px-2 py-0.5 text-[11px] font-bold text-brand-dark">
            necesită abonamentul cursului
          </span>
        )}
      </div>

      <h1 className="mt-1 text-3xl font-extrabold leading-tight text-foreground">
        {modul.titlu}
      </h1>
      <p className="mt-2 text-sm text-muted">
        Unitatea {unitate.numar}: {unitate.titlu} · 6 sublecții
      </p>

      {!areAcces && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-center">
          <p className="font-semibold text-amber-900">
            🔒 Acest modul necesită abonamentul Cursului practic de Python.
          </p>
          <p className="mt-1 text-sm text-amber-700">
            Modulul 1 e complet gratuit, ca să poți încerca stilul cursului înainte
            de a te abona.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/curs-practic/preturi"
              className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Vezi planurile cursului
            </Link>
            <Link
              href="/cont"
              className="rounded-xl border border-black/10 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand hover:text-brand"
            >
              Contul meu
            </Link>
          </div>
        </div>
      )}

      {!areContinut && (
        <p className="mt-6 rounded-2xl border border-brand-border bg-brand-light/50 p-4 text-sm text-brand-dark">
          Structura modulului este pregătită. Conținutul sublecțiilor va fi
          adăugat pas cu pas.
        </p>
      )}

      <ol className="mt-6 space-y-3">
        {modul.sublectii.map((s, i) => {
          const href = `/curs-practic/${modul.slug}/${s.cod}`;
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
                areAcces ? (
                  <Link
                    href={href}
                    className="self-center rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-white hover:bg-brand-dark"
                  >
                    Deschide →
                  </Link>
                ) : (
                  <Link
                    href="/curs-practic/preturi"
                    className="self-center rounded-full bg-amber-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-amber-600 flex items-center gap-1"
                  >
                    <span>🔒</span> Premium
                  </Link>
                )
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
            href={hrefModulCurs(anterior)}
            className="max-w-[45%] text-sm font-semibold text-brand hover:text-brand-dark"
          >
            ← {anterior.cod} {anterior.titlu}
          </Link>
        ) : (
          <span />
        )}
        {urmator && (
          <Link
            href={hrefModulCurs(urmator)}
            className="max-w-[45%] text-right text-sm font-semibold text-brand hover:text-brand-dark"
          >
            {urmator.cod} {urmator.titlu} →
          </Link>
        )}
      </nav>
    </div>
  );
}
