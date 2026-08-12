import Link from "next/link";
import type { UnitateDrum } from "@/lib/progres";

const STIL_NOD = {
  finalizat: {
    cerc: "bg-success text-white border-success",
    text: "text-foreground",
  },
  curent: {
    cerc: "bg-white text-brand border-brand ring-4 ring-brand/20",
    text: "text-foreground font-semibold",
  },
  blocat: {
    cerc: "bg-surface text-locked border-locked/60",
    text: "text-foreground/45",
  },
} as const;

/**
 * Drumul de învățare: unitățile clasei ca secțiuni, lecțiile ca noduri
 * conectate. Nodurile blocate rămân VIZIBILE (elevul vede ce urmează), dar
 * sunt vizual retrase și nu sunt linkuri active de tip „next step”.
 */
export default function DrumInvatare({
  unitati,
  clasa,
}: {
  unitati: UnitateDrum[];
  clasa: string;
}) {
  if (!unitati.length) {
    return (
      <p className="rounded-2xl border border-black/5 bg-surface p-6 text-sm text-foreground/60">
        Nu există încă lecții publicate pentru clasa {clasa}.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {unitati.map((u, idxUnitate) => (
        <section key={u.unitate_slug}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
              Unitatea {idxUnitate + 1} · {u.unitate}
            </h3>
            <span className="text-xs font-medium text-foreground/50">
              {u.procentFinalizat}% finalizat
            </span>
          </div>

          <div
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface"
            role="progressbar"
            aria-valuenow={u.procentFinalizat}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progres unitatea ${u.unitate}`}
          >
            <div
              className="h-full rounded-full bg-success transition-all"
              style={{ width: `${u.procentFinalizat}%` }}
            />
          </div>

          <ol className="mt-5 flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-0">
            {u.noduri.map((nod, idx) => {
              const stil = STIL_NOD[nod.stare];
              const eticheta =
                nod.stare === "finalizat"
                  ? "finalizată"
                  : nod.stare === "curent"
                    ? "lecția curentă"
                    : "nu a fost deblocată încă";

              const cerc = (
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold shadow-sm transition ${stil.cerc}`}
                  aria-hidden="true"
                >
                  {nod.stare === "finalizat" ? "✓" : nod.stare === "blocat" ? "🔒" : idx + 1}
                </span>
              );

              return (
                <li
                  key={nod.lectie.lectie_slug}
                  className="flex items-center gap-3 sm:flex-1 sm:flex-col sm:gap-2 sm:text-center"
                >
                  <div className="flex items-center gap-0 sm:w-full sm:justify-center">
                    {idx > 0 && (
                      <span className="linie-drum hidden h-[3px] flex-1 sm:block" aria-hidden="true" />
                    )}
                    {nod.stare === "blocat" ? (
                      cerc
                    ) : (
                      <Link
                        href={nod.href}
                        className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                        aria-label={`${nod.lectie.lectie} — ${eticheta}`}
                      >
                        {cerc}
                      </Link>
                    )}
                    {idx < u.noduri.length - 1 && (
                      <span className="linie-drum hidden h-[3px] flex-1 sm:block" aria-hidden="true" />
                    )}
                  </div>

                  <span className={`text-xs leading-snug sm:px-1 ${stil.text}`}>
                    {nod.lectie.lectie}
                    <span className="sr-only"> — {eticheta}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
