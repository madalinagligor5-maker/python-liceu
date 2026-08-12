import Link from "next/link";
import type { Metadata } from "next";
import { capitole, structura } from "@/lib/curriculum";

export const metadata: Metadata = {
  title: "Curriculum complet — Academia Python",
  description:
    "Structura completă a cursului de Informatică pentru liceu: 4 capitole, 88 module, 528 sublecții, conform programei oficiale.",
};

export default function CurriculumPage() {
  const { capitole: nrCapitole, module: nrModule, sublectii: nrSublectii } =
    structura.statistici;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
        Curriculum complet
      </h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        Structura cursului pentru clasele IX-XII, organizată ca{" "}
        <strong>capitol → modul → sublecții</strong>. Fiecare modul urmează același
        șablon de 6 sublecții, ca să știi mereu unde ești în lecție.
      </p>
      <p className="mt-2 text-xs text-muted">Sursă: {structura.sursa}</p>

      <dl className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
        {[
          ["Capitole", nrCapitole],
          ["Module", nrModule],
          ["Sublecții", nrSublectii],
        ].map(([eticheta, valoare]) => (
          <div
            key={String(eticheta)}
            className="rounded-2xl border border-border bg-white p-4 text-center shadow-sm"
          >
            <dt className="text-xs font-semibold uppercase text-muted">{eticheta}</dt>
            <dd className="text-2xl font-extrabold text-brand">{valoare}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-foreground">Șablonul unei lecții</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {structura.sablon_sublectii.map((s, i) => (
            <li
              key={s.titlu}
              className="rounded-2xl border border-border bg-white p-4 shadow-sm"
            >
              <span className="text-xs font-bold text-brand">Pasul {i + 1}</span>
              <p className="mt-1 font-semibold text-foreground">{s.titlu}</p>
              <p className="mt-1 text-xs text-muted">{s.descriere}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 space-y-5">
        {capitole.map((c) => (
          <article
            key={c.clasa}
            className="rounded-2xl border border-border bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                  Capitolul {c.numar} · Clasa a {c.clasa}-a
                </p>
                <h3 className="mt-1 text-lg font-bold text-foreground">{c.titlu}</h3>
                <p className="mt-1 text-sm text-muted">
                  {c.module.length} module · {c.module.length * 6} sublecții
                </p>
              </div>
              <Link
                href={`/curriculum/${c.clasa}`}
                className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Vezi modulele →
              </Link>
            </div>

            <ul className="mt-4 flex flex-wrap gap-2">
              {c.module.slice(0, 6).map((m) => (
                <li
                  key={m.cod}
                  className="rounded-full bg-surface px-3 py-1 text-xs text-foreground/70"
                >
                  {m.cod} {m.titlu}
                </li>
              ))}
              {c.module.length > 6 && (
                <li className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">
                  +{c.module.length - 6} module
                </li>
              )}
            </ul>
          </article>
        ))}
      </section>
    </div>
  );
}
