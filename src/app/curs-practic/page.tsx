import Link from "next/link";
import { unitati, hrefModulCurs } from "@/lib/curs";
import { ICOANE_SUBLECTIE } from "@/lib/curriculum";
import { metadatePagina } from "@/lib/seo";

export const metadata = metadatePagina({
  titlu: "Curs practic de Python",
  descriere: "Curs de sine stătător, pentru orice vârstă — de la zero, direct în browser, spre automatizare și o primă incursiune în analiza de date. Primul modul e complet gratuit.",
  cale: "/curs-practic",
});

export default function CursPracticPage() {
  const primulModul = unitati[0]?.module[0];
  const nrModule = unitati.reduce((s, u) => s + u.module.length, 0);

  return (
    <div className="bg-[#FDFBF7] text-[#1E2430] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 bg-hero-glow rounded-3xl">
        <span className="inline-flex rounded-full bg-violet-50 border border-violet-200 px-3.5 py-1 text-xs font-bold text-violet-900 uppercase tracking-widest mb-3">
          Curs de sine stătător — pentru orice vârstă
        </span>
        <h1 className="text-3xl font-black text-[#1E2430] sm:text-4xl [font-family:var(--font-fraunces)]">
          Curs practic de Python
        </h1>
        <p className="mt-3 max-w-2xl text-[#525B6C] font-medium text-sm sm:text-base">
          Pentru orice persoană care vrea să învețe Python de la zero și să ajungă
          rapid la lucruri utile — automatizare de sarcini repetitive și o primă
          incursiune în analiza de date. Nu presupune cunoștințe anterioare de
          programare, și e complet separat de traseul școlar.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={primulModul ? hrefModulCurs(primulModul) : "#"}
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Începe modulul 1 — gratuit →
          </Link>
          <Link
            href="/curs-practic/preturi"
            className="rounded-xl border border-black/10 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand hover:text-brand"
          >
            Vezi planurile cursului
          </Link>
        </div>

        {/* Module deja publicate, navigabile */}
        <p className="mt-10 text-sm text-[#525B6C]">
          {unitati.length} unități, {nrModule} de module: de la prima linie de cod la un proiect final
          complet. Modulul 1 e gratuit — încearcă stilul cursului înainte de a te abona.
        </p>
        {unitati.map((unitate) => (
          <section key={unitate.slug} className="mt-8">
            <h2 className="text-xl font-black text-[#1E2430]">
              Unitatea {unitate.numar}: {unitate.titlu}
            </h2>
            <ol className="mt-4 space-y-3">
              {unitate.module.map((m) => (
                <li key={m.cod}>
                  <Link
                    href={hrefModulCurs(m)}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#EBE7DF] bg-white p-4 shadow-xs transition hover:border-brand hover:shadow-sm"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="text-xl" aria-hidden="true">
                        {m.sublectii[0] ? ICOANE_SUBLECTIE[m.sublectii[0].tip] : "📘"}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-black uppercase tracking-wider text-brand-dark">
                          Modulul {m.numar}
                        </p>
                        <p className="font-bold text-[#1E2430] text-sm">{m.titlu}</p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        m.gratuit ? "bg-emerald-50 text-success" : "bg-brand-light text-brand-dark"
                      }`}
                    >
                      {m.gratuit ? "gratuit" : "abonament"}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}

      </div>
    </div>
  );
}
