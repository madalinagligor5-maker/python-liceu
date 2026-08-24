import Link from "next/link";
import type { Metadata } from "next";
import { capitole, structura } from "@/lib/curriculum";
import ModuleListCollapsible from "@/components/ModuleListCollapsible";

export const metadata: Metadata = {
  title: "Curriculum complet — Academia Python",
  description:
    "Structura completă a cursului de Informatică pentru liceu: 4 capitole, 88 module, 528 sublecții, conform programei oficiale.",
};

export default function CurriculumPage() {
  const capitoleLiceu = capitole.filter((c) => !c.clasa.startsWith("P"));
  const nrCapitole = capitoleLiceu.length;
  const nrModule = capitoleLiceu.reduce((acc, c) => acc + c.module.length, 0);
  const nrSublectii = nrModule * 6;

  return (
    <div className="bg-[#FDFBF7] text-[#1E2430] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <span className="inline-flex rounded-full bg-indigo-50 border border-indigo-200 px-3.5 py-1 text-xs font-bold text-indigo-900 uppercase tracking-widest mb-3">
          Programa Școlară Oficială 2026
        </span>
        <h1 className="text-3xl font-black text-[#1E2430] sm:text-4xl">
          Curriculum complet de Informatică
        </h1>
        <p className="mt-3 max-w-2xl text-[#525B6C] font-medium text-sm sm:text-base">
          Structura cursului pentru clasele IX-XII, organizată ca{" "}
          <strong className="text-amber-600 font-bold">capitol → modul → sublecții</strong>. Fiecare modul urmează același șablon de 6 sublecții interactive.
        </p>

        <div className="mt-6 rounded-3xl border border-[#EBE7DF] bg-white p-5 text-xs sm:text-sm text-[#1E2430] shadow-xs">
          <p className="font-extrabold text-amber-700 text-sm mb-1">
            📜 Ordinul Ministrului Educației nr. 4.370/2026
          </p>
          <p className="leading-relaxed text-[#525B6C]">
            Lecțiile sunt aliniate programei de <strong>Matematică-Informatică (intensiv)</strong>. Conținutul acoperă algoritmi, structuri de date, programare orientată pe obiecte și pregătire completă pentru Bacalaureat și Olimpiade.
          </p>
        </div>

        {/* Statistici rapide */}
        <dl className="mt-8 grid grid-cols-3 gap-4 sm:max-w-md">
          {[
            ["Capitole", nrCapitole],
            ["Module", nrModule],
            ["Sublecții", nrSublectii],
          ].map(([eticheta, valoare]) => (
            <div
              key={String(eticheta)}
              className="rounded-2xl border border-[#EBE7DF] bg-white p-4 text-center shadow-xs"
            >
              <dt className="text-[10px] font-extrabold uppercase tracking-widest text-[#525B6C]">{eticheta}</dt>
              <dd className="text-2xl font-black text-amber-600 mt-1">{valoare}</dd>
            </div>
          ))}
        </dl>

        {/* Șablonul lecțiilor */}
        <section className="mt-12">
          <h2 className="text-xl font-black text-[#1E2430]">Șablonul celor 6 pași ai unei lecții</h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {structura.sablon_sublectii.map((s, i) => (
              <li
                key={s.titlu}
                className="rounded-2xl border border-[#EBE7DF] bg-white p-4 shadow-xs"
              >
                <span className="text-xs font-black text-amber-600">Pasul {i + 1}</span>
                <p className="mt-1 font-bold text-[#1E2430] text-sm">{s.titlu}</p>
                <p className="mt-1 text-xs text-[#525B6C]">{s.descriere}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Lista capitolelor IX - XII */}
        <section className="mt-12 space-y-6">
          {capitoleLiceu.map((c) => (
            <article
              key={c.clasa}
              className="rounded-3xl border border-[#EBE7DF] bg-white p-6 shadow-xs"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-amber-600">
                    Capitolul {c.numar} · Clasa a {c.clasa}-a
                  </p>
                  <h3 className="mt-1 text-xl font-black text-[#1E2430]">{c.titlu}</h3>
                  <p className="mt-1 text-xs text-[#525B6C] font-medium">
                    {c.module.length} module · {c.module.length * 6} sublecții
                  </p>
                </div>
                <Link
                  href={`/curriculum/${c.clasa}`}
                  className="rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-5 py-2.5 text-xs shadow-xs transition active:scale-95"
                >
                  Vezi modulele →
                </Link>
              </div>

              <div className="mt-4 text-[#525B6C]">
                <ModuleListCollapsible module={c.module} clasa={c.clasa} />
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
