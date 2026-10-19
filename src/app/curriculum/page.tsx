import Link from "next/link";
import { capitole, numeClasa, numeClasaInText, structura } from "@/lib/curriculum";
import ModuleListCollapsible from "@/components/ModuleListCollapsible";
import { metadatePagina } from "@/lib/seo";
import { TRASEE } from "@/lib/trasee";

export const metadata = metadatePagina({
  titlu: "Curriculum de Informatică în Python, clasele VII–XII",
  descriere:
    "Structura lecțiilor de Informatică în Python: gimnaziu (clasele VII–VIII) și liceu (clasele IX–XII, 4 capitole, 88 de module), fiecare modul în 6 pași.",
  cale: "/curriculum",
});

export default function CurriculumPage() {
  // Pagina asta e legată explicit de Ordinul 4.370/2026 (profil
  // Matematică-Informatică) — gimnaziul (VII/VIII) are propria programă
  // (OMEN 3393/2017) și propriile pagini /curriculum/VII, /curriculum/VIII,
  // dar nu aparține acestui rezumat de liceu.
  const capitoleLiceu = capitole.filter(
    (c) => !c.clasa.startsWith("P") && c.clasa !== "VII" && c.clasa !== "VIII"
  );
  const nrCapitole = capitoleLiceu.length;
  const nrModule = capitoleLiceu.reduce((acc, c) => acc + c.module.length, 0);
  const nrSublectii = nrModule * 6;
  // Gimnaziul are propriul bloc, separat de rezumatul de liceu de mai sus.
  const capitoleGimnaziu = capitole.filter((c) => c.clasa === "VII" || c.clasa === "VIII");
  const traseuGimnaziu = TRASEE.find((t) => t.id === "gimnaziu");

  return (
    <div className="min-h-screen text-[#172033]">
      <div className="page-shell max-w-6xl">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_0.7fr]">
          <div className="page-intro">
        <span className="eyebrow mb-4">Liceu · clasele IX–XII</span>
        <h1 className="text-4xl font-black leading-[1.03] text-[#172033] sm:text-6xl [font-family:var(--font-fraunces)]">
          Curriculum complet de Informatică
        </h1>
        <p className="mt-5 max-w-2xl text-[#5F6673] font-medium leading-relaxed sm:text-lg">
          Structura cursului pentru clasele IX-XII, organizată ca{" "}
          <strong className="text-[#172033] font-bold">capitol → modul → sublecții</strong>. Fiecare modul urmează același șablon de 6 sublecții interactive.
        </p>
          </div>

        <div className="border-l border-black/15 pl-6 text-xs sm:text-sm text-[#172033]">
          <p className="font-extrabold text-[#2F6191] text-sm mb-2">
            Reperele folosite pentru structură
          </p>
          <p className="leading-relaxed text-[#5F6673]">
            Temele urmează programele școlare de Informatică pentru liceu aprobate prin OMEC nr. 6930/19.12.2025 și Ordinul nr. 4.370/2026. Ordinea de la clasă poate diferi. Platforma nu este un material oficial al Ministerului Educației; pentru documentele oficiale, consultă{" "}
            <a href="https://www.edu.ro" className="font-semibold underline underline-offset-2" rel="noopener">edu.ro</a>.
          </p>
        </div></div>

        {/* Statistici rapide */}
        <dl className="mt-14 grid grid-cols-3 border-y border-black/10">
          {[
            ["Capitole", nrCapitole],
            ["Module", nrModule],
            ["Sublecții", nrSublectii],
          ].map(([eticheta, valoare]) => (
            <div
              key={String(eticheta)}
              className="border-r border-black/10 px-3 py-6 text-left last:border-r-0 sm:px-6"
            >
              <dt className="text-[10px] font-extrabold uppercase tracking-widest text-[#5F6673]">{eticheta}</dt>
              <dd className="mt-1 text-3xl font-black text-[#C6780B] sm:text-4xl [font-family:var(--font-fraunces)]">{valoare}</dd>
            </div>
          ))}
        </dl>

        {/* Șablonul lecțiilor */}
        <section className="mt-20 grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <span className="eyebrow">Cum înveți</span>
            <h2 className="mt-4 text-3xl font-black leading-tight text-[#172033] [font-family:var(--font-fraunces)]">Cei 6 pași ai unei lecții</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5F6673]">Aceeași structură clară în fiecare modul, ca să știi mereu unde ești și ce urmează.</p>
          </div>
          <ol className="border-t border-black/10">
            {structura.sablon_sublectii.map((s, i) => (
              <li
                key={s.titlu}
                className="grid grid-cols-[3rem_1fr] gap-3 border-b border-black/10 py-4"
              >
                <span className="font-mono text-xs font-black text-[#C6780B]">0{i + 1}</span>
                <div><p className="font-bold text-[#172033] text-sm">{s.titlu}</p>
                <p className="mt-1 text-sm text-[#5F6673]">{s.descriere}</p></div>
              </li>
            ))}
          </ol>
        </section>

        {/* Gimnaziu (VII–VIII): programă proprie, deci bloc separat de liceu */}
        <section className="mt-24" aria-labelledby="gimnaziu-titlu">
          <div className="mb-8 max-w-xl">
            <span className="eyebrow">Gimnaziu · clasele VII–VIII</span>
            <h2 id="gimnaziu-titlu" className="mt-4 text-3xl font-black [font-family:var(--font-fraunces)]">
              Începi de la zero? Gimnaziul e gratuit
            </h2>
            {traseuGimnaziu && (
              <p className="mt-3 text-sm leading-relaxed text-[#5F6673]">
                {traseuGimnaziu.public} {traseuGimnaziu.gratuit}
              </p>
            )}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {capitoleGimnaziu.map((c) => (
              <article key={c.clasa} className="surface-card p-6">
                <p className="text-xs font-black uppercase tracking-wider text-amber-600">{numeClasa(c.clasa)}</p>
                <h3 className="mt-1 text-xl font-black text-[#1E2430]">{c.titlu}</h3>
                <p className="mt-1 text-xs font-medium text-[#525B6C]">
                  {c.module.length} module · {c.module.length * 6} sublecții · gratuit
                </p>
                <ul className="mt-3 space-y-1 text-sm">
                  {c.module.map((m) => (
                    <li key={m.slug}>
                      <Link href={`/curriculum/${c.clasa}/${m.slug}`} className="text-[#2F6191] underline-offset-2 hover:underline">
                        {m.titlu}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={`/curriculum/${c.clasa}`} className="primary-action mt-4 inline-flex text-xs">
                  Vezi modulele pentru {numeClasaInText(c.clasa)} →
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Lista capitolelor IX - XII */}
        <section className="mt-24 space-y-5">
          <div className="mb-8 max-w-xl">
            <span className="eyebrow">Clasele IX–XII</span>
            <h2 className="mt-4 text-3xl font-black [font-family:var(--font-fraunces)]">Alege clasa și continuă de unde ai rămas</h2>
          </div>
          {capitoleLiceu.map((c) => (
            <article
              key={c.clasa}
              className="surface-card p-6 sm:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-amber-600">
                    Capitolul {c.numar} · {numeClasa(c.clasa)}
                  </p>
                  <h3 className="mt-1 text-xl font-black text-[#1E2430]">{c.titlu}</h3>
                  <p className="mt-1 text-xs text-[#525B6C] font-medium">
                    {c.module.length} module · {c.module.length * 6} sublecții
                  </p>
                </div>
                <Link
                  href={`/curriculum/${c.clasa}`}
                    className="primary-action text-xs"
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
