import Link from "next/link";
import Mascota from "@/components/Mascota";
import DrumInvatare from "@/components/DrumInvatare";
import {
  CardContinua,
  CardInsigne,
  CardNivel,
  CardProvocare,
  CardStreak,
} from "@/components/CarduriProgres";
import {
  construiesteDrum,
  provocareaZilei,
  urmatoareaLectie,
  type ProgresUtilizator,
} from "@/lib/progres";

const CLASE = ["IX", "X", "XI", "XII"] as const;

/**
 * Ecranul „Acasă” pentru utilizator autentificat: drumul de învățare e
 * elementul dominant, iar streak/XP sunt secundare ca ierarhie vizuală —
 * conținutul rămâne scopul, progresia e doar feedback.
 */
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
  const totalLectii = unitati.reduce((s, u) => s + u.noduri.length, 0);
  const finalizateClasa = unitati.reduce(
    (s, u) => s + u.noduri.filter((n) => n.stare === "finalizat").length,
    0
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-brand-light/50 p-6">
        <div className="flex items-center gap-4">
          <Mascota size={72} eticheta="Py, mascota Academiei Python" />
          <div>
            <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
              Bună, {prenume}! <span aria-hidden="true">👋</span>
            </h1>
            <p className="mt-1 text-sm text-foreground/65">
              {finalizateClasa === 0
                ? "Hai să pornim primul pas pe drumul tău de Python."
                : `Ai finalizat ${finalizateClasa} din ${totalLectii} lecții la clasa ${clasaSelectata}.`}
            </p>
          </div>
        </div>

        <nav aria-label="Alege clasa" className="flex flex-wrap gap-2">
          {CLASE.map((c) => (
            <Link
              key={c}
              href={`/?clasa=${c}`}
              aria-current={c === clasaSelectata ? "page" : undefined}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                c === clasaSelectata
                  ? "bg-brand text-white shadow-sm"
                  : "bg-white text-foreground/70 hover:text-brand"
              }`}
            >
              Clasa {c}
            </Link>
          ))}
        </nav>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="order-2 lg:order-1">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            Drumul tău de învățare
          </h2>
          <p className="mt-1 text-sm text-foreground/60">
            Fiecare cerc e o lecție. Verde = finalizată, evidențiat = pasul tău
            următor, lacăt = urmează mai încolo.
          </p>

          <div className="mt-6 rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-7">
            <DrumInvatare unitati={unitati} clasa={clasaSelectata} />
          </div>
        </div>

        <aside className="order-1 space-y-4 lg:order-2">
          {urmatoarea ? (
            <CardContinua
              href={`/lectii/${urmatoarea.clasa}/${urmatoarea.unitate_slug}/${urmatoarea.lectie_slug}`}
              titlu={urmatoarea.lectie}
              unitate={urmatoarea.unitate}
            />
          ) : (
            <div className="rounded-2xl border border-success/30 bg-success/10 p-5">
              <p className="text-sm font-semibold text-foreground">
                Ai terminat tot ce e publicat la clasa {clasaSelectata}. 🎉
              </p>
              <Link href="/lectii" className="mt-2 inline-flex text-sm font-semibold text-brand">
                Vezi celelalte clase →
              </Link>
            </div>
          )}

          <CardNivel xpTotal={progres.xpTotal} />
          <CardStreak zile={progres.streakZile} />

          {provocare && (
            <CardProvocare
              intrebare={provocare.intrebare.intrebare}
              xp={provocare.xp}
              href={`/lectii/${provocare.lectie.clasa}/${provocare.lectie.unitate_slug}/${provocare.lectie.lectie_slug}`}
            />
          )}

          <CardInsigne insigne={progres.insigne} />
        </aside>
      </div>
    </div>
  );
}
