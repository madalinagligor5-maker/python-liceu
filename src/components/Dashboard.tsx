import Link from "next/link";
import Mascota from "@/components/Mascota";
import SidebarDashboard from "@/components/SidebarDashboard";
import PasiDrum from "@/components/PasiDrum";
import DrumInvatare from "@/components/DrumInvatare";
import {
  CardCitat,
  CardClasament,
  CardProvocareZilei,
  CardStreakSaptamana,
  type RandClasament,
} from "@/components/PanouDreapta";
import {
  construiesteDrum,
  nivelDinXp,
  provocareaZilei,
  urmatoareaLectie,
  type ProgresUtilizator,
} from "@/lib/progres";

const CLASE = ["IX", "X", "XI", "XII"] as const;

export default function Dashboard({
  prenume,
  progres,
  clasaSelectata,
}: {
  prenume: string;
  progres: ProgresUtilizator;
  clasaSelectata: string;
}) {
  const unitati = construiesteDrum(clasaSelectata, progres.lectiiFinalizate);
  const urmatoarea = urmatoareaLectie(clasaSelectata, progres.lectiiFinalizate);
  const provocare = provocareaZilei(progres.lectiiFinalizate);
  const nivel = nivelDinXp(progres.xpTotal);

  // Clasamentul public nu e activat (ar expune date ale altor elevi, minori).
  // Afișăm doar poziția utilizatorului, fără concurenți inventați.
  const clasament: RandClasament[] = [
    { nume: prenume, xp: progres.xpTotal, esteUtilizatorul: true },
  ];

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:gap-6 lg:px-0 lg:py-0">
      <SidebarDashboard prenume={prenume} xpTotal={progres.xpTotal} />

      <div className="min-w-0 flex-1 lg:py-6 lg:pr-6">
        {/* Bara de sus: salut, căutare, statistici */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
              Bună, {prenume}! <span aria-hidden="true">👋</span>
            </h1>
            <p className="text-sm text-muted">Ce vei învăța azi?</p>
          </div>

          <form action="/lectii" className="lg:w-72">
            <label htmlFor="caut" className="sr-only">
              Caută lecții, concepte, exerciții
            </label>
            <input
              id="caut"
              name="q"
              type="search"
              placeholder="🔍 Caută lecții, concepte, exerciții…"
              className="w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-foreground placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </form>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase text-muted">Streak</p>
              <p className="text-lg font-bold text-foreground">🔥 {progres.streakZile}</p>
            </div>
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase text-muted">XP</p>
              <p className="text-lg font-bold text-foreground">💎 {progres.xpTotal}</p>
            </div>
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase text-muted">Nivel</p>
              <p className="text-lg font-bold text-foreground">🔷 {nivel}</p>
            </div>
          </div>
        </header>

        <hr className="my-5 border-border" />

        <div className="grid gap-6 xl:grid-cols-[1fr_18rem]">
          {/* Coloana principală */}
          <div className="min-w-0">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-[20px] border border-brand-border bg-gradient-to-br from-[#fdf6e3] to-[#f6efdc] p-6 sm:p-8">
              {/* Decoruri din referința vizuală: cod, cafea, plantă. */}
              <span aria-hidden="true" className="pointer-events-none absolute left-4 top-3 text-2xl opacity-30">{"{}"}</span>
              <span aria-hidden="true" className="pointer-events-none absolute right-40 top-2 text-2xl opacity-20">&lt;/&gt;</span>
              <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-44 text-xl opacity-40">☕</span>
              <span aria-hidden="true" className="pointer-events-none absolute bottom-4 left-1/3 text-xl opacity-40">🪴</span>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
                    Învață <span className="text-brand">Python</span>.
                    <br />
                    Construiește viitorul tău.
                  </h2>
                  <p className="mt-3 max-w-xl text-sm text-brand-dark">
                    De la bazele programării până la proiecte reale, pas cu pas, prin exerciții
                    interactive.
                  </p>

                  {urmatoarea ? (
                    <Link
                      href={`/lectii/${urmatoarea.clasa}/${urmatoarea.unitate_slug}/${urmatoarea.lectie_slug}`}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
                    >
                      Continuă lecția <span aria-hidden="true">▶</span>
                    </Link>
                  ) : (
                    <p className="mt-5 text-sm font-semibold text-brand-dark">
                      Ai terminat tot conținutul publicat la clasa {clasaSelectata}. 🎉
                    </p>
                  )}
                </div>

                {/* Mascota lângă laptop + balon cu cod. */}
                <div className="relative hidden shrink-0 sm:block">
                  <Mascota size={104} />
                  <span
                    aria-hidden="true"
                    className="absolute -left-6 top-0 rounded-lg bg-white px-2 py-1 text-[10px] font-semibold text-brand-dark shadow-sm"
                  >
                    print(&quot;Hello, Python!&quot;)
                  </span>
                </div>
              </div>
            </section>

            {/* Selector de clasă */}
            <nav aria-label="Alege clasa" className="mt-6 flex flex-wrap gap-2">
              {CLASE.map((c) => (
                <Link
                  key={c}
                  href={`/?clasa=${c}`}
                  aria-current={c === clasaSelectata ? "page" : undefined}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    c === clasaSelectata
                      ? "bg-brand text-white shadow-sm"
                      : "border border-border bg-white text-foreground/70 hover:text-brand"
                  }`}
                >
                  Clasa {c}
                </Link>
              ))}
            </nav>

            {/* Drumul de învățare — pași pe unități */}
            <h2 className="mt-6 text-xl font-bold text-foreground">Drumul tău de învățare</h2>
            <div className="mt-4">
              <PasiDrum unitati={unitati} />
            </div>

            {/* Traseul detaliat, lecție cu lecție */}
            <h2 className="mt-8 text-xl font-bold text-foreground">Lecțiile pas cu pas</h2>
            <p className="mt-1 text-sm text-muted">
              Verde = finalizată, evidențiat = pasul următor, lacăt = urmează.
            </p>
            <div className="mt-4 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
              <DrumInvatare unitati={unitati} clasa={clasaSelectata} />
            </div>
          </div>

          {/* Coloana dreapta */}
          <aside className="space-y-4">
            <CardStreakSaptamana zile={progres.streakZile} />
            <CardCitat />
            <CardClasament randuri={clasament} />
            <CardProvocareZilei
              enunt={
                provocare
                  ? provocare.intrebare.intrebare
                  : "Termină prima lecție ca să primești provocări de recapitulare."
              }
              xp={provocare?.xp ?? 50}
              href={
                provocare
                  ? `/lectii/${provocare.lectie.clasa}/${provocare.lectie.unitate_slug}/${provocare.lectie.lectie_slug}`
                  : null
              }
            />

            {progres.insigne.length > 0 && (
              <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-foreground">
                  <span aria-hidden="true">🎖️</span> Insigne
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {progres.insigne.includes("predictie-reusita") && (
                    <li className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                      <span aria-hidden="true">🔮</span> Predicție
                    </li>
                  )}
                  {progres.insigne
                    .filter((s) => s !== "predictie-reusita")
                    .map((slug) => (
                      <li
                        key={slug}
                        className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark"
                      >
                        {slug.replaceAll("-", " ")}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
