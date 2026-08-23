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
import { getPredicțiiClasa } from "@/lib/predicții";
import { getUtilizatorCurent, areAbonamentActiv } from "@/lib/subscription";

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

  const { meta } = await getUtilizatorCurent();
  const esteGratuit = modul.gratuit || modul.numar <= 5;
  const areAcces = esteGratuit || areAbonamentActiv(meta);

  const anterior = modulAnterior(clasa, modulSlug);
  const urmator = modulUrmator(clasa, modulSlug);

  const modulC = await getModulContinut(modul.cod);
  const areContinut = Boolean(modulC && modulC.sublectii.length > 0);

  // Recapitulare cumulativă (interleaving): la fiecare modul al cărui număr
  // e multiplu de 5, arătăm 2 predicții din module mai vechi ale clasei.
  const nrModul = modul.numar; // number
  const faceRecapitulare = nrModul % 5 === 0 && nrModul > 0;
  let recapitulare: { cod: string; enunt: string; variante: string[]; corect: number }[] = [];
  if (faceRecapitulare) {
    const toate = await getPredicțiiClasa(clasa);
    const anterioare = toate
      .filter((p) => {
        const m = p.cod.split(".");
        return parseInt(m[1], 10) < nrModul;
      })
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    recapitulare = anterioare;
  }

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
        ) : modul.numar <= 5 ? (
          <span className="rounded-full bg-brand-light px-2 py-0.5 text-[11px] font-bold text-brand-dark">
            acces deschis
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

      {/* Resurse și Exerciții Gratuite ale Modulului */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link
          href={`/resurse/${clasa}/${modulSlug}`}
          className="flex items-center justify-center gap-2 rounded-2xl border border-success/20 bg-success/5 hover:bg-success/10 p-3 text-center text-sm font-bold text-success transition"
        >
          <span>📂</span> Fișă de lucru (Teorie)
          <span className="rounded bg-success/20 px-1.5 py-0.5 text-[9px] font-bold text-success ml-1">Gratis</span>
        </Link>
        <Link
          href={`/exercitii/${clasa}/${modulSlug}`}
          className="flex items-center justify-center gap-2 rounded-2xl border border-success/20 bg-success/5 hover:bg-success/10 p-3 text-center text-sm font-bold text-success transition"
        >
          <span>📝</span> Exerciții practice
          <span className="rounded bg-success/20 px-1.5 py-0.5 text-[9px] font-bold text-success ml-1">Gratis</span>
        </Link>
      </div>

      {!areAcces && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-center">
          <p className="font-semibold text-amber-900">
            🔒 Acest modul necesită cont și abonament activ.
          </p>
          <p className="mt-1 text-sm text-amber-700">
            Deblochează toate modulele, testele și exercițiile practice de programare cu un abonament activ.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/preturi"
              className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Vezi planurile de abonament
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
          Structura modulului este pregătită. Conținutul sublecțiilor (explicații,
          exemple de cod, exerciții) va fi adăugat pas cu pas.
        </p>
      )}

      {faceRecapitulare && recapitulare.length > 0 && (
        <section className="mt-6 rounded-2xl border border-dashed border-brand-border bg-brand-light/30 p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-brand-dark">
            <span className="text-xl" aria-hidden="true">
              🔁
            </span>
            Recapitulare din modulele anterioare
          </h2>
          <p className="mt-1 text-sm text-foreground/70">
            Înainte de modulul nou, revino rapid la concepte de mai devreme — așa se
            fixează mai bine. Citește enunțul și alege răspunsul.
          </p>
          <ul className="mt-3 space-y-3">
            {recapitulare.map((r) => (
              <li
                key={r.cod}
                className="rounded-xl border border-black/5 bg-white p-3"
              >
                <p className="text-xs font-semibold text-muted">
                  Din modulul {r.cod.split(".").slice(0, 2).join(".")}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {r.enunt}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.variante.map((v, vi) => (
                    <span
                      key={vi}
                      className={`rounded-full border px-3 py-1 text-xs ${
                        vi === r.corect
                          ? "border-success bg-success/10 text-success"
                          : "border-black/10 text-foreground/70"
                      }`}
                    >
                      {v}
                      {vi === r.corect && " ✓"}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
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
                areAcces ? (
                  <Link
                    href={href}
                    className="self-center rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-white hover:bg-brand-dark"
                  >
                    Deschide →
                  </Link>
                ) : (
                  <Link
                    href="/preturi"
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
