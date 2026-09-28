import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { capitole, esteCapitolCopii, getCapitol, hrefModul, ICOANE_SUBLECTIE, numeClasa, numeClasaScurt, radacinaClasa } from "@/lib/curriculum";
import { ETICHETE_ACCES, nivelAccesLectii } from "@/lib/acces";
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
    title: esteCapitolCopii(capitol.clasa) ? capitol.titlu : `${numeClasa(capitol.clasa)}: ${capitol.titlu}`,
    description: esteCapitolCopii(capitol.clasa)
      ? `${capitol.module.length} module de Python pentru copii (${numeClasaScurt(capitol.clasa)}), gratuite, direct în browser.`
      : `${capitol.module.length} module de Informatică (Python) pentru ${numeClasa(capitol.clasa).toLowerCase()}, organizate pe pași.`,
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
          radacinaClasa(capitol.clasa),
          { nume: numeClasa(capitol.clasa) },
        ]}
      />
      <nav className="text-sm text-muted">
        <Link href={radacinaClasa(capitol.clasa).cale} className="hover:text-brand">
          {radacinaClasa(capitol.clasa).nume}
        </Link>
        <span className="mx-2">/</span>
        <span>{numeClasa(capitol.clasa)}</span>
      </nav>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand">
        Capitolul {capitol.numar}
      </p>
      <h1 className="mt-1 text-3xl font-extrabold text-foreground sm:text-4xl">
        {capitol.titlu}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {numeClasa(capitol.clasa)} · {capitol.module.length} module · câte 6 pași fiecare
      </p>

      {capitol.clasa === "IX" && (
        <p className="mt-3 text-xs text-muted">
          Modulele urmează noua programă de Informatică pentru clasa a IX-a (specializarea matematică-informatică),
          aplicată din anul școlar 2026–2027. Pentru context, vezi{" "}
          <Link href="/blog/schimbari-bacalaureat-informatica-python-2030" className="font-semibold text-brand hover:underline">
            articolul despre schimbările la Informatică
          </Link>
          .
        </p>
      )}

      <nav aria-label={esteCapitolCopii(capitol.clasa) ? "Alte vârste" : "Alte clase"} className="mt-6 flex flex-wrap gap-2">
        {capitole
          .filter((c) => esteCapitolCopii(c.clasa) === esteCapitolCopii(capitol.clasa))
          .map((c) => (
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
            {numeClasaScurt(c.clasa)}
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
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${ETICHETE_ACCES[nivelAccesLectii(m)].clasa}`}
                    title={ETICHETE_ACCES[nivelAccesLectii(m)].explicatie}
                  >
                    {ETICHETE_ACCES[nivelAccesLectii(m)].text}
                  </span>
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
